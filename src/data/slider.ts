export interface SliderItem {
  id: number;
  image: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
}

export const sliderData: SliderItem[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1470",
    title: "Yeni Nesil Elektronik Kartlar",
    description:
      "En son teknoloji geliştirme kartları, mikrodenetleyiciler ve sensör modülleri ile projelerinizi hayata geçirin.",
    buttonText: "Keşfet",
    buttonLink: "/products",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1470",
    title: "Arduino & Raspberry Pi",
    description:
      "Hobi projelerinden endüstriyel uygulamalara kadar her ihtiyaca uygun geliştirme kartları.",
    buttonText: "Ürünleri İncele",
    buttonLink: "/products",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1470",
    title: "Sensör & Modül Çeşitleri",
    description:
      "IoT projeleriniz için ihtiyacınız olan tüm sensörler ve iletişim modülleri tek bir yerde.",
    buttonText: "Hemen Alışveriş Yap",
    buttonLink: "/products",
  },
];
