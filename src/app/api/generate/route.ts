import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateJewelryPhoto } from "@/lib/gemini";
import { hasActiveAccess } from "@/lib/member";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const { data: member } = await supabase
    .from("members")
    .select("*")
    .eq("email", user.email)
    .maybeSingle();

  if (!hasActiveAccess(member)) {
    return NextResponse.json({ error: "no_active_subscription" }, { status: 403 });
  }

  const formData = await request.formData();
  const referenceId = formData.get("reference_id");
  const file = formData.get("photo");

  if (typeof referenceId !== "string" || !(file instanceof File)) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const { data: reference } = await supabase
    .from("reference_photos")
    .select("*")
    .eq("id", referenceId)
    .eq("status", "aprovado")
    .maybeSingle();

  if (!reference) {
    return NextResponse.json({ error: "reference_not_found" }, { status: 404 });
  }

  const admin = createAdminClient();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const inputPath = `${member!.id}/${crypto.randomUUID()}-${file.name}`;

  const { error: uploadError } = await admin.storage
    .from("uploads")
    .upload(inputPath, bytes, { contentType: file.type });

  if (uploadError) {
    console.error("[generate] falha no upload", uploadError);
    return NextResponse.json({ error: "upload_failed" }, { status: 500 });
  }

  const { data: inputPublicUrl } = admin.storage.from("uploads").getPublicUrl(inputPath);

  const { data: generation, error: insertError } = await admin
    .from("generations")
    .insert({
      member_id: member!.id,
      reference_photo_id: reference.id,
      input_image_url: inputPublicUrl.publicUrl,
      status: "pending",
    })
    .select()
    .single();

  if (insertError || !generation) {
    console.error("[generate] falha ao criar generation", insertError);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  try {
    const base64 = Buffer.from(bytes).toString("base64");
    const result = await generateJewelryPhoto({
      prompt: reference.prompt_mestre,
      imageBase64: base64,
      mimeType: file.type,
    });

    const outputPath = `${member!.id}/${generation.id}.png`;
    const outputBytes = Buffer.from(result.imageBase64, "base64");

    await admin.storage.from("generated").upload(outputPath, outputBytes, {
      contentType: result.mimeType,
    });

    const { data: outputPublicUrl } = admin.storage.from("generated").getPublicUrl(outputPath);

    await admin
      .from("generations")
      .update({ status: "done", output_image_url: outputPublicUrl.publicUrl })
      .eq("id", generation.id);

    return NextResponse.json({
      id: generation.id,
      output_image_url: outputPublicUrl.publicUrl,
    });
  } catch (err) {
    console.error("[generate] falha na geração", err);
    await admin
      .from("generations")
      .update({
        status: "failed",
        error_message: err instanceof Error ? err.message : "erro desconhecido",
      })
      .eq("id", generation.id);

    return NextResponse.json({ error: "generation_failed" }, { status: 500 });
  }
}
