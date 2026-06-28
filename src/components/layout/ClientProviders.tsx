"use client";

import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import ThemePreviewProvider from "@/context/ThemePreviewProvider";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <CartProvider>
                <FavoritesProvider>
                    <ThemePreviewProvider>
                        {children}
                    </ThemePreviewProvider>
                </FavoritesProvider>
            </CartProvider>
        </AuthProvider>
    );
}
