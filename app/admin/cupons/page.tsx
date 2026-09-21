import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminOrdersView } from "@/components/admin-orders-view";

export const metadata: Metadata = {
  title: "Gerador de Cupons | BRANCH CLO. Backoffice",
  description: "Painel administrativo para cadastro e gerenciamento de cupons com expiração automática.",
};

export default function AdminCuponsPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <Suspense fallback={<div className="p-8 text-center font-mono text-xs text-stone-500">Carregando cupons...</div>}>
        <AdminOrdersView />
      </Suspense>
    </main>
  );
}
