"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { LoginUser } from "@/Api/controllers/UserController";

export interface GuestInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

export interface LoginOrUserDataEntryProps {
    onComplete: (userInfo: GuestInfo | null) => void;
    orderData: {
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        phone: string | null;
    };
    setOrderData: (data: any) => void;
    isGuest: boolean;
    setIsGuest: (value: boolean) => void;
}

const LoginOrUserDataEntryClient = ({
    onComplete,
    orderData,
    setOrderData,
    isGuest,
    setIsGuest,
}: LoginOrUserDataEntryProps) => {
    const { user } = useAuth();
    const [identifier, setIdentifier] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [loginSuccess, setLoginSuccess] = useState(false);

    const [guestErrors, setGuestErrors] = useState<
        Partial<Record<keyof GuestInfo, string>>
    >({});

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError("");

        if (!identifier || !loginPassword) {
            setLoginError("Lütfen tüm alanları doldurun");
            return;
        }

        try {
            const res = await LoginUser({ identifier, password: loginPassword });
            if (res) {
                localStorage.setItem("currentUser", JSON.stringify(res.data));
                setOrderData({
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    email: res.data.email,
                    phone: res.data.phoneNumber,
                });
                setLoginSuccess(true);
                setTimeout(() => {
                    onComplete(null);
                }, 500);
            }
        } catch (error) {
            setLoginError("E-posta/telefon veya şifre hatalı!");
        }
    };

    const validateGuestForm = (): boolean => {
        const errors: Partial<Record<keyof GuestInfo, string>> = {};

        if (!orderData.firstName?.trim()) errors.firstName = "Ad gerekli";
        if (!orderData.lastName?.trim()) errors.lastName = "Soyad gerekli";
        if (!orderData.email?.trim()) {
            errors.email = "E-posta gerekli";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderData.email)) {
            errors.email = "Geçerli bir e-posta adresi girin";
        }
        if (!orderData.phone?.trim()) {
            errors.phone = "Telefon gerekli";
        } else if (!/^[0-9]{10,11}$/.test(orderData.phone.replace(/\s/g, ""))) {
            errors.phone = "Geçerli bir telefon numarası girin (10-11 rakam)";
        }

        setGuestErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleGuestContinue = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateGuestForm()) {
            onComplete(null);
        }
    };

    if (user) {
        return (
            <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-green-900">
                                    {user.firstName} {user.lastName} olarak giriş yaptınız
                                </h3>
                                <p className="text-sm text-green-700 mt-1">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
                <div className="flex gap-1 mb-8 bg-gray-50 rounded-xl p-1.5 border border-gray-200">
                    <button
                        onClick={() => setIsGuest(false)}
                        className={`flex-1 py-3.5 px-6 rounded-lg font-semibold transition-all duration-300 ${!isGuest
                                ? "bg-white text-cyan-600 shadow-md transform scale-[1.02]"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
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
                                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                />
                            </svg>
                            <span>Giriş Yap</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setIsGuest(true)}
                        className={`flex-1 py-3.5 px-6 rounded-lg font-semibold transition-all duration-300 ${isGuest
                                ? "bg-white text-cyan-600 shadow-md transform scale-[1.02]"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                    >
                        <div className="flex items-center justify-center gap-2">
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
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                            <span>Misafir Devam</span>
                        </div>
                    </button>
                </div>

                {!isGuest ? (
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="text-center sm:text-left">
                            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                Hoş Geldiniz! 👋
                            </h3>
                            <p className="text-sm text-gray-600">
                                Hesabınıza giriş yaparak siparişlerinizi takip edebilirsiniz
                            </p>
                        </div>

                        {loginError && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl animate-shake">
                                <div className="flex items-start">
                                    <svg
                                        className="w-5 h-5 text-red-500 mr-3 mt-0.5 shrink-0"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <p className="text-red-800 font-medium text-sm">
                                        {loginError}
                                    </p>
                                </div>
                            </div>
                        )}

                        {loginSuccess && (
                            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl">
                                <div className="flex items-start">
                                    <svg
                                        className="w-5 h-5 text-green-500 mr-3 mt-0.5 shrink-0"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <p className="text-green-800 font-medium text-sm">
                                        ✓ Başarıyla giriş yapıldı! Yönlendiriliyorsunuz...
                                    </p>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                                E-posta veya Telefon Numarası
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg
                                        className="w-5 h-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:border-cyan-500 transition-all"
                                    placeholder="E-posta veya telefon numarası"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                                Şifre
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg
                                        className="w-5 h-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white focus:border-cyan-500 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-800 transition-all shadow-md hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] hidden lg:flex items-center justify-center gap-2"
                        >
                            <span>Giriş Yap</span>
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
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                            </svg>
                        </button>

                        <div className="text-center pt-4 border-t">
                            <p className="text-sm text-gray-600">
                                Hesabınız yok mu?{" "}
                                <a
                                    href="/register"
                                    className="text-cyan-600 hover:text-cyan-700 font-semibold hover:underline"
                                >
                                    Hemen Kayıt Olun
                                </a>
                            </p>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleGuestContinue} className="space-y-6">
                        <div className="text-center sm:text-left">
                            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                Misafir Olarak Devam Edin 🛍️
                            </h3>
                            <p className="text-sm text-gray-600">
                                Siparişinizi tamamlamak için gerekli bilgileri girin
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Ad <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={orderData.firstName ?? ""}
                                    onChange={(e) =>
                                        setOrderData({ ...orderData, firstName: e.target.value })
                                    }
                                    className={`w-full px-4 py-3.5 rounded-xl border transition-all ${guestErrors.firstName
                                            ? "bg-red-50 border-red-500 ring-2 ring-red-200 focus:ring-red-300"
                                            : "bg-gray-50 border-gray-200 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                                        } focus:outline-none shadow-sm`}
                                    placeholder="Adınız"
                                />
                                {guestErrors.firstName && (
                                    <p className="text-red-600 text-xs mt-2 flex items-center gap-1 animate-shake">
                                        <svg
                                            className="w-4 h-4 shrink-0"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {guestErrors.firstName}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Soyad <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={orderData.lastName ?? ""}
                                    onChange={(e) =>
                                        setOrderData({ ...orderData, lastName: e.target.value })
                                    }
                                    className={`w-full px-4 py-3.5 rounded-xl border transition-all ${guestErrors.lastName
                                            ? "bg-red-50 border-red-500 ring-2 ring-red-200 focus:ring-red-300"
                                            : "bg-gray-50 border-gray-200 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                                        } focus:outline-none shadow-sm`}
                                    placeholder="Soyadınız"
                                />
                                {guestErrors.lastName && (
                                    <p className="text-red-600 text-xs mt-2 flex items-center gap-1 animate-shake">
                                        <svg
                                            className="w-4 h-4 shrink-0"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {guestErrors.lastName}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                E-posta Adresi <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg
                                        className={`w-5 h-5 ${guestErrors.email ? "text-red-400" : "text-gray-400"
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    value={orderData.email ?? ""}
                                    onChange={(e) =>
                                        setOrderData({ ...orderData, email: e.target.value })
                                    }
                                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border transition-all ${guestErrors.email
                                            ? "bg-red-50 border-red-500 ring-2 ring-red-200 focus:ring-red-300"
                                            : "bg-gray-50 border-gray-200 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                                        } focus:outline-none shadow-sm`}
                                    placeholder="ornek@email.com"
                                />
                            </div>
                            {guestErrors.email && (
                                <p className="text-red-600 text-xs mt-2 flex items-center gap-1 animate-shake">
                                    <svg
                                        className="w-4 h-4 shrink-0"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {guestErrors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Telefon <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg
                                        className={`w-5 h-5 ${guestErrors.phone ? "text-red-400" : "text-gray-400"
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="tel"
                                    value={orderData.phone ?? ""}
                                    onChange={(e) =>
                                        setOrderData({ ...orderData, phone: e.target.value })
                                    }
                                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border transition-all ${guestErrors.phone
                                            ? "bg-red-50 border-red-500 ring-2 ring-red-200 focus:ring-red-300"
                                            : "bg-gray-50 border-gray-200 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                                        } focus:outline-none shadow-sm`}
                                    placeholder="05xx xxx xx xx"
                                />
                            </div>
                            {guestErrors.phone && (
                                <p className="text-red-600 text-xs mt-2 flex items-center gap-1 animate-shake">
                                    <svg
                                        className="w-4 h-4 shrink-0"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {guestErrors.phone}
                                </p>
                            )}
                        </div>

                        <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded-r-xl">
                            <div className="flex items-start">
                                <svg
                                    className="w-5 h-5 text-cyan-500 mr-3 mt-0.5 shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <p className="text-cyan-800 text-sm">
                                    Üye olmadan da alışveriş yapabilirsiniz. Ancak üye olarak daha
                                    hızlı alışveriş yapabilir ve siparişlerinizi takip
                                    edebilirsiniz.
                                </p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-800 transition-all shadow-md hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] hidden lg:flex items-center justify-center gap-2"
                        >
                            <span>Devam Et</span>
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
                                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                                />
                            </svg>
                        </button>

                        <div className="text-center pt-4 border-t">
                            <p className="text-sm text-gray-600">
                                Üye olarak daha hızlı alışveriş yapabilirsiniz.{" "}
                                <a
                                    href="/register"
                                    className="text-cyan-600 hover:text-cyan-700 font-semibold hover:underline"
                                >
                                    Hemen Kayıt Olun
                                </a>
                            </p>
                        </div>
                    </form>
                )}

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 lg:hidden">
                    <button
                        onClick={(e) => {
                            if (isGuest) {
                                handleGuestContinue(e as any);
                            } else {
                                handleLogin(e as any);
                            }
                        }}
                        className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-md active:scale-[0.98]"
                    >
                        <span>{isGuest ? "Devam Et" : "Giriş Yap"}</span>
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
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginOrUserDataEntryClient;
