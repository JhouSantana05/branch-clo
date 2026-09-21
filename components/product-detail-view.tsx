"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { ProductData, VariantData } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ShoppingBag,
  MessageCircle,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Ruler,
  Sparkles,
} from "lucide-react";

interface ProductDetailViewProps {
  product: ProductData;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  // Cores disponíveis
  const colors = Array.from(new Set(product.variants.map((v) => v.colorName)));
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || "Padrão");

  // Variantes da cor selecionada
  const variantsForColor = product.variants.filter((v) => v.colorName === selectedColor);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    variantsForColor[0]?.id || product.variants[0]?.id || ""
  );

  const activeVariant: VariantData | undefined =
    product.variants.find((v) => v.id === selectedVariantId) || variantsForColor[0];

  // Imagens filtradas para a cor
  const matchingImages = product.images.filter((img) =>
    selectedColor.toLowerCase().includes("off-white")
      ? img.url.includes("offwhite")
      : selectedColor.toLowerCase().includes("marrom")
      ? img.url.includes("marrom")
      : img.url.includes("preto")
  );

  const galleryImages = matchingImages.length > 0 ? matchingImages : product.images;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const currentImage = galleryImages[activeImageIndex] || galleryImages[0] || {
    url: "/catalog/tee-oversized-preto-frente.jpeg",
    altText: product.name,
  };

  // Simulação de CEP
  const [cep, setCep] = useState("");
  const [freteCalculado, setFreteCalculado] = useState<boolean>(false);

  // Categoria Link
  const categoryHref =
    product.categoryName.toLowerCase().includes("adulto")
      ? "/masculino"
      : product.categoryName.toLowerCase().includes("teens")
      ? "/teens"
      : product.categoryName.toLowerCase().includes("kids")
      ? "/infantil"
      : "/acessorios";

  // Adicionar à sacola
  const handleAddToCart = () => {
    if (!activeVariant) return;
    toast.success("Peça adicionada à sacola", {
      description: `${product.name} — ${selectedColor} (Tam: ${activeVariant.size})`,
      action: {
        label: "Fechar",
        onClick: () => {},
      },
    });
  };

  // Comprar via WhatsApp
  const handleWhatsAppBuy = () => {
    const phone = "5511999999999"; // WhatsApp comercial configurável
    const priceText = formatCurrency(activeVariant?.promotionalPrice || activeVariant?.regularPrice || 129.9);
    const message = encodeURIComponent(
      `Olá! Tenho interesse em comprar na Branch Clo:\n\n*Peça:* ${product.name}\n*Cor:* ${selectedColor}\n*Tamanho:* ${activeVariant?.size || "Padrão"}\n*Valor:* ${priceText}\n\nPoderia me informar a disponibilidade para envio?`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2] text-[#2E2620]">
      {/* Breadcrumb Navegação */}
      <div className="border-b border-stone-200 bg-[#F5EFE6]/60 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#8C7A68]">
          <Link href="/" className="hover:text-[#2E2620] transition-colors">
            HOME
          </Link>
          <ChevronRight className="h-3 w-3 text-stone-400" />
          <Link href={categoryHref} className="hover:text-[#2E2620] transition-colors">
            {product.categoryName.toUpperCase()}
          </Link>
          <ChevronRight className="h-3 w-3 text-stone-400" />
          <span className="text-[#2E2620] font-semibold truncate">{product.name}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16">
          
          {/* COLUNA ESQUERDA: GALERIA DE FOTOS (7 colunas) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Miniaturas laterais no desktop */}
            {galleryImages.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-24 shrink-0">
                {galleryImages.map((img, idx) => {
                  const isSelected = activeImageIndex === idx;
                  return (
                    <button
                      key={img.id || idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative aspect-square w-20 sm:w-24 rounded-sm overflow-hidden border transition-all ${
                        isSelected
                          ? "border-[#2E2620] ring-2 ring-[#2E2620]/30 scale-[0.98]"
                          : "border-stone-300 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={img.altText || product.name}
                        fill
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Imagem Principal Grande */}
            <div className="flex-1 relative aspect-[3/4] rounded-sm overflow-hidden bg-[#F3EDE3] border border-stone-200/90 shadow-sm">
              <Image
                src={currentImage.url}
                alt={currentImage.altText || product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              <div className="absolute left-4 top-4">
                <span className="rounded-sm bg-[#FAF7F2]/90 backdrop-blur-sm px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-[#3E342B] border border-stone-200/80 shadow-xs">
                  {product.categoryName}
                </span>
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: INFORMAÇÕES, SELEÇÃO & COMPRA (5 colunas) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Badge da Linha & Nome */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8C7A68]">
                  THE VINE COLLECTION &bull; CONFECÇÃO PRÓPRIA
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#2E2620] leading-snug">
                {product.name}
              </h1>

              {/* Preço Oficial e Parcelamento */}
              <div className="mt-4 pb-5 border-b border-stone-200">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-[#1E3524] font-mono">
                    {formatCurrency(activeVariant?.promotionalPrice || activeVariant?.regularPrice || 129.9)}
                  </span>
                  {activeVariant?.promotionalPrice && (
                    <span className="text-sm text-[#8C7A68] line-through font-mono">
                      {formatCurrency(activeVariant.regularPrice)}
                    </span>
                  )}
                  <span className="text-xs font-mono uppercase text-[#7E7265] ml-auto">
                    Até 3x sem juros
                  </span>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-mono text-[#4A6348] bg-[#EBF2EB] px-2.5 py-1 rounded-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>5% de desconto à vista no PIX</span>
                </div>
              </div>

              {/* Descrição Curta */}
              <p className="mt-4 text-xs sm:text-sm text-[#5C5046] leading-relaxed font-light">
                {product.description}
              </p>

              {/* Seletor de Cores */}
              {colors.length > 1 && (
                <div className="mt-6 pt-6 border-t border-stone-200">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#7E7265]">
                      COR: <strong className="text-[#2E2620]">{selectedColor}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {colors.map((color) => {
                      const isSelected = selectedColor === color;
                      const sampleVar = product.variants.find((v) => v.colorName === color);
                      return (
                        <button
                          key={color}
                          onClick={() => {
                            setSelectedColor(color);
                            setActiveImageIndex(0);
                            const firstVar = product.variants.find((v) => v.colorName === color);
                            if (firstVar) setSelectedVariantId(firstVar.id);
                          }}
                          className={`flex items-center gap-2 px-3 py-2 rounded-sm border text-xs font-mono transition-all ${
                            isSelected
                              ? "border-[#2E2620] bg-[#F3EDE3] text-[#2E2620] font-bold shadow-xs ring-1 ring-[#2E2620]"
                              : "border-stone-200 bg-[#FDFCF9] text-[#7E7265] hover:border-stone-400"
                          }`}
                        >
                          <span
                            className="h-3.5 w-3.5 rounded-full border border-black/20"
                            style={{ backgroundColor: sampleVar?.hexColor || "#333" }}
                          />
                          <span>{color}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Seletor de Grade de Tamanhos */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#7E7265]">
                    SELECIONE O TAMANHO:
                  </span>
                  <span className="text-[11px] font-mono text-[#586E53]">
                    ● {activeVariant?.stockAvailable || 0} unidades em estoque
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {variantsForColor.map((variant) => {
                    const isSelected = activeVariant?.id === variant.id;
                    const isOutOfStock = variant.stockAvailable <= 0;

                    return (
                      <button
                        key={variant.id}
                        disabled={isOutOfStock}
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`flex flex-col items-center justify-center py-3 rounded-sm border text-xs font-mono transition-all ${
                          isSelected
                            ? "border-[#1E3524] bg-[#1E3524] text-white font-bold shadow-sm"
                            : isOutOfStock
                            ? "border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed line-through"
                            : "border-stone-300 bg-[#FDFCF9] hover:border-stone-500 text-[#2E2620]"
                        }`}
                      >
                        <span className="text-sm font-bold">{variant.size}</span>
                        <span className={`text-[10px] ${isSelected ? "text-stone-300" : "text-[#7E7265]"}`}>
                          {variant.stockAvailable}un
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="mt-8 space-y-3">
                {/* Adicionar à Sacola */}
                <Button
                  onClick={handleAddToCart}
                  className="w-full h-12 bg-[#2E2620] hover:bg-[#1C1713] text-[#FAF7F2] font-mono uppercase tracking-widest text-xs font-semibold rounded-sm gap-2 shadow-sm"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Adicionar à Sacola
                </Button>

                {/* Comprar via WhatsApp */}
                <Button
                  onClick={handleWhatsAppBuy}
                  variant="outline"
                  className="w-full h-12 border-[#1E3524] text-[#1E3524] hover:bg-[#1E3524] hover:text-white font-mono uppercase tracking-widest text-xs font-semibold rounded-sm gap-2 transition-colors shadow-xs"
                >
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                  Comprar pelo WhatsApp
                </Button>
              </div>

              {/* Simulador de Frete */}
              <div className="mt-6 p-4 rounded-sm border border-stone-200 bg-[#F5EFE6]/70">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#2E2620] mb-2 font-semibold">
                  <Truck className="h-4 w-4 text-[#1E3524]" />
                  <span>Calcular Frete & Prazo:</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={9}
                    placeholder="00000-000"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs font-mono bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#2E2620]"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (cep.length >= 8) {
                        setFreteCalculado(true);
                      } else {
                        toast.error("Por favor, digite um CEP válido");
                      }
                    }}
                    className="text-xs font-mono uppercase tracking-wider rounded-sm border-stone-300"
                  >
                    Calcular
                  </Button>
                </div>
                {freteCalculado && (
                  <div className="mt-3 text-xs font-mono text-[#52463C] space-y-1 pt-2 border-t border-stone-300/80">
                    <div className="flex justify-between">
                      <span>SEDEX Expresso (2-4 dias):</span>
                      <strong className="text-[#2E2620]">R$ 19,90</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>PAC Padrão (5-8 dias):</span>
                      <strong className="text-[#2E2620]">R$ 12,50</strong>
                    </div>
                    <div className="text-[10px] text-[#1E3524] font-semibold pt-1">
                      ★ FRETE GRÁTIS EM COMPRAS ACIMA DE R$ 399
                    </div>
                  </div>
                )}
              </div>

              {/* Selos de Confiança */}
              <div className="mt-6 grid grid-cols-2 gap-3 pt-6 border-t border-stone-200 text-[11px] font-mono text-[#7E7265]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#1E3524]" />
                  <span>Algodão Nobre 100% Puro</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-[#1E3524]" />
                  <span>Troca Fácil em até 7 dias</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* SEÇÃO INFERIOR: FICHA TÉCNICA, HISTÓRIA & GUIA DE MEDIDAS */}
        <div className="mt-16 sm:mt-24 pt-12 border-t border-stone-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* 1. FICHA TÉCNICA OFICIAL */}
            <div className="bg-[#FDFCF9] border border-stone-200 p-6 rounded-sm">
              <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-[#8C7A68] mb-4">
                FICHA TÉCNICA TÊXTIL
              </h3>
              <ul className="space-y-3 text-xs font-mono text-[#52463C]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1E3524] shrink-0 mt-0.5" />
                  <span>
                    <strong>Tecido:</strong> Suedine Premium 205g/m² 100% Algodão (Rendimento 2,60).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1E3524] shrink-0 mt-0.5" />
                  <span>
                    <strong>Gola:</strong> Ribana encorpada de 3 cm com reforço ombro a ombro.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1E3524] shrink-0 mt-0.5" />
                  <span>
                    <strong>Logo Frontal:</strong> Silk emborrachado em alto relevo de 3,5 cm.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1E3524] shrink-0 mt-0.5" />
                  <span>
                    <strong>Etiqueta Interna:</strong> Silk digital tagless (zero incômodo na nuca).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#1E3524] shrink-0 mt-0.5" />
                  <span>
                    <strong>Etiqueta de Barra:</strong> Couro sintético 4x5cm gravado com João 15:5.
                  </span>
                </li>
              </ul>
            </div>

            {/* 2. MENSAGEM & PROPÓSITO CRISTÃO */}
            <div className="bg-[#F5EFE6] border border-stone-300/80 p-6 rounded-sm">
              <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-[#8C7A68] mb-2">
                O PROPÓSITO DA PEÇA
              </h3>
              <p className="font-serif italic text-lg text-[#2E2620] mb-3">
                &ldquo;Mais que roupa. Um lembrete diário.&rdquo;
              </p>
              <blockquote className="border-l-2 border-[#1E3524] pl-3 py-1 text-xs text-[#52463C] font-light leading-relaxed mb-4">
                &ldquo;Eu sou a videira, vós, as varas; quem está em mim, e eu nele, esse dá muito fruto; porque sem mim nada podeis fazer.&rdquo;
                <footer className="text-[10px] font-mono font-semibold text-[#1E3524] mt-1">
                  — JOÃO 15:5
                </footer>
              </blockquote>
              <p className="text-xs text-[#665A4F] leading-relaxed font-light">
                Cada costura e detalhe foi desenhado para ser uma extensão da sua identidade de fé, unindo a modéstia elegante à qualidade nobre dos tecidos pesados.
              </p>
            </div>

            {/* 3. GUIA DE MEDIDAS & CUIDADOS */}
            <div className="bg-[#FDFCF9] border border-stone-200 p-6 rounded-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-[#8C7A68]">
                  TABELA DE MEDIDAS (CM)
                </h3>
                <Ruler className="h-4 w-4 text-[#8C7A68]" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 text-[#7E7265]">
                      <th className="py-1 text-left">TAM</th>
                      <th className="py-1 text-center">TÓRAX</th>
                      <th className="py-1 text-center">COMPR.</th>
                      <th className="py-1 text-right">MANGA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-[#2E2620]">
                    <tr>
                      <td className="py-2 font-bold">P</td>
                      <td className="py-2 text-center">54 cm</td>
                      <td className="py-2 text-center">72 cm</td>
                      <td className="py-2 text-right">22 cm</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold">M</td>
                      <td className="py-2 text-center">56 cm</td>
                      <td className="py-2 text-center">74 cm</td>
                      <td className="py-2 text-right">23 cm</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold">G</td>
                      <td className="py-2 text-center">58 cm</td>
                      <td className="py-2 text-center">76 cm</td>
                      <td className="py-2 text-right">24 cm</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-bold">GG</td>
                      <td className="py-2 text-center">61 cm</td>
                      <td className="py-2 text-center">78 cm</td>
                      <td className="py-2 text-right">25 cm</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 text-[10px] font-mono text-[#7E7265] leading-normal">
                <strong>Instruções de Lavagem:</strong> Lavar em ciclo suave com água fria. Secar à sombra. Não passar sobre o silk emborrachado.
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
