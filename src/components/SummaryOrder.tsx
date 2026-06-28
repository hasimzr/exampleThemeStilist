"use client";
import React, { useState } from "react";
import type { Address } from "../types";
import type { PaymentInfo } from "./CreditCart";
import Basket from "./Basket";
import ModalComponent from "./ModalCompanent";
import {
  PRELIMINARY_INFORMATION_FORM,
  DISTANCE_SALES_AGREEMENT,
  KVKK_TEXT,
} from "@/data/contracts";
import {
  ShoppingCart,
  User,
  MapPin,
  CreditCard as CardIcon,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

type SummaryOrderProps = {
  address: Address | null;
  payment: PaymentInfo | undefined;
  orderData: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
  };
  onComplete?: () => void;
  onBack?: () => void;
};

const SummaryOrder: React.FC<SummaryOrderProps> = ({
  address,
  orderData,
  payment,
  onComplete,
  onBack,
}) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showKvkkModal, setShowKvkkModal] = useState(false);

  return (
    <>
      {/* Sol Panel: Sepet */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 lg:col-span-2">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b">
          <ShoppingCart className="w-5 h-5 text-cyan-600" />
          <h2 className="text-2xl font-bold text-gray-900">Sepetiniz</h2>
        </div>
        <Basket />
      </div>

      {/* Sağ Panel: Özet Bilgiler */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100 lg:col-span-1 h-fit">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b">
          <ShieldCheck className="w-5 h-5 text-green-600" />
          <h2 className="text-xl font-bold text-gray-900">Sipariş Özeti</h2>
        </div>

        {/* Sözleşmeler */}
        <div className="mb-6 space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 border-gray-300 rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer"
              />
            </div>
            <label htmlFor="terms" className="text-sm text-gray-700 select-none">
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="text-cyan-600 hover:text-cyan-800 underline font-medium cursor-pointer text-left"
              >
                Ön Bilgilendirme Formu ve Mesafeli Satış Sözleşmesi
              </button>
              'ni okudum, onaylıyorum.
            </label>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex items-center h-5">
              <input
                id="kvkk"
                type="checkbox"
                checked={kvkkAccepted}
                onChange={(e) => setKvkkAccepted(e.target.checked)}
                className="w-4 h-4 border-gray-300 rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer"
              />
            </div>
            <label htmlFor="kvkk" className="text-sm text-gray-700 select-none">
              <button
                type="button"
                onClick={() => setShowKvkkModal(true)}
                className="text-cyan-600 hover:text-cyan-800 underline font-medium cursor-pointer text-left"
              >
                KVKK Aydınlatma Metni
              </button>
              'ni okudum.
            </label>
          </div>
        </div>

        {/* Kullanıcı Bilgileri */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            {/* Onayla */}
            <button
              onClick={() => onBack && onBack()}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-200 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-xl"
            >
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
                  d="M11 7l-5 5m0 0l5 5m-5-5H18"
                />
              </svg>
              <span>ödeme yap'a dön</span>
            </button>
            <button
              disabled={!address || !payment || !termsAccepted}
              onClick={onComplete}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-xl hidden lg:inline-flex"
            >
              Siparişi Tamamla
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-gray-700" />
            <h3 className="text-sm font-semibold text-gray-800">
              Kullanıcı Bilgileri
            </h3>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-sm text-gray-700">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="font-medium">Ad:</span>{" "}
                {orderData.firstName || "-"}
              </div>
              <div>
                <span className="font-medium">Soyad:</span>{" "}
                {orderData.lastName || "-"}
              </div>
              <div>
                <span className="font-medium">E-posta:</span>{" "}
                {orderData.email || "-"}
              </div>
              <div>
                <span className="font-medium">Telefon:</span>{" "}
                {orderData.phone || "-"}
              </div>
            </div>
          </div>
        </div>

        {/* Adres Bilgisi */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-gray-700" />
            <h3 className="text-sm font-semibold text-gray-800">
              Adres Bilgisi
            </h3>
          </div>
          {address ? (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-sm text-gray-700 space-y-1">
              <div>
                <span className="font-medium">Başlık:</span> {address.title}
              </div>
              <div>
                <span className="font-medium">Ad Soyad:</span>{" "}
                {address.fullName}
              </div>
              <div>
                <span className="font-medium">Telefon:</span> {address.phone}
              </div>
              {address.type === "INDIVIDUAL" && address.tc && (
                <div>
                  <span className="font-medium">T.C. No:</span> {address.tc}
                </div>
              )}
              {address.type === "CORPORATE" && (
                <>
                  <div>
                    <span className="font-medium">Firma Ünvanı:</span>{" "}
                    {address.companyName}
                  </div>
                  <div>
                    <span className="font-medium">Vergi Dairesi:</span>{" "}
                    {address.taxOffice}
                  </div>
                  <div>
                    <span className="font-medium">Vergi No:</span>{" "}
                    {address.taxNumber}
                  </div>
                </>
              )}
              <div>
                <span className="font-medium">Adres:</span>{" "}
                {address.addressLine}
              </div>
              <div>
                <span className="font-medium">Mahalle:</span>{" "}
                {address.neighborhood || "-"}
              </div>
              <div>
                <span className="font-medium">İlçe:</span> {address.district}
              </div>
              <div>
                <span className="font-medium">Şehir:</span> {address.city}
              </div>
              <div>
                <span className="font-medium">Posta Kodu:</span>{" "}
                {address.postalCode || "-"}
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">Adres seçilmedi.</div>
          )}
        </div>

        {/* Ödeme Bilgisi */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <CardIcon className="w-4 h-4 text-gray-700" />
            <h3 className="text-sm font-semibold text-gray-800">
              Ödeme Bilgisi
            </h3>
          </div>
          {payment ? (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-sm text-gray-700 space-y-1">
              {payment.paymentMethod === "creditCard" && (
                <>
                  <div>
                    <span className="font-medium">Ödeme Yöntemi:</span> Kredi
                    Kartı
                  </div>
                  <div>
                    <span className="font-medium">Kart Sahibi:</span>{" "}
                    {payment.cardHolder}
                  </div>
                  <div>
                    <span className="font-medium">Kart Numarası:</span> ****
                    **** **** {payment.cardNumber?.slice(-4)}
                  </div>
                  <div>
                    <span className="font-medium">Son Kullanma:</span>{" "}
                    {payment.expiryMonth}/{payment.expiryYear}
                  </div>
                </>
              )}
              {payment.paymentMethod === "cashOnDelivery" && (
                <>
                  <div>
                    <span className="font-medium">Ödeme Yöntemi:</span> Kapıda
                    Ödeme
                  </div>
                  <div className="text-gray-600 mt-2">
                    Ödemenizi teslimat sırasında nakit veya kredi kartı ile
                    yapabilirsiniz.
                  </div>
                </>
              )}
              {payment.paymentMethod === "bankTransfer" && (
                <>
                  <div>
                    <span className="font-medium">Ödeme Yöntemi:</span> Banka
                    Transferi
                  </div>
                  {payment.selectedBank && (
                    <>
                      <div>
                        <span className="font-medium">Banka:</span>{" "}
                        {payment.selectedBank.bankName}
                      </div>
                      <div>
                        <span className="font-medium">Hesap Sahibi:</span>{" "}
                        {payment.selectedBank.accountHolder}
                      </div>
                      <div>
                        <span className="font-medium">IBAN:</span>{" "}
                        {payment.selectedBank.iban}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              Ödeme bilgisi girilmedi.
            </div>
          )}
        </div>

        {/* Güvenlik Notu */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <span>256-bit SSL ile güvenli ödeme</span>
        </div>
      </div>

      {/* Mobile Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 lg:hidden">
        <button
          disabled={!address || !payment || !termsAccepted}
          onClick={onComplete}
          className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span>Siparişi Tamamla</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Sözleşme Modalları */}
      <ModalComponent
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="Ön Bilgilendirme Formu ve Satış Sözleşmesi"
        size="lg"
      >
        <div className="space-y-6 text-sm text-gray-700 leading-relaxed font-sans p-2">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              ÖN BİLGİLENDİRME FORMU
            </h3>
            <div className="whitespace-pre-wrap pl-1">
              {PRELIMINARY_INFORMATION_FORM}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              MESAFELİ SATIŞ SÖZLEŞMESİ
            </h3>
            <div className="whitespace-pre-wrap pl-1">
              {DISTANCE_SALES_AGREEMENT}
            </div>
          </div>

          <div className="flex justify-end pt-4 sticky bottom-0 bg-white border-t border-gray-100 p-4 -mx-6 -mb-6 mt-4">
            <button
              onClick={() => {
                setTermsAccepted(true);
                setShowTermsModal(false);
              }}
              className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-800 transition shadow-sm hover:shadow"
            >
              Okudum, Onaylıyorum
            </button>
          </div>
        </div>
      </ModalComponent>

      <ModalComponent
        isOpen={showKvkkModal}
        onClose={() => setShowKvkkModal(false)}
        title="KVKK Aydınlatma Metni"
        size="lg"
      >
        <div className="space-y-6 text-sm text-gray-700 leading-relaxed font-sans p-2">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="whitespace-pre-wrap pl-1">{KVKK_TEXT}</div>
          </div>

          <div className="flex justify-end pt-4 sticky bottom-0 bg-white border-t border-gray-100 p-4 -mx-6 -mb-6 mt-4">
            <button
              onClick={() => {
                setKvkkAccepted(true);
                setShowKvkkModal(false);
              }}
              className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-800 transition shadow-sm hover:shadow"
            >
              Okudum
            </button>
          </div>
        </div>
      </ModalComponent>
    </>
  );
};

export default SummaryOrder;
