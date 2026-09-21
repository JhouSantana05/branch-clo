"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { OFFICIAL_PRODUCTS } from "@/lib/catalog";
import { ProductData } from "@/components/product-card";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Package,
  Boxes,
  AlertTriangle,
  CheckCircle2,
  Search,
  ExternalLink,
  Plus,
  Minus,
  Edit3,
  Eye,
  EyeOff,
  ShoppingBag,
  SlidersHorizontal,
  X,
  Sparkles,
  Upload,
  ImageIcon,
  Camera,
  Trash2,
  Lock,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function AdminProductsView() {
  const { admin, isAdminAuthenticated, loginAdmin, logoutAdmin } = useAuth();
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const [products, setProducts] = useState<ProductData[]>(OFFICIAL_PRODUCTS);
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"estoque" | "precos">("estoque");

  // Modal State (Cadastrar ou Editar)
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Linha Adulto");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");
  
  // Up to 3 photos: [Foto 1 - Principal, Foto 2 - Costas, Foto 3 - Detalhes]
  const [photos, setPhotos] = useState<string[]>([]);
  const [targetSlot, setTargetSlot] = useState<number>(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleTriggerUpload = (slotIndex: number) => {
    setTargetSlot(slotIndex);
    fileInputRef.current?.click();
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A foto deve ter no máximo 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        const resultUrl = reader.result;
        setPhotos((prev) => {
          const next = [...prev];
          if (targetSlot < next.length) {
            next[targetSlot] = resultUrl;
          } else {
            next.push(resultUrl);
          }
          return next.slice(0, 3);
        });
        toast.success(`Foto ${targetSlot + 1} carregada com sucesso!`);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== index));
    toast.info(`Foto ${index + 1} removida.`);
  };

  // Ajuste de Estoque
  const handleStockChange = (productId: string, variantId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        return {
          ...prod,
          variants: prod.variants.map((v) => {
            if (v.id !== variantId) return v;
            const updatedStock = Math.max(0, v.stockAvailable + delta);
            return { ...v, stockAvailable: updatedStock };
          }),
        };
      })
    );
    toast.success("Estoque atualizado com sucesso!");
  };

  // Ajuste de Preço
  const handlePriceUpdate = (productId: string, newPriceValue: number) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        return {
          ...prod,
          variants: prod.variants.map((v) => ({
            ...v,
            regularPrice: newPriceValue,
          })),
        };
      })
    );
    toast.success(`Preço atualizado para ${formatCurrency(newPriceValue)}!`);
  };

  const filteredProducts = products.filter((prod) => {
    const matchesCategory =
      filterCategory === "ALL" ||
      prod.categoryName.toLowerCase().includes(filterCategory.toLowerCase());
    const term = searchTerm.toLowerCase().trim();
    if (!term) return matchesCategory;

    return (
      matchesCategory &&
      (prod.name.toLowerCase().includes(term) ||
        prod.slug.toLowerCase().includes(term) ||
        prod.categoryName.toLowerCase().includes(term))
    );
  });

  // Cálculos de KPI
  const totalStockPieces = products.reduce(
    (acc, p) => acc + p.variants.reduce((vAcc, v) => vAcc + v.stockAvailable, 0),
    0
  );

  const lowStockCount = products.reduce(
    (acc, p) =>
      acc + p.variants.filter((v) => v.stockAvailable > 0 && v.stockAvailable < 5).length,
    0
  );

  const totalInventoryValue = products.reduce(
    (acc, p) =>
      acc +
      p.variants.reduce(
        (vAcc, v) =>
          vAcc + v.stockAvailable * (v.promotionalPrice || v.regularPrice),
        0
      ),
    0
  );

  const handleOpenCreateModal = () => {
    setEditingProductId(null);
    setNewName("");
    setNewCategory("Linha Adulto");
    setNewPrice("");
    setNewStock("");
    setPhotos([]);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (product: ProductData) => {
    setEditingProductId(product.id);
    setNewName(product.name);
    setNewCategory(product.categoryName);
    const basePrice = product.variants[0]?.regularPrice || 129.9;
    setNewPrice(basePrice.toString());
    const firstStock = product.variants[0]?.stockAvailable ?? 10;
    setNewStock(firstStock.toString());
    setPhotos(product.images.map((img) => img.url).slice(0, 3));
    setShowAddModal(true);
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a peça "${productName}" do catálogo?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      toast.success(`Peça "${productName}" excluída do catálogo com sucesso.`);
    }
  };

  const handleCreateOrUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const parsedPrice = parseFloat(newPrice.replace(",", ".")) || 129.9;
    const parsedStock = parseInt(newStock) || 10;
    const slug = newName.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    const activePhotos = photos.length > 0 ? photos : ["/catalog/tee-oversized-offwhite-frente.jpeg"];
    const formattedImages = activePhotos.map((url, idx) => ({
      id: `img-${Date.now()}-${idx}`,
      url,
      altText: `${newName} - Foto ${idx + 1}`,
      isMain: idx === 0,
      displayOrder: idx + 1,
    }));

    if (editingProductId) {
      // Atualizar peça existente
      setProducts((prev) =>
        prev.map((prod) => {
          if (prod.id !== editingProductId) return prod;
          return {
            ...prod,
            name: newName,
            slug: slug,
            categoryName: newCategory,
            images: formattedImages,
            variants: prod.variants.map((v) => ({
              ...v,
              regularPrice: parsedPrice,
              stockAvailable: parsedStock > 0 ? parsedStock : v.stockAvailable,
            })),
          };
        })
      );
      toast.success(`Peça "${newName}" atualizada com sucesso!`);
    } else {
      // Inserir nova peça
      const newProd: ProductData = {
        id: `prod-${Date.now()}`,
        name: newName,
        slug: slug,
        categoryName: newCategory,
        description: "Nova peça da coleção autoral Branch Clo em Suedine 205g.",
        fabricComposition: "Suedine Premium 205g 100% Algodão",
        images: formattedImages,
        variants: [
          {
            id: `var-p-${Date.now()}`,
            size: "P",
            colorName: "Off-White",
            hexColor: "#F5F1E8",
            skuCode: `BC-${slug.toUpperCase()}-P`,
            regularPrice: parsedPrice,
            stockAvailable: parsedStock,
            weightGrams: 280,
            heightCm: 4,
            widthCm: 25,
            lengthCm: 32,
          },
          {
            id: `var-m-${Date.now()}`,
            size: "M",
            colorName: "Off-White",
            hexColor: "#F5F1E8",
            skuCode: `BC-${slug.toUpperCase()}-M`,
            regularPrice: parsedPrice,
            stockAvailable: parsedStock,
            weightGrams: 280,
            heightCm: 4,
            widthCm: 25,
            lengthCm: 32,
          },
          {
            id: `var-g-${Date.now()}`,
            size: "G",
            colorName: "Off-White",
            hexColor: "#F5F1E8",
            skuCode: `BC-${slug.toUpperCase()}-G`,
            regularPrice: parsedPrice,
            stockAvailable: parsedStock,
            weightGrams: 280,
            heightCm: 4,
            widthCm: 25,
            lengthCm: 32,
          },
        ],
      };

      setProducts([newProd, ...products]);
      toast.success(`Peça "${newProd.name}" adicionada ao catálogo com sucesso!`);
    }

    setShowAddModal(false);
    setEditingProductId(null);
    setNewName("");
    setNewPrice("");
    setNewStock("");
    setPhotos([]);
  };

  // Se não estiver autenticado como administrador, bloqueia e exibe formulário
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
            Gestão de Produtos
          </h2>
          <p className="text-xs text-stone-600 mt-1 mb-6">
            Identifique-se como lojista para gerenciar o estoque, cadastrar novas peças e definir valores.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const ok = loginAdmin(adminEmail, adminPassword);
              if (ok) toast.success("Acesso ao inventário autorizado!");
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
              Acessar Estoque
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 font-sans">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#E8E1D5] pb-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono tracking-widest text-[#1E3524] uppercase bg-[#EAE3D2] px-2.5 py-0.5 rounded">
              Backoffice / Estoque
            </span>
            <span className="text-xs text-stone-500 font-mono">BRANCH CLO. v2.0</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#2E2620] tracking-tight">
            Gestão de Produtos & Inventário
          </h1>
          <p className="text-stone-600 text-sm mt-1">
            Monitore o estoque por tamanho, atualize preços e gerencie os modelos da coleção The Vine.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link href="/admin/pedidos">
            <Button variant="outline" size="sm" className="border-[#2E2620]/20 text-[#2E2620] hover:bg-[#F5EFE6] text-xs font-mono">
              Ver Pedidos Realizados
            </Button>
          </Link>
          <Link href="/admin/cupons">
            <Button variant="outline" size="sm" className="border-[#2E2620]/20 text-[#2E2620] hover:bg-[#F5EFE6] text-xs font-mono">
              Gerador de Cupons
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" size="sm" className="border-[#2E2620]/20 text-[#2E2620] hover:bg-[#F5EFE6] text-xs font-mono">
              Loja Online
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={handleOpenCreateModal}
            className="bg-[#1E3524] hover:bg-[#152519] text-white text-xs font-mono flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cadastrar Peça</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              logoutAdmin();
              toast.info("Sessão administrativa encerrada.");
            }}
            className="text-stone-500 hover:text-red-600 text-xs font-mono flex items-center gap-1 h-9 px-2.5"
            title="Encerrar Sessão"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#F5EFE6] border border-[#E8E1D5] p-5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between text-stone-600 text-xs font-mono uppercase tracking-wider mb-2">
            <span>Modelos no Catálogo</span>
            <ShoppingBag className="w-4 h-4 text-stone-500" />
          </div>
          <p className="text-2xl font-serif text-[#2E2620] font-bold">{products.length} Peças</p>
          <p className="text-xs text-stone-500 mt-1">Todas ativas para venda</p>
        </div>

        <div className="bg-[#F5EFE6] border border-[#E8E1D5] p-5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between text-stone-600 text-xs font-mono uppercase tracking-wider mb-2">
            <span>Total em Estoque</span>
            <Boxes className="w-4 h-4 text-[#1E3524]" />
          </div>
          <p className="text-2xl font-serif text-[#1E3524] font-bold">{totalStockPieces} Unidades</p>
          <p className="text-xs text-stone-500 mt-1">Somando todas as grades</p>
        </div>

        <div className="bg-[#F5EFE6] border border-[#E8E1D5] p-5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between text-stone-600 text-xs font-mono uppercase tracking-wider mb-2">
            <span>Alertas Estoque Baixo</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-serif text-amber-900 font-bold">{lowStockCount} Grades</p>
          <p className="text-xs text-amber-700 mt-1">Menos de 5 unidades</p>
        </div>

        <div className="bg-[#F5EFE6] border border-[#E8E1D5] p-5 rounded-lg shadow-sm">
          <div className="flex items-center justify-between text-stone-600 text-xs font-mono uppercase tracking-wider mb-2">
            <span>Valor do Inventário</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-serif text-[#2E2620] font-bold">
            {formatCurrency(totalInventoryValue)}
          </p>
          <p className="text-xs text-emerald-800 mt-1">Preço de tabela consolidado</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#F5EFE6] border border-[#E8E1D5] p-4 rounded-lg mb-6 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
          <input
            type="text"
            placeholder="Buscar peça por nome, linha ou referência..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#E8E1D5] rounded text-[#2E2620] focus:outline-none focus:border-[#1E3524] font-mono text-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono overflow-x-auto">
          {[
            { id: "ALL", label: "Todas" },
            { id: "Adulto", label: "Linha Adulto" },
            { id: "Teens", label: "Linha Teens" },
            { id: "Kids", label: "Kids" },
            { id: "Acessórios", label: "Acessórios" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                filterCategory === tab.id
                  ? "bg-[#2E2620] text-white font-semibold"
                  : "bg-white border border-[#E8E1D5] text-stone-700 hover:bg-[#FAF7F2]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table / Grid */}
      <div className="space-y-4">
        {filteredProducts.map((product) => {
          const mainImage = product.images[0]?.url || "/catalog/tee-oversized-offwhite-frente.jpeg";
          const basePrice = product.variants[0]?.regularPrice || 129.9;
          const totalProdStock = product.variants.reduce((acc, v) => acc + v.stockAvailable, 0);

          return (
            <div
              key={product.id}
              className="bg-white border border-[#E8E1D5] rounded-xl p-5 shadow-sm hover:border-[#1E3524]/40 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left: Product Info */}
                <div className="flex items-start gap-4 min-w-[280px]">
                  <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-stone-100 border border-[#E8E1D5] flex-shrink-0">
                    <Image
                      src={mainImage}
                      alt={product.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block">
                      {product.categoryName}
                    </span>
                    <h3 className="text-base font-serif font-bold text-[#2E2620] leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs text-stone-500 font-mono mt-0.5">
                      Slug: /{product.slug}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2.5">
                      <Link
                        href={`/produtos/${product.slug}`}
                        target="_blank"
                        className="text-xs text-[#1E3524] hover:underline flex items-center gap-1 font-mono"
                      >
                        <span>Ver na Loja</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <span className="text-xs text-stone-300">&bull;</span>
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(product)}
                        className="text-xs text-stone-700 hover:text-[#1E3524] flex items-center gap-1 font-mono font-medium hover:underline"
                        title="Editar dados da peça"
                      >
                        <Edit3 className="w-3 h-3 text-[#1E3524]" />
                        <span>Editar</span>
                      </button>
                      <span className="text-xs text-stone-300">&bull;</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        className="text-xs text-stone-500 hover:text-red-600 flex items-center gap-1 font-mono hover:underline"
                        title="Excluir peça do catálogo"
                      >
                        <Trash2 className="w-3 h-3 text-stone-400 hover:text-red-500" />
                        <span>Excluir</span>
                      </button>
                      <span className="text-xs text-stone-300">&bull;</span>
                      <span className="text-xs font-mono font-bold text-[#2E2620]">
                        Preço Base: {formatCurrency(basePrice)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Center / Right: Size and Stock Management Matrix */}
                <div className="flex-1 border-t lg:border-t-0 lg:border-l border-[#E8E1D5] pt-4 lg:pt-0 lg:pl-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-stone-500">
                      Grade & Estoque por Tamanho ({totalProdStock} peças no total)
                    </span>
                    <button
                      onClick={() => {
                        const val = prompt(
                          `Definir novo preço base para "${product.name}":`,
                          basePrice.toString()
                        );
                        if (val) {
                          const parsed = parseFloat(val.replace(",", "."));
                          if (!isNaN(parsed) && parsed > 0) {
                            handlePriceUpdate(product.id, parsed);
                          }
                        }
                      }}
                      className="text-xs font-mono text-[#1E3524] hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Alterar Preço</span>
                    </button>
                  </div>

                  {/* Stock Pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {product.variants.map((v) => {
                      const isLow = v.stockAvailable < 5 && v.stockAvailable > 0;
                      const isZero = v.stockAvailable === 0;

                      return (
                        <div
                          key={v.id}
                          className={`p-2.5 rounded-lg border text-xs font-mono transition-colors ${
                            isZero
                              ? "bg-red-50 border-red-200 text-red-800"
                              : isLow
                              ? "bg-amber-50 border-amber-200 text-amber-900"
                              : "bg-[#FAF7F2] border-[#E8E1D5] text-[#2E2620]"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-bold">Tam {v.size}</span>
                            <span className="text-[10px] opacity-75">{v.colorName}</span>
                          </div>

                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-sm">{v.stockAvailable} un.</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleStockChange(product.id, v.id, -1)}
                                className="w-5 h-5 bg-white border border-[#E8E1D5] rounded flex items-center justify-center hover:bg-stone-100 text-stone-700"
                                title="Diminuir estoque"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStockChange(product.id, v.id, 1)}
                                className="w-5 h-5 bg-white border border-[#E8E1D5] rounded flex items-center justify-center hover:bg-stone-100 text-stone-700"
                                title="Aumentar estoque"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setShowAddModal(false)}
          />

          <div className="relative w-full max-w-lg bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] shadow-2xl p-6 sm:p-8 z-10 animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E1D5] mb-5">
              <div>
                <h3 className="text-xl font-serif font-bold text-[#2E2620]">
                  {editingProductId ? "Editar Peça do Catálogo" : "Cadastrar Nova Peça"}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {editingProductId
                    ? "Altere os dados, foto ou valores desta peça."
                    : "Preencha os dados e escolha a foto da nova peça."}
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdateProduct} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-stone-700 mb-1">NOME DA PEÇA *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: The Branch Hoodie — Gênesis 1:3"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#E8E1D5] rounded-lg text-sm text-[#2E2620] focus:outline-none focus:border-[#1E3524]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 mb-1">CATEGORIA *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#E8E1D5] rounded-lg text-xs text-[#2E2620] focus:outline-none focus:border-[#1E3524]"
                  >
                    <option value="Linha Adulto">Linha Adulto</option>
                    <option value="Linha Teens">Linha Teens</option>
                    <option value="Linha Kids">Linha Kids</option>
                    <option value="Acessórios">Acessórios</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 mb-1">PREÇO (R$) *</label>
                  <input
                    type="text"
                    required
                    placeholder="129.90"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-[#E8E1D5] rounded-lg text-xs text-[#2E2620] focus:outline-none focus:border-[#1E3524]"
                  />
                </div>
              </div>

              {/* FOTOS DA PEÇA (ATÉ 3 FOTOS) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-stone-700 font-bold">
                    FOTOS DA PEÇA (MÁXIMO DE 3 FOTOS) *
                  </label>
                  <span className="text-[10px] text-stone-500 font-mono">
                    {photos.length} de 3 fotos adicionadas
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mb-3">
                  Adicione fotos da frente, das costas e detalhes da costura/tecido (Suedine 205g).
                </p>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {/* Grid dos 3 Slots de Fotos */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Foto 1 (Principal/Capa)", sub: "Visão frontal" },
                    { label: "Foto 2 (Costas/Verso)", sub: "Visão traseira" },
                    { label: "Foto 3 (Detalhes)", sub: "Gola e costura" },
                  ].map((slotInfo, idx) => {
                    const slotPhoto = photos[idx];
                    return (
                      <div
                        key={idx}
                        className={`rounded-lg border p-2.5 flex flex-col items-center justify-between transition-all ${
                          slotPhoto
                            ? "border-[#1E3524]/30 bg-stone-50"
                            : "border-dashed border-stone-300 bg-[#FAF7F2]/50 hover:border-stone-400"
                        }`}
                      >
                        <div className="w-full flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono font-semibold text-[#2E2620]">
                            {slotInfo.label}
                          </span>
                          {idx === 0 && (
                            <span className="text-[8px] uppercase tracking-wider bg-[#1E3524] text-white px-1.5 py-0.2 rounded font-mono">
                              Capa
                            </span>
                          )}
                        </div>

                        {/* Área do Thumbnail */}
                        <div className="relative w-full h-28 rounded-md overflow-hidden bg-white border border-stone-200 flex items-center justify-center mb-2">
                          {slotPhoto ? (
                            <Image
                              src={slotPhoto}
                              alt={slotInfo.label}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-stone-400 p-2 text-center">
                              <Camera className="w-6 h-6 mb-1 text-stone-300" />
                              <span className="text-[9px] font-mono text-stone-400">{slotInfo.sub}</span>
                            </div>
                          )}
                        </div>

                        {/* Ações do Slot */}
                        <div className="w-full flex items-center gap-1.5">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleTriggerUpload(idx)}
                            className="flex-1 bg-[#1E3524] hover:bg-[#152519] text-white text-[10px] font-mono h-7 flex items-center justify-center gap-1"
                          >
                            <Upload className="w-3 h-3" />
                            <span>{slotPhoto ? "Trocar" : "+ Foto"}</span>
                          </Button>

                          {slotPhoto && (
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(idx)}
                              className="h-7 w-7 rounded border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
                              title="Remover foto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Presets Rápidos para facilitar testes */}
                <div className="mt-3 pt-2.5 border-t border-stone-200">
                  <span className="text-[10px] font-mono text-stone-500 block mb-1.5">
                    Ou adicione fotos rápidas do acervo oficial:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: "+ Off-White (Frente)", url: "/catalog/tee-oversized-offwhite-frente.jpeg" },
                      { label: "+ Off-White (Costas)", url: "/catalog/tee-oversized-offwhite-costas.jpeg" },
                      { label: "+ Preto (Frente)", url: "/catalog/tee-oversized-preto-frente.jpeg" },
                      { label: "+ Preto (Costas)", url: "/catalog/tee-oversized-preto-costas.jpeg" },
                      { label: "+ Marrom Boxy", url: "/catalog/hoodie-boxy-marrom-frente.jpeg" },
                      { label: "+ Detalhe Costura", url: "/catalog/detalhes-costura.jpeg" },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setPhotos((prev) => {
                            if (prev.length < 3) return [...prev, preset.url];
                            const updated = [...prev];
                            updated[0] = preset.url;
                            return updated;
                          });
                          toast.success(`Foto "${preset.label}" adicionada!`);
                        }}
                        className="text-[10px] px-2 py-0.5 rounded border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 font-mono transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 mb-1">ESTOQUE INICIAL (POR TAMANHO P, M, G):</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-[#E8E1D5] rounded-lg text-xs text-[#2E2620] focus:outline-none focus:border-[#1E3524]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#E8E1D5]">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="border-stone-300 text-xs"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-[#1E3524] hover:bg-[#152519] text-white text-xs font-mono"
                >
                  {editingProductId ? "Salvar Alterações" : "Confirmar Cadastro"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rodapé Oficial de Suporte Técnico & Criação */}
      <div className="mt-12 pt-6 border-t border-[#E8E1D5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-stone-500">
        <div>
          <span>BRANCH CLO. &bull; Painel de Gestão de Estoque v2.0</span>
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
