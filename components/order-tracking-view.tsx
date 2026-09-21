"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { INITIAL_ORDERS, OrderData } from "@/lib/orders";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  Copy,
  MessageCircle,
  AlertCircle,
  Sparkles,
  ArrowRight
} from "lucide-react";

const TRACKING_STEPS = [
  { key: "CRIADO", label: "Pedido Registrado", desc: "Aguardando confirmação bancária" },
  { key: "PAGO", label: "PIX Confirmado", desc: "Pagamento validado com sucesso" },
  { key: "EM_SEPARACAO", label: "Em Separação", desc: "Peça selecionada e embalada com carinho" },
  { key: "ENVIADO", label: "Despachado", desc: "Em trânsito via Correios" },
  { key: "ENTREGUE", label: "Entregue", desc: "Pedido entregue ao destinatário" },
];

function getStepIndex(status: OrderData["status"]): number {
  switch (status) {
    case "AGUARDANDO_PIX":
      return 0;
    case "PAGO":
      return 1;
    case "EM_SEPARACAO":
      return 2;
    case "ENVIADO":
      return 3;
    case "ENTREGUE":
      return 4;
    default:
      return 0;
  }
}

export function OrderTrackingView() {
  const searchParams = useSearchParams();
  const queryOrder = searchParams.get("pedido") || "";

  const [searchInput, setSearchInput] = useState(queryOrder);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (queryOrder) {
      handleSearch(queryOrder);
    }
  }, [queryOrder]);

  const handleSearch = (termToSearch?: string) => {
    const term = (termToSearch !== undefined ? termToSearch : searchInput).trim().toLowerCase();
    setSearched(true);

    if (!term) {
      setSelectedOrder(null);
      return;
    }

    const cleanTerm = term.replace(/[#\s.-]/g, "");

    const found = INITIAL_ORDERS.find((ord) => {
      const cleanOrderNum = ord.orderNumber.toLowerCase().replace(/[#\s.-]/g, "");
      const cleanCpf = ord.customerCpf.replace(/\D/g, "");
      const cleanPhone = ord.customerPhone.replace(/\D/g, "");

      return (
        cleanOrderNum.includes(cleanTerm) ||
        cleanCpf.includes(cleanTerm) ||
        cleanPhone.includes(cleanTerm) ||
        ord.customerEmail.toLowerCase().includes(term)
      );
    });

    setSelectedOrder(found || null);
  };

  const copyTrackingCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Código de rastreio copiado para a área de transferência!");
  };

  const currentStep = selectedOrder ? getStepIndex(selectedOrder.status) : 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
        <span className="text-[11px] font-mono tracking-widest text-[#1E3524] uppercase bg-[#EAE3D2] px-3 py-1 rounded">
          Central de Rastreamento
        </span>
        <h1 className="text-2xl sm:text-4xl font-serif text-[#2E2620] mt-3">
          Acompanhe Seu Pedido
        </h1>
        <p className="text-stone-600 text-sm mt-2">
          Insira o número do seu pedido (ex: <strong className="text-[#2E2620]">#BC-2026-1002</strong>) ou seu CPF para ver o status em tempo real.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white border border-[#E8E1D5] rounded-xl p-4 sm:p-6 shadow-sm mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Digite o número do pedido (#BC-2026-...) ou CPF"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg text-sm text-[#2E2620] focus:outline-none focus:border-[#1E3524] font-mono"
            />
          </div>
          <Button
            type="submit"
            className="bg-[#1E3524] hover:bg-[#152519] text-white px-6 py-3 h-auto font-mono text-xs tracking-wider"
          >
            RASTREAR
          </Button>
        </form>

        {/* Quick Demo Links */}
        <div className="mt-4 pt-3 border-t border-[#E8E1D5]/60 flex flex-wrap items-center gap-2 text-xs text-stone-500">
          <span className="font-mono">Exemplos rápidos:</span>
          <button
            type="button"
            onClick={() => {
              setSearchInput("#BC-2026-1002");
              handleSearch("#BC-2026-1002");
            }}
            className="underline hover:text-[#1E3524] font-mono font-medium"
          >
            #BC-2026-1002 (Enviado / Correios)
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              setSearchInput("#BC-2026-1001");
              handleSearch("#BC-2026-1001");
            }}
            className="underline hover:text-[#1E3524] font-mono font-medium"
          >
            #BC-2026-1001 (Em Separação)
          </button>
        </div>
      </div>

      {/* Search Results */}
      {selectedOrder ? (
        <div className="space-y-6">
          {/* Order Header Card */}
          <div className="bg-white border border-[#E8E1D5] rounded-xl p-5 sm:p-7 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8E1D5] pb-5 mb-6">
              <div>
                <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
                  Pedido Confirmado
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2E2620] mt-0.5">
                  {selectedOrder.orderNumber}
                </h2>
                <p className="text-xs text-stone-500 mt-1 font-mono">
                  Data da Compra:{" "}
                  {new Date(selectedOrder.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-stone-500 font-mono block">Destinatário</span>
                <span className="text-sm font-semibold text-[#2E2620]">{selectedOrder.customerName}</span>
                <span className="text-xs text-stone-500 block font-mono">
                  {selectedOrder.shippingAddress.city}/{selectedOrder.shippingAddress.state}
                </span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="py-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-stone-500 mb-6">
                Progresso do Envio
              </h3>

              <div className="relative">
                {/* Timeline Bar */}
                <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-stone-200">
                  <div
                    className="h-full bg-[#1E3524] transition-all duration-500"
                    style={{
                      width: `${(currentStep / (TRACKING_STEPS.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative">
                  {TRACKING_STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <div key={step.key} className="flex sm:flex-col items-start sm:items-center text-left sm:text-center gap-3 sm:gap-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-colors z-10 ${
                            isCompleted
                              ? "bg-[#1E3524] text-white ring-4 ring-[#EAE3D2]"
                              : "bg-white border-2 border-stone-300 text-stone-400"
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                        </div>
                        <div>
                          <p
                            className={`text-xs font-semibold ${
                              isCurrent ? "text-[#1E3524] font-bold" : isCompleted ? "text-[#2E2620]" : "text-stone-400"
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="text-[11px] text-stone-500 leading-tight mt-0.5">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tracking Code Banner (If Shipped) */}
            {selectedOrder.trackingCode && (
              <div className="mt-8 bg-[#F5EFE6] border border-[#E8E1D5] rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded border border-[#E8E1D5]">
                    <Truck className="w-5 h-5 text-[#1E3524]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
                      Código de Rastreamento ({selectedOrder.shippingMethod})
                    </span>
                    <span className="text-sm font-mono font-bold text-[#2E2620]">
                      {selectedOrder.trackingCode}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyTrackingCode(selectedOrder.trackingCode!)}
                    className="text-xs border-[#2E2620]/20 hover:bg-white flex-1 sm:flex-initial"
                  >
                    <Copy className="w-3.5 h-3.5 mr-1.5" /> Copiar Código
                  </Button>
                  <a
                    href={`https://rastreamento.correios.com.br/app/index.php?objeto=${selectedOrder.trackingCode}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-initial"
                  >
                    <Button
                      size="sm"
                      className="text-xs bg-[#1E3524] hover:bg-[#152519] text-white flex items-center gap-1.5 w-full"
                    >
                      <span>Rastrear Correios</span>
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Items & Shipping Address Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Products List (7 cols) */}
            <div className="md:col-span-7 bg-white border border-[#E8E1D5] rounded-xl p-5 shadow-sm">
              <h3 className="text-xs font-mono uppercase tracking-wider text-stone-500 mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-[#1E3524]" /> Peças Inclusas no Pacote
              </h3>

              <div className="space-y-3">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-[#FAF7F2] p-3 rounded-lg border border-[#E8E1D5]">
                    <div className="relative w-12 h-14 rounded overflow-hidden bg-stone-200 flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#2E2620] line-clamp-1">{item.productName}</p>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5 font-mono">
                        <span>Cor: {item.color}</span>
                        <span>•</span>
                        <span>Tam: {item.size}</span>
                        <span>•</span>
                        <span>Qtd: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right font-mono text-xs font-semibold text-[#2E2620]">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-[#E8E1D5] flex items-center justify-between text-xs font-mono">
                <span className="text-stone-500">Total com Desconto PIX:</span>
                <span className="font-bold text-sm text-[#1E3524]">{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Address & Support Card (5 cols) */}
            <div className="md:col-span-5 space-y-4">
              <div className="bg-white border border-[#E8E1D5] rounded-xl p-5 shadow-sm">
                <h3 className="text-xs font-mono uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#1E3524]" /> Endereço de Entrega
                </h3>
                <p className="text-xs text-[#2E2620] font-medium leading-relaxed">
                  {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.number}
                  {selectedOrder.shippingAddress.complement ? ` - ${selectedOrder.shippingAddress.complement}` : ""}
                </p>
                <p className="text-xs text-stone-600 mt-0.5">
                  {selectedOrder.shippingAddress.neighborhood}
                </p>
                <p className="text-xs text-stone-600">
                  {selectedOrder.shippingAddress.city} — {selectedOrder.shippingAddress.state}
                </p>
                <p className="text-xs font-mono text-stone-500 mt-1">
                  CEP: {selectedOrder.shippingAddress.postalCode}
                </p>

                <div className="mt-3 pt-3 border-t border-[#E8E1D5] flex items-center justify-between text-xs">
                  <span className="font-mono text-stone-500">Envio: {selectedOrder.shippingMethod}</span>
                  <span className="font-mono text-emerald-800 font-medium">
                    {selectedOrder.shippingCost === 0 ? "Frete Grátis" : formatCurrency(selectedOrder.shippingCost)}
                  </span>
                </div>
              </div>

              {/* Need Help WhatsApp */}
              <div className="bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl p-5">
                <h4 className="text-xs font-semibold text-[#2E2620] mb-1">Dúvidas sobre o pedido?</h4>
                <p className="text-xs text-stone-600 mb-3">
                  Nossa equipe de suporte no WhatsApp está disponível para te ajudar.
                </p>
                <a
                  href={`https://wa.me/5511999999999?text=${encodeURIComponent(
                    `Olá! Gostaria de ajuda sobre o meu pedido ${selectedOrder.orderNumber}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs border-emerald-700/30 text-emerald-800 hover:bg-emerald-50 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Falar no WhatsApp</span>
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : searched ? (
        <div className="bg-white border border-[#E8E1D5] rounded-xl p-10 text-center">
          <AlertCircle className="w-10 h-10 mx-auto text-stone-400 mb-3" />
          <h3 className="text-lg font-serif text-[#2E2620]">Nenhum pedido encontrado</h3>
          <p className="text-sm text-stone-500 mt-1 max-w-md mx-auto">
            Não encontramos registros com os dados digitados. Verifique o número do pedido (ex: #BC-2026-1001) ou CPF informado.
          </p>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchInput("#BC-2026-1002");
                handleSearch("#BC-2026-1002");
              }}
              className="text-xs border-[#2E2620]/20"
            >
              Testar com #BC-2026-1002
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
