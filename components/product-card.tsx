"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ShoppingBag, Ruler, Check, Eye } from "lucide-react";

export interface VariantData {
  id: string;
  size: string;
  colorName: string;
  hexColor?: string | null;
  skuCode: string;
  regularPrice: number;
  promotionalPrice?: number | null;
  stockAvailable: number;
  weightGrams: number;
  heightCm: number;
  widthCm: number;
  lengthCm: number;
}

export interface ImageData {
  id: string;
  url: string;
  altText?: string | null;
  isMain: boolean;
  displayOrder: number;
}

export interface ProductData {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  fabricComposition?: string | null;
  washingInstructions?: string | null;
  categoryName: string;
  images: ImageData[];
  variants: VariantData[];
}

export function ProductCard({ product }: { product: ProductData }) {
  const colors = Array.from(
    new Set(product.variants.map((v) => v.colorName))
  );

  const [selectedColor, setSelectedColor] = useState<string>(
    colors[0] || "Padrão"
  );

  const variantsForColor = product.variants.filter(
    (v) => v.colorName === selectedColor
  );

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    variantsForColor[0]?.id || ""
  );

  const activeVariant =
    product.variants.find((v) => v.id === selectedVariantId) ||
    variantsForColor[0];

  const matchingImages = product.images.filter((img) =>
    selectedColor.toLowerCase().includes("off-white")
      ? img.url.includes("offwhite")
      : selectedColor.toLowerCase().includes("marrom")
      ? img.url.includes("marrom")
      : img.url.includes("preto")
  );

  const primaryImage = matchingImages[0] || product.images[0] || {
    url: "/catalog/tee-oversized-preto-frente.jpeg",
    altText: product.name,
  };

  const secondaryImage = matchingImages[1] || product.images[1] || primaryImage;

  const [isHovered, setIsHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const handleAddToCart = () => {
    if (!activeVariant) return;
    toast.success("Adicionado à sacola com sucesso", {
      description: `${product.name} (${selectedColor} - Tamanho ${activeVariant.size})`,
      action: {
        label: "Ver Sacola",
        onClick: () => console.log("Abrir checkout"),
      },
    });
  };

  return (
    <div className="group relative flex flex-col rounded-sm border border-stone-200/90 bg-[#FDFCF9] shadow-sm transition-all duration-300 hover:shadow-md hover:border-stone-300">
      {/* Imagem com fundo em linho quente e hover flip */}
      <Link
        href={`/produtos/${product.slug}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#F3EDE3] block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={isHovered ? secondaryImage.url : primaryImage.url}
          alt={primaryImage.altText || product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Badges Suaves */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
          <span className="rounded-sm bg-[#FAF7F2]/90 backdrop-blur-sm px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest text-[#3E342B] border border-stone-200/80 shadow-xs">
            {product.categoryName}
          </span>
          {activeVariant?.promotionalPrice && (
            <span className="rounded-sm bg-[#C4705A]/15 backdrop-blur-sm px-2.5 py-1 text-[9px] font-mono uppercase tracking-widest text-[#98432F] border border-[#C4705A]/30">
              OFERTA ESPECIAL
            </span>
          )}
        </div>

        {/* Quick View Trigger Button */}
        <div className="absolute inset-0 flex items-center justify-center bg-[#2E2620]/25 backdrop-blur-[2px] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setQuickViewOpen(true);
            }}
            className="flex items-center gap-2 rounded-sm border border-stone-200 bg-[#FAF7F2]/95 px-4 py-2 text-[11px] font-mono tracking-widest text-[#2E2620] shadow-sm uppercase hover:bg-white transition-colors"
          >
            <Eye className="h-3.5 w-3.5 text-[#7E7265]" /> Olhar Rápido
          </button>
        </div>
      </Link>

      {/* Detalhes do Produto */}
      <div className="flex flex-1 flex-col p-5">
        {/* Seletor de Cores */}
        {colors.length > 1 && (
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-[#7E7265] font-mono">
              Variação:
            </span>
            <div className="flex gap-1.5">
              {colors.map((color) => {
                const isSelected = selectedColor === color;
                const sampleVar = product.variants.find(
                  (v) => v.colorName === color
                );
                return (
                  <button
                    key={color}
                    onClick={() => {
                      setSelectedColor(color);
                      const firstVar = product.variants.find(
                        (v) => v.colorName === color
                      );
                      if (firstVar) setSelectedVariantId(firstVar.id);
                    }}
                    title={color}
                    className={`h-4 w-4 rounded-full border transition-all ${
                      isSelected
                        ? "ring-2 ring-[#382B22] ring-offset-2 ring-offset-[#FDFCF9] scale-110"
                        : "opacity-80 hover:opacity-100"
                    }`}
                    style={{
                      backgroundColor: sampleVar?.hexColor || "#333",
                      borderColor: "rgba(0,0,0,0.15)",
                    }}
                  />
                );
              })}
            </div>
            <span className="text-[11px] text-[#7E7265] ml-auto font-mono">
              {selectedColor}
            </span>
          </div>
        )}

        {/* Título com Link */}
        <Link href={`/produtos/${product.slug}`} className="group/title">
          <h3 className="text-sm font-semibold tracking-wide uppercase text-[#2E2620] leading-snug group-hover/title:text-[#7E7265] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Preço */}
        <div className="mt-2 flex items-baseline gap-2">
          {activeVariant?.promotionalPrice ? (
            <>
              <span className="text-base font-bold text-[#2E2620]">
                {formatCurrency(activeVariant.promotionalPrice)}
              </span>
              <span className="text-xs text-[#8C7A68] line-through">
                {formatCurrency(activeVariant.regularPrice)}
              </span>
            </>
          ) : (
            <span className="text-base font-bold text-[#2E2620]">
              {formatCurrency(activeVariant?.regularPrice || 0)}
            </span>
          )}
          <span className="text-[10px] text-[#8C7A68] font-mono uppercase ml-auto">
            Até 3x sem juros
          </span>
        </div>

        {/* Grade de Tamanhos & Estoque */}
        <div className="mt-4 pt-4 border-t border-stone-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#7E7265]">
              Grade Disponível:
            </span>
            <span className="text-[10px] font-mono text-[#586E53]">
              ● {activeVariant?.stockAvailable || 0} unidades
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {variantsForColor.map((variant) => {
              const isSelected = activeVariant?.id === variant.id;
              const isOutOfStock = variant.stockAvailable <= 0;

              return (
                <button
                  key={variant.id}
                  disabled={isOutOfStock}
                  onClick={() => setSelectedVariantId(variant.id)}
                  className={`flex flex-col items-center justify-center py-2 rounded-sm border text-xs font-mono transition-all ${
                    isSelected
                      ? "border-[#382B22] bg-[#382B22] text-[#FAF7F2] font-semibold shadow-xs"
                      : isOutOfStock
                      ? "border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed line-through"
                      : "border-stone-200 bg-[#FAF7F2] hover:border-stone-400 text-[#2E2620]"
                  }`}
                >
                  <span>{variant.size}</span>
                  <span className={`text-[9px] ${isSelected ? "text-[#E5DDD0]" : "text-[#7E7265]"}`}>
                    {variant.stockAvailable}un
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ações */}
        <div className="mt-5 grid grid-cols-5 gap-2">
          <Button
            onClick={handleAddToCart}
            className="col-span-4 gap-2 text-xs uppercase tracking-wider bg-[#382B22] text-[#FAF7F2] hover:bg-[#2A2019] rounded-sm"
          >
            <ShoppingBag className="h-4 w-4" />
            Adicionar à Sacola
          </Button>

          {/* Dialog Modal com Medidas & Ficha Técnica */}
          <Dialog open={quickViewOpen} onOpenChange={setQuickViewOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="w-full border-stone-300 bg-[#FAF7F2] hover:bg-[#EFE8DC] text-[#382B22] rounded-sm"
                title="Guia de Medidas e Detalhes"
              >
                <Ruler className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-[#FAF7F2] border-stone-300 text-[#2E2620]">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="font-mono text-[10px] border-stone-300 text-[#7E7265]">
                    {product.categoryName}
                  </Badge>
                  <span className="text-[11px] font-mono text-[#7E7265]">
                    SKU: {activeVariant?.skuCode}
                  </span>
                </div>
                <DialogTitle className="text-xl font-bold uppercase tracking-wide text-[#2E2620]">
                  {product.name}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="relative aspect-square bg-[#F3EDE3] border border-stone-200 rounded-sm overflow-hidden">
                  <Image
                    src={primaryImage.url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col justify-between text-xs space-y-4">
                  <div>
                    <h4 className="font-mono font-bold uppercase tracking-wider text-[#7E7265] mb-1">
                      Composição & Matéria-Prima
                    </h4>
                    <p className="text-[#3E342B] leading-relaxed">
                      {product.fabricComposition || "100% Algodão Premium Heavyweight"}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-mono font-bold uppercase tracking-wider text-[#7E7265] mb-1">
                      Cuidados & Lavagem
                    </h4>
                    <p className="text-[#7E7265] leading-relaxed">
                      {product.washingInstructions || "Lavar com cores semelhantes em ciclo suave. Secar à sombra."}
                    </p>
                  </div>

                  <div className="border-t border-stone-200 pt-3">
                    <h4 className="font-mono font-bold uppercase tracking-wider text-[#7E7265] mb-2">
                      Ficha de Logística (Embalagem)
                    </h4>
                    <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-[#3E342B]">
                      <div>Peso: {activeVariant?.weightGrams}g</div>
                      <div>Altura: {activeVariant?.heightCm}cm</div>
                      <div>Largura: {activeVariant?.widthCm}cm</div>
                      <div>Comprimento: {activeVariant?.lengthCm}cm</div>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      handleAddToCart();
                      setQuickViewOpen(false);
                    }}
                    className="w-full gap-2 text-xs uppercase tracking-wider bg-[#382B22] text-[#FAF7F2] hover:bg-[#2A2019] rounded-sm"
                  >
                    <Check className="h-4 w-4" /> Confirmar e Adicionar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
