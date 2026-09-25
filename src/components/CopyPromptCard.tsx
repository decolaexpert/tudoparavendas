"use client";

import { useState } from "react";

const GEMINI_URL = "https://gemini.google.com/app";
const CHATGPT_URL = "https://chat.openai.com/";

export function CopyPromptCard({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard indisponível (ex: navegador sem permissão) — a caixa de
      // texto abaixo continua selecionável manualmente.
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium text-zinc-900">Prompt deste estilo</label>
        <textarea
          readOnly
          value={prompt}
          rows={10}
          className="mt-2 w-full resize-none rounded-lg border border-zinc-300 bg-zinc-50 p-3 text-xs text-zinc-700"
        />
      </div>

      <button
        onClick={handleCopy}
        className="rounded-lg bg-brand-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-blue"
      >
        {copied ? "Prompt copiado! ✓" : "Copiar prompt"}
      </button>

      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
        <p className="text-sm font-medium text-zinc-900">Como usar</p>
        <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm text-zinc-600">
          <li>Copie o prompt acima</li>
          <li>Abra o Gemini ou o ChatGPT na sua conta pessoal</li>
          <li>Cole o prompt na conversa</li>
          <li>Anexe a foto da sua peça (fundo neutro, boa luz)</li>
          <li>Gere a imagem</li>
        </ol>

        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={GEMINI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-brand-blue px-3 py-2 text-xs font-medium text-brand-blue hover:bg-brand-blue hover:text-white"
          >
            Abrir Gemini ↗
          </a>
          <a
            href={CHATGPT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-brand-blue px-3 py-2 text-xs font-medium text-brand-blue hover:bg-brand-blue hover:text-white"
          >
            Abrir ChatGPT ↗
          </a>
        </div>
      </div>
    </div>
  );
}
