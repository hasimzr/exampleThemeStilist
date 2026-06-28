"use client";
import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Gift, Heart, Crown } from "lucide-react";

interface BannerItem {
  id: number;
  image: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  badgeTextColor?: string;
  ctaText: string;
  link: string;
}

const bannerItems: BannerItem[] = [
  {
    id: 1,
    image: "/banners/summer-sale.png",
    title: "Yaz Koleksiyonu",
    subtitle: "Tarzınızı yansıtan parçalar",
    badge: "%30 İNDİRİM",
    badgeColor: "bg-[#b76e79]",
    badgeTextColor: "text-white",
    ctaText: "Koleksiyonu Keşfet",
    link: "/products",
  },
  {
    id: 2,
    image: "/banners/new-products.png",
    title: "Yeni Gelenler",
    badge: "YENİ",
    badgeColor: "bg-[#b76e79]",
    badgeTextColor: "text-white",
    ctaText: "Hemen İncele",
    link: "/products",
  },
  {
    id: 3,
    image: "/banners/free-shipping.png",
    title: "Ücretsiz Kargo",
    badge: "KARGO BEDAVA",
    badgeColor: "bg-[#d4a373]",
    badgeTextColor: "text-white",
    ctaText: "Alışverişe Başla",
    link: "/products",
  },
  {
    id: 4,
    image: "/banners/sensor-collection.png",
    title: "Aksesuar",
    ctaText: "Keşfet",
    link: "/products",
  },
  {
    id: 5,
    image: "/banners/membership.png",
    title: "VIP Üyelik",
    badge: "VIP",
    badgeColor: "bg-[#d4a373]",
    badgeTextColor: "text-white",
    ctaText: "Üye Ol",
    link: "/register",
  },
];

const GridBanners: React.FC = () => {
  return (
    <section className="w-full bg-[#fdf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-8">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[220px]">
          
          {/* Banner 1 - Büyük Ana Banner (Sol taraf, 2 sütun, 2 satır) */}
          <Link
            href={bannerItems[0].link}
            className="group relative col-span-1 md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500"
          >
            <img
              src={bannerItems[0].image}
              alt="Yaz Koleksiyonu"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              draggable={false}
            />
            {/* Elegant gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
            
            {/* Badge */}
            {bannerItems[0].badge && (
              <span className={`absolute top-5 left-5 ${bannerItems[0].badgeColor} ${bannerItems[0].badgeTextColor} text-[10px] md:text-xs font-bold px-3.5 py-1.5 rounded-full tracking-wider shadow-lg z-10 backdrop-blur-sm`}>
                <Sparkles className="w-3 h-3 inline-block mr-1 -mt-0.5" />
                {bannerItems[0].badge}
              </span>
            )}

            {/* Text Content */}
            <div className="absolute bottom-7 left-7 md:bottom-9 md:left-9 z-10">
              {bannerItems[0].subtitle && (
                <p className="text-white/70 text-xs md:text-sm font-light tracking-wide mb-1">
                  {bannerItems[0].subtitle}
                </p>
              )}
              {bannerItems[0].title && (
                <h3 className="text-white text-xl md:text-3xl font-bold tracking-tight mb-4 leading-tight">
                  {bannerItems[0].title}
                </h3>
              )}
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-sm font-semibold border border-white/25 group-hover:bg-[#b76e79] group-hover:text-white group-hover:border-[#b76e79] transition-all duration-400 shadow-lg">
                <span>{bannerItems[0].ctaText}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>

            {/* Hover border glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl ring-2 ring-[#b76e79]/40 ring-inset" />
          </Link>

          {/* Banner 2 - Yeni Gelenler */}
          <Link
            href={bannerItems[1].link}
            className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500"
          >
            <img
              src={bannerItems[1].image}
              alt="Yeni Gelenler"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            
            {bannerItems[1].badge && (
              <span className={`absolute top-4 left-4 ${bannerItems[1].badgeColor} ${bannerItems[1].badgeTextColor} text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider z-10`}>
                {bannerItems[1].badge}
              </span>
            )}

            {/* Title & Hover CTA */}
            <div className="absolute bottom-4 left-4 z-10">
              <h3 className="text-white text-sm font-bold mb-2 tracking-wide">{bannerItems[1].title}</h3>
              <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-semibold border border-white/20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <span>{bannerItems[1].ctaText}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl ring-2 ring-[#b76e79]/30 ring-inset" />
          </Link>

          {/* Banner 3 - Ücretsiz Kargo */}
          <Link
            href={bannerItems[2].link}
            className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500"
          >
            <img
              src={bannerItems[2].image}
              alt="Ücretsiz Kargo"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            
            {bannerItems[2].badge && (
              <span className={`absolute top-4 left-4 ${bannerItems[2].badgeColor} ${bannerItems[2].badgeTextColor} text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider z-10`}>
                <Gift className="w-3 h-3 inline-block mr-1 -mt-0.5" />
                {bannerItems[2].badge}
              </span>
            )}

            <div className="absolute bottom-4 left-4 z-10">
              <h3 className="text-white text-sm font-bold mb-2 tracking-wide">{bannerItems[2].title}</h3>
              <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-semibold border border-white/20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <span>{bannerItems[2].ctaText}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl ring-2 ring-[#d4a373]/30 ring-inset" />
          </Link>

          {/* Banner 4 - Aksesuar Koleksiyonu */}
          <Link
            href={bannerItems[3].link}
            className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500"
          >
            <img
              src={bannerItems[3].image}
              alt="Aksesuar Koleksiyonu"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            
            <div className="absolute bottom-4 left-4 z-10">
              <h3 className="text-white text-sm font-bold mb-2 tracking-wide">{bannerItems[3].title}</h3>
              <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-semibold border border-white/20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <Heart className="w-3 h-3 text-[#b76e79]" />
                <span>{bannerItems[3].ctaText}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl ring-2 ring-[#b76e79]/30 ring-inset" />
          </Link>

          {/* Banner 5 - VIP Üyelik */}
          <Link
            href={bannerItems[4].link}
            className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500"
          >
            <img
              src={bannerItems[4].image}
              alt="VIP Üyelik"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            
            {bannerItems[4].badge && (
              <span className={`absolute top-4 right-4 ${bannerItems[4].badgeColor} ${bannerItems[4].badgeTextColor} text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider z-10`}>
                <Crown className="w-3 h-3 inline-block mr-1 -mt-0.5" />
                {bannerItems[4].badge}
              </span>
            )}

            <div className="absolute bottom-4 left-4 z-10">
              <h3 className="text-white text-sm font-bold mb-2 tracking-wide">{bannerItems[4].title}</h3>
              <div className="inline-flex items-center gap-1.5 bg-[#d4a373] text-white px-4 py-2 rounded-full text-xs font-bold border border-[#d4a373] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <Crown className="w-3 h-3" />
                <span>{bannerItems[4].ctaText}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl ring-2 ring-[#d4a373]/30 ring-inset" />
          </Link>

        </div>
      </div>
    </section>
  );
};

export default GridBanners;
