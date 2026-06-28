import React from "react";
import { Metadata } from "next";
import { AllProductApiServer, ProductApiServer } from "@/Api/controllers/ProductController";
import { getAllCategoriesApiServer } from "@/Api/controllers/CategoryController";
import ProductsClient from "@/components/product/ProductsClient";

interface PageProps {
  searchParams: Promise<{ category?: string; subcategory?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const categoryId = params.category;

  if (categoryId) {
    try {
      const resp = await getAllCategoriesApiServer();
      const categories = resp.data || [];
      const category = categories.find((c: any) => String(c.id) === String(categoryId));
      if (category) {
        return {
          title: `${category.categoryName} - Zmrelektronik`,
          description: `${category.categoryName} kategorisindeki tüm elektronik bileşenleri keşfedin.`,
        };
      }
    } catch (e) {
      console.error("Metadata products error:", e);
    }
  }

  return {
    title: "Tüm Ürünler - Zmrelektronik",
    description: "Zmrelektronik - Elektronik bileşenler, sensörler ve geliştirme kartları.",
  };
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const categoryId = params.category;
  const subcategoryId = params.subcategory;
  const page = parseInt(params.page || "1");

  let initialProducts = [];
  let categories = [];
  let hasMore = true;

  try {
    const categoriesRes = await getAllCategoriesApiServer();
    categories = categoriesRes.data || [];

    let productsRes;
    if (categoryId || subcategoryId) {
      const filterData = {
        categoryId: categoryId ? Number(categoryId) : null,
        subcategoryId: subcategoryId ? Number(subcategoryId) : null,
      };
      productsRes = await ProductApiServer(filterData, page, 10);
    } else {
      productsRes = await AllProductApiServer(page, 10);
    }

    if (productsRes) {
      const resData = productsRes.data || {};
      initialProducts = resData.data || [];
      const totalPagesResp: number | undefined = resData.totalPages;
      const currentPageResp: number = resData.currentPage ?? page;

      if (typeof totalPagesResp === "number") {
        hasMore = currentPageResp < totalPagesResp;
      } else {
        hasMore = initialProducts.length >= 10;
      }
    }
  } catch (error) {
    console.error("Products server-side data fetching error:", error);
  }

  return (
    <ProductsClient
      initialProducts={initialProducts}
      categories={categories}
      initialHasMore={hasMore}
    />
  );
}
