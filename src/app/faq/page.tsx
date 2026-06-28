import { Metadata } from "next";
import FAQContent, { FAQItem } from "./FAQContent";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular",
  description: "stlist Butik hakkında sık sorulan sorular. Kargo, sipariş takibi, ödeme seçenekleri, iade ve değişim süreçleri hakkında detaylı bilgi edinin.",
};

const faqData: FAQItem[] = [
  {
    category: "Sipariş ve Kargo",
    question: "Siparişim ne zaman kargoya verilir?",
    answer:
      "Hafta içi saat 15:00'e kadar verilen siparişleriniz aynı gün, bu saatten sonra veya hafta sonu verilen siparişleriniz ise takip eden ilk iş gününde özenle paketlenerek kargoya teslim edilmektedir.",
  },
  {
    category: "Sipariş ve Kargo",
    question: "Kargo ücreti ne kadar?",
    answer:
      "stlist Butik'te yapacağınız 1000 TL ve üzeri tüm alışverişlerinizde kargo ücretsizdir. 1000 TL altındaki siparişleriniz için standart kargo ücreti 49.90 TL'dir.",
  },
  {
    category: "Sipariş ve Kargo",
    question: "Siparişimi nasıl takip edebilirim?",
    answer:
      "Siparişiniz kargoya teslim edildiğinde SMS ve e-posta yoluyla kargo takip linkiniz iletilir. Ayrıca üye girişi yaparak 'Hesabım > Siparişlerim' ekranından güncel kargo durumunuzu anlık olarak takip edebilirsiniz.",
  },
  {
    category: "Ödeme",
    question: "Hangi ödeme yöntemlerini kabul ediyorsunuz?",
    answer:
      "Kredi kartı, banka kartı ve Havale/EFT ile ödeme gerçekleştirebilirsiniz. Anlaşmalı bankaların kredi kartlarına vade farksız taksit seçeneklerimiz mevcuttur.",
  },
  {
    category: "Ödeme",
    question: "Kart bilgilerim güvende mi?",
    answer:
      "Alışveriş güvenliğiniz bizim için birinci önceliktir. Sitemizde yapılan tüm işlemler 256-Bit SSL şifreleme protokolü ve 3D Secure güvenli ödeme altyapısı ile korunmaktadır. Kredi kartı bilgileriniz kesinlikle sunucularımızda saklanmaz.",
  },
  {
    category: "İade ve Değişim",
    question: "Satın aldığım ürünü iade edebilir miyim?",
    answer:
      "Evet, siparişinizi teslim aldığınız tarihten itibaren 14 gün içerisinde; kullanılmamış, etiketleri sökülmemiş ve tekrar satılabilirlik özelliğini kaybetmemiş ürünlerinizi ücretsiz iade koduyla kolayca iade edebilirsiniz.",
  },
  {
    category: "İade ve Değişim",
    question: "Ürün değişimi yapıyor musunuz?",
    answer:
      "Evet, satın aldığınız ürünün beden veya renk değişimi mevcuttur. Değişim talebinizi başlatmak için siparişinizle birlikte gelen değişim formunu doldurarak kargo kodu ile bize gönderebilir ya da müşteri hizmetlerimizle iletişime geçebilirsiniz.",
  },
  {
    category: "İade ve Değişim",
    question: "İade edilen ürünün ücret iadesi ne zaman yapılır?",
    answer:
      "İade ettiğiniz ürün depomuza ulaştıktan sonra kalite kontrol ekibimiz tarafından incelenir. İade şartlarına uygunluğu onaylanan ürünlerin ücret iadesi 3 ila 5 iş günü içerisinde kartınıza veya banka hesabınıza aktarılır.",
  },
  {
    category: "Hesap ve Üyelik",
    question: "Alışveriş yapmak için üye olmak zorunda mıyım?",
    answer:
      "Güvenli sipariş takibi, faturalama işlemleri ve sonraki alışverişlerinizde daha hızlı işlem yapabilmeniz adına sitemizden alışveriş yapabilmek için üye olmanız gerekmektedir. Üyelik işlemi tamamen ücretsizdir ve yalnızca birkaç saniye sürer.",
  },
  {
    category: "Hesap ve Üyelik",
    question: "Üyelere özel ayrıcalıklar nelerdir?",
    answer:
      "stlist üyeleri, yeni koleksiyon lansmanlarından ve sezon indirimlerinden öncelikli olarak haberdar olurlar. Ayrıca doğum günlerine özel sürpriz indirim kuponları ve sadece üyelere özel yürütülen hediye kampanyalarından yararlanma fırsatına sahip olurlar.",
  },
  {
    category: "Genel",
    question: "Kıyafetlerin beden kalıpları nasıl? Hangi bedeni seçmeliyim?",
    answer:
      "Koleksiyonumuzdaki ürünlerin çoğu standart/rahat kalıptır. Ürün detay sayfalarında yer alan 'Beden Tablosu' yardımıyla kendi ölçülerinize en uygun bedeni seçebilir veya aklınıza takılan sorular için canlı stil danışmanımıza WhatsApp üzerinden ulaşabilirsiniz.",
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-[#fdf8f5] py-16 md:py-24">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <p className="text-[11px] font-semibold text-[#b76e79] tracking-[0.2em] uppercase mb-3">
          Yardım & Destek
        </p>
        <h1 className="text-3xl md:text-5xl font-bold text-[#2d2d2d] tracking-tight">
          Sıkça Sorulan Sorular
        </h1>
        <div className="w-12 h-[1px] bg-[#b76e79] mx-auto mt-6" />
      </div>

      <FAQContent faqData={faqData} />
    </div>
  );
};

export default FAQ;
