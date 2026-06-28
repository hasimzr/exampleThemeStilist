import { Metadata } from "next";
import { Sparkles, Heart, Award, ShieldCheck, Gem, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "stlist Butik - Hikayemiz, değerlerimiz ve modern kadının gardırobuna zarafet katan felsefemiz. Özenle seçilmiş, şık ve kaliteli tasarımlar.",
};

const About = () => {
  return (
    <div className="min-h-screen bg-[#fdf8f5] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-20">
          <p className="text-[11px] font-semibold text-[#b76e79] tracking-[0.2em] uppercase mb-3">
            Biz Kimiz?
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-[#2d2d2d] tracking-tight">
            stlist Butik Hikayesi
          </h1>
          <div className="w-12 h-[1px] bg-[#b76e79] mx-auto mt-6" />
        </div>

        {/* Brand Story & Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center mb-20 md:mb-28">
          {/* Text Content */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#f0e6df] transition-all hover:shadow-md duration-300">
            <h2 className="text-2xl font-bold text-[#2d2d2d] mb-6 flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#b76e79]" />
              Tarzınızı Yansıtan Özgün Parçalar
            </h2>
            <div className="space-y-6 text-sm text-[#8a7e78] leading-relaxed">
              <p>
                <strong className="text-[#2d2d2d] font-semibold">stlist Butik</strong>, modern kadının dinamik, özgüvenli ve zarif duruşunu tamamlamak amacıyla kurulan, özgün tasarım ve seçkin kalite anlayışını benimsemiş bir moda platformudur.
              </p>
              <p>
                Her kadının stilinin, onun en kişisel ifadesi olduğuna inanıyoruz. Bu nedenle stlist olarak, geçici akımların ötesinde, zamansız zarafeti ve konforu bir arada sunan özel koleksiyonlar hazırlıyoruz. Gardırobunuza dahil edeceğiniz her bir parçanın, kendinizi özel ve rahat hissettirmesini önemsiyoruz.
              </p>
              <p>
                Koleksiyonlarımızda yer alan ürünleri belirlerken kaliteli kumaş dokularına, kusursuz kalıplara ve dikiş detaylarına özen gösteriyoruz. Gündüzden geceye, ofisten sokak stiline kadar hayatın her anında size eşlik edecek şık ve fonksiyonel seçenekleri bir araya getirmek temel prensibimizdir.
              </p>
            </div>
          </div>

          {/* Visual Highlight Card */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-[#b76e79]/5 rounded-3xl blur-2xl -m-4" />
            <div className="relative bg-gradient-to-br from-[#2d2d2d] via-[#3a3035] to-[#2d2d2d] rounded-3xl p-8 md:p-10 text-white shadow-xl">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03]" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }} />
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <Crown className="w-6 h-6 text-[#d4a373]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Seçkin Deneyim</h3>
              <p className="text-sm text-white/70 leading-relaxed mb-6 font-light">
                stlist ile yalnızca alışveriş yapmaz, özenle tasarlanmış bir butik deneyimini yaşarsınız. Hızlı kargo, şık paketleme ve kişisel stil rehberliğiyle her adımda yanınızdayız.
              </p>
              <div className="flex items-center gap-3 pt-6 border-t border-white/10">
                <div className="w-8 h-8 rounded-full bg-[#b76e79]/20 flex items-center justify-center text-[#d4a373] text-xs font-semibold">
                  100%
                </div>
                <span className="text-xs text-white/80 font-medium tracking-wide">Müşteri Memnuniyeti Odaklı Hizmet</span>
              </div>
            </div>
          </div>
        </div>

        {/* Core Pillars / Values Grid */}
        <div className="mb-20 md:mb-28">
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold text-[#b76e79] tracking-[0.2em] uppercase mb-3">
              Koleksiyon Felsefemiz
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#2d2d2d] tracking-tight">
              Bizi Farklı Kılan Özellikler
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Gem,
                title: "Özenle Seçilmiş Koleksiyonlar",
                desc: "Her parça, kalitesi ve duruşu titizlikle analiz edilerek sınırlı sayıda seçilir ve beğeninize sunulur."
              },
              {
                icon: ShieldCheck,
                title: "Premium Kumaş & İşçilik",
                desc: "Gün boyu rahatlık ve şıklık vadeden, cildinize dost doğal lifler ve özenli terzilik dikişleri."
              },
              {
                icon: Compass,
                title: "Zamansız Tasarımlar",
                desc: "Hızla tüketilen trendlerin ötesinde, her sezon gardırobunuzun kurtarıcı parçası olacak modern tasarımlar."
              },
              {
                icon: Heart,
                title: "Kişisel Stil Dokunuşu",
                desc: "Sadece bir ürün satışı değil; doğru kombinler, beden uyumları ve kesintisiz müşteri desteği sunuyoruz."
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#f0e6df] hover:border-[#b76e79]/30 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#fdf8f5] flex items-center justify-center mb-5 group-hover:bg-[#b76e79]/10 transition-colors duration-300">
                  <item.icon className="w-5 h-5 text-[#b76e79]/70 group-hover:text-[#b76e79] transition-colors duration-300" />
                </div>
                <h3 className="font-bold text-[#2d2d2d] text-base mb-3 leading-snug">{item.title}</h3>
                <p className="text-xs text-[#8a7e78] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Vision Quote Box */}
        <div className="bg-[#faf5f0] border border-[#f0e6df] rounded-[2rem] p-8 md:p-16 text-center max-w-4xl mx-auto shadow-sm relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#b76e79]/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#f0e6df]">
              <Award className="w-5 h-5 text-[#b76e79]" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#2d2d2d] mb-4">
              Vizyonumuz
            </h2>
            <p className="text-sm md:text-base text-[#8a7e78] max-w-2xl mx-auto mb-6 leading-relaxed font-light italic">
              &ldquo;Moda geçici, stil ise kalıcıdır. Amacımız, trendlerin peşinden koşmak yerine, kendi özgün stilini keşfetmek ve tarzını zarafetle taşımak isteyen tüm kadınlara ilham kaynağı olmaktır.&rdquo;
            </p>
            <div className="w-8 h-[1px] bg-[#b76e79]/30 mx-auto" />
          </div>
        </div>

      </div>
    </div>
  );
};

// Simple inline SVG helper for Crown icon to avoid importing issues if Lucide version doesn't have it
const Crown = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
    <path d="M5 20h14" />
  </svg>
);

export default About;
