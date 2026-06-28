"use client";

import { User, Mail, Camera } from "lucide-react";
import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ModalComponent from "@/components/ModalCompanent";
import ImageCropper from "@/components/common/ImageCropper";
import { updateUserAvatarApi } from "@/Api/controllers/UserController";
import MyAddress from "@/components/MyAddress";
import MyOrders from "@/components/MyOrders";
import MyFavorites from "@/components/MyFavorites";
import MyProfile from "@/components/MyProfile";
import { getFileUrl } from "@/utils/file";
import Link from "next/link";

interface DashboardClientProps {
    initialTab: string;
}

const DashboardClient = ({ initialTab }: DashboardClientProps) => {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const activeTab = initialTab;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Giriş yapılmamışsa login sayfasına yönlendir
    if (!isAuthenticated || !user) {
        return (
            <div className="flex flex-col items-center justify-center py-16 bg-white border border-[#d2d2d7]/40 rounded-3xl p-8 max-w-md mx-auto text-center shadow-sm">
                <p className="text-[#86868b] mb-6 text-sm">Hesabınıza erişmek ve siparişlerinizi görüntülemek için lütfen giriş yapın.</p>
                <Link
                    href="/login"
                    className="bg-[#1d1d1f] hover:bg-neutral-800 text-white px-8 py-3 rounded-full text-sm font-semibold transition-all active:scale-[0.98]"
                >
                    Giriş Yap
                </Link>
            </div>
        );
    }

    // Resim seçildiğinde
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImage(reader.result as string);
                setIsModalOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const blobToFile = (theBlob: Blob, fileName: string): File => {
        return new File([theBlob], fileName, { type: theBlob.type });
    };

    // Kırpma tamamlandığında
    const handleCropComplete = async (
        croppedImageBlob: Blob,
        _croppedImageUrl: string
    ) => {
        setIsUploading(true);
        try {
            // FormData ile resmi backend'e gönder
            const formData = new FormData();
            formData.append("file", blobToFile(croppedImageBlob, "avatar.png"));

            // Örnek: /api/users/:id/avatar endpointine gönderim
            const response = await updateUserAvatarApi(formData);
            if (response) {
                const currentUser = localStorage.getItem("currentUser");
                if (currentUser) {
                    let userData = JSON.parse(currentUser);
                    userData.avatar = response.data;
                    localStorage.setItem("currentUser", JSON.stringify(userData));
                    window.location.reload();
                }
            }

            setSelectedImage(null);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Profil resmi güncellenirken hata oluştu:", error);
            alert("Profil resmi güncellenirken bir hata oluştu.");
        } finally {
            setIsUploading(false);
        }
    };

    // Modal kapatıldığında
    const handleModalClose = () => {
        setSelectedImage(null);
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Kullanıcı Bilgileri */}
                <div className="lg:col-span-1">
                    <div className="bg-white border border-[#d2d2d7]/40 rounded-3xl p-6 shadow-sm">
                        <div className="text-center mb-6">
                            <div className="relative inline-block">
                                {user.avatar ? (
                                    <img
                                        src={getFileUrl(user.avatar)}
                                        alt={user.firstName + " " + user.lastName}
                                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-4 object-cover ring-2 ring-neutral-100"
                                    />
                                ) : (
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#b76e79] to-[#a35d68] rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-sm ring-2 ring-neutral-100">
                                        <User className="w-10 h-10 sm:w-12 sm:h-12 text-white/90" />
                                    </div>
                                )}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-4 right-0 bg-[#1d1d1f] hover:bg-neutral-800 text-white rounded-full p-2.5 shadow-md transition transform hover:scale-105"
                                    title="Profil resmini değiştir"
                                >
                                    <Camera className="w-4 h-4" />
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                            </div>
                            <h2 className="text-lg font-semibold tracking-tight text-[#1d1d1f]">
                                {user.firstName + " " + user.lastName}
                            </h2>
                        </div>

                        <div className="space-y-4 mt-6 pt-6 border-t border-[#d2d2d7]/40">
                            <div className="flex items-center space-x-3 text-[#1d1d1f] bg-[#fafafa] p-3.5 rounded-2xl border border-[#d2d2d7]/20">
                                <Mail className="w-4 h-4 text-[#86868b] shrink-0" />
                                <span className="text-xs sm:text-sm font-medium break-all text-[#86868b]">{user.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* İçerik alanı: Sekmeli menü */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-[#d2d2d7]/40 rounded-3xl shadow-sm overflow-hidden">
                        {/* Tabs */}
                        <div className="border-b border-[#d2d2d7]/40 overflow-x-auto scrollbar-hide">
                            <nav className="flex min-w-full px-4 sm:px-6" aria-label="Tabs">
                                <div className="flex gap-6 sm:gap-8">
                                    {[
                                        { id: "orders", label: "Siparişlerim" },
                                        { id: "addresses", label: "Adreslerim" },
                                        { id: "favorites", label: "Favorilerim" },
                                        { id: "profile", label: "Profil Bilgilerim" },
                                    ].map((tab) => {
                                        const isActive = activeTab === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => router.push(`/dashboard?tab=${tab.id}`)}
                                                className={`whitespace-nowrap py-4 text-sm font-semibold border-b-2 transition-all duration-200 ${
                                                    isActive
                                                        ? "border-[#b76e79] text-[#b76e79]"
                                                        : "border-transparent text-[#86868b] hover:text-[#1d1d1f] hover:border-[#d2d2d7]"
                                                }`}
                                            >
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </nav>
                        </div>

                        <div className="p-4 sm:p-6 bg-white">
                            {activeTab === "orders" && <MyOrders />}
                            {activeTab === "addresses" && <MyAddress />}
                            {activeTab === "favorites" && <MyFavorites />}
                            {activeTab === "profile" && <MyProfile />}
                        </div>
                    </div>
                </div>
            </div>

            <ModalComponent
                isOpen={isModalOpen}
                onClose={handleModalClose}
                title={selectedImage ? "Profil Resmini Kırp" : "Profil Resmi"}
            >
                {selectedImage ? (
                    <ImageCropper
                        imageSrc={selectedImage}
                        onCropComplete={handleCropComplete}
                        onCancel={handleModalClose}
                        isLoading={isUploading}
                    />
                ) : (
                    <div className="text-center py-8">
                        <p className="text-[#86868b] text-sm">Profil resmi seçilmedi</p>
                    </div>
                )}
            </ModalComponent>
        </>
    );
};

export default DashboardClient;
