import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import ClientProviders from "@/components/layout/ClientProviders";
import ApiProvider from "@/Api/ApiProvider";
import { Toaster } from "react-hot-toast";
import "../index.css";
import "../App.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: "Zmrelektronik - Elektronik Bileşen & Geliştirme Kartları",
        template: "%s | Zmrelektronik"
    },
    description: "Zmrelektronik - Arduino, Raspberry Pi, sensörler ve 10.000+ elektronik bileşen çeşidi için güvenilir alışveriş adresi. Projeniz için teknik destek ve hızlı kargo.",
    keywords: ["elektronik bileşen", "arduino", "raspberry pi", "sensörler", "geliştirme kartları", "robotik", "mühendislik"],
    alternates: {
        canonical: 'https://zmrelektronik.com',
    },
    openGraph: {
        title: "Zmrelektronik - Elektronik Bileşen & Geliştirme Kartları",
        description: "Arduino, Raspberry Pi ve binlerce elektronik modül için en doğru adres. Hızlı kargo ve teknik destekle yanınızdayız.",
        url: 'https://zmrelektronik.com',
        siteName: 'Zmrelektronik',
        locale: 'tr_TR',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'google-site-verification-id', // User should replace this
    },
    icons: {
        icon: '/favicon.jpg',
        apple: '/apple-touch-icon.png',
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Zmrelektronik',
    image: 'https://zmrelektronik.com/logo.png', // Update with actual logo URL
    '@id': 'https://zmrelektronik.com',
    url: 'https://zmrelektronik.com',
    telephone: '+908500000000', // Update with actual phone
    address: {
        '@type': 'PostalAddress',
        streetAddress: 'Merkez Mah. No:1', // Update with actual address
        addressLocality: 'Istanbul',
        postalCode: '34000',
        addressCountry: 'TR',
    },
    geo: {
        '@type': 'GeoCoordinates',
        latitude: 41.0082,
        longitude: 28.9784,
    },
    openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ],
        opens: '09:00',
        closes: '18:00',
    }
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="tr" suppressHydrationWarning>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className={inter.className}>
                <div id="root">
                    <ApiProvider>
                        <ClientProviders>
                            <Toaster position="top-right" reverseOrder={false} />
                            <Navbar />
                            {children}
                            <WhatsAppButton />
                            <Footer />
                        </ClientProviders>
                    </ApiProvider>
                </div>
            </body>
        </html>
    );
}
