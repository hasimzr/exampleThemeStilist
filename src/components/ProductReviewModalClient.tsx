"use client";
import React, { useState, useEffect } from "react";
import ModalComponent from "./ModalCompanent";
import StarRating from "./common/StarRating";
import {
    submitProductReviewApi,
    getProductReviewApi,
} from "@/Api/controllers/OrderController";
import { Package, Image as ImageIcon, Send } from "lucide-react";
import type { OrderType } from "./MyOrdersClient";

export interface ProductReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: OrderType;
    onSubmitted?: () => void | Promise<void>;
    productId: string; // Tek ürün için zorunlu
}

const ProductReviewModalClient: React.FC<ProductReviewModalProps> = ({
    isOpen,
    onClose,
    order,
    onSubmitted,
    productId,
}) => {
    const product = order.orderProductList.find((p) => p.id === productId);

    const [rating, setRating] = useState(0);
    const [message, setMessage] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [existingReview, setExistingReview] = useState<null | {
        point: number | null;
        message: string | null;
        imgUrls: string[];
        answer: string | null;
    }>(null);
    const [existingLoading, setExistingLoading] = useState(false);

    // Modal açıldığında mevcut değerlendirmeyi getir
    useEffect(() => {
        const fetchExisting = async () => {
            if (!isOpen) return;
            try {
                setExistingLoading(true);
                const res = await getProductReviewApi(order.id, productId);
                const data = res?.data;
                if (data) {
                    const point = (data.point ?? data.Point ?? null) as number | null;
                    const message = (data.message ?? data.Message ?? null) as
                        | string
                        | null;
                    const answer = (data.answer ?? data.Answer ?? null) as string | null;
                    const imgListRaw = (data.imgList ?? data.ImgList ?? "") as string;
                    const imgUrls = (imgListRaw || "")
                        .split(";")
                        .map((s: string) => s.trim())
                        .filter((s: string) => !!s);
                    // Eğer point, message veya img varsa mevcut inceleme say
                    if (
                        point !== null ||
                        (message && message.length > 0) ||
                        imgUrls.length > 0
                    ) {
                        setExistingReview({ point, message, imgUrls, answer });
                    } else {
                        setExistingReview(null);
                    }
                } else {
                    setExistingReview(null);
                }
            } catch (e) {
                // API hatasında mevcut inceleme yok varsayalım
                setExistingReview(null);
            } finally {
                setExistingLoading(false);
            }
        };
        fetchExisting();
        // modal kapanınca önceki state temizlensin
        return () => {
            setExistingReview(null);
            setExistingLoading(false);
            setRating(0);
            setMessage("");
            setImages([]);
        };
    }, [isOpen, productId, order.id]);

    const handleImageChange = (files: FileList | null) => {
        if (!files) return;
        const incoming = Array.from(files);
        const merged = [...images, ...incoming];
        if (merged.length > 5) {
            alert("Bir ürün için maksimum 5 fotoğraf yükleyebilirsiniz.");
        }
        setImages(merged.slice(0, 5));
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        // En az rating, message veya image olmalı
        if (rating === 0 && message.trim().length === 0 && images.length === 0) {
            alert("En az puan, mesaj veya fotoğraf girmelisiniz.");
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("orderId", order.id);
            if (product) {
                formData.append("productId", product.productDto.id);
            }
            formData.append("point", rating.toString());
            formData.append("message", message.trim());
            images.forEach((img) => formData.append("photos", img));

            await submitProductReviewApi(formData);
            alert("Değerlendirme başarıyla gönderildi.");
            if (onSubmitted) await onSubmitted();
            onClose();
        } catch (e) {
            console.error("Değerlendirme gönderilirken hata:", e);
            alert("Değerlendirme gönderilirken bir hata oluştu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (isSubmitting) return;
        onClose();
    };

    if (!product) {
        return null;
    }

    return (
        <ModalComponent
            isOpen={isOpen}
            onClose={handleClose}
            title={existingReview ? "Mevcut Değerlendirme" : "Ürünü Değerlendir"}
            size="lg"
        >
            <div className="flex flex-col max-h-[70vh]">
                <div className="p-6 pb-4 shrink-0">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-yellow-200 p-2 rounded-lg">
                            <Package className="w-6 h-6 text-yellow-700" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {existingReview
                                ? `Önceki Değerlendirme (#${order.id.substring(0, 12)})`
                                : `Ürün Değerlendirme (#${order.id.substring(0, 12)})`}
                        </h2>
                    </div>
                    <p className="text-sm text-gray-600">
                        {existingLoading
                            ? "Mevcut değerlendirme yükleniyor..."
                            : existingReview
                                ? "Bu ürüne daha önce eklenmiş inceleme aşağıdadır."
                                : "Bu ürün için 1-5 arası yıldız verin, yorum ekleyin ve isteğe bağlı fotoğraf yükleyin."}
                    </p>
                </div>
                <div className="px-6 pt-2 pb-4 overflow-y-auto flex-1">
                    {existingLoading && (
                        <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm animate-pulse">
                            <div className="flex items-start gap-4">
                                <div className="w-20 h-20 rounded-lg bg-gray-200" />
                                <div className="flex-1 min-w-0 space-y-3">
                                    <div className="h-5 bg-gray-200 rounded w-2/3" />
                                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                                    <div className="h-20 bg-gray-200 rounded w-full" />
                                </div>
                            </div>
                        </div>
                    )}
                    {existingReview && !existingLoading && (
                        <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                    <img
                                        src={
                                            product.productDto.images?.find((img: any) => img.isTitle)
                                                ?.imgName || 
                                            (product.productDto as any).img?.[0] || 
                                            "/placeholder-product.jpg"
                                        }
                                        alt={product.productDto.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {product.productDto.title}
                                    </h3>
                                    <div className="flex items-center gap-3 mb-3">
                                        <StarRating
                                            value={existingReview.point ?? 0}
                                            readOnly
                                            size="lg"
                                        />
                                        {existingReview.point !== null && (
                                            <span className="text-sm font-medium text-yellow-700">
                                                {existingReview.point} / 5
                                            </span>
                                        )}
                                    </div>
                                    {existingReview.message && (
                                        <p className="text-sm text-gray-800 whitespace-pre-line mb-3">
                                            {existingReview.message}
                                        </p>
                                    )}
                                    {existingReview.answer && (
                                        <div className="mt-3 p-3 bg-cyan-50 border-l-4 border-cyan-500 rounded-lg">
                                            <p className="text-xs font-semibold text-cyan-700 mb-1 flex items-center gap-1">
                                                <span>🛡️</span> Yönetici Cevabı
                                            </p>
                                            <p className="text-sm text-cyan-900 whitespace-pre-line">
                                                {existingReview.answer}
                                            </p>
                                        </div>
                                    )}
                                    {existingReview.imgUrls.length > 0 && (
                                        <div>
                                            <p className="text-xs text-gray-500 mb-2">
                                                Yüklenen Fotoğraflar
                                            </p>
                                            <div className="mt-1 grid grid-cols-5 gap-2">
                                                {existingReview.imgUrls.map((url, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-200 bg-gray-50"
                                                    >
                                                        <img
                                                            src={url}
                                                            alt={`review-${idx}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {!existingReview && !existingLoading && (
                        <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                    <img
                                        src={
                                            product.productDto.images?.find((img: any) => img.isTitle)
                                                ?.imgName || 
                                            (product.productDto as any).img?.[0] || 
                                            "/placeholder-product.jpg"
                                        }
                                        alt={product.productDto.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {product.productDto.title}
                                    </h3>
                                    <div className="flex items-center gap-3 mb-3">
                                        <StarRating value={rating} onChange={setRating} size="lg" />
                                        {rating > 0 && (
                                            <span className="text-sm font-medium text-yellow-700">
                                                {rating} / 5
                                            </span>
                                        )}
                                    </div>
                                    <textarea
                                        maxLength={255}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Ürün hakkındaki düşüncelerinizi yazın (maks. 255 karakter)"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm resize-none mb-3"
                                        rows={3}
                                    />
                                    <div>
                                        <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                            <ImageIcon className="w-4 h-4" /> Fotoğraflar (opsiyonel)
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => handleImageChange(e.target.files)}
                                            disabled={images.length >= 5}
                                            className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-100 file:text-yellow-800 hover:file:bg-yellow-200 cursor-pointer"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Maksimum 5 fotoğraf yükleyebilirsiniz.
                                        </p>
                                        {images.length > 0 && (
                                            <div className="mt-3 grid grid-cols-5 gap-2">
                                                {images.map((img, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="relative group w-20 h-20 rounded-md overflow-hidden border border-gray-200"
                                                    >
                                                        <img
                                                            src={URL.createObjectURL(img)}
                                                            alt={`preview-${idx}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(idx)}
                                                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs font-bold shadow hover:bg-red-700 transition-colors"
                                                            title="Kaldır"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-6 border-t bg-white flex justify-end gap-3 shrink-0 shadow-inner">
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
                    >
                        Kapat
                    </button>
                    {!existingReview && (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting && (
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            )}
                            <Send className="w-4 h-4" /> Gönder
                        </button>
                    )}
                </div>
            </div>
        </ModalComponent>
    );
};

export default ProductReviewModalClient;
