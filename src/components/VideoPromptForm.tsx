"use client";

import { useState } from "react";
import {
  FIELD_GROUPS,
  FALA_FIELD_ID,
  VOZ_FIELD_ID,
  ESTILO_APRESENTACAO_FIELD_ID,
  buildVideoPrompt,
} from "@/lib/videoPromptTemplate";

const GERANDO_MENSAGENS = [
  "Analisando suas joias... 💎",
  "Ajustando a iluminação perfeita... ✨",
  "Preparando a cena...",
  "Afinando os detalhes do vídeo...",
  "Escolhendo o melhor ângulo de câmera...",
  "Quase lá...",
];

const DURACAO_GERANDO_MS = 2400;
const INTERVALO_GERANDO_MS = 60;

function buildDefaultValues(): Record<string, string> {
  const values: Record<string, string> = {};
  for (const group of FIELD_GROUPS) {
    for (const field of group.fields) {
      values[field.id] = field.options[0].value;
    }
  }
  return values;
}

function FieldTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        aria-label="Ajuda sobre este campo"
        className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-white text-[10px] font-bold text-brand-blue ring-1 ring-brand-blue"
      >
        ?
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-lg bg-brand-black px-3 py-2 text-left text-xs leading-snug font-normal text-white shadow-lg"
        >
          {text}
        </span>
      )}
    </span>
  );
}

export function VideoPromptForm() {
  const [values, setValues] = useState<Record<string, string>>(buildDefaultValues);
  const [fala, setFala] = useState("");
  const [comFala, setComFala] = useState(true);
  const [observacao, setObservacao] = useState("");
  const [faltaFala, setFaltaFala] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [mensagemIndex, setMensagemIndex] = useState(0);
  const [progresso, setProgresso] = useState(0);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  function handleSelect(fieldId: string, value: string) {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  }

  function handleGerar() {
    if (comFala && !fala.trim()) {
      setFaltaFala(true);
      return;
    }
    setFaltaFala(false);
    setPrompt(null);
    setGerando(true);
    setMensagemIndex(0);
    setProgresso(0);

    const inicio = Date.now();
    const timer = setInterval(() => {
      const decorrido = Date.now() - inicio;
      const pct = Math.min(100, Math.round((decorrido / DURACAO_GERANDO_MS) * 100));
      setProgresso(pct);
      setMensagemIndex(
        Math.min(
          GERANDO_MENSAGENS.length - 1,
          Math.floor((decorrido / DURACAO_GERANDO_MS) * GERANDO_MENSAGENS.length),
        ),
      );

      if (decorrido >= DURACAO_GERANDO_MS) {
        clearInterval(timer);
        const resultado = buildVideoPrompt(
          { ...values, [FALA_FIELD_ID]: fala },
          observacao,
          comFala,
        );
        setPrompt(resultado);
        setGerando(false);
      }
    }, INTERVALO_GERANDO_MS);
  }

  async function handleCopiar() {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // clipboard indisponível — a pessoa ainda pode copiar manualmente pela textarea
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="flex flex-col gap-8">
        {FIELD_GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="mb-3 text-sm font-bold tracking-wide text-brand-blue uppercase">
              {group.title}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {group.fields.map((field) => {
                const isFalaOnlyField =
                  field.id === VOZ_FIELD_ID || field.id === ESTILO_APRESENTACAO_FIELD_ID;
                if (isFalaOnlyField && !comFala) return null;
                return (
                  <label key={field.id} className="flex flex-col gap-1.5 text-sm">
                    <span className="flex items-center gap-1.5 font-medium text-zinc-700">
                      {field.label}
                      <FieldTooltip text={field.description} />
                    </span>
                    <select
                      value={values[field.id]}
                      onChange={(e) => handleSelect(field.id, e.target.value)}
                      className="cursor-pointer rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-brand-blue focus:outline-none"
                    >
                      {field.options.map((option) => (
                        <option key={option.label} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                );
              })}
            </div>
          </section>
        ))}

        <section>
          <h2 className="mb-3 text-sm font-bold tracking-wide text-brand-blue uppercase">
            Fala da modelo
          </h2>

          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={() => setComFala(true)}
              className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition ${
                comFala
                  ? "bg-brand-black text-white"
                  : "border border-zinc-300 text-zinc-600 hover:border-brand-blue"
              }`}
            >
              Com fala
            </button>
            <button
              type="button"
              onClick={() => {
                setComFala(false);
                setFaltaFala(false);
              }}
              className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition ${
                !comFala
                  ? "bg-brand-black text-white"
                  : "border border-zinc-300 text-zinc-600 hover:border-brand-blue"
              }`}
            >
              Sem fala
            </button>
          </div>

          {comFala && (
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="flex items-center gap-1.5 font-medium text-zinc-700">
                Fala exata — o que a modelo deve dizer
                <FieldTooltip text="A frase exata que a modelo deve falar no vídeo." />
              </span>
              <textarea
                value={fala}
                onChange={(e) => {
                  setFala(e.target.value);
                  if (e.target.value.trim()) setFaltaFala(false);
                }}
                rows={2}
                placeholder='Ex: "Gente, olha que linda essa peça que eu comprei!"'
                className={`resize-none rounded-lg border bg-white px-3 py-2 text-sm text-zinc-900 focus:outline-none ${
                  faltaFala ? "border-red-400 focus:border-red-400" : "border-zinc-300 focus:border-brand-blue"
                }`}
              />
              {faltaFala && (
                <span className="text-xs font-medium text-red-500">
                  Escreva a frase que a modelo deve falar no vídeo, ou escolha &quot;Sem fala&quot; acima.
                </span>
              )}
            </label>
          )}
        </section>

        <section>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-700">
              Observação adicional (opcional)
            </span>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={2}
              placeholder="Algo mais que queira adicionar ao prompt?"
              className="resize-none rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-brand-blue focus:outline-none"
            />
          </label>
        </section>

        <button
          onClick={handleGerar}
          disabled={gerando}
          className="cursor-pointer rounded-lg bg-brand-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue disabled:cursor-default disabled:opacity-70"
        >
          {gerando ? "Gerando..." : "Gerar prompt personalizado"}
        </button>

      </div>

      {prompt && !gerando && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPrompt(null)}
        >
          <div
            className="relative flex w-full max-w-xl flex-col gap-4 rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPrompt(null)}
              aria-label="Fechar"
              className="absolute top-3 right-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-brand-blue text-white shadow hover:opacity-90"
            >
              ✕
            </button>

            <p className="pr-8 text-sm font-medium text-emerald-700">
              {copiado ? "Prompt copiado! ✓" : "Prompt pronto! ✨"}
            </p>
            <textarea
              readOnly
              value={prompt}
              rows={12}
              className="w-full resize-none rounded-lg border border-zinc-300 bg-zinc-50 p-3 text-xs text-zinc-700"
            />
            <button
              onClick={handleCopiar}
              className="cursor-pointer rounded-lg bg-brand-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-blue"
            >
              {copiado ? "Prompt copiado! ✓" : "Copiar prompt"}
            </button>
            <p className="text-xs text-zinc-500">
              Copie o prompt, cole no Flow, Gemini, YouTube Create ou em outra IA de geração de
              vídeo. Anexe a foto da sua joia e veja a mágica acontecer!
            </p>
          </div>
        </div>
      )}

      {gerando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl bg-brand-navy px-8 py-10 text-center shadow-xl">
            <span className="animate-spin text-5xl text-brand-gold" aria-hidden>
              ✦
            </span>
            <p className="text-sm font-medium text-white">{GERANDO_MENSAGENS[mensagemIndex]}</p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-brand-gold transition-all"
                style={{ width: `${progresso}%` }}
              />
            </div>
            <p className="text-xs font-semibold tracking-wide text-brand-gold">
              {progresso}% concluído
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
