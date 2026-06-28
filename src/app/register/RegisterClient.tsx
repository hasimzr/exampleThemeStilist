"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { registerUser } from "@/Api/controllers/UserController";

const RegisterClient = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [tcNumber, setTcNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useRouter();

    // Şifre güvenlik kontrolü
    const checkPasswordStrength = (
        pwd: string
    ): { isValid: boolean; message: string } => {
        if (pwd.length < 8) {
            return { isValid: false, message: "Şifre en az 8 karakter olmalıdır" };
        }
        if (!/[A-Z]/.test(pwd)) {
            return {
                isValid: false,
                message: "Şifre en az bir büyük harf içermelidir",
            };
        }
        if (!/[a-z]/.test(pwd)) {
            return {
                isValid: false,
                message: "Şifre en az bir küçük harf içermelidir",
            };
        }
        if (!/[0-9]/.test(pwd)) {
            return { isValid: false, message: "Şifre en az bir rakam içermelidir" };
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
            return {
                isValid: false,
                message: "Şifre en az bir özel karakter içermelidir (!@#$%^&* vb.)",
            };
        }
        return { isValid: true, message: "Güçlü şifre" };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validasyon
        if (
            !firstName ||
            !lastName ||
            !email ||
            !phone ||
            !tcNumber ||
            !password ||
            !confirmPassword
        ) {
            setError("Lütfen tüm alanları doldurun");
            return;
        }

        // TC Kimlik numarası kontrolü (11 haneli olmalı)
        if (tcNumber.length !== 11 || !/^\d+$/.test(tcNumber)) {
            setError("TC Kimlik numarası 11 haneli olmalıdır");
            return;
        }

        // Telefon numarası kontrolü (10 haneli olmalı)
        if (phone.length !== 10 || !/^\d+$/.test(phone)) {
            setError("Cep telefonu numarası 10 haneli olmalıdır (örn: 5551234567)");
            return;
        }

        // Şifre güvenlik kontrolü
        const passwordCheck = checkPasswordStrength(password);
        if (!passwordCheck.isValid) {
            setError(passwordCheck.message);
            return;
        }

        if (password !== confirmPassword) {
            setError("Şifreler eşleşmiyor");
            return;
        }

        // DTO'ya göre veri yapısı
        const registerData = {
            phoneNumber: phone,
            name: firstName,
            lastName: lastName,
            citizenNo: tcNumber,
            mail: email,
            password: password,
            referenceCode: "", // İsteğe bağlı - boş bırakılabilir
            phoneConfirm: false,
            mailConfirm: false,
        };

        try {
            const response = await registerUser(registerData);
            if (response) {
                setSuccess(
                    "Kayıt işleminiz başarıyla tamamlandı! Giriş sayfasına yönlendiriliyorsunuz..."
                );

                // 2 saniye sonra login sayfasına yönlendir
                setTimeout(() => {
                    navigate.push("/login");
                }, 2000);
            }
        } catch (error: any) {
            // API'den gelen hata mesajını göster
            setError(
                "Kayıt işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin."
            );
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#fafafa] flex items-center justify-center pt-16 pb-4 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl w-full">
                <div className="bg-white border border-[#d2d2d7]/50 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2">
                    {/* Sol Taraf: Kayıt Formu */}
                    <div className="p-8 sm:p-12 flex flex-col justify-center">
                        {/* Logo ve Başlık */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">Kayıt Ol</h2>
                            <p className="text-sm text-[#86868b] mt-1.5">Yeni hesap oluşturun</p>
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
                                <span>{success}</span>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="firstName"
                                        className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2"
                                    >
                                        Ad <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full px-4 py-3 border border-[#d2d2d7] rounded-xl text-sm focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 transition-all bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60"
                                        placeholder="Ahmet"
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="lastName"
                                        className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2"
                                    >
                                        Soyad <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full px-4 py-3 border border-[#d2d2d7] rounded-xl text-sm focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 transition-all bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60"
                                        placeholder="Yılmaz"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2"
                                    >
                                        E-posta <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 border border-[#d2d2d7] rounded-xl text-sm focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 transition-all bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60"
                                        placeholder="ornek@email.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2"
                                    >
                                        Cep Telefonu <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                        maxLength={10}
                                        className="w-full px-4 py-3 border border-[#d2d2d7] rounded-xl text-sm focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 transition-all bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60"
                                        placeholder="5551234567"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="tcNumber"
                                    className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2"
                                >
                                    TC Kimlik Numarası <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="tcNumber"
                                    type="text"
                                    value={tcNumber}
                                    onChange={(e) => setTcNumber(e.target.value.replace(/\D/g, ""))}
                                    maxLength={11}
                                    className="w-full px-4 py-3 border border-[#d2d2d7] rounded-xl text-sm focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 transition-all bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60"
                                    placeholder="12345678901"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2"
                                    >
                                        Şifre <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 border border-[#d2d2d7] rounded-xl text-sm focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 transition-all bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60 pr-12"
                                            placeholder="••••••••"
                                            required
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
                                    {password && (
                                        <div className="mt-2.5 p-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-xs font-medium flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${checkPasswordStrength(password).isValid ? "bg-green-600" : "bg-orange-500"}`} />
                                            <span className={checkPasswordStrength(password).isValid ? "text-green-700" : "text-orange-750"}>
                                                {checkPasswordStrength(password).message}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2"
                                    >
                                        Şifre (Tekrar) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-4 py-3 border border-[#d2d2d7] rounded-xl text-sm focus:outline-none focus:border-[#1d1d1f] focus:ring-1 focus:ring-[#1d1d1f]/10 transition-all bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60 pr-12"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] focus:outline-none p-1 rounded-full hover:bg-neutral-50 transition-colors"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-[#1d1d1f] hover:bg-neutral-800 text-white py-3 px-6 rounded-full text-sm font-semibold transition-all duration-200 active:scale-[0.98] select-none shadow-sm"
                                >
                                    Kayıt Ol
                                </button>
                            </div>
                        </form>

                        {/* Giriş Linki */}
                        <div className="mt-8 pt-6 border-t border-[#d2d2d7]/40 text-center">
                            <p className="text-xs text-[#86868b]">
                                Zaten hesabınız var mı?{" "}
                                <Link
                                    href="/login"
                                    className="text-[#1d1d1f] hover:underline underline-offset-4 font-semibold"
                                >
                                    Giriş Yap
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Sağ Taraf: Görsel ve Banner Kartı */}
                    <div className="hidden md:block relative bg-[#f5f5f7] overflow-hidden min-h-[550px]">
                        <img
                            src="/banners/membership.png"
                            alt="Zmrelektronik Boutique Üyelik"
                            className="w-full h-full object-cover select-none pointer-events-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent flex flex-col justify-end p-12">
                            <span className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-2">Ayrıcalıklı Dünya</span>
                            <h3 className="text-white text-2xl font-semibold leading-snug tracking-tight mb-4">
                                Zmrelektronik ailesine katılın.<br />Özel fırsatları kaçırmayın.
                            </h3>
                            <p className="text-white/60 text-xs leading-relaxed max-w-sm">
                                Üye olarak yeni koleksiyonlardan ilk siz haberdar olun, size özel indirimlerden ve ücretsiz kargo avantajlarından yararlanın.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterClient;
