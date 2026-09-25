import Link from "next/link";
import Image from "next/image";

export function Header({ email }: { email?: string | null }) {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/catalogo" className="flex cursor-pointer items-center gap-2">
          <Image src="/logo.webp" alt="Tudo para Vendas" width={140} height={25} priority />
          <span className="hidden font-script text-2xl text-brand-black sm:inline">
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
