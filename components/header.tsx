"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Search, User } from "lucide-react";

export function Header() {
  const pathname = usePathname();

  const navLinks = [
    { name: "MASCULINO", href: "/masculino" },
    { name: "FEMININO", href: "/feminino" },
    { name: "TEENS", href: "/teens" },
    { name: "INFANTIL", href: "/infantil" },
    { name: "ACESSÓRIOS", href: "/acessorios" },
  ];

  return (
    <>
      {/* 1. FRASE EM CIMA (Top Announcement Bar Oficial) */}
      <div className="bg-[#ECE5DA] border-b border-[#DFD6C7] text-[#4A3E34] py-2 px-4 text-center text-[10px] sm:text-xs font-mono tracking-widest uppercase font-medium">
        <span>MAIS QUE ROUPA. UM LEMBRETE DIÁRIO. | THE VINE COLLECTION | FRETE GRÁTIS ACIMA DE R$ 399</span>
      </div>

      {/* 2. HEADER EM 3 COLUNAS (Inspirado no Layout Tecovas com Logo Central) */}
      <header className="sticky top-0 z-50 border-b border-stone-200 bg-[#FAF7F2]/95 backdrop-blur-md">
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 relative">
          
          {/* Lado Esquerdo: Menus solicitados */}
          <nav className="flex items-center space-x-4 lg:space-x-7 text-xs font-mono uppercase tracking-widest text-[#2E2620]">
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
                  } ${
                    link.name === "TEENS" ? "hidden sm:inline-block" : ""
                  } ${
                    link.name === "ACESSÓRIOS" ? "hidden lg:inline-block" : ""
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Centro: Logotipo Oficial da Empresa */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
            <Link href="/" className="group flex flex-col items-center justify-center py-1">
              <div className="relative h-16 sm:h-20 w-44 sm:w-52 transition-transform duration-200 group-hover:scale-105">
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
          <div className="flex items-center space-x-4 sm:space-x-6">
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
    </>
  );
}
