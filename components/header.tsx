"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, Menu, X, ChevronRight } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              aria-label="Buscar"
              className="text-[#2E2620] hover:text-[#7E7265] transition-colors p-1"
            >
              <Search className="h-4 w-4" />
            </button>

            <Link
              href="#"
              className="hidden sm:inline-block text-xs font-mono uppercase tracking-widest font-medium text-[#2E2620] hover:text-[#7E7265] transition-colors"
            >
              LOG IN
            </Link>

            <button
              aria-label="Sacola de Compras"
              className="relative flex items-center text-[#2E2620] hover:text-[#7E7265] transition-colors p-1"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#1E3524] text-[9px] font-bold text-white">
                2
              </span>
            </button>
          </div>

        </div>
      </header>

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

              {/* Links de Departamentos */}
              <div className="py-6 space-y-2">
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
