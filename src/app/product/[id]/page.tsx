import React from "react";
import { Metadata } from "next";
import { GetProductApiServer } from "@/Api/controllers/ProductController";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await GetProductApiServer(id);
    if (response.status === 200) {
      const product = response.data;
      return {
        title: `${product.title} - Zmrelektronik`,
        description: product.description?.substring(0, 160).replace(/<[^>]*>?/gm, '') || "Zmrelektronik Elektronik Bileşen Detayı",
        openGraph: {
          images: product.images?.[0]?.imgName
            ? [product.images[0].imgName]
            : product.img?.[0]
            ? [product.img[0]]
            : [],
        },
      };
    }
  } catch (error) {
    console.error("Metadata generation error:", error);
  }

  return {
    title: "Ürün Detayı - Zmrelektronik",
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  let product = null;
  try {
    const response = await GetProductApiServer(id);
    if (response.status === 200) {
      product = response.data;
    }
  } catch (error) {
    console.error("Product fetching error:", error);
  }

  if (!product) {
    notFound();
  }

  return <ProductDetailClient initialProduct={product} />;
}
