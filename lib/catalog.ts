import { prisma } from "@/lib/prisma";
import { ProductData } from "@/components/product-card";

export const OFFICIAL_PRODUCTS: ProductData[] = [
  // Linha Adulto (Masculino & Feminino) - R$ 129,90
  {
    id: "prod-ad-vine",
    name: "The Vine — João 15:5 (Linha Adulto)",
    slug: "the-vine-joao-15-5-adulto",
    categoryName: "Linha Adulto",
    description:
      "Mais que roupa. Um lembrete diário. Malha Suedine Premium 205g/m² 100% algodão com rendimento nobre. Estampa nas costas 'I AM THE VINE, YOU ARE THE BRANCHES — JOHN 15:5' e logo frontal em silk emborrachado de 3,5cm. Gola ribana 3cm e etiqueta em couro sintético 4x5cm na barra.",
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

  // Linha Teens - R$ 109,90
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

  // Linha Kids - R$ 79,90
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
  {
    id: "prod-kd-jonas",
    name: "Jonas e a Baleia — Jonas 2:9 (Linha Kids)",
    slug: "jonas-e-a-baleia-jonas-2-9-kids",
    categoryName: "Linha Kids",
    description:
      "Mais que roupa. Um lembrete diário para os pequenos. História bíblica de Jonas no grande peixe com a declaração 'A SALVAÇÃO VEM DO SENHOR — JONAS 2:9'. Suedine macio 205g/m² 100% algodão.",
    fabricComposition: "Suedine Premium 100% Algodão Kids 205g/m²",
    washingInstructions: "Lavar à mão ou máquina no ciclo delicado.",
    images: [
      {
        id: "img-jn1",
        url: "/catalog/tee-oversized-offwhite-costas.jpeg",
        altText: "Branch Kids Jonas e a Baleia Costas",
        isMain: true,
        displayOrder: 1,
      },
      {
        id: "img-jn2",
        url: "/catalog/hoodie-boxy-marrom-frente.jpeg",
        altText: "Branch Kids Jonas Frente",
        isMain: false,
        displayOrder: 2,
      },
    ],
    variants: [
      {
        id: "var-kd-jn-blk-2",
        size: "2",
        colorName: "Preto",
        hexColor: "#1C1A18",
        skuCode: "BC-KD-JONAS-BLK-2",
        regularPrice: 79.9,
        stockAvailable: 12,
        weightGrams: 150,
        heightCm: 2,
        widthCm: 18,
        lengthCm: 24,
      },
      {
        id: "var-kd-jn-blk-4",
        size: "4",
        colorName: "Preto",
        hexColor: "#1C1A18",
        skuCode: "BC-KD-JONAS-BLK-4",
        regularPrice: 79.9,
        stockAvailable: 18,
        weightGrams: 160,
        heightCm: 2,
        widthCm: 18,
        lengthCm: 24,
      },
      {
        id: "var-kd-jn-blk-6",
        size: "6",
        colorName: "Preto",
        hexColor: "#1C1A18",
        skuCode: "BC-KD-JONAS-BLK-6",
        regularPrice: 79.9,
        stockAvailable: 15,
        weightGrams: 170,
        heightCm: 2,
        widthCm: 18,
        lengthCm: 24,
      },
    ],
  },

  // Acessórios
  {
    id: "prod-ac-leather-tag",
    name: "Etiqueta em Couro Sintético Premium (4x5 cm)",
    slug: "etiqueta-couro-sintetico-joao-15-5",
    categoryName: "Acessórios",
    description:
      "Emblema oficial Branch Clo gravado em baixo relevo em couro sintético ecológico nobre 4 x 5 cm com o lema João 15:5. Acabamento artesanal autoral.",
    fabricComposition: "Couro Sintético Ecológico Premium 4x5cm",
    washingInstructions: "Não alvejar. Limpar com pano úmido.",
    images: [
      {
        id: "img-ac1",
        url: "/brand/logo-badge.jpeg",
        altText: "Branch Clo Selo em Couro Sintético João 15:5",
        isMain: true,
        displayOrder: 1,
      },
    ],
    variants: [
      {
        id: "var-ac-leather-u",
        size: "Único",
        colorName: "Caramelo",
        hexColor: "#8C6A43",
        skuCode: "BC-AC-LEATHER-U",
        regularPrice: 39.9,
        stockAvailable: 50,
        weightGrams: 20,
        heightCm: 1,
        widthCm: 5,
        lengthCm: 6,
      },
    ],
  },
];

export async function getProductsByCategory(categorySlug?: string): Promise<ProductData[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      where: {
        active: true,
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      },
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
    // Fallback de segurança para modo estático
  }

  if (!categorySlug) return OFFICIAL_PRODUCTS;

  if (categorySlug === "linha-adulto" || categorySlug === "masculino" || categorySlug === "feminino") {
    return OFFICIAL_PRODUCTS.filter((p) => p.categoryName === "Linha Adulto");
  }
  if (categorySlug === "linha-teens" || categorySlug === "teens") {
    return OFFICIAL_PRODUCTS.filter((p) => p.categoryName === "Linha Teens");
  }
  if (categorySlug === "linha-kids" || categorySlug === "infantil" || categorySlug === "kids") {
    return OFFICIAL_PRODUCTS.filter((p) => p.categoryName === "Linha Kids");
  }
  if (categorySlug === "acessorios") {
    return OFFICIAL_PRODUCTS.filter((p) => p.categoryName === "Acessórios");
  }

  return OFFICIAL_PRODUCTS;
}

export async function getProductBySlug(slug: string): Promise<ProductData | null> {
  try {
    const dbProduct = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { displayOrder: "asc" } },
        variants: { where: { active: true }, orderBy: { size: "asc" } },
      },
    });

    if (dbProduct) {
      return {
        id: dbProduct.id,
        name: dbProduct.name,
        slug: dbProduct.slug,
        categoryName: dbProduct.category.name,
        description: dbProduct.description,
        fabricComposition: dbProduct.fabricComposition,
        washingInstructions: dbProduct.washingInstructions,
        images: dbProduct.images,
        variants: dbProduct.variants,
      };
    }
  } catch {
    // Fallback
  }

  return OFFICIAL_PRODUCTS.find((p) => p.slug === slug) || null;
}
