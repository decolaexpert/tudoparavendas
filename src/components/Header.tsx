import Link from "next/link";
import Image from "next/image";

export function Header({ email }: { email?: string | null }) {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="bg-brand-blue px-4 py-1.5 text-center text-[10px] font-bold tracking-wide text-white sm:py-2 sm:text-xs">
        <span className="sm:hidden">TUDO PARA VENDAS — APRENDA, EVOLUA E VENDA MAIS!</span>
        <span className="hidden sm:inline">
          TUDO PARA VENDAS — O MAIS COMPLETO SISTEMA EDUCACIONAL PARA EMPREENDEDORAS DE JOIAS —
          APRENDA, EVOLUA, FAÇA VOCÊ MESMA E VENDA MAIS!
        </span>
      </div>
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-4">
        <Link href="/catalogo" className="flex cursor-pointer items-center gap-2">
          <Image src="/logo.webp" alt="Tudo para Vendas" width={180} height={32} priority />
          <span className="hidden font-script text-3xl text-brand-black sm:inline">
            Studio
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-zinc-600">
          <Link href="/catalogo" className="cursor-pointer hover:text-brand-blue">
            Catálogo
          </Link>
          {email && <span className="text-zinc-400">{email}</span>}
        </nav>
      </div>
    </header>
  );
}
