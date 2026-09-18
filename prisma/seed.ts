import { PrismaClient, Role, OrderStatus, OrderOrigin, MovementType, CashCategory, TransactionType, CashStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 [Branch Clo Seed] Populando catálogo oficial conforme Guia de Marca The Vine...");

  // 1. Limpeza segura
  await prisma.cashFlowTransaction.deleteMany();
  await prisma.returnExchange.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventoryMovement.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  // 2. Administrador Backoffice
  const admin = await prisma.user.create({
    data: {
      name: "Branch Clo Master Admin",
      email: "admin@branchclo.com",
      passwordHash: "$2a$12$eX4mPL3H4sh3dBcryptS3cur3P4ssw0rd999",
      role: Role.ADMIN,
    },
  });

  // 3. Categorias Oficiais do Brand Guide
  const catAdulto = await prisma.category.create({
    data: {
      name: "Linha Adulto",
      slug: "linha-adulto",
      description: "Suedine Premium 205g 100% algodão, gola ribana 3cm, logo silk emborrachado e estampa costas inteira.",
      active: true,
    },
  });

  const catTeens = await prisma.category.create({
    data: {
      name: "Linha Teens",
      slug: "linha-teens",
      description: "Modelagem slim moderna, suedine premium 205g, estampas inspiradas em histórias de fé e coragem.",
      active: true,
    },
  });

  const catKids = await prisma.category.create({
    data: {
      name: "Linha Kids",
      slug: "linha-kids",
      description: "Malha ultra macia antialérgica 205g com estampas lúdicas das Escrituras (Salmo 23, Davi, Jonas).",
      active: true,
    },
  });

  const catAcessorios = await prisma.category.create({
    data: {
      name: "Acessórios",
      slug: "acessorios",
      description: "Etiquetas de couro legítimo sintético, bonés, meias e itens autorais Branch Clo.",
      active: true,
    },
  });

  // Cores Oficiais
  const colors = [
    { name: "Off-White", hex: "#F5F1E8", code: "OFW" },
    { name: "Preto", hex: "#1C1A18", code: "BLK" },
    { name: "Branco", hex: "#FFFFFF", code: "WHT" },
  ];

  // 4. PRODUTO 1 (ADULTO - R$ 129,90): The Vine (João 15:5)
  const prodAdultoVine = await prisma.product.create({
    data: {
      name: "Camiseta The Vine — João 15:5 (Linha Adulto)",
      slug: "camiseta-the-vine-joao-15-5-adulto",
      description:
        "Mais que roupa. Um lembrete diário. Suedine Premium 205g/m² 100% algodão. Logo frontal silk emborrachado 3,5cm. Estampa costas inteira silk screen premium 'I AM THE VINE, YOU ARE THE BRANCHES — JOHN 15:5'. Gola ribana 3cm, etiqueta interna digital tagless e etiqueta externa em couro sintético 4x5cm na barra.",
      fabricComposition: "Suedine Premium 100% Algodão 205g/m² (Rendimento 2,60)",
      washingInstructions: "Lavar em água fria com cores similares. Secar à sombra. Não passar sobre as estampas em silk.",
      categoryId: catAdulto.id,
      active: true,
      images: {
        create: [
          { url: "/catalog/detalhes-costura.jpeg", altText: "Branch Clo The Vine Costas John 15:5", isMain: true, displayOrder: 1 },
          { url: "/catalog/tee-oversized-offwhite-frente.jpeg", altText: "Branch Clo The Vine Frente com Logo Silk", isMain: false, displayOrder: 2 },
        ],
      },
    },
  });

  const adultSizes = ["P", "M", "G", "GG"];
  for (const color of colors) {
    for (const size of adultSizes) {
      const variant = await prisma.productVariant.create({
        data: {
          productId: prodAdultoVine.id,
          size,
          colorName: color.name,
          hexColor: color.hex,
          skuCode: `BC-AD-VINE-${color.code}-${size}`,
          barcode: `78980001${color.code}${size}`,
          costPrice: 42.0,
          regularPrice: 129.9, // Preço oficial da tabela
          weightGrams: 280,
          heightCm: 3,
          widthCm: 24,
          lengthCm: 30,
          stockAvailable: size === "M" ? 30 : size === "G" ? 25 : 15,
          stockReserved: size === "M" ? 2 : 0,
          stockMinAlert: 5,
          active: true,
        },
      });

      await prisma.inventoryMovement.create({
        data: {
          variantId: variant.id,
          type: MovementType.ENTRADA_FORNECEDOR,
          quantity: variant.stockAvailable + variant.stockReserved,
          reason: "Entrada lote oficial Linha Adulto",
          userId: admin.id,
        },
      });
    }
  }

  // 5. PRODUTO 2 (TEENS - R$ 109,90): Guerreiro de Fé — Juízes 7:7
  const prodTeensGideao = await prisma.product.create({
    data: {
      name: "Camiseta Juízes 7:7 — O Chamado (Linha Teens)",
      slug: "camiseta-juizes-7-7-teens",
      description:
        "Mais que roupa. Um lembrete diário. Suedine Premium 205g/m² com modelagem slim. Estampa costas inteira em silk screen premium inspirada em Juízes 7:7 ('Levante! Você entregará os midianitas'). Coroa da glória e guerreiro de pé diante do exército.",
      fabricComposition: "Suedine Premium 100% Algodão 205g/m²",
      washingInstructions: "Lavar do avesso em ciclo suave. Secar ao ar livre.",
      categoryId: catTeens.id,
      active: true,
      images: {
        create: [
          { url: "/catalog/hoodie-boxy-marrom-frente.jpeg", altText: "Branch Clo Teens Juizes 7:7 Frente", isMain: true, displayOrder: 1 },
          { url: "/catalog/hoodie-boxy-marrom-costas.jpeg", altText: "Branch Clo Teens Juizes 7:7 Costas Guerreiro", isMain: false, displayOrder: 2 },
        ],
      },
    },
  });

  const teenSizes = ["12", "14", "16", "PP"];
  for (const color of colors) {
    for (const size of teenSizes) {
      const variant = await prisma.productVariant.create({
        data: {
          productId: prodTeensGideao.id,
          size,
          colorName: color.name,
          hexColor: color.hex,
          skuCode: `BC-TN-JUDGES-${color.code}-${size}`,
          barcode: `78980002${color.code}${size}`,
          costPrice: 35.0,
          regularPrice: 109.9, // Preço oficial da tabela
          weightGrams: 230,
          heightCm: 3,
          widthCm: 22,
          lengthCm: 28,
          stockAvailable: 20,
          stockReserved: 0,
          stockMinAlert: 4,
          active: true,
        },
      });

      await prisma.inventoryMovement.create({
        data: {
          variantId: variant.id,
          type: MovementType.ENTRADA_FORNECEDOR,
          quantity: variant.stockAvailable,
          reason: "Entrada lote oficial Linha Teens",
          userId: admin.id,
        },
      });
    }
  }

  // 6. PRODUTO 3 (KIDS - R$ 79,90): Eu Sou Cuidado Por Ele — Salmo 23:1
  const prodKidsSalmo = await prisma.product.create({
    data: {
      name: "Kids Tee Salmo 23:1 — Eu Sou Cuidado Por Ele",
      slug: "kids-tee-salmo-23-1-cuidado-por-ele",
      description:
        "Mais que roupa. Um lembrete diário para os pequenos. Suedine Premium 205g/m² 100% algodão macio antialérgico. Estampa frontal delicada da ovelhinha e costas colorida com 'EU SOU CUIDADO POR ELE — SALMO 23:1'.",
      fabricComposition: "Suedine Premium 100% Algodão Kids 205g/m²",
      washingInstructions: "Lavar com sabão neutro em água fria.",
      categoryId: catKids.id,
      active: true,
      images: {
        create: [
          { url: "/catalog/tee-oversized-offwhite-frente.jpeg", altText: "Branch Kids Salmo 23:1 Ovelhinha", isMain: true, displayOrder: 1 },
          { url: "/catalog/tee-oversized-preto-costas.jpeg", altText: "Branch Kids Salmo 23:1 Costas Colorida", isMain: false, displayOrder: 2 },
        ],
      },
    },
  });

  const kidsSizes = ["2", "4", "6", "8", "10"];
  for (const color of colors) {
    for (const size of kidsSizes) {
      const variant = await prisma.productVariant.create({
        data: {
          productId: prodKidsSalmo.id,
          size,
          colorName: color.name,
          hexColor: color.hex,
          skuCode: `BC-KD-PSALM-${color.code}-${size}`,
          barcode: `78980003${color.code}${size}`,
          costPrice: 24.0,
          regularPrice: 79.9, // Preço oficial da tabela
          weightGrams: 150,
          heightCm: 2,
          widthCm: 18,
          lengthCm: 24,
          stockAvailable: 18,
          stockReserved: 1,
          stockMinAlert: 3,
          active: true,
        },
      });

      await prisma.inventoryMovement.create({
        data: {
          variantId: variant.id,
          type: MovementType.ENTRADA_FORNECEDOR,
          quantity: variant.stockAvailable + variant.stockReserved,
          reason: "Entrada lote oficial Linha Kids",
          userId: admin.id,
        },
      });
    }
  }

  // 7. Clientes Fictícios
  const customer1 = await prisma.customer.create({
    data: {
      name: "Mateus Silveira Albuquerque",
      email: "mateus.silveira@gmail.com",
      phone: "+55 11 98452-1100",
      cpf: "384.921.058-12",
      street: "Rua Augusta",
      number: "1450",
      neighborhood: "Consolação",
      city: "São Paulo",
      state: "SP",
      postalCode: "01304-001",
      totalSpent: 209.8,
      ordersCount: 1,
    },
  });

  // 8. Pedido de teste: 1 Camiseta Adulto (129,90) + 1 Camiseta Kids (79,90) = 209,80
  const order1 = await prisma.order.create({
    data: {
      orderNumber: "#BC-2001",
      customerId: customer1.id,
      origin: OrderOrigin.ECOMMERCE,
      status: OrderStatus.PAGO,
      subtotal: 209.8,
      totalAmount: 209.8,
      paymentMethod: "PIX",
      gatewayFee: 2.09,
    },
  });

  console.log("✅ [Branch Clo Seed] Catálogo oficial cadastrado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
