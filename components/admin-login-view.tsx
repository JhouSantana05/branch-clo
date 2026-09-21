"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock, Mail, ShieldAlert, ArrowRight } from "lucide-react";

export function AdminLoginView() {
  const router = useRouter();
  const { admin, loginAdmin, logoutAdmin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(email, password);
    if (success) {
      toast.success("Acesso autorizado ao Backoffice!");
      router.push("/admin/produtos");
    } else {
      toast.error("Credenciais inválidas. Verifique o e-mail e senha de administrador.");
    }
  };

  if (admin) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16 text-center font-sans">
        <div className="bg-white border border-[#E8E1D5] rounded-2xl p-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#EBF2EB] text-[#1E3524] flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#1E3524] bg-[#EAE3D2] px-2.5 py-0.5 rounded">
            Sessão de Administrador Ativa
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#2E2620] mt-3">
            {admin.name}
          </h2>
          <p className="text-xs text-stone-500 font-mono mt-1">{admin.email}</p>

          <div className="mt-6 pt-6 border-t border-[#E8E1D5] space-y-2.5">
            <Link href="/admin/produtos">
              <Button className="w-full bg-[#1E3524] hover:bg-[#152519] text-white text-xs font-mono">
                Gestão de Produtos & Estoque
              </Button>
            </Link>
            <Link href="/admin/pedidos">
              <Button variant="outline" className="w-full border-stone-300 text-xs font-mono">
                Gestão de Pedidos & Despachos
              </Button>
            </Link>
            <button
              onClick={() => {
                logoutAdmin();
                toast.info("Sessão administrativa encerrada.");
              }}
              className="text-xs text-red-600 hover:underline font-mono pt-2 block mx-auto"
            >
              Encerrar Sessão
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 py-16 font-sans">
      <div className="text-center mb-8">
        <span className="text-[11px] font-mono tracking-widest text-amber-900 uppercase bg-amber-100 border border-amber-200 px-3 py-1 rounded">
          Acesso Restrito &bull; Backoffice
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#2E2620] mt-3">
          Login do Proprietário
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm mt-1">
          Área restrita para controle de estoque, pedidos e catálogo.
        </p>
      </div>

      <div className="bg-white border border-[#E8E1D5] rounded-2xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block text-stone-700 mb-1">E-MAIL DO ADMINISTRADOR *</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                required
                placeholder="admin@branchclo.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-700 mb-1">SENHA DE ACESSO *</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#1E3524] hover:bg-[#152519] text-white py-3 h-auto font-mono text-xs tracking-wider uppercase mt-2"
          >
            Acessar Painel
          </Button>

          {/* Quick Demo Fill */}
          <div className="pt-4 border-t border-[#E8E1D5] text-center">
            <span className="text-[11px] text-stone-500 font-sans block mb-1">
              Preenchimento rápido para o dono:
            </span>
            <button
              type="button"
              onClick={() => {
                setEmail("admin@branchclo.com.br");
                setPassword("branch2026");
              }}
              className="text-[11px] text-[#1E3524] underline hover:font-bold"
            >
              Preencher: admin@branchclo.com.br
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
