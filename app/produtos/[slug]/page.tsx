import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProductBySlug, OFFICIAL_PRODUCTS } from "@/lib/catalog";
import { ProductDetailView } from "@/components/product-detail-view";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return OFFICIAL_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produto Não Encontrado | BRANCH CLO.",
    };
  }

  return {
    title: `${product.name} | BRANCH CLO.`,
    description:
      product.description ||
      "Malha Suedine Premium 205g/m² 100% algodão com gola ribana 3cm e detalhes autorais com propósito.",
    openGraph: {
      title: `${product.name} — The Vine Collection`,
      description: product.description || undefined,
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
