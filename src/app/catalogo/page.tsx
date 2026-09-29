import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMember, hasActiveAccess } from "@/lib/member";
import { Header } from "@/components/Header";
import { NoAccess } from "@/components/NoAccess";
import type { ReferencePhoto } from "@/lib/types";

const PLACEHOLDER_THUMB = "/placeholder-reference.svg";

const PASSOS = [
  {
    numero: "1",
    titulo: "Escolha uma foto",
    descricao: "Navegue pelo catálogo e clique na referência que combina com a sua peça.",
  },
  {
    numero: "2",
    titulo: "Cole no ChatGPT ou Gemini",
    descricao: "Copie o prompt e cole junto com a foto original da sua joia.",
  },
  {
    numero: "3",
    titulo: "Baixe sua foto pronta",
    descricao: "A IA gera a imagem profissional em segundos, sem alterar a peça.",
  },
];

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

  const [{ data: references }, { data: filtrosData }] = await Promise.all([
    query,
    supabase.from("reference_photos").select("tipo_peca, data_comemorativa").eq("status", "aprovado"),
  ]);
  const rows = (references ?? []) as ReferencePhoto[];

  const tipos = Array.from(new Set((filtrosData ?? []).map((r) => r.tipo_peca))).sort();
  const datas = Array.from(
    new Set((filtrosData ?? []).map((r) => r.data_comemorativa).filter(Boolean)),
  ).sort() as string[];

  const grupos = new Map<string, ReferencePhoto[]>();
  for (const r of rows) {
    const grupo = grupos.get(r.tipo_peca) ?? [];
    grupo.push(r);
    grupos.set(r.tipo_peca, grupo);
  }

  return (
    <>
      <Header email={email} />

      <section className="bg-brand-navy">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:py-14">
          <p className="text-xs font-bold tracking-[0.3em] text-brand-gold uppercase">
            Photo Studio TPV
          </p>
          <h1 className="mt-3 flex flex-wrap items-center gap-3 text-3xl font-semibold text-white sm:text-4xl">
            Fotos profissionais para suas joias
            <span aria-hidden className="text-brand-gold">
              ✦
            </span>
          </h1>
          <p className="mt-2 text-sm tracking-[0.15em] text-white/70 uppercase">
            Prompts prontos para gerar fotos com IA
          </p>

          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
            {PASSOS.map((passo) => (
              <div key={passo.numero} className="flex items-start gap-3 bg-brand-navy px-5 py-5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-brand-gold text-xs font-bold text-brand-gold">
                  {passo.numero}
                </span>
                <div>
                  <p className="text-sm font-bold tracking-wide text-white uppercase">
                    {passo.titulo}
                  </p>
                  <p className="mt-0.5 text-xs text-white/60">{passo.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-[1400px] gap-1 overflow-x-auto px-4">
          <TabLink label="Todos os tipos" active={!tipo} href="/catalogo" />
          {tipos.map((t) => (
            <TabLink
              key={t}
              label={t}
              active={tipo === t}
              href={`/catalogo?tipo=${encodeURIComponent(t)}`}
            />
          ))}
        </div>

        {datas.length > 0 && (
          <div className="mx-auto flex w-full max-w-[1400px] flex-wrap gap-2 px-4 pb-3">
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
      </div>

      <main className="mx-auto w-full max-w-[1400px] px-4 py-8">
        {rows.length === 0 ? (
          <p className="mt-16 text-center text-sm text-zinc-400">
            Nenhuma referência aprovada ainda com esse filtro. Assim que o time aprovar
            fotos-mestre no painel de conteúdo, elas aparecem aqui.
          </p>
        ) : (
          Array.from(grupos.entries()).map(([tipoPeca, itens]) => (
            <section key={tipoPeca} className="mt-12">
              <SectionDivider label={tipoPeca} />
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                {itens.map((r) => (
                  <ReferenceCard key={r.id} reference={r} />
                ))}
              </div>
            </section>
          ))
        )}
      </main>
    </>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-x-0 top-1/2 h-px bg-zinc-200" />
      <span className="relative bg-white px-4 text-sm font-bold tracking-[0.2em] text-brand-black uppercase">
        {label}
      </span>
    </div>
  );
}

function ReferenceCard({ reference: r }: { reference: ReferencePhoto }) {
  return (
    <Link
      href={`/prompt/${r.id}`}
      className="group block cursor-pointer overflow-hidden rounded-xl border border-zinc-200 bg-white transition hover:shadow-lg"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100">
        <Image
          src={r.thumbnail_url || PLACEHOLDER_THUMB}
          alt={r.nome_referencia}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1280px) 25vw, 20vw"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        />
      </div>
      <div className="flex min-h-[72px] flex-col justify-center bg-brand-blue px-3 py-2.5 text-center">
        <p className="text-xs font-bold tracking-wide text-white uppercase">
          {r.pose}
          {r.data_comemorativa ? ` · ${r.data_comemorativa}` : ""}
        </p>
        <p className="mt-0.5 text-[11px] text-white/85">Clique para gerar sua foto</p>
      </div>
    </Link>
  );
}

function TabLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={[
        "shrink-0 cursor-pointer border-b-2 px-3 py-3 text-xs font-bold whitespace-nowrap tracking-wide uppercase transition",
        active
          ? "border-brand-gold text-brand-navy"
          : "border-transparent text-zinc-400 hover:text-brand-navy",
      ].join(" ")}
    >
      {label}
    </Link>
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
        "cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition",
        active
          ? "bg-brand-blue text-white"
          : subtle
            ? "bg-white text-zinc-500 ring-1 ring-zinc-200 hover:bg-zinc-50"
            : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}
