import type { Metadata } from "next";
import { Montserrat, Dancing_Script } from "next/font/google";
import { BackToTopButton } from "@/components/BackToTopButton";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tudo para Vendas | Studio",
  description: "Fotos profissionais de semijoias com IA, sem alterar a peça original.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${montserrat.variable} ${dancingScript.variable} h-full antialiased`}
    >
      <body id="topo" className="min-h-full flex flex-col">
        {children}
        <BackToTopButton />
      </body>
    </html>
  );
}
