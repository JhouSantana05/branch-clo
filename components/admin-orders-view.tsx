"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { OrderData, getStoredOrders, updateOrderStatus } from "@/lib/orders";
import {
  CustomerReview,
  getStoredReviews,
  toggleReviewFeatured,
  deleteReview,
} from "@/lib/reviews";
import {
  CouponData,
  CouponDiscountType,
  getStoredCoupons,
  createCoupon,
  deleteCoupon,
  toggleCouponStatus,
  isCouponExpired,
} from "@/lib/coupons";
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
  Star,
  Trash2,
  Eye,
  EyeOff,
  Check,
  Sparkles,
  Tag,
  Plus,
  Copy,
  X,
  Percent,
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
    label: "Enviado / Em Trânsito",
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
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "coupons" ? "coupons" : "orders";

  const { admin, isAdminAuthenticated, loginAdmin, logoutAdmin } = useAuth();
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [adminTab, setAdminTab] = useState<"orders" | "reviews" | "coupons">(initialTab);

  const [orders, setOrders] = useState<OrderData[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Reviews State
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [reviewsFilter, setReviewsFilter] = useState<"ALL" | "FEATURED" | "NOT_FEATURED">("ALL");
  const [reviewsSearch, setReviewsSearch] = useState<string>("");

  // Cupons State
  const [coupons, setCoupons] = useState<CouponData[]>([]);
  const [couponSearch, setCouponSearch] = useState<string>("");
  const [couponModalOpen, setCouponModalOpen] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>("");
  const [couponName, setCouponName] = useState<string>("");
  const [couponType, setCouponType] = useState<CouponDiscountType>("PERCENT");
  const [couponValue, setCouponValue] = useState<string>("10");
  const [couponValidUntil, setCouponValidUntil] = useState<string>("");
  const [couponMinOrder, setCouponMinOrder] = useState<string>("");

  useEffect(() => {
    setOrders(getStoredOrders());
    setReviews(getStoredReviews());
    setCoupons(getStoredCoupons());

    const handleOrdersSync = () => setOrders(getStoredOrders());
    const handleReviewsSync = () => setReviews(getStoredReviews());
    const handleCouponsSync = () => setCoupons(getStoredCoupons());

    window.addEventListener("branch_clo_orders_updated", handleOrdersSync);
    window.addEventListener("branch_clo_reviews_updated", handleReviewsSync);
    window.addEventListener("branch_clo_coupons_updated", handleCouponsSync);

    return () => {
      window.removeEventListener("branch_clo_orders_updated", handleOrdersSync);
      window.removeEventListener("branch_clo_reviews_updated", handleReviewsSync);
      window.removeEventListener("branch_clo_coupons_updated", handleCouponsSync);
    };
  }, []);

  const handleStatusChange = (orderId: string, newStatus: OrderData["status"]) => {
    const updated = updateOrderStatus(orderId, newStatus);
    setOrders(updated);
    toast.success(`Status do pedido atualizado para "${STATUS_LABELS[newStatus].label}"`);
  };

  const handleToggleFeatured = (reviewId: string, currentFeatured: boolean) => {
    const updated = toggleReviewFeatured(reviewId, !currentFeatured);
    setReviews(updated);
    if (!currentFeatured) {
      toast.success("Avaliação adicionada aos destaques do final da Home!");
    } else {
      toast.info("Avaliação removida dos destaques da Home.");
    }
  };

  const handleDeleteReview = (reviewId: string) => {
    if (confirm("Tem certeza que deseja excluir esta avaliação?")) {
      const updated = deleteReview(reviewId);
      setReviews(updated);
      toast.success("Avaliação removida.");
    }
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

  const filteredReviews = reviews.filter((r) => {
    const matchesFilter =
      reviewsFilter === "ALL" ||
      (reviewsFilter === "FEATURED" && r.featuredOnHome) ||
      (reviewsFilter === "NOT_FEATURED" && !r.featuredOnHome);

    const term = reviewsSearch.toLowerCase().trim();
    if (!term) return matchesFilter;

    return (
      r.customerName.toLowerCase().includes(term) ||
      r.customerEmail.toLowerCase().includes(term) ||
      r.productName.toLowerCase().includes(term) ||
      r.comment.toLowerCase().includes(term) ||
      r.orderNumber.toLowerCase().includes(term)
    );
  });

  const featuredReviewsCount = reviews.filter((r) => r.featuredOnHome).length;
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

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

  // Handlers do Gerador de Cupons
  const handleOpenCouponModal = () => {
    const in30Days = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const dateStr = in30Days.toISOString().split("T")[0];
    setCouponCode("");
    setCouponName("");
    setCouponType("PERCENT");
    setCouponValue("10");
    setCouponValidUntil(dateStr);
    setCouponMinOrder("");
    setCouponModalOpen(true);
  };

  const handleGenerateRandomCode = () => {
    const prefixes = ["THEVINE", "PROMO", "BRANCH", "SEMENTE", "ESPECIAL"];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(10 + Math.random() * 90);
    setCouponCode(`${randomPrefix}${randomNum}`);
  };

  const handleCreateCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(couponValue.replace(",", "."));
    if (isNaN(val) || val <= 0) {
      toast.error("Informe um valor de desconto válido.");
      return;
    }
    const minVal = couponMinOrder ? parseFloat(couponMinOrder.replace(",", ".")) : 0;

    const res = createCoupon({
      code: couponCode,
      name: couponName,
      discountType: couponType,
      discountValue: val,
      validUntil: couponValidUntil,
      minOrderValue: minVal,
    });

    if (res.success) {
      toast.success(res.message);
      setCoupons(getStoredCoupons());
      setCouponModalOpen(false);
    } else {
      toast.error(res.message);
    }
  };

  const handleDeleteCoupon = (id: string, code: string) => {
    if (confirm(`Tem certeza que deseja excluir definitivamente o cupom "${code}"?`)) {
      const ok = deleteCoupon(id);
      if (ok) {
        toast.success(`Cupom "${code}" excluído com sucesso!`);
        setCoupons(getStoredCoupons());
      }
    }
  };

  const handleToggleCoupon = (id: string, currentStatus: boolean, code: string) => {
    toggleCouponStatus(id);
    setCoupons(getStoredCoupons());
    if (currentStatus) {
      toast.info(`Cupom "${code}" pausado temporariamente.`);
    } else {
      toast.success(`Cupom "${code}" reativado!`);
    }
  };

  const filteredCoupons = coupons.filter((c) => {
    const term = couponSearch.toLowerCase().trim();
    if (!term) return true;
    return (
      c.code.toLowerCase().includes(term) ||
      c.name.toLowerCase().includes(term) ||
      c.discountValue.toString().includes(term)
    );
  });

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
          <Button
            size="sm"
            onClick={handleOpenCouponModal}
            className="bg-[#1E3524] hover:bg-[#152519] text-white text-xs font-mono flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Criar Cupom</span>
          </Button>
          <Link href="/">
            <Button variant="outline" size="sm" className="border-[#2E2620]/20 text-[#2E2620] hover:bg-[#F5EFE6] text-xs font-mono">
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

      {/* Admin Tabs Navigation */}
      <div className="flex border-b border-[#E8E1D5] mb-8 overflow-x-auto">
        <button
          type="button"
          onClick={() => setAdminTab("orders")}
          className={`pb-3 px-4 text-xs font-mono tracking-wider uppercase font-semibold transition-colors border-b-2 -mb-[2px] flex items-center gap-2 whitespace-nowrap ${
            adminTab === "orders"
              ? "border-[#1E3524] text-[#1E3524]"
              : "border-transparent text-stone-400 hover:text-stone-700"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Pedidos e Entregas ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab("reviews")}
          className={`pb-3 px-4 text-xs font-mono tracking-wider uppercase font-semibold transition-colors border-b-2 -mb-[2px] flex items-center gap-2 whitespace-nowrap ${
            adminTab === "reviews"
              ? "border-[#1E3524] text-[#1E3524]"
              : "border-transparent text-stone-400 hover:text-stone-700"
          }`}
        >
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Curadoria de Avaliações ({reviews.length})</span>
          <span className="ml-1 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
            {featuredReviewsCount} na Home
          </span>
        </button>

        <button
          type="button"
          onClick={() => setAdminTab("coupons")}
          className={`pb-3 px-4 text-xs font-mono tracking-wider uppercase font-semibold transition-colors border-b-2 -mb-[2px] flex items-center gap-2 whitespace-nowrap ${
            adminTab === "coupons"
              ? "border-[#1E3524] text-[#1E3524]"
              : "border-transparent text-stone-400 hover:text-stone-700"
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Gerador de Cupons ({coupons.length})</span>
          <span className="ml-1 text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
            {coupons.filter((c) => c.active && !isCouponExpired(c.validUntil)).length} Ativos
          </span>
        </button>
      </div>

      {/* TAB 1: PEDIDOS E ENTREGAS */}
      {adminTab === "orders" && (
        <>
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
        </>
      )}

      {/* TAB 2: CURADORIA DE AVALIAÇÕES */}
      {adminTab === "reviews" && (
        <div className="space-y-6">
          {/* Reviews KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#F5EFE6] border border-[#E8E1D5] p-5 rounded-lg shadow-sm">
              <div className="flex items-center justify-between text-stone-600 text-xs font-mono uppercase tracking-wider mb-2">
                <span>Total de Avaliações</span>
                <MessageCircle className="w-4 h-4 text-stone-500" />
              </div>
              <p className="text-2xl font-serif text-[#2E2620] font-bold">{reviews.length}</p>
              <p className="text-xs text-stone-500 mt-1">Depoimentos enviados por clientes</p>
            </div>

            <div className="bg-[#EBF2EB] border border-[#C2D7C2] p-5 rounded-lg shadow-sm">
              <div className="flex items-center justify-between text-stone-600 text-xs font-mono uppercase tracking-wider mb-2">
                <span>Em Destaque na Home</span>
                <Sparkles className="w-4 h-4 text-[#1E3524]" />
              </div>
              <p className="text-2xl font-serif text-[#1E3524] font-bold">{featuredReviewsCount}</p>
              <p className="text-xs text-[#1E3524]/80 mt-1">Visíveis no final da página inicial</p>
            </div>

            <div className="bg-[#F5EFE6] border border-[#E8E1D5] p-5 rounded-lg shadow-sm">
              <div className="flex items-center justify-between text-stone-600 text-xs font-mono uppercase tracking-wider mb-2">
                <span>Média das Avaliações</span>
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
              <p className="text-2xl font-serif text-amber-900 font-bold">{averageRating} / 5.0</p>
              <p className="text-xs text-stone-500 mt-1">Classificação geral da coleção</p>
            </div>
          </div>

          {/* Filtros e Busca */}
          <div className="bg-white border border-[#E8E1D5] p-4 rounded-xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Buscar por cliente, produto, cidade..."
                value={reviewsSearch}
                onChange={(e) => setReviewsSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg text-xs font-mono focus:outline-none focus:border-[#1E3524]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <Button
                variant={reviewsFilter === "ALL" ? "default" : "outline"}
                size="sm"
                onClick={() => setReviewsFilter("ALL")}
                className={`text-xs font-mono h-8 ${
                  reviewsFilter === "ALL"
                    ? "bg-[#1E3524] hover:bg-[#152519] text-white"
                    : "border-stone-300 text-stone-700"
                }`}
              >
                Todas ({reviews.length})
              </Button>
              <Button
                variant={reviewsFilter === "FEATURED" ? "default" : "outline"}
                size="sm"
                onClick={() => setReviewsFilter("FEATURED")}
                className={`text-xs font-mono h-8 ${
                  reviewsFilter === "FEATURED"
                    ? "bg-[#1E3524] hover:bg-[#152519] text-white"
                    : "border-stone-300 text-stone-700"
                }`}
              >
                ★ Na Home ({featuredReviewsCount})
              </Button>
              <Button
                variant={reviewsFilter === "NOT_FEATURED" ? "default" : "outline"}
                size="sm"
                onClick={() => setReviewsFilter("NOT_FEATURED")}
                className={`text-xs font-mono h-8 ${
                  reviewsFilter === "NOT_FEATURED"
                    ? "bg-[#1E3524] hover:bg-[#152519] text-white"
                    : "border-stone-300 text-stone-700"
                }`}
              >
                Ocultas ({reviews.length - featuredReviewsCount})
              </Button>
            </div>
          </div>

          {/* Lista de Avaliações */}
          {filteredReviews.length === 0 ? (
            <div className="bg-white border border-[#E8E1D5] rounded-2xl p-12 text-center font-sans">
              <p className="text-sm font-mono text-stone-500">
                Nenhuma avaliação encontrada com os filtros selecionados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className={`bg-white rounded-2xl p-6 border transition-all shadow-xs flex flex-col justify-between ${
                    rev.featuredOnHome
                      ? "border-emerald-500/70 ring-1 ring-emerald-500/20"
                      : "border-[#E8E1D5]"
                  }`}
                >
                  <div>
                    {/* Header do Card */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-serif font-bold text-base text-[#2E2620]">
                            {rev.customerName}
                          </h3>
                          <span className="text-[10px] font-mono bg-[#FAF7F2] text-stone-600 px-2 py-0.5 rounded border border-[#E8E1D5]">
                            {rev.customerCity}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-stone-400">
                          {rev.customerEmail} &bull; Pedido {rev.orderNumber}
                        </p>
                      </div>

                      {/* Badge de Destaque */}
                      <div>
                        {rev.featuredOnHome ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-300">
                            <Sparkles className="w-3 h-3" />
                            <span>Destaque Ativo na Home</span>
                          </span>
                        ) : (
                          <span className="inline-block text-[11px] font-mono bg-stone-100 text-stone-500 px-2.5 py-1 rounded-full">
                            Oculta da Home
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Foto da Avaliação e Detalhes da Peça */}
                    <div className="flex gap-4 mb-4">
                      <div className="relative w-28 h-32 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 shadow-xs">
                        <Image
                          src={rev.photoUrl}
                          alt={`Foto enviada por ${rev.customerName}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-0.5">
                          Peça Avaliada:
                        </span>
                        <p className="text-xs font-bold text-[#2E2620] mb-2 font-mono">
                          {rev.productName}
                        </p>
                        {/* Estrelas */}
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < rev.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-stone-300"
                              }`}
                            />
                          ))}
                          <span className="text-xs font-mono font-bold text-stone-700 ml-1">
                            {rev.rating}.0
                          </span>
                        </div>
                        <p className="text-stone-700 text-xs italic leading-relaxed font-sans bg-[#FAF7F2] p-3 rounded-lg border border-[#E8E1D5]">
                          &ldquo;{rev.comment}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ações de Curadoria */}
                  <div className="pt-4 border-t border-[#E8E1D5] flex items-center justify-between gap-3 font-mono text-xs">
                    <Button
                      onClick={() => handleToggleFeatured(rev.id, rev.featuredOnHome)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 h-auto text-xs font-mono ${
                        rev.featuredOnHome
                          ? "bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300"
                          : "bg-[#1E3524] hover:bg-[#152519] text-white"
                      }`}
                    >
                      {rev.featuredOnHome ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Remover do Destaque da Home</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>★ Destacar no Final da Home</span>
                        </>
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteReview(rev.id)}
                      className="text-stone-400 hover:text-red-600 hover:bg-red-50 p-2"
                      title="Excluir avaliação"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: GERADOR DE CUPONS */}
      {adminTab === "coupons" && (
        <div className="space-y-6">
          {/* Header da Aba */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#FAF7F2] p-6 rounded-2xl border border-[#E8E1D5]">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#EAE3D2] text-[#1E3524] px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                <Tag className="w-3.5 h-3.5" />
                <span>Campanhas Promocionais &amp; Cupons</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2E2620]">
                Gerador de Cupons de Desconto
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
                Crie cupons promocionais em porcentagem (%) ou valor fixo (R$). Defina a data de validade: 
                <strong> após a data de duração, o cupom perde a validade automaticamente no checkout</strong>.
              </p>
            </div>

            <Button
              onClick={handleOpenCouponModal}
              className="bg-[#1E3524] hover:bg-[#152519] text-white px-5 py-2.5 h-auto text-xs font-mono uppercase tracking-wider flex items-center gap-2 shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Novo Cupom</span>
            </Button>
          </div>

          {/* Cards de Métricas / KPI */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#F5EFE6] border border-[#E8E1D5] p-5 rounded-xl shadow-xs">
              <div className="flex items-center justify-between text-stone-600 text-xs font-mono uppercase tracking-wider mb-2">
                <span>Total de Cupons</span>
                <Tag className="w-4 h-4 text-stone-500" />
              </div>
              <p className="text-2xl font-serif text-[#2E2620] font-bold">{coupons.length}</p>
              <p className="text-xs text-stone-500 mt-1">Cupons cadastrados no sistema</p>
            </div>

            <div className="bg-[#EBF2EB] border border-[#CDE0CD] p-5 rounded-xl shadow-xs">
              <div className="flex items-center justify-between text-[#1E3524] text-xs font-mono uppercase tracking-wider mb-2">
                <span>Válidos &amp; Ativos</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-serif text-[#1E3524] font-bold">
                {coupons.filter((c) => c.active && !isCouponExpired(c.validUntil)).length}
              </p>
              <p className="text-xs text-[#586E53] mt-1">Disponíveis para uso no checkout</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl shadow-xs">
              <div className="flex items-center justify-between text-amber-800 text-xs font-mono uppercase tracking-wider mb-2">
                <span>Expirados / Pausados</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-serif text-amber-900 font-bold">
                {coupons.filter((c) => !c.active || isCouponExpired(c.validUntil)).length}
              </p>
              <p className="text-xs text-amber-700 mt-1">Sem aplicação no checkout</p>
            </div>
          </div>

          {/* Barra de Busca de Cupons */}
          <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-[#E8E1D5] shadow-xs">
            <Search className="w-4 h-4 text-stone-400 ml-1" />
            <input
              type="text"
              placeholder="Buscar por código (ex: THEVINE10) ou nome da campanha..."
              value={couponSearch}
              onChange={(e) => setCouponSearch(e.target.value)}
              className="w-full text-xs font-mono bg-transparent focus:outline-none text-[#2E2620] placeholder:text-stone-400"
            />
            {couponSearch && (
              <button
                type="button"
                onClick={() => setCouponSearch("")}
                className="text-stone-400 hover:text-stone-600 text-xs font-mono mr-1"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Lista / Grid de Cupons */}
          {filteredCoupons.length === 0 ? (
            <div className="bg-white border border-[#E8E1D5] rounded-2xl p-12 text-center">
              <Tag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-lg text-[#2E2620]">Nenhum cupom encontrado</h3>
              <p className="text-xs font-mono text-stone-500 mt-1 mb-4">
                Crie seu primeiro cupom para oferecer vantagens aos clientes na The Vine Collection.
              </p>
              <Button
                onClick={handleOpenCouponModal}
                className="bg-[#1E3524] hover:bg-[#152519] text-white text-xs font-mono"
              >
                Cadastrar Primeiro Cupom
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCoupons.map((coupon) => {
                const expired = isCouponExpired(coupon.validUntil);
                const [y, m, d] = coupon.validUntil.split("-");
                const formattedValidUntil = `${d}/${m}/${y}`;

                return (
                  <div
                    key={coupon.id}
                    className={`bg-white rounded-2xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                      expired
                        ? "border-red-200 bg-red-50/20 opacity-80"
                        : !coupon.active
                        ? "border-stone-200 bg-stone-50/40 opacity-75"
                        : "border-[#E8E1D5] hover:shadow-md"
                    }`}
                  >
                    <div>
                      {/* Top Header do Card com Código e Status */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5 bg-[#FAF7F2] border-2 border-dashed border-[#1E3524]/40 px-3 py-1.5 rounded-lg">
                          <Tag className="w-3.5 h-3.5 text-[#1E3524]" />
                          <span className="font-mono font-bold text-sm tracking-wider text-[#1E3524]">
                            {coupon.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(coupon.code);
                              toast.success(`Código "${coupon.code}" copiado!`);
                            }}
                            className="text-stone-400 hover:text-stone-700 ml-1 p-0.5"
                            title="Copiar código"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Badge de Status */}
                        <div>
                          {expired ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full border border-red-200">
                              <AlertCircle className="w-3 h-3" />
                              <span>Expirado</span>
                            </span>
                          ) : !coupon.active ? (
                            <span className="inline-block text-[10px] font-mono bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full font-semibold">
                              Pausado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Ativo no Checkout</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Nome da Campanha */}
                      <h3 className="font-serif font-bold text-base text-[#2E2620] mb-1">
                        {coupon.name}
                      </h3>

                      {/* Valor do Desconto em Destaque */}
                      <div className="my-3 py-2 px-3 bg-[#FAF7F2] rounded-lg border border-[#E8E1D5] flex items-center justify-between">
                        <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">
                          Desconto:
                        </span>
                        <span className="font-mono font-bold text-base text-[#1E3524]">
                          {coupon.discountType === "PERCENT"
                            ? `${coupon.discountValue}% OFF`
                            : `R$ ${coupon.discountValue.toFixed(2).replace(".", ",")} OFF`}
                        </span>
                      </div>

                      {/* Informações de Validade e Regras */}
                      <div className="space-y-1.5 text-xs font-mono text-stone-600 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-stone-400 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Validade:
                          </span>
                          <span className={`font-semibold ${expired ? "text-red-600" : "text-stone-700"}`}>
                            {formattedValidUntil}
                          </span>
                        </div>

                        {coupon.minOrderValue && coupon.minOrderValue > 0 ? (
                          <div className="flex items-center justify-between">
                            <span className="text-stone-400">Pedido Mínimo:</span>
                            <span className="font-semibold text-stone-700">
                              R$ {coupon.minOrderValue.toFixed(2).replace(".", ",")}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-stone-400">Pedido Mínimo:</span>
                            <span className="text-stone-500">Sem valor mínimo</span>
                          </div>
                        )}

                        {/* Mensagem de Expiração Automática */}
                        <div className="pt-2 text-[11px]">
                          {expired ? (
                            <p className="text-red-700 font-medium">
                              ⚠️ Venceu em {formattedValidUntil}. O checkout desativa automaticamente este cupom.
                            </p>
                          ) : (
                            <p className="text-emerald-700">
                              ✓ Válido até 23:59 de {formattedValidUntil}.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="pt-3 border-t border-[#E8E1D5] flex items-center justify-between gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleCoupon(coupon.id, coupon.active, coupon.code)}
                        className={`text-xs font-mono h-8 flex-1 ${
                          coupon.active
                            ? "border-stone-300 text-stone-700 hover:bg-stone-100"
                            : "border-emerald-600 text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
                        }`}
                      >
                        {coupon.active ? "Pausar Cupom" : "Reativar Cupom"}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                        className="text-stone-400 hover:text-red-600 hover:bg-red-50 p-2 h-8"
                        title="Excluir Cupom Definitivamente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL: CADASTRAR NOVO CUPOM */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FAF7F2] border border-[#E8E1D5] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setCouponModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#1E3524] bg-[#EAE3D2] px-2 py-0.5 rounded font-bold">
                Gerador de Cupons
              </span>
            </div>

            <h3 className="text-xl font-serif font-bold text-[#2E2620]">
              Cadastrar Novo Cupom Promocional
            </h3>
            <p className="text-xs text-stone-600 font-mono mt-1 mb-6">
              Defina o código, o valor do desconto e a data de duração.
            </p>

            <form onSubmit={handleCreateCouponSubmit} className="space-y-4 text-xs font-mono">
              {/* Código do Cupom com Botão de Sugestão */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-stone-700 font-bold">
                    CÓDIGO DO CUPOM *
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomCode}
                    className="text-[11px] text-[#1E3524] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Sparkles className="w-3 h-3" />
                    Gerar Sugestão
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Ex: THEVINE15 ou PRIMAVERA20"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase().replace(/\s+/g, ""))}
                  className="w-full px-3 py-2.5 bg-white border border-[#E8E1D5] rounded-lg uppercase tracking-wider font-bold text-[#1E3524] focus:outline-none focus:border-[#1E3524]"
                />
              </div>

              {/* Nome da Campanha */}
              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  NOME / MOTIVO DA CAMPANHA *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Campanha de Lançamento Outono"
                  value={couponName}
                  onChange={(e) => setCouponName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
                />
              </div>

              {/* Tipo de Desconto: Porcentagem ou Fixo */}
              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  TIPO DE DESCONTO *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCouponType("PERCENT")}
                    className={`py-2.5 px-3 rounded-lg border text-center transition-all flex items-center justify-center gap-2 ${
                      couponType === "PERCENT"
                        ? "border-[#1E3524] bg-[#EBF2EB] text-[#1E3524] font-bold shadow-xs"
                        : "border-[#E8E1D5] bg-white text-stone-600"
                    }`}
                  >
                    <Percent className="w-4 h-4" />
                    <span>Porcentagem (%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCouponType("FIXED")}
                    className={`py-2.5 px-3 rounded-lg border text-center transition-all flex items-center justify-center gap-2 ${
                      couponType === "FIXED"
                        ? "border-[#1E3524] bg-[#EBF2EB] text-[#1E3524] font-bold shadow-xs"
                        : "border-[#E8E1D5] bg-white text-stone-600"
                    }`}
                  >
                    <span>R$ Valor Fixo</span>
                  </button>
                </div>
              </div>

              {/* Valor do Desconto */}
              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  {couponType === "PERCENT"
                    ? "VALOR DO DESCONTO (%) *"
                    : "VALOR DO DESCONTO EM REAIS (R$) *"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step={couponType === "PERCENT" ? "1" : "0.50"}
                    min="1"
                    max={couponType === "PERCENT" ? "90" : "1000"}
                    required
                    placeholder={couponType === "PERCENT" ? "Ex: 15" : "Ex: 25.00"}
                    value={couponValue}
                    onChange={(e) => setCouponValue(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
                  />
                  <span className="absolute right-3 top-2.5 font-bold text-stone-400">
                    {couponType === "PERCENT" ? "%" : "R$"}
                  </span>
                </div>
              </div>

              {/* Data de Validade / Duração */}
              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  DATA LIMITE DE VALIDADE / DURAÇÃO *
                </label>
                <input
                  type="date"
                  required
                  value={couponValidUntil}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCouponValidUntil(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
                />
                <p className="text-[10px] text-stone-500 mt-1">
                  * O cupom será aceito até as 23:59 desta data. Após esse prazo, perde a validade automaticamente no checkout.
                </p>
              </div>

              {/* Pedido Mínimo (Opcional) */}
              <div>
                <label className="block text-stone-700 font-bold mb-1">
                  VALOR MÍNIMO DO PEDIDO EM R$ (OPCIONAL)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  placeholder="Ex: 150 (deixe em branco se não houver)"
                  value={couponMinOrder}
                  onChange={(e) => setCouponMinOrder(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
                />
              </div>

              {/* Botões do Modal */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E8E1D5]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCouponModalOpen(false)}
                  className="border-stone-300 text-stone-700 hover:bg-stone-100"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-[#1E3524] hover:bg-[#152519] text-white px-6 font-bold"
                >
                  Salvar e Ativar Cupom
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rodapé Oficial de Suporte Técnico & Criação */}
      <div className="mt-12 pt-6 border-t border-[#E8E1D5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-stone-500">
        <div>
          <span>BRANCH CLO. &bull; Painel de Expedição &amp; Gestão v2.0</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Desenvolvido por:</span>
          <a
            href="https://wa.me/5511954532927?text=Ol%C3%A1!%20Preciso%20de%20suporte%20no%20sistema%20da%20Branch%20Clo."
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#1E3524] hover:underline"
          >
            JS Web &amp; Business &bull; (11) 95453-2927
          </a>
        </div>
      </div>
    </div>
  );
}
