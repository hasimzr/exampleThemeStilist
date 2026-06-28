"use client";
import React, { useRef } from "react";
import type { Address } from "../types";
import ModalComponent from "./ModalCompanent";

interface AddressFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    form: Omit<Address, "userId"> & { id?: string | null };
    setForm: React.Dispatch<React.SetStateAction<Omit<Address, "userId"> & { id?: string | null }>>;
    errors: Record<string, string>;
    title?: string;
    submitText?: string;
    showDefaultCheckbox?: boolean;
}

const AddressForm = ({
    isOpen,
    onClose,
    onSubmit,
    form,
    setForm,
    errors,
    title = "Yeni Teslimat Adresi",
    submitText = "Adresi Kaydet",
    showDefaultCheckbox = false,
}: AddressFormProps) => {
    const formRef = useRef<HTMLFormElement>(null);

    const handleFormSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (formRef.current && !formRef.current.reportValidity()) return;
        onSubmit();
    };

    return (
        <ModalComponent
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="lg"
            closeOnOverlayClick={false}
            footer={
                <div className="flex justify-end gap-3 p-4 border-t border-[#d2d2d7]/30">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-full border border-[#d2d2d7] hover:bg-[#f5f5f7] text-[#1d1d1f] text-sm font-semibold transition-colors select-none active:scale-[0.98]"
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleFormSubmit}
                        className="px-6 py-2.5 rounded-full bg-[#1d1d1f] hover:bg-neutral-800 text-white text-sm font-semibold shadow-sm transition-all select-none active:scale-[0.98]"
                    >
                        {submitText}
                    </button>
                </div>
            }
        >
            <form
                ref={formRef}
                onSubmit={handleFormSubmit}
                className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 sm:p-6"
                autoComplete="off"
            >
                <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                        Adres Başlığı <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={form.title}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, title: e.target.value }))
                        }
                        className={`w-full px-4 py-3 rounded-xl border ${errors.title ? "border-red-400" : "border-[#d2d2d7]"
                            } focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 text-sm transition-all bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60`}
                        placeholder="Ev, İş..."
                        required
                        autoComplete="off"
                    />
                    {errors.title && (
                        <p className="text-xs text-red-650 mt-1 font-medium">{errors.title}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                        Ad Soyad <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={form.fullName}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, fullName: e.target.value }))
                        }
                        className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? "border-red-400" : "border-[#d2d2d7]"
                            } focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 text-sm transition-all bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60`}
                        placeholder="Ad Soyad"
                        required
                        autoComplete="name"
                    />
                    {errors.fullName && (
                        <p className="text-xs text-red-650 mt-1 font-medium">{errors.fullName}</p>
                    )}
                </div>

                <div className="sm:col-span-2">
                    <span className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                        Adres Türü
                    </span>
                    <div className="flex items-center gap-3">
                        <label
                            className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-xl cursor-pointer select-none transition-all duration-200 ${form.type === "INDIVIDUAL"
                                ? "border-[#b76e79] bg-[#b76e79]/5 text-[#b76e79]"
                                : "border-[#d2d2d7] hover:bg-gray-50 text-neutral-600"
                                }`}
                        >
                            <input
                                type="radio"
                                name="addrType"
                                value="INDIVIDUAL"
                                checked={form.type === "INDIVIDUAL"}
                                className="w-4 h-4 accent-[#b76e79] pointer-events-none"
                                onChange={() =>
                                    setForm((f) => ({ ...f, type: "INDIVIDUAL" }))
                                }
                            />
                            <span className="text-xs font-semibold">Bireysel</span>
                        </label>
                        <label
                            className={`inline-flex items-center gap-2 px-4 py-2.5 border rounded-xl cursor-pointer select-none transition-all duration-200 ${form.type === "CORPORATE"
                                ? "border-[#b76e79] bg-[#b76e79]/5 text-[#b76e79]"
                                : "border-[#d2d2d7] hover:bg-gray-50 text-neutral-600"
                                }`}
                        >
                            <input
                                type="radio"
                                name="addrType"
                                value="CORPORATE"
                                checked={form.type === "CORPORATE"}
                                className="w-4 h-4 accent-[#b76e79] pointer-events-none"
                                onChange={() => setForm((f) => ({ ...f, type: "CORPORATE" }))}
                            />
                            <span className="text-xs font-semibold">Kurumsal</span>
                        </label>
                    </div>
                </div>

                {form.type === "INDIVIDUAL" && (
                    <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                            T.C. Kimlik Numarası <span className="text-red-500">*</span>
                        </label>
                        <input
                            value={form.tc || ""}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "").slice(0, 11);
                                setForm((f) => ({ ...f, tc: val }));
                            }}
                            className={`w-full px-4 py-3 rounded-xl border ${errors.tc ? "border-red-400" : "border-[#d2d2d7]"
                                } focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 text-sm transition-all bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60`}
                            placeholder="11 haneli T.C. Kimlik Numarası"
                            inputMode="numeric"
                            required
                            autoComplete="off"
                        />
                        <p className="text-[11px] text-[#86868b] mt-1.5 font-medium">
                            * Fatura düzenlenebilmesi için T.C. kimlik numaranız gereklidir.
                        </p>
                        {errors.tc && (
                            <p className="text-xs text-red-650 mt-1 font-medium">{errors.tc}</p>
                        )}
                    </div>
                )}

                <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                        Telefon <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={form.phone}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, phone: e.target.value }))
                        }
                        className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? "border-red-400" : "border-[#d2d2d7]"
                            } focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 text-sm transition-all bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60`}
                        placeholder="05xx xxx xx xx"
                        required
                        inputMode="tel"
                        autoComplete="tel"
                    />
                    {errors.phone && (
                        <p className="text-xs text-red-650 mt-1 font-medium">{errors.phone}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                        Şehir <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={form.city}
                        onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.city ? "border-red-400" : "border-[#d2d2d7]"
                            } focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 text-sm transition-all bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60`}
                        placeholder="Şehir"
                        required
                        autoComplete="address-level1"
                    />
                    {errors.city && (
                        <p className="text-xs text-red-650 mt-1 font-medium">{errors.city}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                        İlçe <span className="text-red-500">*</span>
                    </label>
                    <input
                        value={form.district}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, district: e.target.value }))
                        }
                        className={`w-full px-4 py-3 rounded-xl border ${errors.district ? "border-red-400" : "border-[#d2d2d7]"
                            } focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 text-sm transition-all bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60`}
                        placeholder="İlçe"
                        required
                        autoComplete="address-level2"
                    />
                    {errors.district && (
                        <p className="text-xs text-red-650 mt-1 font-medium">{errors.district}</p>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                        Mahalle (opsiyonel)
                    </label>
                    <input
                        value={form.neighborhood}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, neighborhood: e.target.value }))
                        }
                        className="w-full px-4 py-3 rounded-xl border border-[#d2d2d7] focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 text-sm transition-all bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60"
                        placeholder="Mahalle"
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                        Adres <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={form.addressLine}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, addressLine: e.target.value }))
                        }
                        className={`w-full px-4 py-3 rounded-xl border ${errors.addressLine ? "border-red-400" : "border-[#d2d2d7]"
                            } focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 text-sm transition-all bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60 resize-none`}
                        rows={3}
                        required
                        placeholder="Sokak/Cadde, No, Daire vs."
                        autoComplete="street-address"
                    />
                    {errors.addressLine && (
                        <p className="text-xs text-red-650 mt-1 font-medium">{errors.addressLine}</p>
                    )}
                </div>

                {form.type === "CORPORATE" && (
                    <>
                        <div className="sm:col-span-2 mt-2 pt-2 border-t border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-800">
                                Fatura Bilgileri
                            </h4>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                                Firma Ünvanı <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={form.companyName}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, companyName: e.target.value }))
                                }
                                className={`w-full px-4 py-3 rounded-xl border ${errors.companyName ? "border-red-400" : "border-[#d2d2d7]"
                                    } focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 text-sm transition-all bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60`}
                                placeholder="Şirket adı"
                                required={form.type === "CORPORATE"}
                            />
                            {errors.companyName && (
                                <p className="text-xs text-red-650 mt-1 font-medium">
                                    {errors.companyName}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                                Vergi Dairesi <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={form.taxOffice}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, taxOffice: e.target.value }))
                                }
                                className={`w-full px-4 py-3 rounded-xl border ${errors.taxOffice ? "border-red-400" : "border-[#d2d2d7]"
                                    } focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 text-sm transition-all bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60`}
                                placeholder="Vergi dairesi"
                                required={form.type === "CORPORATE"}
                            />
                            {errors.taxOffice && (
                                <p className="text-xs text-red-650 mt-1 font-medium">
                                    {errors.taxOffice}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                                Vergi Numarası <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={form.taxNumber}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, taxNumber: e.target.value }))
                                }
                                className={`w-full px-4 py-3 rounded-xl border ${errors.taxNumber ? "border-red-400" : "border-[#d2d2d7]"
                                    } focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 text-sm transition-all bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60`}
                                placeholder="Vergi numarası"
                                inputMode="numeric"
                                required={form.type === "CORPORATE"}
                            />
                            {errors.taxNumber && (
                                <p className="text-xs text-red-650 mt-1 font-medium">
                                    {errors.taxNumber}
                                </p>
                            )}
                        </div>
                    </>
                )}

                <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                        Posta Kodu (opsiyonel)
                    </label>
                    <input
                        value={form.postalCode}
                        onChange={(e) =>
                            setForm((f) => ({ ...f, postalCode: e.target.value }))
                        }
                        className="w-full px-4 py-3 rounded-xl border border-[#d2d2d7] focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 text-sm transition-all bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60"
                        placeholder="00000"
                        inputMode="numeric"
                        autoComplete="postal-code"
                    />
                </div>

                {showDefaultCheckbox && (
                    <div className="flex items-center gap-2 sm:col-span-2 mt-1 select-none">
                        <input
                            id="isDefault"
                            type="checkbox"
                            checked={!!form.isDefault}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, isDefault: e.target.checked }))
                            }
                            className="w-4 h-4 rounded border-gray-300 accent-[#b76e79] cursor-pointer"
                        />
                        <label htmlFor="isDefault" className="text-xs font-semibold text-neutral-500 uppercase tracking-wider cursor-pointer">
                            Varsayılan adres yap
                        </label>
                    </div>
                )}
            </form>
        </ModalComponent>
    );
};

export default AddressForm;
