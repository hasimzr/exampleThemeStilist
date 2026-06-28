"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { sliderData } from "@/data/slider";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const AUTO_PLAY_INTERVAL = 6000;

const Slider: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<number | null>(null);
  const length = sliderData.length;

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(
      () => setCurrent((prev) => (prev + 1) % length),
      AUTO_PLAY_INTERVAL
    );
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current, length]);

  const goTo = (idx: number) => setCurrent(idx);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + length) % length);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % length);

  return (
    <div className="relative w-full overflow-hidden bg-[#1a1a2e]">
      {/* Slides */}
      <div className="relative h-[55vw] min-h-[420px] max-h-[680px]">
        {sliderData.map((slider, idx) => (
          <div
            key={slider.id}
            className={`absolute inset-0 transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              idx === current
                ? "opacity-100 z-10 scale-100"
                : "opacity-0 z-0 scale-[1.03]"
            }`}
          >
            <img
              src={slider.image}
              alt={slider.title}
              className="w-full h-full object-cover object-center select-none"
              draggable={false}
            />
            {/* Elegant dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/90 via-[#1a1a2e]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/60 via-transparent to-[#1a1a2e]/20" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-xl">
                  <div
                    className={`transform transition-all duration-700 delay-200 ${
                      idx === current
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"
                    }`}
                  >
                    <span className="inline-block px-4 py-1.5 bg-[#c9a84c]/20 text-[#c9a84c] text-xs font-semibold rounded-full mb-5 backdrop-blur-sm border border-[#c9a84c]/30 tracking-widest uppercase">
                      Yeni Koleksiyon
                    </span>
                    <h2 className="text-3xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.1] mb-5 tracking-tight">
                      {slider.title}
                    </h2>
                    <p className="text-base md:text-lg text-white/60 mb-8 leading-relaxed max-w-md font-light">
                      {slider.description}
                    </p>
                    {slider.buttonText && (
                      <div className="flex items-center gap-4">
                        <Link
                          href={slider.buttonLink || "/products"}
                          className="inline-flex items-center gap-2.5 bg-white text-[#1a1a2e] px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-[#c9a84c] hover:text-[#1a1a2e] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                          {slider.buttonText}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                          href="/products"
                          className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors duration-300"
                        >
                          Tümünü Keşfet
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Minimal Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 -translate-y-1/2 left-6 md:left-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full p-3 border border-white/10 transition-all z-20 focus:outline-none hover:scale-105"
        aria-label="Önceki"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 -translate-y-1/2 right-6 md:right-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full p-3 border border-white/10 transition-all z-20 focus:outline-none hover:scale-105"
        aria-label="Sonraki"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Elegant Progress Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {sliderData.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`transition-all duration-500 rounded-full ${
              idx === current
                ? "bg-[#c9a84c] w-8 h-2"
                : "bg-white/30 w-2 h-2 hover:bg-white/50"
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
