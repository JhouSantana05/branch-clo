import type { Metadata } from "next";
import { AdminOrdersView } from "@/components/admin-orders-view";

export const metadata: Metadata = {
  title: "Gestão de Pedidos & Expedição | BRANCH CLO. Backoffice",
  description: "Painel de controle interno para visualização de pedidos, status PIX e despachos.",
};

export default function AdminPedidosPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <AdminOrdersView />
    </main>
  );
}
