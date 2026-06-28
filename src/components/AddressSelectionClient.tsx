"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    getMyAddressesApi,
    myAddressesSaveApi,
} from "@/Api/controllers/UserController";
import type { Address } from "../types";
import { MapPin, Plus, CheckCircle2 } from "lucide-react";
import ModalComponent from "./ModalCompanent";
import AddressForm from "./AddressForm";

interface AddressSelectionClientProps {
    onComplete: (selectedAddress: Address) => void;
    orderData?: {
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        phone: string | null;
    };
    addresses: Address[];
    setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
    selectedAddress: Address | null;
    setSelectedAddress: React.Dispatch<React.SetStateAction<Address | null>>;
    initialAddresses?: Address[];
}

type FormState = Omit<Address, "userId"> & { id?: string | null };

const emptyForm: FormState = {
    type: "INDIVIDUAL",
    title: "",
    id: null,
    fullName: "",
    phone: "",
    city: "",
    district: "",
    neighborhood: "",
    addressLine: "",
    postalCode: "",
    companyName: "",
    taxOffice: "",
    taxNumber: "",
    tc: "",
    isDefault: false,
};

const AddressSelectionClient = ({
    onComplete,
    orderData,
    addresses,
    setAddresses,
    selectedAddress,
    setSelectedAddress,
    initialAddresses,
}: AddressSelectionClientProps) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(!initialAddresses);
    const [showAddModal, setShowAddModal] = useState(false);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const getMyAddresses = async () => {
        try {
            setLoading(true);
            const res = await getMyAddressesApi();
            if (res) {
                setAddresses(res.data);
                // Varsayılan adresi seç
                const defaultAddr = res.data.find((addr: Address) => addr.isDefault);
                if (defaultAddr) {
                    setSelectedAddress(defaultAddr);
                } else if (res.data.length > 0) {
                    setSelectedAddress(res.data[0]);
                }
            }
        } catch (error) {
            console.error("Adresler alınamadı", error);
        } finally {
            setLoading(false);
        }
    };

    // İlk yükleme ve user durumuna göre adresleri ayarla
    useEffect(() => {
        if (initialAddresses) {
            setAddresses(initialAddresses);
            setLoading(false);
        } else if (user) {
            getMyAddresses();
        } else {
            setLoading(false);
        }
    }, [user, initialAddresses]);

    // Kullanıcı giriş yapmışsa ve parent seçili adres göndermişse fetch sonrası eşleştir
    useEffect(() => {
        if (user && selectedAddress && addresses.length > 0) {
            const match = addresses.find((a) => a.id === selectedAddress.id);
            if (match && match !== selectedAddress) {
                setSelectedAddress(match);
            }
        }
    }, [user, selectedAddress, addresses]);

    const openAddModal = () => {
        setForm({
            ...emptyForm,
            fullName:
                orderData?.firstName && orderData?.lastName
                    ? `${orderData.firstName} ${orderData.lastName}`
                    : user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : "",
            phone: orderData?.phone || "",
        });
        setShowAddModal(true);
    };

    const validate = (): boolean => {
        const e: Record<string, string> = {};
        if (!form.title.trim()) e.title = "Zorunlu";
        if (!form.fullName.trim()) e.fullName = "Zorunlu";
        if (!form.phone.trim()) e.phone = "Zorunlu";
        if (!form.city.trim()) e.city = "Zorunlu";
        if (!form.district.trim()) e.district = "Zorunlu";
        if (!form.addressLine.trim()) e.addressLine = "Zorunlu";
        if (form.type === "CORPORATE") {
            if (!form.companyName?.trim()) e.companyName = "Zorunlu";
            if (!form.taxOffice?.trim()) e.taxOffice = "Zorunlu";
            if (!form.taxNumber?.trim()) e.taxNumber = "Zorunlu";
        }
        if (form.type === "INDIVIDUAL") {
            if (!form.tc?.trim()) e.tc = "Zorunlu";
            else if (form.tc.length !== 11) e.tc = "T.C. No 11 hane olmalı";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmitNewAddress = async () => {
        if (!validate()) return;

        try {
            if (user) {
                const res = await myAddressesSaveApi(form);
                if (res) {
                    setAddresses((prev) => {
                        const exists = prev.find((a) => a.id === res.data.id);
                        if (exists) {
                            return prev.map((a) => (a.id === res.data.id ? res.data : a));
                        }
                        return [...prev, res.data];
                    });
                    setSelectedAddress(res.data);
                    setShowAddModal(false);
                    setForm(emptyForm);
                    setErrors({});
                }
            } else {
                const newAddress: Address = {
                    ...form,
                    id: form.id || `temp-${Date.now()}`,
                    userId: 0,
                };
                setAddresses((prev) => {
                    const exists = prev.find((a) => a.id === newAddress.id);
                    if (exists) {
                        return prev.map((a) => (a.id === newAddress.id ? newAddress : a));
                    }
                    return [...prev, newAddress];
                });
                setSelectedAddress(newAddress);
                setShowAddModal(false);
                setForm(emptyForm);
                setErrors({});
            }
        } catch (error) {
            console.error("Adres eklenemedi/güncellenemedi", error);
        }
    };

    const handleContinue = () => {
        if (selectedAddress) {
            if (
                selectedAddress.type === "INDIVIDUAL" &&
                (!selectedAddress.tc || selectedAddress.tc.trim().length !== 11)
            ) {
                setForm({ ...selectedAddress });
                setShowAddModal(true);
                setErrors({ tc: "Fatura düzenlenebilmesi için geçerli bir T.C. Kimlik Numarası girmeniz gerekmektedir." });
                return;
            }
            onComplete(selectedAddress);
        }
    };

    return (
        <div className="lg:col-span-2">
            <div className="bg-white rounded-[32px] p-8 border border-[#f0e6df]/60 shadow-[0_15px_40px_rgba(183,110,121,0.03)]">
                <div className="flex items-center justify-between mb-6 pb-5 border-b border-[#f0e6df]/50">
                    <div>
                        <h2 className="text-lg font-extrabold text-[#2d2d2d] flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-[#b76e79]" />
                            Teslimat Adresi
                        </h2>
                        <p className="text-xs text-[#8a7e78] mt-1.5">
                            {user
                                ? "Siparişinizin teslim edileceği adresi seçin veya yeni adres ekleyin"
                                : "Siparişinizin teslim edileceği adresi ekleyin"}
                        </p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#b76e79] hover:bg-[#a35d68] text-white text-xs font-bold shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="font-bold">
                            {addresses.length > 0 ? "Yeni Adres" : "Adres Ekle"}
                        </span>
                    </button>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div
                                key={i}
                                className="animate-pulse bg-gray-100 rounded-lg h-32"
                            />
                        ))}
                    </div>
                ) : addresses.length === 0 ? (
                    <div className="text-center py-16 bg-[#fdf8f5] rounded-2xl border border-dashed border-[#f0e6df]">
                        <MapPin className="w-12 h-12 text-[#b76e79]/60 mx-auto mb-4" />
                        <p className="text-sm text-[#8a7e78] mb-6">
                            {user
                                ? "Henüz kayıtlı adresiniz yok"
                                : "Teslimat için adres bilgisi gerekiyor"}
                        </p>
                        <button
                            onClick={openAddModal}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#b76e79] hover:bg-[#a35d68] text-white text-xs font-bold shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <Plus className="w-5 h-5" />
                            {user ? "İlk Adresimi Ekle" : "Adres Ekle"}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {addresses.map((addr) => (
                                <div
                                    key={addr.id}
                                    onClick={() => setSelectedAddress(addr)}
                                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${selectedAddress?.id === addr.id
                                        ? "border-[#b76e79] bg-[#fdf8f5] shadow-[0_10px_25px_rgba(183,110,121,0.05)]"
                                        : "border-[#f0e6df]/70 bg-white hover:border-[#b76e79]/30 hover:shadow-[0_10px_25px_rgba(183,110,121,0.02)]"
                                        }`}
                                >
                                    {selectedAddress?.id === addr.id && (
                                        <div className="absolute top-4 right-4">
                                            <CheckCircle2 className="w-5 h-5 text-[#b76e79]" />
                                        </div>
                                    )}

                                    <div className="flex items-start gap-3 mb-3">
                                        <MapPin
                                            className={`w-5 h-5 shrink-0 mt-0.5 ${selectedAddress?.id === addr.id
                                                ? "text-[#b76e79]"
                                                : "text-[#8a7e78]/60"
                                                }`}
                                        />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <h3 className="font-bold text-base text-[#2d2d2d]">
                                                    {addr.title}
                                                </h3>
                                                {addr.isDefault && (
                                                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#b76e79] bg-[#fdf8f5] px-2 py-0.5 rounded-full border border-[#b76e79]/20">
                                                        Varsayılan
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs font-semibold text-[#8a7e78] mb-2 flex items-center gap-1">
                                                <span className="text-[#2d2d2d] font-bold">{addr.fullName}</span>
                                                <span className="text-[#f0e6df]">•</span>
                                                <span>{addr.phone}</span>
                                            </div>
                                            <p className="text-xs text-[#8a7e78] leading-relaxed">
                                                {addr.addressLine}
                                                {addr.neighborhood && `, ${addr.neighborhood}`},{" "}
                                                {addr.district}, {addr.city}
                                                {addr.postalCode && ` ${addr.postalCode}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-[#f0e6df]/50 hidden lg:block">
                            <button
                                onClick={handleContinue}
                                disabled={!selectedAddress}
                                className={`w-full py-3.5 rounded-full font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${selectedAddress
                                    ? "bg-[#b76e79] hover:bg-[#a35d68] text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                                    : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                                    }`}
                            >
                                <span>
                                    {selectedAddress
                                        ? "Bu Adrese Gönder"
                                        : "Lütfen bir adres seçin"}
                                </span>
                                {selectedAddress && (
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
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#f0e6df]/50 shadow-[0_-10px_30px_rgba(183,110,121,0.06)] z-50 lg:hidden">
                <button
                    onClick={handleContinue}
                    disabled={!selectedAddress}
                    className={`w-full py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all ${selectedAddress
                        ? "bg-[#b76e79] text-white shadow-md active:scale-[0.98] hover:bg-[#a35d68]"
                        : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                        }`}
                >
                    <span>
                        {selectedAddress ? "Bu Adrese Gönder" : "Lütfen bir adres seçin"}
                    </span>
                    {selectedAddress && (
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
                    )}
                </button>
            </div>

            <AddressForm
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setForm(emptyForm);
                    setErrors({});
                }}
                onSubmit={handleSubmitNewAddress}
                form={form}
                setForm={setForm}
                errors={errors}
                title={form.id ? "Adres Bilgilerini Güncelle" : "Yeni Teslimat Adresi"}
                submitText={form.id ? "Güncelle ve Devam Et" : "Adresi Kaydet"}
            />
        </div>
    );
};

export default AddressSelectionClient;
