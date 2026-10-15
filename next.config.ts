import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Gerador de card dos jurados do Prêmio Aberje (public/aberje-jurados)
      { source: "/aberje", destination: "/aberje-jurados/index.html" },
      { source: "/aberje-jurados", destination: "/aberje-jurados/index.html" },
    ];
  },
  images: {
    // Reaplicado: confirmado com teste real (PC que nunca visitou o site —
    // nem a logo local carregou) que o pipeline de otimização de imagem
    // está falhando pra visitantes novos, provavelmente por cota mensal do
    // plano Hobby. unoptimized serve os arquivos originais direto, sem
    // depender dessa cota — prioriza "funciona, mais pesado" sobre "não
    // funciona pra cliente novo nenhum".
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "www.tudoparavendas.com.br",
      },
      {
        protocol: "https",
        hostname: "tudoparavendas.com.br",
      },
    ],
  },
};

export default nextConfig;
