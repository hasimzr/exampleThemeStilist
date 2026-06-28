import { useCart } from "@/context/CartContext";
import {
  Trash2,
  Plus,
  Minus,
  Package
} from "lucide-react";
import {
  calculateProductUnitPrice,
  getOriginalUnitPrice,
  hasDiscount,
  getProductMainImage,
} from "@/utils/product";
import Link from "next/link";;

const Basket = () => {
  const { cartItems, removeFromCart, updateQuantity } =
    useCart();
  const formatCurrency = (value: number) =>
    value.toLocaleString("tr-TR", { style: "currency", currency: "TRY" });

  const getOptionLabels = (
    product: any,
    featureKey: string,
    optionValue: any,
  ) => {
    const feature =
      product?.features && Array.isArray(product.features)
        ? product.features.find(
          (f: any) => String(f.id || f.title) === String(featureKey),
        )
        : null;
    const option = feature?.options?.find(
      (o: any) =>
        String(o.optionKey ?? o.id) === String(optionValue) ||
        String(o.id) === String(optionValue),
    );

    return {
      featureLabel: feature?.title || feature?.name || featureKey,
      optionLabel: option?.name || optionValue,
    };
  };

  return (
    <div className="lg:col-span-2 space-y-4">
      {cartItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Sepetinizde ürün bulunmamaktadır
          </p>
        </div>
      ) : (
        cartItems.map((item) => {
          const unitPrice = calculateProductUnitPrice(
            item.product,
            item.selectedOptions,
          );
          const originalUnitPrice = getOriginalUnitPrice(
            item.product,
            item.selectedOptions,
          );
          const isDiscounted = hasDiscount(item.product);
          return (
            <div
              key={item.cartKey}
              className="bg-white rounded-3xl shadow-sm hover:shadow-[0_15px_30px_rgba(183,110,121,0.06)] p-5 flex flex-col sm:flex-row gap-5 transition-all duration-300 border border-[#f0e6df]/40 hover:border-[#b76e79]/30 group"
            >
              {/* Ürün Görseli */}
              <Link
                href={`/product/${item.product.productUrl}`}
                className="w-full sm:w-28 h-28 sm:h-28 shrink-0 overflow-hidden rounded-2xl bg-[#fdf8f5] border border-[#f0e6df]/20"
              >
                <img
                  src={getProductMainImage(item.product)}
                  alt={item.product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>

              {/* Ürün Bilgileri */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <Link
                    href={`/product/${item.product.productUrl}`}
                    className="font-bold text-[#2d2d2d] hover:text-[#b76e79] transition-colors duration-200 line-clamp-2 text-base"
                  >
                    {item.product.title}
                  </Link>
                  {item.selectedOptions &&
                    Object.keys(item.selectedOptions).length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {Object.entries(item.selectedOptions).map(
                          ([featKey, optId]) => {
                            const { featureLabel, optionLabel } =
                              getOptionLabels(item.product, featKey, optId);
                            return (
                              <span
                                key={`${item.cartKey}-${featKey}`}
                                className="inline-flex items-center rounded-full border border-[#f0e6df] bg-[#fdf8f5] px-3 py-1 text-xs text-[#b76e79]"
                                title={`${featureLabel}: ${optionLabel}`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#b76e79]/60 mr-2"></span>
                                <span className="font-semibold text-gray-500">
                                  {featureLabel}:
                                </span>
                                <span className="ml-1 font-bold text-[#b76e79]">
                                  {optionLabel}
                                </span>
                              </span>
                            );
                          },
                        )}
                      </div>
                    )}
                  {item.product.subcategory && (
                    <p className="text-xs text-[#8a7e78] mt-1.5 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#b76e79]/40"></span>
                      {item.product.subcategory}
                    </p>
                  )}
                  <div className="mt-3 flex items-baseline gap-2 flex-wrap">
                    {isDiscounted && (
                      <del className="text-xs text-[#8a7e78] line-through">
                        {formatCurrency(originalUnitPrice * item.quantity)}
                      </del>
                    )}
                    <p className={`text-lg font-extrabold ${isDiscounted ? 'text-[#b76e79]' : 'text-[#2d2d2d]'}`}>
                      {formatCurrency(unitPrice * item.quantity)}
                    </p>
                    <p className="text-xs text-[#8a7e78]">
                      ({formatCurrency(unitPrice)} / adet)
                    </p>
                  </div>
                </div>

                {/* Miktar ve İşlemler */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#f0e6df]/30">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#8a7e78] font-medium mr-1">
                      Miktar:
                    </span>
                    <div className="inline-flex items-center border border-[#d2d2d7] rounded-full p-0.5 bg-white">
                      <button
                        onClick={() =>
                          updateQuantity(item.cartKey, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[#2d2d2d] hover:bg-[#f5f5f7] active:scale-95 transition-all text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold w-9 text-center text-sm text-[#2d2d2d] select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.cartKey, item.quantity + 1)
                        }
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[#2d2d2d] hover:bg-[#f5f5f7] active:scale-95 transition-all text-sm"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.cartKey)}
                    className="text-[#8a7e78] hover:text-red-600 hover:bg-red-50/50 p-2 rounded-full transition-all flex items-center gap-1.5 group/delete"
                    title="Sepetten Kaldır"
                  >
                    <Trash2 className="w-4 h-4 group-hover/delete:scale-105 transition-transform" />
                    <span className="text-xs font-semibold hidden sm:inline">
                      Kaldır
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Basket;
