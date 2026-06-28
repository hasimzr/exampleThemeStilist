"use client";

import { useState, useEffect } from "react";
import { Filter, X } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import type { Category, SmallProduct } from "@/types";
import { useSearchParams, useRouter } from "next/navigation";
import {
    AllProductApi,
    ProductApi,
} from "@/Api/controllers/ProductController";

interface ProductsClientProps {
    initialProducts: SmallProduct[];
    categories: Category[];
    initialHasMore: boolean;
    initialTotalPages?: number;
}

const ProductsClient: React.FC<ProductsClientProps> = ({
    initialProducts,
    categories,
    initialHasMore,
}) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const categoryIdParam = searchParams?.get("category");
    const subcategoryIdParam = searchParams?.get("subcategory");

    const [products, setProducts] = useState<SmallProduct[]>(initialProducts);
    const [filteredProducts, setFilteredProducts] = useState<SmallProduct[]>(initialProducts);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        categoryIdParam ? Number(categoryIdParam) : null
    );
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(
        subcategoryIdParam ? String(subcategoryIdParam) : null
    );
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
    const [sortBy, setSortBy] = useState<string>("default");
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
    const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);

    // Sync state with URL params
    useEffect(() => {
        setSelectedCategory(categoryIdParam ? Number(categoryIdParam) : null);
        setSelectedSubcategory(subcategoryIdParam ? String(subcategoryIdParam) : null);
        setPage(1);
        fetchFilteredProducts(1, true);
    }, [categoryIdParam, subcategoryIdParam]);

    // Show filters by default on desktop
    useEffect(() => {
        if (typeof window !== "undefined" && window.innerWidth >= 1024) {
            setShowFilters(true);
        }
    }, []);

    useEffect(() => {
        let result = [...products];

        result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

        switch (sortBy) {
            case "price-asc": result.sort((a, b) => a.price - b.price); break;
            case "price-desc": result.sort((a, b) => b.price - a.price); break;
            case "rating": result.sort((a, b) => (b.point || 0) - (a.point || 0)); break;
            case "newest": result.sort((a, b) => b.id.localeCompare(a.id)); break;
        }

        setFilteredProducts(result);
    }, [products, priceRange, sortBy]);

    const fetchFilteredProducts = async (pageArg = 1, reset = false) => {
        if (reset) setLoading(true);
        else setIsFetchingMore(true);

        try {
            let response;
            if (categoryIdParam || subcategoryIdParam) {
                const data = {
                    categoryId: categoryIdParam ? Number(categoryIdParam) : null,
                    subcategoryId: subcategoryIdParam ? Number(subcategoryIdParam) : null,
                };
                response = await ProductApi(data, pageArg, 10);
            } else {
                response = await AllProductApi(pageArg, 10);
            }

            if (response) {
                const resData = response.data || {};
                const incoming: SmallProduct[] = resData.data || [];
                const totalPagesResp: number | undefined = resData.totalPages;
                const currentPageResp: number = resData.currentPage ?? pageArg;

                if (reset) {
                    setProducts(incoming);
                } else {
                    setProducts((prev) => [...prev, ...incoming]);
                }

                if (typeof totalPagesResp === "number") {
                    setHasMore(currentPageResp < totalPagesResp);
                } else {
                    setHasMore(incoming.length >= 10);
                }
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    };

    const clearFilters = () => {
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        setPriceRange([0, 100000]);
        setSortBy("default");
        router.push("/products");
    };

    useEffect(() => {
        const onScroll = () => {
            if (loading || isFetchingMore || !hasMore) return;
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
                const next = page + 1;
                setPage(next);
                fetchFilteredProducts(next);
            }
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [page, loading, isFetchingMore, hasMore, categoryIdParam, subcategoryIdParam]);

    const selectedCategoryObj = categories.find((c) => c.id === Number(selectedCategory));

    const renderFilters = () => (
        <div className="space-y-8">
            {/* Categories Section */}
            <div>
                <h3 className="font-semibold text-[#1d1d1f] mb-3 text-sm tracking-tight">Kategoriler</h3>
                <div className="space-y-1">
                    <button 
                        onClick={() => router.push("/products")} 
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            !selectedCategory 
                                ? "bg-[#1d1d1f] text-white" 
                                : "text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"
                        }`}
                    >
                        Tümü
                    </button>
                    {categories.map((cat) => {
                        const isActive = selectedCategory === cat.id;
                        return (
                            <div key={cat.id} className="space-y-1">
                                <button 
                                    onClick={() => router.push(`/products?category=${cat.id}`)} 
                                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        isActive 
                                            ? "bg-[#1d1d1f] text-white font-semibold" 
                                            : "text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"
                                    }`}
                                >
                                    {cat.categoryName}
                                </button>
                                {isActive && cat.subCategories && cat.subCategories.length > 0 && (
                                    <div className="pl-4 pr-1 py-1 space-y-1 border-l border-neutral-200 ml-3 my-1">
                                        {cat.subCategories.map((sub) => (
                                            <button 
                                                key={sub.id} 
                                                onClick={() => router.push(`/products?category=${cat.id}&subcategory=${sub.id}`)} 
                                                className={`block w-full text-left px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                                                    selectedSubcategory === String(sub.id) 
                                                        ? "bg-neutral-200 text-[#1d1d1f] font-semibold" 
                                                        : "text-[#86868b] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]"
                                                }`}
                                            >
                                                {sub.categoryName}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Price Range Section */}
            <div className="pt-6 border-t border-[#d2d2d7]">
                <h3 className="font-semibold text-[#1d1d1f] mb-3 text-sm tracking-tight">Fiyat Aralığı</h3>
                <div className="px-1 py-2">
                    <input 
                        type="range" 
                        min="0" 
                        max="100000" 
                        step="1000" 
                        value={priceRange[1]} 
                        onChange={(e) => setPriceRange([0, parseInt(e.target.value)])} 
                        className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#1d1d1f]" 
                    />
                    <div className="flex justify-between mt-3 text-xs font-medium text-[#86868b]">
                        <span>₺0</span>
                        <span className="text-[#1d1d1f] font-semibold">₺{priceRange[1].toLocaleString("tr-TR")}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafafa] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f] mb-3">
                        {selectedCategoryObj ? selectedCategoryObj.categoryName : "Tüm Ürünler"}
                    </h1>
                    <p className="text-[#86868b] text-base sm:text-lg font-normal">
                        {filteredProducts.length} ürün bulundu
                    </p>
                </div>

                {/* Controls Bar */}
                <div className="flex items-center justify-between border-b border-[#d2d2d7] pb-4 mb-8">
                    {/* Left: Filter Toggle Button */}
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setShowFilters(!showFilters)} 
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d2d2d7] hover:border-[#1d1d1f] text-sm font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] transition-all duration-200"
                        >
                            <Filter className="w-4 h-4" /> 
                            <span>{showFilters ? "Filtreleri Gizle" : "Filtreleri Göster"}</span>
                        </button>
                        {(selectedCategory || selectedSubcategory || priceRange[1] !== 100000 || sortBy !== "default") && (
                            <button 
                                onClick={clearFilters} 
                                className="text-sm font-medium text-[#86868b] hover:text-[#1d1d1f] hover:underline transition-all duration-200"
                            >
                                Filtreleri Temizle
                            </button>
                        )}
                    </div>

                    {/* Right: Sorting Select */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-[#86868b] hidden sm:inline">Sırala:</span>
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)} 
                            className="bg-transparent border-none text-sm font-semibold text-[#1d1d1f] focus:ring-0 cursor-pointer outline-none hover:text-[#86868b] transition-colors py-1.5 pl-1 pr-8 relative appearance-none"
                            style={{
                                backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%231d1d1f' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                                backgroundPosition: 'right 0.5rem center',
                                backgroundSize: '1.25em 1.25em',
                                backgroundRepeat: 'no-repeat'
                            }}
                        >
                            <option value="default">Varsayılan</option>
                            <option value="price-asc">Fiyat: Artan</option>
                            <option value="price-desc">Fiyat: Azalan</option>
                            <option value="rating">Puan</option>
                            <option value="newest">Yeni</option>
                        </select>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="flex items-start">
                    {/* Desktop Sidebar */}
                    <div className={`hidden lg:block transition-all duration-300 ${showFilters ? "w-64 opacity-100 mr-8 shrink-0" : "w-0 opacity-0 overflow-hidden mr-0 shrink-0 pointer-events-none"}`}>
                        <div className="sticky top-24">
                            {renderFilters()}
                        </div>
                    </div>

                    {/* Product Grid Panel */}
                    <div className="flex-1 min-w-0">
                        {loading ? (
                            <div className={`grid grid-cols-1 md:grid-cols-2 ${showFilters ? "lg:grid-cols-2 xl:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4"} gap-8 transition-all duration-300`}>
                                {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <div className={`grid grid-cols-1 md:grid-cols-2 ${showFilters ? "lg:grid-cols-2 xl:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4"} gap-8 transition-all duration-300`}>
                                {filteredProducts.map((p) => (
                                    <ProductCard key={p.id} product={p} categories={categories} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white py-16 px-6 text-center rounded-2xl border border-neutral-200 max-w-md mx-auto">
                                <h3 className="text-xl font-semibold text-[#1d1d1f] mb-2">Ürün Bulunamadı</h3>
                                <p className="text-sm text-[#86868b] mb-6">Seçtiğiniz filtrelere uygun ürün bulunmamaktadır.</p>
                                <button 
                                    onClick={clearFilters} 
                                    className="px-5 py-2.5 rounded-full bg-[#1d1d1f] text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
                                >
                                    Filtreleri Temizle
                                </button>
                            </div>
                        )}
                        {isFetchingMore && <div className="text-center text-sm text-[#86868b] py-8">Yükleniyor...</div>}
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Overlay / Drawer */}
            {showFilters && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 lg:hidden" onClick={() => setShowFilters(false)}>
                    <div 
                        className="fixed inset-y-0 left-0 w-80 bg-white p-6 shadow-2xl overflow-y-auto flex flex-col justify-between"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-lg font-semibold text-[#1d1d1f]">Filtreler</h2>
                                <button onClick={() => setShowFilters(false)} className="p-1 rounded-full hover:bg-[#f5f5f7] text-[#86868b] hover:text-[#1d1d1f] transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            {renderFilters()}
                        </div>
                        <div className="mt-8 pt-4 border-t border-neutral-100 flex gap-4">
                            <button 
                                onClick={clearFilters} 
                                className="flex-1 py-2.5 rounded-full border border-[#d2d2d7] text-sm font-medium text-neutral-700 hover:bg-[#f5f5f7] transition-colors"
                            >
                                Temizle
                            </button>
                            <button 
                                onClick={() => setShowFilters(false)} 
                                className="flex-1 py-2.5 rounded-full bg-[#1d1d1f] text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
                            >
                                Uygula
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsClient;
