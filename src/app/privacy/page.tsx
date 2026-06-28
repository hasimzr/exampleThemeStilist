import { Metadata } from "next";
import { Shield, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "Zmrelektronik gizlilik politikası ve kullanım şartları. Verilerinizin güvenliği ve haklarınız hakkında bilgi edinin.",
};

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Gizlilik Politikası ve Kullanım Şartları
          </h1>
          <p className="text-xl text-blue-100">
            Verilerinizin güvenliği bizim için önemlidir
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Gizlilik Politikası */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Gizlilik Politikası
            </h2>
          </div>

          <div className="prose max-w-none text-gray-700 space-y-6">
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                1. Bilgi Toplama ve Kullanımı
              </h3>
              <p>
                E-Shop olarak, size daha iyi hizmet verebilmek için bazı kişisel
                bilgilerinizi topluyoruz. Bu bilgiler arasında adınız, e-posta
                adresiniz, telefon numaranız ve teslimat adresiniz
                bulunmaktadır.
              </p>
              <p>
                Topladığımız bilgiler yalnızca sipariş işlemlerinizi
                gerçekleştirmek, size daha iyi hizmet sunmak ve yasal
                yükümlülüklerimizi yerine getirmek için kullanılır.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                2. Veri Güvenliği
              </h3>
              <p>
                Kişisel verilerinizin güvenliği bizim için önceliklidir. Tüm
                bilgileriniz 256-bit SSL sertifikası ile şifrelenerek
                korunmaktadır. Ödeme bilgileriniz hiçbir şekilde sistemlerimizde
                saklanmaz.
              </p>
              <p>
                Verilerinize yetkisiz erişimi önlemek için endüstri standardı
                güvenlik önlemleri kullanıyoruz. Çalışanlarımız gizlilik
                anlaşmaları ile bağlıdır.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                3. Çerezler (Cookies)
              </h3>
              <p>
                Web sitemiz, kullanıcı deneyimini geliştirmek için çerezler
                kullanır. Çerezler, tarayıcınız tarafından bilgisayarınızda
                saklanan küçük veri dosyalarıdır.
              </p>
              <p>
                Çerezleri kullanarak tercihlerinizi hatırlayabilir, alışveriş
                sepetinizi saklayabilir ve size özel içerik sunabiliriz.
                Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                4. Üçüncü Taraf Paylaşımı
              </h3>
              <p>
                Kişisel bilgilerinizi üçüncü taraflarla paylaşmıyoruz. Yalnızca
                yasal zorunluluklar veya sipariş teslimatı için gerekli
                olduğunda (kargo şirketleri gibi) sınırlı bilgi paylaşımı
                yapılır.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                5. Haklarınız
              </h3>
              <p>
                KVKK (Kişisel Verilerin Korunması Kanunu) kapsamında aşağıdaki
                haklara sahipsiniz:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>
                  Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme
                </li>
                <li>Kişisel verilerinizin işlenme amacını öğrenme</li>
                <li>
                  Kişisel verilerinizin yanlış veya eksikse düzeltilmesini
                  isteme
                </li>
                <li>
                  Kişisel verilerinizin silinmesini veya yok edilmesini isteme
                </li>
              </ul>
            </section>
          </div>
        </div>

        {/* Kullanım Şartları */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              Kullanım Şartları
            </h2>
          </div>

          <div className="prose max-w-none text-gray-700 space-y-6">
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                1. Genel Koşullar
              </h3>
              <p>
                E-Shop web sitesini kullanarak bu kullanım şartlarını kabul
                etmiş sayılırsınız. Bu şartlara uymayı kabul etmiyorsanız,
                sitemizi kullanmamalısınız.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                2. Hesap Güvenliği
              </h3>
              <p>
                Hesabınızın güvenliğinden siz sorumlusunuz. Şifrenizi kimseyle
                paylaşmamalı ve güçlü bir şifre kullanmalısınız. Hesabınızda
                yetkisiz bir kullanım fark ederseniz, derhal bize
                bildirmelisiniz.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                3. Sipariş ve Fiyatlandırma
              </h3>
              <p>
                Tüm fiyatlar Türk Lirası (TL) cinsinden ve KDV dahildir.
                Fiyatlar bildirim yapılmaksızın değiştirilebilir. Sipariş onayı
                sonrasında ödemeniz alınır ve sipariş işleme konur.
              </p>
              <p>
                Stokta olmayan ürünler için sipariş kabul edilmez. Ödeme sonrası
                stokta sorun tespit edilirse, ödemeniz iade edilir.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                4. İade ve İptal
              </h3>
              <p>
                Tüketici haklarınız kapsamında, ürünü teslim aldığınız tarihten
                itibaren 14 gün içinde herhangi bir sebep göstermeksizin iade
                edebilirsiniz. İade edilen ürünler kullanılmamış ve orijinal
                ambalajında olmalıdır.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                5. Fikri Mülkiyet
              </h3>
              <p>
                Bu web sitesindeki tüm içerik, tasarım, logo, metin ve görseller
                E-Shop'un mülkiyetindedir ve telif hakları ile korunmaktadır.
                İzinsiz kullanım yasaktır.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                6. Sorumluluk Reddi
              </h3>
              <p>
                E-Shop, web sitesinin kesintisiz ve hatasız çalışacağını garanti
                etmez. Teknik sorunlar nedeniyle oluşabilecek kayıplardan
                sorumlu tutulamaz.
              </p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                7. İletişim
              </h3>
              <p>
                Gizlilik politikası ve kullanım şartları hakkında sorularınız
                için
                <a
                  href="/contact"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  {" "}
                  iletişim sayfamızdan
                </a>{" "}
                bize ulaşabilir veya{" "}
                <a
                  href="mailto:info@eshop.com"
                  className="text-blue-600 hover:text-blue-700 font-semibold"
                >
                  info@eshop.com
                </a>
                adresine e-posta gönderebilirsiniz.
              </p>
            </section>

            <div className="mt-8 pt-8 border-t text-sm text-gray-600">
              <p>Son güncelleme: 4 Kasım 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
