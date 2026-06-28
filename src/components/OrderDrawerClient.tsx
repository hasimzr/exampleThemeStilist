"use client";
import React, { useMemo } from "react";
import ModalComponent from "./ModalCompanent";
import { Package, ShoppingBag, MapPin, RotateCcw, Clock } from "lucide-react";
import type { OrderType } from "./MyOrdersClient";

type OrderStatus = OrderType["orderStatus"];

const priceFormatter = new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
});

const getOrderStatusInfo = (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, any> = {
        PAYMENT_PENDING: {
            label: "Ödeme Bekleniyor",
            color: "text-amber-700",
            bgColor: "bg-amber-100",
            icon: Clock,
            action: {
                textColor: "text-red-700",
                bg: "bg-red-100",
                label: "Sipariş İptal Talebi Oluştur",
                icons: RotateCcw,
            },
        },
        PAYMENT_CONFIRMED: {
            label: "Sipariş Alındı",
            color: "text-green-700",
            bgColor: "bg-green-100",
            icon: Package,
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
            color: "text-cyan-700",
            bgColor: "bg-cyan-100",
            icon: Package,
            action: null,
        },
        DELIVERED: {
            label: "Teslim Edildi",
            color: "text-green-700",
            bgColor: "bg-green-100",
            icon: Package,
            action: {
                textColor: "text-red-700",
                bg: "bg-red-100",
                label: "Sipariş İade Talebi Oluştur",
                icons: RotateCcw,
            },
        },
        RETURN_REQUESTED: {
            label: "İade Talebi Alındı",
            color: "text-orange-700",
            bgColor: "bg-orange-100",
            icon: RotateCcw,
            action: null,
        },
        RETURN_APPROVED: {
            label: "İade Onaylandı",
            color: "text-teal-700",
            bgColor: "bg-teal-100",
            icon: Package,
            action: null,
        },
        RETURN_REJECTED: {
            label: "İade Reddedildi",
            color: "text-red-700",
            bgColor: "bg-red-100",
            icon: RotateCcw,
            action: null,
        },
        DELIVERY_FAILED: {
            label: "Teslimat Başarısız",
            color: "text-red-800",
            bgColor: "bg-red-100",
            icon: RotateCcw,
            action: null,
        },
        PAYMENT_FAIL: {
            label: "Ödeme Başarısız",
            color: "text-red-700",
            bgColor: "bg-red-100",
            icon: RotateCcw,
            action: null,
        },
        CANCELLED: {
            label: "İptal Edildi",
            color: "text-gray-700",
            bgColor: "bg-gray-100",
            icon: RotateCcw,
            action: null,
        },
    };
    return statusMap[status];
};

export interface OrderDrawerProps {
    order: OrderType | null;
    isOpen: boolean;
    onClose: () => void;
    onActionClick: (order: OrderType, status: OrderStatus) => void;
    onReviewClick: (order: OrderType, productId: string) => void;
}

const OrderDrawerClient: React.FC<OrderDrawerProps> = ({
    order,
    isOpen,
    onClose,
    onActionClick,
    onReviewClick,
}) => {
    const statusInfo = useMemo(
        () => (order ? getOrderStatusInfo(order.orderStatus) : null),
        [order]
    );

    const paymentMethodLabels: Record<
        NonNullable<OrderType["paymentMethod"]>,
        string
    > = {
        creditCard: "Kredi Kartı",
        cashOnDelivery: "Kapıda Ödeme",
        bankTransfer: "Havale/EFT",
    };

    const copyText = async (text?: string | null) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            alert("Kopyalandı");
        } catch (err) {
            console.error("Kopyalama başarısız", err);
        }
    };

    if (!order) return null;
    const totalAmount = order.orderProductList.reduce(
        (sum, item) => sum + item.currentPrice * (item.quantity || 1),
        0
    );
    const totalItems = order.orderProductList.reduce(
        (sum, item) => sum + (item.quantity || 1),
        0
    );
    const showActions =
        order.orderStatus === "DELIVERED" || (statusInfo && statusInfo.action);

    return (
        <ModalComponent
            isOpen={isOpen}
            onClose={onClose}
            title={`Sipariş #${order.id.substring(0, 12)}`}
            variant="drawer"
            persistent={false}
            drawerWidthClass="w-full max-w-xl"
            showCloseButton={true}
            closeOnOverlayClick={true}
        >
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto pr-1 space-y-6">
                    {/* Status + Total */}
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        {statusInfo && (
                            <div
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${statusInfo.bgColor}`}
                            >
                                {React.createElement(statusInfo.icon, {
                                    className: `w-4 h-4 ${statusInfo.color}`,
                                })}
                                <span className={`text-sm font-semibold ${statusInfo.color}`}>
                                    {statusInfo.label}
                                </span>
                            </div>
                        )}
                        <div className="ml-auto text-right">
                            <p className="text-xs text-gray-500">Toplam Tutar</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {priceFormatter.format(totalAmount)}
                            </p>
                        </div>
                    </div>

                    {/* Payment info */}
                    <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-200 space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">
                                Ödeme Yöntemi:
                            </span>
                            {order.paymentMethod && (
                                <span className="px-3 py-1 rounded-lg bg-white text-cyan-700 font-semibold text-sm">
                                    {paymentMethodLabels[order.paymentMethod] ||
                                        order.paymentMethod}
                                </span>
                            )}
                        </div>

                        {order.paymentMethod === "bankTransfer" && (
                            <div className="space-y-3">
                                {order.orderStatus === "PAYMENT_PENDING" && (
                                    <div className="p-3 rounded-lg bg-amber-100 border border-amber-200 text-amber-800 text-sm font-semibold">
                                        Ödeme yapmadıysanız lütfen aşağıdaki banka hesabına
                                        havale/EFT işlemini tamamlayın ve dekontu bizimle paylaşın.
                                    </div>
                                )}

                                <div className="p-3 rounded-lg bg-white border border-cyan-100 shadow-sm space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <div>
                                            <p className="text-xs text-gray-500">Banka Adı</p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {order.selectedBankName || "Banka bilgisi iletilmedi"}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Hesap Sahibi</p>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {order.selectedBankAccount || "Hesap bilgisi iletilmedi"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <p className="text-xs text-gray-500">IBAN</p>
                                            <p className="text-sm font-semibold text-gray-900 break-all">
                                                {order.selectedBankIban || "IBAN paylaşılmadı"}
                                            </p>
                                        </div>
                                        {order.selectedBankIban && (
                                            <button
                                                onClick={() => copyText(order.selectedBankIban)}
                                                className="px-3 py-2 rounded-lg bg-cyan-600 text-white text-xs font-semibold hover:bg-cyan-700 transition-colors"
                                                type="button"
                                            >
                                                Kopyala
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Messages */}
                    {order.orderMessageList && order.orderMessageList.length > 0 && (
                        <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-cyan-600" /> Sipariş Mesajları
                                <span className="text-xs font-semibold text-cyan-700 bg-cyan-100 px-2.5 py-1 rounded-full">
                                    {order.orderMessageList.length} Mesaj
                                </span>
                            </h3>
                            <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-1">
                                {order.orderMessageList.map((msg, index) => {
                                    const info = getOrderStatusInfo(msg.orderStatus);
                                    const messageDate = new Date(msg.createdTime);
                                    const formattedDate = messageDate.toLocaleDateString(
                                        "tr-TR",
                                        {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        }
                                    );
                                    return (
                                        <div
                                            key={index}
                                            className={`p-3 rounded-xl border-2 shadow-sm transition-colors duration-200 ${msg.isAdminMessage
                                                ? "bg-white border-orange-200"
                                                : "bg-white border-cyan-200"
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${msg.isAdminMessage
                                                            ? "bg-orange-100 text-orange-700"
                                                            : "bg-cyan-100 text-cyan-700"
                                                            }`}
                                                    >
                                                        {msg.isAdminMessage ? "Yönetici" : "Müşteri"}
                                                    </div>
                                                    <div
                                                        className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold ${info.bgColor} ${info.color}`}
                                                    >
                                                        {React.createElement(info.icon, {
                                                            className: "w-3 h-3",
                                                        })}
                                                        {info.label}
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-gray-500 font-medium">
                                                    {formattedDate}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-800 leading-relaxed font-medium">
                                                {msg.message}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    {/* Address */}
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-cyan-600" /> Teslimat Adresi
                        </h3>
                        <p className="text-sm text-gray-800 font-semibold mb-1">
                            {order.fullName}
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {order.addressLine}, {order.district}, {order.city}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">📞 {order.phone}</p>
                    </div>
                    {/* Products */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-cyan-600" /> Ürünler
                            <span className="ml-auto text-sm font-semibold text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full">
                                {totalItems} Ürün
                            </span>
                        </h3>
                        <div className="space-y-3">
                            {order.orderProductList.map((item) => {
                                const itemTotal = item.currentPrice * (item.quantity || 1);
                                return (
                                    <div
                                        key={item.id}
                                        className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                                <img
                                                    src={
                                                        item.productDto.images?.find(
                                                            (img: any) => img.isTitle
                                                        )?.imgName || 
                                                        (item.productDto as any).img?.[0] || 
                                                        "/placeholder-product.jpg"
                                                    }
                                                    alt={item.productDto.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                                                    {item.productDto.title}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    {item.quantity || 1} Adet ×{" "}
                                                    {priceFormatter.format(item.currentPrice)}
                                                </p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-xs text-gray-500 mb-1">Toplam</p>
                                                <p className="text-lg font-bold text-gray-900">
                                                    {priceFormatter.format(itemTotal)}
                                                </p>
                                            </div>
                                        </div>
                                        {order.orderStatus === "DELIVERED" && (
                                            <div className="mt-3">
                                                <button
                                                    onClick={() => onReviewClick(order, item.id)}
                                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-300 to-yellow-400 text-yellow-900 font-semibold py-2.5 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-colors text-sm"
                                                >
                                                    ⭐ Değerlendir
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                {/* end scrollable content */}
                {/* Fixed Actions Footer */}
                {showActions && statusInfo && statusInfo.action && (
                    <div className="p-4 border-t border-gray-200 bg-white shadow-lg flex flex-col gap-3">
                        <button
                            onClick={() => onActionClick(order, order.orderStatus)}
                            className={`w-full flex items-center justify-center gap-2 ${statusInfo.action.bg} ${statusInfo.action.textColor} font-semibold py-3 rounded-xl hover:brightness-105 transition-colors`}
                        >
                            {statusInfo.action.label}
                        </button>
                    </div>
                )}
            </div>
        </ModalComponent>
    );
};

export default OrderDrawerClient;
