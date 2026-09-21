import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "BRANCH CLO. | Mais que roupa. Um lembrete diário.",
  description:
    "The Vine Collection. Moda cristã autoral em Suedine Premium 205g 100% algodão. Linhas Adulto, Teens, Kids e Acessórios.",
  icons: {
    icon: "/brand/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth overflow-x-hidden">
      <body
        className={`${inter.variable} ${spaceMono.variable} min-h-screen bg-[#FAF7F2] text-[#2E2620] flex flex-col font-sans antialiased overflow-x-hidden w-full max-w-full`}
      >
        <AuthProvider>
          <Header />
          <div className="flex-1 flex flex-col w-full max-w-full overflow-x-hidden">{children}</div>
          <Footer />
          <Toaster position="bottom-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
