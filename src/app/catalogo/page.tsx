import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getCurrentMember, hasActiveAccess } from "@/lib/member";
import { Header } from "@/components/Header";
import { NoAccess } from "@/components/NoAccess";
import { CategoryTabs } from "@/components/CategoryTabs";
import type { ReferencePhoto } from "@/lib/types";

const PLACEHOLDER_THUMB = "/placeholder-reference.svg";
const DATAS_TIPO_VALUE = "datas-comemorativas";
const TODOS_TIPO_VALUE = "todos";
const DEFAULT_TIPO = "Lifestyle";
const VOCE_MODELO_TIPO = "Peças em Você";

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
  searchParams: Promise<{ tipo?: string }>;
}) {
  const { email, member } = await getCurrentMember();

  if (!email) return null; // middleware já redireciona para /login

  if (!hasActiveAccess(member)) {
    return (
      <>
        <Header />
        <NoAccess email={email} />
      </>
    );
  }

  const { tipo } = await searchParams;
  const verDatas = tipo === DATAS_TIPO_VALUE;
  const verTodos = tipo === TODOS_TIPO_VALUE;
  // Sem filtro na URL, carrega só a Lifestyle por padrão — bem mais leve do
  // que trazer o catálogo inteiro de cara. As outras categorias só buscam
  // dados quando a pessoa clica no menu.
  const tipoAtivo = !tipo || verDatas || verTodos ? DEFAULT_TIPO : tipo;
  const supabase = await createClient();

  const base = () => supabase.from("reference_photos").select("*").eq("status", "aprovado");

  async function fetchRows(): Promise<ReferencePhoto[]> {
    if (verDatas) {
      const { data } = await base().eq("categoria", "data_comemorativa").order("ordem");
      return (data ?? []) as ReferencePhoto[];
    }
    if (verTodos) {
      // "Todos os tipos": evergreen inteiro + datas comemorativas inteiras, tudo aberto.
      const [evergreen, datas] = await Promise.all([
        base().eq("categoria", "evergreen").order("tipo_peca").order("ordem"),
        base().eq("categoria", "data_comemorativa").order("ordem"),
      ]);
      return [
        ...((evergreen.data ?? []) as ReferencePhoto[]),
        ...((datas.data ?? []) as ReferencePhoto[]),
      ];
    }
    const { data } = await base()
      .eq("categoria", "evergreen")
      .eq("tipo_peca", tipoAtivo)
      .order("ordem");
    return (data ?? []) as ReferencePhoto[];
  }

  const [rows, { data: filtrosData }] = await Promise.all([
    fetchRows(),
    supabase
      .from("reference_photos")
      .select("tipo_peca")
      .eq("status", "aprovado")
      .eq("categoria", "evergreen"),
  ]);

  const tipos = Array.from(new Set((filtrosData ?? []).map((r) => r.tipo_peca))).sort();

  const grupos = new Map<string, ReferencePhoto[]>();
  for (const r of rows) {
    const chave = r.categoria === "data_comemorativa" ? (r.data_comemorativa ?? "Outras datas") : r.tipo_peca;
    const grupo = grupos.get(chave) ?? [];
    grupo.push(r);
    grupos.set(chave, grupo);
  }

  return (
    <>
      <Header />

      <section className="hidden bg-brand-navy sm:block">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:py-14">
          <h1 className="flex flex-wrap items-center gap-3 text-3xl font-semibold text-white sm:text-4xl">
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

      <CategoryTabs
        tabs={[
          { label: "Todos os tipos", active: verTodos, href: `/catalogo?tipo=${TODOS_TIPO_VALUE}` },
          ...tipos.map((t) => ({
            label: t,
            active: !verDatas && !verTodos && tipoAtivo === t,
            href: `/catalogo?tipo=${encodeURIComponent(t)}`,
          })),
          {
            label: "Datas Comemorativas",
            active: verDatas,
            href: `/catalogo?tipo=${DATAS_TIPO_VALUE}`,
          },
        ]}
      />

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
              {tipoPeca === VOCE_MODELO_TIPO && (
                <p className="mx-auto mt-4 w-fit rounded-full border border-brand-gold bg-brand-navy/5 px-4 py-1.5 text-center text-[11px] font-bold tracking-wide text-brand-navy uppercase">
                  📎 Anexe 2 fotos: FOTO 1 (você) + FOTO 2 (sua joia)
                </p>
              )}
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
          {r.data_comemorativa ? `${r.tipo_peca} — ${r.pose}` : r.pose}
        </p>
        <p className="mt-0.5 text-[11px] text-white/85">Clique para gerar sua foto</p>
      </div>
    </Link>
  );
}

