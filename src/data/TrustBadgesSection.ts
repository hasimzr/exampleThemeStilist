import {
  Truck,
  Shield,
  Headphones,
  RotateCcw,
} from "lucide-react";

export interface TrustBadgesSectionItem {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
  color?: string;
}

export const trustBadgesSectionData: TrustBadgesSectionItem[] = [
  {
    id: 1,
    icon: Truck,
    title: "Ücretsiz Kargo",
    description:
      "200₺ ve üzeri siparişlerde ücretsiz kargo fırsatı.",
    color: "rose",
  },
  {
    id: 2,
    icon: Shield,
    title: "Güvenli Ödeme",
    description:
      "256-bit SSL şifreleme ile güvenli alışveriş deneyimi.",
    color: "rose",
  },
  {
    id: 3,
    icon: Headphones,
    title: "7/24 Destek",
    description:
      "Uzman ekibimiz her zaman yanınızda, sorularınıza anında cevap.",
    color: "rose",
  },
  {
    id: 4,
    icon: RotateCcw,
    title: "Kolay İade",
    description:
      "14 gün içinde koşulsuz iade garantisi sunuyoruz.",
    color: "rose",
  },
];
