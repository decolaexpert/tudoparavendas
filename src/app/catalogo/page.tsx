import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMember, hasActiveAccess } from "@/lib/member";
import { Header } from "@/components/Header";
import { NoAccess } from "@/components/NoAccess";
import type { ReferencePhoto } from "@/lib/types";

const PLACEHOLDER_THUMB = "/placeholder-reference.svg";

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string; data?: string }>;
}) {
  const { email, member } = await getCurrentMember();

  if (!email) return null; // middleware já redireciona para /login

  if (!hasActiveAccess(member)) {
    return (
      <>
        <Header email={email} />
        <NoAccess email={email} />
      </>
    );
  }

  const { tipo, data } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("reference_photos")
    .select("*")
    .eq("status", "aprovado")
    .order("categoria")
    .order("tipo_peca")
    .order("ordem");

  if (tipo) query = query.eq("tipo_peca", tipo);
  if (data) query = query.eq("data_comemorativa", data);

  const { data: references } = await query;
  const rows = (references ?? []) as ReferencePhoto[];

  const { data: filtrosData } = await supabase
    .from("reference_photos")
    .select("tipo_peca, data_comemorativa")
    .eq("status", "aprovado");

  const tipos = Array.from(new Set((filtrosData ?? []).map((r) => r.tipo_peca))).sort();
  const datas = Array.from(
    new Set((filtrosData ?? []).map((r) => r.data_comemorativa).filter(Boolean)),
  ).sort() as string[];

  return (
    <>
      <Header email={email} />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-zinc-900">Catálogo de estilos</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Escolha o estilo de foto e envie a foto da sua peça real na próxima etapa.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <FilterLink label="Todos os tipos" active={!tipo} href="/catalogo" />
          {tipos.map((t) => (
            <FilterLink
              key={t}
              label={t}
              active={tipo === t}
              href={`/catalogo?tipo=${encodeURIComponent(t)}`}
            />
          ))}
        </div>

        {datas.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            <FilterLink label="Todas as datas" active={!data} href="/catalogo" subtle />
            {datas.map((d) => (
              <FilterLink
                key={d}
                label={d}
                active={data === d}
                href={`/catalogo?data=${encodeURIComponent(d)}`}
                subtle
              />
            ))}
          </div>
        )}

        {rows.length === 0 ? (
          <p className="mt-16 text-center text-sm text-zinc-400">
            Nenhuma referência aprovada ainda com esse filtro. Assim que o time aprovar
            fotos-mestre no painel de conteúdo, elas aparecem aqui.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {rows.map((r) => (
              <Link
                key={r.id}
                href={`/prompt/${r.id}`}
                className="group overflow-hidden rounded-xl border border-zinc-200 bg-white transition hover:shadow-md"
              >
                <div className="relative aspect-square w-full bg-zinc-100">
                  <Image
                    src={r.thumbnail_url || PLACEHOLDER_THUMB}
                    alt={r.nome_referencia}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-zinc-900">{r.tipo_peca}</p>
                  <p className="text-xs text-zinc-500">
                    {r.pose}
                    {r.data_comemorativa ? ` · ${r.data_comemorativa}` : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

function FilterLink({
  label,
  href,
  active,
  subtle,
}: {
  label: string;
  href: string;
  active: boolean;
  subtle?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "rounded-full px-3 py-1.5 text-xs font-medium transition",
        active
          ? "bg-zinc-900 text-white"
          : subtle
            ? "bg-white text-zinc-500 ring-1 ring-zinc-200 hover:bg-zinc-50"
            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}
