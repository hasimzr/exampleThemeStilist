import { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "İletişim",
  description: "stlist Butik ile iletişime geçin. Adres, telefon, e-posta bilgilerimiz, çalışma saatlerimiz veya bize mesaj gönderin.",
};

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#fdf8f5] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20">
          <p className="text-[11px] font-semibold text-[#b76e79] tracking-[0.2em] uppercase mb-3">
            Bize Ulaşın
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-[#2d2d2d] tracking-tight">
            İletişim
          </h1>
          <div className="w-12 h-[1px] bg-[#b76e79] mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* İletişim Bilgileri (4 cols on lg) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-[#f0e6df] p-8 md:p-10 shadow-sm space-y-8">
              <div>
                <h2 className="text-xl font-bold text-[#2d2d2d] tracking-tight mb-2">
                  İletişim Bilgileri
                </h2>
                <p className="text-xs text-[#8a7e78]">
                  Sorularınız, iş birlikleriniz veya destek talepleriniz için bize ulaşabilirsiniz.
                </p>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#fdf8f5] rounded-2xl flex items-center justify-center shrink-0 border border-[#f0e6df]/50">
                  <MapPin className="w-5 h-5 text-[#b76e79]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2d2d2d] mb-1">Butik Adresi</h3>
                  <p className="text-xs text-[#8a7e78] leading-relaxed">
                    Kınıklı Mah. Hüseyin Yılmaz Cad.
                    <br />
                    No:67/4 D Blok / Kat:1 Pamukkale / Denizli
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#fdf8f5] rounded-2xl flex items-center justify-center shrink-0 border border-[#f0e6df]/50">
                  <Phone className="w-5 h-5 text-[#b76e79]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2d2d2d] mb-1">Müşteri Hattı</h3>
                  <p className="text-xs text-[#8a7e78]">
                    <a href="tel:+905447267947" className="hover:text-[#b76e79] font-medium transition-colors">
                      +90 544 726 79 47
                    </a>
                  </p>
                  <p className="text-[10px] text-[#b5aca6] mt-0.5">
                    Hafta içi & Cumartesi: 09:00 - 18:00
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#fdf8f5] rounded-2xl flex items-center justify-center shrink-0 border border-[#f0e6df]/50">
                  <Mail className="w-5 h-5 text-[#b76e79]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2d2d2d] mb-1">E-posta</h3>
                  <p className="text-xs text-[#8a7e78]">
                    <a href="mailto:contact@zmrelektronik.com" className="hover:text-[#b76e79] font-medium transition-colors">
                      contact@zmrelektronik.com
                    </a>
                  </p>
                  <p className="text-[10px] text-[#b5aca6] mt-0.5">
                    Tüm maillere 24 saat içinde dönüş yapıyoruz.
                  </p>
                </div>
              </div>

              {/* Çalışma Saatleri */}
              <div className="pt-6 border-t border-[#f0e6df] space-y-4">
                <h3 className="text-sm font-bold text-[#2d2d2d] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#b76e79]" />
                  Çalışma Saatleri
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-[#f7f0eb]">
                    <span className="text-[#8a7e78]">Pazartesi - Cuma</span>
                    <span className="font-semibold text-[#2d2d2d]">09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#f7f0eb]">
                    <span className="text-[#8a7e78]">Cumartesi</span>
                    <span className="font-semibold text-[#2d2d2d]">10:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#8a7e78]">Pazar</span>
                    <span className="font-semibold text-[#b76e79]">Kapalı</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* İletişim Formu (7 cols on lg) */}
          <div className="lg:col-span-7">
            <ContactClient />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
