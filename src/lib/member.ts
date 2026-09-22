import { createClient } from "@/lib/supabase/server";
import type { Member } from "@/lib/types";

/**
 * Retorna o usuário logado (via Supabase Auth) + o registro correspondente
 * em `members` (criado/atualizado pelo webhook do Hotmart). Se a pessoa
 * autenticou mas nunca comprou, `member` vem null — a UI deve tratar esse
 * caso mostrando "acesso não encontrado".
 */
export async function getCurrentMember(): Promise<{
  email: string | null;
  member: Member | null;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { email: null, member: null };
  }

  const { data: member } = await supabase
    .from("members")
    .select("*")
    .eq("email", user.email)
    .maybeSingle();

  return { email: user.email, member: member ?? null };
}

export function hasActiveAccess(member: Member | null): boolean {
  return member?.status === "active";
}
