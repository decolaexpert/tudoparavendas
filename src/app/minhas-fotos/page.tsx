import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMember, hasActiveAccess } from "@/lib/member";
import { Header } from "@/components/Header";
import { NoAccess } from "@/components/NoAccess";

export default async function MinhasFotosPage() {
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
  const { data: generations } = await supabase
    .from("generations")
    .select("*, reference_photos(tipo_peca, pose)")
    .eq("member_id", member!.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <Header email={email} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-zinc-900">Minhas fotos</h1>

        {!generations || generations.length === 0 ? (
          <p className="mt-16 text-center text-sm text-zinc-400">
            Você ainda não gerou nenhuma foto. Vá até o catálogo e escolha um estilo.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {generations.map((g) => (
              <div key={g.id} className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                <div className="relative aspect-square w-full bg-zinc-100">
                  {g.output_image_url ? (
                    <Image src={g.output_image_url} alt="Foto gerada" fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                      {g.status === "pending" ? "Processando..." : "Falhou"}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs text-zinc-500">
                    {new Date(g.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
