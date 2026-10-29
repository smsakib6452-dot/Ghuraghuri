"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Compass,
  Hotel,
  UtensilsCrossed,
  Bus,
  CloudSun,
  Sparkles,
  Sun,
  Moon,
  Menu,
  X,
  Bookmark,
  Map as MapIcon,
  CalendarDays,
} from "lucide-react";

export function Header() {
  const { language, toggleLanguage, theme, toggleTheme, bookmarks } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const triggerButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll and manage focus when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "";
      if (mounted) {
        triggerButtonRef.current?.focus();
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, mounted]);

  // Close menu when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const isBn = language === "bn";

  const navLinks = [
    {
      href: "/destinations",
      label: isBn ? "গন্তব্যসমূহ" : "Destinations",
      icon: Compass,
    },
    {
      href: "/hotels",
      label: isBn ? "হোটেল" : "Hotels",
      icon: Hotel,
    },
    {
      href: "/restaurants",
      label: isBn ? "রেস্তোরাঁ" : "Restaurants",
      icon: UtensilsCrossed,
    },
    {
      href: "/transport",
      label: isBn ? "যাতায়াত" : "Transport",
      icon: Bus,
    },
    {
      href: "/#map",
      label: isBn ? "মানচিত্র" : "Map",
      icon: MapIcon,
    },
    {
      href: "/weather",
      label: isBn ? "আবহাওয়া" : "Weather",
      icon: CloudSun,
    },
    {
      href: "/chattogram",
      label: isBn ? "চট্টগ্রাম" : "Chattogram",
      icon: Sparkles,
      highlight: true,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full glass-nav transition-all duration-300">
        {/* Skip to Content for WCAG Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#0f4a38] focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none"
        >
          {isBn ? "সরাসরি মূল অংশে যান" : "Skip to main content"}
        </a>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Authentic Brand */}
            <Link
              href="/"
              className="flex items-center gap-2 group focus:outline-none py-1 min-h-[48px] overflow-visible relative"
              aria-label="Ghuraghuri Homepage"
            >
              <div className="relative flex items-center h-10 sm:h-12 w-auto">
                <Image
                  src="/assets/logo.webp"
                  alt=""
                  width={160}
                  height={50}
                  className="h-10 sm:h-12 w-auto object-contain brand-logo-light group-hover:scale-105 transition-transform duration-200 drop-shadow-sm"
                  priority
                />
                <Image
                  src="/assets/logo-dark.webp"
                  alt=""
                  width={160}
                  height={50}
                  className="h-10 sm:h-12 w-auto object-contain brand-logo-dark group-hover:scale-105 transition-transform duration-200 drop-shadow-md"
                  priority
                />
              </div>
              <span className="sr-only">
                {isBn ? "ঘুরাঘুরি · বাংলাদেশ" : "Ghuraghuri · Explore Bangladesh"}
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                const isDirect = link.href === "/chattogram";
                const LinkComp = isDirect ? "a" : Link;

                return (
                  <LinkComp
                    key={link.href}
                    href={link.href}
                    prefetch={isDirect ? undefined : false}
                    className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-[#0f4a38] text-white shadow-sm dark:bg-[#10B981] dark:text-black font-bold"
                        : link.highlight
                        ? "text-[#f4a340] hover:bg-[#f4a340]/10 font-bold"
                        : "text-foreground/80 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 xl:w-4 xl:h-4 opacity-80" />
                    <span>{link.label}</span>
                  </LinkComp>
                );
              })}
            </nav>

            {/* Right Action Controls: Lang Toggle, Theme Toggle, Bookmarks, Hamburger (Consistent 44x44px affordances) */}
            <div className="flex items-center gap-2">
              {/* Saved Bookmarks Counter */}
              {bookmarks.length > 0 && (
                <Link
                  href="/destinations?saved=true"
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl border border-[var(--border-color)] bg-surface/80 hover:bg-black/5 dark:hover:bg-white/10 transition-colors grid place-items-center relative"
                  title={isBn ? "সংরক্ষিত গন্তব্য" : "Saved Destinations"}
                  aria-label="View saved bookmarks"
                >
                  <Bookmark className="w-[22px] h-[22px] text-[#f4a340] fill-[#f4a340]" />
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#0f4a38] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {bookmarks.length}
                  </span>
                </Link>
              )}

              {/* Language Switch Button (44x44px hit target, consistent container) */}
              <button
                onClick={toggleLanguage}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl border border-[var(--border-color)] bg-surface/80 hover:bg-black/5 dark:hover:bg-white/10 transition-all grid place-items-center cursor-pointer text-[#047857] dark:text-[#2ecc71] font-bold text-xs"
                aria-label={isBn ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
              >
                <span>{isBn ? "EN" : "বাং"}</span>
              </button>

              {/* Dark / Light Mode Switch (44x44px hit target, consistent container) */}
              <button
                onClick={toggleTheme}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl border border-[var(--border-color)] bg-surface/80 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer text-foreground/80 grid place-items-center"
                aria-label={theme === "dark" ? "Switch to Light mode" : "Switch to Dark mode"}
              >
                {theme === "dark" ? (
                  <Sun className="w-[22px] h-[22px] text-[#f4a340]" />
                ) : (
                  <Moon className="w-[22px] h-[22px] text-[#047857]" />
                )}
              </button>

              {/* Mobile Menu Hamburger (Consistent 44x44px hit area with aria-controls & ref) */}
              <button
                ref={triggerButtonRef}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl border border-[var(--border-color)] bg-surface/80 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer grid place-items-center text-foreground"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation-drawer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Portaled Full-Screen Mobile Drawer: Rendered outside header to prevent backdrop-filter trap */}
      {mounted && mobileMenuOpen && createPortal(
        <div
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="lg:hidden fixed inset-0 z-[9999] h-[100dvh] w-full overflow-y-auto bg-[#fbfdfc] dark:bg-[#061510] flex flex-col justify-between animate-in fade-in duration-200"
        >
          {/* Top Bar inside Drawer: Logo & Close Button */}
          <div className="flex items-center justify-between h-20 px-4 sm:px-6 border-b border-black/10 dark:border-white/10 shrink-0 bg-[#fbfdfc] dark:bg-[#061510]">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 group focus:outline-none min-h-[48px]"
              aria-label="Ghuraghuri Homepage"
            >
              <div className="relative flex items-center h-10 w-auto">
                <Image
                  src="/assets/logo.webp"
                  alt=""
                  width={140}
                  height={44}
                  className="h-10 w-auto object-contain brand-logo-light drop-shadow-sm"
                  loading="lazy"
                />
                <Image
                  src="/assets/logo-dark.webp"
                  alt=""
                  width={140}
                  height={44}
                  className="h-10 w-auto object-contain brand-logo-dark drop-shadow-md"
                  loading="lazy"
                />
              </div>
            </Link>

            <button
              ref={closeButtonRef}
              onClick={() => setMobileMenuOpen(false)}
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-foreground transition-colors cursor-pointer grid place-items-center"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links List (≥ 44px tap targets) */}
          <nav className="flex-1 px-4 sm:px-6 py-6 space-y-2 overflow-y-auto" aria-label="Mobile Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              const isDirect = link.href === "/chattogram";
              const LinkComp = isDirect ? "a" : Link;

              return (
                <LinkComp
                  key={link.href}
                  href={link.href}
                  prefetch={isDirect ? undefined : false}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-base font-bold min-h-[48px] transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#0f4a38] text-white shadow-md dark:bg-[#1f9d76] dark:text-white"
                      : link.highlight
                      ? "text-[#f4a340] bg-[#f4a340]/10 hover:bg-[#f4a340]/20 font-black border border-[#f4a340]/30"
                      : "text-foreground hover:bg-black/5 dark:hover:bg-white/10 border border-black/5 dark:border-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0 opacity-90" />
                  <span className="flex-1">{link.label}</span>
                </LinkComp>
              );
            })}
          </nav>

          {/* Bottom Utility Bar: Language, Theme, Saved Bookmarks */}
          <div className="p-4 sm:px-6 py-4 border-t border-black/10 dark:border-white/10 bg-[var(--surface-raised)] shrink-0 flex items-center justify-between gap-3">
            <button
              onClick={() => {
                toggleLanguage();
              }}
              className="flex-1 min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs font-bold border border-current/25 hover:bg-black/5 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer text-[#047857] dark:text-[#2ecc71]"
            >
              <span>{isBn ? "Language: English" : "ভাষা: বাংলা"}</span>
            </button>

            <button
              onClick={() => {
                toggleTheme();
              }}
              className="min-w-[44px] min-h-[44px] px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center gap-2 text-xs font-bold text-foreground"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4 text-[#f4a340]" />
                  <span>{isBn ? "লাইট" : "Light"}</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-[#047857]" />
                  <span>{isBn ? "ডার্ক" : "Dark"}</span>
                </>
              )}
            </button>

            {bookmarks.length > 0 && (
              <Link
                href="/destinations?saved=true"
                onClick={() => setMobileMenuOpen(false)}
                className="min-w-[44px] min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#0f4a38] text-white dark:bg-[#1f9d76] flex items-center justify-center gap-1.5 text-xs font-bold shadow-sm"
                aria-label="Saved Destinations"
              >
                <Bookmark className="w-4 h-4 fill-white" />
                <span>{bookmarks.length}</span>
              </Link>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
