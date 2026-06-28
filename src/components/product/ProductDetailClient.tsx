"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    Star,
    ShoppingCart,
    ArrowLeft,
    Truck,
    Shield,
    X,
    Heart,
    AlertCircle,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import type { Product, SmallProduct } from "@/types";
import { getProductMainImage, hasDiscount } from "@/utils/product";
import {
    addToFavoritesApi,
    getFavoriteStatusApi,
} from "@/Api/controllers/ProductController";
import { getProductReviewsApi } from "@/Api/controllers/ProductReviewController";
import { useFavorites } from "@/context/FavoritesContext";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { toast } from "react-hot-toast";

interface ProductDetailClientProps {
    initialProduct: Product;
}

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ initialProduct }) => {
    const navigate = useRouter();
    const { addToCart } = useCart();
    const { user, isAuthenticated } = useAuth();

    const [product] = useState<Product>(initialProduct);
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [selectedImage, setSelectedImage] = useState<string | undefined>(getProductMainImage(initialProduct));
    const [isZoomed, setIsZoomed] = useState(false);
    const [bgPosition, setBgPosition] = useState<string>("center");
    const mainImageRef = useRef<HTMLDivElement>(null);

    const [isCommentsMounted, setIsCommentsMounted] = useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);
    const { toggleFavorite, isFavorite } = useFavorites();
    const isFavorited = isFavorite(product.id);
    const [isAddingFavorite, setIsAddingFavorite] = useState(false);
    const [loginWarningMounted, setLoginWarningMounted] = useState(false);
    const [errorMessageMounted, setErrorMessageMounted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [reviews, setReviews] = useState<any[]>([]);
    const [isReviewsLoading, setIsReviewsLoading] = useState(false);
    const [reviewsPage, setReviewsPage] = useState(1);
    const [hasMoreReviews, setHasMoreReviews] = useState(true);
    const [totalReviews, setTotalReviews] = useState(0);

    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const [showReadMore, setShowReadMore] = useState(false);
    const descriptionRef = useRef<HTMLDivElement>(null);

    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);



    useEffect(() => {
        if (product?.description && descriptionRef.current) {
            if (descriptionRef.current.scrollHeight > 200) {
                setShowReadMore(true);
            } else {
                setShowReadMore(false);
            }
        }
    }, [product?.description]);

    useEffect(() => {
        if (!isCommentsMounted) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeComments();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isCommentsMounted]);

    const findOptionBySelection = (feat: any, selected: any) => {
        if (!selected || !Array.isArray(feat?.options)) return null;
        return feat.options.find(
            (o: any) =>
                String(o.optionKey ?? o.id) === String(selected) ||
                String(o.id) === String(selected)
        );
    };

    const isInfinityStock = (p: Product) => p?.stockType === "infinity";
    const isProductInStock = (p: Product) => isInfinityStock(p) || (p.stock && p.stock > 0);

    const additionalPrice = useMemo(() => {
        if (!product || !product.features || !Array.isArray(product.features)) return 0;
        let sum = 0;
        for (const feat of product.features) {
            const selId = selectedOptions[String(feat.id || feat.title)];
            if (!selId) continue;
            const opt = findOptionBySelection(feat, selId);
            if (opt && opt.price) sum += Number(opt.price) || 0;
        }
        return sum;
    }, [product, selectedOptions]);

    const basePrice = Number(product?.price) || 0;
    const totalPrice = basePrice + additionalPrice;
    const isDiscounted = hasDiscount(product);
    const discountedTotalPrice = isDiscounted ? totalPrice * product!.discountMultiplier! : totalPrice;

    const allFeaturesSelected = useMemo(() => {
        if (!product || !product.features || !Array.isArray(product.features)) return true;
        return product.features.every((f: any) => {
            const key = String(f.id || f.title);
            return Boolean(selectedOptions[key]);
        });
    }, [product, selectedOptions]);

    const fetchReviews = async (page: number) => {
        if (!product?.id) return;
        setIsReviewsLoading(true);
        try {
            const response = await getProductReviewsApi(product.id, page, 10);
            if (response.status === 200) {
                const data = response.data;
                const newReviews = data.content || [];
                if (page === 1) setReviews(newReviews);
                else setReviews((prev) => [...prev, ...newReviews]);
                setTotalReviews(data.totalElements || 0);
                setHasMoreReviews(!data.last);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setIsReviewsLoading(false);
        }
    };

    const loadMoreReviews = () => {
        if (!isReviewsLoading && hasMoreReviews) {
            const nextPage = reviewsPage + 1;
            setReviewsPage(nextPage);
            fetchReviews(nextPage);
        }
    };

    const openComments = () => {
        setIsCommentsMounted(true);
        requestAnimationFrame(() => setIsCommentsOpen(true));
        if (reviews.length === 0) {
            setReviewsPage(1);
            fetchReviews(1);
        }
    };

    const closeComments = () => {
        setIsCommentsOpen(false);
        setTimeout(() => setIsCommentsMounted(false), 200);
    };


    const handleAddToFavorites = async () => {
        if (!isAuthenticated) {
            setLoginWarningMounted(true);
            return;
        }
        if (!user || !product) return;
        setIsAddingFavorite(true);
        try {
            await toggleFavorite(product.id);
        } catch (error) {
            console.error("Error adding to favorites:", error);
            showErrorMessage("Favorilere eklenirken bir hata oluştu.");
        } finally {
            setIsAddingFavorite(false);
        }
    };

    const closeLoginWarning = () => setLoginWarningMounted(false);
    const showErrorMessage = (message: string) => {
        setErrorMessage(message);
        setErrorMessageMounted(true);
    };
    const closeErrorMessage = () => setErrorMessageMounted(false);

    const handleAddToCart = () => {
        const selectedFeatures: any[] = [];
        if (Array.isArray(product.features)) {
            for (const feat of product.features) {
                const key = String(feat.id ?? feat.title);
                const selId = selectedOptions[key];
                if (!selId) continue;
                const opt = findOptionBySelection(feat, selId);
                if (opt) {
                    selectedFeatures.push({
                        featureTitle: feat.title ?? feat.name ?? key,
                        optionName: opt.name ?? opt.title ?? String(opt.optionKey ?? opt.id),
                        optionPrice: Number(opt.price) || 0,
                    });
                }
            }
        }

        const payload = {
            id: product.id,
            productUrl: product.productUrl,
            title: product.title,
            price: parseFloat(product.price as any),
            img: product.images?.[0]?.imgName || product.img?.[0] || "",
            currencyType: product.currencyType,
            selectedOptions,
        };

        for (let i = 0; i < quantity; i++) {
            addToCart(payload as any);
        }
        
        toast.success(`${product.title} sepete eklendi!`);
    };
    return (
        <>
            <div className="min-h-screen bg-[#fafafa] py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => navigate.back()}
                        className="flex items-center space-x-1.5 text-xs font-semibold text-[#86868b] hover:text-[#1d1d1f] mb-8 transition-colors duration-200"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Ürünlere Dön</span>
                    </button>

                    <div className="bg-white border border-[#d2d2d7]/40 rounded-3xl overflow-hidden shadow-sm">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 lg:p-12">
                            <div>
                                <div
                                    ref={mainImageRef}
                                    onMouseEnter={() => setIsZoomed(true)}
                                    onMouseLeave={() => {
                                        setIsZoomed(false);
                                        setBgPosition("center");
                                    }}
                                    onMouseMove={(e) => {
                                        const rect = mainImageRef.current?.getBoundingClientRect();
                                        if (!rect) return;
                                        const x = ((e.clientX - rect.left) / rect.width) * 100;
                                        const y = ((e.clientY - rect.top) / rect.height) * 100;
                                        setBgPosition(`${x}% ${y}%`);
                                    }}
                                    className="aspect-square flex justify-center items-center overflow-hidden rounded-2xl bg-white border border-neutral-100 cursor-zoom-in"
                                    style={{
                                        backgroundImage: selectedImage ? `url(${selectedImage})` : "none",
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: isZoomed ? bgPosition : "center",
                                        backgroundSize: isZoomed ? "200%" : "contain",
                                        transition: "background-size 150ms ease-out, background-position 50ms ease-out",
                                    }}
                                >
                                    {selectedImage && (
                                        <img
                                            src={selectedImage}
                                            alt={product.title}
                                            className={`h-full object-contain select-none transition-opacity duration-150 ${isZoomed ? "opacity-0" : "opacity-100"}`}
                                            aria-hidden={isZoomed}
                                            draggable={false}
                                        />
                                    )}
                                </div>
                                {((product.images && product.images.length > 1) || (product.img && product.img.length > 1)) && (
                                    <div className="mt-4 grid grid-cols-5 sm:grid-cols-6 gap-3">
                                        {product.images && product.images.length > 0 ? (
                                            product.images.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => setSelectedImage(img.imgName)}
                                                    className={`group p-1 relative aspect-square rounded-xl overflow-hidden border transition-all duration-200 ${selectedImage === img.imgName ? "border-2 border-[#1d1d1f]" : "border-[#d2d2d7] hover:border-neutral-400"}`}
                                                >
                                                    <img src={img.imgName || undefined} alt={`${product.title} ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                                                </button>
                                            ))
                                        ) : (
                                            product.img?.map((imgUrl, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => setSelectedImage(imgUrl)}
                                                    className={`group p-1 relative aspect-square rounded-xl overflow-hidden border transition-all duration-200 ${selectedImage === imgUrl ? "border-2 border-[#1d1d1f]" : "border-[#d2d2d7] hover:border-neutral-400"}`}
                                                >
                                                    <img src={imgUrl} alt={`${product.title} ${idx}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col justify-between">
                                <div>
                                    <p className="text-xs font-semibold tracking-wider uppercase text-[#86868b] mb-2">{product.subcategory || "Ürün"}</p>
                                    <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f] mb-3">{product.title}</h1>

                                    <div className="flex items-center gap-2 mb-6 text-sm">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.point || 0) ? "fill-[#1d1d1f] text-[#1d1d1f]" : "text-[#d2d2d7]"}`} />
                                            ))}
                                        </div>
                                        <button onClick={openComments} className="text-[#86868b] hover:text-[#1d1d1f] transition-colors font-medium">
                                            {product.point || 0} • {product.reviewCount || 0} değerlendirme
                                        </button>
                                    </div>

                                    <div className="flex items-baseline gap-3 mb-6">
                                        <span className="text-3xl sm:text-4xl font-semibold text-[#1d1d1f]">
                                            ₺{discountedTotalPrice.toLocaleString("tr-TR")}
                                        </span>
                                        {isDiscounted && (
                                            <>
                                                <del className="text-lg text-[#86868b]">
                                                    ₺{totalPrice.toLocaleString("tr-TR")}
                                                </del>
                                                <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-full px-2.5 py-0.5">
                                                    %{Math.round((1 - product!.discountMultiplier!) * 100)} İndirim
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    <div className="mb-6 flex items-center gap-2">
                                        {isProductInStock(product) ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-600" />
                                                {isInfinityStock(product) ? "Stokta Var" : `Stokta Son ${product.stock} Ürün`}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                                                Stokta Yok
                                            </span>
                                        )}
                                    </div>

                                    <div className="mb-6">
                                        <span className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">Miktar</span>
                                        <div className="inline-flex items-center border border-[#d2d2d7] rounded-full p-1 bg-white">
                                            <button 
                                                onClick={() => setQuantity((q) => Math.max(1, q - 1))} 
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-[#1d1d1f] hover:bg-[#f5f5f7] active:scale-95 transition-all text-lg font-medium"
                                            >
                                                -
                                            </button>
                                            <span className="text-sm font-semibold w-10 text-center select-none">{quantity}</span>
                                            <button 
                                                onClick={() => setQuantity((q) => isInfinityStock(product) ? q + 1 : Math.max(1, Math.min(product.stock, q + 1)))} 
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-[#1d1d1f] hover:bg-[#f5f5f7] active:scale-95 transition-all text-lg font-medium"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {product.features && Array.isArray(product.features) && (
                                        <div className="mb-6 space-y-4">
                                            {product.features.map((feat: any) => {
                                                const fkey = String(feat.id || feat.title);
                                                const selected = selectedOptions[fkey];
                                                return (
                                                    <div key={fkey}>
                                                        <span className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">
                                                            {feat.title || feat.name}
                                                        </span>
                                                        <div className="flex flex-wrap gap-2">
                                                            {feat.options?.map((opt: any) => {
                                                                const optValue = String(opt.optionKey ?? opt.id);
                                                                const available = product.stockType === "infinity" || product.stockType === "unlimited" || opt.stock > 0;
                                                                const isSelected = String(selected) === optValue;
                                                                return (
                                                                    <button
                                                                        key={optValue}
                                                                        disabled={!available}
                                                                        onClick={() => available && setSelectedOptions(p => ({ ...p, [fkey]: optValue }))}
                                                                        className={`px-4 py-2 text-sm rounded-full border transition-all duration-200 ${
                                                                            isSelected 
                                                                                ? "border-[#1d1d1f] bg-[#1d1d1f] text-white font-semibold shadow-sm" 
                                                                                : available 
                                                                                    ? "border-[#d2d2d7] text-[#1d1d1f] hover:border-[#1d1d1f] hover:bg-[#f5f5f7]" 
                                                                                    : "border-neutral-200 text-[#86868b]/40 bg-neutral-50 cursor-not-allowed line-through"
                                                                        }`}
                                                                    >
                                                                        {opt.name}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8">
                                    <div className="flex gap-3 mb-8">
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={!isProductInStock(product) || !allFeaturesSelected}
                                            className="flex-1 bg-[#1d1d1f] hover:bg-neutral-800 text-white py-3.5 px-6 rounded-full font-semibold transition-all duration-200 disabled:bg-[#f5f5f7] disabled:text-[#86868b] flex items-center justify-center gap-2 select-none active:scale-[0.98]"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            <span>Sepete Ekle</span>
                                        </button>
                                        <button
                                            onClick={handleAddToFavorites}
                                            disabled={isAddingFavorite}
                                            className={`w-12 h-12 rounded-full border border-[#d2d2d7] flex items-center justify-center transition-all duration-200 active:scale-[0.95] ${
                                                isFavorited 
                                                    ? "bg-[#ff2d55]/10 border-[#ff2d55]/20 text-[#ff2d55]" 
                                                    : "bg-white text-[#1d1d1f] hover:bg-[#f5f5f7] hover:border-[#86868b]"
                                            }`}
                                        >
                                            <Heart className={`w-5 h-5 ${isFavorited ? "fill-[#ff2d55]" : ""}`} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 border-t border-[#d2d2d7]/50 pt-8">
                                        <div className="flex items-start gap-3">
                                            <Truck className="w-5 h-5 text-[#86868b] mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-sm text-[#1d1d1f]">Ücretsiz Kargo</p>
                                                <p className="text-xs text-[#86868b]">2-3 iş günü içinde kapınızda</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Shield className="w-5 h-5 text-[#86868b] mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-sm text-[#1d1d1f]">Güvenli Ödeme</p>
                                                <p className="text-xs text-[#86868b]">256-bit SSL şifreleme koruması</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details, Description and FAQ section */}
                        <div className="border-t border-[#d2d2d7]/50 p-8 lg:p-12 bg-[#fafafa] flex justify-center">
                            <div className="w-full max-w-4xl space-y-12">
                                {product.faqs && product.faqs.length > 0 && (
                                    <div className="border-b border-[#d2d2d7]/50 pb-12">
                                        <h3 className="text-lg font-semibold text-[#1d1d1f] mb-6">Sıkça Sorulan Sorular</h3>
                                        <div className="space-y-3">
                                            {product.faqs.map((faq, index) => (
                                                <div key={index} className="border border-[#d2d2d7]/60 rounded-2xl overflow-hidden bg-white">
                                                    <button 
                                                        onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)} 
                                                        className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-[#f5f5f7]"
                                                    >
                                                        <span className="font-medium text-[#1d1d1f] text-sm pr-4">{faq.question}</span>
                                                        {openFaqIndex === index ? <ChevronUp className="w-4 h-4 text-[#86868b]" /> : <ChevronDown className="w-4 h-4 text-[#86868b]" />}
                                                    </button>
                                                    {openFaqIndex === index && (
                                                        <div className="px-5 pb-5 pt-1 text-sm text-[#86868b] border-t border-[#d2d2d7]/40 bg-white">
                                                            {faq.answer}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-lg font-semibold text-[#1d1d1f] mb-6">Ürün Açıklaması</h3>
                                    {product.description?.trim() ? (
                                        <div className="relative">
                                            <div
                                                ref={descriptionRef}
                                                className={`rich-text text-[#1d1d1f] text-sm leading-relaxed overflow-hidden transition-all duration-500 ${!isDescriptionExpanded && showReadMore ? "max-h-[200px]" : "max-h-none"}`}
                                                dangerouslySetInnerHTML={{ __html: product.description }}
                                            />
                                            {!isDescriptionExpanded && showReadMore && <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fafafa] via-[#fafafa]/90 to-transparent pointer-events-none" />}
                                            {showReadMore && (
                                                <div className="mt-6 text-center relative z-10">
                                                    <button 
                                                        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} 
                                                        className="px-6 py-2.5 rounded-full border border-[#d2d2d7] hover:border-[#1d1d1f] bg-white hover:bg-[#f5f5f7] text-xs font-semibold text-[#1d1d1f] transition-all duration-200 shadow-sm active:scale-95"
                                                    >
                                                        {isDescriptionExpanded ? "Daha Az Göster" : "Devamını Oku"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : <p className="text-[#86868b] text-sm">Açıklama bulunmuyor.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Modal */}
            {isCommentsMounted && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isCommentsOpen ? "opacity-100" : "opacity-0"}`} onClick={closeComments} />
                    <div className={`relative z-10 w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 ${isCommentsOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}>
                        <div className="flex items-center justify-between border-b border-[#d2d2d7] px-6 py-5">
                            <h2 className="text-lg font-semibold text-[#1d1d1f]">Müşteri Değerlendirmeleri {totalReviews > 0 && `(${totalReviews})`}</h2>
                            <button onClick={closeComments} className="p-1 rounded-full hover:bg-[#f5f5f7] text-[#86868b] hover:text-[#1d1d1f] transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 max-h-[60vh] overflow-y-auto bg-[#fafafa] space-y-4">
                            {reviews.map((review, idx) => (
                                <div key={idx} className="bg-white p-5 rounded-2xl border border-[#d2d2d7]/50 shadow-sm flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            {review.userAvatar ? (
                                                <img src={review.userAvatar} alt={review.userName || "Kullanıcı"} className="w-9 h-9 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-9 h-9 rounded-full bg-[#f5f5f7] flex items-center justify-center font-bold text-[#1d1d1f] text-sm">
                                                    {review.userName?.[0]?.toUpperCase() || "U"}
                                                </div>
                                            )}
                                            <div>
                                                <span className="font-semibold text-sm text-[#1d1d1f]">{review.userName || "Kullanıcı"}</span>
                                                <div className="flex gap-0.5 mt-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.point ? "fill-[#1d1d1f] text-[#1d1d1f]" : "text-[#d2d2d7]"}`} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-[#1d1d1f] text-sm leading-relaxed whitespace-pre-wrap">{review.message}</p>
                                    
                                    {review.imgList && review.imgList.length > 0 && (
                                        <PhotoProvider>
                                            <div className="flex gap-2 flex-wrap mt-1">
                                                {review.imgList.map((img: string, i: number) => (
                                                    <PhotoView key={i} src={img}>
                                                        <img src={img} alt={`Değerlendirme görseli ${i + 1}`} className="w-16 h-16 object-cover rounded-xl cursor-pointer border border-[#d2d2d7] hover:opacity-90 transition" />
                                                    </PhotoView>
                                                ))}
                                            </div>
                                        </PhotoProvider>
                                    )}

                                    {review.answer && (
                                        <div className="mt-2 p-4 bg-[#f5f5f7] rounded-xl border border-[#d2d2d7]/45 flex flex-col gap-1">
                                            <span className="font-semibold text-xs text-[#1d1d1f]">Satıcı Yanıtı</span>
                                            <p className="text-[#86868b] text-xs leading-relaxed whitespace-pre-wrap">{review.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {hasMoreReviews && (
                                <button 
                                    onClick={loadMoreReviews} 
                                    className="w-full py-3 text-sm font-semibold text-[#1d1d1f] hover:text-[#86868b] transition-colors"
                                >
                                    Daha Fazla Yorum Yükle
                                </button>
                            )}
                        </div>
                        <div className="p-4 border-t border-[#d2d2d7] flex justify-end">
                            <button 
                                onClick={closeComments} 
                                className="px-5 py-2.5 rounded-full bg-[#1d1d1f] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Login Warning Modal */}
            {loginWarningMounted && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={closeLoginWarning} />
                    <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-neutral-200">
                        <h2 className="text-base font-semibold mb-6 text-center text-[#1d1d1f]">Favorilere eklemek için lütfen giriş yapın.</h2>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => navigate.push("/login")} 
                                className="flex-1 bg-[#1d1d1f] text-white py-2.5 rounded-full text-xs font-semibold hover:bg-neutral-800 transition-colors"
                            >
                                Giriş Yap
                            </button>
                            <button 
                                onClick={() => navigate.push("/register")} 
                                className="flex-1 border border-[#d2d2d7] text-[#1d1d1f] py-2.5 rounded-full text-xs font-semibold hover:bg-[#f5f5f7] transition-colors"
                            >
                                Kayıt Ol
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductDetailClient;
