"use client";

import Link from "next/link";
import { useState } from "react";

export type TabItem = { label: string; href: string; active: boolean };

export function CategoryTabs({ tabs }: { tabs: TabItem[] }) {
  const [open, setOpen] = useState(false);
  const active = tabs.find((t) => t.active);

  return (
    <div className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
      <div className="mx-auto w-full max-w-[1400px] px-4">
        <div className="hidden flex-wrap gap-1 sm:flex">
          {tabs.map((tab) => (
            <TabLink key={tab.href} {...tab} />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full cursor-pointer items-center justify-between py-3 sm:hidden"
        >
          <span className="text-xs font-bold tracking-wide text-brand-navy uppercase">
            {active?.label ?? "Categorias"}
          </span>
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-5 w-5 text-brand-navy"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="max-h-[60vh] overflow-y-auto border-t border-zinc-200 px-4 sm:hidden">
          <div className="flex flex-col">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                onClick={() => setOpen(false)}
                className={[
                  "cursor-pointer border-b border-zinc-100 py-3 text-xs font-bold tracking-wide uppercase last:border-b-0",
                  tab.active ? "text-brand-navy" : "text-zinc-500",
                ].join(" ")}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TabLink({ label, href, active }: TabItem) {
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
