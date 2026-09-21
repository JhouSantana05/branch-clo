import type { Metadata } from "next";
import { AdminProductsView } from "@/components/admin-products-view";

export const metadata: Metadata = {
  title: "Gestão de Produtos & Estoque | BRANCH CLO. Backoffice",
  description: "Painel de controle interno para controle de inventário, estoque por tamanho e preços.",
};

export default function AdminProdutosPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <AdminProductsView />
    </main>
  );
}
