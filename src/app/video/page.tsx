import { getCurrentMember, hasActiveAccess } from "@/lib/member";
import { Header } from "@/components/Header";
import { NoAccess } from "@/components/NoAccess";
import { VideoPromptForm } from "@/components/VideoPromptForm";

const PASSOS = [
  {
    numero: "1",
    titulo: "Preencha os campos",
    descricao: "Escolha as opções que combinam com a sua joia e com a modelo do vídeo.",
  },
  {
    numero: "2",
    titulo: "Gere o prompt personalizado",
    descricao: "Nosso gerador monta o prompt completo em poucos segundos.",
  },
  {
    numero: "3",
    titulo: "Cole no YouTube Create, Gemini ou Flow",
    descricao: "Junto com a foto da sua joia, pra gerar o vídeo pronto.",
  },
];

export default async function VideoPage() {
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

  return (
    <>
      <Header />

      <section className="hidden bg-brand-navy sm:block">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-10 sm:py-14">
          <h1 className="flex flex-wrap items-center gap-3 text-3xl font-semibold text-white sm:text-4xl">
            Vídeos profissionais de joias com IA para vender mais
            <span aria-hidden className="text-brand-gold">
              ✦
            </span>
          </h1>
          <p className="mt-2 text-sm tracking-[0.15em] text-white/70 uppercase">
            Prompts prontos para gerar vídeos com IA
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

      <VideoPromptForm />
    </>
  );
}
