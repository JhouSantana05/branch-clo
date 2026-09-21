"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, Menu, X, ChevronRight, User, LogOut } from "lucide-react";
import { OFFICIAL_PRODUCTS } from "@/lib/catalog";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export function Header() {
  const pathname = usePathname();
  const { customer, isCustomerAuthenticated, logoutCustomer } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = searchQuery.trim()
    ? OFFICIAL_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const navLinks = [
    { name: "MASCULINO", href: "/masculino", sub: "Linha Adulto R$ 129,90" },
    { name: "FEMININO", href: "/feminino", sub: "Linha Slim R$ 129,90" },
    { name: "TEENS", href: "/teens", sub: "Linha Jovem R$ 109,90" },
    { name: "INFANTIL", href: "/infantil", sub: "Linha Kids R$ 79,90" },
    { name: "ACESSÓRIOS", href: "/acessorios", sub: "Couro Ecológico & Detalhes" },
  ];

  return (
    <>
      {/* 1. FRASE EM CIMA (Top Announcement Bar Oficial) */}
      <div className="bg-[#ECE5DA] border-b border-[#DFD6C7] text-[#4A3E34] py-2 px-4 text-center text-[10px] sm:text-xs font-mono tracking-widest uppercase font-medium">
        <span>MAIS QUE ROUPA. UM LEMBRETE DIÁRIO. | THE VINE COLLECTION | FRETE GRÁTIS ACIMA DE R$ 399</span>
      </div>

      {/* 2. HEADER EM 3 COLUNAS (Inspirado no Layout Tecovas com Logo Central) */}
      <header className="sticky top-0 z-50 border-b border-stone-200 bg-[#FAF7F2]/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 sm:h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 relative">
          
          {/* Lado Esquerdo: Mobile Trigger & Desktop Nav */}
          <div className="flex items-center">
            {/* Botão Hambúrguer Mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Abrir Menu"
              className="lg:hidden p-1 text-[#2E2620] hover:text-[#7E7265] transition-colors mr-2"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Menus Desktop */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-7 text-xs font-mono uppercase tracking-widest text-[#2E2620]">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`transition-colors py-1 ${
                      isActive
                        ? "text-[#1E3524] font-bold border-b-2 border-[#1E3524]"
                        : "font-medium hover:text-[#7E7265]"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Centro: Logotipo Oficial da Empresa */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
            <Link href="/" className="group flex flex-col items-center justify-center py-1">
              <div className="relative h-14 sm:h-20 w-36 sm:w-52 transition-transform duration-200 group-hover:scale-105">
                <Image
                  src="/brand/logo.svg"
                  alt="BRANCH CLO."
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Lado Direito: Busca, Log in e Sacola */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar"
              className="text-[#2E2620] hover:text-[#7E7265] transition-colors p-1"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Login do Cliente */}
            {isCustomerAuthenticated ? (
              <div className="flex items-center gap-1.5 bg-[#EBF2EB] px-2.5 py-1 rounded-sm">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-[#1E3524] font-semibold hover:underline"
                  title={`Conectado como ${customer?.name}`}
                >
                  <User className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Olá, {customer?.name.split(" ")[0]}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logoutCustomer();
                    toast.info("Você saiu da sua conta.");
                  }}
                  className="text-stone-500 hover:text-red-600 transition-colors p-0.5 ml-1"
                  title="Sair da Conta"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-mono uppercase tracking-widest font-medium text-[#2E2620] hover:text-[#1E3524] transition-colors"
              >
                <User className="h-3.5 w-3.5" />
                <span>ENTRAR</span>
              </Link>
            )}

            <Link
              href="/rastreio"
              className="hidden md:inline-block text-xs font-mono uppercase tracking-widest font-medium text-[#2E2620] hover:text-[#1E3524] transition-colors"
            >
              RASTREIO
            </Link>

            <Link
              href="/admin/pedidos"
              className="hidden sm:inline-block text-xs font-mono uppercase tracking-widest font-medium text-[#2E2620] hover:text-[#7E7265] transition-colors"
            >
              GESTÃO
            </Link>

            <Link
              href="/checkout"
              aria-label="Sacola de Compras"
              className="relative flex items-center text-[#2E2620] hover:text-[#7E7265] transition-colors p-1"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#1E3524] text-[9px] font-bold text-white">
                1
              </span>
            </Link>
          </div>

        </div>
      </header>

      {/* 2.1 MODAL DE BUSCA INTELIGENTE */}
      {searchOpen && (
        <div className="fixed inset-0 z-[110] flex items-start justify-center pt-20 px-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => {
              setSearchOpen(false);
              setSearchQuery("");
            }}
          />

          <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-sm border border-stone-300 shadow-2xl overflow-hidden z-10 animate-in fade-in-0 zoom-in-95 duration-200">
            {/* Input de Busca */}
            <div className="flex items-center px-4 py-3.5 border-b border-stone-200 bg-white">
              <Search className="h-5 w-5 text-stone-400 mr-3 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por peça, versículo (João 15, Mateus 17...) ou linha..."
                className="w-full text-sm font-mono text-[#2E2620] placeholder:text-stone-400 focus:outline-none bg-transparent"
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="p-1 text-stone-400 hover:text-stone-700 ml-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sugestões ou Resultados */}
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {searchQuery.trim() === "" ? (
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#8C7A68] mb-3">
                    SUGESTÕES DE BUSCA:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["The Vine", "Mustard Seed", "Juízes 7", "Salmo 23", "Linha Adulto", "Linha Kids"].map(
                      (term) => (
                        <button
                          key={term}
                          onClick={() => setSearchQuery(term)}
                          className="px-3 py-1.5 rounded-sm border border-stone-200 bg-[#F5EFE6] text-xs font-mono text-[#2E2620] hover:border-stone-400 transition-colors"
                        >
                          {term}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#8C7A68] mb-2">
                    {searchResults.length} {searchResults.length === 1 ? "PEÇA ENCONTRADA" : "PEÇAS ENCONTRADAS"}
                  </div>
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/produtos/${product.slug}`}
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-4 p-2.5 rounded-sm hover:bg-[#F5EFE6] transition-colors border border-transparent hover:border-stone-200"
                    >
                      <div className="relative h-14 w-12 rounded-sm overflow-hidden bg-[#F3EDE3] shrink-0 border border-stone-200">
                        <Image
                          src={product.images[0]?.url || "/catalog/tee-oversized-offwhite-frente.jpeg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-[#8C7A68]">
                          {product.categoryName}
                        </span>
                        <h4 className="text-xs font-bold font-mono text-[#2E2620] uppercase truncate">
                          {product.name}
                        </h4>
                        <p className="text-[11px] text-[#7E7265] truncate font-light">
                          {product.description}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold font-mono text-[#1E3524]">
                          R$ {product.variants[0]?.regularPrice.toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-xs font-mono text-[#7E7265]">
                  Nenhuma peça encontrada para &ldquo;{searchQuery}&rdquo;. Tente buscar por *The Vine*, *João 15* ou *Kids*.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. MENU MOBILE DRAWER (Gaveta Lateral Suave) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Painel do Menu */}
          <div className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-[#FAF7F2] border-r border-stone-300 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Topo do Drawer */}
              <div className="flex items-center justify-between pb-5 border-b border-stone-200">
                <div className="relative h-10 w-28">
                  <Image
                    src="/brand/logo.svg"
                    alt="BRANCH CLO."
                    fill
                    className="object-contain"
                  />
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Fechar Menu"
                  className="p-2 text-[#2E2620] hover:text-[#7E7265]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Status da Conta do Cliente no Mobile */}
              <div className="py-3 border-b border-stone-200">
                {isCustomerAuthenticated ? (
                  <div className="bg-[#EBF2EB] p-3 rounded-sm flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-[#1E3524] uppercase font-bold tracking-wider">
                        Cliente Conectado
                      </div>
                      <div className="text-xs font-mono font-semibold text-[#2E2620]">
                        {customer?.name}
                      </div>
                      <div className="text-[10px] font-mono text-stone-500">
                        {customer?.email}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        logoutCustomer();
                        setMobileMenuOpen(false);
                        toast.info("Você saiu da sua conta.");
                      }}
                      className="text-xs font-mono text-red-600 hover:underline flex items-center gap-1"
                    >
                      <LogOut className="w-3 h-3" />
                      Sair
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#1E3524] text-white rounded-sm text-xs font-mono font-bold uppercase tracking-wider"
                  >
                    <User className="w-4 h-4" />
                    <span>Entrar ou Cadastrar</span>
                  </Link>
                )}
              </div>

              {/* Links de Departamentos */}
              <div className="py-4 space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#8C7A68] px-2 mb-2">
                  DEPARTAMENTOS
                </div>
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-3.5 rounded-sm transition-colors ${
                        isActive
                          ? "bg-[#ECE5DA] text-[#1E3524] font-bold"
                          : "hover:bg-[#F3EDE3] text-[#2E2620]"
                      }`}
                    >
                      <div>
                        <div className="text-sm font-mono tracking-wider">{link.name}</div>
                        <div className="text-[11px] text-[#7E7265]">{link.sub}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#8C7A68]" />
                    </Link>
                  );
                })}
              </div>

              {/* Tabela de Preços & Atalhos */}
              <div className="pt-4 border-t border-stone-200 space-y-2">
                <Link
                  href="/rastreio"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-xs font-mono uppercase text-[#7E7265] hover:text-[#1E3524] font-medium"
                >
                  RASTREAR MEU PEDIDO
                </Link>
                <Link
                  href="/sobre"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-xs font-mono uppercase text-[#7E7265] hover:text-[#1E3524]"
                >
                  O PROPÓSITO & MANIFESTO
                </Link>
                <Link
                  href="/ajuda"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-xs font-mono uppercase text-[#7E7265] hover:text-[#1E3524]"
                >
                  CENTRAL DE AJUDA & FAQ
                </Link>
                <Link
                  href="/#tabela"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-xs font-mono uppercase text-[#7E7265] hover:text-[#2E2620]"
                >
                  TABELA DE PREÇOS OFICIAL
                </Link>
                <Link
                  href="/#catalogo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-xs font-mono uppercase text-[#7E7265] hover:text-[#2E2620]"
                >
                  VER TODA A COLEÇÃO
                </Link>
              </div>
            </div>

            {/* Rodapé do Menu Mobile */}
            <div className="pt-6 border-t border-stone-200">
              <p className="text-[11px] font-mono text-[#7E7265] uppercase leading-relaxed">
                The Vine Collection &bull; João 15:5 <br />
                <span className="text-[#2E2620] font-semibold">Mais que roupa. Um lembrete diário.</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
