"use client";
import Link from "next/link";
import { ShoppingBag, Lock, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Basket from "@/components/Basket";
import LoginOrUserDataEntry from "@/components/LoginOrUserDataEntry";
import AddressSelection from "@/components/AddressSelection";
import SummaryOrder from "@/components/SummaryOrder";
import CreditCart, { type PaymentInfo } from "@/components/CreditCart";
import type { Address } from "@/types";
import { addOrderApi } from "@/Api/controllers/OrderController";

type OrderType = {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
};

interface CartClientContentProps {
    orderIdParam?: string | null;
}

const CopyButton = ({ text, label }: { text: string; label: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success(`${label} kopyalandı`);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Kopyalanamadı");
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-cyan-600"
            title={`${label} Kopyala`}
        >
            {copied ? (
                <Check className="w-4 h-4 text-emerald-500" />
            ) : (
                <Copy className="w-4 h-4" />
            )}
        </button>
    );
};

export default function CartClientContent({ orderIdParam }: CartClientContentProps) {
    const { cartItems, clearCart, cartTotal } = useCart();
    const { isAuthenticated, user } = useAuth();
    const [step, setStep] = useState<number>(1);
    const [isGuest, setIsGuest] = useState<boolean>(false);

    const stepInfo = isAuthenticated
        ? [
            { num: 1, label: "Sepetim" },
            { num: 2, label: "Adres Seçimi" },
            { num: 3, label: "Ödeme Yöntemi" },
            { num: 4, label: "Sonuç" },
        ]
        : [
            { num: 1, label: "Sepetim" },
            { num: 2, label: "Kayıt/Giriş veya Devam Et" },
            { num: 3, label: "Adres Seçimi" },
            { num: 4, label: "Ödeme Yöntemi" },
            { num: 5, label: "Sonuç" },
        ];


    const [orderData, setOrderData] = useState<OrderType>({
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
    });

    useEffect(() => {
        if (isAuthenticated && user) {
            setOrderData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phoneNumber || null,
            });
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [step]);

    const [orderNumber, setOrderNumber] = useState<string | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | undefined>(
        undefined,
    );

    useEffect(() => {
        if (orderIdParam) {
            setOrderNumber(orderIdParam);
            setStep(isAuthenticated ? 5 : 6);
        }
    }, [orderIdParam, isAuthenticated]);

    const handleCheckout = () => {
        setStep(2);
    };

    const handleSubmitOrder = async () => {
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

        const payload: any = {
            email: orderData.email,
            firstName: orderData.firstName,
            lastName: orderData.lastName,
            phoneNumber: orderData.phone,
            addressLine: selectedAddress?.addressLine,
            fullName: selectedAddress?.fullName,
            city: selectedAddress?.city,
            companyName: selectedAddress?.companyName,
            district: selectedAddress?.district,
            isDefault: selectedAddress?.isDefault,
            neighborhood: selectedAddress?.neighborhood,
            phone: selectedAddress?.phone,
            postalCode: selectedAddress?.postalCode,
            taxNumber: selectedAddress?.taxNumber,
            taxOffice: selectedAddress?.taxOffice,
            tc: selectedAddress?.tc,
            title: selectedAddress?.title,
            type: selectedAddress?.type,
            paymentMethod: paymentInfo?.paymentMethod,
            orderProductList: cartItems.map((item: any) => ({
                productId: item.product.id,
                quantity: item.quantity,
                selectedOptions: toOptionKeyArray(item),
            })),
        };

        if (paymentInfo?.paymentMethod === "creditCard") {
            payload.cardNumber = paymentInfo.cardNumber;
            payload.cardHolder = paymentInfo.cardHolder;
            payload.expiryMonth = paymentInfo.expiryMonth;
            payload.expiryYear = paymentInfo.expiryYear;
            payload.cvv = paymentInfo.cvv;
        }

        if (
            paymentInfo?.paymentMethod === "bankTransfer" &&
            paymentInfo.selectedBank
        ) {
            payload.selectedBankName = paymentInfo.selectedBank.bankName;
            payload.selectedBankAccount = paymentInfo.selectedBank.accountHolder;
            payload.selectedBankIban = paymentInfo.selectedBank.iban;
        }

        let res = await addOrderApi(payload);
        if (res) {
            if (paymentInfo?.paymentMethod === "creditCard") {
                document.open();
                document.write(res.data);
                document.close();
            } else {
                setStep(isAuthenticated ? 5 : 6);
                setOrderNumber(res.data);
            }
        }
    };

    if (cartItems.length === 0 && !orderNumber) {
        return (
            <div className="min-h-screen bg-[#fdf8f5] py-16">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="bg-white rounded-[32px] border border-[#f0e6df]/60 p-12 sm:p-16 text-center shadow-[0_15px_40px_rgba(183,110,121,0.04)]">
                        <div className="w-20 h-20 bg-[#fdf8f5] rounded-full flex items-center justify-center mx-auto mb-6 text-[#b76e79]">
                            <ShoppingBag className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-[#2d2d2d] mb-3">
                            Sepetiniz Boş
                        </h2>
                        <p className="text-[#8a7e78] text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                            Butiğimizin eşsiz tasarımlarına göz atarak alışverişe hemen başlayabilirsiniz.
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center bg-[#b76e79] text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-[#a35d68] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Alışverişe Başla
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fdf8f5] py-6 sm:py-10 pb-24 sm:pb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2d2d2d] mb-2 tracking-tight">
                        Alışveriş Sepeti
                    </h1>
                    <p className="text-sm text-[#8a7e78]">
                        {stepInfo[step - 1]?.label || "Sepetiniz"}
                    </p>
                </div>

                <div className="mb-6 sm:mb-10">
                    <div className="bg-white rounded-3xl border border-[#f0e6df]/50 p-6 overflow-x-auto shadow-[0_10px_30px_rgba(183,110,121,0.02)]">
                        <div className="flex items-center justify-between min-w-max sm:min-w-0">
                            {stepInfo.map((s, index) => (
                                <div key={s.num} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1 relative">
                                        <div
                                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-300 shadow-sm relative z-10 ${step === s.num
                                                ? "bg-[#b76e79] text-white scale-110 ring-4 ring-[#b76e79]/15"
                                                : step > s.num
                                                    ? "bg-[#2d2d2d] text-white hover:scale-105"
                                                    : "bg-white text-[#8a7e78] border border-[#f0e6df]"
                                                }`}
                                        >
                                            {step > s.num ? (
                                                <svg
                                                    className="w-5 h-5 sm:w-6 sm:h-6"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={3}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            ) : (
                                                s.num
                                            )}
                                        </div>
                                        <span
                                            className={`text-xs sm:text-sm mt-2 font-medium whitespace-nowrap text-center px-2 transition-colors duration-300 ${step === s.num
                                                ? "text-[#b76e79] font-bold"
                                                : step > s.num
                                                    ? "text-[#2d2d2d] font-semibold"
                                                    : "text-[#8a7e78]"
                                                }`}
                                        >
                                            {s.label}
                                        </span>
                                    </div>
                                    {index < stepInfo.length - 1 && (
                                        <div className="flex-1 h-0.5 mx-2 sm:mx-4 rounded-full overflow-hidden bg-[#f0e6df] relative">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${step > s.num
                                                    ? "bg-[#b76e79] w-full"
                                                    : "w-0 bg-[#b76e79]"
                                                    }`}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {((isAuthenticated && step < 4) || (!isAuthenticated && step < 5)) && (
                        <div className="lg:col-span-2 space-y-4">
                            {step > 1 && step < 5 && (
                                <button
                                    onClick={() => setStep(step - 1)}
                                    className="flex items-center gap-2 text-[#8a7e78] hover:text-[#b76e79] transition-colors mb-2 font-medium"
                                >
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
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                    <span>Geri Dön ({stepInfo[step - 2]?.label})</span>
                                </button>
                            )}


                            {step === 1 && <Basket />}
                            {step === 2 && !isAuthenticated && (
                                <LoginOrUserDataEntry
                                    isGuest={isGuest}
                                    setIsGuest={setIsGuest}
                                    orderData={orderData}
                                    setOrderData={setOrderData}
                                    onComplete={() => setStep(3)}
                                />
                            )}
                            {step === 2 && isAuthenticated && (
                                <AddressSelection
                                    addresses={addresses}
                                    setAddresses={setAddresses}
                                    selectedAddress={selectedAddress}
                                    setSelectedAddress={setSelectedAddress}
                                    orderData={orderData}
                                    onComplete={(address) => {
                                        setSelectedAddress(address);
                                        setStep(3);
                                    }}
                                />
                            )}
                            {step === 3 && !isAuthenticated && (
                                <AddressSelection
                                    addresses={addresses}
                                    setAddresses={setAddresses}
                                    selectedAddress={selectedAddress}
                                    setSelectedAddress={setSelectedAddress}
                                    orderData={orderData}
                                    onComplete={(address) => {
                                        setSelectedAddress(address);
                                        setStep(4);
                                    }}
                                />
                            )}
                            {step === 3 && isAuthenticated && (
                                <CreditCart
                                    orderData={orderData}
                                    paymentInfo={paymentInfo}
                                    selectedAddress={selectedAddress}
                                    onComplete={(payment) => {
                                        setPaymentInfo(payment);
                                        setStep(4);
                                    }}
                                />
                            )}
                            {step === 4 && !isAuthenticated && (
                                <CreditCart
                                    orderData={orderData}
                                    paymentInfo={paymentInfo}
                                    selectedAddress={selectedAddress}
                                    onComplete={(payment) => {
                                        setPaymentInfo(payment);
                                        setStep(5);
                                    }}
                                />
                            )}
                        </div>
                    )}

                    {((step === 4 && isAuthenticated) ||
                        (step === 5 && !isAuthenticated)) && (
                            <SummaryOrder
                                orderData={orderData}
                                address={selectedAddress}
                                payment={paymentInfo}
                                onComplete={() => handleSubmitOrder()}
                                onBack={() => {
                                    setStep(step - 1);
                                }}
                            />
                        )}
                    {((step === 5 && isAuthenticated) ||
                        (step === 6 && !isAuthenticated)) && (
                            <div className="lg:col-span-3">
                                <div className="bg-white rounded-[32px] p-8 sm:p-12 text-center border border-[#f0e6df]/60 shadow-[0_15px_40px_rgba(183,110,121,0.04)]">
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#fdf8f5] rounded-full flex items-center justify-center mx-auto mb-6 text-[#b76e79]">
                                        <svg
                                            className="w-10 h-10 sm:w-12 sm:h-12"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2.5}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2d2d2d] mb-4">
                                        🎉 Siparişiniz Alındı!
                                    </h2>
                                    <p className="text-[#8a7e78] text-base mb-8 max-w-2xl mx-auto leading-relaxed">
                                        {paymentInfo?.paymentMethod === "bankTransfer"
                                            ? "Siparişiniz başarıyla oluşturuldu. Aşağıdaki banka hesap bilgilerine ödeme yapabilirsiniz."
                                            : "Siparişiniz başarıyla oluşturuldu. En kısa sürede kargoya verilecektir."}
                                    </p>
                                    <div className="bg-[#fdf8f5] rounded-2xl p-6 sm:p-8 mb-8 border border-[#f0e6df]/70 max-w-md mx-auto">
                                        <div className="flex items-center justify-center gap-2 mb-3">
                                            <ShoppingBag className="w-5 h-5 text-[#b76e79]" />
                                            <p className="text-sm font-bold text-[#2d2d2d]">
                                                Sipariş Numaranız
                                            </p>
                                        </div>
                                        <p className="text-3xl sm:text-4xl font-extrabold text-[#b76e79]">
                                            #{orderNumber}
                                        </p>
                                        <p className="text-xs text-[#8a7e78] mt-3">
                                            Bu numarayı kullanarak siparişinizi takip edebilirsiniz
                                        </p>
                                    </div>

                                    {paymentInfo?.paymentMethod === "bankTransfer" &&
                                        paymentInfo?.selectedBank && (
                                            <div className="bg-neutral-50 rounded-2xl p-6 sm:p-8 mb-8 border border-[#f0e6df]/50 max-w-2xl mx-auto">
                                                <div className="flex items-center justify-center gap-2 mb-4">
                                                    <svg
                                                        className="w-6 h-6 text-[#b76e79]"
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
                                                    <h3 className="text-lg font-bold text-[#2d2d2d]">
                                                        Ödeme Yapılacak Banka Hesabı
                                                    </h3>
                                                </div>
                                                <div className="space-y-3 text-left bg-white rounded-xl p-5 border border-[#f0e6df]/40 shadow-sm">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-gray-600 min-w-[120px]">
                                                            Banka Adı:
                                                        </span>
                                                        <div className="flex items-center gap-2 flex-grow justify-between">
                                                            <span className="text-sm text-gray-900 font-medium">
                                                                {paymentInfo.selectedBank.bankName}
                                                            </span>
                                                            <CopyButton
                                                                text={paymentInfo.selectedBank.bankName}
                                                                label="Banka Adı"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-gray-600 min-w-[120px]">
                                                            Hesap Sahibi:
                                                        </span>
                                                        <div className="flex items-center gap-2 flex-grow justify-between">
                                                            <span className="text-sm text-gray-900 font-medium">
                                                                {paymentInfo.selectedBank.accountHolder}
                                                            </span>
                                                            <CopyButton
                                                                text={paymentInfo.selectedBank.accountHolder}
                                                                label="Hesap Sahibi"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-gray-600 min-w-[120px]">
                                                            IBAN:
                                                        </span>
                                                        <div className="flex items-center gap-2 flex-grow justify-between">
                                                            <span className="text-sm text-gray-900 font-mono font-medium">
                                                                {paymentInfo.selectedBank.iban}
                                                            </span>
                                                            <CopyButton
                                                                text={paymentInfo.selectedBank.iban}
                                                                label="IBAN"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-gray-600 min-w-[120px]">
                                                            Açıklama:
                                                        </span>
                                                        <div className="flex items-center gap-2 flex-grow justify-between">
                                                            <span className="text-sm text-gray-900 font-medium italic">
                                                                #{orderNumber} nolu sipariş ödemesi
                                                            </span>
                                                            <CopyButton
                                                                text={`#${orderNumber} nolu sipariş ödemesi`}
                                                                label="Açıklama"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-gray-600 min-w-[120px]">
                                                            Tutar:
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-base font-extrabold text-[#b76e79]">
                                                                ₺{(cartTotal).toLocaleString("tr-TR")}
                                                            </span>
                                                            <span className="text-[10px] text-[#8a7e78] font-medium bg-[#fdf8f5] px-2 py-0.5 rounded border border-[#f0e6df]">
                                                                (KDV Dahil Toplam Fiyat)
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 bg-amber-50/50 border-l-4 border-amber-500 rounded-r-xl p-3.5">
                                                    <div className="flex items-start gap-2">
                                                        <svg
                                                            className="w-5 h-5 text-amber-600 mt-0.5 shrink-0"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                        <p className="text-xs text-amber-800">
                                                            <strong>Önemli:</strong> Ödeme açıklamasına{" "}
                                                            <strong className="font-bold">
                                                                #{orderNumber}
                                                            </strong>{" "}
                                                            sipariş numaranızı yazmayı unutmayın. Ödemeniz
                                                            onaylandıktan sonra siparişiniz işleme alınacaktır.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    {paymentInfo?.paymentMethod === "cashOnDelivery" && (
                                        <div className="bg-[#fdf8f5] rounded-2xl p-6 mb-8 border border-[#f0e6df]/70 max-w-md mx-auto">
                                            <div className="flex items-center justify-center gap-2 mb-2">
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
                                                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                                    />
                                                </svg>
                                                <p className="text-sm font-bold text-[#2d2d2d]">
                                                    Kapıda Ödeme Seçildi
                                                </p>
                                            </div>
                                            <p className="text-xs text-[#8a7e78]">
                                                Ödemenizi ürün teslim edildiğinde nakit veya kredi kartı
                                                ile yapabilirsiniz.
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                                        <Link
                                            href="/products"
                                            className="inline-flex items-center justify-center gap-2 bg-[#b76e79] text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-[#a35d68] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                                            onClick={() => {
                                                clearCart();
                                                setOrderNumber(null);
                                                setStep(1);
                                            }}
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                            Alışverişe Devam Et
                                        </Link>
                                        <Link
                                            href="/dashboard"
                                            className="inline-flex items-center justify-center gap-2 bg-white text-[#2d2d2d] px-8 py-3.5 rounded-full font-bold text-sm hover:bg-[#fdf8f5] hover:border-[#b76e79]/30 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 border border-[#f0e6df]"
                                            onClick={() => {
                                                clearCart();
                                                setOrderNumber(null);
                                                setStep(1);
                                            }}
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                />
                                            </svg>
                                            Siparişlerimi Gör
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                    {((step < 4 && isAuthenticated) ||
                        (step < 5 && !isAuthenticated)) && (
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-[32px] p-8 sticky top-24 border border-[#f0e6df]/60 shadow-[0_15px_40px_rgba(183,110,121,0.04)]">
                                    <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#f0e6df]/50">
                                        <ShoppingBag className="w-5 h-5 text-[#b76e79]" />
                                        <h2 className="text-lg font-extrabold text-[#2d2d2d]">
                                            Sipariş Özeti
                                        </h2>
                                    </div>

                                    <div className="bg-[#fdf8f5] rounded-2xl p-4 mb-6 border border-[#f0e6df]/70">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-[#2d2d2d]">
                                                Sepetteki Ürün
                                            </span>
                                            <span className="text-sm font-extrabold text-[#b76e79]">
                                                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                                                Adet
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3.5 mb-6">
                                        <div className="flex justify-between text-[#8a7e78]">
                                            <span className="text-sm font-medium">Ara Toplam</span>
                                            <span className="font-bold text-[#2d2d2d]">
                                                ₺{(cartTotal * 1.2).toLocaleString("tr-TR")}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-[#8a7e78]">
                                            <span className="text-sm font-medium">Kargo</span>
                                            <span className="text-emerald-600 font-bold text-sm flex items-center gap-1">
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2.5}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                                Ücretsiz
                                            </span>
                                        </div>
                                        <div className="border-t border-[#f0e6df]/50 pt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-base font-extrabold text-[#2d2d2d]">
                                                    Toplam
                                                </span>
                                                <div className="text-right">
                                                    <div className="text-xl font-extrabold text-[#b76e79]">
                                                        ₺{(cartTotal).toLocaleString("tr-TR")}
                                                    </div>
                                                    <div className="text-xs text-[#8a7e78] mt-0.5">KDV Dahil</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {step === 1 && (
                                        <button
                                            onClick={handleCheckout}
                                            className="w-full bg-[#b76e79] text-white py-3.5 rounded-full font-bold text-sm hover:bg-[#a35d68] transition-all duration-300 mb-3 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                                        >
                                            <span>Adres Seçimi</span>
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2.5}
                                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                                />
                                            </svg>
                                        </button>
                                    )}

                                    <button
                                        onClick={clearCart}
                                        className="w-full bg-white text-[#2d2d2d] py-3 rounded-full font-bold text-xs hover:bg-[#fdf8f5] transition-all duration-300 border border-[#f0e6df]"
                                    >
                                        Sepeti Temizle
                                    </button>

                                    {step > 1 && (
                                        <button
                                            onClick={() => setStep(step - 1)}
                                            className="w-full mt-3 flex items-center justify-center bg-white text-[#8a7e78] py-3 rounded-full font-bold text-xs hover:bg-[#fdf8f5] transition-all duration-300 border border-[#f0e6df]"
                                        >
                                            <svg
                                                className="w-4 h-4 mr-1.5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2.5}
                                                    d="M11 7l-5 5m0 0l5 5m-5-5H18"
                                                />
                                            </svg>
                                            <span>{stepInfo[step - 2]?.label}'ne dön</span>
                                        </button>
                                    )}

                                    <div className="mt-6 pt-6 border-t border-[#f0e6df]/50">
                                        <div className="flex items-center gap-2 justify-center mb-3">
                                            <Lock className="w-4 h-4 text-[#b76e79]" />
                                            <p className="text-xs font-bold uppercase tracking-wider text-[#2d2d2d]">
                                                Güvenli Ödeme
                                            </p>
                                        </div>
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="w-14 h-8 bg-[#2d2d2d] rounded-lg flex items-center justify-center text-white text-[9px] font-extrabold tracking-widest shadow-sm">
                                                VISA
                                            </div>
                                            <div className="w-14 h-8 bg-[#2d2d2d] rounded-lg flex items-center justify-center text-white text-[9px] font-extrabold tracking-widest shadow-sm">
                                                MC
                                            </div>
                                            <div className="w-14 h-8 bg-[#2d2d2d] rounded-lg flex items-center justify-center text-white text-[9px] font-extrabold tracking-widest shadow-sm">
                                                AMEX
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-center text-[#8a7e78] mt-3">
                                            256-bit SSL şifreleme ile güvende
                                        </p>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-[#f0e6df]/50">
                                        <div className="flex items-center justify-center gap-6 text-[#8a7e78]">
                                            <div className="flex flex-col items-center">
                                                <svg
                                                    className="w-6 h-6 mb-1.5 text-[#b76e79]"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                                    />
                                                </svg>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a7e78]">Güvenli</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <svg
                                                    className="w-6 h-6 mb-1.5 text-[#b76e79]"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                                    />
                                                </svg>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a7e78]">Kargo</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <svg
                                                    className="w-6 h-6 mb-1.5 text-[#b76e79]"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                    />
                                                </svg>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a7e78]">İade</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
            </div>

            {step === 1 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#f0e6df]/50 p-4 shadow-[0_-10px_30px_rgba(183,110,121,0.06)] z-50 lg:hidden flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-[#8a7e78] font-bold">Toplam</span>
                        <span className="text-lg font-extrabold text-[#b76e79]">
                            ₺{(cartTotal * 1.2).toLocaleString("tr-TR")}
                        </span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        className="flex-1 bg-[#b76e79] text-white py-3 rounded-full font-bold text-sm shadow-md active:scale-[0.98] hover:bg-[#a35d68] transition-all flex items-center justify-center gap-2"
                    >
                        <span>Adres Seçimi</span>
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}
