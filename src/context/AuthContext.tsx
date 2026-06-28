"use client";
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "../types";

interface AuthContextType {
  user: User | null;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // İlk render'da localStorage'dan senkron şekilde oku (F5 sonrası null görmeyi engeller)
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const savedUser = localStorage.getItem("currentUser");
      return savedUser ? (JSON.parse(savedUser) as User) : null;
    } catch (err) {
      console.error("Invalid currentUser in localStorage; clearing it.", err);
      localStorage.removeItem("currentUser");
      return null;
    }
  });

  // Diğer sekmelerden/değişikliklerden haberdar olmak için storage event'i dinle
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "currentUser") {
        try {
          setUser(e.newValue ? (JSON.parse(e.newValue) as User) : null);
        } catch {
          setUser(null);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Çıkış yapma
  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser");
    }
  };

  // Kullanıcı avatarını güncellem

  const value: AuthContextType = {
    user,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
