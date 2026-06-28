"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { LoginUser } from "@/Api/controllers/UserController";
import ModalComponent from "@/components/ModalCompanent";

const LoginClient = () => {
    const [identifier, setIdentifier] = useState("");
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Şifremi Unuttum state'leri
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotError, setForgotError] = useState("");
    const [forgotSuccess, setForgotSuccess] = useState("");

    // Şifre Sıfırlama state'leri
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [resetCode1, setResetCode1] = useState("");
    const [resetCode2, setResetCode2] = useState("");
    const resetCode2Ref = useRef<HTMLInputElement>(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPasswordField, setShowNewPasswordField] = useState(false);
    const [showConfirmPasswordField, setShowConfirmPasswordField] =
        useState(false);
    const [resetError, setResetError] = useState("");
    const [resetSuccess, setResetSuccess] = useState("");
    // Resend countdown (seconds)
    const [resendSeconds, setResendSeconds] = useState(0);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (resendSeconds <= 0) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            return;
        }
        if (timerRef.current) return;
        timerRef.current = window.setInterval(() => {
            setResendSeconds((s) => {
                if (s <= 1) {
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                    }
                    return 0;
                }
                return s - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [resendSeconds]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!identifier || !password) {
            setError("Lütfen tüm alanları doldurun");
            return;
        }

        try {
            let res = await LoginUser({ identifier, password });
            if (res && res.status === 200) {
                localStorage.setItem("currentUser", JSON.stringify(res.data));
                setSuccess(true);
                setTimeout(() => {
                    window.location.href = "/";
                }, 500);
            } else {
                setError("Kullanıcı adı şifreniz hatalı veya hesap oluşturun");
            }
        } catch (err) {
            setError("Kullanıcı adı şifreniz hatalı veya hesap oluşturun");
        }
    };

    const isNewPasswordLongEnough = newPassword.length >= 6;
    const isNewPasswordHasUpper = /[A-ZÇĞİÖŞÜ]/.test(newPassword);

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#fafafa] flex items-center justify-center pt-16 pb-4 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl w-full">
                <div className="bg-white border border-[#d2d2d7]/50 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2">
                    {/* Sol Taraf: Giriş Formu */}
                    <div className="p-8 sm:p-12 flex flex-col justify-center">
                        {/* Logo ve Başlık */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">Giriş Yap</h2>
                            <p className="text-sm text-[#86868b] mt-1.5">Hesabınıza giriş yapın</p>
                        </div>

                        {/* Hata Mesajı */}
                        {error && (
                            <div className="mb-6 p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs font-medium flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}
                        {/* Başarı Mesajı */}
                        {success && (
                            <div className="mb-6 p-3.5 bg-green-50 border border-green-100 rounded-xl text-green-700 text-xs font-medium flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-600 shrink-0" />
                                <span>Başarıyla giriş yapıldı! Ana sayfaya yönlendiriliyorsunuz...</span>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="identifier"
                                    className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2"
                                >
                                    E-posta veya Telefon Numarası
                                </label>
                                <input
                                    id="identifier"
                                    type="text"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="w-full px-4 py-3 border border-[#d2d2d7] rounded-xl text-sm focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 transition-all bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60"
                                    placeholder="E-posta veya telefon numarası"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2"
                                >
                                    Şifre
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-[#d2d2d7] rounded-xl text-sm focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 transition-all bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60 pr-12"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] focus:outline-none p-1 rounded-full hover:bg-neutral-50 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-4 h-4" />
                                        ) : (
                                            <Eye className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#1d1d1f] hover:bg-neutral-800 text-white py-3 px-6 rounded-full text-sm font-semibold transition-all duration-200 active:scale-[0.98] select-none shadow-sm"
                            >
                                Giriş Yap
                            </button>
                        </form>

                        {/* Şifremi Unuttum Linki */}
                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                onClick={() => setShowForgotPassword(true)}
                                className="text-xs font-medium text-[#86868b] hover:text-[#1d1d1f] hover:underline underline-offset-4 transition"
                            >
                                Şifremi Unuttum?
                            </button>
                        </div>

                        {/* Kayıt Linki */}
                        <div className="mt-8 pt-6 border-t border-[#d2d2d7]/40 text-center">
                            <p className="text-xs text-[#86868b]">
                                Hesabınız yok mu?{" "}
                                <Link
                                    href="/register"
                                    className="text-[#1d1d1f] hover:underline underline-offset-4 font-semibold"
                                >
                                    Kayıt Ol
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Sağ Taraf: Görsel ve Banner Kartı */}
                    <div className="hidden md:block relative bg-[#f5f5f7] overflow-hidden min-h-[550px]">
                        <img
                            src="/banners/login-banner.png"
                            alt="Zmrelektronik Boutique"
                            className="w-full h-full object-cover select-none pointer-events-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent flex flex-col justify-end p-12">
                            <span className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-2">Yeni Sezon</span>
                            <h3 className="text-white text-2xl font-semibold leading-snug tracking-tight mb-4">
                                Zarafet ve sadelik bir arada.<br />Yeni koleksiyonumuzu keşfedin.
                            </h3>
                            <p className="text-white/60 text-xs leading-relaxed max-w-sm">
                                En seçkin kumaşlar ve minimalist tasarımlarla gardırobunuzu yeniden tanımlayın.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Şifremi Unuttum Modal */}
            <ModalComponent
                isOpen={showForgotPassword}
                onClose={() => {
                    setShowForgotPassword(false);
                    setForgotEmail("");
                    setForgotError("");
                    setForgotSuccess("");
                }}
                title="Şifremi Unuttum"
                size="md"
            >
                <div className="space-y-4">
                    <p className="text-sm text-[#86868b] leading-relaxed">
                        E-posta adresinizi girin, size şifre sıfırlama kodu gönderelim.
                    </p>

                    {forgotError && (
                        <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                            <span>{forgotError}</span>
                        </div>
                    )}

                    {forgotSuccess && (
                        <div className="p-3.5 bg-green-50 border border-green-100 rounded-xl text-green-700 text-xs font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600 shrink-0" />
                            <span>{forgotSuccess}</span>
                        </div>
                    )}

                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setForgotError("");
                            setForgotSuccess("");

                            if (!forgotEmail) {
                                setForgotError("Lütfen e-posta adresinizi girin");
                                return;
                            }

                            try {
                                const { forgotPassword } = await import(
                                    "@/Api/controllers/UserController"
                                );
                                await forgotPassword(forgotEmail);
                                setForgotSuccess(
                                    "Şifre sıfırlama kodu e-posta adresinize gönderildi!"
                                );
                                setTimeout(() => {
                                    setShowForgotPassword(false);
                                    setShowResetPassword(true);
                                    // start 3 minute countdown
                                    setResendSeconds(180);
                                    setForgotSuccess("");
                                }, 2000);
                            } catch (err: any) {
                                setForgotError(
                                    err.response?.data?.message ||
                                    "Doğrulama Kodu 3 dakika içerisinde tekrar gönderilemez."
                                );
                                setTimeout(() => {
                                    setShowForgotPassword(false);
                                    setShowResetPassword(true);
                                    // start 3 minute countdown
                                    setResendSeconds(180);
                                    setForgotSuccess("");
                                }, 2000);
                            }
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label
                                htmlFor="forgot-email"
                                className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2"
                            >
                                E-posta Adresi
                            </label>
                            <input
                                id="forgot-email"
                                type="email"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                className="w-full px-4 py-3 border border-[#d2d2d7] rounded-xl text-sm focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 transition-all bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60"
                                placeholder="ornek@email.com"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForgotPassword(false);
                                    setForgotEmail("");
                                    setForgotError("");
                                    setForgotSuccess("");
                                }}
                                className="flex-1 px-4 py-2.5 border border-[#d2d2d7] rounded-full hover:bg-[#f5f5f7] text-xs font-semibold text-[#1d1d1f] transition-all duration-200 active:scale-[0.98]"
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-[#1d1d1f] hover:bg-neutral-800 text-white px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 active:scale-[0.98]"
                            >
                                Kod Gönder
                            </button>
                        </div>
                    </form>
                </div>
            </ModalComponent>

            {/* Şifre Sıfırlama Modal */}
            <ModalComponent
                isOpen={showResetPassword}
                onClose={() => {
                    setShowResetPassword(false);
                    setResetCode1("");
                    setResetCode2("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setResetError("");
                    setResetSuccess("");
                    setForgotEmail("");
                    setResendSeconds(0);
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                    }
                }}
                title="Şifre Sıfırlama"
                size="md"
            >
                <div className="space-y-4">
                    <p className="text-sm text-[#86868b] leading-relaxed">
                        E-postanıza gelen kodu ve yeni şifrenizi girin.
                    </p>

                    {resetError && (
                        <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                            <span>{resetError}</span>
                        </div>
                    )}

                    {resetSuccess && (
                        <div className="p-3.5 bg-green-50 border border-green-100 rounded-xl text-green-700 text-xs font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600 shrink-0" />
                            <span>{resetSuccess}</span>
                        </div>
                    )}

                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setResetError("");
                            setResetSuccess("");

                            if (
                                !resetCode1 ||
                                !resetCode2 ||
                                !newPassword ||
                                !confirmPassword
                            ) {
                                setResetError("Lütfen tüm alanları doldurun");
                                return;
                            }

                            if (newPassword !== confirmPassword) {
                                setResetError("Şifreler eşleşmiyor");
                                return;
                            }

                            if (newPassword.length < 6) {
                                setResetError("Şifre en az 6 karakter olmalıdır");
                                return;
                            }

                            if (!/[A-ZÇĞİÖŞÜ]/.test(newPassword)) {
                                setResetError("Şifre en az bir büyük harf içermelidir");
                                return;
                            }

                            try {
                                const { resetPassword } = await import(
                                    "@/Api/controllers/UserController"
                                );
                                await resetPassword({
                                    email: forgotEmail,
                                    code: `${resetCode1}-${resetCode2}`,
                                    newPassword: newPassword,
                                });
                                setResetSuccess(
                                    "Şifreniz başarıyla sıfırlandı! Giriş sayfasına yönlendiriliyorsunuz..."
                                );
                                setTimeout(() => {
                                    setShowResetPassword(false);
                                    setResetCode1("");
                                    setResetCode2("");
                                    setNewPassword("");
                                    setConfirmPassword("");
                                    setResetSuccess("");
                                    setResetSuccess("");
                                }, 2000);
                            } catch (err: any) {
                                setResetError(
                                    err.response?.data?.message ||
                                    "Bir hata oluştu. Lütfen tekrar deneyin."
                                );
                            }
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label
                                htmlFor="reset-code"
                                className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2"
                            >
                                Sıfırlama Kodu
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    id="reset-code-1"
                                    type="text"
                                    value={resetCode1}
                                    onChange={(e) => {
                                        const val = e.target.value
                                            .replace(/[^A-Z0-9]/gi, "")
                                            .toUpperCase()
                                            .slice(0, 3);
                                        setResetCode1(val);
                                        if (val.length === 3) {
                                            resetCode2Ref.current?.focus();
                                        }
                                    }}
                                    onPaste={(e) => {
                                        const pasted = e.clipboardData
                                            .getData("text")
                                            .trim()
                                            .toUpperCase();
                                        if (/^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(pasted)) {
                                            const [first, second] = pasted.split("-");
                                            setResetCode1(first);
                                            setResetCode2(second);
                                            setTimeout(() => {
                                                resetCode2Ref.current?.focus();
                                                resetCode2Ref.current?.select();
                                            }, 0);
                                            e.preventDefault();
                                        }
                                    }}
                                    className="w-16 px-4 py-2.5 border border-[#d2d2d7] rounded-xl focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 text-center uppercase font-semibold text-sm bg-white"
                                    maxLength={3}
                                    placeholder="XXX"
                                    autoComplete="one-time-code"
                                />
                                <span className="font-bold text-[#86868b]">-</span>
                                <input
                                    id="reset-code-2"
                                    type="text"
                                    value={resetCode2}
                                    ref={resetCode2Ref}
                                    onChange={(e) =>
                                        setResetCode2(
                                            e.target.value
                                                .replace(/[^A-Z0-9]/gi, "")
                                                .toUpperCase()
                                                .slice(0, 3)
                                        )
                                    }
                                    className="w-16 px-4 py-2.5 border border-[#d2d2d7] rounded-xl focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 text-center uppercase font-semibold text-sm bg-white"
                                    maxLength={3}
                                    placeholder="XXX"
                                    autoComplete="one-time-code"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="new-password"
                                className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2"
                            >
                                Yeni Şifre
                            </label>
                            <div className="flex gap-2 items-center">
                                <input
                                    id="new-password"
                                    type={showNewPasswordField ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="flex-1 px-4 py-3 border border-[#d2d2d7] rounded-xl text-sm focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 transition-all bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60"
                                    placeholder="En az 6 karakter"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPasswordField((s) => !s)}
                                    className="px-4 py-2.5 border border-[#d2d2d7] rounded-xl bg-white hover:bg-[#f5f5f7] text-xs font-semibold text-[#1d1d1f] transition-all"
                                >
                                    {showNewPasswordField ? "Gizle" : "Göster"}
                                </button>
                            </div>

                            <div className="mt-3 text-xs space-y-1.5">
                                <div className="flex items-center gap-1.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${isNewPasswordLongEnough ? "bg-green-600" : "bg-red-500"}`} />
                                    <span className={isNewPasswordLongEnough ? "text-green-700 font-medium" : "text-red-500"}>En az 6 karakter</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className={`w-1.5 h-1.5 rounded-full ${isNewPasswordHasUpper ? "bg-green-600" : "bg-red-500"}`} />
                                    <span className={isNewPasswordHasUpper ? "text-green-700 font-medium" : "text-red-500"}>En az 1 büyük harf</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="confirm-password"
                                className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2"
                            >
                                Yeni Şifre (Tekrar)
                            </label>
                            <div className="flex gap-2 items-center">
                                <input
                                    id="confirm-password"
                                    type={showConfirmPasswordField ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="flex-1 px-4 py-3 border border-[#d2d2d7] rounded-xl text-sm focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 transition-all bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60"
                                    placeholder="Şifrenizi tekrar girin"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPasswordField((s) => !s)}
                                    className="px-4 py-2.5 border border-[#d2d2d7] rounded-xl bg-white hover:bg-[#f5f5f7] text-xs font-semibold text-[#1d1d1f] transition-all"
                                >
                                    {showConfirmPasswordField ? "Gizle" : "Göster"}
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#86868b] pt-2">
                            <div>Kodu almadınız mı?</div>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={async () => {
                                        setForgotError("");
                                        setForgotSuccess("");
                                        if (!forgotEmail) {
                                            setForgotError(
                                                "E-posta adresi bulunamadı. Lütfen önce kod isteyin."
                                            );
                                            return;
                                        }
                                        try {
                                            const { forgotPassword } = await import(
                                                "@/Api/controllers/UserController"
                                            );
                                            await forgotPassword(forgotEmail);
                                            setForgotSuccess("Kod yeniden gönderildi.");
                                            setResendSeconds(180);
                                            setTimeout(() => setForgotSuccess(""), 3000);
                                        } catch (err: any) {
                                            setForgotError(
                                                err.response?.data?.message ||
                                                "Tekrar gönderilemedi. Lütfen tekrar deneyin."
                                            );
                                        }
                                    }}
                                    className={`px-4 py-2 rounded-full font-semibold text-xs border transition-all duration-200 ${resendSeconds > 0
                                        ? "bg-[#f5f5f7] text-[#86868b] border-[#d2d2d7]/50 cursor-not-allowed"
                                        : "bg-[#1d1d1f] text-white hover:bg-[#neutral-800] border-[#1d1d1f] active:scale-95"
                                        }`}
                                    disabled={resendSeconds > 0}
                                >
                                    Kodu Yeniden Gönder
                                </button>
                                <div className="w-16 text-right font-medium">
                                    {resendSeconds > 0 ? (
                                        <span className="text-xs text-[#1d1d1f]">
                                            {Math.floor(resendSeconds / 60)
                                                .toString()
                                                .padStart(2, "0")}
                                            :{(resendSeconds % 60).toString().padStart(2, "0")}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-[#86868b]">
                                            Yeniden gönder
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-4 border-t border-[#d2d2d7]/40">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowResetPassword(false);
                                    setResetCode1("");
                                    setResetCode2("");
                                    setNewPassword("");
                                    setConfirmPassword("");
                                    setResetError("");
                                    setResetSuccess("");
                                }}
                                className="flex-1 px-4 py-2.5 border border-[#d2d2d7] rounded-full hover:bg-[#f5f5f7] text-xs font-semibold text-[#1d1d1f] transition-all duration-200 active:scale-[0.98]"
                            >
                                İptal
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-[#1d1d1f] hover:bg-neutral-800 text-white px-4 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 active:scale-[0.98]"
                            >
                                Şifreyi Sıfırla
                            </button>
                        </div>
                    </form>
                </div>
            </ModalComponent>
        </div>
    );
};

export default LoginClient;
