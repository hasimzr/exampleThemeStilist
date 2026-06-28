'use client';

import { useEffect } from 'react';

export default function ThemePreviewProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const handlePreviewMessage = (event: MessageEvent) => {
            // Dashboard'dan gelen 'THEME_UPDATE' mesajlarını yakala
            if (event.data?.type === 'THEME_UPDATE') {
                const { objectId, value } = event.data;

                if (!objectId) return;

                // Dashboard tarafındaki objectId ile ID'si eşleşen elementi bul
                const element = document.getElementById(objectId);

                if (element) {
                    const tagName = element.tagName.toLowerCase();
                    // 1. Eğer element bir HTML img etiketi ise
                    if (tagName === 'img') {
                        // Next.js (veya browser) responsive resim mekanizmasını (srcset) devre dışı bırak
                        (element as HTMLImageElement).srcset = "";
                        // Yeni resmi (Base64 veya URL) ata
                        (element as HTMLImageElement).src = value;
                    } 
                    // 2. Eğer element bir link etiketi (örn. favicon) veya a (anchor) etiketi ise
                    else if (tagName === 'link' || tagName === 'a') {
                        element.setAttribute('href', value);
                    }
                    // 3. Eğer element standart bir yazı alanı ise
                    else {
                        element.innerText = value;
                    }
                }
            }
        };

        window.addEventListener('message', handlePreviewMessage);
        return () => window.removeEventListener('message', handlePreviewMessage);
    }, []);

    return <>{children}</>;
}

