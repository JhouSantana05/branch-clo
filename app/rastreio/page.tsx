import { Suspense } from "react";
import type { Metadata } from "next";
import { OrderTrackingView } from "@/components/order-tracking-view";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Rastrear Pedido | BRANCH CLO.",
  description: "Acompanhe o status de envio e entrega do seu pedido na BRANCH CLO.",
};

export default function RastreioPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-stone-600">
            <Loader2 className="w-8 h-8 animate-spin text-[#1E3524]" />
            <p className="text-sm font-mono tracking-wider">CARREGANDO RASTREAMENTO...</p>
          </div>
        }
      >
        <OrderTrackingView />
      </Suspense>
    </main>
  );
}
