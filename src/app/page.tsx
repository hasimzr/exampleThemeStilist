import React from "react";
import Link from "next/link";
import { ArrowRight, Heart, Sparkles, Gift } from "lucide-react";
import GridBanners from "@/components/common/GridBanners";
import CategorySlider from "@/components/common/CategorySlider";
import HomeFeaturedProducts from "@/components/home/HomeFeaturedProducts";
import { AllProductApiServer } from "@/Api/controllers/ProductController";
import { getAllCategoriesWithImgApiServer, getAllCategoriesApiServer } from "@/Api/controllers/CategoryController";

export const dynamic = "force-dynamic";

export default async function Home() {
  let bestSellers: any[] = [];
  let categories: any[] = [];
  let categoriesWithImg: any[] = [];

  try {
    const [productsRes, categoriesRes, categoriesWithImgRes] = await Promise.all([
      AllProductApiServer(1, 10),
      getAllCategoriesApiServer(),
      getAllCategoriesWithImgApiServer()
    ]);

    const productsData = productsRes.data;
    bestSellers = productsData?.products ?? productsData?.data ?? (Array.isArray(productsData) ? productsData : []);

    const categoriesData = categoriesRes.data;
    categories = categoriesData?.categories ?? (Array.isArray(categoriesData) ? categoriesData : []);

    // Filter active categories for the slider
    const categoriesWithImgData = categoriesWithImgRes.data;
    const rawCategoriesWithImg = categoriesWithImgData?.categories ?? (Array.isArray(categoriesWithImgData) ? categoriesWithImgData : []);

    categoriesWithImg = Array.isArray(rawCategoriesWithImg)
      ? rawCategoriesWithImg.filter((c: any) => c.categoryStatus === 'ACTIVE')
      : [];

  } catch (error) {
    console.error("Home server-side data fetching error:", error);
  }

  return (
    <div className="min-h-screen bg-[#fdf8f5]">
      {/* SEO H1 Tag - Visually Hidden */}
      <h1 className="sr-only">Kadın Giyim & Aksesuar Butiği - Tarzınızı Yansıtan Parçalar</h1>

      {/* Hero Grid Banners */}
      <GridBanners />

      {/* Categories */}
      <CategorySlider initialCategories={categoriesWithImg} />

      {/* Featured Products - The star of the show */}
      <HomeFeaturedProducts products={bestSellers} categories={categories} />


      {/* Why Choose Us? - Elegant & Minimal */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <p className="text-[11px] font-semibold text-[#b76e79] tracking-[0.2em] uppercase mb-3">
              Neden Biz?
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2d2d2d] tracking-tight">
              Butik Deneyimimiz
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                title: "Özenle Seçilmiş Ürünler",
                description: "Her parça titizlikle seçilir. Kaliteli kumaşlar ve şık tasarımlarla tarzınızı tamamlayın.",
                icon: Sparkles,
              },
              {
                title: "Hızlı & Güvenli Teslimat",
                description: "Siparişleriniz özenle paketlenir ve en kısa sürede kapınıza ulaştırılır.",
                icon: Gift,
              },
              {
                title: "Kişisel Stil Danışmanlığı",
                description: "Uzman ekibimiz size özel stil önerileri sunarak gardırobunuzu zenginleştirmenize yardımcı olur.",
                icon: Heart,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group text-center px-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#fdf8f5] flex items-center justify-center mx-auto mb-5 group-hover:bg-[#b76e79]/10 transition-colors duration-500">
                  <item.icon className="w-6 h-6 text-[#b76e79]/60 group-hover:text-[#b76e79] transition-colors duration-500" />
                </div>
                <h3 className="text-base font-bold text-[#2d2d2d] mb-2">{item.title}</h3>
                <p className="text-sm text-[#8a7e78] leading-relaxed max-w-[280px] mx-auto">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Premium */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d2d2d] via-[#3a3035] to-[#2d2d2d]" />
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
        {/* Decorative gradient accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#b76e79]/10 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] font-semibold text-[#d4a373] tracking-[0.2em] uppercase mb-4">
            Özel Fırsatlar
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight leading-tight">
            Tarzınızı Keşfedin,<br className="hidden sm:block" /> Kendinizi Şımartın
          </h2>
          <p className="text-base md:text-lg text-white/50 mb-10 max-w-xl mx-auto font-light leading-relaxed">
            Hemen üye olun, yeni koleksiyonlardan ve özel indirimlerden ilk siz haberdar olun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2.5 bg-[#b76e79] text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-[#a35d68] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              Hemen Üye Ol
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-white/5 backdrop-blur-sm text-white px-8 py-3.5 rounded-full font-medium text-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5"
            >
              Koleksiyonları İncele
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
