"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { OFFICIAL_PRODUCTS } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";
import { saveNewOrder, OrderData } from "@/lib/orders";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Copy,
  Clock,
  MessageCircle,
  ArrowLeft,
  Sparkles,
  QrCode,
  Tag,
  X,
  User,
  Lock,
  UserPlus,
  LogIn,
  LogOut,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { fetchAddressByCep } from "@/lib/viacep";

export function CheckoutView() {
  const searchParams = useSearchParams();
  const slugParam = searchParams.get("slug") || "the-vine-joao-15-5-adulto";
  const colorParam = searchParams.get("color") || "Off-White";
  const sizeParam = searchParams.get("size") || "M";

  // Encontrar o produto selecionado
  const product =
    OFFICIAL_PRODUCTS.find((p) => p.slug === slugParam) || OFFICIAL_PRODUCTS[0];

  const matchingImage =
    product.images.find((img) =>
      colorParam.toLowerCase().includes("off-white")
        ? img.url.includes("offwhite")
        : colorParam.toLowerCase().includes("marrom")
        ? img.url.includes("marrom")
        : img.url.includes("preto")
    )?.url ||
    product.images[0]?.url ||
    "/catalog/tee-oversized-offwhite-frente.jpeg";

  const activeVariant =
    product.variants.find(
      (v) => v.colorName === colorParam && v.size === sizeParam
    ) ||
    product.variants[0];

  const unitPrice =
    activeVariant?.promotionalPrice || activeVariant?.regularPrice || 129.9;

  // Estado do Checkout
  const [quantity, setQuantity] = useState(1);
  const [shippingMethod, setShippingMethod] = useState<"PAC" | "SEDEX">("PAC");
  const paymentMethod = "PIX" as const;

  // Autenticação Obrigatória para Compras
  const {
    customer,
    isCustomerAuthenticated,
    unifiedLogin,
    loginCustomer,
    registerCustomer,
    updateCustomerAddress,
    logoutCustomer,
  } = useAuth();
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regCpf, setRegCpf] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Dados do Cliente (Preenchidos automaticamente se autenticado)
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerCpf, setCustomerCpf] = useState("");

  // Endereço (Preenchido automaticamente se o cliente tiver endereço cadastrado)
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("São Paulo");
  const [state, setState] = useState("SP");
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  // Sincronizar dados e endereço do cliente logado
  useEffect(() => {
    if (customer) {
      setCustomerName(customer.name);
      setCustomerEmail(customer.email);
      setCustomerPhone(customer.phone);
      setCustomerCpf(customer.cpf);
      if (customer.address) {
        if (customer.address.cep) setCep(customer.address.cep);
        if (customer.address.street) setStreet(customer.address.street);
        if (customer.address.number) setNumber(customer.address.number);
        if (customer.address.complement) setComplement(customer.address.complement);
        if (customer.address.neighborhood) setNeighborhood(customer.address.neighborhood);
        if (customer.address.city) setCity(customer.address.city);
        if (customer.address.state) setState(customer.address.state);
      }
    }
  }, [customer]);

  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast.error("Preencha e-mail e senha.");
      return;
    }
    const res = unifiedLogin(loginEmail, loginPassword);
    if (res.success) {
      if (res.role === "ADMIN") {
        toast.success("Acesso administrativo! Redirecionando para o painel de gestão...");
        window.location.href = "/admin/pedidos";
      } else {
        toast.success("Login realizado com sucesso! Seus dados foram carregados.");
      }
    } else {
      toast.error(res.message || "Falha ao autenticar. Tente novamente.");
    }
  };

  const handleInlineRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim()) {
      toast.error("Por favor, preencha os campos obrigatórios.");
      return;
    }
    const addressData = street.trim()
      ? {
          cep: cep.trim(),
          street: street.trim(),
          number: number.trim() || "S/N",
          complement: complement.trim(),
          neighborhood: neighborhood.trim(),
          city: city.trim(),
          state: state.trim(),
        }
      : undefined;

    const ok = registerCustomer(regName, regEmail, regPhone, regCpf, regPassword, addressData);
    if (ok) {
      toast.success("Conta criada com sucesso! Você já está autenticado para comprar.");
    } else {
      toast.error("Falha ao registrar conta.");
    }
  };

  // Pedido Criado
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [generatedOrderNumber, setGeneratedOrderNumber] = useState("");
  const [countdown, setCountdown] = useState(15 * 60); // 15 minutos em segundos

  // Cupom de Desconto
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    type: "PERCENT" | "FIXED" | "FREE_SHIPPING";
    value: number;
  } | null>(null);

  // Cálculos
  const subtotal = unitPrice * quantity;
  const isFreeShipping = subtotal >= 399;
  const standardShippingCost = isFreeShipping
    ? 0
    : shippingMethod === "PAC"
    ? 14.9
    : 22.9;

  const shippingCost = appliedCoupon?.type === "FREE_SHIPPING" ? 0 : standardShippingCost;

  const couponDiscount = appliedCoupon
    ? appliedCoupon.type === "PERCENT"
      ? subtotal * appliedCoupon.value
      : appliedCoupon.type === "FIXED"
      ? Math.min(subtotal, appliedCoupon.value)
      : 0
    : 0;

  const subtotalAfterCoupon = Math.max(0, subtotal - couponDiscount);
  const pixDiscount = paymentMethod === "PIX" ? subtotalAfterCoupon * 0.05 : 0;
  const totalAmount = subtotalAfterCoupon + shippingCost - pixDiscount;

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (code === "THEVINE10") {
      setAppliedCoupon({ code, type: "PERCENT", value: 0.1 });
      toast.success("Cupom THEVINE10 aplicado! 10% de desconto adicional.");
    } else if (code === "PRIMEIRACOMPRA") {
      setAppliedCoupon({ code, type: "FIXED", value: 20.0 });
      toast.success("Cupom PRIMEIRACOMPRA aplicado! R$ 20,00 de desconto.");
    } else if (code === "FRETEGRATIS") {
      setAppliedCoupon({ code, type: "FREE_SHIPPING", value: 0 });
      toast.success("Cupom FRETEGRATIS aplicado! Frete 100% grátis.");
    } else {
      toast.error("Cupom inválido ou expirado");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    toast.info("Cupom removido.");
  };

  // Busca Real de CEP via API ViaCEP
  const handleCepLookup = async (inputCep?: string) => {
    const targetCep = (inputCep || cep).replace(/\D/g, "");
    if (targetCep.length !== 8) {
      toast.error("Digite um CEP válido com 8 dígitos");
      return;
    }

    setIsSearchingCep(true);
    toast.loading("Buscando endereço oficial...", { id: "checkout-cep" });
    const address = await fetchAddressByCep(targetCep);
    setIsSearchingCep(false);

    if (address) {
      setStreet(address.street);
      setNeighborhood(address.neighborhood);
      setCity(address.city);
      setState(address.state);
      setCep(address.cep);
      toast.success(`Endereço localizado: ${address.street}, ${address.city} - ${address.state}`, {
        id: "checkout-cep",
      });
    } else {
      toast.error("CEP não encontrado. Por favor, digite o endereço manualmente.", {
        id: "checkout-cep",
      });
    }
  };

  // Gerador de Código PIX Copia e Cola Oficial Simulado
  const simulatedPixCode = `00020126580014br.gov.bcb.pix0136${Math.random()
    .toString(36)
    .substring(2, 15)}-branch-clo520400005303986540${totalAmount
    .toFixed(2)
    .replace(".", "")}5802BR5920BRANCH CLO VESTUARIO6009SAO PAULO62070503***6304${Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase()}`;

  // Submeter Pedido
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCustomerAuthenticated) {
      toast.error("Identificação Obrigatória", {
        description: "Você precisa estar cadastrado e conectado para concluir a compra. Faça login ou cadastre-se na Etapa 1.",
      });
      const el = document.getElementById("etapa-identificacao");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (!customerName || !customerPhone || !street || !number) {
      toast.error("Por favor, preencha os campos obrigatórios de entrega");
      return;
    }

    // Salvar o endereço no cadastro do cliente logado para compras futuras
    if (customer && street) {
      updateCustomerAddress({
        cep,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
      });
    }

    const orderNum = `#BC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedOrderNumber(orderNum);

    const newOrder: OrderData = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerName: customerName,
      customerPhone: customerPhone,
      customerEmail: customerEmail || customer?.email || "cliente@branchclo.com.br",
      customerCpf: customerCpf || customer?.cpf || "000.000.000-00",
      shippingAddress: {
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        postalCode: cep,
      },
      shippingMethod,
      shippingCost,
      paymentMethod,
      subtotal,
      discount: couponDiscount + pixDiscount,
      total: totalAmount,
      status: paymentMethod === "PIX" ? "AGUARDANDO_PIX" : "PAGO",
      pixCode: simulatedPixCode,
      createdAt: new Date().toISOString(),
      items: [
        {
          productName: product.name,
          color: colorParam,
          size: sizeParam,
          quantity,
          unitPrice: unitPrice,
          imageUrl: matchingImage,
        },
      ],
    };
    saveNewOrder(newOrder);

    setOrderConfirmed(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.success("Pedido gerado com sucesso!", {
      description: `Código do pedido: ${orderNum}`,
    });
  };

  // Contador de Expiração do PIX
  useEffect(() => {
    if (!orderConfirmed || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [orderConfirmed, countdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Enviar Confirmação via WhatsApp
  const handleWhatsAppOrder = () => {
    const phone = "5511999999999";
    const text = encodeURIComponent(
      `*PEDIDO CONFIRMADO NA BRANCH CLO — THE VINE COLLECTION*\n\n` +
        `*Número do Pedido:* ${generatedOrderNumber}\n` +
        `*Cliente:* ${customerName}\n` +
        `*WhatsApp:* ${customerPhone}\n\n` +
        `*Itens:* ${quantity}x ${product.name} (${colorParam} - Tam: ${sizeParam})\n` +
        `*Cupom:* ${appliedCoupon ? `${appliedCoupon.code} (-${formatCurrency(couponDiscount)})` : "Nenhum"}\n` +
        `*Frete:* ${shippingMethod} (${shippingCost === 0 ? "Grátis" : formatCurrency(shippingCost)})\n` +
        `*Forma de Pagamento:* ${paymentMethod === "PIX" ? "PIX (5% OFF)" : "Cartão de Crédito"}\n` +
        `*Valor Total:* ${formatCurrency(totalAmount)}\n\n` +
        `*Endereço de Entrega:* ${street}, Nº ${number} ${complement ? "- " + complement : ""}, ${neighborhood}, ${city} - ${state}, CEP ${cep}\n\n` +
        `Envio o comprovante de pagamento anexo para início da separação no estoque.`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  // TELA DE CONFIRMAÇÃO DO PEDIDO (PIX QR CODE)
  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#2E2620] py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl bg-[#FDFCF9] border border-stone-300 shadow-xl rounded-sm p-6 sm:p-10">
          
          {/* Header Sucesso */}
          <div className="text-center pb-6 border-b border-stone-200">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-[#EBF2EB] text-[#1E3524] mb-3">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8C7A68] block">
              PEDIDO REGISTRADO COM SUCESSO
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#2E2620] mt-1">
              {generatedOrderNumber}
            </h1>
            <p className="text-xs font-mono text-[#7E7265] mt-1">
              Obrigado, {customerName}! Sua peça da The Vine Collection está reservada.
            </p>
          </div>

          {/* Área do PIX Oficial */}
          <div className="py-8 text-center border-b border-stone-200">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EBF2EB] text-[#1E3524] rounded-sm text-xs font-mono font-semibold mb-4">
              <Clock className="h-4 w-4" />
              <span>Pague em até {formatTime(countdown)} para garantir a reserva</span>
            </div>

            {/* QR Code Simulado Elegante */}
            <div className="mx-auto w-52 h-52 bg-white border-2 border-dashed border-stone-300 rounded-sm p-4 flex flex-col items-center justify-center shadow-inner my-4">
              <QrCode className="h-32 w-32 text-[#2E2620]" />
              <span className="text-[10px] font-mono text-[#7E7265] mt-2">
                Abra o app do seu banco e aponte a câmera
              </span>
            </div>

            <div className="text-2xl font-bold font-mono text-[#1E3524] mt-3">
              {formatCurrency(totalAmount)}
            </div>
            <span className="text-[11px] font-mono text-[#7E7265]">
              (Valor com 5% de desconto exclusivo no PIX)
            </span>

            {/* Código Copia e Cola */}
            <div className="mt-6 max-w-md mx-auto">
              <span className="text-xs font-mono uppercase tracking-wider text-[#7E7265] block mb-2 font-semibold">
                PIX COPIA E COLA:
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={simulatedPixCode}
                  className="flex-1 px-3 py-2 text-[11px] font-mono bg-stone-100 border border-stone-300 rounded-sm text-stone-600 truncate select-all"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(simulatedPixCode);
                    toast.success("Chave PIX copiada para a área de transferência!");
                  }}
                  className="bg-[#2E2620] hover:bg-[#1C1713] text-white text-xs font-mono gap-1.5 rounded-sm shrink-0"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copiar
                </Button>
              </div>
            </div>
          </div>

          {/* Resumo do Pedido & Envio */}
          <div className="py-6 space-y-3 text-xs font-mono text-[#52463C] border-b border-stone-200">
            <div className="flex justify-between">
              <span>Peça:</span>
              <strong className="text-[#2E2620] text-right truncate max-w-[280px]">
                {product.name}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Variação:</span>
              <span className="text-[#2E2620]">{colorParam} — Tam: {sizeParam}</span>
            </div>
            <div className="flex justify-between">
              <span>Envio ({shippingMethod}):</span>
              <span className="text-[#2E2620]">
                {shippingCost === 0 ? "GRÁTIS" : formatCurrency(shippingCost)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Endereço de Entrega:</span>
              <span className="text-[#2E2620] text-right">
                {street}, {number} - {city}/{state}
              </span>
            </div>
          </div>

          {/* Ações Finais */}
          <div className="pt-6 space-y-3">
            <Button
              onClick={handleWhatsAppOrder}
              className="w-full h-12 bg-[#1E3524] hover:bg-[#142418] text-white font-mono uppercase tracking-widest text-xs font-semibold rounded-sm gap-2 shadow-md"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              Enviar Comprovante / Acompanhar no WhatsApp
            </Button>

            <Link
              href="/"
              className="block w-full text-center py-3 text-xs font-mono uppercase tracking-widest text-[#7E7265] hover:text-[#2E2620] transition-colors"
            >
              Voltar para a Loja
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // TELA DE FORMULÁRIO DO CHECKOUT
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2E2620] py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        
        {/* Link de retorno */}
        <div className="mb-8">
          <Link
            href={`/produtos/${product.slug}`}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#7E7265] hover:text-[#2E2620] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar para o Produto
          </Link>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          
          {/* COLUNA ESQUERDA: DADOS DE ENVIO & PAGAMENTO (7 colunas) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. DADOS PESSOAIS & IDENTIFICAÇÃO OBRIGATÓRIA */}
            {!isCustomerAuthenticated ? (
              <div
                id="etapa-identificacao"
                className="bg-[#FDFCF9] border-2 border-[#1E3524]/60 p-6 rounded-sm shadow-sm relative"
              >
                {/* Header com aviso claro */}
                <div className="mb-4 pb-3 border-b border-stone-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-amber-900 bg-amber-100 px-2 py-0.5 rounded font-semibold">
                      ETAPA 1 DE 3 &bull; IDENTIFICAÇÃO OBRIGATÓRIA
                    </span>
                    <span className="text-[10px] font-mono text-stone-500">
                      Login Seguro
                    </span>
                  </div>
                  <h2 className="text-base font-bold uppercase tracking-wide text-[#2E2620]">
                    Acesse sua conta para concluir a compra
                  </h2>
                  <p className="text-xs text-stone-600 mt-1">
                    Para garantir a emissão da reserva, cálculo de frete e rastreio, é necessário estar cadastrado e logado.
                  </p>
                </div>

                {/* Abas: Já Tenho Cadastro / Criar Minha Conta */}
                <div className="flex border-b border-stone-200 mb-5">
                  <button
                    type="button"
                    onClick={() => setAuthTab("login")}
                    className={`flex-1 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-center border-b-2 transition-colors ${
                      authTab === "login"
                        ? "border-[#1E3524] text-[#1E3524] bg-[#F5EFE6]/50"
                        : "border-transparent text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <LogIn className="w-3.5 h-3.5" />
                      Já Tenho Cadastro
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthTab("register")}
                    className={`flex-1 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-center border-b-2 transition-colors ${
                      authTab === "register"
                        ? "border-[#1E3524] text-[#1E3524] bg-[#F5EFE6]/50"
                        : "border-transparent text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <UserPlus className="w-3.5 h-3.5" />
                      Criar Minha Conta
                    </span>
                  </button>
                </div>

                {/* Aba 1: Já Tenho Cadastro */}
                {authTab === "login" ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                      <div>
                        <label className="block text-[#7E7265] mb-1">E-MAIL CADASTRADO *</label>
                        <input
                          type="email"
                          placeholder="mateus.souza@gmail.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#1E3524]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#7E7265] mb-1">SENHA *</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#1E3524]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                      <Button
                        type="button"
                        onClick={handleInlineLogin}
                        className="bg-[#1E3524] hover:bg-[#142418] text-white text-xs font-mono font-semibold py-2.5 px-5 h-auto uppercase tracking-wider"
                      >
                        Entrar e Prosseguir
                      </Button>

                      <button
                        type="button"
                        onClick={() => {
                          setLoginEmail("mateus.souza@gmail.com");
                          setLoginPassword("123456");
                          loginCustomer("mateus.souza@gmail.com", "123456");
                          toast.success("Logado como Mateus Ribeiro de Souza!");
                        }}
                        className="text-[11px] text-[#1E3524] underline hover:text-[#142418] font-mono text-left sm:text-right"
                      >
                        Atalho Demo: mateus.souza@gmail.com
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Aba 2: Criar Minha Conta */
                  <div className="space-y-4 text-xs font-mono">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[#7E7265] mb-1">NOME COMPLETO *</label>
                        <input
                          type="text"
                          placeholder="Seu nome completo"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#1E3524]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#7E7265] mb-1">E-MAIL *</label>
                        <input
                          type="email"
                          placeholder="seu.email@exemplo.com"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#1E3524]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#7E7265] mb-1">WHATSAPP / CELULAR *</label>
                        <input
                          type="tel"
                          placeholder="(11) 99999-9999"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#1E3524]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#7E7265] mb-1">CPF (PARA NOTA FISCAL)</label>
                        <input
                          type="text"
                          placeholder="000.000.000-00"
                          value={regCpf}
                          onChange={(e) => setRegCpf(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#1E3524]"
                        />
                      </div>
                      <div>
                        <label className="block text-[#7E7265] mb-1">CRIAR SENHA *</label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#1E3524]"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        type="button"
                        onClick={handleInlineRegister}
                        className="bg-[#1E3524] hover:bg-[#142418] text-white text-xs font-mono font-semibold py-2.5 px-5 h-auto uppercase tracking-wider"
                      >
                        Cadastrar e Continuar Pedido
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* CLIENTE AUTENTICADO */
              <div id="etapa-identificacao" className="bg-[#FDFCF9] border border-stone-200 p-6 rounded-sm shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 pb-3 border-b border-stone-200">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#1E3524] bg-[#EBF2EB] px-2 py-0.5 rounded font-semibold inline-block mb-1">
                      ✓ CLIENTE AUTENTICADO
                    </span>
                    <h2 className="text-base font-bold uppercase tracking-wide text-[#2E2620]">
                      Etapa 1 de 3 &bull; Dados Pessoais
                    </h2>
                    <p className="text-xs text-stone-600 mt-0.5">
                      Conectado como <strong className="text-[#2E2620]">{customer?.name}</strong> ({customer?.email})
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logoutCustomer();
                      setCustomerName("");
                      setCustomerEmail("");
                      setCustomerPhone("");
                      setCustomerCpf("");
                      toast.info("Você saiu da conta.");
                    }}
                    className="text-xs font-mono text-stone-500 hover:text-red-600 underline flex items-center gap-1 self-start sm:self-auto"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Trocar Conta / Sair
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="sm:col-span-2">
                    <label className="block text-[#7E7265] mb-1">NOME COMPLETO *</label>
                    <input
                      type="text"
                      required
                      placeholder="Seu nome completo"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#2E2620]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#7E7265] mb-1">WHATSAPP / CELULAR *</label>
                    <input
                      type="tel"
                      required
                      placeholder="(11) 99999-9999"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#2E2620]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#7E7265] mb-1">CPF (PARA NOTA FISCAL)</label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      value={customerCpf}
                      onChange={(e) => setCustomerCpf(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#2E2620]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#7E7265] mb-1">E-MAIL (PARA RECEBER RASTREIO)</label>
                    <input
                      type="email"
                      placeholder="seu.email@exemplo.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#2E2620]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. ENDEREÇO DE ENTREGA */}
            <div className="bg-[#FDFCF9] border border-stone-200 p-6 rounded-sm shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C7A68] block mb-1">
                ETAPA 2 DE 3
              </span>
              <h2 className="text-base font-bold uppercase tracking-wide text-[#2E2620] mb-4">
                Endereço de Entrega
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[#7E7265]">CEP *</label>
                    {customer?.address && (
                      <span className="text-[9px] text-[#1E3524] font-semibold">Salvo no Perfil</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="00000-000"
                      maxLength={9}
                      value={cep}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCep(val);
                        if (val.replace(/\D/g, "").length === 8) {
                          handleCepLookup(val);
                        }
                      }}
                      className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#2E2620]"
                    />
                    <button
                      type="button"
                      disabled={isSearchingCep}
                      onClick={() => handleCepLookup(cep)}
                      className="px-3 py-2 bg-[#FAF7F2] border border-stone-300 hover:bg-[#F3EDE3] text-[#2E2620] rounded-sm text-[11px] shrink-0 font-mono"
                    >
                      {isSearchingCep ? "Buscando..." : "Buscar"}
                    </button>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#7E7265] mb-1">RUA / AVENIDA *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Rua das Palmeiras"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#2E2620]"
                  />
                </div>

                <div>
                  <label className="block text-[#7E7265] mb-1">NÚMERO *</label>
                  <input
                    type="text"
                    required
                    placeholder="123"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#2E2620]"
                  />
                </div>

                <div>
                  <label className="block text-[#7E7265] mb-1">COMPLEMENTO</label>
                  <input
                    type="text"
                    placeholder="Apto 42"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#2E2620]"
                  />
                </div>

                <div>
                  <label className="block text-[#7E7265] mb-1">BAIRRO *</label>
                  <input
                    type="text"
                    placeholder="Bairro"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#2E2620]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#7E7265] mb-1">CIDADE *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#2E2620]"
                  />
                </div>

                <div>
                  <label className="block text-[#7E7265] mb-1">ESTADO *</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#2E2620]"
                  />
                </div>
              </div>

              {/* Opções de Frete */}
              <div className="mt-6 pt-4 border-t border-stone-200">
                <span className="text-xs font-mono uppercase tracking-wider text-[#7E7265] block mb-2">
                  MÉTODO DE ENVIO:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setShippingMethod("PAC")}
                    className={`flex items-center justify-between p-3 rounded-sm border text-left transition-all ${
                      shippingMethod === "PAC"
                        ? "border-[#1E3524] bg-[#EBF2EB] text-[#1E3524] font-bold shadow-xs"
                        : "border-stone-200 bg-white text-[#2E2620]"
                    }`}
                  >
                    <div>
                      <div className="uppercase">PAC Padrão (5-8 dias)</div>
                      <div className="text-[10px] text-[#7E7265]">Entrega econômica segura</div>
                    </div>
                    <strong>{isFreeShipping ? "GRÁTIS" : "R$ 14,90"}</strong>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShippingMethod("SEDEX")}
                    className={`flex items-center justify-between p-3 rounded-sm border text-left transition-all ${
                      shippingMethod === "SEDEX"
                        ? "border-[#1E3524] bg-[#EBF2EB] text-[#1E3524] font-bold shadow-xs"
                        : "border-stone-200 bg-white text-[#2E2620]"
                    }`}
                  >
                    <div>
                      <div className="uppercase">SEDEX Expresso (2-4 dias)</div>
                      <div className="text-[10px] text-[#7E7265]">Entrega prioritária rápida</div>
                    </div>
                    <strong>R$ 22,90</strong>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. FORMA DE PAGAMENTO */}
            <div className="bg-[#FDFCF9] border border-stone-200 p-6 rounded-sm shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C7A68] block">
                  ETAPA 3 DE 3
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm bg-[#1E3524] text-white font-bold">
                  Exclusivo à Vista (-5% OFF)
                </span>
              </div>
              <h2 className="text-base font-bold uppercase tracking-wide text-[#2E2620] mb-4">
                Forma de Pagamento
              </h2>

              <div className="p-4 rounded-sm border-2 border-[#1E3524] bg-[#EBF2EB] text-[#1E3524] shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#1E3524] text-white flex items-center justify-center shrink-0">
                      <QrCode className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold font-mono uppercase flex items-center gap-2">
                        <span>PIX Instantâneo Oficial</span>
                        <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-[#1E3524] text-white font-bold">
                          -5% OFF
                        </span>
                      </div>
                      <div className="text-[11px] text-[#3D5239] font-mono mt-0.5">
                        Aprovação imediata &bull; QR Code dinâmico e código Copia e Cola
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#D5E4D5] flex items-center justify-between text-[11px] font-mono text-[#24422B]">
                  <span>Venda exclusiva via PIX</span>
                  <span className="font-bold text-[#1E3524]">5% de desconto aplicado no pedido</span>
                </div>
              </div>

              <p className="text-[11px] font-mono text-stone-500 mt-3">
                * No momento, as compras na loja são realizadas exclusivamente via PIX para garantir despacho prioritário e o melhor valor com 5% de desconto à vista.
              </p>
            </div>

          </div>

          {/* COLUNA DIREITA: RESUMO DO PEDIDO & FINALIZAÇÃO (5 colunas) */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-[#FDFCF9] border border-stone-300 p-6 rounded-sm shadow-md">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C7A68] block mb-2">
                RESUMO DO PEDIDO
              </span>

              {/* Item Selecionado */}
              <div className="flex gap-4 pb-5 border-b border-stone-200">
                <div className="relative h-24 w-20 bg-[#F3EDE3] rounded-sm overflow-hidden border border-stone-200 shrink-0">
                  <Image
                    src={matchingImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#8C7A68]">
                    {product.categoryName}
                  </span>
                  <h3 className="text-xs font-bold uppercase font-mono text-[#2E2620] leading-snug">
                    {product.name}
                  </h3>
                  <div className="text-[11px] font-mono text-[#7E7265] mt-1">
                    Cor: <strong>{colorParam}</strong> &bull; Tam: <strong>{sizeParam}</strong>
                  </div>

                  {/* Quantidade */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-6 w-6 rounded-sm border border-stone-300 bg-[#FAF7F2] text-xs font-mono font-bold flex items-center justify-center hover:bg-stone-200"
                    >
                      -
                    </button>
                    <span className="text-xs font-mono font-bold w-4 text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-6 w-6 rounded-sm border border-stone-300 bg-[#FAF7F2] text-xs font-mono font-bold flex items-center justify-center hover:bg-stone-200"
                    >
                      +
                    </button>
                    <span className="text-xs font-bold font-mono text-[#1E3524] ml-auto">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cupom de Desconto */}
              <div className="py-4 border-b border-stone-200">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C7A68] block mb-1.5">
                  Possui cupom de desconto?
                </span>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-sm text-xs font-mono text-emerald-800">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-bold">{appliedCoupon.code}</span>
                      <span>
                        ({appliedCoupon.type === "PERCENT" ? "10% OFF" : appliedCoupon.type === "FIXED" ? "- R$ 20,00" : "Frete Grátis"})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="p-1 hover:bg-emerald-100 rounded text-emerald-700"
                      title="Remover cupom"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ex: THEVINE10"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-sm text-xs font-mono uppercase focus:outline-none focus:border-[#2E2620]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-3 py-1.5 bg-[#1E3524] text-white hover:bg-[#152519] rounded-sm text-xs font-mono font-medium"
                      >
                        Aplicar
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono text-stone-500">
                      <span>Sugestão:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setCouponInput("THEVINE10");
                        }}
                        className="underline hover:text-[#1E3524]"
                      >
                        THEVINE10
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => {
                          setCouponInput("PRIMEIRACOMPRA");
                        }}
                        className="underline hover:text-[#1E3524]"
                      >
                        PRIMEIRACOMPRA
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Ficha de Valores */}
              <div className="py-4 space-y-2 text-xs font-mono text-[#52463C] border-b border-stone-200">
                <div className="flex justify-between">
                  <span>Subtotal ({quantity} {quantity === 1 ? "peça" : "peças"}):</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Cupom ({appliedCoupon?.code}):</span>
                    <span>- {formatCurrency(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Frete ({shippingMethod}):</span>
                  <span>{shippingCost === 0 ? "GRÁTIS" : formatCurrency(shippingCost)}</span>
                </div>
                {paymentMethod === "PIX" && (
                  <div className="flex justify-between text-[#1E3524] font-semibold">
                    <span>Desconto PIX (5%):</span>
                    <span>- {formatCurrency(pixDiscount)}</span>
                  </div>
                )}
              </div>

              {/* Total Final */}
              <div className="py-4 border-b border-stone-200 flex items-baseline justify-between">
                <span className="text-sm font-bold font-mono uppercase text-[#2E2620]">
                  TOTAL A PAGAR:
                </span>
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-[#1E3524]">
                    {formatCurrency(totalAmount)}
                  </div>
                  {paymentMethod === "PIX" ? (
                    <span className="text-[10px] font-mono text-[#586E53]">
                      no PIX à vista
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-[#7E7265]">
                      ou até 3x de {formatCurrency(totalAmount / 3)} sem juros
                    </span>
                  )}
                </div>
              </div>

              {/* Botão de Conclusão */}
              <div className="mt-6 space-y-3">
                <Button
                  type="submit"
                  className="w-full h-14 bg-[#1E3524] hover:bg-[#142418] text-white font-mono uppercase tracking-widest text-xs font-bold rounded-sm gap-2 shadow-lg transition-transform active:scale-[0.99]"
                >
                  <Sparkles className="h-4 w-4" />
                  {isCustomerAuthenticated
                    ? paymentMethod === "PIX"
                      ? "Gerar QR Code PIX e Finalizar"
                      : "Continuar para Pagamento"
                    : "Faça Login ou Cadastre-se para Finalizar"}
                </Button>

                <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#7E7265]">
                  <ShieldCheck className="h-4 w-4 text-[#1E3524]" />
                  <span>Compra 100% Segura &bull; Envio Rastreado</span>
                </div>
              </div>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
