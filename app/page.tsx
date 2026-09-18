import React from "react";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard, ProductData } from "@/components/product-card";
import {
  ShoppingBag,
  Search,
  User,
  ShieldCheck,
  Zap,
  Layers,
  Heart,
  Tag,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

// Catálogo Oficial da Branch Clo
const OFFICIAL_CATALOG: ProductData[] = [
  {
    id: "prod-ad-vine",
    name: "The Vine — João 15:5 (Linha Adulto)",
    slug: "the-vine-joao-15-5-adulto",
    categoryName: "Linha Adulto",
    description:
      "Mais que roupa. Um lembrete diário. Malha Suedine Premium 205g 100% algodão com rendimento nobre. Estampa nas costas 'I AM THE VINE, YOU ARE THE BRANCHES — JOHN 15:5' e logo frontal em silk emborrachado de 3,5cm. Gola ribana 3cm e etiqueta em couro sintético 4x5cm na barra.",
    fabricComposition: "Suedine Premium 100% Algodão 205g/m² (Rendimento 2,60)",
    washingInstructions: "Lavar em ciclo suave com água fria. Secar à sombra. Não passar sobre o silk emborrachado.",
    images: [
      {
        id: "img-v1",
        url: "/catalog/detalhes-costura.jpeg",
        altText: "Branch Clo The Vine Costas John 15:5",
        isMain: true,
        displayOrder: 1,
      },
      {
        id: "img-v2",
        url: "/catalog/tee-oversized-offwhite-frente.jpeg",
        altText: "Branch Clo The Vine Frente Silk Emborrachado",
        isMain: false,
        displayOrder: 2,
      },
    ],
    variants: [
      {
        id: "var-ad-ofw-p",
        size: "P",
        colorName: "Off-White",
        hexColor: "#F5F1E8",
        skuCode: "BC-AD-VINE-OFW-P",
        regularPrice: 129.9,
        stockAvailable: 15,
        weightGrams: 280,
        heightCm: 3,
        widthCm: 24,
        lengthCm: 30,
      },
      {
        id: "var-ad-ofw-m",
        size: "M",
        colorName: "Off-White",
        hexColor: "#F5F1E8",
        skuCode: "BC-AD-VINE-OFW-M",
        regularPrice: 129.9,
        stockAvailable: 30,
        weightGrams: 290,
        heightCm: 3,
        widthCm: 24,
        lengthCm: 30,
      },
      {
        id: "var-ad-ofw-g",
        size: "G",
        colorName: "Off-White",
        hexColor: "#F5F1E8",
        skuCode: "BC-AD-VINE-OFW-G",
        regularPrice: 129.9,
        stockAvailable: 25,
        weightGrams: 300,
        heightCm: 3,
        widthCm: 24,
        lengthCm: 30,
      },
      {
        id: "var-ad-ofw-gg",
        size: "GG",
        colorName: "Off-White",
        hexColor: "#F5F1E8",
        skuCode: "BC-AD-VINE-OFW-GG",
        regularPrice: 129.9,
        stockAvailable: 12,
        weightGrams: 320,
        heightCm: 3,
        widthCm: 24,
        lengthCm: 30,
      },
      {
        id: "var-ad-blk-m",
        size: "M",
        colorName: "Preto",
        hexColor: "#1C1A18",
        skuCode: "BC-AD-VINE-BLK-M",
        regularPrice: 129.9,
        stockAvailable: 20,
        weightGrams: 290,
        heightCm: 3,
        widthCm: 24,
        lengthCm: 30,
      },
      {
        id: "var-ad-wht-m",
        size: "M",
        colorName: "Branco",
        hexColor: "#FFFFFF",
        skuCode: "BC-AD-VINE-WHT-M",
        regularPrice: 129.9,
        stockAvailable: 18,
        weightGrams: 290,
        heightCm: 3,
        widthCm: 24,
        lengthCm: 30,
      },
    ],
  },
  {
    id: "prod-ad-mustard",
    name: "Mustard Seed — Mateus 17:20 (Linha Adulto)",
    slug: "mustard-seed-mateus-17-20-adulto",
    categoryName: "Linha Adulto",
    description:
      "Mais que roupa. Um lembrete diário. Suedine Premium 205g/m² 100% algodão penteado. Estampa autoral 'FAITH THE SIZE OF A MUSTARD SEED — MATEUS 17:20' com ilustração da semente enraizada e brotando. Toque macio, gola ribana 3cm e etiqueta digital interna tagless.",
    fabricComposition: "Suedine Premium 100% Algodão 205g/m²",
    washingInstructions: "Lavar do avesso com sabão suave. Não usar secadora.",
    images: [
      {
        id: "img-m1",
        url: "/catalog/hoodie-boxy-preto-costas.jpeg",
        altText: "Branch Clo Mustard Seed Mateus 17:20 Costas",
        isMain: true,
        displayOrder: 1,
      },
      {
        id: "img-m2",
        url: "/catalog/hoodie-boxy-preto-frente.jpeg",
        altText: "Branch Clo Mustard Seed Detalhe da Estampa",
        isMain: false,
        displayOrder: 2,
      },
    ],
    variants: [
      {
        id: "var-mstd-ofw-p",
        size: "P",
        colorName: "Off-White",
        hexColor: "#F5F1E8",
        skuCode: "BC-AD-MSTD-OFW-P",
        regularPrice: 129.9,
        stockAvailable: 14,
        weightGrams: 280,
        heightCm: 3,
        widthCm: 24,
        lengthCm: 30,
      },
      {
        id: "var-mstd-ofw-m",
        size: "M",
        colorName: "Off-White",
        hexColor: "#F5F1E8",
        skuCode: "BC-AD-MSTD-OFW-M",
        regularPrice: 129.9,
        stockAvailable: 35,
        weightGrams: 290,
        heightCm: 3,
        widthCm: 24,
        lengthCm: 30,
      },
      {
        id: "var-mstd-ofw-g",
        size: "G",
        colorName: "Off-White",
        hexColor: "#F5F1E8",
        skuCode: "BC-AD-MSTD-OFW-G",
        regularPrice: 129.9,
        stockAvailable: 22,
        weightGrams: 300,
        heightCm: 3,
        widthCm: 24,
        lengthCm: 30,
      },
      {
        id: "var-mstd-ofw-gg",
        size: "GG",
        colorName: "Off-White",
        hexColor: "#F5F1E8",
        skuCode: "BC-AD-MSTD-OFW-GG",
        regularPrice: 129.9,
        stockAvailable: 10,
        weightGrams: 320,
        heightCm: 3,
        widthCm: 24,
        lengthCm: 30,
      },
    ],
  },
  {
    id: "prod-tn-judges",
    name: "O Chamado — Juízes 7:7 (Linha Teens)",
    slug: "o-chamado-juizes-7-7-teens",
    categoryName: "Linha Teens",
    description:
      "Mais que roupa. Um lembrete diário. Modelagem slim moderna e suedine premium 205g/m². Estampa costas inteira em silk screen premium inspirada na coragem do exército de Gideão (Juízes 7:7). Logo frontal em silk emborrachado e etiqueta em couro 4x5cm na barra.",
    fabricComposition: "Suedine Premium 100% Algodão 205g/m²",
    washingInstructions: "Lavar em ciclo suave com cores semelhantes. Secar ao ar livre.",
    images: [
      {
        id: "img-tn1",
        url: "/catalog/hoodie-boxy-marrom-frente.jpeg",
        altText: "Branch Clo Teens Juizes 7:7 Frente",
        isMain: true,
        displayOrder: 1,
      },
      {
        id: "img-tn2",
        url: "/catalog/hoodie-boxy-marrom-costas.jpeg",
        altText: "Branch Clo Teens Juizes 7:7 Costas Guerreiro",
        isMain: false,
        displayOrder: 2,
      },
    ],
    variants: [
      {
        id: "var-tn-blk-12",
        size: "12",
        colorName: "Preto",
        hexColor: "#1C1A18",
        skuCode: "BC-TN-JUDGES-BLK-12",
        regularPrice: 109.9,
        stockAvailable: 15,
        weightGrams: 220,
        heightCm: 3,
        widthCm: 22,
        lengthCm: 28,
      },
      {
        id: "var-tn-blk-14",
        size: "14",
        colorName: "Preto",
        hexColor: "#1C1A18",
        skuCode: "BC-TN-JUDGES-BLK-14",
        regularPrice: 109.9,
        stockAvailable: 20,
        weightGrams: 230,
        heightCm: 3,
        widthCm: 22,
        lengthCm: 28,
      },
      {
        id: "var-tn-blk-16",
        size: "16",
        colorName: "Preto",
        hexColor: "#1C1A18",
        skuCode: "BC-TN-JUDGES-BLK-16",
        regularPrice: 109.9,
        stockAvailable: 18,
        weightGrams: 240,
        heightCm: 3,
        widthCm: 22,
        lengthCm: 28,
      },
      {
        id: "var-tn-blk-pp",
        size: "PP",
        colorName: "Preto",
        hexColor: "#1C1A18",
        skuCode: "BC-TN-JUDGES-BLK-PP",
        regularPrice: 109.9,
        stockAvailable: 12,
        weightGrams: 250,
        heightCm: 3,
        widthCm: 22,
        lengthCm: 28,
      },
    ],
  },
  {
    id: "prod-kd-salmo",
    name: "Eu Sou Cuidado Por Ele — Salmo 23:1 (Linha Kids)",
    slug: "eu-sou-cuidado-por-ele-salmo-23-1-kids",
    categoryName: "Linha Kids",
    description:
      "Mais que roupa. Um lembrete diário para os pequeninos. Suedine Premium 205g/m² 100% algodão ultra macio e antialérgico. Estampa frontal delicada da ovelhinha e costas inteira com 'EU SOU CUIDADO POR ELE — SALMO 23:1' em silk colorido premium.",
    fabricComposition: "Suedine Premium 100% Algodão Kids 205g/m²",
    washingInstructions: "Lavar com sabão neutro em água fria. Secar à sombra.",
    images: [
      {
        id: "img-k1",
        url: "/catalog/tee-oversized-offwhite-frente.jpeg",
        altText: "Branch Kids Salmo 23:1 Ovelhinha Costas",
        isMain: true,
        displayOrder: 1,
      },
      {
        id: "img-k2",
        url: "/catalog/tee-oversized-preto-costas.jpeg",
        altText: "Branch Kids Davi Adora a Deus",
        isMain: false,
        displayOrder: 2,
      },
    ],
    variants: [
      {
        id: "var-kd-ofw-2",
        size: "2",
        colorName: "Off-White",
        hexColor: "#F5F1E8",
        skuCode: "BC-KD-PSALM-OFW-2",
        regularPrice: 79.9,
        stockAvailable: 16,
        weightGrams: 150,
        heightCm: 2,
        widthCm: 18,
        lengthCm: 24,
      },
      {
        id: "var-kd-ofw-4",
        size: "4",
        colorName: "Off-White",
        hexColor: "#F5F1E8",
        skuCode: "BC-KD-PSALM-OFW-4",
        regularPrice: 79.9,
        stockAvailable: 24,
        weightGrams: 160,
        heightCm: 2,
        widthCm: 18,
        lengthCm: 24,
      },
      {
        id: "var-kd-ofw-6",
        size: "6",
        colorName: "Off-White",
        hexColor: "#F5F1E8",
        skuCode: "BC-KD-PSALM-OFW-6",
        regularPrice: 79.9,
        stockAvailable: 20,
        weightGrams: 170,
        heightCm: 2,
        widthCm: 18,
        lengthCm: 24,
      },
      {
        id: "var-kd-ofw-8",
        size: "8",
        colorName: "Off-White",
        hexColor: "#F5F1E8",
        skuCode: "BC-KD-PSALM-OFW-8",
        regularPrice: 79.9,
        stockAvailable: 14,
        weightGrams: 180,
        heightCm: 2,
        widthCm: 18,
        lengthCm: 24,
      },
    ],
  },
];

async function getProducts(): Promise<ProductData[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      where: { active: true },
      include: {
        category: true,
        images: { orderBy: { displayOrder: "asc" } },
        variants: { where: { active: true }, orderBy: { size: "asc" } },
      },
    });

    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        categoryName: p.category.name,
        description: p.description,
        fabricComposition: p.fabricComposition,
        washingInstructions: p.washingInstructions,
        images: p.images,
        variants: p.variants,
      }));
    }
  } catch {
    // Fallback de segurança
  }

  return OFFICIAL_CATALOG;
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2] text-[#2E2620]">
      {/* 1. FRASE EM CIMA (Top Announcement Bar Oficial) */}
      <div className="bg-[#ECE5DA] border-b border-[#DFD6C7] text-[#4A3E34] py-2 px-4 text-center text-[10px] sm:text-xs font-mono tracking-widest uppercase font-medium">
        <span>MAIS QUE ROUPA. UM LEMBRETE DIÁRIO. | THE VINE COLLECTION | FRETE GRÁTIS ACIMA DE R$ 399</span>
      </div>

      {/* 2. HEADER EM 3 COLUNAS (Inspirado no Layout Tecovas com Logo Central de Destaque) */}
      <header className="sticky top-0 z-50 border-b border-stone-200 bg-[#FAF7F2]/95 backdrop-blur-md">
        <div className="mx-auto flex h-24 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 relative">
          
          {/* Lado Esquerdo: Menus solicitados */}
          <nav className="flex items-center space-x-4 lg:space-x-7 text-xs font-mono uppercase tracking-widest text-[#2E2620]">
            <Link href="#adulto" className="font-medium hover:text-[#7E7265] transition-colors">
              MASCULINO
            </Link>
            <Link href="#adulto" className="font-medium hover:text-[#7E7265] transition-colors">
              FEMININO
            </Link>
            <Link href="#teens" className="font-medium hover:text-[#7E7265] transition-colors hidden sm:inline-block">
              TEENS
            </Link>
            <Link href="#kids" className="font-medium hover:text-[#7E7265] transition-colors hidden md:inline-block">
              INFANTIL
            </Link>
            <Link href="#acessorios" className="font-medium hover:text-[#7E7265] transition-colors hidden lg:inline-block">
              ACESSÓRIOS
            </Link>
          </nav>

          {/* Centro: Logotipo Oficial da Empresa (Perfeitamente Alinhado e com Altura Adequada) */}
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

      {/* 3. HERO BANNER DE IMPACTO EDITORIAL (Layout Tecovas) */}
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
                THE VINE COLLECTION • JOÃO 15:5
              </span>

              <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-tight">
                MAIS QUE ROUPA. <br />
                UM LEMBRETE DIÁRIO.
              </h1>

              <p className="mt-4 text-sm sm:text-base text-stone-200 leading-relaxed font-light">
                Malha Suedine Premium 205g/m² 100% algodão com gola ribana 3cm, logo em silk emborrachado e estampa inteira nas costas. Modelagens adultas, teens e infantis feitas para expressar raízes com nobreza.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="#tabela"
                  className="inline-block border border-white/30 bg-[#1E3524] hover:bg-[#142418] px-8 py-3.5 text-xs font-mono font-semibold uppercase tracking-widest text-white shadow-md transition-all duration-200"
                >
                  TABELA DE PREÇOS
                </Link>
                <Link
                  href="#catalogo"
                  className="inline-block border border-white/60 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-7 py-3.5 text-xs font-mono font-semibold uppercase tracking-widest text-white transition-all duration-200"
                >
                  VER PRODUTOS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TABELA DE PREÇOS OFICIAL (Conforme Imagem Oficial da Marca) */}
      <section id="tabela" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F5EFE6] border-b border-stone-200">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center mb-2">
              <div className="relative h-8 w-28">
                <Image src="/brand/logo.svg" alt="Branch Clo" fill className="object-contain" />
              </div>
            </div>
            <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-[#8C7A68]">
              TABELA DE PREÇOS OFICIAL
            </h2>
            <p className="text-2xl sm:text-3xl font-serif text-[#2E2620] mt-1 italic">
              Mais que roupa. Um lembrete diário.
            </p>
          </div>

          {/* Grid das 3 Linhas com Preços Oficiais */}
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

              <div className="space-y-2.5 text-xs text-[#52463C] font-mono">
                <div className="font-bold text-[#2E2620] tracking-wider text-[11px] pb-1 uppercase border-b border-stone-100">
                  ESPECIFICAÇÕES OFICIAIS:
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Suedine Premium 205G (100% Algodão)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Logo em Silk Emborrachado (3,5 cm)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Gola Ribana 3 cm Reforçada</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Etiqueta Couro 4x5cm na Barra</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Modelagem Slim Contemporânea</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Estampa Costas Inteira em Silk Screen</span>
                </div>
              </div>

              <Link
                href="#catalogo"
                className="mt-6 block w-full py-2.5 text-center text-xs font-mono uppercase tracking-widest font-semibold bg-[#1E3524] text-white hover:bg-[#142418] transition-colors rounded-sm"
              >
                Comprar Adulto
              </Link>
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

              <div className="space-y-2.5 text-xs text-[#52463C] font-mono">
                <div className="font-bold text-[#2E2620] tracking-wider text-[11px] pb-1 uppercase border-b border-stone-100">
                  ESPECIFICAÇÕES OFICIAIS:
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Suedine Premium 205G</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Logo em Silk Emborrachado</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Gola Ribana 3 cm</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Etiqueta Premium de Couro</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Modelagem Slim Teens</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Estampa Costas Silk Juízes 7:7</span>
                </div>
              </div>

              <Link
                href="#catalogo"
                className="mt-6 block w-full py-2.5 text-center text-xs font-mono uppercase tracking-widest font-semibold bg-[#1E3524] text-white hover:bg-[#142418] transition-colors rounded-sm"
              >
                Comprar Teens
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

              <div className="space-y-2.5 text-xs text-[#52463C] font-mono">
                <div className="font-bold text-[#2E2620] tracking-wider text-[11px] pb-1 uppercase border-b border-stone-100">
                  ESPECIFICAÇÕES OFICIAIS:
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Suedine Premium 205G Macio</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Silk Colorido Premium Antialérgico</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Gola Ribana Premium Conforto</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Etiqueta Externa em Couro Sintético</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Modelagem Kids Ergonômica</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3524]" />
                  <span>Histórias Bíblicas (Salmo 23, Jonas)</span>
                </div>
              </div>

              <Link
                href="#catalogo"
                className="mt-6 block w-full py-2.5 text-center text-xs font-mono uppercase tracking-widest font-semibold bg-[#1E3524] text-white hover:bg-[#142418] transition-colors rounded-sm"
              >
                Comprar Kids
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 5. FICHA TÉCNICA E DETALHES DE ENGENHARIA TÊXTIL (Régua da Imagem Oficial) */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 border-b border-stone-200 bg-[#FAF7F2]">
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

          {/* Cores Disponíveis na Régua Oficial */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-stone-200">
            <span className="text-xs font-mono uppercase tracking-widest text-[#7E7265] font-semibold">
              CORES DISPONÍVEIS:
            </span>
            <div className="flex items-center gap-2 font-mono text-xs text-[#2E2620]">
              <span className="h-4 w-4 rounded-full bg-white border border-stone-300 shadow-xs" />
              <span>BRANCO</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#2E2620]">
              <span className="h-4 w-4 rounded-full bg-[#F5F1E8] border border-stone-300 shadow-xs" />
              <span>OFF-WHITE</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#2E2620]">
              <span className="h-4 w-4 rounded-full bg-[#1C1A18] border border-stone-400 shadow-xs" />
              <span>PRETO</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VITRINE DE PRODUTOS */}
      <main id="catalogo" className="flex-1 py-14 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl w-full">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#7E7265]">
              DISPONÍVEIS PARA PEDIDO
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#2E2620] mt-1">
              Catálogo Oficial Branch Clo
            </h2>
          </div>

          <div className="text-xs font-mono text-[#7E7265]">
            EXIBINDO <strong>{products.length}</strong> MODELAGENS COM GRADE COMPLETA
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      {/* 7. OS 5 PILARES DA MARCA (Conforme Guia Oficial) */}
      <section className="border-t border-stone-200 bg-[#ECE5DA] py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div className="flex flex-col items-center">
              <span className="text-lg mb-1">🌿</span>
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#2E2620]">
                QUALIDADE
              </span>
              <span className="text-[11px] text-[#6B5E52]">Que você sente no toque.</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-lg mb-1">✂️</span>
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#2E2620]">
                ACABAMENTOS
              </span>
              <span className="text-[11px] text-[#6B5E52]">Padrão alfaiataria premium.</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-lg mb-1">👑</span>
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#2E2620]">
                IDENTIDADE
              </span>
              <span className="text-[11px] text-[#6B5E52]">Que inspira todos os dias.</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-lg mb-1">🛡️</span>
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#2E2620]">
                DURABILIDADE
              </span>
              <span className="text-[11px] text-[#6B5E52]">Peças feitas para durar anos.</span>
            </div>

            <div className="flex flex-col items-center col-span-2 md:col-span-1">
              <span className="text-lg mb-1">📦</span>
              <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#2E2620]">
                PROPÓSITO
              </span>
              <span className="text-[11px] text-[#6B5E52]">Enraizados em Cristo.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER OFICIAL DA MARCA */}
      <footer className="border-t border-stone-200 bg-[#FAF7F2] py-12 px-4 sm:px-6 lg:px-8 text-xs font-mono">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="relative h-9 w-44">
              <Image
                src="/brand/logo.svg"
                alt="BRANCH CLO."
                fill
                className="object-contain"
              />
            </div>
            <span className="text-[#8C7A68] text-[11px] mt-1">
              THE VINE COLLECTION &bull; ENRAIZADOS EM CRISTO. CONECTADOS AO PROPÓSITO.
            </span>
          </div>

          <div className="flex flex-wrap gap-6 text-[11px] uppercase tracking-wider text-[#6B5E52]">
            <Link href="#tabela" className="hover:text-[#2E2620] transition-colors font-semibold">
              Tabela de Preços
            </Link>
            <Link href="#adulto" className="hover:text-[#2E2620] transition-colors">
              Adulto
            </Link>
            <Link href="#teens" className="hover:text-[#2E2620] transition-colors">
              Teens
            </Link>
            <Link href="#kids" className="hover:text-[#2E2620] transition-colors">
              Kids
            </Link>
            <Link href="#" className="hover:text-[#2E2620] transition-colors">
              Ficha Técnica
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
