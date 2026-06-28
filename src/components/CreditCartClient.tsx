"use client";
import { useState, useEffect } from "react";
import {
    CreditCard,
    Lock,
    Calendar,
    User,
    Banknote,
    Wallet,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getPaymentOptionsApi, initializeIyzicoPaymentApi } from "@/Api/controllers/OrderController";
import type { PaymentOptions, PaymentMethodType, BankAccount, Address } from "../types";
import toast from "react-hot-toast";
import ModalComponent from "./ModalCompanent";
import {
    PRELIMINARY_INFORMATION_FORM,
    DISTANCE_SALES_AGREEMENT,
    KVKK_TEXT,
} from "@/data/contracts";

interface CreditCartClientProps {
    onComplete: (paymentInfo: PaymentInfo) => void;
    orderData?: {
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        phone: string | null;
    };
    paymentInfo?: PaymentInfo;
    selectedAddress?: Address | null;
}

export interface PaymentInfo {
    paymentMethod: PaymentMethodType;
    // Kredi kartı bilgileri
    cardNumber?: string;
    cardHolder?: string;
    expiryMonth?: string;
    expiryYear?: string;
    cvv?: string;
    // Banka transferi için
    selectedBank?: BankAccount;
}

const CreditCartClient = ({
    onComplete,
    orderData,
    paymentInfo,
    selectedAddress,
}: CreditCartClientProps) => {
    const { cartItems } = useCart();
    const [paymentOptions, setPaymentOptions] = useState<PaymentOptions | null>(
        null
    );
    const [selectedMethod, setSelectedMethod] =
        useState<PaymentMethodType | null>(paymentInfo?.paymentMethod || null);
    const [isLoadingOptions, setIsLoadingOptions] = useState(true);
    const [iyzicoHtml, setIyzicoHtml] = useState<string>("");

    const [form, setForm] = useState<PaymentInfo>({
        paymentMethod: paymentInfo?.paymentMethod || "creditCard",
        cardNumber: paymentInfo?.cardNumber || "",
        cardHolder: paymentInfo?.cardHolder
            ? paymentInfo.cardHolder
            : orderData?.firstName && orderData?.lastName
                ? `${orderData.firstName} ${orderData.lastName}`
                : "",
        expiryMonth: paymentInfo?.expiryMonth || "",
        expiryYear: paymentInfo?.expiryYear || "",
        cvv: paymentInfo?.cvv || "",
        selectedBank: paymentInfo?.selectedBank || undefined,
    });

    const [errors, setErrors] = useState<
        Partial<Record<keyof PaymentInfo, string>>
    >({});
    const [isProcessing, setIsProcessing] = useState(false);

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [kvkkAccepted, setKvkkAccepted] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showKvkkModal, setShowKvkkModal] = useState(false);

    // Ödeme seçeneklerini yükle
    useEffect(() => {
        const fetchPaymentOptions = async () => {
            try {
                setIsLoadingOptions(true);
                const stringList = cartItems.map((item) => item.product.id);
                console.log("stringList ==> ", stringList);

                const response = await getPaymentOptionsApi(stringList);
                setPaymentOptions(response.data);

                // Eğer sadece bir ödeme yöntemi varsa otomatik seç
                const availableMethods: PaymentMethodType[] = [];
                if (response.data.creditCard?.enabled)
                    availableMethods.push("creditCard");
                if (response.data.cashOnDelivery)
                    availableMethods.push("cashOnDelivery");
                if (response.data.bankTransfer?.enabled)
                    availableMethods.push("bankTransfer");

                if (availableMethods.length === 1 && !selectedMethod) {
                    setSelectedMethod(availableMethods[0]);
                    setForm({ ...form, paymentMethod: availableMethods[0] });
                }
            } catch (error) {
                console.error("Ödeme seçenekleri yüklenirken hata:", error);
            } finally {
                setIsLoadingOptions(false);
            }
        };

        fetchPaymentOptions();
    }, [cartItems]);

    useEffect(() => {
        if (iyzicoHtml) {
            const div = document.createElement("div");
            div.innerHTML = iyzicoHtml;
            const scripts = div.getElementsByTagName("script");
            Array.from(scripts).forEach((oldScript) => {
                const newScript = document.createElement("script");
                newScript.type = "text/javascript";
                if (oldScript.src) {
                    newScript.src = oldScript.src;
                } else {
                    newScript.textContent = oldScript.textContent;
                }
                document.body.appendChild(newScript);
            });
        }
    }, [iyzicoHtml]);

    useEffect(() => {
        setIyzicoHtml("");
    }, [selectedMethod, selectedAddress, cartItems]);

    const formatCardNumber = (value: string) => {
        const cleaned = value.replace(/\s/g, "");
        const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
        return formatted;
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s/g, "");
        if (value.length <= 16 && /^\d*$/.test(value)) {
            setForm({ ...form, cardNumber: value });
            if (errors.cardNumber) {
                setErrors({ ...errors, cardNumber: "" });
            }
        }
    };

    const handleCardHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setForm({ ...form, cardHolder: value });
        if (errors.cardHolder) {
            setErrors({ ...errors, cardHolder: "" });
        }
    };

    const handleExpiryMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;

        // Sadece rakam kabul et
        if (!/^\d*$/.test(value)) return;

        // İki karakterden fazla izin verme
        if (value.length > 2) return;

        // Boş ise direkt set et
        if (value === "") {
            setForm({ ...form, expiryMonth: "" });
            if (errors.expiryMonth) {
                setErrors({ ...errors, expiryMonth: "" });
            }
            return;
        }

        const numValue = parseInt(value);

        // Tek karakter
        if (value.length === 1) {
            // 0 yazıldıysa kabul et (02 gibi olabilir)
            if (value === "0") {
                setForm({ ...form, expiryMonth: "0" });
                if (errors.expiryMonth) {
                    setErrors({ ...errors, expiryMonth: "" });
                }
                return;
            }

            // 1 yazıldıysa bekle (10, 11, 12 olabilir)
            if (value === "1") {
                setForm({ ...form, expiryMonth: "1" });
                if (errors.expiryMonth) {
                    setErrors({ ...errors, expiryMonth: "" });
                }
                return;
            }

            // 2-9 arası ise otomatik olarak başına 0 ekle
            if (numValue >= 2 && numValue <= 9) {
                setForm({ ...form, expiryMonth: `0${value}` });
                if (errors.expiryMonth) {
                    setErrors({ ...errors, expiryMonth: "" });
                }
                return;
            }
        }

        // İki karakter - 01-12 arası kontrol
        if (value.length === 2) {
            if (numValue >= 1 && numValue <= 12) {
                setForm({ ...form, expiryMonth: value });
                if (errors.expiryMonth) {
                    setErrors({ ...errors, expiryMonth: "" });
                }
            }
        }
    };

    const handleExpiryMonthBlur = () => {
        // Input'tan çıkıldığında tek haneli ise başına 0 ekle
        const month = form.expiryMonth ?? "";
        if (month.length === 1) {
            const numValue = parseInt(month, 10);
            if (!Number.isNaN(numValue) && numValue >= 1 && numValue <= 9) {
                setForm({ ...form, expiryMonth: `0${month}` });
            }
        }
    };

    const handleExpiryYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= 2 && /^\d*$/.test(value)) {
            setForm({ ...form, expiryYear: value });
            if (errors.expiryYear) {
                setErrors({ ...errors, expiryYear: "" });
            }
        }
    };

    const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= 3 && /^\d*$/.test(value)) {
            setForm({ ...form, cvv: value });
            if (errors.cvv) {
                setErrors({ ...errors, cvv: "" });
            }
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof PaymentInfo, string>> = {};

        // Ödeme yöntemi seçilmemişse
        if (!selectedMethod) {
            alert("Lütfen bir ödeme yöntemi seçin");
            return false;
        }

        // Kredi kartı seçildiyse kart bilgilerini kontrol et
        if (selectedMethod === "creditCard") {
            // Eğer provider iyzico ise kart bilgilerini doğrulamaya gerek yok
            if (paymentOptions?.creditCard?.provider === "iyzico") {
                setErrors({});
                return true;
            }

            // Kart numarası kontrolü
            if (!form.cardNumber) {
                newErrors.cardNumber = "Kart numarası gerekli";
            } else if (form.cardNumber.length !== 16) {
                newErrors.cardNumber = "Kart numarası 16 haneli olmalıdır";
            }

            // Kart sahibi kontrolü
            if (!form.cardHolder?.trim()) {
                newErrors.cardHolder = "Kart sahibi adı gerekli";
            } else if (form.cardHolder.trim().length < 3) {
                newErrors.cardHolder = "Geçerli bir ad soyad girin";
            }

            // Ay kontrolü
            if (!form.expiryMonth) {
                newErrors.expiryMonth = "Ay gerekli";
            } else {
                const month = parseInt(form.expiryMonth);
                if (month < 1 || month > 12) {
                    newErrors.expiryMonth = "Geçersiz ay";
                }
            }

            // Yıl kontrolü
            if (!form.expiryYear) {
                newErrors.expiryYear = "Yıl gerekli";
            } else {
                const currentYear = new Date().getFullYear() % 100;
                const year = parseInt(form.expiryYear);
                if (year < currentYear) {
                    newErrors.expiryYear = "Kartın süresi dolmuş";
                }
            }

            // CVV kontrolü
            if (!form.cvv) {
                newErrors.cvv = "CVV gerekli";
            } else if (form.cvv.length !== 3) {
                newErrors.cvv = "CVV 3 haneli olmalıdır";
            }
        }

        // Banka transferi seçildiyse banka hesabı seçimi kontrol et
        if (selectedMethod === "bankTransfer" && !form.selectedBank) {
            alert("Lütfen bir banka hesabı seçin");
            return false;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsProcessing(true);

        if (selectedMethod === "creditCard" && paymentOptions?.creditCard?.provider === "iyzico") {
            try {
                const toOptionKeyArray = (item: any) => {
                    const optionMap = item?.selectedOptions || {};
                    if (!item?.product?.features || !Array.isArray(item.product.features)) {
                        return Object.values(optionMap);
                    }

                    return Object.entries(optionMap).map(([featKey, selectedValue]) => {
                        const feature = item.product.features.find(
                            (f: any) => String(f.id || f.title) === String(featKey),
                        );
                        const matchedOption = feature?.options?.find(
                            (o: any) =>
                                String(o.optionKey ?? o.id) === String(selectedValue) ||
                                String(o.id) === String(selectedValue),
                        );
                        return matchedOption?.optionKey ?? selectedValue;
                    });
                };

                const payload = {
                    email: orderData?.email || "",
                    firstName: orderData?.firstName || selectedAddress?.fullName?.split(" ")[0] || "",
                    lastName: orderData?.lastName || selectedAddress?.fullName?.split(" ").slice(1).join(" ") || "",
                    phoneNumber: orderData?.phone || selectedAddress?.phone || "",
                    phone: selectedAddress?.phone || orderData?.phone || "",
                    addressLine: selectedAddress?.addressLine || "",
                    fullName: selectedAddress?.fullName || "",
                    city: selectedAddress?.city || "",
                    district: selectedAddress?.district || "",
                    neighborhood: selectedAddress?.neighborhood || "",
                    postalCode: selectedAddress?.postalCode || "",
                    title: selectedAddress?.title || "",
                    type: selectedAddress?.type || "INDIVIDUAL",
                    paymentMethod: "creditCard",
                    orderProductList: cartItems.map((item: any) => ({
                        productId: item.product.id,
                        quantity: item.quantity,
                        selectedOptions: toOptionKeyArray(item),
                    })),
                    isDefault: selectedAddress?.isDefault ?? true,
                    tc: selectedAddress?.tc || "",
                    customerNote: ""
                };

                const res = await initializeIyzicoPaymentApi(payload);
                if (res?.data) {
                    const htmlWithResponsive = res.data
                        .replace(/(class|className)\s*=\s*\\?["']\s*popup\s*\\?["']/g, 'class="responsive"')
                        .replace(/\\?["']?pageType\\?["']?\s*:\s*\\?["']\s*popup\s*\\?["']/g, '"pageType": "responsive"');
                    setIyzicoHtml(htmlWithResponsive);
                } else {
                    toast.error("Ödeme bağlantısı oluşturulamadı.");
                }
            } catch (err: any) {
                console.error(err);
                toast.error(err.response?.data?.message || "Ödeme bağlantısı oluşturulurken bir hata oluştu.");
            } finally {
                setIsProcessing(false);
            }
            return;
        }

        // Ödeme işlemi simülasyonu
        setTimeout(() => {
            setIsProcessing(false);
            const paymentData: PaymentInfo = {
                paymentMethod: selectedMethod!,
                ...(selectedMethod === "creditCard" && paymentOptions?.creditCard?.provider !== "iyzico" && {
                    cardNumber: form.cardNumber,
                    cardHolder: form.cardHolder,
                    expiryMonth: form.expiryMonth,
                    expiryYear: form.expiryYear,
                    cvv: form.cvv,
                }),
                ...(selectedMethod === "bankTransfer" && {
                    selectedBank: form.selectedBank,
                }),
            };
            onComplete(paymentData);
        }, 2000);
    };

    const getCardType = (number: string) => {
        if (!number) return null;
        const firstDigit = number[0];
        if (firstDigit === "4") return "VISA";
        if (firstDigit === "5") return "MASTERCARD";
        if (firstDigit === "3") return "AMEX";
        return "CARD";
    };

    return (
        <div className="lg:col-span-2">
            <div className="bg-white rounded-[32px] p-8 border border-[#f0e6df]/60 shadow-[0_15px_40px_rgba(183,110,121,0.03)]">
                <div className="flex items-center justify-between mb-6 pb-5 border-b border-[#f0e6df]/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#fdf8f5] p-3 rounded-2xl border border-[#f0e6df]/50">
                            <Wallet className="w-5 h-5 text-[#b76e79]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-extrabold text-[#2d2d2d] flex items-center gap-2">
                                Ödeme Yöntemi Seçin
                            </h2>
                            <p className="text-xs text-[#8a7e78] mt-1.5 font-medium">
                                Size uygun ödeme yöntemini seçerek devam edin
                            </p>
                        </div>
                    </div>
                </div>

                {/* Güvenlik Uyarısı */}
                <div className="bg-[#fdf8f5] border-l-4 border-[#b76e79] rounded-r-2xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <Lock className="w-5 h-5 text-[#b76e79] mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-[#2d2d2d] flex items-center gap-1.5">
                                256-bit SSL ile Güvenli Ödeme
                            </p>
                            <p className="text-xs text-[#8a7e78] mt-1 font-medium">
                                Ödeme bilgileriniz uçtan uca şifrelenerek güvenli bir şekilde iletilir
                            </p>
                        </div>
                    </div>
                </div>

                {isLoadingOptions ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="w-8 h-8 border-4 border-[#b76e79] border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-3 text-sm text-[#8a7e78] font-medium">
                            Ödeme seçenekleri yükleniyor...
                        </span>
                    </div>
                ) : (
                    <>
                        {/* Ödeme Yöntemi Seçim Kartları */}
                        <div className="space-y-4 mb-6">
                            {/* Kredi Kartı */}
                            {paymentOptions?.creditCard?.enabled && (
                                <div
                                    onClick={() => {
                                        setSelectedMethod("creditCard");
                                        setForm({ ...form, paymentMethod: "creditCard" });
                                    }}
                                    className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${selectedMethod === "creditCard"
                                        ? "border-[#b76e79] bg-[#fdf8f5] shadow-[0_10px_25px_rgba(183,110,121,0.05)]"
                                        : "border-[#f0e6df]/70 bg-white hover:border-[#b76e79]/30 hover:shadow-[0_10px_25px_rgba(183,110,121,0.02)]"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-300 ${selectedMethod === "creditCard"
                                                ? "border-[#b76e79] bg-[#b76e79]"
                                                : "border-[#f0e6df]"
                                                }`}
                                        >
                                            {selectedMethod === "creditCard" && (
                                                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="w-5 h-5 text-[#b76e79]" />
                                                <h3 className="font-bold text-base text-[#2d2d2d]">
                                                    Kredi Kartı / Banka Kartı
                                                </h3>
                                            </div>
                                            <p className="text-xs text-[#8a7e78] mt-1 font-medium">
                                                Visa, MasterCard, American Express, Troy
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="w-12 h-7 bg-[#2d2d2d] rounded-lg flex items-center justify-center text-white text-[8px] font-black tracking-widest shadow-sm">
                                                VISA
                                            </div>
                                            <div className="w-12 h-7 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white text-[8px] font-black tracking-widest shadow-sm">
                                                MC
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Kapıda Ödeme */}
                            {paymentOptions?.cashOnDelivery && (
                                <div
                                    onClick={() => {
                                        setSelectedMethod("cashOnDelivery");
                                        setForm({ ...form, paymentMethod: "cashOnDelivery" });
                                    }}
                                    className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${selectedMethod === "cashOnDelivery"
                                        ? "border-[#b76e79] bg-[#fdf8f5] shadow-[0_10px_25px_rgba(183,110,121,0.05)]"
                                        : "border-[#f0e6df]/70 bg-white hover:border-[#b76e79]/30 hover:shadow-[0_10px_25px_rgba(183,110,121,0.02)]"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-300 ${selectedMethod === "cashOnDelivery"
                                                ? "border-[#b76e79] bg-[#b76e79]"
                                                : "border-[#f0e6df]"
                                                }`}
                                        >
                                            {selectedMethod === "cashOnDelivery" && (
                                                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <Banknote className="w-5 h-5 text-[#b76e79]" />
                                                <h3 className="font-bold text-base text-[#2d2d2d]">
                                                    Kapıda Ödeme
                                                </h3>
                                            </div>
                                            <p className="text-xs text-[#8a7e78] mt-1 font-medium">
                                                Nakit veya kredi kartı ile kapıda ödeme yapabilirsiniz
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Banka Transferi / EFT / Havale */}
                            {paymentOptions?.bankTransfer?.enabled && (
                                <div
                                    onClick={() => {
                                        setSelectedMethod("bankTransfer");
                                        setForm({ ...form, paymentMethod: "bankTransfer" });
                                    }}
                                    className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${selectedMethod === "bankTransfer"
                                        ? "border-[#b76e79] bg-[#fdf8f5] shadow-[0_10px_25px_rgba(183,110,121,0.05)]"
                                        : "border-[#f0e6df]/70 bg-white hover:border-[#b76e79]/30 hover:shadow-[0_10px_25px_rgba(183,110,121,0.02)]"
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-300 ${selectedMethod === "bankTransfer"
                                                ? "border-[#b76e79] bg-[#b76e79]"
                                                : "border-[#f0e6df]"
                                                }`}
                                        >
                                            {selectedMethod === "bankTransfer" && (
                                                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <svg
                                                    className="w-5 h-5 text-[#b76e79]"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                                                    />
                                                </svg>
                                                <h3 className="font-bold text-base text-[#2d2d2d]">
                                                    Banka Transferi / EFT / Havale
                                                </h3>
                                            </div>
                                            <p className="text-xs text-[#8a7e78] mt-1 font-medium">
                                                Banka hesabımıza havale/EFT ile ödeme yapabilirsiniz
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Kredi Kartı Formu veya İyzico Güvenli Ödeme Bağlantısı */}
                        {selectedMethod === "creditCard" && (
                            paymentOptions?.creditCard?.provider === "iyzico" ? (
                                <div className="border-t border-[#f0e6df]/50 pt-6">
                                    {iyzicoHtml ? (
                                        <div className="iyzico-form-container min-h-[300px] bg-white rounded-2xl p-4 border border-[#f0e6df]/60">
                                            <div id="iyzipay-checkout-form" className="responsive"></div>
                                            <div dangerouslySetInnerHTML={{ __html: iyzicoHtml }} />
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <div className="bg-[#fdf8f5] border border-[#f0e6df]/70 rounded-2xl p-6 mb-6">
                                                <CreditCard className="w-12 h-12 text-[#b76e79] mx-auto mb-4" />
                                                <h3 className="text-base font-extrabold text-[#2d2d2d] mb-2">
                                                    İyzico Güvenli Ödeme
                                                </h3>
                                                <p className="text-xs text-[#8a7e78] leading-relaxed max-w-md mx-auto font-medium">
                                                    Ödemenizi İyzico güvencesiyle tamamlamak için lütfen aşağıdaki butona tıklayarak güvenli ödeme bağlantısını oluşturun.
                                                </p>
                                            </div>

                                            {/* Sözleşmeler */}
                                            <div className="mb-6 space-y-3.5 text-left max-w-md mx-auto bg-white p-5 rounded-2xl border border-[#f0e6df]/60 shadow-[0_4px_15px_rgba(183,110,121,0.02)]">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex items-center h-5">
                                                        <input
                                                            id="terms-iyzico"
                                                            type="checkbox"
                                                            checked={termsAccepted}
                                                            onChange={(e) => setTermsAccepted(e.target.checked)}
                                                            className="w-4 h-4 border-gray-300 rounded text-[#b76e79] focus:ring-[#b76e79] cursor-pointer"
                                                        />
                                                    </div>
                                                    <label htmlFor="terms-iyzico" className="text-xs text-[#2d2d2d] select-none leading-relaxed font-medium">
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowTermsModal(true)}
                                                            className="text-[#b76e79] hover:text-[#a35d68] underline font-bold cursor-pointer text-left inline-block"
                                                        >
                                                            Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi
                                                        </button>
                                                        'ni okudum, onaylıyorum.
                                                    </label>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <div className="flex items-center h-5">
                                                        <input
                                                            id="kvkk-iyzico"
                                                            type="checkbox"
                                                            checked={kvkkAccepted}
                                                            onChange={(e) => setKvkkAccepted(e.target.checked)}
                                                            className="w-4 h-4 border-gray-300 rounded text-[#b76e79] focus:ring-[#b76e79] cursor-pointer"
                                                        />
                                                    </div>
                                                    <label htmlFor="kvkk-iyzico" className="text-xs text-[#2d2d2d] select-none leading-relaxed font-medium">
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowKvkkModal(true)}
                                                            className="text-[#b76e79] hover:text-[#a35d68] underline font-bold cursor-pointer text-left inline-block"
                                                        >
                                                            KVKK Aydınlatma Metni
                                                        </button>
                                                        'ni okudum.
                                                    </label>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleSubmit()}
                                                disabled={isProcessing || !termsAccepted || !kvkkAccepted}
                                                className={`w-full py-3.5 rounded-full font-bold text-sm text-white transition-all items-center justify-center gap-2 shadow-md hover:shadow-lg hidden lg:flex ${
                                                    isProcessing || !termsAccepted || !kvkkAccepted
                                                    ? "bg-[#fdf8f5] text-neutral-400 cursor-not-allowed border border-[#f0e6df] shadow-none"
                                                    : "bg-[#b76e79] hover:bg-[#a35d68] transform hover:-translate-y-0.5 active:translate-y-0"
                                                    }`}
                                            >
                                                {isProcessing ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                        <span>Bağlantı Oluşturuluyor...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock className="w-4 h-4" />
                                                        <span>Güvenli Ödeme Bağlantısı Oluştur</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="border-t border-[#f0e6df]/50 pt-6">
                                    <h3 className="text-[#2d2d2d] font-extrabold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-[#b76e79]" />
                                        Kart Bilgilerinizi Girin
                                    </h3>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        {/* Kart Numarası */}
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2d2d2d] mb-2">
                                                Kart Numarası <span className="text-rose-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <CreditCard className="w-5 h-5 text-[#8a7e78]/60" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={formatCardNumber(form.cardNumber || "")}
                                                    onChange={handleCardNumberChange}
                                                    placeholder="1234 5678 9012 3456"
                                                    className={`w-full px-4 py-3.5 pl-12 pr-20 border border-[#f0e6df] rounded-2xl focus:ring-2 focus:ring-[#b76e79]/20 focus:border-[#b76e79] transition-all duration-300 shadow-sm bg-white font-medium text-[#2d2d2d] placeholder-[#8a7e78]/45 text-sm ${errors.cardNumber
                                                        ? "border-rose-300 bg-rose-50/30 focus:border-rose-400 focus:ring-rose-400/20"
                                                        : ""
                                                        }`}
                                                />
                                                {form.cardNumber && form.cardNumber.length > 0 && (
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                        <div className="bg-[#2d2d2d] px-2.5 py-1 rounded-md text-[9px] font-extrabold text-white tracking-wider shadow-sm">
                                                            {getCardType(form.cardNumber)}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {errors.cardNumber && (
                                                <p className="text-rose-500 text-xs mt-2 flex items-center gap-1 font-medium">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    {errors.cardNumber}
                                                </p>
                                            )}
                                        </div>

                                        {/* Kart Sahibi */}
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2d2d2d] mb-2">
                                                Kart Üzerindeki İsim <span className="text-rose-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <User className="w-5 h-5 text-[#8a7e78]/60" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={form.cardHolder || ""}
                                                    onChange={handleCardHolderChange}
                                                    placeholder="Ad Soyad"
                                                    className={`w-full px-4 py-3.5 pl-12 border border-[#f0e6df] rounded-2xl focus:ring-2 focus:ring-[#b76e79]/20 focus:border-[#b76e79] transition-all duration-300 shadow-sm bg-white font-medium text-[#2d2d2d] placeholder-[#8a7e78]/45 text-sm ${errors.cardHolder
                                                        ? "border-rose-300 bg-rose-50/30 focus:border-rose-400 focus:ring-rose-400/20"
                                                        : ""
                                                        }`}
                                                />
                                            </div>
                                            {errors.cardHolder && (
                                                <p className="text-rose-500 text-xs mt-2 flex items-center gap-1 font-medium">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    {errors.cardHolder}
                                                </p>
                                            )}
                                        </div>

                                        {/* Son Kullanma Tarihi ve CVV */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Son Kullanma Tarihi */}
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2d2d2d] mb-2">
                                                    Son Kullanma Tarihi <span className="text-rose-500">*</span>
                                                </label>
                                                <div className="flex gap-3 items-center">
                                                    <div className="relative flex-1">
                                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                            <Calendar className="w-4 h-4 text-[#8a7e78]/60" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={form.expiryMonth || ""}
                                                            onChange={handleExpiryMonthChange}
                                                            onBlur={handleExpiryMonthBlur}
                                                            placeholder="AA"
                                                            maxLength={2}
                                                            className={`w-full px-4 py-3.5 pl-10 border border-[#f0e6df] rounded-2xl focus:ring-2 focus:ring-[#b76e79]/20 focus:border-[#b76e79] transition-all duration-300 shadow-sm bg-white font-semibold text-[#2d2d2d] placeholder-[#8a7e78]/45 text-sm text-center ${errors.expiryMonth
                                                                ? "border-rose-300 bg-rose-50/30 focus:border-rose-400 focus:ring-rose-400/20"
                                                                : ""
                                                                }`}
                                                        />
                                                    </div>
                                                    <span className="text-xl text-[#f0e6df] font-bold">
                                                        /
                                                    </span>
                                                    <div className="flex-1">
                                                        <input
                                                            type="text"
                                                            value={form.expiryYear || ""}
                                                            onChange={handleExpiryYearChange}
                                                            placeholder="YY"
                                                            maxLength={2}
                                                            className={`w-full px-4 py-3.5 border border-[#f0e6df] rounded-2xl focus:ring-2 focus:ring-[#b76e79]/20 focus:border-[#b76e79] transition-all duration-300 shadow-sm bg-white font-semibold text-[#2d2d2d] placeholder-[#8a7e78]/45 text-sm text-center ${errors.expiryYear
                                                                ? "border-rose-300 bg-rose-50/30 focus:border-rose-400 focus:ring-rose-400/20"
                                                                : ""
                                                                }`}
                                                        />
                                                    </div>
                                                </div>
                                                {(errors.expiryMonth || errors.expiryYear) && (
                                                    <p className="text-rose-500 text-xs mt-2 flex items-center gap-1 font-medium">
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        {errors.expiryMonth || errors.expiryYear}
                                                    </p>
                                                )}
                                            </div>

                                            {/* CVV */}
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2d2d2d] mb-2">
                                                    CVV/CVC <span className="text-rose-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                        <Lock className="w-5 h-5 text-[#8a7e78]/60" />
                                                    </div>
                                                    <input
                                                        type="password"
                                                        value={form.cvv || ""}
                                                        onChange={handleCvvChange}
                                                        placeholder="123"
                                                        maxLength={3}
                                                        className={`w-full px-4 py-3.5 pl-12 pr-12 border border-[#f0e6df] rounded-2xl focus:ring-2 focus:ring-[#b76e79]/20 focus:border-[#b76e79] transition-all duration-300 shadow-sm bg-white font-medium text-[#2d2d2d] placeholder-[#8a7e78]/45 text-sm ${errors.cvv
                                                            ? "border-rose-300 bg-rose-50/30 focus:border-rose-400 focus:ring-rose-400/20"
                                                            : ""
                                                            }`}
                                                    />
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 group">
                                                        <div className="w-5 h-5 border border-[#f0e6df] rounded-full flex items-center justify-center text-[10px] font-bold text-[#b76e79] cursor-help hover:bg-[#fdf8f5] transition">
                                                            ?
                                                        </div>
                                                        <div className="hidden group-hover:block absolute right-0 top-10 w-56 bg-[#2d2d2d] text-white text-[11px] font-medium p-3 rounded-2xl z-10 shadow-xl border border-[#f0e6df]/15">
                                                            <div className="font-extrabold mb-1 uppercase tracking-wider text-[#b76e79]">CVV Nedir?</div>
                                                            Kartınızın arkasındaki 3 haneli güvenlik kodu
                                                            <div className="absolute -top-1 right-4 w-2 h-2 bg-[#2d2d2d] transform rotate-45 border-l border-t border-[#f0e6df]/15"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {errors.cvv && (
                                                    <p className="text-rose-500 text-xs mt-2 flex items-center gap-1 font-medium">
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        {errors.cvv}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Ödeme Butonu */}
                                        <button
                                            type="submit"
                                            disabled={isProcessing}
                                            className={`w-full py-3.5 rounded-full font-bold text-sm text-white transition-all items-center justify-center gap-2 shadow-md hover:shadow-lg hidden lg:flex ${isProcessing
                                                ? "bg-[#fdf8f5] text-neutral-400 cursor-not-allowed border border-[#f0e6df]"
                                                : "bg-[#b76e79] hover:bg-[#a35d68] transform hover:-translate-y-0.5 active:translate-y-0"
                                                }`}
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                    <span>İşlem Yapılıyor...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Lock className="w-4 h-4" />
                                                    <span>Güvenli Ödeme Yap</span>
                                                </>
                                            )}
                                        </button>

                                        {/* Kabul Edilen Kartlar */}
                                        <div className="pt-6 border-t border-[#f0e6df]/50">
                                            <p className="text-[10px] text-[#8a7e78] text-center mb-4 font-bold uppercase tracking-wider">
                                                Kabul Edilen Kartlar
                                            </p>
                                            <div className="flex justify-center items-center gap-3">
                                                <div className="w-16 h-10 bg-[#fdf8f5]/60 border border-[#f0e6df] rounded-xl flex items-center justify-center text-[#2d2d2d] font-black tracking-widest text-[9px] shadow-sm hover:shadow-md hover:border-[#b76e79]/30 transition duration-300">
                                                    VISA
                                                </div>
                                                <div className="w-16 h-10 bg-[#fdf8f5]/60 border border-[#f0e6df] rounded-xl flex items-center justify-center text-[#2d2d2d] font-black tracking-widest text-[9px] shadow-sm hover:shadow-md hover:border-[#b76e79]/30 transition duration-300">
                                                    MC
                                                </div>
                                                <div className="w-16 h-10 bg-[#fdf8f5]/60 border border-[#f0e6df] rounded-xl flex items-center justify-center text-[#2d2d2d] font-black tracking-widest text-[9px] shadow-sm hover:shadow-md hover:border-[#b76e79]/30 transition duration-300">
                                                    AMEX
                                                </div>
                                                <div className="w-16 h-10 bg-[#fdf8f5]/60 border border-[#f0e6df] rounded-xl flex items-center justify-center text-[#2d2d2d] font-black tracking-widest text-[9px] shadow-sm hover:shadow-md hover:border-[#b76e79]/30 transition duration-300">
                                                    TROY
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            )
                        )}

                        {/* Banka Transferi İçin Banka Hesap Seçimi */}
                        {selectedMethod === "bankTransfer" &&
                            paymentOptions?.bankTransfer?.accounts && (
                                <div className="border-t border-[#f0e6df]/50 pt-6">
                                    <h3 className="text-[#2d2d2d] font-extrabold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <svg
                                            className="w-4 h-4 text-[#b76e79]"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                                            />
                                        </svg>
                                        Banka Hesabı Seçin
                                    </h3>
                                    <div className="space-y-3 mb-6">
                                        {paymentOptions.bankTransfer.accounts.map(
                                            (account, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() =>
                                                        setForm({ ...form, selectedBank: account })
                                                    }
                                                    className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${form.selectedBank === account
                                                        ? "border-[#b76e79] bg-[#fdf8f5] shadow-[0_10px_25px_rgba(183,110,121,0.05)]"
                                                        : "border-[#f0e6df]/70 bg-white hover:border-[#b76e79]/30 hover:shadow-[0_10px_25px_rgba(183,110,121,0.02)]"
                                                        }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div
                                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 transition-colors duration-300 ${form.selectedBank === account
                                                                ? "border-[#b76e79] bg-[#b76e79]"
                                                                : "border-[#f0e6df]"
                                                                }`}
                                                        >
                                                            {form.selectedBank === account && (
                                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-sm text-[#2d2d2d]">
                                                                {account.bankName}
                                                            </h4>
                                                            <p className="text-xs text-[#8a7e78] mt-1.5 font-medium">
                                                                <span className="font-bold text-[#2d2d2d]">
                                                                    Hesap Sahibi:
                                                                </span>{" "}
                                                                {account.accountHolder}
                                                            </p>
                                                            <p className="text-xs text-[#8a7e78] font-mono mt-1 break-all">
                                                                <span className="font-bold text-[#2d2d2d]">IBAN:</span>{" "}
                                                                {account.iban}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    {/* Ödeme Butonu (Banka Transferi) */}
                                    <button
                                        onClick={() => handleSubmit()}
                                        disabled={isProcessing || !form.selectedBank}
                                        className={`w-full py-3.5 rounded-full font-bold text-sm text-white transition-all items-center justify-center gap-2 shadow-md hover:shadow-lg hidden lg:flex ${isProcessing || !form.selectedBank
                                            ? "bg-[#fdf8f5] text-neutral-400 cursor-not-allowed border border-[#f0e6df]"
                                            : "bg-[#b76e79] hover:bg-[#a35d68] transform hover:-translate-y-0.5 active:translate-y-0"
                                            }`}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                <span>İşlem Yapılıyor...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="w-4 h-4" />
                                                <span>Banka Transferi ile Devam Et</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                        {/* Kapıda Ödeme İçin Bilgi ve Onay */}
                        {selectedMethod === "cashOnDelivery" && (
                            <div className="border-t border-[#f0e6df]/50 pt-6 text-center">
                                <div className="bg-[#fdf8f5] border border-[#f0e6df]/70 rounded-2xl p-6 mb-6">
                                    <Banknote className="w-12 h-12 text-[#b76e79] mx-auto mb-4" />
                                    <h3 className="text-base font-extrabold text-[#2d2d2d] mb-2">
                                        Kapıda Ödeme Bilgilendirmesi
                                    </h3>
                                    <p className="text-xs text-[#8a7e78] leading-relaxed max-w-md mx-auto font-medium">
                                        Sipariş tutarınızı ürün teslimatı sırasında{" "}
                                        <strong className="text-[#2d2d2d] font-bold">nakit veya kredi kartı</strong> ile kurye
                                        görevlisine ödeyebilirsiniz. Lütfen teslimat sırasında
                                        ödemeyi yapmayı unutmayın.
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleSubmit()}
                                    disabled={isProcessing}
                                    className={`w-full py-3.5 rounded-full font-bold text-sm text-white transition-all items-center justify-center gap-2 shadow-md hover:shadow-lg hidden lg:flex ${isProcessing
                                        ? "bg-[#fdf8f5] text-neutral-400 cursor-not-allowed border border-[#f0e6df]"
                                        : "bg-[#b76e79] hover:bg-[#a35d68] transform hover:-translate-y-0.5 active:translate-y-0"
                                        }`}
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                            <span>İşlem Yapılıyor...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4" />
                                            <span>Siparişi Onayla</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Mobile Sticky Footer */}
                        {!iyzicoHtml && (
                            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#f0e6df]/50 shadow-[0_-10px_30px_rgba(183,110,121,0.06)] z-50 lg:hidden">
                            <button
                                onClick={() => handleSubmit()}
                                disabled={
                                    isProcessing || 
                                    (selectedMethod === 'bankTransfer' && !form.selectedBank) || 
                                    !selectedMethod ||
                                    (selectedMethod === 'creditCard' && paymentOptions?.creditCard?.provider === 'iyzico' && (!termsAccepted || !kvkkAccepted))
                                }
                                className={`w-full py-3 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${
                                    isProcessing || 
                                    (selectedMethod === 'bankTransfer' && !form.selectedBank) || 
                                    !selectedMethod ||
                                    (selectedMethod === 'creditCard' && paymentOptions?.creditCard?.provider === 'iyzico' && (!termsAccepted || !kvkkAccepted))
                                    ? "bg-neutral-100 text-neutral-400 cursor-not-allowed border border-neutral-200"
                                    : "bg-[#b76e79] hover:bg-[#a35d68] text-white"
                                }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                        <span>İşlem Yapılıyor...</span>
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4" />
                                        <span>
                                            {!selectedMethod 
                                                ? "Ödeme Yöntemi Seçin"
                                                : selectedMethod === "creditCard" 
                                                    ? (paymentOptions?.creditCard?.provider === "iyzico" ? "Güvenli Ödeme Bağlantısı Oluştur" : "Güvenli Ödeme Yap") 
                                                    : selectedMethod === "bankTransfer" 
                                                        ? "Banka Transferi ile Devam Et" 
                                                        : "Siparişi Onayla"}
                                        </span>
                                    </>
                                )}
                            </button>
                        </div>
                        )}
                    </>
                )}
            </div>

            {/* Sözleşme Modalları */}
            <ModalComponent
                isOpen={showTermsModal}
                onClose={() => setShowTermsModal(false)}
                title="Ön Bilgilendirme Formu ve Satış Sözleşmesi"
                size="lg"
            >
                <div className="space-y-6 text-sm text-[#8a7e78] leading-relaxed p-2">
                    <div className="bg-[#fdf8f5] rounded-2xl p-6 border border-[#f0e6df]/60">
                        <h3 className="text-base font-extrabold text-[#2d2d2d] mb-4 pb-2 border-b border-[#f0e6df]/50">
                            ÖN BİLGİLENDİRME FORMU
                        </h3>
                        <div className="whitespace-pre-wrap pl-1 text-xs font-medium">
                            {PRELIMINARY_INFORMATION_FORM}
                        </div>
                    </div>

                    <div className="bg-[#fdf8f5] rounded-2xl p-6 border border-[#f0e6df]/60">
                        <h3 className="text-base font-extrabold text-[#2d2d2d] mb-4 pb-2 border-b border-[#f0e6df]/50">
                            MESAFELİ SATIŞ SÖZLEŞMESİ
                        </h3>
                        <div className="whitespace-pre-wrap pl-1 text-xs font-medium">
                            {DISTANCE_SALES_AGREEMENT}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 sticky bottom-0 bg-white border-t border-[#f0e6df]/30 p-4 -mx-6 -mb-6 mt-4">
                        <button
                            onClick={() => {
                                setTermsAccepted(true);
                                setShowTermsModal(false);
                            }}
                            className="bg-[#b76e79] text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-[#a35d68] transition shadow-sm hover:shadow"
                        >
                            Okudum, Onaylıyorum
                        </button>
                    </div>
                </div>
            </ModalComponent>

            <ModalComponent
                isOpen={showKvkkModal}
                onClose={() => setShowKvkkModal(false)}
                title="KVKK Aydınlatma Metni"
                size="lg"
            >
                <div className="space-y-6 text-sm text-[#8a7e78] leading-relaxed p-2">
                    <div className="bg-[#fdf8f5] rounded-2xl p-6 border border-[#f0e6df]/60">
                        <div className="whitespace-pre-wrap pl-1 text-xs font-medium">{KVKK_TEXT}</div>
                    </div>

                    <div className="flex justify-end pt-4 sticky bottom-0 bg-white border-t border-[#f0e6df]/30 p-4 -mx-6 -mb-6 mt-4">
                        <button
                            onClick={() => {
                                setKvkkAccepted(true);
                                setShowKvkkModal(false);
                            }}
                            className="bg-[#b76e79] text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-[#a35d68] transition shadow-sm hover:shadow"
                        >
                            Okudum
                        </button>
                    </div>
                </div>
            </ModalComponent>
        </div>
    );
};

export default CreditCartClient;
