import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Endpoint de retorno do magic link enviado por e-mail (Supabase Auth).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") ?? "/catalogo";

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);

    // Sessão única por conta: registra essa sessão como a válida — o proxy
    // derruba qualquer sessão anterior com um session_id diferente.
    const { data: claimsData } = await supabase.auth.getClaims();
    const claims = claimsData?.claims;

    if (claims?.email && claims?.session_id) {
      const admin = createAdminClient();
      await admin
        .from("members")
        .update({ active_session_id: claims.session_id })
        .eq("email", claims.email.toLowerCase().trim());
    }
  }

  return NextResponse.redirect(`${origin}${redirect}`);
}
