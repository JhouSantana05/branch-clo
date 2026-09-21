import React from "react";
import Image from "next/image";
import Link from "next/link";
import { OFFICIAL_PRODUCTS } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { HomeFeaturedReviews } from "@/components/home-featured-reviews";

export default function HomePage() {
  const featuredProducts = OFFICIAL_PRODUCTS.slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* 1. HERO BANNER DE IMPACTO EDITORIAL (Layout Tecovas) */}
      <section className="relative w-full overflow-hidden bg-[#241E19]">
        <div className="relative h-[520px] sm:h-[620px] w-full">
          <Image
            src="/catalog/detalhes-costura.jpeg"
            alt="Coleção Branch Clo John 15:5"
            fill
            priority
            className="object-cover object-center brightness-[0.65] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />

          <div className="absolute inset-0 mx-auto flex max-w-7xl items-center px-6 sm:px-10 lg:px-12">
            <div className="max-w-xl text-left">
              <span className="inline-block mb-3 text-xs font-mono uppercase tracking-[0.3em] text-[#D2C5B3]">
                THE VINE COLLECTION &bull; JOÃO 15:5
              </span>

              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight">
                MAIS QUE ROUPA. <br />
                UM LEMBRETE DIÁRIO.
              </h1>

              <p className="mt-4 text-sm sm:text-base text-stone-200 leading-relaxed font-light">
                Malha Suedine Premium 205g/m² 100% algodão com gola ribana 3cm, logo em silk emborrachado e estampa inteira nas costas. Coleções pensadas para toda a família.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/masculino"
                  className="inline-block border border-white/30 bg-[#1E3524] hover:bg-[#142418] px-8 py-3.5 text-xs font-mono font-semibold uppercase tracking-widest text-white shadow-md transition-all duration-200"
                >
                  VER MASCULINO
                </Link>
                <Link
                  href="/infantil"
                  className="inline-block border border-white/60 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-7 py-3.5 text-xs font-mono font-semibold uppercase tracking-widest text-white transition-all duration-200"
                >
                  LINHA INFANTIL
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NAVEGAÇÃO VISUAL ENTRE AS CATEGORIAS (Cards Grandes de Acesso Direto) */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 border-b border-stone-200 bg-[#F5EFE6]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-8">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#8C7A68]">
              DEPARTAMENTOS
            </span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#2E2620] mt-1">
              Explore por Linha
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <Link
              href="/masculino"
              className="group relative h-64 sm:h-72 overflow-hidden rounded-sm border border-stone-300 bg-white shadow-xs hover:shadow-md transition-shadow"
            >
              <Image
                src="/catalog/hoodie-boxy-preto-costas.jpeg"
                alt="Moda Masculina"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <span className="block text-[10px] font-mono text-[#D2C5B3] uppercase tracking-widest">
                  R$ 129,90
                </span>
                <span className="text-sm sm:text-base font-mono uppercase tracking-widest text-white font-bold flex items-center justify-between">
                  MASCULINO <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

            <Link
              href="/feminino"
              className="group relative h-64 sm:h-72 overflow-hidden rounded-sm border border-stone-300 bg-white shadow-xs hover:shadow-md transition-shadow"
            >
              <Image
                src="/catalog/detalhes-costura.jpeg"
                alt="Moda Feminina"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <span className="block text-[10px] font-mono text-[#D2C5B3] uppercase tracking-widest">
                  R$ 129,90
                </span>
                <span className="text-sm sm:text-base font-mono uppercase tracking-widest text-white font-bold flex items-center justify-between">
                  FEMININO <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

            <Link
              href="/teens"
              className="group relative h-64 sm:h-72 overflow-hidden rounded-sm border border-stone-300 bg-white shadow-xs hover:shadow-md transition-shadow"
            >
              <Image
                src="/catalog/hoodie-boxy-marrom-frente.jpeg"
                alt="Linha Teens"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <span className="block text-[10px] font-mono text-[#D2C5B3] uppercase tracking-widest">
                  R$ 109,90
                </span>
                <span className="text-sm sm:text-base font-mono uppercase tracking-widest text-white font-bold flex items-center justify-between">
                  TEENS <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

            <Link
              href="/infantil"
              className="group relative h-64 sm:h-72 overflow-hidden rounded-sm border border-stone-300 bg-white shadow-xs hover:shadow-md transition-shadow"
            >
              <Image
                src="/catalog/tee-oversized-offwhite-costas.jpeg"
                alt="Linha Infantil"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <span className="block text-[10px] font-mono text-[#D2C5B3] uppercase tracking-widest">
                  R$ 79,90
                </span>
                <span className="text-sm sm:text-base font-mono uppercase tracking-widest text-white font-bold flex items-center justify-between">
                  INFANTIL <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* 3. TABELA DE PREÇOS OFICIAL COM BOTÕES DIRECIONANDO PARA CADA PÁGINA */}
      <section id="tabela" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF7F2] border-b border-stone-200">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-[#8C7A68]">
              TABELA DE PREÇOS OFICIAL
            </h2>
            <p className="text-2xl sm:text-3xl font-serif text-[#2E2620] mt-1 italic">
              Mais que roupa. Um lembrete diário.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* LINHA ADULTO */}
            <div className="rounded-sm border border-stone-300/80 bg-[#FDFCF9] p-7 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center pb-5 border-b border-stone-200">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#7E7265]">
                  LINHA
                </span>
                <h3 className="text-2xl font-bold uppercase tracking-wide text-[#2E2620]">
                  ADULTO
                </h3>
                <div className="mt-3 text-3xl font-bold text-[#1E3524] font-mono">
                  R$ 129,90
                </div>
              </div>

              <div className="my-5 relative aspect-square bg-[#F3EDE3] rounded-sm overflow-hidden border border-stone-200">
                <Image
                  src="/catalog/detalhes-costura.jpeg"
                  alt="Linha Adulto The Vine"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-2 text-xs text-[#52463C] font-mono mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Suedine Premium 205G (100% Algodão)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Logo Silk Emborrachado 3,5 cm</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Gola Ribana 3 cm & Etiqueta Couro</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/masculino"
                  className="py-2.5 text-center text-xs font-mono uppercase tracking-wider font-semibold bg-[#1E3524] text-white hover:bg-[#142418] transition-colors rounded-sm"
                >
                  Ver Masculino
                </Link>
                <Link
                  href="/feminino"
                  className="py-2.5 text-center text-xs font-mono uppercase tracking-wider font-semibold border border-stone-300 bg-[#F5EFE6] text-[#2E2620] hover:bg-[#EAE2D5] transition-colors rounded-sm"
                >
                  Ver Feminino
                </Link>
              </div>
            </div>

            {/* LINHA TEENS */}
            <div className="rounded-sm border border-stone-300/80 bg-[#FDFCF9] p-7 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center pb-5 border-b border-stone-200">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#7E7265]">
                  LINHA
                </span>
                <h3 className="text-2xl font-bold uppercase tracking-wide text-[#2E2620]">
                  TEENS
                </h3>
                <div className="mt-3 text-3xl font-bold text-[#1E3524] font-mono">
                  R$ 109,90
                </div>
              </div>

              <div className="my-5 relative aspect-square bg-[#F3EDE3] rounded-sm overflow-hidden border border-stone-200">
                <Image
                  src="/catalog/hoodie-boxy-marrom-frente.jpeg"
                  alt="Linha Teens Juizes 7:7"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-2 text-xs text-[#52463C] font-mono mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Suedine Premium 205G Slim</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Estampa Juízes 7:7 O Chamado</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Tamanhos 12 &bull; 14 &bull; 16 &bull; PP</span>
                </div>
              </div>

              <Link
                href="/teens"
                className="block w-full py-2.5 text-center text-xs font-mono uppercase tracking-wider font-semibold bg-[#1E3524] text-white hover:bg-[#142418] transition-colors rounded-sm"
              >
                Explorar Linha Teens
              </Link>
            </div>

            {/* LINHA KIDS */}
            <div className="rounded-sm border border-stone-300/80 bg-[#FDFCF9] p-7 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center pb-5 border-b border-stone-200">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#7E7265]">
                  LINHA
                </span>
                <h3 className="text-2xl font-bold uppercase tracking-wide text-[#2E2620]">
                  KIDS
                </h3>
                <div className="mt-3 text-3xl font-bold text-[#1E3524] font-mono">
                  R$ 79,90
                </div>
              </div>

              <div className="my-5 relative aspect-square bg-[#F3EDE3] rounded-sm overflow-hidden border border-stone-200">
                <Image
                  src="/catalog/tee-oversized-offwhite-costas.jpeg"
                  alt="Linha Kids Salmo 23 e Jonas"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-2 text-xs text-[#52463C] font-mono mb-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Suedine Macio 205G Antialérgico</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Histórias Bíblicas Infantis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Tamanhos 2 a 10 anos</span>
                </div>
              </div>

              <Link
                href="/infantil"
                className="block w-full py-2.5 text-center text-xs font-mono uppercase tracking-wider font-semibold bg-[#1E3524] text-white hover:bg-[#142418] transition-colors rounded-sm"
              >
                Explorar Linha Infantil
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 4. DESTAQUES DO CATÁLOGO GERAL */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl w-full">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#7E7265]">
              EM DESTAQUE
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#2E2620] mt-1">
              Coleção Autorizada Branch Clo
            </h2>
          </div>

          <Link
            href="/masculino"
            className="text-xs font-mono text-[#1E3524] font-bold uppercase tracking-wider hover:underline flex items-center gap-1"
          >
            Ver Todas as Peças <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. FICHA TÉCNICA E DETALHES DE ENGENHARIA TÊXTIL */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 border-t border-stone-200 bg-[#F5EFE6]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center sm:text-left">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#7E7265]">
              PADRÃO DE CONFECÇÃO
            </span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#2E2620]">
              Ficha Técnica de Acabamento & Matéria-Prima
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="border border-stone-200 bg-[#FDFCF9] p-4 rounded-sm">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#7E7265] mb-1">
                TECIDO
              </div>
              <div className="text-xs font-bold text-[#2E2620] uppercase">
                SUEDINE PREMIUM
              </div>
              <p className="text-[11px] text-[#7E7265] mt-1 font-mono">
                100% Algodão • 205g/m² <br />
                Rendimento 2,60
              </p>
            </div>

            <div className="border border-stone-200 bg-[#FDFCF9] p-4 rounded-sm">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#7E7265] mb-1">
                GOLA
              </div>
              <div className="text-xs font-bold text-[#2E2620] uppercase">
                RIBANA PREMIUM
              </div>
              <p className="text-[11px] text-[#7E7265] mt-1 font-mono">
                Espessura 3 cm <br />
                Estrutura firme
              </p>
            </div>

            <div className="border border-stone-200 bg-[#FDFCF9] p-4 rounded-sm">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#7E7265] mb-1">
                LOGO FRONTAL
              </div>
              <div className="text-xs font-bold text-[#2E2620] uppercase">
                SILK EMBORRACHADO
              </div>
              <p className="text-[11px] text-[#7E7265] mt-1 font-mono">
                Tamanho 3,5 cm <br />
                Toque em alto relevo
              </p>
            </div>

            <div className="border border-stone-200 bg-[#FDFCF9] p-4 rounded-sm">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#7E7265] mb-1">
                ETIQUETA INTERNA
              </div>
              <div className="text-xs font-bold text-[#2E2620] uppercase">
                SILK DIGITAL (TAGLESS)
              </div>
              <p className="text-[11px] text-[#7E7265] mt-1 font-mono">
                Zero costura na nuca <br />
                Conforto absoluto
              </p>
            </div>

            <div className="border border-stone-200 bg-[#FDFCF9] p-4 rounded-sm col-span-2 md:col-span-1">
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#7E7265] mb-1">
                ETIQUETA EXTERNA
              </div>
              <div className="text-xs font-bold text-[#2E2620] uppercase">
                COURO SINTÉTICO
              </div>
              <p className="text-[11px] text-[#7E7265] mt-1 font-mono">
                Dimensão 4 x 5 cm <br />
                Gravação João 15:5
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. AVALIAÇÕES EM DESTAQUE SELECIONADAS PELO LOJISTA (No Final da Home) */}
      <HomeFeaturedReviews />
    </div>
  );
}
