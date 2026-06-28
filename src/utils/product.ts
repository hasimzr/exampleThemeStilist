import type { Product, SelectedOptions } from "../types";

// Ürünün kapak görselini döndürür (isTitle true olan ya da ilk görsel)
export const getProductMainImage = (product: any): string | undefined => {
  if (Array.isArray(product.img) && product.img.length > 0) {
    return product.img[0] || undefined;
  }
  const images = Array.isArray(product.images) ? product.images : [];
  const titleImg = images.find((img: any) => img.isTitle);
  return (titleImg || images[0])?.imgName || undefined;
};

// Ürünün indirimli olup olmadığını kontrol eder
export const hasDiscount = (product: any): boolean => {
  const dm = product?.discountMultiplier;
  return typeof dm === "number" && dm < 1 && dm > 0;
};

// Seçenek fiyat farkları dahil orijinal (indirimsiz) birim fiyatı hesaplar
const calculateBaseUnitPrice = (
  product: Product,
  selectedOptions?: SelectedOptions,
): number => {
  let price = parseFloat(product.price as unknown as string) || 0;
  if (!product.features || !Array.isArray(product.features)) return price;

  const optionMap = selectedOptions ?? {};
  const matchesOption = (opt: any, selected: unknown) => {
    const optionKey = opt?.optionKey ?? opt?.id;
    const optionId = opt?.id;
    return (
      String(optionKey) === String(selected) ||
      String(optionId) === String(selected)
    );
  };

  for (const feat of product.features) {
    const key = String(feat.id || feat.title);
    const selected = optionMap[key];
    if (!selected || !Array.isArray(feat.options)) continue;
    const opt = feat.options.find((o: any) => matchesOption(o, selected));
    if (opt && opt.price) {
      const add = Number(opt.price);
      price += Number.isFinite(add) ? add : 0;
    }
  }
  return price;
};

// İndirimsiz birim fiyatı döndürür (üstü çizili gösterim için)
export const getOriginalUnitPrice = (
  product: Product,
  selectedOptions?: SelectedOptions,
): number => {
  return calculateBaseUnitPrice(product, selectedOptions);
};

// İndirimli birim fiyatı hesaplar (discountMultiplier uygulanmış)
export const calculateProductUnitPrice = (
  product: Product,
  selectedOptions?: SelectedOptions,
): number => {
  const base = calculateBaseUnitPrice(product, selectedOptions);
  if (hasDiscount(product)) {
    return base * product.discountMultiplier!;
  }
  return base;
};
