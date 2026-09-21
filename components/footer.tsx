import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, RefreshCw, CreditCard } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#E8E1D5] bg-[#FAF7F2] text-[#2E2620] font-mono">
      {/* Selos de Benefício */}
      <div className="border-b border-[#E8E1D5] bg-[#F5EFE6] py-6 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center gap-1">
            <Truck className="w-5 h-5 text-[#1E3524]" />
            <span className="text-xs font-bold uppercase tracking-wider">Frete Grátis</span>
            <span className="text-[11px] text-stone-500">Para compras acima de R$ 399</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <CreditCard className="w-5 h-5 text-[#1E3524]" />
            <span className="text-xs font-bold uppercase tracking-wider">PIX 5% OFF</span>
            <span className="text-[11px] text-stone-500">Desconto instantâneo à vista</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <RefreshCw className="w-5 h-5 text-[#1E3524]" />
            <span className="text-xs font-bold uppercase tracking-wider">1ª Troca Grátis</span>
            <span className="text-[11px] text-stone-500">Até 7 dias após o recebimento</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="w-5 h-5 text-[#1E3524]" />
            <span className="text-xs font-bold uppercase tracking-wider">Suedine 205g</span>
            <span className="text-[11px] text-stone-500">100% algodão nobre aveludado</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 text-xs">
        {/* Brand Column (5 cols) */}
        <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left gap-4">
          <Link href="/" className="inline-flex justify-center md:justify-start">
            <div className="relative h-20 w-52 sm:h-24 sm:w-60">
              <Image
                src="/brand/logo.svg"
                alt="BRANCH CLO."
                fill
                className="object-contain object-center md:object-left"
              />
            </div>
          </Link>
          <p className="text-[#8C7A68] text-[11px] leading-relaxed max-w-sm">
            THE VINE COLLECTION &bull; Moda cristã autoral confeccionada em Suedine Premium 205g.
            Enraizados em Cristo. Conectados ao Propósito.
          </p>
          <span className="text-[#A39280] text-[10px]">
            &copy; {new Date().getFullYear()} BRANCH CLO. Todos os direitos reservados.
          </span>
        </div>

        {/* Coleções (4 cols) */}
        <div className="md:col-span-4 flex flex-col gap-2.5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#2E2620] mb-1">
            Coleções
          </span>
          <Link href="/masculino" className="hover:text-[#1E3524] transition-colors text-stone-600">
            Moda Masculina (The Vine & Mustard Seed)
          </Link>
          <Link href="/feminino" className="hover:text-[#1E3524] transition-colors text-stone-600">
            Moda Feminina (Modelagem Slim & Conforto)
          </Link>
          <Link href="/teens" className="hover:text-[#1E3524] transition-colors text-stone-600">
            Linha Teens (Juízes 7:7 — O Chamado)
          </Link>
          <Link href="/infantil" className="hover:text-[#1E3524] transition-colors text-stone-600">
            Linha Kids (Histórias Bíblicas)
          </Link>
          <Link href="/acessorios" className="hover:text-[#1E3524] transition-colors text-stone-600">
            Acessórios & Emblemas em Couro
          </Link>
          <Link href="/#tabela" className="hover:text-[#1E3524] transition-colors font-medium text-stone-700">
            Tabela Oficial de Preços
          </Link>
        </div>

        {/* Institucional & Suporte (3 cols) */}
        <div className="md:col-span-3 flex flex-col gap-2.5">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#2E2620] mb-1">
            Ajuda & Rastreio
          </span>
          <Link href="/rastreio" className="hover:text-[#1E3524] transition-colors text-stone-600 font-semibold text-[#1E3524]">
            Rastrear Meu Pedido
          </Link>
          <Link href="/sobre" className="hover:text-[#1E3524] transition-colors text-stone-600">
            O Propósito & Manifesto
          </Link>
          <Link href="/ajuda" className="hover:text-[#1E3524] transition-colors text-stone-600">
            Dúvidas Frequentes (FAQ)
          </Link>
          <Link href="/checkout" className="hover:text-[#1E3524] transition-colors text-stone-600">
            Checkout Seguro
          </Link>
        </div>
      </div>

      {/* Barra Inferior Oficial: Direitos & Assinatura de Criação JS Web & Business */}
      <div className="border-t border-[#E8E1D5] bg-[#F2ECE2] py-4 px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-600">
          <div>
            <span>&copy; {new Date().getFullYear()} <strong>BRANCH CLO.</strong> Todos os direitos reservados &bull; The Vine Collection (João 15:5)</span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 text-stone-700">
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500">Desenvolvimento & Criação:</span>
            <a
              href="https://wa.me/5511954532927?text=Ol%C3%A1!%20Vi%20o%20site%20da%20Branch%20Clo%20desenvolvido%20pela%20JS%20Web%20%26%20Business%20e%20gostaria%20de%20um%20or%C3%A7amento."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-[#1E3524] hover:text-[#152519] bg-[#E5DDCF] hover:bg-[#DDD3C2] px-2.5 py-1 rounded transition-colors shadow-xs"
              title="Falar com JS Web & Business no WhatsApp"
            >
              <span className="font-bold tracking-tight">JS Web & Business</span>
              <span className="text-stone-400 font-normal">&bull;</span>
              <span className="text-[11px] font-mono text-stone-700">(11) 95453-2927</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
