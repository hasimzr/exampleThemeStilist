"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAllCategoriesWithImgApi } from "@/Api/controllers/CategoryController";

interface Category {
    id: number;
    categoryName: string;
    categoryImg: string;
    categoryStatus: string;
    subCategories: any[];
}

interface CategorySliderProps {
    initialCategories?: Category[];
}

const CategorySlider: React.FC<CategorySliderProps> = ({ initialCategories }) => {
    const [categories, setCategories] = useState<Category[]>(initialCategories || []);
    const [loading, setLoading] = useState<boolean>(!initialCategories);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (initialCategories) return;

        const fetchCategories = async () => {
            try {
                const response = await getAllCategoriesWithImgApi();
                if (response.data && Array.isArray(response.data)) {
                    setCategories(response.data.filter((c: Category) => c.categoryStatus === 'ACTIVE'));
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, [initialCategories]);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = direction === "left" ? -current.offsetWidth / 2 : current.offsetWidth / 2;
            current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    if (loading) {
        return (
            <div className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-[#f8e8e0] rounded w-1/4 mb-8"></div>
                        <div className="flex gap-4 overflow-hidden">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="min-w-[140px] h-[160px] bg-[#f8e8e0] rounded-2xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (categories.length === 0) return null;

    return (
        <section className="py-12 md:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-8 md:mb-10">
                    <div>
                        <p className="text-[11px] font-semibold text-[#b76e79] tracking-[0.2em] uppercase mb-2">
                            Kategoriler
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-[#2d2d2d] tracking-tight">
                            Koleksiyonlarımız
                        </h2>
                    </div>
                    <div className="hidden md:flex gap-2">
                        <button
                            onClick={() => scroll("left")}
                            className="w-10 h-10 rounded-full border border-[#f0e6df] hover:border-[#b76e79] text-[#8a7e78] hover:text-[#b76e79] flex items-center justify-center transition-all duration-300"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="w-10 h-10 rounded-full border border-[#f0e6df] hover:border-[#b76e79] text-[#8a7e78] hover:text-[#b76e79] flex items-center justify-center transition-all duration-300"
                            aria-label="Next"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Slider Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 md:gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
                    style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                    }}
                >
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/products?category=${category.id}`}
                            className="flex-none w-[140px] md:w-[170px] snap-start group"
                        >
                            <div className="relative overflow-hidden rounded-2xl bg-[#fdf8f5] border border-[#f0e6df]/50 hover:border-[#b76e79]/30 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(183,110,121,0.1)] text-center h-full flex flex-col">
                                {/* Image Container */}
                                <div className="aspect-square relative flex items-center justify-center p-5">
                                    {category.categoryImg ? (
                                        <img
                                            src={category.categoryImg}
                                            alt={category.categoryName}
                                            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-[#f0e6df] flex items-center justify-center">
                                            <span className="text-xl">👗</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="px-3 pb-4 flex-1 flex flex-col justify-center">
                                    <h3 className="font-semibold text-[#2d2d2d] text-xs md:text-[13px] group-hover:text-[#b76e79] transition-colors duration-300 line-clamp-2 leading-tight">
                                        {category.categoryName}
                                    </h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategorySlider;
