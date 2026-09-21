import type { Metadata } from "next";
import { AdminLoginView } from "@/components/admin-login-view";

export const metadata: Metadata = {
  title: "Login do Administrador | BRANCH CLO. Backoffice",
  description: "Acesso restrito para administração do e-commerce da BRANCH CLO.",
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      <AdminLoginView />
    </main>
  );
}
