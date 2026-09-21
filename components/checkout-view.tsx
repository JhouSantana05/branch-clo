"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { OFFICIAL_PRODUCTS } from "@/lib/catalog";
import { formatCurrency } from "@/lib/utils";
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
  CreditCard,
} from "lucide-react";

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
  const [paymentMethod, setPaymentMethod] = useState<"PIX" | "CREDIT_CARD">("PIX");

  // Dados do Cliente
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerCpf, setCustomerCpf] = useState("");

  // Endereço
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("São Paulo");
  const [state, setState] = useState("SP");

  // Pedido Criado
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [generatedOrderNumber, setGeneratedOrderNumber] = useState("");
  const [countdown, setCountdown] = useState(15 * 60); // 15 minutos em segundos

  // Cálculos
  const subtotal = unitPrice * quantity;
  const isFreeShipping = subtotal >= 399;
  const shippingCost = isFreeShipping
    ? 0
    : shippingMethod === "PAC"
    ? 14.9
    : 22.9;

  const pixDiscount = paymentMethod === "PIX" ? subtotal * 0.05 : 0;
  const totalAmount = subtotal + shippingCost - pixDiscount;

  // Simulação de busca de CEP
  const handleCepLookup = () => {
    if (cep.replace(/\D/g, "").length === 8) {
      toast.success("Endereço localizado via CEP!");
      setStreet("Rua das Oliveiras");
      setNeighborhood("Jardins");
      setCity("São Paulo");
      setState("SP");
    } else {
      toast.error("Digite um CEP válido com 8 dígitos");
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

    if (!customerName || !customerPhone || !street || !number) {
      toast.error("Por favor, preencha os campos obrigatórios de entrega");
      return;
    }

    const orderNum = `#BC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedOrderNumber(orderNum);
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
        `*Frete:* ${shippingMethod} (${formatCurrency(shippingCost)})\n` +
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

          {/* Área do PIX */}
          {paymentMethod === "PIX" ? (
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
          ) : (
            <div className="py-8 text-center border-b border-stone-200">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F5EFE6] text-[#2E2620] rounded-sm text-xs font-mono font-semibold mb-4">
                <CreditCard className="h-4 w-4" />
                <span>Pagamento via Cartão de Crédito</span>
              </div>
              <div className="text-2xl font-bold font-mono text-[#2E2620] mt-2">
                {formatCurrency(totalAmount)}
              </div>
              <p className="text-xs font-mono text-[#7E7265] mt-1">
                Transação processada em ambiente 100% criptografado.
              </p>
            </div>
          )}

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
            
            {/* 1. DADOS PESSOAIS */}
            <div className="bg-[#FDFCF9] border border-stone-200 p-6 rounded-sm shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C7A68] block mb-1">
                ETAPA 1 DE 3
              </span>
              <h2 className="text-base font-bold uppercase tracking-wide text-[#2E2620] mb-4">
                Dados Pessoais
              </h2>

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
                  <label className="block text-[#7E7265] mb-1">CEP *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="00000-000"
                      maxLength={9}
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#2E2620]"
                    />
                    <button
                      type="button"
                      onClick={handleCepLookup}
                      className="px-3 py-2 bg-[#FAF7F2] border border-stone-300 hover:bg-[#F3EDE3] text-[#2E2620] rounded-sm text-[11px]"
                    >
                      Buscar
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
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C7A68] block mb-1">
                ETAPA 3 DE 3
              </span>
              <h2 className="text-base font-bold uppercase tracking-wide text-[#2E2620] mb-4">
                Forma de Pagamento
              </h2>

              <div className="space-y-3">
                {/* Opção PIX */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("PIX")}
                  className={`w-full flex items-center justify-between p-4 rounded-sm border text-left transition-all ${
                    paymentMethod === "PIX"
                      ? "border-[#1E3524] bg-[#EBF2EB] text-[#1E3524] shadow-xs"
                      : "border-stone-200 bg-white text-[#2E2620]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <QrCode className="h-5 w-5 text-[#1E3524]" />
                    <div>
                      <div className="text-xs font-bold font-mono uppercase">
                        PIX (QR Code & Copia e Cola)
                      </div>
                      <div className="text-[11px] text-[#586E53] font-mono">
                        Aprovação instantânea + 5% de desconto à vista
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm bg-[#1E3524] text-white font-bold">
                    -5% OFF
                  </span>
                </button>

                {/* Opção Cartão de Crédito */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("CREDIT_CARD")}
                  className={`w-full flex items-center justify-between p-4 rounded-sm border text-left transition-all ${
                    paymentMethod === "CREDIT_CARD"
                      ? "border-[#1E3524] bg-[#EBF2EB] text-[#1E3524] shadow-xs"
                      : "border-stone-200 bg-white text-[#2E2620]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-[#2E2620]" />
                    <div>
                      <div className="text-xs font-bold font-mono uppercase">
                        Cartão de Crédito
                      </div>
                      <div className="text-[11px] text-[#7E7265] font-mono">
                        Em até 3x sem juros no checkout
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase text-[#7E7265]">
                    Até 3x
                  </span>
                </button>
              </div>
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

              {/* Ficha de Valores */}
              <div className="py-4 space-y-2 text-xs font-mono text-[#52463C] border-b border-stone-200">
                <div className="flex justify-between">
                  <span>Subtotal ({quantity} {quantity === 1 ? "peça" : "peças"}):</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
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
                  {paymentMethod === "PIX"
                    ? "Gerar QR Code PIX e Finalizar"
                    : "Continuar para Pagamento"}
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
