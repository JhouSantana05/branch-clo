import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginView } from "@/components/login-view";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Acessar Conta ou Cadastrar-se | BRANCH CLO.",
  description: "Faça login na sua conta ou crie seu cadastro para finalizar suas compras na BRANCH CLO.",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-stone-600">
            <Loader2 className="w-8 h-8 animate-spin text-[#1E3524]" />
            <p className="text-sm font-mono tracking-wider">CARREGANDO IDENTIFICAÇÃO...</p>
          </div>
        }
      >
        <LoginView />
      </Suspense>
    </main>
  );
}
