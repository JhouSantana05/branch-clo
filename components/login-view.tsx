"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  User,
  Lock,
  Mail,
  Phone,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const { customer, loginCustomer, registerCustomer, logoutCustomer } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Login Form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");

  // Register Form
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regCpf, setRegCpf] = useState("");
  const [regPass, setRegPass] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      toast.error("Por favor, preencha seu e-mail.");
      return;
    }

    loginCustomer(loginEmail, loginPass);
    toast.success("Login realizado com sucesso!");
    router.push(redirectTo);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      toast.error("Preencha ao menos seu nome e e-mail.");
      return;
    }

    registerCustomer(regName, regEmail, regPhone || "(11) 99999-9999", regCpf || "000.000.000-00", regPass);
    toast.success("Conta criada com sucesso! Bem-vindo à Branch Clo.");
    router.push(redirectTo);
  };

  if (customer) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-[#E8E1D5] rounded-2xl p-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#EBF2EB] text-[#1E3524] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#1E3524] bg-[#EAE3D2] px-2.5 py-0.5 rounded">
            Cliente Autenticado
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#2E2620] mt-3">
            Olá, {customer.name}!
          </h2>
          <p className="text-xs text-stone-500 font-mono mt-1">{customer.email}</p>
          <p className="text-xs text-stone-500 font-mono">WhatsApp: {customer.phone}</p>
          <p className="text-xs text-stone-500 font-mono">CPF: {customer.cpf}</p>

          <div className="mt-6 pt-6 border-t border-[#E8E1D5] space-y-2.5">
            <Link href="/checkout">
              <Button className="w-full bg-[#1E3524] hover:bg-[#152519] text-white text-xs font-mono">
                Ir Para o Checkout
              </Button>
            </Link>
            <Link href="/rastreio">
              <Button variant="outline" className="w-full border-stone-300 text-xs font-mono">
                Rastrear Meus Pedidos
              </Button>
            </Link>
            <button
              onClick={() => {
                logoutCustomer();
                toast.info("Você encerrou a sessão.");
              }}
              className="text-xs text-red-600 hover:underline font-mono pt-2 block mx-auto"
            >
              Sair da Conta
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6 py-12 sm:py-16 font-sans">
      {/* Top Header */}
      <div className="text-center mb-8">
        <span className="text-[11px] font-mono tracking-widest text-[#1E3524] uppercase bg-[#EAE3D2] px-3 py-1 rounded">
          Área do Cliente &bull; Branch Clo
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif text-[#2E2620] mt-3">
          Identifique-se para Comprar
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm mt-1">
          Navegue livremente e acesse sua conta para concluir seu pedido com segurança.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-[#E8E1D5] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex border-b border-[#E8E1D5] mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            className={`flex-1 pb-3 text-xs font-mono tracking-wider uppercase font-semibold transition-colors border-b-2 -mb-[2px] ${
              activeTab === "login"
                ? "border-[#1E3524] text-[#1E3524]"
                : "border-transparent text-stone-400 hover:text-stone-700"
            }`}
          >
            Já Tenho Cadastro
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("register")}
            className={`flex-1 pb-3 text-xs font-mono tracking-wider uppercase font-semibold transition-colors border-b-2 -mb-[2px] ${
              activeTab === "register"
                ? "border-[#1E3524] text-[#1E3524]"
                : "border-transparent text-stone-400 hover:text-stone-700"
            }`}
          >
            Criar Minha Conta
          </button>
        </div>

        {/* Form Login */}
        {activeTab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-stone-700 mb-1">SEU E-MAIL CADASTRADO *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="seu.email@exemplo.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 mb-1">SUA SENHA *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1E3524] hover:bg-[#152519] text-white py-3 h-auto font-mono text-xs tracking-wider uppercase mt-2"
            >
              Entrar e Continuar
            </Button>

            {/* Quick Sample Login */}
            <div className="pt-4 border-t border-[#E8E1D5] text-center">
              <span className="text-[11px] text-stone-500 font-sans block mb-1">
                Teste rápido com cliente cadastrado:
              </span>
              <button
                type="button"
                onClick={() => {
                  setLoginEmail("mateus.souza@gmail.com");
                  setLoginPass("123456");
                }}
                className="text-[11px] text-[#1E3524] underline hover:font-bold"
              >
                mateus.souza@gmail.com
              </button>
            </div>
          </form>
        ) : (
          /* Form Register */
          <form onSubmit={handleRegister} className="space-y-4 text-xs font-mono">
            <div>
              <label className="block text-stone-700 mb-1">NOME COMPLETO *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Lucas Ferreira"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-700 mb-1">E-MAIL PRINCIPAL *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="seu.email@exemplo.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 mb-1">WHATSAPP / TELEFONE *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="tel"
                    required
                    placeholder="(11) 99999-9999"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 mb-1">CPF *</label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    required
                    placeholder="000.000.000-00"
                    value={regCpf}
                    onChange={(e) => setRegCpf(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-stone-700 mb-1">CRIE UMA SENHA *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  placeholder="Mínimo 6 dígitos"
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1E3524] hover:bg-[#152519] text-white py-3 h-auto font-mono text-xs tracking-wider uppercase mt-2"
            >
              Criar Cadastro e Comprar
            </Button>
          </form>
        )}
      </div>

      {/* Security notice */}
      <div className="mt-6 flex items-center justify-center gap-2 text-stone-500 text-xs">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Seus dados são 100% protegidos e nunca compartilhados.</span>
      </div>
    </div>
  );
}
