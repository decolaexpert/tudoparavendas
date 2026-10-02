"use client";

import { useState } from "react";
import Image from "next/image";
import type { ReferencePhoto } from "@/lib/types";
import { ImageSpinner } from "@/components/ImageSpinner";
import { PromptModal } from "@/components/PromptModal";

const PLACEHOLDER_THUMB = "/placeholder-reference.svg";
const VOCE_MODELO_TIPO = "Peças em Você";

export function CatalogGrid({ groups }: { groups: [string, ReferencePhoto[]][] }) {
  const [selected, setSelected] = useState<ReferencePhoto | null>(null);

  return (
    <>
      {groups.map(([tipoPeca, itens]) => (
        <section key={tipoPeca} className="mt-12">
          <SectionDivider label={tipoPeca} />
          {tipoPeca === VOCE_MODELO_TIPO && (
            <p className="mx-auto mt-4 w-fit rounded-full border border-brand-gold bg-brand-navy/5 px-4 py-1.5 text-center text-[11px] font-bold tracking-wide text-brand-navy uppercase">
              📎 Anexe 2 fotos: FOTO 1 (você) + FOTO 2 (sua joia)
            </p>
          )}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
            {itens.map((r) => (
              <ReferenceCard key={r.id} reference={r} onSelect={() => setSelected(r)} />
            ))}
          </div>
        </section>
      ))}

      <PromptModal reference={selected} onClose={() => setSelected(null)} />
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

function ReferenceCard({
  reference: r,
  onSelect,
}: {
  reference: ReferencePhoto;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="group block cursor-pointer overflow-hidden rounded-xl border border-zinc-200 bg-white text-left transition hover:shadow-lg"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100">
        <ImageSpinner />
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
    </button>
  );
}
