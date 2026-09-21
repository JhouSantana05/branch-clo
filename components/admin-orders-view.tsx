"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { INITIAL_ORDERS, OrderData } from "@/lib/orders";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  Search,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Filter,
  RefreshCw,
  ShoppingBag,
  MapPin,
  User,
  Phone,
  Calendar,
  AlertCircle,
  Lock,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const STATUS_LABELS: Record<OrderData["status"], { label: string; bg: string; text: string; border: string }> = {
  AGUARDANDO_PIX: {
    label: "Aguardando PIX",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
  },
  PAGO: {
    label: "PIX Confirmado",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
  },
  EM_SEPARACAO: {
    label: "Em Separação",
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-200",
  },
  ENVIADO: {
    label: "Enviado / Rastreio",
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-200",
  },
  ENTREGUE: {
    label: "Entregue",
    bg: "bg-stone-100",
    text: "text-stone-700",
    border: "border-stone-300",
  },
};

export function AdminOrdersView() {
  const { admin, isAdminAuthenticated, loginAdmin, logoutAdmin } = useAuth();
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [orders, setOrders] = useState<OrderData[]>(INITIAL_ORDERS);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleStatusChange = (orderId: string, newStatus: OrderData["status"]) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    toast.success(`Status do pedido atualizado para "${STATUS_LABELS[newStatus].label}"`);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "ALL" || order.status === filterStatus;
    const term = searchTerm.toLowerCase().trim();
    if (!term) return matchesStatus;

    const matchesSearch =
      order.orderNumber.toLowerCase().includes(term) ||
      order.customerName.toLowerCase().includes(term) ||
      order.customerEmail.toLowerCase().includes(term) ||
      order.customerPhone.includes(term) ||
      order.shippingAddress.city.toLowerCase().includes(term) ||
      order.items.some((i) => i.productName.toLowerCase().includes(term));

    return matchesStatus && matchesSearch;
  });

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
  const pendingCount = orders.filter((o) => o.status === "AGUARDANDO_PIX" || o.status === "EM_SEPARACAO").length;

  const sendWhatsAppUpdate = (order: OrderData) => {
    const cleanPhone = order.customerPhone.replace(/\D/g, "");
    const phoneWithDDI = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
    const message = encodeURIComponent(
      `Olá ${order.customerName}! Aqui é da equipe da BRANCH CLO. ✨\n\n` +
      `Passando para atualizar o status do seu pedido *${order.orderNumber}*:\n` +
      `📦 Status atual: *${STATUS_LABELS[order.status].label}*\n\n` +
      `Itens: ${order.items.map((i) => `${i.quantity}x ${i.productName} (${i.color}/${i.size})`).join(", ")}\n` +
      `Destino: ${order.shippingAddress.city} - ${order.shippingAddress.state}\n\n` +
      `Muito obrigado por fazer parte da família Branch Clo! Caso tenha dúvidas estamos à disposição.`
    );
    window.open(`https://wa.me/${phoneWithDDI}?text=${message}`, "_blank");
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-16 text-center font-sans">
        <div className="bg-white border border-[#E8E1D5] rounded-2xl p-8 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded">
            Acesso Restrito
          </span>
          <h2 className="text-2xl font-serif font-bold text-[#2E2620] mt-3">
            Gestão de Pedidos
          </h2>
          <p className="text-xs text-stone-600 mt-1 mb-6">
            Identifique-se como proprietário da BRANCH CLO para gerenciar os pedidos e despachos.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const ok = loginAdmin(adminEmail, adminPassword);
              if (ok) toast.success("Acesso autorizado!");
              else toast.error("Credenciais inválidas.");
            }}
            className="space-y-3 text-xs font-mono text-left"
          >
            <div>
              <label className="block text-stone-700 mb-1">E-MAIL DO ADMINISTRADOR *</label>
              <input
                type="text"
                required
                placeholder="admin@branchclo.com.br"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
              />
            </div>
            <div>
              <label className="block text-stone-700 mb-1">SENHA *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#1E3524] hover:bg-[#152519] text-white py-2.5 h-auto font-mono text-xs uppercase"
            >
              Acessar Painel
            </Button>
          </form>

          <div className="mt-4 pt-4 border-t border-[#E8E1D5] text-center">
            <button
              type="button"
              onClick={() => {
                setAdminEmail("admin@branchclo.com.br");
                setAdminPassword("branch2026");
              }}
              className="text-[11px] text-[#1E3524] underline"
            >
              Preenchimento rápido: admin@branchclo.com.br
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E8E1D5] pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono tracking-widest text-[#1E3524] uppercase bg-[#EAE3D2] px-2.5 py-0.5 rounded">
              Backoffice / Expedição
            </span>
            <span className="text-xs text-stone-500 font-mono">BRANCH CLO. v2.0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#2E2620] tracking-tight">
            Gestão de Pedidos e Entregas
          </h1>
          <p className="text-stone-600 text-sm mt-1">
            Acompanhe pedidos via PIX, gere comunicações no WhatsApp e controle despachos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link href="/admin/produtos">
            <Button variant="outline" size="sm" className="border-[#2E2620]/20 text-[#2E2620] hover:bg-[#F5EFE6] text-xs font-mono">
              Gestão de Estoque
            </Button>
          </Link>
          <Link href="/">
            <Button size="sm" className="bg-[#1E3524] hover:bg-[#152519] text-white text-xs font-mono">
              Loja Online
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              logoutAdmin();
              toast.info("Sessão encerrada.");
            }}
            className="text-stone-500 hover:text-red-600 text-xs font-mono flex items-center gap-1 h-9 px-2.5"
            title="Encerrar Sessão de Administrador"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#F5EFE6] border border-[#E8E1D5] p-5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between text-stone-600 text-xs font-mono uppercase tracking-wider mb-2">
            <span>Total de Pedidos</span>
            <Package className="w-4 h-4 text-stone-500" />
          </div>
          <p className="text-2xl font-serif text-[#2E2620] font-bold">{orders.length}</p>
          <p className="text-xs text-stone-500 mt-1">Histórico completo registrado</p>
        </div>

        <div className="bg-[#F5EFE6] border border-[#E8E1D5] p-5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between text-stone-600 text-xs font-mono uppercase tracking-wider mb-2">
            <span>Pendentes / Em Separação</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-serif text-[#2E2620] font-bold text-amber-900">{pendingCount}</p>
          <p className="text-xs text-amber-700/80 mt-1">Requerem atenção ou despacho</p>
        </div>

        <div className="bg-[#F5EFE6] border border-[#E8E1D5] p-5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between text-stone-600 text-xs font-mono uppercase tracking-wider mb-2">
            <span>Faturamento Bruto</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-serif text-[#2E2620] font-bold text-[#1E3524]">
            {formatCurrency(totalRevenue)}
          </p>
          <p className="text-xs text-emerald-800/80 mt-1">100% via PIX com desconto à vista</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#F5EFE6] border border-[#E8E1D5] p-4 rounded-lg mb-6 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            placeholder="Buscar por nº pedido, cliente, email ou produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#E8E1D5] rounded text-[#2E2620] focus:outline-none focus:border-[#1E3524]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: "ALL", label: "Todos" },
            { id: "AGUARDANDO_PIX", label: "Aguardando PIX" },
            { id: "EM_SEPARACAO", label: "Em Separação" },
            { id: "ENVIADO", label: "Enviado" },
            { id: "ENTREGUE", label: "Entregue" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded font-mono transition-colors ${
                filterStatus === tab.id
                  ? "bg-[#2E2620] text-white"
                  : "bg-white border border-[#E8E1D5] text-stone-700 hover:bg-[#FAF7F2]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-[#E8E1D5] rounded-lg p-12 text-center">
          <AlertCircle className="w-10 h-10 mx-auto text-stone-400 mb-3" />
          <h3 className="text-lg font-serif text-[#2E2620]">Nenhum pedido encontrado</h3>
          <p className="text-sm text-stone-500 mt-1">
            Tente ajustar os termos de busca ou remover o filtro de status selecionado.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("ALL");
            }}
            className="mt-4 border-[#2E2620]/20"
          >
            Limpar Filtros
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusConfig = STATUS_LABELS[order.status];

            return (
              <div
                key={order.id}
                className="bg-white border border-[#E8E1D5] rounded-lg shadow-sm hover:border-[#1E3524]/40 transition-colors overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="bg-[#FAF7F2] px-5 py-3.5 border-b border-[#E8E1D5] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-[#2E2620]">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded border font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                    >
                      {statusConfig.label}
                    </span>
                    <span className="text-xs text-stone-500 font-mono hidden sm:inline">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Quick Change Status Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500 hidden md:inline">Mudar status:</span>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderData["status"])}
                      className="text-xs bg-white border border-[#E8E1D5] rounded px-2 py-1 text-[#2E2620] focus:outline-none focus:border-[#1E3524]"
                    >
                      <option value="AGUARDANDO_PIX">Aguardando PIX</option>
                      <option value="PAGO">PIX Confirmado</option>
                      <option value="EM_SEPARACAO">Em Separação</option>
                      <option value="ENVIADO">Enviado</option>
                      <option value="ENTREGUE">Entregue</option>
                    </select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => sendWhatsAppUpdate(order)}
                      className="text-xs border-emerald-700/30 text-emerald-800 hover:bg-emerald-50 flex items-center gap-1.5 h-7 px-2.5"
                      title="Enviar atualização ao cliente no WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </Button>
                  </div>
                </div>

                {/* Order Details Body */}
                <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Customer & Delivery Info (5 cols) */}
                  <div className="lg:col-span-5 space-y-4 text-xs border-b lg:border-b-0 lg:border-r border-[#E8E1D5] pb-4 lg:pb-0 lg:pr-6">
                    <div>
                      <h4 className="font-mono uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> Cliente
                      </h4>
                      <p className="font-medium text-[#2E2620] text-sm">{order.customerName}</p>
                      <p className="text-stone-600 mt-0.5">CPF: {order.customerCpf}</p>
                      <p className="text-stone-600">{order.customerEmail}</p>
                      <p className="text-stone-600">{order.customerPhone}</p>
                    </div>

                    <div>
                      <h4 className="font-mono uppercase tracking-wider text-stone-500 mb-1.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Endereço de Envio
                      </h4>
                      <p className="text-stone-800">
                        {order.shippingAddress.street}, {order.shippingAddress.number}
                        {order.shippingAddress.complement ? ` - ${order.shippingAddress.complement}` : ""}
                      </p>
                      <p className="text-stone-600">
                        {order.shippingAddress.neighborhood} — {order.shippingAddress.city}/{order.shippingAddress.state}
                      </p>
                      <p className="text-stone-600 font-mono mt-0.5">CEP: {order.shippingAddress.postalCode}</p>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E8E1D5] font-mono text-[11px] text-stone-700">
                          {order.shippingMethod} — {order.shippingCost === 0 ? "Frete Grátis" : formatCurrency(order.shippingCost)}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 font-mono text-[11px] text-emerald-800">
                          {order.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Items List & Total Summary (7 cols) */}
                  <div className="lg:col-span-7 flex flex-col justify-between">
                    <div>
                      <h4 className="font-mono uppercase tracking-wider text-stone-500 text-xs mb-3 flex items-center gap-1">
                        <ShoppingBag className="w-3.5 h-3.5" /> Itens do Pedido ({order.items.reduce((a, b) => a + b.quantity, 0)})
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-[#FAF7F2] p-2.5 rounded border border-[#E8E1D5]">
                            <div className="relative w-12 h-14 rounded overflow-hidden flex-shrink-0 bg-stone-200">
                              <Image
                                src={item.imageUrl}
                                alt={item.productName}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-[#2E2620] line-clamp-1">
                                {item.productName}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5 font-mono">
                                <span>Cor: {item.color}</span>
                                <span>•</span>
                                <span>Tam: {item.size}</span>
                                <span>•</span>
                                <span>Qtd: {item.quantity}</span>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0 font-mono text-xs font-semibold text-[#2E2620]">
                              {formatCurrency(item.unitPrice * item.quantity)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="mt-4 pt-4 border-t border-[#E8E1D5] flex flex-wrap items-center justify-between text-xs gap-3">
                      <div className="text-stone-500 space-x-3">
                        <span>Subtotal: {formatCurrency(order.subtotal)}</span>
                        {order.discount > 0 && (
                          <span className="text-emerald-700">Desconto PIX: -{formatCurrency(order.discount)}</span>
                        )}
                        <span>Frete: {order.shippingCost === 0 ? "Grátis" : formatCurrency(order.shippingCost)}</span>
                      </div>
                      <div className="text-sm font-mono font-bold text-[#1E3524]">
                        Total Pago: {formatCurrency(order.total)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
