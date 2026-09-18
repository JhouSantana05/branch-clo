import React from "react";
import Link from "next/link";
import { getProductsByCategory } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { CheckCircle2, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Moda Masculina | BRANCH CLO.",
  description: "Peças masculinas em Suedine Premium 205g 100% algodão com corte slim, gola ribana 3cm e propósito cristão autoral.",
};

export default async function MasculinoPage() {
  const products = await getProductsByCategory("masculino");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Breadcrumb e Cabeçalho da Categoria */}
      <section className="bg-[#F5EFE6] border-b border-stone-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#8C7A68] mb-4">
            <Link href="/" className="hover:text-[#2E2620] transition-colors">
              HOME
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#2E2620] font-bold">MODA MASCULINA</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8C7A68]">
                LINHA ADULTO &bull; THE VINE COLLECTION
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#2E2620] mt-1">
                Moda Masculina
              </h1>
              <p className="mt-3 text-sm text-[#665A4F] max-w-xl font-light">
                Modelagens estruturadas em Suedine Premium 205g 100% algodão. Gola ribana 3cm encorpada, logo em silk emborrachado e estampa inteira nas costas.
              </p>
            </div>

            <div className="bg-[#FDFCF9] border border-stone-300 p-4 rounded-sm flex items-baseline gap-3">
              <span className="text-xs font-mono uppercase text-[#7E7265]">PREÇO OFICIAL:</span>
              <span className="text-2xl font-bold text-[#1E3524] font-mono">R$ 129,90</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Produtos da Categoria */}
      <main className="flex-1 py-14 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl w-full">
        {/* Barra de Filtros e Contagem */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#7E7265]">
            <span>GRADE DE TAMANHOS:</span>
            <span className="font-bold text-[#2E2620]">P &bull; M &bull; G &bull; GG</span>
          </div>

          <div className="text-xs font-mono text-[#7E7265]">
            EXIBINDO <strong>{products.length}</strong> MODELAGENS MASCULINAS
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Ficha Rápida da Linha Adulto */}
        <div className="mt-16 bg-[#F5EFE6] border border-stone-200 p-8 rounded-sm">
          <h3 className="font-mono text-xs uppercase tracking-widest text-[#7E7265] mb-4">
            ESPECIFICAÇÕES DA LINHA MASCULINA:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-[#52463C]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#1E3524]" />
              <span>Suedine Premium 205G (100% Algodão)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#1E3524]" />
              <span>Gola Ribana 3 cm Reforçada</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[#1E3524]" />
              <span>Etiqueta em Couro 4x5cm na Barra</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
