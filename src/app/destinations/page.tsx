"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import destinationsData from "@/data/destinations.json";
import { Destination } from "@/types/destination";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import {
  Search,
  Compass,
  Sparkles,
  Bookmark,
  ChevronDown,
  ArrowUp,
} from "lucide-react";
import confetti from "canvas-confetti";
import { formatDigits, getDivisionBn, CATEGORIES_BN } from "@/lib/i18n";

function DestinationsContent() {
  const { language, bookmarks } = useApp();
  const isBn = language === "bn";
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") || "";
  const initialDivision = searchParams.get("division") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialSaved = searchParams.get("saved") === "true";

  const [query, setQuery] = useState(initialQuery);
  const [selectedDivision, setSelectedDivision] = useState(initialDivision);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  type SortBy = "popular" | "name";
  const [sortBy, setSortBy] = useState<SortBy>("popular");
  const [onlySaved, setOnlySaved] = useState(initialSaved);

  // Mobile-Friendly Progressive Pagination (Initial 16 items to eliminate 140-screen scrolling)
  const [visibleCount, setVisibleCount] = useState<number>(16);

  const allDestinations = destinationsData as unknown as Destination[];

  // Divisions list
  const divisions = [
    "Chattogram",
    "Sylhet",
    "Khulna",
    "Barishal",
    "Dhaka",
    "Rajshahi",
    "Rangpur",
    "Mymensingh",
  ];

  // Categories list
  const categories = [
    "Beach",
    "Hill",
    "Waterfall",
    "Forest",
    "Island",
    "Haor",
    "Historical",
    "Archaeological",
    "Religious",
    "Heritage",
  ];

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(16);
  }, [query, selectedDivision, selectedCategory, sortBy, onlySaved]);

  // Synchronize state when searchParams in URL change
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const division = searchParams.get("division") || "";
    const category = searchParams.get("category") || "";
    const saved = searchParams.get("saved") === "true";

    setQuery(q);
    setSelectedDivision(division);
    setSelectedCategory(category);
    setOnlySaved(saved);
  }, [searchParams]);

  // Filtering & Sorting
  const filtered = useMemo(() => {
    return allDestinations
      .filter((item) => {
        // Query match
        if (query.trim()) {
          const q = query.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchBn = item.name_bn?.includes(q);
          const matchDistrict = item.district.toLowerCase().includes(q);
          const matchCat = item.category.toLowerCase().includes(q);
          if (!matchName && !matchBn && !matchDistrict && !matchCat) return false;
        }

        // Division match
        if (selectedDivision && item.division !== selectedDivision) return false;

        // Category match
        if (
          selectedCategory &&
          item.category !== selectedCategory &&
          !item.categories?.includes(selectedCategory)
        ) {
          return false;
        }

        // Only Saved match
        if (onlySaved && !bookmarks.includes(item.id)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "popular") {
          const popWeight: Record<string, number> = { high: 3, medium: 2, low: 1 };
          const pA = (popWeight[a.popularity || ""] || 0) + (a.featured ? 2 : 0);
          const pB = (popWeight[b.popularity || ""] || 0) + (b.featured ? 2 : 0);
          if (pB !== pA) return pB - pA;
          return a.name.localeCompare(b.name);
        }
        return a.name.localeCompare(b.name);
      });
  }, [allDestinations, query, selectedDivision, selectedCategory, sortBy, onlySaved, bookmarks]);

  const visibleDestinations = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  const handleSurprise = () => {
    const randomIndex = Math.floor(Math.random() * allDestinations.length);
    const lucky = allDestinations[randomIndex];
    setQuery(lucky.name);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#2ecc71", "#f4a340", "#0f4a38"],
    });
  };

  return (
    <div className="py-8 sm:py-12 bg-[var(--background)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Count */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] text-xs font-bold mb-2">
              <Compass className="w-4 h-4 text-[#f4a340]" />
              <span>{isBn ? "সম্পূর্ণ ডেটাবেস" : "Comprehensive Directory"}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
              {onlySaved
                ? isBn
                  ? "আপনার সংরক্ষিত গন্তব্যসমূহ"
                  : "Saved Destinations"
                : isBn
                ? "বাংলাদেশের পর্যটন গন্তব্যসমূহ"
                : "Explore All Destinations"}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium mt-1">
              {isBn
                ? `মোট ${formatDigits(allDestinations.length, true)}টি স্পটের মধ্যে ${formatDigits(filtered.length, true)}টি স্পট পাওয়া গেছে`
                : `Found ${filtered.length} of ${allDestinations.length} verified destinations across 64 districts`}
            </p>
          </div>

          <button
            onClick={handleSurprise}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#f4a340] hover:bg-[#e67e22] text-black font-bold text-xs shadow-md transition-all self-start md:self-auto cursor-pointer min-h-[40px]"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isBn ? "ভাগ্যের চাকা ঘুরান" : "Pick Lucky Spot"}</span>
          </button>
        </div>

        {/* Filter Controls Panel */}
        <div className="p-4 sm:p-6 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  isBn
                    ? "নাম, জেলা বা বিভাগ দিয়ে খুঁজুন..."
                    : "Search by spot name, district, or keyword..."
                }
                className="w-full pl-10 pr-8 py-2.5 sm:py-3 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-xs sm:text-sm text-foreground placeholder-[var(--text-muted)] focus:outline-none focus:border-[#0f4a38] min-h-[42px]"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-3 text-xs text-[var(--text-muted)] hover:text-foreground w-6 h-6 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Division Selector */}
            <div>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="w-full px-3 py-2.5 sm:py-3 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-xs sm:text-sm font-semibold text-foreground focus:outline-none focus:border-[#0f4a38] cursor-pointer min-h-[42px]"
              >
                <option value="">{isBn ? "সকল বিভাগ" : "All Divisions"}</option>
                {divisions.map((div) => (
                  <option key={div} value={div}>
                    {isBn ? getDivisionBn(div) : div}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Selector */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="w-full px-3 py-2.5 sm:py-3 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-xs sm:text-sm font-semibold text-foreground focus:outline-none focus:border-[#0f4a38] cursor-pointer min-h-[42px]"
              >
                <option value="popular">
                  {isBn ? "জনপ্রিয় স্থান (Most Popular)" : "Most Popular"}
                </option>
                <option value="name">
                  {isBn ? "নাম অনুযায়ী (Name A-Z)" : "Name (A-Z)"}
                </option>
              </select>
            </div>
          </div>

          {/* Category Chips & Saved Filter Toggle (Mobile Horizontal Smooth Scroll) */}
          <div className="pt-3 border-t border-[var(--glass-border)] space-y-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 pt-0.5 touch-pan-x">
              <button
                onClick={() => setSelectedCategory("")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer min-h-[36px] ${
                  selectedCategory === ""
                    ? "bg-[#0f4a38] text-white dark:bg-[#1f9d76] shadow-sm"
                    : "bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-foreground border border-[var(--glass-border)]"
                }`}
              >
                {isBn ? "সব ক্যাটাগরি" : "All Categories"}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer min-h-[36px] ${
                    selectedCategory === cat
                      ? "bg-[#0f4a38] text-white dark:bg-[#1f9d76] shadow-sm"
                      : "bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-foreground border border-[var(--glass-border)]"
                  }`}
                >
                  {isBn ? (CATEGORIES_BN[cat] || cat) : cat}
                </button>
              ))}

              {/* Bookmarked Filter Pill */}
              <button
                onClick={() => setOnlySaved(!onlySaved)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer min-h-[36px] ${
                  onlySaved
                    ? "bg-[#f4a340] text-black shadow-sm"
                    : "bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-foreground border border-[var(--glass-border)]"
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${onlySaved ? "fill-black" : ""}`} />
                <span>{isBn ? `সংরক্ষিত (${formatDigits(bookmarks.length, true)})` : `Saved (${bookmarks.length})`}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {filtered.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleDestinations.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>

            {/* Progressive Loading with Luxury Progress Gauge */}
            {visibleCount < filtered.length ? (
              <div className="mt-14 max-w-md mx-auto text-center flex flex-col items-center gap-3.5">
                <div className="w-full flex items-center justify-between text-xs font-bold text-[var(--text-muted)] px-1">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>
                      {isBn
                        ? `${formatDigits(visibleDestinations.length, true)} / ${formatDigits(filtered.length, true)} টি স্থান দেখাচ্ছে`
                        : `Showing ${visibleDestinations.length} of ${filtered.length} destinations`}
                    </span>
                  </span>
                  <span className="text-[#0f4a38] dark:text-emerald-400 font-extrabold text-xs">
                    {formatDigits(Math.round((visibleDestinations.length / filtered.length) * 100), isBn)}%
                  </span>
                </div>

                <div className="w-full h-1.5 bg-[var(--surface-raised)] border border-[var(--glass-border)] rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-[#156b50] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(100, (visibleDestinations.length / filtered.length) * 100)}%` }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount((prev) => Math.min(prev + 20, filtered.length))
                  }
                  className="mt-1 group px-8 py-3 rounded-2xl bg-gradient-to-r from-[#0f4a38] to-[#156b50] hover:from-[#156b50] hover:to-[#1b8061] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2.5 w-full sm:w-auto"
                >
                  <Compass className="w-4 h-4 text-emerald-300 group-hover:rotate-45 transition-transform duration-300" />
                  <span>
                    {isBn
                      ? `আরো ২০টি স্থান দেখুন (বাকি ${formatDigits(filtered.length - visibleDestinations.length, true)}টি)`
                      : `Explore 20 More Destinations (${filtered.length - visibleDestinations.length} remaining)`}
                  </span>
                  <ChevronDown className="w-4 h-4 opacity-75 group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>
            ) : filtered.length > 16 ? (
              <div className="mt-14 text-center py-6">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--surface)] border border-[var(--glass-border)] text-xs font-bold text-[var(--text-muted)] shadow-sm">
                  <Sparkles className="w-4 h-4 text-[#f4a340]" />
                  <span>
                    {isBn
                      ? `আপনি সকল ${formatDigits(filtered.length, true)}টি দর্শনীয় স্থান ঘুরে দেখেছেন!`
                      : `You've explored all ${filtered.length} destinations!`}
                  </span>
                </div>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f4a38] dark:text-[#2ecc71] hover:underline cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>{isBn ? "উপরে ফিরে যান" : "Back to top"}</span>
                  </button>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="text-center py-20 px-4 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)]">
            <Compass className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-3 opacity-50" />
            <h3 className="text-xl font-bold text-foreground">
              {isBn ? "কোনো গন্তব্য পাওয়া যায়নি" : "No Destinations Found"}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 mb-6">
              {isBn
                ? "অনুগ্রহ করে আপনার ফিল্টার অথবা সার্চ কিওয়ার্ড পরিবর্তন করে চেষ্টা করুন।"
                : "Try adjusting your search criteria or resetting filters."}
            </p>
            <button
              onClick={() => {
                setQuery("");
                setSelectedDivision("");
                setSelectedCategory("");
                setOnlySaved(false);
              }}
              className="px-6 py-2.5 rounded-xl bg-[#0f4a38] text-white font-bold text-xs shadow-md min-h-[40px] cursor-pointer"
            >
              {isBn ? "ফিল্টার রিসেট করুন" : "Reset All Filters"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DestinationsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen p-12 text-center text-sm font-semibold text-[#4e6b60]">
          Loading destinations...
        </div>
      }
    >
      <DestinationsContent />
    </Suspense>
  );
}
