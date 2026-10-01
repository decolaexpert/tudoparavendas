import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Desativa a otimização automática (Vercel Image Optimization): no
    // plano Hobby ela tem uma cota mensal de imagens-fonte únicas, e um
    // catálogo com 130+ fotos estoura isso rápido — imagens novas (ex: em
    // aparelhos que nunca visitaram o site) passam a falhar ao carregar.
    // Serve os arquivos originais direto, sem depender dessa cota.
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
