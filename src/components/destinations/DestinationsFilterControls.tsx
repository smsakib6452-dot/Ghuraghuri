"use client";

import React, { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Compass, Sparkles, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { getDivisionBn, CATEGORIES_BN } from "@/lib/i18n";

interface DestinationsFilterControlsProps {
  initialQuery?: string;
  initialDivision?: string;
  initialCategory?: string;
  initialSort?: string;
  divisions: string[];
  categories: string[];
  totalResults: number;
}

export function DestinationsFilterControls({
  initialQuery = "",
  initialDivision = "",
  initialCategory = "",
  initialSort = "popular",
  divisions,
  categories,
  totalResults,
}: DestinationsFilterControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { language } = useApp();
  const isBn = language === "bn";

  const [query, setQuery] = useState(initialQuery);

  const updateFilters = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : "");

    Object.entries(newParams).forEach(([key, val]) => {
      if (val && val.trim() !== "") {
        params.set(key, val);
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 on filter changes unless page is explicitly passed
    if (!newParams.page) {
      params.delete("page");
    }

    startTransition(() => {
      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: query });
  };

  const handleSearchClear = () => {
    setQuery("");
    updateFilters({ q: "" });
  };

  const handleLuckySpot = () => {
    const luckySpots = ["coxs-bazar", "sajek-valley", "srimangal", "saint-martins-island", "bandarban", "ratargul-swamp-forest", "tanguar-haor", "kuakata"];
    const randomSlug = luckySpots[Math.floor(Math.random() * luckySpots.length)];
    router.push(`/destinations/${randomSlug}`);
  };

  return (
    <div className="p-4 sm:p-6 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isBn
                ? "নাম, জেলা বা বিভাগ দিয়ে খুঁজুন (Enter চাপুন)..."
                : "Search by spot name, district, or keyword (Press Enter)..."
            }
            className="w-full pl-10 pr-16 py-2.5 sm:py-3 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-xs sm:text-sm text-foreground placeholder-[var(--text-muted)] focus:outline-none focus:border-[#0f4a38] min-h-[42px]"
          />
          {query ? (
            <button
              type="button"
              onClick={handleSearchClear}
              className="absolute right-10 top-3 text-[var(--text-muted)] hover:text-foreground p-1"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
          <button
            type="submit"
            className="absolute right-2 top-2 px-2.5 py-1.5 rounded-xl bg-[#0f4a38] text-white text-[11px] font-bold hover:bg-[#156b50] transition-colors"
          >
            {isBn ? "খুঁজুন" : "Search"}
          </button>
        </form>

        <div className="flex items-center gap-2">
          {/* Division Selector */}
          <select
            value={initialDivision}
            onChange={(e) => updateFilters({ division: e.target.value })}
            className="px-3 py-2.5 sm:py-3 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-xs sm:text-sm font-semibold text-foreground focus:outline-none focus:border-[#0f4a38] cursor-pointer min-h-[42px]"
            aria-label="Filter by division"
          >
            <option value="">{isBn ? "সকল বিভাগ" : "All Divisions"}</option>
            {divisions.map((div) => (
              <option key={div} value={div}>
                {isBn ? getDivisionBn(div) : div}
              </option>
            ))}
          </select>

          {/* Sort Selector */}
          <select
            value={initialSort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="px-3 py-2.5 sm:py-3 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-xs sm:text-sm font-semibold text-foreground focus:outline-none focus:border-[#0f4a38] cursor-pointer min-h-[42px]"
            aria-label="Sort destinations"
          >
            <option value="popular">{isBn ? "জনপ্রিয় স্থান" : "Most Popular"}</option>
            <option value="name">{isBn ? "নাম অনুযায়ী (A-Z)" : "Name (A-Z)"}</option>
          </select>

          {/* Lucky Spot Button */}
          <button
            type="button"
            onClick={handleLuckySpot}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-[#f4a340] hover:bg-[#e67e22] text-black font-bold text-xs shadow-sm transition-all shrink-0 cursor-pointer min-h-[42px]"
            title={isBn ? "দৈবচয়ন পদ্ধতিতে একটি স্পট দেখুন" : "Explore a random highlight"}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isBn ? "ভাগ্যচাকা" : "Surprise"}</span>
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="pt-3 border-t border-[var(--glass-border)] flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 touch-pan-x">
        <button
          type="button"
          onClick={() => updateFilters({ category: "" })}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer min-h-[36px] ${
            !initialCategory
              ? "bg-[#0f4a38] text-white dark:bg-[#1f9d76] shadow-sm"
              : "bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-foreground border border-[var(--glass-border)]"
          }`}
        >
          {isBn ? "সব ক্যাটাগরি" : "All Categories"}
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => updateFilters({ category: initialCategory === cat ? "" : cat })}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer min-h-[36px] ${
              initialCategory === cat
                ? "bg-[#0f4a38] text-white dark:bg-[#1f9d76] shadow-sm"
                : "bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-foreground border border-[var(--glass-border)]"
            }`}
          >
            {isBn ? (CATEGORIES_BN[cat] || cat) : cat}
          </button>
        ))}

        {(initialQuery || initialDivision || initialCategory) && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              startTransition(() => {
                router.push(pathname);
              });
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-500 hover:text-rose-600 border border-rose-500/30 hover:border-rose-500 transition-colors shrink-0 ml-auto cursor-pointer"
          >
            {isBn ? "রিসেট ✕" : "Reset ✕"}
          </button>
        )}
      </div>

      {isPending && (
        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium animate-pulse flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>{isBn ? "ফলাফল রিফ্রেশ হচ্ছে..." : "Updating destinations..."}</span>
        </div>
      )}
    </div>
  );
}
