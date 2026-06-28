"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Package, Users, TrendingUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { Product } from "@/types";
import { getProductMainImage } from "@/utils/product";

interface AdminPanelClientProps {
    initialProducts?: Product[];
}

const AdminPanelClient = ({ initialProducts = [] }: AdminPanelClientProps) => {
    const { user, isAdmin } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"products" | "orders" | "stats">(
        "products"
    );
    const [productList] = useState<Product[]>(initialProducts);

    // Redirect if not admin
    useEffect(() => {
        if (user !== undefined && (!isAdmin || !user)) {
            // Small timeout to allow auth to initialize if it's slow
            const timer = setTimeout(() => {
                if (!isAdmin || !user) {
                    router.push("/login");
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isAdmin, user, router]);

    if (!user || !isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const totalProducts = productList.length;

    return (
        <>
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab("stats")}
                        className={`flex-1 px-6 py-4 font-semibold transition ${activeTab === "stats"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        İstatistikler
                    </button>
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`flex-1 px-6 py-4 font-semibold transition ${activeTab === "products"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Ürünler
                    </button>
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`flex-1 px-6 py-4 font-semibold transition ${activeTab === "orders"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Siparişler
                    </button>
                </div>
            </div>

            {/* İstatistikler */}
            {activeTab === "stats" && (
                <div className="animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Toplam Gelir</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">₺0</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Toplam Ürün</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {totalProducts}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Package className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Toplam Sipariş</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Users className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* En Çok Satan Ürünler */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            Popüler Ürünler
                        </h2>
                        {productList.length > 0 ? (
                            <div className="space-y-4">
                                {productList.slice(0, 5).map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={getProductMainImage(product)}
                                                alt={product.title}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {product.title}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {product.subcategory || "Ürün"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">
                                                ₺{parseFloat(product.price).toLocaleString("tr-TR")}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Stok: {product.stock}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">
                                Henüz ürün bulunmuyor.
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Ürünler Tablosu */}
            {activeTab === "products" && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                        Ürün
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                        Kategori
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                        Fiyat
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                        Stok
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                        İşlemler
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {productList.length > 0 ? (
                                    productList.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <img
                                                        src={getProductMainImage(product)}
                                                        alt={product.title}
                                                        className="w-12 h-12 object-cover rounded"
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            {product.title}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            ID: {product.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-700">
                                                {product.subcategory || "Ürün"}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-900">
                                                ₺{parseFloat(product.price).toLocaleString("tr-TR")}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2 py-1 rounded text-sm font-semibold ${product.stock > 20
                                                        ? "bg-green-100 text-green-800"
                                                        : product.stock > 0
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {product.stock}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            alert(
                                                                "Düzenleme özelliği yakında eklenecek (Mock)"
                                                            )
                                                        }
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                                                        title="Düzenle"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            alert("Silme özelliği yakında eklenecek (Mock)")
                                                        }
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                                                        title="Sil"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-6 py-10 text-center text-gray-500"
                                        >
                                            Ürün listesi boş.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Siparişler Tablosu */}
            {activeTab === "orders" && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                        Sipariş No
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                        Tarih
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                        Müşteri
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                        Toplam
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                                        Durum
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-10 text-center text-gray-500"
                                    >
                                        Henüz sipariş bulunmuyor.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminPanelClient;
