"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";;
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import SearchDropdown from "../SearchDropdown";
import {
  ShoppingCart,
  Heart,
  ChevronDown,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Settings,
  User,
} from "lucide-react";
import { getFileUrl } from "@/utils/file";
import logo from "@/assets/logo.png";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { favoriteCount } = useFavorites();
  const navigate = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const getUserInitial = () => {
    if (!user) return "U";
    const name = user.firstName || user.email || "U";
    return name && name[0] ? String(name[0]).toUpperCase() : "U";
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate.push("/");
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.05)]"
          : "bg-white"
      }`}
    >
      {/* Top announcement bar */}
      <div className="bg-[#1a1a2e] text-white/80 text-xs tracking-wide overflow-hidden">
        <div className="flex items-center justify-center py-2 px-4 gap-6">
          <span className="hidden sm:inline">✦ Aynı Gün Kargo</span>
          <span className="text-white/40 hidden sm:inline">|</span>
          <span>Orijinal Ürün Garantisi</span>
          <span className="text-white/40 hidden sm:inline">|</span>
          <span className="hidden sm:inline">7/24 Teknik Destek ✦</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[68px]">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <img
                src={logo.src}
                alt="Zmrelektronik Logo"
                className="w-9 h-9 object-contain group-hover:scale-105 transition-transform duration-500"
              />
              <span className="text-xl font-bold text-[#1a1a2e] tracking-tight">
                Zmr<span className="text-[#c9a84c]">elektronik</span>
              </span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <SearchDropdown />
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: "/products", label: "Ürünler" },
              { href: "/about", label: "Hakkımızda" },
              { href: "/contact", label: "İletişim" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[#6b6b7b] hover:text-[#1a1a2e] px-3 py-2 text-[13px] font-medium tracking-wide uppercase transition-colors duration-300 relative group"
              >
                {label}
                <span className="absolute bottom-0 left-3 right-3 h-[1.5px] bg-[#c9a84c] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}

            <div className="w-px h-5 bg-[#e8e6e1] mx-3" />

            {/* Favorites */}
            <button
              onClick={() => navigate.push("/dashboard?tab=favorites")}
              className="relative text-[#6b6b7b] hover:text-[#1a1a2e] p-2.5 rounded-full hover:bg-[#f7f5f0] transition-all duration-300"
              title="Favorilerim"
            >
              <Heart className="w-[18px] h-[18px]" />
              {favoriteCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#c9a84c] text-[#1a1a2e] text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white">
                  {favoriteCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative text-[#6b6b7b] hover:text-[#1a1a2e] p-2.5 rounded-full hover:bg-[#f7f5f0] transition-all duration-300"
              title="Sepetim"
            >
              <ShoppingCart className="w-[18px] h-[18px]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#1a1a2e] text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {mounted && user ? (
              <div className="relative ml-1">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center gap-2 text-[#6b6b7b] hover:text-[#1a1a2e] rounded-full px-2 py-1.5 transition-all duration-300 focus:outline-none"
                >
                  {user.avatar ? (
                    <img
                      src={getFileUrl(user.avatar)}
                      alt={user.firstName}
                      className="w-7 h-7 rounded-full ring-2 ring-[#e8e6e1]"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#1a1a2e] flex items-center justify-center text-xs font-bold text-white">
                      {getUserInitial()}
                    </div>
                  )}
                  <span className="text-sm font-medium hidden lg:block">
                    {user.firstName}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#9a9aab]" />
                </button>

                {/* Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-[#e8e6e1] rounded-xl shadow-[0_10px_40px_rgba(26,26,46,0.1)] py-1.5 z-50 animate-fadeIn">
                    <div className="px-4 py-2.5 border-b border-[#f0eeea]">
                      <p className="text-sm font-medium text-[#1a1a2e]">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-[#9a9aab] truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#6b6b7b] hover:text-[#1a1a2e] hover:bg-[#f7f5f0] transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#9a9aab]" />
                      Dashboard
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#6b6b7b] hover:text-[#1a1a2e] hover:bg-[#f7f5f0] transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 text-[#9a9aab]" />
                        Admin Paneli
                      </Link>
                    )}
                    <div className="border-t border-[#f0eeea] mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-[#c9414e] hover:text-[#c9414e] hover:bg-red-50/50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="ml-2 bg-[#1a1a2e] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#2d2d44] transition-all duration-300 flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5" />
                Giriş Yap
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-1">
            <Link
              href="/cart"
              className="relative text-[#6b6b7b] hover:text-[#1a1a2e] p-2.5 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#1a1a2e] text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={toggleMenu}
              className="text-[#6b6b7b] hover:text-[#1a1a2e] p-2.5 rounded-lg transition-colors focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden animate-fadeIn">
          <div className="px-4 pt-3 pb-4 space-y-1 bg-white border-t border-[#f0eeea]">
            <div className="pb-3">
              <SearchDropdown onClose={() => setIsMenuOpen(false)} />
            </div>

            {[
              { href: "/products", label: "Ürünler" },
              { href: "/about", label: "Hakkımızda" },
              { href: "/contact", label: "İletişim" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block text-[#6b6b7b] hover:text-[#1a1a2e] hover:bg-[#f7f5f0] px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            ))}

            <div className="border-t border-[#f0eeea] my-2" />

            <button
              onClick={() => {
                navigate.push("/dashboard?tab=favorites");
                setIsMenuOpen(false);
              }}
              className="flex items-center justify-between w-full text-[#6b6b7b] hover:text-[#1a1a2e] hover:bg-[#f7f5f0] px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Favorilerim
              </span>
              {favoriteCount > 0 && (
                <span className="bg-[#f7f5f0] text-[#c9a84c] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </button>

            {mounted && user ? (
              <>
                <div className="border-t border-[#f0eeea] my-2" />
                <div className="flex items-center gap-3 px-4 py-3">
                  {user.avatar ? (
                    <img
                      src={getFileUrl(user.avatar)}
                      alt={user.firstName + " " + user.lastName}
                      className="w-9 h-9 rounded-full"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#1a1a2e] flex items-center justify-center text-sm font-bold text-white">
                      {getUserInitial()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-[#1a1a2e]">
                      {user.firstName}
                    </p>
                    <p className="text-xs text-[#9a9aab]">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className="block text-[#6b6b7b] hover:text-[#1a1a2e] hover:bg-[#f7f5f0] px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="block text-[#6b6b7b] hover:text-[#1a1a2e] hover:bg-[#f7f5f0] px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Paneli
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-[#c9414e] hover:text-[#c9414e] hover:bg-red-50/50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block text-center bg-[#1a1a2e] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2d2d44] transition-all mx-2 mt-3"
                onClick={() => setIsMenuOpen(false)}
              >
                Giriş Yap
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
