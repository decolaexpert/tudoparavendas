export function BackToTopButton() {
  return (
    <a
      href="#topo"
      aria-label="Voltar para o topo"
      title="Voltar para o topo"
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-brand-blue text-white shadow-lg transition hover:brightness-110"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </a>
  );
}
