"use client";
import { useState } from "react";
import Link from "next/link";;
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import logo from "@/assets/logo.png";
import ModalComponent from "../ModalCompanent";
import {
  PRELIMINARY_INFORMATION_FORM,
  DISTANCE_SALES_AGREEMENT,
  KVKK_TEXT,
  CANCELLATION_AND_RETURN_CONDITIONS,
  COOKIE_POLICY,
} from "@/data/contracts";

const Footer = () => {
  const [showPreliminaryModal, setShowPreliminaryModal] = useState(false);
  const [showDistanceSalesModal, setShowDistanceSalesModal] = useState(false);
  const [showKvkkModal, setShowKvkkModal] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [showCookiePolicyModal, setShowCookiePolicyModal] = useState(false);

  return (
    <>
      <footer className="bg-[#1a1a2e] text-[#6b6b7b] mt-auto">
        {/* Newsletter strip */}
        <div className="border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-white font-semibold text-sm mb-1">Yeniliklerden Haberdar Olun</h3>
                <p className="text-[#6b6b7b] text-xs">Yeni ürünler ve kampanyalardan ilk siz haberdar olun.</p>
              </div>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#1a1a2e] px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-[#dfc373] transition-all duration-300"
              >
                Üye Ol
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center gap-2 mb-5">
                <img src={logo.src} alt="Zmrelektronik Logo" className="w-8 h-8 object-contain" />
                <span className="text-lg font-bold text-white tracking-tight">
                  Zmr<span className="text-[#c9a84c]">elektronik</span>
                </span>
              </Link>
              <p className="text-xs mb-5 leading-relaxed text-[#6b6b7b]">
                Geliştiriciler, mühendisler ve hobi tutkunları için en geniş
                elektronik bileşen çeşitliliği.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white text-xs font-semibold mb-5 tracking-[0.15em] uppercase">
                Hızlı Bağlantılar
              </h3>
              <ul className="space-y-2.5 text-xs">
                {[
                  { to: "/", label: "Ana Sayfa" },
                  { to: "/products", label: "Tüm Ürünler" },
                  { to: "/about", label: "Hakkımızda" },
                  { to: "/contact", label: "İletişim" },
                  { to: "/faq", label: "SSS" },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      href={to}
                      className="text-[#6b6b7b] hover:text-[#c9a84c] transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Support */}
            <div>
              <h3 className="text-white text-xs font-semibold mb-5 tracking-[0.15em] uppercase">
                Müşteri Hizmetleri
              </h3>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button
                    onClick={() => setShowKvkkModal(true)}
                    className="text-[#6b6b7b] hover:text-[#c9a84c] transition-colors duration-200 text-left"
                  >
                    KVKK ve Gizlilik Politikası
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowCookiePolicyModal(true)}
                    className="text-[#6b6b7b] hover:text-[#c9a84c] transition-colors duration-200 text-left"
                  >
                    Çerez Politikası
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowPreliminaryModal(true)}
                    className="text-[#6b6b7b] hover:text-[#c9a84c] transition-colors duration-200 text-left"
                  >
                    Ön Bilgilendirme Formu
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowDistanceSalesModal(true)}
                    className="text-[#6b6b7b] hover:text-[#c9a84c] transition-colors duration-200 text-left"
                  >
                    Mesafeli Satış Sözleşmesi
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setShowCancellationModal(true)}
                    className="text-[#6b6b7b] hover:text-[#c9a84c] transition-colors duration-200 text-left"
                  >
                    İptal ve İade Şartları
                  </button>
                </li>
                {[
                  { to: "/cart", label: "Sepetim" },
                  { to: "/dashboard", label: "Siparişlerim" },
                ].map(({ to, label }) => (
                  <li key={label}>
                    <Link
                      href={to}
                      className="text-[#6b6b7b] hover:text-[#c9a84c] transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white text-xs font-semibold mb-5 tracking-[0.15em] uppercase">
                İletişim
              </h3>
              <ul className="space-y-4 text-xs">
                <li className="flex items-start space-x-3">
                  <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#c9a84c]" />
                  </div>
                  <span className="text-[#6b6b7b] leading-relaxed">
                    KINIKLI MAH. HÜSEYİN YILMAZ CAD.
                    <br />
                    NO:67/4 D BLOK/ KAT:1 PAMUKKALE/ DENİZLİ
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <Phone className="w-3 h-3 text-[#c9a84c]" />
                  </div>
                  <a
                    href="tel:+905447267947"
                    className="text-[#6b6b7b] hover:text-[#c9a84c] transition-colors"
                  >
                    +90 544 726 79 47
                  </a>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <Mail className="w-3 h-3 text-[#c9a84c]" />
                  </div>
                  <a
                    href="mailto:contact@zmrelektronik.com"
                    className="text-[#6b6b7b] hover:text-[#c9a84c] transition-colors"
                  >
                    contact@zmrelektronik.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[11px] text-[#6b6b7b]/60">
              © 2024 Zmrelektronik. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-6 text-[11px] text-[#6b6b7b]/60">
              <button
                onClick={() => setShowKvkkModal(true)}
                className="hover:text-[#c9a84c] transition-colors"
              >
                Gizlilik
              </button>
              <button
                onClick={() => setShowCookiePolicyModal(true)}
                className="hover:text-[#c9a84c] transition-colors"
              >
                Çerezler
              </button>
              <button
                onClick={() => setShowDistanceSalesModal(true)}
                className="hover:text-[#c9a84c] transition-colors"
              >
                Şartlar
              </button>
              <Link href="/faq" className="hover:text-[#c9a84c] transition-colors">
                SSS
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Ön Bilgilendirme Formu Modal */}
      <ModalComponent
        isOpen={showPreliminaryModal}
        onClose={() => setShowPreliminaryModal(false)}
        title="Ön Bilgilendirme Formu"
        size="lg"
      >
        <div className="p-4 bg-[#f7f5f0] rounded-lg border border-[#e8e6e1] text-sm text-[#1a1a2e] leading-relaxed font-sans whitespace-pre-wrap">
          {PRELIMINARY_INFORMATION_FORM}
        </div>
        <div className="flex justify-end pt-4">
          <button
            onClick={() => setShowPreliminaryModal(false)}
            className="bg-[#1a1a2e] text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-[#2d2d44] transition"
          >
            Kapat
          </button>
        </div>
      </ModalComponent>

      {/* Mesafeli Satış Sözleşmesi Modal */}
      <ModalComponent
        isOpen={showDistanceSalesModal}
        onClose={() => setShowDistanceSalesModal(false)}
        title="Mesafeli Satış Sözleşmesi"
        size="lg"
      >
        <div className="p-4 bg-[#f7f5f0] rounded-lg border border-[#e8e6e1] text-sm text-[#1a1a2e] leading-relaxed font-sans whitespace-pre-wrap">
          {DISTANCE_SALES_AGREEMENT}
        </div>
        <div className="flex justify-end pt-4">
          <button
            onClick={() => setShowDistanceSalesModal(false)}
            className="bg-[#1a1a2e] text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-[#2d2d44] transition"
          >
            Kapat
          </button>
        </div>
      </ModalComponent>

      {/* KVKK Modal */}
      <ModalComponent
        isOpen={showKvkkModal}
        onClose={() => setShowKvkkModal(false)}
        title="KVKK Aydınlatma Metni ve Gizlilik Politikası"
        size="lg"
      >
        <div className="p-4 bg-[#f7f5f0] rounded-lg border border-[#e8e6e1] text-sm text-[#1a1a2e] leading-relaxed font-sans whitespace-pre-wrap">
          {KVKK_TEXT}
        </div>
        <div className="flex justify-end pt-4">
          <button
            onClick={() => setShowKvkkModal(false)}
            className="bg-[#1a1a2e] text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-[#2d2d44] transition"
          >
            Kapat
          </button>
        </div>
      </ModalComponent>

      {/* İptal ve İade Modal */}
      <ModalComponent
        isOpen={showCancellationModal}
        onClose={() => setShowCancellationModal(false)}
        title="İptal, İade ve Cayma Hakkı Şartları"
        size="lg"
      >
        <div className="p-4 bg-[#f7f5f0] rounded-lg border border-[#e8e6e1] text-sm text-[#1a1a2e] leading-relaxed font-sans whitespace-pre-wrap">
          {CANCELLATION_AND_RETURN_CONDITIONS}
        </div>
        <div className="flex justify-end pt-4">
          <button
            onClick={() => setShowCancellationModal(false)}
            className="bg-[#1a1a2e] text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-[#2d2d44] transition"
          >
            Kapat
          </button>
        </div>
      </ModalComponent>

      {/* Çerez Politikası Modal */}
      <ModalComponent
        isOpen={showCookiePolicyModal}
        onClose={() => setShowCookiePolicyModal(false)}
        title="Çerez Politikası"
        size="lg"
      >
        <div className="p-4 bg-[#f7f5f0] rounded-lg border border-[#e8e6e1] text-sm text-[#1a1a2e] leading-relaxed font-sans whitespace-pre-wrap">
          {COOKIE_POLICY}
        </div>
        <div className="flex justify-end pt-4">
          <button
            onClick={() => setShowCookiePolicyModal(false)}
            className="bg-[#1a1a2e] text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-[#2d2d44] transition"
          >
            Kapat
          </button>
        </div>
      </ModalComponent>
    </>
  );
};

export default Footer;
