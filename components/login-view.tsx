"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, AddressData } from "@/lib/auth-context";
import { fetchAddressByCep } from "@/lib/viacep";
import { getCustomerOrders, OrderData } from "@/lib/orders";
import { getStoredReviews, saveCustomerReview, CustomerReview } from "@/lib/reviews";
import { formatCurrency } from "@/lib/utils";
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
  Star,
  Camera,
  Upload,
  KeyRound,
  X,
  Clock,
  Truck,
  ChevronRight,
  MessageSquare,
  Check,
  ShoppingBag,
  Eye,
} from "lucide-react";

export function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const {
    customer,
    admin,
    unifiedLogin,
    registerCustomer,
    updateCustomerAddress,
    changeCustomerPassword,
    logoutCustomer,
    logoutAdmin,
  } = useAuth();

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

  // Customer Dashboard State
  const [customerTab, setCustomerTab] = useState<"orders" | "password" | "profile">("orders");
  const [customerOrders, setCustomerOrders] = useState<OrderData[]>([]);
  const [customerReviews, setCustomerReviews] = useState<CustomerReview[]>([]);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReviewItem, setSelectedReviewItem] = useState<{
    orderNumber: string;
    productName: string;
    imageUrl: string;
    color: string;
    size: string;
  } | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewPhoto, setReviewPhoto] = useState<string>("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Profile Address State
  const [editCep, setEditCep] = useState("");
  const [editStreet, setEditStreet] = useState("");
  const [editNumber, setEditNumber] = useState("");
  const [editComplement, setEditComplement] = useState("");
  const [editNeighborhood, setEditNeighborhood] = useState("");
  const [editCity, setEditCity] = useState("São Paulo");
  const [editState, setEditState] = useState("SP");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isSearchingEditCep, setIsSearchingEditCep] = useState(false);

  useEffect(() => {
    if (customer) {
      setCustomerOrders(getCustomerOrders(customer.email));
      setCustomerReviews(
        getStoredReviews().filter(
          (r) => r.customerEmail.toLowerCase() === customer.email.toLowerCase()
        )
      );
      if (customer.address) {
        setEditCep(customer.address.cep);
        setEditStreet(customer.address.street);
        setEditNumber(customer.address.number);
        setEditComplement(customer.address.complement || "");
        setEditNeighborhood(customer.address.neighborhood);
        setEditCity(customer.address.city);
        setEditState(customer.address.state);
      }
    }
  }, [customer]);

  useEffect(() => {
    const handleSync = () => {
      if (customer) {
        setCustomerOrders(getCustomerOrders(customer.email));
        setCustomerReviews(
          getStoredReviews().filter(
            (r) => r.customerEmail.toLowerCase() === customer.email.toLowerCase()
          )
        );
      }
    };
    window.addEventListener("branch_clo_orders_updated", handleSync);
    window.addEventListener("branch_clo_reviews_updated", handleSync);
    return () => {
      window.removeEventListener("branch_clo_orders_updated", handleSync);
      window.removeEventListener("branch_clo_reviews_updated", handleSync);
    };
  }, [customer]);

  const handleEditCepLookup = async (inputCep: string) => {
    const clean = inputCep.replace(/\D/g, "");
    if (clean.length !== 8) {
      toast.error("Digite um CEP válido com 8 números.");
      return;
    }
    setIsSearchingEditCep(true);
    toast.loading("Buscando endereço...", { id: "edit-cep" });
    const address = await fetchAddressByCep(clean);
    setIsSearchingEditCep(false);
    if (address) {
      setEditStreet(address.street);
      setEditNeighborhood(address.neighborhood);
      setEditCity(address.city);
      setEditState(address.state);
      toast.success("Endereço localizado!", { id: "edit-cep" });
    } else {
      toast.error("CEP não localizado.", { id: "edit-cep" });
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStreet.trim() || !editNumber.trim()) {
      toast.error("Preencha ao menos a rua e o número.");
      return;
    }
    updateCustomerAddress({
      cep: editCep,
      street: editStreet,
      number: editNumber,
      complement: editComplement,
      neighborhood: editNeighborhood,
      city: editCity,
      state: editState,
    });
    setIsEditingAddress(false);
    toast.success("Endereço de entrega atualizado!");
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast.error("A foto deve ter no máximo 8MB");
      return;
    }
    setIsUploadingPhoto(true);
    const reader = new FileReader();
    reader.onload = () => {
      setReviewPhoto(reader.result as string);
      setIsUploadingPhoto(false);
      toast.success("Foto carregada com sucesso!");
    };
    reader.onerror = () => {
      setIsUploadingPhoto(false);
      toast.error("Erro ao processar imagem.");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReviewItem || !customer) return;
    if (!reviewComment.trim()) {
      toast.error("Por favor, escreva um comentário sobre a peça.");
      return;
    }

    const finalPhoto = reviewPhoto || selectedReviewItem.imageUrl;

    saveCustomerReview({
      orderNumber: selectedReviewItem.orderNumber,
      customerName: customer.name,
      customerEmail: customer.email,
      customerCity: customer.address
        ? `${customer.address.city}, ${customer.address.state}`
        : "São Paulo, SP",
      productName: selectedReviewItem.productName,
      rating: reviewRating,
      comment: reviewComment.trim(),
      photoUrl: finalPhoto,
      featuredOnHome: false, // O lojista pode destacar na Gestão
    });

    toast.success("Avaliação enviada com sucesso!", {
      description:
        "Sua avaliação com foto foi registrada! Ela poderá ser selecionada para destaque no final da Home.",
    });

    setIsReviewModalOpen(false);
    setSelectedReviewItem(null);
    setReviewComment("");
    setReviewPhoto("");
    setReviewRating(5);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Informe sua senha atual.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("A confirmação da nova senha não confere.");
      return;
    }

    setIsChangingPassword(true);
    const res = changeCustomerPassword(currentPassword, newPassword);
    setIsChangingPassword(false);

    if (res.success) {
      toast.success(res.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(res.message);
    }
  };

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
    const STATUS_MAP: Record<OrderData["status"], { label: string; bg: string; text: string }> = {
      AGUARDANDO_PIX: { label: "Aguardando PIX", bg: "bg-amber-100", text: "text-amber-800" },
      PAGO: { label: "PIX Confirmado", bg: "bg-emerald-100", text: "text-emerald-800" },
      EM_SEPARACAO: { label: "Em Separação", bg: "bg-blue-100", text: "text-blue-800" },
      ENVIADO: { label: "Enviado / Rastreio", bg: "bg-purple-100", text: "text-purple-800" },
      ENTREGUE: { label: "Entregue", bg: "bg-stone-200", text: "text-stone-800" },
    };

    return (
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 font-sans">
        {/* Header do Perfil do Cliente */}
        <div className="bg-white border border-[#E8E1D5] rounded-2xl p-6 sm:p-8 shadow-xs mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#EBF2EB] text-[#1E3524] flex items-center justify-center shrink-0 border border-[#1E3524]/20 shadow-xs">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#1E3524] bg-[#EAE3D2] px-2.5 py-0.5 rounded font-semibold">
                  Membro Comunidade Branch Clo
                </span>
                <span className="text-xs text-stone-500 font-mono">The Vine Collection &bull; João 15:5</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif text-[#2E2620] font-bold">
                {customer.name}
              </h1>
              <p className="text-xs text-stone-600 font-mono mt-0.5">{customer.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link href="/">
              <Button variant="outline" size="sm" className="border-stone-300 text-xs font-mono">
                <ShoppingBag className="w-3.5 h-3.5 mr-1" />
                Continuar Comprando
              </Button>
            </Link>
            <Link href="/checkout">
              <Button size="sm" className="bg-[#1E3524] hover:bg-[#152519] text-white text-xs font-mono">
                Ir para Checkout
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logoutCustomer();
                toast.info("Você encerrou a sessão.");
              }}
              className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 font-mono"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              Sair
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E8E1D5] mb-8 overflow-x-auto">
          <button
            type="button"
            onClick={() => setCustomerTab("orders")}
            className={`pb-3 px-4 text-xs font-mono tracking-wider uppercase font-semibold transition-colors border-b-2 -mb-[2px] flex items-center gap-2 whitespace-nowrap ${
              customerTab === "orders"
                ? "border-[#1E3524] text-[#1E3524]"
                : "border-transparent text-stone-400 hover:text-stone-700"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Histórico de Compras &amp; Avaliações</span>
            <span className="ml-1 text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full font-bold">
              {customerOrders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCustomerTab("password")}
            className={`pb-3 px-4 text-xs font-mono tracking-wider uppercase font-semibold transition-colors border-b-2 -mb-[2px] flex items-center gap-2 whitespace-nowrap ${
              customerTab === "password"
                ? "border-[#1E3524] text-[#1E3524]"
                : "border-transparent text-stone-400 hover:text-stone-700"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Alterar Senha</span>
          </button>

          <button
            type="button"
            onClick={() => setCustomerTab("profile")}
            className={`pb-3 px-4 text-xs font-mono tracking-wider uppercase font-semibold transition-colors border-b-2 -mb-[2px] flex items-center gap-2 whitespace-nowrap ${
              customerTab === "profile"
                ? "border-[#1E3524] text-[#1E3524]"
                : "border-transparent text-stone-400 hover:text-stone-700"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Endereço de Entrega &amp; Cadastro</span>
          </button>
        </div>

        {/* TAB 1: HISTÓRICO DE COMPRAS & AVALIAÇÕES COM FOTO */}
        {customerTab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#2E2620]">
                  Seus Pedidos na Branch Clo
                </h2>
                <p className="text-xs text-stone-600 font-mono mt-0.5">
                  Acompanhe seus despachos e avalie suas peças com foto para inspirar outros irmãos.
                </p>
              </div>
              <span className="text-xs font-mono text-stone-500">
                Total de compras: <strong>{customerOrders.length}</strong>
              </span>
            </div>

            {customerOrders.length === 0 ? (
              <div className="bg-white border border-[#E8E1D5] rounded-2xl p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-[#FAF7F2] text-stone-400 flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-serif text-[#2E2620] font-bold">
                  Nenhum pedido realizado ainda
                </h3>
                <p className="text-xs text-stone-500 font-mono mt-1 max-w-sm mx-auto mb-6">
                  Descubra a coleção The Vine — João 15:5 confeccionada em malha suedine premium 205g/m².
                </p>
                <Link href="/">
                  <Button className="bg-[#1E3524] hover:bg-[#152519] text-white text-xs font-mono uppercase tracking-wider">
                    Conhecer a Coleção
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {customerOrders.map((ord) => {
                  const statusInfo = STATUS_MAP[ord.status] || {
                    label: ord.status,
                    bg: "bg-stone-100",
                    text: "text-stone-700",
                  };

                  return (
                    <div
                      key={ord.id}
                      className="bg-white border border-[#E8E1D5] rounded-2xl overflow-hidden shadow-xs hover:border-[#1E3524]/40 transition-colors"
                    >
                      {/* Top Bar do Pedido */}
                      <div className="bg-[#FAF7F2] px-6 py-4 border-b border-[#E8E1D5] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-bold text-[#1E3524] text-sm">
                            {ord.orderNumber}
                          </span>
                          <span className="text-stone-400">&bull;</span>
                          <span className="text-stone-600">
                            {new Date(ord.createdAt).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span className="text-stone-400">&bull;</span>
                          <span className="text-stone-700 font-bold">
                            Total: {formatCurrency(ord.total)}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-bold ${statusInfo.bg} ${statusInfo.text}`}
                          >
                            {statusInfo.label}
                          </span>
                          {ord.trackingCode && (
                            <Link href={`/rastreio?codigo=${ord.trackingCode}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-[11px] font-mono border-stone-300 text-[#1E3524] hover:bg-stone-100"
                              >
                                <Truck className="w-3 h-3 mr-1" />
                                Rastrear ({ord.trackingCode})
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Itens do Pedido */}
                      <div className="p-6 space-y-4">
                        {ord.items.map((item, idx) => {
                          const existingReview = customerReviews.find(
                            (r) =>
                              r.orderNumber === ord.orderNumber &&
                              r.productName === item.productName
                          );

                          return (
                            <div
                              key={idx}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 first:pt-0 border-t first:border-t-0 border-stone-100"
                            >
                              <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                                  <Image
                                    src={item.imageUrl}
                                    alt={item.productName}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <h4 className="text-sm font-semibold text-[#2E2620]">
                                    {item.productName}
                                  </h4>
                                  <p className="text-xs text-stone-500 font-mono mt-0.5">
                                    Cor: {item.color} &bull; Tamanho: {item.size} &bull; Qtd: {item.quantity}
                                  </p>
                                  <p className="text-xs font-mono font-bold text-[#1E3524] mt-0.5">
                                    {formatCurrency(item.unitPrice)}
                                  </p>
                                </div>
                              </div>

                              {/* Ação de Avaliação com Foto */}
                              <div className="flex items-center gap-2 sm:self-center">
                                {existingReview ? (
                                  <div className="bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg p-3 text-xs font-mono text-left max-w-sm">
                                    <div className="flex items-center gap-1 text-amber-500 mb-1">
                                      {Array.from({ length: existingReview.rating }).map((_, i) => (
                                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                      ))}
                                      <span className="text-[11px] text-stone-600 font-bold ml-1">
                                        Peça Avaliada!
                                      </span>
                                    </div>
                                    <p className="text-stone-600 italic text-[11px] line-clamp-2">
                                      &ldquo;{existingReview.comment}&rdquo;
                                    </p>
                                    {existingReview.featuredOnHome && (
                                      <span className="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                                        ★ Em Destaque no Final da Home
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <Button
                                    onClick={() => {
                                      setSelectedReviewItem({
                                        orderNumber: ord.orderNumber,
                                        productName: item.productName,
                                        imageUrl: item.imageUrl,
                                        color: item.color,
                                        size: item.size,
                                      });
                                      setReviewRating(5);
                                      setReviewComment("");
                                      setReviewPhoto("");
                                      setIsReviewModalOpen(true);
                                    }}
                                    className="bg-[#1E3524] hover:bg-[#152519] text-white text-xs font-mono flex items-center gap-1.5 shadow-xs"
                                  >
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    <span>Avaliar Peça com Foto</span>
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ALTERAR SENHA DO CLIENTE */}
        {customerTab === "password" && (
          <div className="max-w-md mx-auto bg-white border border-[#E8E1D5] rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#1E3524] flex items-center justify-center mx-auto mb-2 border border-[#E8E1D5]">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-serif font-bold text-[#2E2620]">
                Alteração de Senha
              </h2>
              <p className="text-xs text-stone-500 font-mono mt-1">
                Defina uma nova senha segura para acessar sua conta de cliente.
              </p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-stone-700 mb-1 font-bold">
                  SENHA ATUAL *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
                />
                <p className="text-[10px] text-stone-400 mt-1">
                  (Dica de demonstração: a senha padrão inicial de demonstração é <strong>branchcliente</strong>)
                </p>
              </div>

              <div>
                <label className="block text-stone-700 mb-1 font-bold">
                  NOVA SENHA (MÍNIMO 6 CARACTERES) *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Nova senha segura"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
                />
              </div>

              <div>
                <label className="block text-stone-700 mb-1 font-bold">
                  CONFIRMAR NOVA SENHA *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Repita a nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
                />
              </div>

              <Button
                type="submit"
                disabled={isChangingPassword}
                className="w-full bg-[#1E3524] hover:bg-[#152519] text-white py-3 h-auto font-mono text-xs uppercase tracking-wider mt-4"
              >
                {isChangingPassword ? "Atualizando..." : "Salvar Nova Senha"}
              </Button>
            </form>
          </div>
        )}

        {/* TAB 3: MEU ENDEREÇO & CADASTRO */}
        {customerTab === "profile" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dados Pessoais */}
            <div className="bg-white border border-[#E8E1D5] rounded-2xl p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-serif font-bold text-[#2E2620] mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#1E3524]" />
                <span>Dados de Identificação</span>
              </h2>
              <div className="space-y-3 text-xs font-mono text-stone-700 bg-[#FAF7F2] p-4 rounded-xl border border-[#E8E1D5]">
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">Nome Completo:</span>
                  <strong className="text-stone-800">{customer.name}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">E-mail de Acesso:</span>
                  <strong className="text-stone-800">{customer.email}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">WhatsApp / Contato:</span>
                  <strong className="text-stone-800">{customer.phone}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px] uppercase">CPF:</span>
                  <strong className="text-stone-800">{customer.cpf}</strong>
                </div>
              </div>
            </div>

            {/* Endereço de Entrega */}
            <div className="bg-white border border-[#E8E1D5] rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-serif font-bold text-[#2E2620] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#1E3524]" />
                  <span>Endereço de Entrega</span>
                </h2>
                {!isEditingAddress && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingAddress(true)}
                    className="text-[11px] font-mono border-stone-300"
                  >
                    Editar Endereço
                  </Button>
                )}
              </div>

              {!isEditingAddress ? (
                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#E8E1D5] text-xs font-mono space-y-1.5">
                  {customer.address ? (
                    <>
                      <p className="font-bold text-stone-800">
                        {customer.address.street}, Nº {customer.address.number}
                        {customer.address.complement ? ` (${customer.address.complement})` : ""}
                      </p>
                      <p className="text-stone-600">{customer.address.neighborhood}</p>
                      <p className="text-stone-600">
                        {customer.address.city} - {customer.address.state}
                      </p>
                      <p className="text-[#1E3524] font-bold pt-1">
                        CEP: {customer.address.cep}
                      </p>
                    </>
                  ) : (
                    <p className="text-stone-400 italic">Nenhum endereço cadastrado.</p>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSaveAddress} className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="block text-stone-700 mb-1">CEP *</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={9}
                        placeholder="00000-000"
                        value={editCep}
                        onChange={(e) => setEditCep(e.target.value)}
                        className="flex-1 px-3 py-2 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
                      />
                      <Button
                        type="button"
                        onClick={() => handleEditCepLookup(editCep)}
                        disabled={isSearchingEditCep}
                        className="bg-stone-800 hover:bg-black text-white px-3"
                      >
                        <Search className="w-3.5 h-3.5 mr-1" />
                        {isSearchingEditCep ? "..." : "Buscar"}
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="block text-stone-700 mb-1">LOGRADOURO / RUA *</label>
                      <input
                        type="text"
                        required
                        value={editStreet}
                        onChange={(e) => setEditStreet(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 mb-1">NÚMERO *</label>
                      <input
                        type="text"
                        required
                        value={editNumber}
                        onChange={(e) => setEditNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 mb-1">COMPLEMENTO / APTO</label>
                    <input
                      type="text"
                      value={editComplement}
                      onChange={(e) => setEditComplement(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-stone-700 mb-1">BAIRRO</label>
                      <input
                        type="text"
                        value={editNeighborhood}
                        onChange={(e) => setEditNeighborhood(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg focus:outline-none focus:border-[#1E3524]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 mb-1">CIDADE - UF</label>
                      <input
                        type="text"
                        value={`${editCity} - ${editState}`}
                        readOnly
                        className="w-full px-3 py-2 bg-stone-100 border border-[#E8E1D5] rounded-lg text-stone-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="submit"
                      className="flex-1 bg-[#1E3524] hover:bg-[#152519] text-white"
                    >
                      Salvar Endereço
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditingAddress(false)}
                      className="border-stone-300"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* MODAL DE AVALIAÇÃO COM FOTO DA COMPRA */}
        {isReviewModalOpen && selectedReviewItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white border border-[#E8E1D5] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
              <button
                type="button"
                onClick={() => {
                  setIsReviewModalOpen(false);
                  setSelectedReviewItem(null);
                }}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#1E3524] bg-[#EAE3D2] px-2 py-0.5 rounded font-bold">
                  Avaliação da Compra
                </span>
                <span className="text-xs font-mono text-stone-500">
                  {selectedReviewItem.orderNumber}
                </span>
              </div>

              <h3 className="text-xl font-serif font-bold text-[#2E2620]">
                Avaliar Peça &amp; Compartilhar Foto
              </h3>
              <p className="text-xs text-stone-500 font-mono mt-1">
                Conte sua experiência com a peça. As melhores fotos e comentários serão selecionados para aparecer em destaque no final da nossa Home!
              </p>

              {/* Preview da Peça */}
              <div className="flex items-center gap-3 bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E1D5] my-4">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white border border-stone-200 shrink-0">
                  <Image
                    src={selectedReviewItem.imageUrl}
                    alt={selectedReviewItem.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#2E2620]">
                    {selectedReviewItem.productName}
                  </h4>
                  <p className="text-[11px] text-stone-500 font-mono">
                    Cor: {selectedReviewItem.color} &bull; Tamanho: {selectedReviewItem.size}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs font-mono">
                {/* Seleção de Estrelas */}
                <div>
                  <label className="block text-stone-700 mb-1 font-bold uppercase">
                    Sua Nota:
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 text-2xl focus:outline-none hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= reviewRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-stone-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-stone-700 ml-2">
                      {reviewRating === 5 && "5 - Excelente! Recomendo"}
                      {reviewRating === 4 && "4 - Muito Bom"}
                      {reviewRating === 3 && "3 - Bom"}
                      {reviewRating === 2 && "2 - Razoável"}
                      {reviewRating === 1 && "1 - Insatisfeito"}
                    </span>
                  </div>
                </div>

                {/* Comentário */}
                <div>
                  <label className="block text-stone-700 mb-1 font-bold uppercase">
                    Seu Comentário ou Testemunho *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Conte como a peça veste no corpo, a qualidade da malha suedine 205g, o acabamento da estampa de João 15:5 e a mensagem que ela transmite..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl focus:outline-none focus:border-[#1E3524] resize-none"
                  />
                </div>

                {/* Upload de Foto */}
                <div>
                  <label className="block text-stone-700 mb-1 font-bold uppercase">
                    Foto da Peça no Corpo (Com Você Vestindo):
                  </label>
                  <div className="mt-1 flex flex-col sm:flex-row items-center gap-3">
                    <label className="cursor-pointer border-2 border-dashed border-stone-300 hover:border-[#1E3524] rounded-xl p-3 flex items-center justify-center gap-2 text-stone-600 hover:text-[#1E3524] bg-[#FAF7F2] w-full sm:w-auto">
                      <Camera className="w-4 h-4" />
                      <span>{isUploadingPhoto ? "Carregando foto..." : "Tirar Foto ou Escolher Arquivo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>

                    {!reviewPhoto && (
                      <button
                        type="button"
                        onClick={() => {
                          setReviewPhoto(selectedReviewItem.imageUrl);
                          toast.info("Usando foto da peça do catálogo!");
                        }}
                        className="text-[11px] text-stone-500 hover:text-stone-800 underline"
                      >
                        Usar foto da peça
                      </button>
                    )}
                  </div>

                  {/* Preview da Foto */}
                  {reviewPhoto && (
                    <div className="mt-3 relative w-24 h-24 rounded-xl overflow-hidden border-2 border-[#1E3524] shadow-xs">
                      <Image
                        src={reviewPhoto}
                        alt="Foto da avaliação"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setReviewPhoto("")}
                        className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white rounded-full p-1 text-[10px]"
                        title="Remover foto"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 font-sans">
                  <strong>💡 Destaque na Home:</strong> O lojista da Branch Clo seleciona periodicamente as avaliações com fotos mais autênticas para figurar na vitrine da página principal!
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-[#1E3524] hover:bg-[#152519] text-white py-2.5 h-auto uppercase tracking-wider"
                  >
                    Publicar Avaliação
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsReviewModalOpen(false);
                      setSelectedReviewItem(null);
                    }}
                    className="border-stone-300"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
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
