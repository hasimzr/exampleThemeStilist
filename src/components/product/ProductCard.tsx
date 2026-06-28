"use client";
import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Star, Heart } from "lucide-react";
import type { Category, SmallProduct } from "../../types";
import { hasDiscount } from "@/utils/product";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import QuickAddToCartModal from "../QuickAddToCartModal";
import { toast } from "react-hot-toast";
import { getFileUrl } from "@/utils/file";

interface ProductCardProps {
  product: SmallProduct;
  categories?: Category[];
}

const ProductCard = ({ product, categories = [] }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isWishlisted = isFavorite(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      (product as any).features &&
      Array.isArray((product as any).features) &&
      (product as any).features.length > 0
    ) {
      setIsModalOpen(true);
    } else {
      addToCart(product);
      toast.success(`${product.title} sepete eklendi!`);
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleFavorite(product.id);
  };

  const idToCategory = (id: string, subId: string) => {
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

  const isDiscounted = hasDiscount(product);
  const originalPrice = product.price;
  const discountedPrice = isDiscounted ? product.price * product.discountMultiplier! : product.price;

  // Resolve multiple images robustly
  const getProductImages = (): string[] => {
    if (Array.isArray(product.img) && product.img.length > 0) {
      return product.img.map(img => getFileUrl(img) || "/placeholder-product.jpg");
    }
    
    const rawImages = (product as any).images;
    if (Array.isArray(rawImages) && rawImages.length > 0) {
      const sortedImages = [...rawImages].sort((a, b) => (b.isTitle ? 1 : 0) - (a.isTitle ? 1 : 0));
      return sortedImages.map((img) => getFileUrl(img.imgName) || "/placeholder-product.jpg");
    }

    return ["/placeholder-product.jpg"];
  };

  const images = getProductImages();
  const hasMultipleImages = images.length > 1;

  return (
    <>
      <Link
        href={`/product/${product.productUrl}`}
        className="product-card group bg-white rounded-[28px] overflow-hidden border border-[#f0e6df]/50 relative flex flex-col aspect-[3/4.6] hover:shadow-[0_20px_40px_rgba(183,110,121,0.1)] hover:-translate-y-1 transition-all duration-500 block"
      >
        {/* Image Area with Hover Cross-Fade */}
        <div className="flex-1 w-full relative overflow-hidden bg-[#fdf8f5] z-0">
          <img
            src={images[0]}
            alt={product.title}
            className={`product-image w-full h-full object-cover transition-all duration-700 group-hover:scale-103 absolute inset-0 ${
              hasMultipleImages ? "opacity-100 group-hover:opacity-0" : ""
            }`}
          />
          {hasMultipleImages && (
            <img
              src={images[1]}
              alt={`${product.title} - hover`}
              className="product-image w-full h-full object-cover transition-all duration-700 group-hover:scale-103 absolute inset-0 opacity-0 group-hover:opacity-100"
            />
          )}

          {/* Wishlist Button (Absolute Top Right of the card, floating on image) */}
          <button
            onClick={handleWishlist}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white hover:scale-105 active:scale-95 text-[#b76e79] border border-[#f0e6df]/40 flex items-center justify-center transition-all duration-300 shadow-sm z-20 backdrop-blur-sm"
            title="Favorilere Ekle"
          >
            <Heart className={`w-3.5 h-3.5 transition-colors duration-300 ${isWishlisted ? "fill-[#b76e79] text-[#b76e79]" : "text-[#b76e79]"}`} />
          </button>

          {/* Add to Cart Button (Bottom Right of Image Area) */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-[#2d2d2d] hover:bg-[#b76e79] text-white flex items-center justify-center shadow-lg active:scale-90 transition-all duration-300 z-20"
            title="Sepete Ekle"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>

          {/* Discount Badge (Top Left of Image Area) */}
          {isDiscounted && (
            <div className="absolute top-4 left-4 bg-[#b76e79] text-white text-[9px] font-bold px-3 py-1.5 rounded-full shadow-sm z-20 tracking-wider uppercase">
              %{Math.round((1 - product.discountMultiplier!) * 100)} İNDİRİM
            </div>
          )}

          {/* Low Stock Badge (Top Left of Image Area, stacked below discount if present) */}
          {product.stock < 10 && product.stockType === "limited" && (
            <div className={`absolute ${isDiscounted ? "top-12" : "top-4"} left-4 bg-[#2d2d2d]/90 text-white text-[8px] font-medium px-2.5 py-1 rounded-lg backdrop-blur-sm shadow-sm z-20`}>
              Son {product.stock} ürün
            </div>
          )}
        </div>

        {/* Card Footer Info (At the bottom) */}
        <div className="p-5 pt-4 pb-5 flex flex-col bg-white border-t border-[#f0e6df]/30 relative z-10">
          {/* Category */}
          {product.category && Array.isArray(product.category) && product.category.length > 0 && (
            <span className="text-[10px] font-bold text-[#b76e79] tracking-widest uppercase">
              {idToCategory(product.category[0].split(":")[0], product.category[0].split(":")[1])}
            </span>
          )}

          {/* Product Title */}
          <h3 className="font-extrabold text-sm md:text-base text-[#2d2d2d] leading-tight tracking-tight mt-1 line-clamp-2 group-hover:text-[#b76e79] transition-colors duration-300 min-h-[36px]">
            {product.title}
          </h3>

          {/* Price Row */}
          <div className="mt-1.5 flex items-baseline gap-2">
            {isDiscounted ? (
              <>
                <span className="text-sm font-extrabold text-[#2d2d2d]">₺{discountedPrice.toLocaleString("tr-TR")}</span>
                <span className="text-xs text-[#8a7e78] line-through">₺{originalPrice.toLocaleString("tr-TR")}</span>
              </>
            ) : (
              <span className="text-sm font-extrabold text-[#2d2d2d]">₺{originalPrice.toLocaleString("tr-TR")}</span>
            )}
          </div>
        </div>
      </Link>
      {/* Quick Add Modal */}
      <QuickAddToCartModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ProductCard;
