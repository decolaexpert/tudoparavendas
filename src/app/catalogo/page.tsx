import { createClient } from "@/lib/supabase/server";
import { getCurrentMember, hasActiveAccess } from "@/lib/member";
import { Header } from "@/components/Header";
import { NoAccess } from "@/components/NoAccess";
import { CategoryTabs } from "@/components/CategoryTabs";
import { CatalogGrid } from "@/components/CatalogGrid";
import type { ReferencePhoto } from "@/lib/types";

const DATAS_TIPO_VALUE = "datas-comemorativas";
const TODOS_TIPO_VALUE = "todos";
const DEFAULT_TIPO = "Lifestyle";

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
          <CatalogGrid groups={Array.from(grupos.entries())} />
        )}
      </main>
    </>
  );
}
