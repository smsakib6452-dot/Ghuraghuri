"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "en" | "bn";
type Theme = "light" | "dark";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
  isBookmarked: (id: number) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [theme, setThemeState] = useState<Theme>("light");
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  useEffect(() => {
    queueMicrotask(() => {
      // Load persisted settings after hydration.
      try {
      const savedLang = localStorage.getItem("ghuraghuri_lang") as Language;
      if (savedLang === "en" || savedLang === "bn") {
        setLanguageState(savedLang);
        document.documentElement.lang = savedLang;
      } else {
        document.documentElement.lang = "en";
      }

      const savedTheme = localStorage.getItem("ghuraghuri_theme") as Theme;
      if (savedTheme === "light" || savedTheme === "dark") {
        setThemeState(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setThemeState("dark");
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
      }

      const savedBookmarks = localStorage.getItem("ghuraghuri_bookmarks");
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }
      } catch {
        // LocalStorage access fallback
      }
    });
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("ghuraghuri_lang", lang);
    } catch {}
    document.documentElement.lang = lang;
  };

  const toggleLanguage = () => {
    const next = language === "en" ? "bn" : "en";
    setLanguage(next);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    try {
      localStorage.setItem("ghuraghuri_theme", newTheme);
    } catch {}
  };

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
  };

  const toggleBookmark = (id: number) => {
    setBookmarks((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("ghuraghuri_bookmarks", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const isBookmarked = (id: number) => bookmarks.includes(id);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        theme,
        setTheme,
        toggleTheme,
        bookmarks,
        toggleBookmark,
        isBookmarked,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
