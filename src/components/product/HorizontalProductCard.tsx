"use client";
import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import StarRating from "../common/StarRating";
import type { Product, SmallProduct, Category } from "../../types";
import { getProductMainImage, hasDiscount } from "@/utils/product";
import QuickAddToCartModal from "../QuickAddToCartModal";

type FavoriteItem = Product | SmallProduct;

interface HorizontalProductCardProps {
  item: FavoriteItem;
  onRemove?: (productId: string) => void;
  onAddToCart: (item: FavoriteItem) => void;
  onNavigate: (productUrl: string) => void;
  categories?: Category[];
  isFavorite?: boolean;
  onToggleFavorite?: (productId: string) => void;
  showFavorite?: boolean;
}

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

const getRating = (item: FavoriteItem) => {
  const raw = (item as Product).rating ?? (item as SmallProduct).point ?? 0;
  const val = Number(raw);
  if (!Number.isFinite(val)) return 0;
  return Math.min(5, Math.max(0, val));
};

const getReviewCount = (item: FavoriteItem) =>
  (item as Product).reviews ?? (item as SmallProduct).reviews ?? 0;

const toProductUrl = (item: FavoriteItem) =>
  (item as Product).productUrl ?? (item as SmallProduct).productUrl ?? item.id;

const idToCategory = (
  id: string,
  subId: string,
  categories: Category[] = []
): string => {
  const category = categories.find((cat: Category) => cat.id === Number(id));
  if (subId != "null" && category) {
    const subCategory = category?.subCategories?.find(
      (sub) => sub.id === Number(subId)
    );
    return subCategory
      ? subCategory.categoryName + " / " + category.categoryName
      : "Unknown";
  }
  return category ? category.categoryName : "Unknown";
};

const HorizontalProductCard: React.FC<HorizontalProductCardProps> = ({
  item,
  onRemove,
  onAddToCart,
  onNavigate,
  categories = [],
  isFavorite = false,
  onToggleFavorite,
  showFavorite = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const price = normalizePrice((item as Product).price);
  const image = getImage(item);
  const rating = getRating(item);
  const reviews = getReviewCount(item);
  const productUrl = toProductUrl(item);
  const isDiscounted = hasDiscount(item);
  const discountedPrice = isDiscounted ? price * (item as any).discountMultiplier : price;

  const handleCardClick = (e: React.MouseEvent) => {
    // Sepete ekle butonu tıklanmışsa navigasyon yapma
    if ((e.target as HTMLElement).closest('button[title="Sepete ekle"]')) {
      return;
    }
    onNavigate(productUrl);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Ürünün features özelliği varsa modal aç
    if (
      (item as any).features &&
      Array.isArray((item as any).features) &&
      (item as any).features.length > 0
    ) {
      setIsModalOpen(true);
    } else {
      // Features yoksa direkt sepete ekle
      onAddToCart(item);
    }
  };

  return (
    <>
      <div
        className="group bg-white rounded-2xl border border-[#e8e6e1]/60 hover:shadow-[0_10px_40px_rgba(26,26,46,0.08)] transition-all duration-300 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex flex-col sm:flex-row gap-5 p-5">
          {/* Ürün Görseli */}
          <div className="relative w-full sm:w-40 h-40 bg-[#f7f5f0] rounded-xl overflow-hidden flex items-center justify-center shrink-0">
            <img
              src={image}
              alt={item.title}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />
            {isDiscounted && (
              <div className="absolute top-2 left-2 bg-[#c9414e] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                %{Math.round((1 - (item as any).discountMultiplier) * 100)}
              </div>
            )}
            {/* Favori Butonu */}
            {showFavorite && (onRemove || onToggleFavorite) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onRemove) {
                    onRemove(item.id);
                  } else if (onToggleFavorite) {
                    onToggleFavorite(item.id);
                  }
                }}
                className={`absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-2 shadow-sm border border-[#e8e6e1] transition ${onRemove ? "text-[#c9414e] hover:text-[#c9414e]" : isFavorite ? "text-[#c9414e]" : "text-[#9a9aab] hover:text-[#c9414e]"
                  }`}
                title={onRemove ? "Favorilerden çıkar" : isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
              >
                <Heart className={`w-4 h-4 ${onRemove || isFavorite ? "fill-current" : ""}`} />
              </button>
            )}
          </div>

          {/* Ürün Bilgileri */}
          <div className="flex-1 flex flex-col gap-2 min-w-0">
            {/* Başlık ve Kategori Bilgisi */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5 min-w-0">
                <h3 className="text-base font-semibold text-[#1a1a2e] line-clamp-2 group-hover:text-[#c9a84c] transition-colors duration-300">
                  {item.title}
                </h3>

                {/* Kategoriler */}
                {Array.isArray((item as Product).category) && (
                  <div className="flex flex-wrap gap-1.5">
                    {(item as Product).category?.slice(0, 3).map((cat, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-[#f7f5f0] text-[#c9a84c] font-medium"
                      >
                        {idToCategory(
                          cat.split(":")[0],
                          cat.split(":")[1],
                          categories
                        )}
                      </span>
                    ))}
                  </div>
                )}

                {/* Rating ve İnceleme Sayısı */}
                <div className="flex items-center gap-2 text-sm text-[#6b6b7b]">
                  <StarRating value={rating} readOnly size="sm" />
                  <span className="text-[11px] text-[#9a9aab]">
                    ({reviews} değerlendirme)
                  </span>
                </div>

                {/* Ürün Açıklaması */}
                {(item as Product).description && (
                  <p className="text-xs text-[#6b6b7b] line-clamp-2 leading-relaxed">
                    {(item as Product).description}
                  </p>
                )}
              </div>
            </div>

            {/* Fiyat ve Butonlar */}
            <div className="flex items-center justify-between gap-3 mt-auto pt-3 border-t border-[#f0eeea]">
              <div>
                {isDiscounted ? (
                  <div className="flex items-end gap-2">
                    <p className="text-xl font-bold text-[#c9414e]">₺{discountedPrice.toLocaleString("tr-TR")}</p>
                    <del className="text-xs text-[#9a9aab] mb-0.5">₺{price.toLocaleString("tr-TR")}</del>
                  </div>
                ) : (
                  <p className="text-xl font-bold text-[#1a1a2e]">
                    ₺{price.toLocaleString("tr-TR")}
                  </p>
                )}
              </div>

              {/* İşlem Butonları */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddToCartClick}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a1a2e] text-white rounded-full shadow-sm hover:bg-[#2d2d44] transition-all duration-300 whitespace-nowrap text-sm font-medium"
                  title="Sepete ekle"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Sepete ekle
                </button>
                {showFavorite && (onRemove || onToggleFavorite) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onRemove) {
                        onRemove(item.id);
                      } else if (onToggleFavorite) {
                        onToggleFavorite(item.id);
                      }
                    }}
                    className={`inline-flex items-center justify-center px-3 py-2.5 border border-[#e8e6e1] hover:border-[#c9414e]/30 rounded-full transition ${onRemove || isFavorite ? "text-[#c9414e] bg-red-50/30" : "text-[#9a9aab] hover:text-[#c9414e] bg-white"
                      }`}
                    title={onRemove ? "Favorilerden çıkar" : isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
                  >
                    <Heart className={`w-4 h-4 ${onRemove || isFavorite ? "fill-current" : ""}`} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Add Modal */}
      <QuickAddToCartModal
        product={item}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default HorizontalProductCard;
