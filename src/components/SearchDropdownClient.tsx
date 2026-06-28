"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { searchProductApi } from "@/Api/controllers/ProductController";
import type { SmallProduct } from "../types";

interface SearchDropdownClientProps {
    onClose?: () => void;
}

const SearchDropdownClient: React.FC<SearchDropdownClientProps> = ({ onClose }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SmallProduct[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Arama isteğini yapan fonksiyon
    const performSearch = async (keyword: string) => {
        if (!keyword.trim()) {
            setSearchResults([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        try {
            const response = await searchProductApi(keyword);
            setSearchResults(response.data || []);
            setIsOpen(true);
        } catch (error) {
            console.error("Arama hatası:", error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Debounce ile arama - kullanıcı yazmayı bıraktıktan 500ms sonra arama yap
    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        if (searchQuery.trim()) {
            debounceTimerRef.current = setTimeout(() => {
                performSearch(searchQuery);
            }, 500);
        } else {
            setSearchResults([]);
            setIsOpen(false);
        }

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchQuery]);

    // Dışarı tıklanınca dropdown'ı kapat
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleProductClick = (productUrl: string) => {
        navigate.push(`/product/${productUrl}`);
        setSearchQuery("");
        setSearchResults([]);
        setIsOpen(false);
        if (onClose) onClose();
    };

    const formatPrice = (price: number, currencyType: string) => {
        return `${price.toFixed(2)} ${currencyType}`;
    };

    return (
        <div ref={searchRef} className="relative w-full">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Ürün ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 bg-[#f7f5f0] border border-[#e8e6e1] rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#c9a84c]/30 focus:border-[#c9a84c]/50 placeholder:text-[#9a9aab] transition-all duration-300"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9a9aab]">
                    {isLoading ? (
                        <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    ) : (
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    )}
                </div>
            </div>

            {/* Arama Sonuçları Dropdown */}
            {isOpen && (
                <div className="absolute w-full mt-2 bg-white border border-[#e8e6e1] rounded-2xl shadow-[0_10px_40px_rgba(26,26,46,0.1)] max-h-96 overflow-y-auto z-50">
                    {isLoading ? (
                        // Skeleton Loading
                        <div className="p-2">
                            {[...Array(3)].map((_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-3 p-3 animate-pulse"
                                >
                                    <div className="w-16 h-16 bg-[#f0eeea] rounded-xl"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-[#f0eeea] rounded w-3/4"></div>
                                        <div className="h-3 bg-[#f0eeea] rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : searchResults.length > 0 ? (
                        // Arama Sonuçları
                        <div className="p-2">
                            {searchResults.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => handleProductClick(product.productUrl)}
                                    className="flex items-center space-x-3 p-3 hover:bg-[#f7f5f0] cursor-pointer rounded-xl transition-colors"
                                >
                                    <img
                                        src={product.img[0] || "/placeholder.png"}
                                        alt={product.title}
                                        className="w-16 h-16 object-cover rounded-xl"
                                    />
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-[#1a1a2e] line-clamp-2">
                                            {product.title}
                                        </h4>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-sm font-semibold text-[#c9a84c]">
                                                {formatPrice(product.price, product.currencyType)}
                                            </p>
                                            {product.point > 0 && (
                                                <div className="flex items-center text-xs text-[#9a9aab]">
                                                    <svg
                                                        className="w-4 h-4 text-[#c9a84c] fill-current"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                                    </svg>
                                                    <span className="ml-1">
                                                        {product.point.toFixed(1)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Sonuç bulunamadı
                        <div className="p-8 text-center text-[#9a9aab]">
                            <svg
                                className="w-12 h-12 mx-auto mb-3 text-[#e8e6e1]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <p className="text-sm">Sonuç bulunamadı</p>
                            <p className="text-xs mt-1">Farklı kelimeler deneyebilirsiniz</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchDropdownClient;
