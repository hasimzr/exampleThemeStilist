// TypeScript tip tanımlamaları

export interface ProductImage {
  id: string;
  features: string[];
  imgName: string;
  isTitle: boolean;
}

export type SelectedOptions = Record<string, string>;

export interface SmallProduct {
  id: string;
  title: string;
  currencyType: string;
  productUrl: string;
  img: string[];
  category: string[];
  stock: number;
  reviews: number;
  stockType: string;
  price: number;
  point: number;
  rating?: number;
  subcategory?: string;
  discountMultiplier?: number;
  selectedOptions?: SelectedOptions;
  features?: any | null;
}
export interface BasketData {
  id: string;
  productUrl: string;
  title: string;
  price: number;
  img: string;
  currencyType: string;
  selectedOptions?: SelectedOptions;
}

export interface Product {
  id: string;
  category: string[];
  code: string;
  currencyType: string;

  productUrl: string;
  description: string;
  price: string;
  discountMultiplier?: number;
  stock: number;
  stockType: string;
  title: string;
  features: any | null;
  images: ProductImage[];
  img?: string[];
  relatedGroupDtoList: [{ title: string; smallProduct: SmallProduct[] }] | null;
  rating?: number;
  reviews?: number;
  point?: number;
  reviewCount?: number;
  subcategory?: string;
  selectedOptions?: SelectedOptions;
  faqs?: { question: string; answer: string }[] | null;
}

export interface Category {
  id: number;
  categoryName: string;
  subCategories?: Subcategory[];
}

export interface Subcategory {
  id: number;
  categoryName: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOptions?: SelectedOptions;
  cartKey: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  isAdmin: boolean;
  avatar?: string;
}

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  total: number;
  status: "Hazırlanıyor" | "Kargoya verildi" | "Teslim edildi";
  date: string;
  address: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface BankAccount {
  accountHolder: string;
  bankName: string;
  iban: string;
}

export interface PaymentOptions {
  creditCard: {
    enabled: boolean;
    provider?: string | null;
    virtualPos?: any | null;
  };
  cashOnDelivery: boolean;
  bankTransfer: {
    enabled: boolean;
    accounts: BankAccount[];
  };
}

export type PaymentMethodType =
  | "creditCard"
  | "cashOnDelivery"
  | "bankTransfer";

// Ürün yorumları için tip
export interface Comment {
  userName: string;
  id: number;
  productId: string;
  firstName?: string;
  lastName?: string;
  rating: number; // 1-5
  date: string; // ISO veya gösterim için hazır tarih
  content: string;
  helpful?: number; // faydalı sayısı (opsiyonel)
}

// Kullanıcı bazlı yorum/değerlendirme (Dashboard üzerinden kaydedilecek)
export interface UserReview extends Comment {
  userId: number; // Yorumu yapan kullanıcı
  orderId?: number; // İsteğe bağlı: yorum hangi siparişte verildi
}

// Kullanıcı adresleri için tip
export interface Address {
  id: string | null; // UUID veya benzersiz id
  userId: number; // Sahip kullanıcı id'si
  type: "INDIVIDUAL" | "CORPORATE"; // bireysel/kurumsal
  title: string; // Adres başlığı (Örn: Ev, İş)
  fullName: string; // Teslimat için ad soyad
  phone: string; // İrtibat telefonu
  city: string;
  district: string;
  neighborhood?: string;
  addressLine: string; // Sokak/mahalle/cadde ve kapı bilgisi
  postalCode?: string;
  // Kurumsal ise fatura bilgileri
  companyName?: string;
  taxOffice?: string;
  taxNumber?: string;
  tc?: string;
  isDefault?: boolean; // Varsayılan adres
}
