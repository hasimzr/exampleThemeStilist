"use client";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowRight, Heart, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    addToFavoritesApi,
    getFavoritesApi,
} from "@/Api/controllers/ProductController";
import { getAllCategoriesApi } from "@/Api/controllers/CategoryController";
import { getProductMainImage } from "@/utils/product";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import type { BasketData, Product, SmallProduct, Category } from "../types";
import HorizontalProductCard from "./product/HorizontalProductCard";
import { toast } from "react-hot-toast";

type FavoriteItem = Product | SmallProduct;

const normalizePrice = (price: number | string | undefined): number => {
    if (typeof price === "number") return price;
    const parsed = Number(price ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
};

const getImage = (item: FavoriteItem): string => {
    if ((item as Product).images && (item as Product).images.length > 0) {
        return getProductMainImage(item as Product) || "/placeholder-product.jpg";
    }
    const imgs = (item as SmallProduct).img;
    if (Array.isArray(imgs) && imgs.length > 0) return imgs[0];
    return "/placeholder-product.jpg";
};

const toProductUrl = (item: FavoriteItem) =>
    (item as Product).productUrl ?? (item as SmallProduct).productUrl ?? item.id;

const MyFavoritesClient = () => {
    const navigate = useRouter();
    const { addToCart } = useCart();
    const { refreshFavoriteCount } = useFavorites();
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadFavorites = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getFavoritesApi();
            const raw = (response.data as any)?.favorites ?? response.data ?? [];
            setFavorites(Array.isArray(raw) ? (raw as FavoriteItem[]) : []);
        } catch (err) {
            console.error("Favoriler yüklenirken hata oluştu", err);
            setError("Favoriler yüklenemedi. Lütfen tekrar deneyin.");
            setFavorites([]);
        } finally {
            setIsLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await getAllCategoriesApi();
            const cats = (response.data as any)?.categories ?? response.data ?? [];
            setCategories(Array.isArray(cats) ? (cats as Category[]) : []);
        } catch (err) {
            console.error("Kategoriler yüklenirken hata oluştu", err);
        }
    };

    useEffect(() => {
        loadFavorites();
        loadCategories();
    }, []);

    const handleRemove = async (productId: string) => {
        try {
            await addToFavoritesApi(productId);
            setFavorites((prev) => prev.filter((item) => item.id !== productId));
            // Favori sayısını güncelle
            await refreshFavoriteCount();
        } catch (err) {
            console.error("Favori kaldırılırken hata oluştu", err);
            setError("Favori güncellenemedi. Lütfen tekrar deneyin.");
        }
    };

    const handleAddToCart = async (item: FavoriteItem) => {
        const payload: BasketData = {
            id: item.id,
            productUrl: toProductUrl(item),
            title: item.title,
            price: normalizePrice((item as Product).price),
            img: getImage(item),
            currencyType: (item as Product).currencyType ?? "TRY",
        } as BasketData;

        await addToCart(payload);
        toast.success(`${item.title} sepete eklendi!`);
    };

    const favoriteCount = useMemo(() => favorites.length, [favorites]);

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight text-[#1d1d1f]">
                        Favorilerim
                    </h2>
                    <p className="text-xs text-[#86868b] mt-1">
                        Beğendiğin ürünleri burada hızlıca inceleyebilir ve sepete ekleyebilirsin.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-[#86868b] bg-[#f5f5f7] px-3 py-1.5 rounded-full border border-[#d2d2d7]/50 font-medium">
                        {favoriteCount} Ürün
                    </span>
                    <button
                        onClick={loadFavorites}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#d2d2d7] text-[#1d1d1f] hover:text-[#b76e79] hover:border-[#b76e79]/30 bg-white shadow-sm transition text-xs font-semibold select-none active:scale-[0.98]"
                        title="Listeyi yenile"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Yenile
                    </button>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 p-4 border border-red-200 bg-red-50/50 text-red-700 rounded-2xl">
                    <AlertCircle className="w-5 h-5" />
                    <span className="flex-1 text-sm font-medium">{error}</span>
                    <button
                        onClick={loadFavorites}
                        className="text-sm font-semibold underline underline-offset-2 hover:text-red-800"
                    >
                        Tekrar dene
                    </button>
                </div>
            )}

            {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    {Array.from({ length: 3 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="animate-pulse bg-white rounded-3xl border border-gray-100 shadow-sm p-5 flex gap-4"
                        >
                            <div className="w-28 h-28 bg-gray-200 rounded-xl" />
                            <div className="flex-1 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                                <div className="h-4 bg-gray-200 rounded w-1/3" />
                                <div className="flex gap-2">
                                    <div className="h-9 bg-gray-200 rounded w-20" />
                                    <div className="h-9 bg-gray-200 rounded w-24" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : favoriteCount === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#d2d2d7]">
                    <div className="mx-auto w-12 h-12 rounded-full bg-[#b76e79]/10 text-[#b76e79] flex items-center justify-center mb-4 border border-[#b76e79]/20">
                        <Heart className="w-5 h-5 fill-current" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                        Henüz favori ürünün yok
                    </h3>
                    <p className="text-sm text-[#86868b] mb-6 max-w-sm mx-auto">
                        Beğendiğin ürünleri kalp ikonuna tıklayarak favorilerine ekleyebilirsin.
                    </p>
                    <button
                        onClick={() => navigate.push("/products")}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1d1d1f] hover:bg-neutral-800 text-white rounded-full text-xs font-semibold shadow-sm transition select-none active:scale-[0.98]"
                    >
                        Ürünlere göz at
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {favorites.map((item) => (
                        <HorizontalProductCard
                            key={item.id}
                            item={item}
                            onRemove={handleRemove}
                            onAddToCart={handleAddToCart}
                            onNavigate={(url) => navigate.push(`/product/${url}`)}
                            categories={categories}
                            showFavorite={true}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyFavoritesClient;
