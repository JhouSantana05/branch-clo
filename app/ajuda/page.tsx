import type { Metadata } from "next";
import { FaqView } from "@/components/faq-view";

export const metadata: Metadata = {
  title: "Central de Ajuda & FAQ | BRANCH CLO.",
  description: "Dúvidas frequentes sobre frete, trocas grátis, descontos PIX e cuidados com o Suedine 205g.",
};

export default function AjudaPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <FaqView />
    </main>
  );
}
