# E-Shop - Modern E-Ticaret Template# React + TypeScript + Vite

React ile geliştirilmiş, modern ve responsive bir e-ticaret web sitesi template'i (frontend-only).This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## 🚀 ÖzelliklerCurrently, two official plugins are available:

### Ana Özellikler- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- ✅ Modern, responsive ve profesyonel tasarım- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- ✅ TailwindCSS ile stilize edilmiş bileşenler

- ✅ React Router DOM ile sayfa yönlendirme## React Compiler

- ✅ Context API ile global state yönetimi

- ✅ TypeScript desteğiThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

- ✅ Mock veri ile tam fonksiyonel UI

## Expanding the ESLint configuration

### Sayfalar

- 🏠 **Ana Sayfa**: Hero section, öne çıkan ürünler, kategorilerIf you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

- 🛍️ **Ürünler**: Filtreleme, sıralama, kategori bazlı görüntüleme

- 📦 **Ürün Detay**: Detaylı ürün bilgisi, sepete ekleme```js

- 🛒 **Sepet**: Ürün yönetimi, toplam hesaplamaexport default defineConfig([

- 👤 **Giriş/Kayıt**: Kullanıcı kimlik doğrulama (mock) globalIgnores(['dist']),

- 📊 **Kullanıcı Paneli**: Sipariş geçmişi, kargo takibi {

- ⚙️ **Admin Panel**: Ürün ve sipariş yönetimi files: ['**/*.{ts,tsx}'],

- ℹ️ **Hakkımızda**: Şirket tanıtımı extends: [

- 📧 **İletişim**: İletişim formu // Other configs...

- ❓ **SSS**: Sık sorulan sorular

- 🔒 **Gizlilik**: Gizlilik politikası ve kullanım şartları // Remove tseslint.configs.recommended and replace with this

      tseslint.configs.recommendedTypeChecked,

### Bileşenler // Alternatively, use this for stricter rules

- **Navbar**: Dinamik sepet ikonu, kullanıcı menüsü, kategori dropdown tseslint.configs.strictTypeChecked,

- **Footer**: Sosyal medya linkleri, hızlı bağlantılar // Optionally, add this for stylistic rules

- **ProductCard**: Ürün kartları, rating, sepete ekleme tseslint.configs.stylisticTypeChecked,

- **Context**: Auth ve Cart için global state yönetimi

      // Other configs...

## 🛠️ Teknolojiler ],

    languageOptions: {

- **React 19** - UI framework parserOptions: {

- **TypeScript** - Type safety project: ['./tsconfig.node.json', './tsconfig.app.json'],

- **React Router DOM** - Routing tsconfigRootDir: import.meta.dirname,

- **TailwindCSS 4** - Styling },

- **Lucide React** - İkonlar // other options...

- **Vite** - Build tool },

  },

## 📦 Kurulum])

````

```bash

# Bağımlılıkları yükleYou can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

npm install

```js

# Geliştirme sunucusunu başlat// eslint.config.js

npm run devimport reactX from 'eslint-plugin-react-x'

import reactDom from 'eslint-plugin-react-dom'

# Production build

npm run buildexport default defineConfig([

  globalIgnores(['dist']),

# Build önizleme  {

npm run preview    files: ['**/*.{ts,tsx}'],

```    extends: [

      // Other configs...

## 🎨 Proje Yapısı      // Enable lint rules for React

      reactX.configs['recommended-typescript'],

```      // Enable lint rules for React DOM

src/      reactDom.configs.recommended,

├── components/          # React bileşenleri    ],

│   ├── layout/         # Navbar, Footer    languageOptions: {

│   ├── product/        # ProductCard      parserOptions: {

│   └── common/         # LoadingSpinner        project: ['./tsconfig.node.json', './tsconfig.app.json'],

├── pages/              # Sayfa bileşenleri        tsconfigRootDir: import.meta.dirname,

│   ├── Home.tsx      },

│   ├── Products.tsx      // other options...

│   ├── ProductDetail.tsx    },

│   ├── Cart.tsx  },

│   ├── Login.tsx])

│   ├── Register.tsx```

│   ├── Dashboard.tsx
│   ├── Admin.tsx
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── FAQ.tsx
│   └── Privacy.tsx
├── context/            # Context API
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── data/               # Mock veriler
│   ├── products.ts
│   ├── categories.ts
│   └── users.ts
├── types/              # TypeScript tipleri
│   └── index.ts
├── App.tsx             # Ana uygulama
└── main.tsx           # Giriş noktası
````

## 👥 Demo Hesaplar

### Admin Hesabı

- **E-posta**: admin@example.com
- **Şifre**: admin123

### Kullanıcı Hesabı

- **E-posta**: ahmet@example.com
- **Şifre**: user123

## 🎯 Kullanım

1. Uygulamayı başlattıktan sonra `http://localhost:5173` adresine gidin
2. Demo hesaplardan biriyle giriş yapın veya yeni hesap oluşturun
3. Ürünleri inceleyin, sepete ekleyin
4. Admin hesabıyla giriş yaparak admin paneline erişin
5. Tüm özellikler mock veri ile çalışır (backend bağlantısı yoktur)

## 🌟 Özellik Detayları

### State Yönetimi

- **AuthContext**: Kullanıcı kimlik doğrulama, giriş/çıkış
- **CartContext**: Sepet işlemleri, ürün ekleme/çıkarma, toplam hesaplama

### Responsive Tasarım

- Mobil, tablet ve desktop için optimize edilmiş
- Hamburger menü (mobil)
- Grid sistemler ile esnek yapı

### Kategori ve Filtreleme

- 5 ana kategori, her biri alt kategorilere sahip
- Fiyat aralığı filtresi
- Sıralama seçenekleri (fiyat, puan, yeni)

### Kullanıcı Deneyimi

- Smooth transitions
- Loading states
- Error handling
- Success messages
- Toast notifications

## 📝 Notlar

- Bu proje **frontend-only** bir template'dir
- Tüm veriler mock olarak tanımlanmıştır
- LocalStorage kullanılarak veri kalıcılığı sağlanır
- Gerçek bir backend entegrasyonu için API servisleri eklenmelidir

## 🔜 Geliştirme Fikirleri

- [ ] Backend API entegrasyonu
- [ ] Gerçek ödeme sistemi
- [ ] Ürün arama özelliği
- [ ] Favoriler sistemi
- [ ] Ürün karşılaştırma
- [ ] Wishlist
- [ ] Ürün yorumları
- [ ] Dark mode
- [ ] Çoklu dil desteği

## 📄 Lisans

Bu proje eğitim amaçlıdır ve özgürce kullanılabilir.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

**Geliştirici:** E-Shop Team  
**Tarih:** 2024  
**Versiyon:** 1.0.0
# zmrelektronik
# zmrelektronik
# zmrelektronikNextJs
# exampleThemeStilist
