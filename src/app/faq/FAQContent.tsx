"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, MessageCircle, HelpCircle } from "lucide-react";
import Link from "next/link";

export interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

interface FAQContentProps {
    faqData: FAQItem[];
}

const FAQContent = ({ faqData }: FAQContentProps) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");

    const categories = [
        "Tümü",
        ...Array.from(new Set(faqData.map((item) => item.category))),
    ];

    const filteredFAQ =
        selectedCategory === "Tümü"
            ? faqData
            : faqData.filter((item) => item.category === selectedCategory);

    const toggleQuestion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-2.5 mb-10 justify-center">
                {categories.map((category) => {
                    const isActive = selectedCategory === category;
                    return (
                        <button
                            key={category}
                            onClick={() => {
                                setSelectedCategory(category);
                                setOpenIndex(null); // Close active accordion when changing category
                            }}
                            className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                                isActive
                                    ? "bg-[#b76e79] text-white shadow-md hover:bg-[#a35d68]"
                                    : "bg-white text-[#8a7e78] border border-[#f0e6df] hover:bg-[#fdf8f5] hover:text-[#2d2d2d]"
                            }`}
                        >
                            {category}
                        </button>
                    );
                })}
            </div>

            {/* Accordion List */}
            <div className="space-y-4 mb-16">
                {filteredFAQ.map((item, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-2xl border border-[#f0e6df] overflow-hidden shadow-[0_4px_16px_rgba(183,110,121,0.02)] hover:shadow-[0_4px_16px_rgba(183,110,121,0.05)] transition-all duration-300"
                        >
                            <button
                                onClick={() => toggleQuestion(index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#fdf8f5]/30 transition-all duration-200"
                            >
                                <div className="pr-4">
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#b76e79] bg-[#b76e79]/5 px-2.5 py-1 rounded-full">
                                        {item.category}
                                    </span>
                                    <h3 className="text-sm md:text-base font-bold text-[#2d2d2d] mt-3.5 leading-snug">
                                        {item.question}
                                    </h3>
                                </div>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0 ${isOpen ? "bg-[#b76e79]/10 text-[#b76e79]" : "bg-[#fdf8f5] text-[#8a7e78]"}`}>
                                    {isOpen ? (
                                        <ChevronUp className="w-4 h-4" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4" />
                                    )}
                                </div>
                            </button>

                            {/* Accordion Content */}
                            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[300px] border-t border-[#f7f0eb]" : "max-h-0"}`}>
                                <div className="px-6 py-5 text-sm text-[#8a7e78] leading-relaxed bg-[#fdf8f5]/10">
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Support Call-to-Action Card */}
            <div className="bg-[#faf5f0] border border-[#f0e6df] rounded-3xl p-8 text-center max-w-2xl mx-auto shadow-sm relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-[#b76e79]/5 rounded-full blur-[60px] pointer-events-none" />
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 border border-[#f0e6df]">
                        <HelpCircle className="w-5 h-5 text-[#b76e79]" />
                    </div>
                    <h2 className="text-lg font-bold text-[#2d2d2d] mb-2">
                        Farklı bir sorunuz mu var?
                    </h2>
                    <p className="text-xs text-[#8a7e78] mb-6 max-w-sm mx-auto leading-relaxed">
                        Aradığınız cevabı bulamadıysanız, destek ekibimiz size memnuniyetle yardımcı olmaya hazırdır.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center justify-center gap-2 bg-[#b76e79] text-white px-7 py-3 rounded-full font-semibold text-xs hover:bg-[#a35d68] transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                    >
                        <MessageCircle className="w-4 h-4" />
                        Bize Ulaşın
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FAQContent;
