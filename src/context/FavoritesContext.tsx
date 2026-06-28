"use client";
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
  getFavoritesCountApi,
  getFavoritesApi,
  addToFavoritesApi,
} from "@/Api/controllers/ProductController";
import { useAuth } from "./AuthContext";
import { toast } from "react-hot-toast";

interface FavoritesContextType {
  favoriteCount: number;
  favorites: string[];
  refreshFavoriteCount: () => Promise<void>;
  incrementFavoriteCount: () => void;
  decrementFavoriteCount: () => void;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => Promise<boolean>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);

  const refreshFavorites = async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      setFavoriteCount(0);
      return;
    }

    try {
      const response = await getFavoritesApi();
      const raw = (response.data as any)?.favorites ?? response.data ?? [];
      if (Array.isArray(raw)) {
        const ids = raw.map((item: any) => String(item.id));
        setFavorites(ids);
        setFavoriteCount(ids.length);
      } else {
        setFavorites([]);
        setFavoriteCount(0);
      }
    } catch (error) {
      console.error("Favoriler yüklenirken hata:", error);
      setFavorites([]);
      setFavoriteCount(0);
    }
  };

  const refreshFavoriteCount = async () => {
    await refreshFavorites();
  };

  const incrementFavoriteCount = () => {
    setFavoriteCount((prev) => prev + 1);
  };

  const decrementFavoriteCount = () => {
    setFavoriteCount((prev) => Math.max(0, prev - 1));
  };

  const isFavorite = (productId: string) => {
    return favorites.includes(String(productId));
  };

  const toggleFavorite = async (productId: string): Promise<boolean> => {
    if (!isAuthenticated) {
      toast.error("Favorilere eklemek için lütfen giriş yapın.");
      return false;
    }

    try {
      await addToFavoritesApi(productId);
      const strId = String(productId);
      const isCurrentlyFavorited = favorites.includes(strId);

      if (isCurrentlyFavorited) {
        setFavorites((prev) => prev.filter((id) => id !== strId));
        setFavoriteCount((prev) => Math.max(0, prev - 1));
        toast.success("Ürün favorilerden çıkarıldı.");
      } else {
        setFavorites((prev) => [...prev, strId]);
        setFavoriteCount((prev) => prev + 1);
        toast.success("Ürün favorilere eklendi!");
      }
      return true;
    } catch (error) {
      console.error("Favori işlemi sırasında hata oluştu:", error);
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
      return false;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshFavorites();
    } else {
      setFavorites([]);
      setFavoriteCount(0);
    }
  }, [isAuthenticated]);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteCount,
        favorites,
        refreshFavoriteCount,
        incrementFavoriteCount,
        decrementFavoriteCount,
        isFavorite,
        toggleFavorite,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

