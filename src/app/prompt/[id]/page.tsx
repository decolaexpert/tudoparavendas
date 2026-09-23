import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMember, hasActiveAccess } from "@/lib/member";
import { Header } from "@/components/Header";
import { NoAccess } from "@/components/NoAccess";
import { CopyPromptCard } from "@/components/CopyPromptCard";

const PLACEHOLDER_THUMB = "/placeholder-reference.svg";

export default async function GerarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { email, member } = await getCurrentMember();
  if (!email) return null;

  if (!hasActiveAccess(member)) {
    return (
      <>
        <Header email={email} />
        <NoAccess email={email} />
      </>
    );
  }

  const supabase = await createClient();
  const { data: reference } = await supabase
    .from("reference_photos")
    .select("*")
    .eq("id", id)
    .eq("status", "aprovado")
    .maybeSingle();

  if (!reference) notFound();

  return (
    <>
      <Header email={email} />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100">
              <Image
                src={reference.thumbnail_url || PLACEHOLDER_THUMB}
                alt={reference.nome_referencia}
                fill
                className="object-cover"
              />
            </div>
            <p className="mt-3 text-sm font-medium text-zinc-900">{reference.tipo_peca}</p>
            <p className="text-xs text-zinc-500">
              {reference.pose}
              {reference.data_comemorativa ? ` · ${reference.data_comemorativa}` : ""}
            </p>
          </div>

          <CopyPromptCard prompt={reference.prompt_mestre} />
        </div>
      </main>
    </>
  );
}
