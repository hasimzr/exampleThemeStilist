import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // 1. Standalone Modu
    // Vercel zaten bunu otomatik optimize eder ama Dockerize etme ihtimaline karşı kalması iyidir.
    output: "standalone",

    // 2. Build Performansı ve Hata Ayıklama
    // TypeScript ve ESLint hataları build'i durdurmasın istiyorsan (geliştirme aşamasında) false yapabilirsin
    // ama production için true kalması (default) her zaman daha sağlıklıdır.
    typescript: { ignoreBuildErrors: false },

    // 3. API Proxy (Ticaretyolum API)
    async rewrites() {
        return [
            {
                source: "/proxy-api/:path*",
                destination: "https://ticaretyolum.com/api/:path*",
            },
        ];
    },

    // 4. Görsel Optimizasyonu
    images: {
        // Vercel'in Image Optimization servisini daha verimli kullanmak için
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ticaretyolum.com",
                port: "",
                pathname: "/api/images/**",
            },
        ],
    },

    // 5. Güvenlik Başlıkları (Production için kritik)
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
                ],
            },
        ];
    },

    // 6. Log Yönetimi
    logging: {
        fetches: {
            fullUrl: true,
        },
    },

    // 7. Experimental (Opsiyonel: Daha hızlı derleme için)
    experimental: {
        // Paketleri daha agresif optimize eder
        optimizePackageImports: ['lucide-react', '@headlessui/react'],
    },
};

export default nextConfig;