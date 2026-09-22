"use client";

import { useState } from "react";
import Image from "next/image";

type State = "idle" | "loading" | "done" | "error";

export function GenerateForm({ referenceId }: { referenceId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, setState] = useState<State>("idle");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
    setState("idle");
  }

  async function handleGenerate() {
    if (!file) return;
    setState("loading");
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("reference_id", referenceId);
    formData.append("photo", file);

    try {
      const res = await fetch("/api/generate", { method: "POST", body: formData });
      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.error ?? "Não foi possível gerar a foto.");
        setState("error");
        return;
      }

      setResultUrl(json.output_image_url);
      setState("done");
    } catch {
      setErrorMsg("Erro de conexão. Tente novamente.");
      setState("error");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium text-zinc-900">Foto da sua peça</label>
        <p className="text-xs text-zinc-500">
          Fundo neutro, boa luz, peça inteira visível — quanto melhor a foto original,
          mais fiel fica o resultado.
        </p>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="mt-2 block w-full text-sm text-zinc-600 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
        />
      </div>

      {preview && (
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100">
          <Image src={preview} alt="Preview da peça enviada" fill className="object-contain" />
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={!file || state === "loading"}
        className="rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50"
      >
        {state === "loading" ? "Gerando foto..." : "Gerar foto com IA"}
      </button>

      {state === "error" && <p className="text-sm text-red-600">{errorMsg}</p>}

      {state === "done" && resultUrl && (
        <div>
          <p className="mb-2 text-sm font-medium text-emerald-700">Pronto! 🎉</p>
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-100">
            <Image src={resultUrl} alt="Foto gerada" fill className="object-cover" />
          </div>
          <a
            href={resultUrl}
            download
            className="mt-3 inline-block text-sm font-medium text-zinc-900 underline"
          >
            Baixar imagem
          </a>
        </div>
      )}
    </div>
  );
}
