"use client";
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type {
  CartItem,
  Product,
  SelectedOptions,
  SmallProduct,
  BasketData,
} from "../types";
import { GetProductApi } from "@/Api/controllers/ProductController";
import { calculateProductUnitPrice } from "@/utils/product";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: BasketData | SmallProduct) => Promise<void>;
  removeFromCart: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "basketData";

type StoredCartItem = {
  productUrl: string;
  quantity: number;
  selectedOptions?: SelectedOptions;
};

const normalizeSelectedOptions = (opts?: SelectedOptions): SelectedOptions =>
  opts ?? {};

const buildCartKey = (
  product: SmallProduct,
  selectedOptions?: SelectedOptions
): string => {
  const entries = Object.entries(
    normalizeSelectedOptions(selectedOptions)
  ).sort(([a], [b]) => a.localeCompare(b));
  const encoded = entries.map(([k, v]) => `${k}:${v}`).join("|");
  return `${product.id}::${encoded}`;
};

const toStoredPayload = (items: CartItem[]): StoredCartItem[] =>
  items.map(({ product, quantity, selectedOptions }) => ({
    productUrl: product.productUrl,
    quantity,
    selectedOptions,
  }));

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const hydrateCart = async () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: StoredCartItem[] = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) return;

      const results = await Promise.all(
        parsed.map(async (entry) => {
          try {
            const resp = await GetProductApi(entry.productUrl);
            const product: Product = resp.data;
            const cartKey = buildCartKey(
              { id: product.id } as SmallProduct,
              entry.selectedOptions
            );
            const quantity = Number(entry.quantity) || 1;
            return {
              product,
              quantity,
              selectedOptions: normalizeSelectedOptions(entry.selectedOptions),
              cartKey,
            } as CartItem;
          } catch (e) {
            console.error("Hydrate: failed to fetch product", entry, e);
            return null;
          }
        })
      );

      const validItems = results.filter(Boolean) as CartItem[];
      if (validItems.length > 0) setCartItems(validItems);
    } catch (err) {
      console.error("Hydrate: invalid stored data", err);
    }
  };

  useEffect(() => {
    hydrateCart();
  }, []);

  // Sepet değiştiğinde LocalStorage'a kaydet
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(toStoredPayload(cartItems))
      );
    } catch (e) {
      console.error("Persist cart failed", e);
    }
  }, [cartItems]);

  // Sepete ürün ekle
  const addToCart = async (
    productInput: BasketData | SmallProduct
  ): Promise<void> => {
    try {
      const productUrl =
        (productInput as BasketData).productUrl ??
        (productInput as SmallProduct).productUrl;
      const selectedOptions = normalizeSelectedOptions(
        (productInput as BasketData).selectedOptions ??
          (productInput as SmallProduct).selectedOptions
      );

      if (!productUrl) {
        console.warn("addToCart: productUrl missing", productInput);
        return;
      }

      const resp = await GetProductApi(String(productUrl));
      const fullProduct: Product = resp.data;
      const cartKey = buildCartKey(
        { id: fullProduct.id } as SmallProduct,
        selectedOptions
      );

      setCartItems((prev) => {
        const idx = prev.findIndex((ci) => ci.cartKey === cartKey);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
          return next;
        }
        return [
          ...prev,
          {
            product: fullProduct,
            quantity: 1,
            selectedOptions,
            cartKey,
          },
        ];
      });
    } catch (e) {
      console.error("addToCart failed", e);
    }
  };

  // Sepetten ürün çıkar
  const removeFromCart = (cartKey: string) => {
    setCartItems((prev) => prev.filter((ci) => ci.cartKey !== cartKey));
  };

  // Ürün miktarını güncelle
  const updateQuantity = (cartKey: string, quantity: number) => {
    setCartItems((prev) => {
      if (quantity <= 0) return prev.filter((ci) => ci.cartKey !== cartKey);
      return prev.map((ci) =>
        ci.cartKey === cartKey ? { ...ci, quantity } : ci
      );
    });
  };

  // Sepeti temizle
  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  // Toplam fiyat hesapla
  const cartTotal = cartItems.reduce(
    (total, item) =>
      total +
      calculateProductUnitPrice(item.product, item.selectedOptions) *
        item.quantity,
    0
  );

  // Sepetteki toplam ürün sayısı
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
