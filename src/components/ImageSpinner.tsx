// Fica atrás da <Image fill>, no mesmo container relative. Enquanto a foto
// não carrega, o navegador não pinta nada sobre ela — assim que carrega, a
// própria imagem cobre o spinner, sem precisar de JS pra esconder.
export function ImageSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-brand-blue" />
    </div>
  );
}
