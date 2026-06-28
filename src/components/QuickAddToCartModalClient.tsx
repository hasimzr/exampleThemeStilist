"use client";
import { useState, useEffect, useMemo } from "react";
import { X, ShoppingCart, AlertCircle } from "lucide-react";
import type { Product, SmallProduct } from "../types";
import { useCart } from "@/context/CartContext";
import { hasDiscount } from "@/utils/product";
import { toast } from "react-hot-toast";

export interface QuickAddToCartModalProps {
    product: Product | SmallProduct | null;
    isOpen: boolean;
    onClose: () => void;
}

const QuickAddToCartModalClient = ({
    product,
    isOpen,
    onClose,
}: QuickAddToCartModalProps) => {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<
        Record<string, string>
    >({});
    const [isMounted, setIsMounted] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Modal açılma/kapanma animasyonu
    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            requestAnimationFrame(() => setIsAnimating(true));
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => setIsMounted(false), 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Ürün değiştiğinde seçimleri sıfırla
    useEffect(() => {
        setSelectedOptions({});
        setQuantity(1);
    }, [product?.id]);

    // Escape tuşu ile kapama
    useEffect(() => {
        if (!isOpen) return;
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    // Type guards - hook'lardan önce tanımlanmalı
    const isFullProduct = (p: Product | SmallProduct | null): p is Product => {
        if (!p) return false;
        return "images" in p && Array.isArray(p.images);
    };

    const getFeatures = (p: Product | SmallProduct | null) => {
        if (!p) return [];
        if (isFullProduct(p)) {
            return p.features || [];
        }
        return (p as any).features || [];
    };

    const getProductImage = (p: Product | SmallProduct | null): string => {
        if (!p) return "/placeholder.jpg";
        if (isFullProduct(p)) {
            const mainImage = p.images?.find((img) => img.isTitle);
            return mainImage?.imgName || p.images?.[0]?.imgName || "/placeholder.jpg";
        }
        return (p as SmallProduct).img?.[0] || "/placeholder.jpg";
    };

    const getProductPrice = (p: Product | SmallProduct | null): number => {
        if (!p) return 0;
        if (isFullProduct(p)) {
            return Number(p.price) || 0;
        }
        return Number((p as SmallProduct).price) || 0;
    };

    const getStock = (p: Product | SmallProduct | null): number => {
        return p?.stock || 0;
    };

    const getStockType = (p: Product | SmallProduct | null): string => {
        return p?.stockType || "limited";
    };

    const features = getFeatures(product);

    const findOptionBySelection = (feat: any, selected: any) => {
        if (!selected || !Array.isArray(feat?.options)) return null;
        return feat.options.find(
            (o: any) =>
                String(o.optionKey ?? o.id) === String(selected) ||
                String(o.id) === String(selected),
        );
    };

    // Ek fiyat hesaplama - Hook'lar her zaman çağrılmalı
    const additionalPrice = useMemo(() => {
        if (!product || !features || !Array.isArray(features)) return 0;
        let sum = 0;
        for (const feat of features) {
            const selId = selectedOptions[String(feat.id || feat.title)];
            if (!selId) continue;
            const opt = findOptionBySelection(feat, selId);
            if (opt && opt.price) sum += Number(opt.price) || 0;
        }
        return sum;
    }, [product, features, selectedOptions]);

    const basePrice = getProductPrice(product);
    const rawTotalPrice = basePrice + additionalPrice;
    const isDiscounted = hasDiscount(product);
    const totalPrice = isDiscounted ? rawTotalPrice * (product as any).discountMultiplier : rawTotalPrice;

    // Tüm özellikler seçildi mi?
    const allFeaturesSelected = useMemo(() => {
        if (!product || !features || !Array.isArray(features)) return true;
        return features.every((f: any) => {
            const key = String(f.id || f.title);
            return Boolean(selectedOptions[key]);
        });
    }, [product, features, selectedOptions]);

    const isInfinityStock = () => getStockType(product) === "infinity";

    const isProductInStock = () => {
        return isInfinityStock() || getStock(product) > 0;
    };

    // Early return hook'lardan SONRA olmalı
    if (!product || !isMounted) return null;

    const convertProductToBasket = () => {
        const selectedFeatures: {
            featureTitle: string;
            optionName: string;
            optionPrice: number;
        }[] = [];

        if (Array.isArray(features)) {
            for (const feat of features) {
                const key = String(feat.id ?? feat.title);
                const selId = selectedOptions[key];
                if (!selId) continue;
                const opt = findOptionBySelection(feat, selId);
                if (opt) {
                    selectedFeatures.push({
                        featureTitle: feat.title ?? feat.name ?? key,
                        optionName:
                            opt.name ?? opt.title ?? String(opt.optionKey ?? opt.id),
                        optionPrice: Number(opt.price) || 0,
                    });
                }
            }
        }

        return {
            id: product.id,
            productUrl: product.productUrl,
            title: product.title,
            price: basePrice,
            img: getProductImage(product),
            currencyType: (product as any).currencyType || "TRY",
            selectedOptions,
        } as any;
    };

    const handleAddToCart = () => {
        if (!isProductInStock() || !allFeaturesSelected) return;

        for (let i = 0; i < quantity; i++) {
            addToCart(convertProductToBasket());
        }

        toast.success(`${product.title} sepete eklendi!`);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Hızlı sepete ekle"
        >
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${isAnimating ? "opacity-100" : "opacity-0"
                    }`}
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`relative z-10 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-200 ${isAnimating
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-4 scale-95"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b bg-gradient-to-r from-cyan-50 to-white px-6 py-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 overflow-hidden flex items-center justify-center">
                            <img
                                src={getProductImage(product)}
                                alt={product.title}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Sepete Ekle</h2>
                            <p className="text-sm text-gray-600 line-clamp-1">
                                {product.title}
                            </p>
                        </div>
                    </div>
                    <button
                        aria-label="Kapat"
                        className="p-2 rounded-lg hover:bg-gray-100 transition"
                        onClick={onClose}
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
                    {/* Ürün Bilgileri */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-start gap-4">
                            <div className="w-24 h-24 rounded-lg bg-white border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                                <img
                                    src={getProductImage(product)}
                                    alt={product.title}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                    {product.title}
                                </h3>
                                <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                                    {isDiscounted && (
                                        <del className="text-sm text-gray-400 font-normal">
                                            ₺{rawTotalPrice.toLocaleString("tr-TR")}
                                        </del>
                                    )}
                                    <p className={`text-2xl font-bold ${isDiscounted ? 'text-red-600' : 'text-cyan-600'}`}>
                                        ₺{totalPrice.toLocaleString("tr-TR")}
                                    </p>
                                    {additionalPrice > 0 && (
                                        <span className="text-sm text-gray-500">
                                            (Ana fiyat: ₺{basePrice.toLocaleString("tr-TR")})
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm">
                                    {isProductInStock() ? (
                                        <p className="text-green-600 font-semibold">
                                            ✓{" "}
                                            {isInfinityStock()
                                                ? "Süresiz stok"
                                                : `Stokta ${getStock(product)} adet mevcut`}
                                        </p>
                                    ) : (
                                        <p className="text-red-600 font-semibold">✗ Stokta yok</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Miktar Seçici */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Miktar
                        </label>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-semibold"
                            >
                                -
                            </button>
                            <span className="text-xl font-semibold w-12 text-center">
                                {quantity}
                            </span>
                            <button
                                onClick={() =>
                                    setQuantity((q) =>
                                        isInfinityStock()
                                            ? q + 1
                                            : Math.min(getStock(product), q + 1),
                                    )
                                }
                                className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-semibold"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Ürün Özellikleri */}
                    {features && Array.isArray(features) && features.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-700 mb-4">
                                Ürün Özellikleri
                            </h4>
                            {features.map((feat: any) => {
                                const fkey = String(feat.id || feat.title);
                                const selected = selectedOptions[fkey];
                                return (
                                    <div key={fkey} className="mb-5">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {feat.title || feat.name}
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {Array.isArray(feat.options) &&
                                                feat.options.length > 0 ? (
                                                feat.options.map((opt: any) => {
                                                    const optValue = String(opt.optionKey ?? opt.id);
                                                    const available =
                                                        getStockType(product) === "unlimited" ||
                                                        (opt.stock && opt.stock > 0);
                                                    const isSelected = String(selected) === optValue;
                                                    return (
                                                        <button
                                                            key={optValue}
                                                            type="button"
                                                            onClick={() => {
                                                                if (!available) return;
                                                                setSelectedOptions((prev) => ({
                                                                    ...prev,
                                                                    [fkey]: optValue,
                                                                }));
                                                            }}
                                                            className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${isSelected
                                                                ? "ring-2 ring-cyan-200 border-cyan-600 bg-cyan-50 text-cyan-700"
                                                                : available
                                                                    ? "border-gray-200 hover:border-cyan-300 hover:bg-cyan-50 text-gray-700"
                                                                    : "border-red-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60"
                                                                }`}
                                                            disabled={!available}
                                                        >
                                                            <div className="flex flex-col items-start">
                                                                <span>{opt.name || opt.title}</span>
                                                                {opt.price && Number(opt.price) > 0 && (
                                                                    <span className="text-xs text-gray-500">
                                                                        +₺
                                                                        {Number(opt.price).toLocaleString("tr-TR")}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </button>
                                                    );
                                                })
                                            ) : (
                                                <p className="text-sm text-gray-500">
                                                    Opsiyon bulunmuyor
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Uyarı Mesajı */}
                    {!allFeaturesSelected && (
                        <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-800">
                                Lütfen tüm ürün özelliklerini seçiniz.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t bg-gray-50 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-100 transition"
                        >
                            İptal
                        </button>
                        <button
                            onClick={handleAddToCart}
                            disabled={!isProductInStock() || !allFeaturesSelected}
                            className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-800 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-300 disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            <span>Sepete Ekle</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickAddToCartModalClient;
