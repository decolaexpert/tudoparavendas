"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { ReferencePhoto } from "@/lib/types";

const PLACEHOLDER_THUMB = "/placeholder-reference.svg";
const GEMINI_URL = "https://gemini.google.com/app";
const CHATGPT_URL = "https://chat.openai.com/";
const VOCE_MODELO_TIPO = "Peças em Você";

export function PromptModal({
  reference,
  onClose,
}: {
  reference: ReferencePhoto | null;
  onClose: () => void;
}) {
  if (!reference) return null;

  // Key pelo id: cada foto clicada remonta este componente, zerando o
  // estado "copied" sozinho — sem precisar resetar via setState no efeito.
  return <PromptModalContent key={reference.id} reference={reference} onClose={onClose} />;
}

function PromptModalContent({
  reference,
  onClose,
}: {
  reference: ReferencePhoto;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    navigator.clipboard
      .writeText(reference.prompt_mestre)
      .then(() => setCopied(true))
      .catch(() => {
        // clipboard indisponível (ex: navegador sem permissão) — a pessoa
        // ainda pode copiar manualmente pelo botão/textarea abaixo.
      });

    document.body.style.overflow = "hidden";
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [reference, onClose]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(reference.prompt_mestre);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ver comentário acima
    }
  }

  const duasFotos = reference.tipo_peca === VOCE_MODELO_TIPO;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-y-auto rounded-2xl bg-white shadow-xl sm:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-zinc-500 shadow hover:text-brand-black sm:hidden"
        >
          ✕
        </button>

        <div className="relative aspect-square w-full shrink-0 bg-zinc-100 sm:w-1/2">
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-3 right-3 z-10 hidden h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-zinc-500 shadow hover:text-brand-black sm:flex"
          >
            ✕
          </button>
          <Image
            src={reference.thumbnail_url || PLACEHOLDER_THUMB}
            alt={reference.nome_referencia}
            fill
            sizes="(max-width: 640px) 100vw, 400px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div>
            <p className="rounded-lg bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              {copied ? "Prompt clonado! ✓" : "Clonando prompt..."}
            </p>
            <p className="mt-3 text-sm font-medium text-zinc-900">{reference.tipo_peca}</p>
            <p className="text-xs text-zinc-500">
              {reference.pose}
              {reference.data_comemorativa ? ` · ${reference.data_comemorativa}` : ""}
            </p>
          </div>

          <textarea
            readOnly
            value={reference.prompt_mestre}
            rows={8}
            className="w-full resize-none rounded-lg border border-zinc-300 bg-zinc-50 p-3 text-xs text-zinc-700"
          />

          <button
            onClick={handleCopy}
            className="cursor-pointer rounded-lg bg-brand-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-blue"
          >
            {copied ? "Prompt copiado! ✓" : "Copiar prompt"}
          </button>

          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-sm font-medium text-zinc-900">Como usar</p>
            <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm text-zinc-600">
              <li>O prompt já foi clonado pra sua área de transferência</li>
              <li>Abra o Gemini ou o ChatGPT na sua conta pessoal</li>
              <li>Cole o prompt na conversa</li>
              {duasFotos ? (
                <>
                  <li>Anexe a FOTO 1: uma foto sua, com o rosto bem visível</li>
                  <li>Anexe a FOTO 2: a foto da sua joia (fundo neutro, boa luz)</li>
                </>
              ) : (
                <li>Anexe a foto da sua peça (fundo neutro, boa luz)</li>
              )}
              <li>Gere a imagem</li>
            </ol>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={GEMINI_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer rounded-lg border border-brand-blue px-3 py-2 text-xs font-medium text-brand-blue hover:bg-brand-blue hover:text-white"
              >
                Abrir Gemini ↗
              </a>
              <a
                href={CHATGPT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer rounded-lg border border-brand-blue px-3 py-2 text-xs font-medium text-brand-blue hover:bg-brand-blue hover:text-white"
              >
                Abrir ChatGPT ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
