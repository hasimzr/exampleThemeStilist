"use client";
import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import {
    getMyOrderApi,
    cancelOrderRequestApi,
} from "@/Api/controllers/OrderController";
import ModalComponent from "./ModalCompanent";
import ProductReviewModal from "./ProductReviewModal";
import OrderDrawer from "./OrderDrawer";
import {
    Package,
    ShoppingBag,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    Box,
    RotateCcw,
} from "lucide-react";

type OrderStatus =
    | "PAYMENT_PENDING"
    | "PAYMENT_CONFIRMED"
    | "GETTING_READY"
    | "SHIPPED"
    | "DELIVERED"
    | "RETURN_REQUESTED"
    | "RETURN_APPROVED"
    | "RETURN_REJECTED"
    | "DELIVERY_FAILED"
    | "PAYMENT_FAIL"
    | "CANCELLED";

interface ProductDto {
    id: string;
    category: string[];
    code: string;
    currencyType: string;
    description: string;
    price: string;
    stock: number;
    stockType: string;
    title: string;
    features: any | null;
    images: any[] | null;
    img?: string[] | null;
}

interface OrderProduct {
    id: string;
    productId: string | null;
    quantity: number | null;
    productDto: ProductDto;
    currentPrice: number;
}

interface OrderMessage {
    message: string;
    createdTime: string;
    isAdminMessage: boolean;
    orderStatus: OrderStatus;
}

export interface OrderType {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    addressLine: string;
    fullName: string;
    city: string;
    companyName: string;
    district: string;
    isDefault: boolean;
    neighborhood: string;
    phone: string;
    postalCode: string;
    taxNumber: string;
    taxOffice: string;
    title: string;
    type: "INDIVIDUAL" | "CORPORATE";
    cardNumber: string | null;
    cardHolder: string | null;
    expiryMonth: string | null;
    expiryYear: string | null;
    cvv: string | null;
    paymentMethod?: "creditCard" | "cashOnDelivery" | "bankTransfer";
    selectedBankAccount?: string | null;
    selectedBankIban?: string | null;
    selectedBankName?: string | null;
    orderProductList: OrderProduct[];
    orderStatus: OrderStatus;
    orderMessageList?: OrderMessage[];
}

// Formatter'ı component dışında oluştur (her render'da yeniden oluşturulmayacak)
const priceFormatter = new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
});

// Skeleton loading component
const OrderSkeleton = () => {
    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-[#d2d2d7]/40 shadow-sm">
            <div className="bg-neutral-800 p-4 sm:p-5 animate-pulse">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="bg-white/10 p-2.5 rounded-lg w-11 h-11 shrink-0"></div>
                        <div className="flex-1 sm:flex-none">
                            <div className="h-3 bg-white/20 rounded w-24 mb-2"></div>
                            <div className="h-5 bg-white/30 rounded w-32"></div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                        <div className="h-8 bg-white/20 rounded-lg w-32"></div>
                        <div className="bg-white/10 px-4 py-2 rounded-lg w-full sm:w-auto">
                            <div className="h-3 bg-white/20 rounded w-20 mb-1"></div>
                            <div className="h-6 bg-white/30 rounded w-24"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 sm:p-5 bg-neutral-50 animate-pulse">
                <div className="flex items-start gap-3 sm:gap-4">
                    <div className="bg-gray-200 p-2.5 rounded-lg w-10 h-10 shrink-0"></div>
                    <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-32 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                    </div>
                </div>
            </div>
            <div className="p-4 sm:p-5 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-48 mb-4"></div>
                <div className="space-y-3">
                    {[1, 2].map((i) => (
                        <div
                            key={i}
                            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-gray-250"
                        >
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <div className="w-24 h-24 bg-gray-200 rounded-xl shrink-0"></div>
                                <div className="block sm:hidden flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                            <div className="hidden sm:block flex-1 w-full">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="hidden sm:block text-right shrink-0">
                                <div className="h-3 bg-gray-200 rounded w-12 mb-1"></div>
                                <div className="h-6 bg-gray-200 rounded w-20"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Order status helper functions
const getOrderStatusInfo = (status: OrderStatus) => {
    const statusMap: Record<
        OrderStatus,
        {
            label: string;
            color: string;
            bgColor: string;
            icon: any;
            action: {
                label: string;
                icons: any;
                textColor: string;
                bg: string;
            } | null;
        }
    > = {
        PAYMENT_PENDING: {
            // order received / success-ish (payment done)
            label: "Ödeme Onayı Bekleniyor",
            color: "text-green-700",
            bgColor: "bg-green-100",
            icon: ShoppingBag,
            action: {
                textColor: "text-red-700",
                bg: "bg-red-100",
                label: "Sipariş İptal Talebi Oluştur",
                icons: RotateCcw,
            },
        },
        PAYMENT_CONFIRMED: {
            // order received / success-ish (payment done)
            label: "Sipariş Alındı",
            color: "text-green-700",
            bgColor: "bg-green-100",
            icon: ShoppingBag,
            action: {
                textColor: "text-red-700",
                bg: "bg-red-100",
                label: "Sipariş İptal Talebi Oluştur",
                icons: RotateCcw,
            },
        },
        GETTING_READY: {
            label: "Sipariş Hazırlanıyor",
            color: "text-yellow-700",
            bgColor: "bg-yellow-100",
            icon: Clock,
            action: null,
        },
        SHIPPED: {
            label: "Kargoya Verildi",
            color: "text-blue-700",
            bgColor: "bg-blue-100",
            icon: Truck,
            action: null,
        },
        DELIVERED: {
            label: "Teslim Edildi",
            color: "text-green-700",
            bgColor: "bg-green-100",
            icon: CheckCircle,
            action: {
                textColor: "text-red-700",
                bg: "bg-red-100",
                label: "Sipariş İade Talebi Oluştur",
                icons: RotateCcw,
            },
        },
        RETURN_REQUESTED: {
            // customer requested a return — pending action
            label: "İade Talebi Alındı",
            color: "text-orange-700",
            bgColor: "bg-orange-100",
            icon: RotateCcw,
            action: null,
        },
        RETURN_APPROVED: {
            // return approved / completed
            label: "İade Onaylandı",
            color: "text-teal-700",
            bgColor: "bg-teal-100",
            icon: Box,
            action: null,
        },
        RETURN_REJECTED: {
            label: "İade Reddedildi",
            color: "text-red-700",
            bgColor: "bg-red-100",
            icon: XCircle,
            action: null,
        },
        DELIVERY_FAILED: {
            label: "Teslimat Başarısız",
            color: "text-red-800",
            bgColor: "bg-red-100",
            icon: XCircle,
            action: null,
        },
        PAYMENT_FAIL: {
            label: "Ödeme Başarısız",
            color: "text-red-700",
            bgColor: "bg-red-100",
            icon: XCircle,
            action: null,
        },
        CANCELLED: {
            label: "İptal Edildi",
            // cancelled should be neutral/soft but clearly distinct — use gray + X
            color: "text-gray-700",
            bgColor: "bg-gray-100",
            icon: XCircle,
            action: null,
        },
    };

    return statusMap[status];
};

// Memoized OrderItem component
const OrderItem = memo(
    ({
        item,
        formatPrice,
    }: {
        item: OrderProduct;
        formatPrice: (price: number) => string;
    }) => {
        const truncateTitle = (title: string, maxLength: number = 60) => {
            if (title.length <= maxLength) return title;
            return title.substring(0, maxLength) + "...";
        };

        const getProductImage = (product: ProductDto) => {
            if (product.images && product.images.length > 0) {
                const titleImage = product.images.find((img: any) => img.isTitle);
                return titleImage?.imgName || "/placeholder-product.jpg";
            }
            if (product.img && product.img.length > 0) {
                return product.img[0] || "/placeholder-product.jpg";
            }
            return "/placeholder-product.jpg";
        };

        const handleImageError = useCallback(
            (e: React.SyntheticEvent<HTMLImageElement>) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-product.jpg";
            },
            []
        );

        const itemTotal = useMemo(
            () => item.currentPrice * (item.quantity || 1),
            [item.currentPrice, item.quantity]
        );

        return (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border border-gray-200 hover:border-[#b76e79]/30 hover:bg-[#b76e79]/5 transition-all duration-200">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-xl overflow-hidden shrink-0 shadow-sm">
                        <img
                            src={getProductImage(item.productDto)}
                            alt={item.productDto.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={handleImageError}
                            loading="lazy"
                        />
                    </div>

                    {/* Mobile Text Content (Next to image on mobile) */}
                    <div className="flex-1 min-w-0 sm:hidden">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 leading-snug">
                            {item.productDto.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-xs font-medium text-gray-700">
                                <Package className="w-3 h-3 mr-1" />
                                {item.quantity || 1} Adet
                            </span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 mt-2">
                            {formatPrice(itemTotal)}
                        </p>
                    </div>
                </div>

                {/* Desktop Text Content */}
                <div className="hidden sm:block flex-1 min-w-0">
                    <h4 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug">
                        {truncateTitle(item.productDto.title)}
                    </h4>
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-sm font-medium text-gray-700">
                            <Package className="w-3.5 h-3.5 mr-1.5" />
                            {item.quantity || 1} Adet
                        </span>
                        <span className="text-sm font-semibold text-[#b76e79]">
                            {formatPrice(item.currentPrice)} / adet
                        </span>
                    </div>
                </div>

                {/* Desktop Total Price */}
                <div className="hidden sm:block text-right shrink-0">
                    <p className="text-xs text-gray-500 mb-1">Toplam</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {formatPrice(itemTotal)}
                    </p>
                </div>
            </div>
        );
    }
);

OrderItem.displayName = "OrderItem";

// Cancel Order Modal Component
interface CancelOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: OrderType;
    onSubmit: (orderId: string, reason: string) => void;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
    isOpen,
    onClose,
    order,
    onSubmit,
}) => {
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!reason.trim()) {
            alert("Lütfen iptal nedenini yazınız.");
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(order.id, reason);
            setReason("");
            onClose();
        } catch (error) {
            console.error("İptal talebi gönderilirken hata oluştu:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setReason("");
        onClose();
    };

    return (
        <ModalComponent
            isOpen={isOpen}
            onClose={handleClose}
            title="Sipariş İptal veya İade Talebi"
            size="lg"
        >
            <div className="p-4 sm:p-6">
                {/* Sipariş Bilgileri */}
                <div className="mb-6 p-4 bg-[#fafafa] rounded-2xl border border-[#d2d2d7]/40">
                    <h3 className="font-bold text-gray-900 mb-0 flex items-center gap-2 text-sm sm:text-base">
                        <Package className="w-5 h-5 text-[#b76e79]" />
                        Sipariş Numarası: #{order.id.substring(0, 12)}
                    </h3>
                </div>

                {/* Ürün Listesi */}
                <div className="mb-6">
                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-[#b76e79]" />
                        İptal Edilecek Ürünler
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {order.orderProductList.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#d2d2d7]/40"
                            >
                                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                                    <img
                                        src={
                                            item.productDto.images?.find((img: any) => img.isTitle)
                                                ?.imgName || 
                                            item.productDto.img?.[0] || 
                                            "/placeholder-product.jpg"
                                        }
                                        alt={item.productDto.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                                        {item.productDto.title}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {item.quantity} Adet ×{" "}
                                        {priceFormatter.format(item.currentPrice)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* İptal Nedeni */}
                <div className="mb-6">
                    <label
                        htmlFor="cancelReason"
                        className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2"
                    >
                        İptal Nedeni veya İade Nedeni{" "}
                        <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="cancelReason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Lütfen siparişinizi neden iade etmek istediğinizi detaylı bir şekilde açıklayın..."
                        className="w-full px-4 py-3 border border-[#d2d2d7] rounded-xl focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 text-sm transition-all bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60 resize-none"
                        rows={4}
                        disabled={isSubmitting}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Minimum 10 karakter gereklidir
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="w-full sm:flex-1 px-6 py-3 border border-[#d2d2d7] rounded-full text-[#1d1d1f] text-sm font-semibold hover:bg-[#f5f5f7] transition-all disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1 select-none active:scale-[0.98]"
                    >
                        Vazgeç
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !reason.trim() || reason.length < 10}
                        className="w-full sm:flex-1 px-6 py-3 bg-red-600 text-white rounded-full text-sm font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-2 select-none active:scale-[0.98]"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Gönderiliyor...
                            </>
                        ) : (
                            <>
                                <RotateCcw className="w-4 h-4" />
                                İptal Talebi Gönder
                            </>
                        )}
                    </button>
                </div>
            </div>
        </ModalComponent>
    );
};

// Memoized OrderCard component
const OrderCard = memo(
    ({
        order,
        formatPrice,
        onOpenDrawer,
    }: {
        order: OrderType;
        formatPrice: (price: number) => string;
        onOpenDrawer?: (order: OrderType) => void;
    }) => {
        const { totalAmount } = useMemo(() => {
            const amount = order.orderProductList.reduce(
                (sum, item) => sum + item.currentPrice * (item.quantity ?? 1),
                0
            );
            return { totalAmount: amount };
        }, [order.orderProductList]);

        const shortOrderId = useMemo(() => order.id.substring(0, 12), [order.id]);
        const statusInfo = useMemo(
            () => getOrderStatusInfo(order.orderStatus),
            [order.orderStatus]
        );

        if (!statusInfo) return null;
        const StatusIcon = statusInfo.icon;

        return (
            <div className="bg-white rounded-3xl overflow-hidden border border-[#d2d2d7]/40 hover:border-[#d2d2d7] shadow-sm hover:shadow-md transition-all duration-300">
                {/* Order Header */}
                <button
                    onClick={() => {
                        if (onOpenDrawer) {
                            onOpenDrawer(order);
                        }
                    }}
                    className="w-full bg-[#fafafa] p-4 sm:p-5 border-b border-[#d2d2d7]/20 hover:bg-[#f5f5f7] transition-colors cursor-pointer text-left"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        {/* Left Side: Icon & Order ID */}
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="bg-white border border-[#d2d2d7]/40 p-2 rounded-xl shrink-0">
                                <Package className="w-5 h-5 text-[#b76e79]" />
                            </div>
                            <div className="text-left flex-1 sm:flex-none">
                                <p className="text-[10px] uppercase tracking-wider font-semibold text-[#86868b]">
                                    Sipariş Numarası
                                </p>
                                <p className="font-semibold text-[#1d1d1f] text-sm tracking-wide mt-0.5">
                                    #{shortOrderId}
                                </p>
                            </div>
                        </div>

                        {/* Right Side: Status & Price */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                            {/* Status Badge */}
                            <div
                                className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${statusInfo.bgColor} border border-neutral-100 w-fit`}
                            >
                                <StatusIcon className={`w-3.5 h-3.5 ${statusInfo.color}`} />
                                <span className={`text-xs font-semibold ${statusInfo.color}`}>
                                    {statusInfo.label}
                                </span>
                            </div>

                            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                                {/* Price */}
                                <div className="text-left sm:text-right bg-white border border-[#d2d2d7]/40 px-3 py-1.5 rounded-xl flex-1 sm:flex-none">
                                    <p className="text-[9px] uppercase tracking-wider font-semibold text-[#86868b] whitespace-nowrap">
                                        Toplam Tutar
                                    </p>
                                    <p className="text-base font-semibold text-[#1d1d1f] mt-0.5">
                                        {formatPrice(totalAmount)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </button>
            </div>
        );
    }
);

OrderCard.displayName = "OrderCard";

const MyOrdersClient = () => {
    const [myOrders, setMyOrders] = useState<OrderType[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewOrder, setReviewOrder] = useState<OrderType | null>(null);
    const [reviewProductId, setReviewProductId] = useState<string | undefined>(
        undefined
    );
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerOrder, setDrawerOrder] = useState<OrderType | null>(null);

    useEffect(() => {
        let mounted = true;

        const getMyOrders = async () => {
            try {
                setLoading(true);
                const res = await getMyOrderApi();
                if (res && mounted) {
                    setMyOrders(res.data);
                }
            } catch (error) {
                console.error("Siparişler alınırken hata oluştu:", error);
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        getMyOrders();

        return () => {
            mounted = false;
        };
    }, []);

    const formatPrice = useCallback((price: number) => {
        return priceFormatter.format(price);
    }, []);

    // Order action handler
    const handleOrderAction = useCallback(
        (order: OrderType, status: OrderStatus) => {
            switch (status) {
                case "PAYMENT_PENDING":
                    setSelectedOrder(order);
                    setCancelModalOpen(true);
                    break;

                case "PAYMENT_CONFIRMED":
                    // Sipariş iptal talebi modal aç
                    setSelectedOrder(order);
                    setCancelModalOpen(true);
                    break;

                case "DELIVERED":
                    setSelectedOrder(order);
                    setCancelModalOpen(true);
                    break;

                case "GETTING_READY":
                    // Hazırlık aşamasında özel işlemler
                    console.log(`Hazırlanan sipariş: ${order.id}`);
                    break;

                case "SHIPPED":
                    // Kargo takibi
                    console.log(`Kargo takip ediliyor: ${order.id}`);
                    // TODO: Open tracking page
                    break;

                case "RETURN_REQUESTED":
                    // İade durumu kontrol
                    console.log(`İade talebi durumu kontrol ediliyor: ${order.id}`);
                    break;

                case "RETURN_APPROVED":
                    // İade onaylandı bilgisi
                    console.log(`İade onaylandı: ${order.id}`);
                    break;

                case "RETURN_REJECTED":
                    // İade reddedildi bilgisi
                    console.log(`İade reddedildi: ${order.id}`);
                    break;

                case "DELIVERY_FAILED":
                    // Teslimat başarısız durumu
                    console.log(`Teslimat başarısız: ${order.id}`);
                    // TODO: Contact support or retry delivery
                    break;

                case "CANCELLED":
                    // İptal edilmiş sipariş
                    console.log(`İptal edilmiş sipariş: ${order.id}`);
                    break;

                default:
                    console.log(`Bilinmeyen durum: ${status} - ${order.id}`);
            }
        },
        []
    );

    // Cancel order request handler
    const handleCancelOrderSubmit = async (orderId: string, reason: string) => {
        try {
            await cancelOrderRequestApi(orderId, reason);
            alert("İptal talebiniz başarıyla gönderildi.");
            // Reload orders
            const res = await getMyOrderApi();
            if (res) {
                setMyOrders(res.data);
            }
        } catch (error) {
            console.error("İptal talebi gönderilirken hata oluştu:", error);
            alert(
                "İptal talebi gönderilirken bir hata oluştu. Lütfen tekrar deneyin."
            );
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid gap-6">
                    <OrderSkeleton />
                    <OrderSkeleton />
                </div>
            </div>
        );
    }

    if (myOrders.length === 0) {
        return (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#d2d2d7]">
                <div className="w-12 h-12 bg-[#fafafa] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#d2d2d7]/50">
                    <ShoppingBag className="w-5 h-5 text-[#86868b]" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Henüz Siparişiniz Bulunmuyor
                </h3>
                <p className="text-sm text-[#86868b] mb-6 max-w-sm mx-auto">
                    İlk siparişinizi vererek alışverişe başlayın ve avantajlı fırsatları kaçırmayın!
                </p>
                <a
                    href="/products"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1d1d1f] hover:bg-neutral-800 text-white text-xs font-semibold shadow-sm transition-all select-none active:scale-[0.98]"
                >
                    Ürünleri İncele
                </a>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight text-[#1d1d1f]">
                        Siparişlerim
                    </h2>
                    <p className="text-xs text-[#86868b] mt-1">
                        Toplam <span className="font-semibold text-[#b76e79]">{myOrders.length}</span> siparişiniz bulunuyor
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {myOrders.map((order) => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        formatPrice={formatPrice}
                        onOpenDrawer={(o) => {
                            setDrawerOrder(o);
                            setDrawerOpen(true);
                        }}
                    />
                ))}
            </div>

            {/* Cancel Order Modal */}
            {selectedOrder && (
                <CancelOrderModal
                    isOpen={cancelModalOpen}
                    onClose={() => {
                        setCancelModalOpen(false);
                        setSelectedOrder(null);
                    }}
                    order={selectedOrder}
                    onSubmit={handleCancelOrderSubmit}
                />
            )}
            {/* Product Review Modal */}
            {reviewOrder && reviewProductId && (
                <ProductReviewModal
                    isOpen={reviewModalOpen}
                    onClose={() => {
                        setReviewModalOpen(false);
                        setReviewOrder(null);
                        setReviewProductId(undefined);
                    }}
                    order={reviewOrder}
                    productId={reviewProductId}
                    onSubmitted={async () => {
                        const res = await getMyOrderApi();
                        if (res) setMyOrders(res.data);
                    }}
                />
            )}
            {/* Order Drawer */}
            {drawerOrder && (
                <OrderDrawer
                    order={drawerOrder}
                    isOpen={drawerOpen}
                    onClose={() => {
                        setDrawerOpen(false);
                        setDrawerOrder(null);
                    }}
                    onActionClick={handleOrderAction}
                    onReviewClick={(o, productId) => {
                        setReviewOrder(o);
                        setReviewProductId(productId);
                        setReviewModalOpen(true);
                    }}
                />
            )}
        </div>
    );
};

export default MyOrdersClient;
