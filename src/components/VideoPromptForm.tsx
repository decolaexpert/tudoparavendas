"use client";

import { useState } from "react";
import {
  FIELD_GROUPS,
  FALA_FIELD_ID,
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

function buildDefaultValues(): Record<string, string> {
  const values: Record<string, string> = {};
  for (const group of FIELD_GROUPS) {
    for (const field of group.fields) {
      values[field.id] = field.options[0].value;
    }
  }
  return values;
}

export function VideoPromptForm() {
  const [values, setValues] = useState<Record<string, string>>(buildDefaultValues);
  const [fala, setFala] = useState("");
  const [observacao, setObservacao] = useState("");
  const [faltaFala, setFaltaFala] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [mensagemIndex, setMensagemIndex] = useState(0);
  const [prompt, setPrompt] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);

  function handleSelect(fieldId: string, value: string) {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  }

  function handleGerar() {
    if (!fala.trim()) {
      setFaltaFala(true);
      return;
    }
    setFaltaFala(false);
    setPrompt(null);
    setGerando(true);
    setMensagemIndex(0);

    let i = 0;
    const totalPassos = GERANDO_MENSAGENS.length;
    const intervalo = setInterval(() => {
      i += 1;
      if (i >= totalPassos) {
        clearInterval(intervalo);
        const resultado = buildVideoPrompt({ ...values, [FALA_FIELD_ID]: fala }, observacao);
        setPrompt(resultado);
        setGerando(false);
        return;
      }
      setMensagemIndex(i);
    }, 420);
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
      <div className="mb-8">
        <h1 className="flex flex-wrap items-center gap-2 text-2xl font-semibold text-brand-black sm:text-3xl">
          Studio Video
          <span aria-hidden className="text-brand-gold">
            ✦
          </span>
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Preencha os campos abaixo pra gerar o prompt do seu vídeo UGC de 8 segundos.
          Depois cole no YouTube Create, Gemini, Flow ou similar, junto com a foto da sua joia.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {FIELD_GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="mb-3 text-sm font-bold tracking-wide text-brand-blue uppercase">
              {group.title}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {group.fields.map((field) => (
                <label key={field.id} className="flex flex-col gap-1.5 text-sm">
                  <span className="font-medium text-zinc-700">{field.label}</span>
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
              ))}
            </div>
          </section>
        ))}

        <section>
          <h2 className="mb-3 text-sm font-bold tracking-wide text-brand-blue uppercase">
            Fala da modelo
          </h2>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-zinc-700">
              Fala exata — o que a modelo deve dizer
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
                Escreva a frase que a modelo deve falar no vídeo.
              </span>
            )}
          </label>
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

        {gerando && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-brand-gold/30 bg-brand-navy px-6 py-10 text-center">
            <span className="animate-spin text-4xl text-brand-gold" aria-hidden>
              ✦
            </span>
            <p className="text-sm font-medium text-white">{GERANDO_MENSAGENS[mensagemIndex]}</p>
          </div>
        )}

        {prompt && !gerando && (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <p className="mb-3 text-sm font-medium text-emerald-700">
              {copiado ? "Prompt copiado! ✓" : "Prompt pronto! ✨"}
            </p>
            <textarea
              readOnly
              value={prompt}
              rows={14}
              className="w-full resize-none rounded-lg border border-zinc-300 bg-white p-3 text-xs text-zinc-700"
            />
            <button
              onClick={handleCopiar}
              className="mt-3 cursor-pointer rounded-lg bg-brand-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-blue"
            >
              {copiado ? "Prompt copiado! ✓" : "Copiar prompt"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
