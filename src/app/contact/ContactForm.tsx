"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";
import type { ContactFormData } from "@/types";

const ContactForm = () => {
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock form submission
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: "", email: "", message: "" });
        }, 3000);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="bg-white rounded-3xl border border-[#f0e6df] p-8 md:p-10 shadow-sm">
            <h2 className="text-xl font-bold text-[#2d2d2d] tracking-tight mb-6">
                Bize Mesaj Gönderin
            </h2>

            {submitted && (
                <div className="mb-6 p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl text-emerald-800 text-xs flex items-center gap-3 animate-fadeIn">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-[10px] font-semibold uppercase tracking-wider text-[#8a7e78] mb-2"
                    >
                        Ad Soyad *
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-[#fdf8f5]/20 border border-[#f0e6df] rounded-2xl focus:outline-none focus:border-[#b76e79] focus:ring-1 focus:ring-[#b76e79] transition-all text-sm text-[#2d2d2d] placeholder-[#b5aca6]"
                        placeholder="Ahmet Yılmaz"
                    />
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="block text-[10px] font-semibold uppercase tracking-wider text-[#8a7e78] mb-2"
                    >
                        E-posta *
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-[#fdf8f5]/20 border border-[#f0e6df] rounded-2xl focus:outline-none focus:border-[#b76e79] focus:ring-1 focus:ring-[#b76e79] transition-all text-sm text-[#2d2d2d] placeholder-[#b5aca6]"
                        placeholder="ornek@email.com"
                    />
                </div>

                <div>
                    <label
                        htmlFor="message"
                        className="block text-[10px] font-semibold uppercase tracking-wider text-[#8a7e78] mb-2"
                    >
                        Mesajınız *
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-[#fdf8f5]/20 border border-[#f0e6df] rounded-2xl focus:outline-none focus:border-[#b76e79] focus:ring-1 focus:ring-[#b76e79] transition-all text-sm text-[#2d2d2d] placeholder-[#b5aca6] resize-none"
                        placeholder="Mesajınızı buraya yazın..."
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-[#b76e79] text-white py-3.5 rounded-full font-semibold text-xs hover:bg-[#a35d68] active:scale-[0.98] transition-all duration-300 shadow-md hover:shadow-lg shadow-[#b76e79]/15 flex items-center justify-center space-x-2"
                >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gönder</span>
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
