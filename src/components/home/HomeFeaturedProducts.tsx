"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import type { Product, Category, SmallProduct } from "@/types";
import { getFileUrl } from "@/utils/file";

interface HomeFeaturedProductsProps {
    products: Product[];
    categories: Category[];
}

const normalizeToSmallProduct = (product: Product): SmallProduct => {
    let imgUrls: string[] = [];

    if (Array.isArray((product as any).img) && (product as any).img.length > 0) {
        imgUrls = (product as any).img.map((i: string) => getFileUrl(i) || "/placeholder-product.jpg");
    } else {
        const images = Array.isArray(product.images) ? product.images : [];
        if (images.length > 0) {
            const sortedImages = [...images].sort((a, b) => (b.isTitle ? 1 : 0) - (a.isTitle ? 1 : 0));
            imgUrls = sortedImages.map((img) => getFileUrl(img.imgName) || "/placeholder-product.jpg");
        } else {
            imgUrls = ["/placeholder-product.jpg"];
        }
    }

    return {
        id: product.id,
        title: product.title,
        currencyType: product.currencyType ?? "TRY",
        productUrl: product.productUrl,
        img: imgUrls.length > 0 ? imgUrls : ["/placeholder-product.jpg"],
        category: product.category ?? [],
        stock: product.stock ?? 0,
        reviews: product.reviews ?? 0,
        stockType: product.stockType ?? "normal",
        price: parseFloat(product.price as unknown as string) || 0,
        point: product.point ?? 0,
        rating: product.rating,
        discountMultiplier: product.discountMultiplier,
        features: product.features,
    };
};

const HomeFeaturedProducts: React.FC<HomeFeaturedProductsProps> = ({
    products,
    categories,
}) => {
    if (!products || products.length === 0) return null;

    return (
        <section className="py-14 md:py-20 bg-[#fdf8f5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 md:mb-12 gap-4">
                    <div>
                        <p className="text-[11px] font-semibold text-[#b76e79] tracking-[0.2em] uppercase mb-2 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            Sizin İçin Seçtiklerimiz
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-[#2d2d2d] tracking-tight">
                            En Çok Beğenilen Ürünler
                        </h2>
                        <p className="text-sm text-[#8a7e78] mt-2 max-w-md">
                            Tarzınıza uygun en popüler parçaları keşfedin
                        </p>
                    </div>
                    <Link
                        href="/products"
                        className="group inline-flex items-center gap-2 text-[#2d2d2d] hover:text-[#b76e79] font-medium text-sm transition-colors duration-300 border border-[#f0e6df] hover:border-[#b76e79]/30 rounded-full px-5 py-2.5"
                    >
                        Tümünü Gör
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                </div>

                {/* Product Grid - Sales focused layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {products.slice(0, 10).map((product) => (
                        <ProductCard
                            key={product.id}
                            product={normalizeToSmallProduct(product)}
                            categories={categories}
                        />
                    ))}
                </div>

                {/* View All CTA */}
                <div className="text-center mt-12">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2.5 bg-[#2d2d2d] text-white px-8 py-3.5 rounded-full font-medium text-sm hover:bg-[#b76e79] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                    >
                        Tüm Ürünleri Keşfet
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HomeFeaturedProducts;
