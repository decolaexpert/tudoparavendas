import Link from "next/link";

export function Header({ email }: { email?: string | null }) {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/catalogo" className="text-lg font-semibold tracking-tight text-zinc-900">
          Photo Studio <span className="text-zinc-400">TPV</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-zinc-600">
          <Link href="/catalogo" className="hover:text-zinc-900">
            Catálogo
          </Link>
          <Link href="/minhas-fotos" className="hover:text-zinc-900">
            Minhas fotos
          </Link>
          {email && <span className="text-zinc-400">{email}</span>}
        </nav>
      </div>
    </header>
  );
}
