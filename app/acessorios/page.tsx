import React from "react";
import Link from "next/link";
import { getProductsByCategory } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { CheckCircle2, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Acessórios | BRANCH CLO.",
  description: "Acessórios e emblemas em couro legítimo sintético Branch Clo João 15:5.",
};

export default async function AcessoriosPage() {
  const products = await getProductsByCategory("acessorios");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Breadcrumb e Cabeçalho da Categoria */}
      <section className="bg-[#F5EFE6] border-b border-stone-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-[#8C7A68] mb-4">
            <Link href="/" className="hover:text-[#2E2620] transition-colors">
              HOME
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[#2E2620] font-bold">ACESSÓRIOS</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#8C7A68]">
                DETALHES AUTORAIS &bull; THE VINE COLLECTION
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#2E2620] mt-1">
                Acessórios
              </h1>
              <p className="mt-3 text-sm text-[#665A4F] max-w-xl font-light">
                Elementos que carregam a essência e o emblema Branch Clo. Etiquetas em couro sintético 4x5cm com gravação em baixo relevo João 15:5 e artigos autorais.
              </p>
            </div>

            <div className="bg-[#FDFCF9] border border-stone-300 p-4 rounded-sm flex items-baseline gap-3">
              <span className="text-xs font-mono uppercase text-[#7E7265]">ITENS AUTORAIS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Produtos da Categoria */}
      <main className="flex-1 py-14 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}
