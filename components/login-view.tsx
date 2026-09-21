"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, AddressData } from "@/lib/auth-context";
import { fetchAddressByCep } from "@/lib/viacep";
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
  MapPin,
  Search,
  LogOut,
  SlidersHorizontal,
  Package,
} from "lucide-react";

export function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const { customer, admin, unifiedLogin, registerCustomer, logoutCustomer, logoutAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Login Form (Unificado: Dono e Cliente usam o mesmo campo!)
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");

  // Register Form - Dados Pessoais
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regCpf, setRegCpf] = useState("");
  const [regPass, setRegPass] = useState("");

  // Register Form - Endereço do Cliente
  const [regCep, setRegCep] = useState("");
  const [regStreet, setRegStreet] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [regComplement, setRegComplement] = useState("");
  const [regNeighborhood, setRegNeighborhood] = useState("");
  const [regCity, setRegCity] = useState("São Paulo");
  const [regState, setRegState] = useState("SP");
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  // Busca de Endereço Real via API ViaCEP
  const handleCepLookup = async (inputCep: string) => {
    const clean = inputCep.replace(/\D/g, "");
    if (clean.length !== 8) {
      toast.error("Digite um CEP válido com 8 números.");
      return;
    }

    setIsSearchingCep(true);
    toast.loading("Buscando endereço oficial...", { id: "cep-lookup" });
    const address = await fetchAddressByCep(clean);
    setIsSearchingCep(false);

    if (address) {
      setRegStreet(address.street);
      setRegNeighborhood(address.neighborhood);
      setRegCity(address.city);
      setRegState(address.state);
      toast.success(`Endereço localizado: ${address.street}, ${address.city} - ${address.state}`, {
        id: "cep-lookup",
      });
    } else {
      toast.error("CEP não encontrado. Digite o endereço manualmente.", {
        id: "cep-lookup",
      });
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      toast.error("Por favor, preencha seu e-mail.");
      return;
    }

    const result = unifiedLogin(loginEmail, loginPass);
    if (result.success) {
      if (result.role === "ADMIN") {
        toast.success("Acesso administrativo autorizado! Redirecionando para a Gestão...");
        router.push("/admin/pedidos");
      } else {
        toast.success("Login realizado com sucesso!");
        router.push(redirectTo);
      }
    } else {
      toast.error(result.message || "Credenciais inválidas.");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      toast.error("Preencha ao menos seu nome e e-mail.");
      return;
    }

    const addressData: AddressData | undefined = regStreet.trim()
      ? {
          cep: regCep.trim(),
          street: regStreet.trim(),
          number: regNumber.trim() || "S/N",
          complement: regComplement.trim(),
          neighborhood: regNeighborhood.trim(),
          city: regCity.trim(),
          state: regState.trim(),
        }
      : undefined;

    registerCustomer(
      regName,
      regEmail,
      regPhone || "(11) 99999-9999",
      regCpf || "000.000.000-00",
      regPass,
      addressData
    );
    toast.success("Conta e endereço criados com sucesso! Bem-vindo à Branch Clo.");
    router.push(redirectTo);
  };

  // Se estiver conectado como Dono da Loja (ADMIN)
  if (admin) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16 text-center font-sans">
        <div className="bg-white border border-amber-300 rounded-2xl p-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded font-bold">
            Dono da Loja Conectado
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#2E2620] mt-3">
            Gestão Branch Clo
          </h2>
          <p className="text-xs text-stone-600 font-mono mt-1">{admin.email}</p>
          <p className="text-xs text-stone-500 mt-2">
            Você tem permissão total para gerenciar pedidos, estoque e fotos dos produtos.
          </p>

          <div className="mt-6 pt-6 border-t border-[#E8E1D5] space-y-2.5">
            <Link href="/admin/pedidos">
              <Button className="w-full bg-[#1E3524] hover:bg-[#152519] text-white text-xs font-mono flex items-center justify-center gap-1.5">
                <Package className="w-4 h-4" />
                <span>Acessar Painel de Pedidos</span>
              </Button>
            </Link>
            <Link href="/admin/produtos">
              <Button variant="outline" className="w-full border-stone-300 text-xs font-mono flex items-center justify-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Gestão de Estoque &amp; Preços</span>
              </Button>
            </Link>
            <button
              onClick={() => {
                logoutAdmin();
                toast.info("Você encerrou a sessão administrativa.");
              }}
              className="text-xs text-red-600 hover:underline font-mono pt-2 block mx-auto"
            >
              Encerrar Sessão de Gestão
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Se estiver conectado como Cliente
  if (customer) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-16 text-center font-sans">
        <div className="bg-white border border-[#E8E1D5] rounded-2xl p-8 shadow-sm text-left">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#EBF2EB] text-[#1E3524] flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#1E3524] bg-[#EAE3D2] px-2.5 py-0.5 rounded">
              Cliente Autenticado
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#2E2620] mt-2">
              Olá, {customer.name}!
            </h2>
            <p className="text-xs text-stone-500 font-mono">{customer.email}</p>
          </div>

          <div className="bg-[#FAF7F2] p-4 rounded-lg border border-[#E8E1D5] space-y-2 text-xs font-mono mb-6">
            <div className="font-bold text-[#1E3524] uppercase text-[10px] tracking-wider mb-1">
              Dados do seu Cadastro:
            </div>
            <div><strong>WhatsApp:</strong> {customer.phone}</div>
            <div><strong>CPF:</strong> {customer.cpf}</div>
            {customer.address ? (
              <div className="pt-2 border-t border-stone-200 mt-2">
                <div className="font-bold text-stone-700 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1E3524]" />
                  <span>Endereço de Entrega Cadastrado:</span>
                </div>
                <p className="text-stone-600 mt-1">
                  {customer.address.street}, Nº {customer.address.number}
                  {customer.address.complement ? ` (${customer.address.complement})` : ""} &bull; {customer.address.neighborhood}
                </p>
                <p className="text-stone-600">
                  {customer.address.city} - {customer.address.state} &bull; CEP: {customer.address.cep}
                </p>
              </div>
            ) : (
              <p className="text-stone-500 italic text-[11px]">Nenhum endereço salvo ainda.</p>
            )}
          </div>

          <div className="space-y-2.5">
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
              className="text-xs text-red-600 hover:underline font-mono pt-2 block mx-auto text-center w-full"
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

            {/* Seção de Endereço de Entrega */}
            <div className="pt-4 border-t border-[#E8E1D5] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E3524] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1E3524]" />
                  Endereço para Entrega de Pedidos
                </span>
                <span className="text-[10px] text-stone-500 font-mono">Busca Automática via CEP</span>
              </div>

              {/* Campo de CEP com Busca Real ViaCEP */}
              <div>
                <label className="block text-stone-700 mb-1">CEP *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    maxLength={9}
                    placeholder="00000-000"
                    value={regCep}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRegCep(val);
                      if (val.replace(/\D/g, "").length === 8) {
                        handleCepLookup(val);
                      }
                    }}
                    className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
                  />
                  <Button
                    type="button"
                    disabled={isSearchingCep}
                    onClick={() => handleCepLookup(regCep)}
                    className="bg-[#1E3524] hover:bg-[#152519] text-white px-4 text-xs font-mono h-auto shrink-0"
                  >
                    {isSearchingCep ? "Buscando..." : "Buscar CEP"}
                  </Button>
                </div>
              </div>

              {/* Rua / Logradouro */}
              <div>
                <label className="block text-stone-700 mb-1">RUA / AVENIDA (LOGRADOURO) *</label>
                <input
                  type="text"
                  required
                  placeholder="Preenchido automaticamente pelo CEP"
                  value={regStreet}
                  onChange={(e) => setRegStreet(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 mb-1">NÚMERO *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 123"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 mb-1">COMPLEMENTO (OPCIONAL)</label>
                  <input
                    type="text"
                    placeholder="Apto 42, Bloco B..."
                    value={regComplement}
                    onChange={(e) => setRegComplement(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 mb-1">BAIRRO *</label>
                  <input
                    type="text"
                    required
                    placeholder="Bairro"
                    value={regNeighborhood}
                    onChange={(e) => setRegNeighborhood(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 mb-1">CIDADE *</label>
                  <input
                    type="text"
                    required
                    placeholder="Cidade"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 mb-1">ESTADO (UF) *</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    placeholder="SP"
                    value={regState}
                    onChange={(e) => setRegState(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524] uppercase"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1E3524] hover:bg-[#152519] text-white py-3 h-auto font-mono text-xs tracking-wider uppercase mt-4"
            >
              Criar Cadastro Completo e Comprar
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
