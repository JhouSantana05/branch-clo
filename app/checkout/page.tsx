import { Suspense } from "react";
import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout-view";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Checkout Seguro | BRANCH CLO.",
  description: "Finalize sua compra com segurança na BRANCH CLO. PIX com 5% OFF e frete calculado em tempo real.",
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] py-8 md:py-12">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-stone-600">
            <Loader2 className="w-8 h-8 animate-spin text-[#1E3524]" />
            <p className="text-sm font-mono tracking-wider">CARREGANDO CHECKOUT...</p>
          </div>
        }
      >
        <CheckoutView />
      </Suspense>
    </main>
  );
}
