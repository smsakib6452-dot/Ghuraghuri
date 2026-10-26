"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import destinationsData from "@/data/destinations.json";
import { Destination } from "@/types/destination";
import { TOTAL_DESTINATIONS } from "@/lib/constants";
import { formatNumberEnBn } from "@/lib/utils";
import { CATEGORIES_BN } from "@/lib/i18n";
import {
  Search,
  MapPin,
  ArrowRight,
  Pause,
  Play,
  Bookmark,
  Sparkles,
  ChevronDown,
} from "lucide-react";

interface HeroSlide {
  id: number;
  image: string;
  slug: string;
  title: string;
  title_bn: string;
  location: string;
  location_bn: string;
  tagline: string;
  tagline_bn: string;
  rating: string;
  rating_bn: string;
  tags: string[];
  tags_bn: string[];
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 7,
    image: "/assets/destinations/sundarbans.webp",
    slug: "sundarbans",
    title: "Sundarbans",
    title_bn: "সুন্দরবন",
    location: "Khulna · UNESCO World Heritage",
    location_bn: "খুলনা · ইউনেস্কো বিশ্ব ঐতিহ্য",
    tagline: "The largest mangrove wilderness on earth, home of the majestic Royal Bengal Tiger.",
    tagline_bn: "পৃথিবীর বৃহত্তম ম্যানগ্রোভ অরণ্য এবং রয়েল বেঙ্গল টাইগারের বিশ্বখ্যাত আবাসভূমি।",
    rating: "4.9 · UNESCO Heritage",
    rating_bn: "৪.৯ · ইউনেস্কো বিশ্ব ঐতিহ্য",
    tags: ["🐅 Royal Bengal Tiger", "🛶 Mangrove Cruise", "🌿 UNESCO Heritage"],
    tags_bn: ["🐅 রয়েল বেঙ্গল টাইগার", "🛶 ম্যানগ্রোভ ক্রুজ", "🌿 ইউনেস্কো ঐতিহ্য"],
  },
  {
    id: 4,
    image: "/assets/destinations/sajek-valley.webp",
    slug: "sajek-valley",
    title: "Sajek Valley",
    title_bn: "সাজেক ভ্যালি",
    location: "Rangamati · Kingdom of Clouds",
    location_bn: "রাঙ্গামাটি · মেঘের উপত্যকা",
    tagline: "Wake up above a floating sea of clouds in Bangladesh's most scenic highland paradise.",
    tagline_bn: "মেঘের দেশে মেঘের ভেলায় ভেসে চলা এক স্বর্গীয় অনুভূতি ও কংলাকের চূড়া।",
    rating: "4.9 · Explorer Score",
    rating_bn: "৪.৯ · এক্সপ্লোরার স্কোর",
    tags: ["☁️ Cloud Sea", "🏕️ Eco Resort", "⛰️ Konglak Peak"],
    tags_bn: ["☁️ মেঘের সমুদ্র", "🏕️ ইকো রিসোর্ট", "⛰️ কংলাক পাহাড়"],
  },
  {
    id: 1,
    image: "/assets/destinations/coxs-bazar.webp",
    slug: "coxs-bazar",
    title: "Cox's Bazar",
    title_bn: "কক্সবাজার",
    location: "Cox's Bazar · Bay of Bengal",
    location_bn: "কক্সবাজার · বঙ্গোপসাগর তীর",
    tagline: "Experience the world's longest 120km unbroken natural golden sand beach and Marine Drive.",
    tagline_bn: "বিশ্বের দীর্ঘতম ১২০ কিমি নিরবচ্ছিন্ন প্রাকৃতিক বালুকাময় সমুদ্র সৈকত ও মেরিন ড্রাইভ।",
    rating: "4.8 · Explorer Score",
    rating_bn: "৪.৮ · এক্সপ্লোরার স্কোর",
    tags: ["🏖️ Longest Beach", "🌅 Sunset Point", "🚗 Marine Drive"],
    tags_bn: ["🏖️ দীর্ঘতম সৈকত", "🌅 সূর্যাস্ত পয়েন্ট", "🚗 মেরিন ড্রাইভ"],
  },
  {
    id: 3,
    image: "/assets/destinations/srimangal.webp",
    slug: "sreemangal",
    title: "Sreemangal",
    title_bn: "শ্রীমঙ্গল",
    location: "Moulvibazar · Tea Capital",
    location_bn: "মৌলভীবাজার · চায়ের রাজধানী",
    tagline: "Endless rolling green tea gardens, rainforest trails, and misty quiet mornings.",
    tagline_bn: "সবুজে ঘেরা চায়ের বাগান, লাউয়াছড়া রেইনফরেস্ট আর স্নিগ্ধ কুয়াশাভেজা সকাল।",
    rating: "4.8 · Explorer Score",
    rating_bn: "৪.৮ · এক্সপ্লোরার স্কোর",
    tags: ["🍵 Tea Gardens", "🌲 Lawachara Forest", "☕ 7-Color Tea"],
    tags_bn: ["🍵 চা বাগান", "🌲 লাউয়াছড়া বন", "☕ ৭ রঙের চা"],
  },
  {
    id: 2,
    image: "/assets/destinations/saint-martins-island.webp",
    slug: "saint-martins-island",
    title: "Saint Martin's Island",
    title_bn: "সেন্ট মার্টিন দ্বীপ",
    location: "Cox's Bazar · Coral Island",
    location_bn: "কক্সবাজার · নারিকেল জিঞ্জিরা",
    tagline: "Crystal turquoise waters, coral reefs, and tranquil coconut palm shores.",
    tagline_bn: "স্বচ্ছ নীল জলরাশি, প্রবাল প্রাচীর আর নারিকেল বাগানের অপার নিস্তব্ধতা।",
    rating: "4.9 · Explorer Score",
    rating_bn: "৪.৯ · এক্সপ্লোরার স্কোর",
    tags: ["🏝️ Coral Reefs", "🌊 Blue Waters", "🥥 Coconut Groves"],
    tags_bn: ["🏝️ প্রবাল প্রাচীর", "🌊 নীল জলরাশি", "🥥 নারিকেল বাগান"],
  },
];

const TICKER_ITEMS = [
  { name: "Sundarbans", name_bn: "সুন্দরবন", emoji: "🐅", loc: "Khulna", loc_bn: "খুলনা" },
  { name: "Sajek Valley", name_bn: "সাজেক ভ্যালি", emoji: "☁️", loc: "Rangamati", loc_bn: "রাঙ্গামাটি" },
  { name: "Cox's Bazar", name_bn: "কক্সবাজার", emoji: "🏖️", loc: "Bay of Bengal", loc_bn: "বঙ্গোপসাগর" },
  { name: "Sreemangal", name_bn: "শ্রীমঙ্গল", emoji: "🍵", loc: "Sylhet", loc_bn: "সিলেট" },
  { name: "Saint Martin's", name_bn: "সেন্ট মার্টিন", emoji: "🏝️", loc: "Coral Island", loc_bn: "প্রবাল দ্বীপ" },
  { name: "Tanguar Haor", name_bn: "টাঙ্গুয়ার হাওর", emoji: "🛶", loc: "Sunamganj", loc_bn: "সুনামগঞ্জ" },
  { name: "Nilgiri", name_bn: "নীলগিরি", emoji: "⛰️", loc: "Bandarban", loc_bn: "বান্দরবান" },
  { name: "Ahsan Manzil", name_bn: "আহসান মঞ্জিল", emoji: "🏛️", loc: "Dhaka", loc_bn: "ঢাকা" },
  { name: "Kuakata", name_bn: "কুয়াকাটা", emoji: "🌅", loc: "Barishal", loc_bn: "বরিশাল" },
  { name: "Jaflong", name_bn: "জাফলং", emoji: "💎", loc: "Sylhet", loc_bn: "সিলেট" },
  { name: "Bichanakandi", name_bn: "বিছনাকান্দি", emoji: "🌊", loc: "Sylhet", loc_bn: "সিলেট" },
  { name: "Paharpur", name_bn: "পাহাড়পুর", emoji: "🏺", loc: "Naogaon", loc_bn: "নওগাঁ" },
];

export function HeroSection() {
  const { language, toggleBookmark, isBookmarked } = useApp();
  const isBn = language === "bn";
  const router = useRouter();

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchMode, setSearchMode] = useState<"spots" | "hotels" | "food" | "transport">("spots");

  const searchBoxRef = useRef<HTMLDivElement>(null);
  const allDestinations = destinationsData as unknown as Destination[];

  // Slide rotation timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || searchMode !== "spots") return [];
    const q = searchQuery.toLowerCase();
    return allDestinations
      .filter((d) => {
        const nameMatch = d.name.toLowerCase().includes(q);
        const nameBnMatch = d.name_bn?.includes(q);
        const distMatch = d.district.toLowerCase().includes(q);
        return nameMatch || nameBnMatch || distMatch;
      })
      .slice(0, 5);
  }, [searchQuery, searchMode, allDestinations]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchMode === "hotels") {
      router.push("/hotels");
      return;
    }
    if (searchMode === "food") {
      router.push("/restaurants");
      return;
    }
    if (searchMode === "transport") {
      router.push("/transport");
      return;
    }
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedDivision) params.set("division", selectedDivision);
    router.push(`/destinations?${params.toString()}`);
  };

  const currentSlide = HERO_SLIDES[activeSlide];
  const isCurrentBookmarked = isBookmarked(currentSlide.id);

  return (
    <section
      className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-[#061B14]"
      aria-label="Bangladesh Travel Hero"
    >
      {/* Background Cinematic Crossfade Slider */}
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              sizes="100vw"
              priority={idx === 0}
              className="object-cover transition-transform duration-7000 ease-linear scale-105"
            />
            {/* Multi-layered directional gradient overlay (strengthened left side for readability, light right side for depth) */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#061B14]/95 via-[#061B14]/65 to-[#061B14]/15" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061B14]/85 via-transparent to-black/25" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12)_0%,transparent_60%)] pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Main 2-Column Hero Content Grid (Streamlined top spacing to fit above the fold on 1080p displays) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-14 lg:pt-16 pb-6 sm:pb-8 flex-1 flex items-center w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center w-full">
          
          {/* Left Column: Eyebrow, Classic Title, Subtitle, Search, Stats */}
          <div className="lg:col-span-7 text-left text-white space-y-6">
            
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-widest text-[#35D07F] uppercase shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span>{isBn ? "বাংলাদেশ আবিষ্কার" : "EXPLORE BANGLADESH"}</span>
            </div>

            {/* Classic Authentic Title: One Country, Endless Stories */}
            <h1
              className="text-3xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight leading-[1.12]"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}
            >
              {isBn ? (
                <>
                  এক দেশ, <br />
                  <span className="bg-gradient-to-r from-[#35D07F] via-[#F4A340] to-[#10B981] bg-clip-text text-transparent">
                    অগণিত গল্প।
                  </span>
                </>
              ) : (
                <>
                  One Country, <br />
                  <span className="bg-gradient-to-r from-[#35D07F] via-[#F4A340] to-[#10B981] bg-clip-text text-transparent">
                    Endless Stories.
                  </span>
                </>
              )}
            </h1>

            {/* Subheading */}
            <p
              className="max-w-xl text-base sm:text-lg text-[#D1E0D8] font-normal leading-relaxed"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}
            >
              {isBn
                ? "সৈকত থেকে পাহাড়, নদী থেকে সুন্দরবনের অরণ্য — বাংলাদেশের অবিস্মরণীয় সৌন্দর্যের গল্প আবিষ্কার করুন সম্পূর্ণ ইন্টারেক্টিভ গাইডসহ।"
                : "From beaches to hills, rivers to mangrove forests — discover the stories that make Bangladesh unforgettable with curated maps, hotels, and travel guides."}
            </p>

            {/* Search Scope Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 w-fit shadow-lg">
              <button
                type="button"
                onClick={() => setSearchMode("spots")}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  searchMode === "spots"
                    ? "bg-[#10B981] text-black shadow-md font-extrabold"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                📍 {isBn ? "দর্শনীয় স্থান" : "Destinations"}
              </button>
              <button
                type="button"
                onClick={() => setSearchMode("hotels")}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  searchMode === "hotels"
                    ? "bg-[#10B981] text-black shadow-md font-extrabold"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                🏨 {isBn ? "হোটেল ও রিসোর্ট" : "Hotels"}
              </button>
              <button
                type="button"
                onClick={() => setSearchMode("food")}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  searchMode === "food"
                    ? "bg-[#10B981] text-black shadow-md font-extrabold"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                🍲 {isBn ? "ঐতিহ্যবাহী খাবার" : "Food"}
              </button>
              <button
                type="button"
                onClick={() => setSearchMode("transport")}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  searchMode === "transport"
                    ? "bg-[#10B981] text-black shadow-md font-extrabold"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                🚌 {isBn ? "যাতায়াত" : "Transit"}
              </button>
            </div>

            {/* Search Bar with Autocomplete */}
            <div className="relative max-w-xl" ref={searchBoxRef}>
              <form
                onSubmit={handleSearch}
                className="p-1.5 sm:p-2 rounded-2xl sm:rounded-full bg-white/95 dark:bg-[#0B2E22]/95 backdrop-blur-xl border border-white/30 shadow-2xl flex flex-col sm:flex-row items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-[#10B981]"
              >
                {/* Search Text Input (Flex-grow with non-truncated placeholder) */}
                <div className="flex items-center gap-2.5 w-full sm:flex-1 px-4 py-1.5 text-foreground min-w-0">
                  <Search className="w-5 h-5 text-[#10B981] shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => {
                      if (suggestions.length > 0) setShowSuggestions(true);
                    }}
                    placeholder={
                      searchMode === "hotels"
                        ? isBn ? "হোটেল ও রিসোর্ট খুঁজুন..." : "Search hotels, resorts..."
                        : searchMode === "food"
                        ? isBn ? "ঐতিহ্যবাহী খাবার খুঁজুন..." : "Find regional food..."
                        : searchMode === "transport"
                        ? isBn ? "বাস-ট্রেন টিকেট খুঁজুন..." : "Search transit routes..."
                        : isBn ? "স্থান বা হোটেল খুঁজুন..." : "Search places, hotels..."
                    }
                    className="w-full flex-1 min-w-0 bg-transparent text-sm sm:text-base font-medium placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none truncate"
                    aria-label="Search places, hotels"
                  />
                </div>

                {/* Division Filter with WCAG AA Contrast & Custom Chevron (Active in spots mode) */}
                {searchMode === "spots" && (
                  <div className="relative flex items-center gap-1.5 w-full sm:w-auto px-3 py-1.5 border-t sm:border-t-0 sm:border-l border-gray-300 dark:border-white/20">
                    <MapPin className="w-4 h-4 text-[#F4A340] shrink-0" />
                    <select
                      value={selectedDivision}
                      onChange={(e) => setSelectedDivision(e.target.value)}
                      className="w-full sm:w-36 bg-transparent text-xs sm:text-sm font-bold text-gray-900 dark:text-white focus:outline-none cursor-pointer py-1 pr-6 appearance-none transition-colors"
                      aria-label="Filter by division"
                    >
                      <option value="" className="bg-white text-gray-900 dark:bg-[#061B14] dark:text-white">
                        {isBn ? "সব বিভাগ" : "All Divisions"}
                      </option>
                      <option value="Chattogram" className="bg-white text-gray-900 dark:bg-[#061B14] dark:text-white">
                        {isBn ? "চট্টগ্রাম" : "Chattogram"}
                      </option>
                      <option value="Sylhet" className="bg-white text-gray-900 dark:bg-[#061B14] dark:text-white">
                        {isBn ? "সিলেট" : "Sylhet"}
                      </option>
                      <option value="Khulna" className="bg-white text-gray-900 dark:bg-[#061B14] dark:text-white">
                        {isBn ? "খুলনা" : "Khulna"}
                      </option>
                      <option value="Barishal" className="bg-white text-gray-900 dark:bg-[#061B14] dark:text-white">
                        {isBn ? "বরিশাল" : "Barishal"}
                      </option>
                      <option value="Dhaka" className="bg-white text-gray-900 dark:bg-[#061B14] dark:text-white">
                        {isBn ? "ঢাকা" : "Dhaka"}
                      </option>
                      <option value="Rajshahi" className="bg-white text-gray-900 dark:bg-[#061B14] dark:text-white">
                        {isBn ? "রাজশাহী" : "Rajshahi"}
                      </option>
                      <option value="Rangpur" className="bg-white text-gray-900 dark:bg-[#061B14] dark:text-white">
                        {isBn ? "রংপুর" : "Rangpur"}
                      </option>
                      <option value="Mymensingh" className="bg-white text-gray-900 dark:bg-[#061B14] dark:text-white">
                        {isBn ? "ময়মনসিংহ" : "Mymensingh"}
                      </option>
                    </select>
                    <div className="absolute right-2.5 pointer-events-none text-gray-700 dark:text-white/85">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  </div>
                )}

                {/* Submit Search Button */}
                <button
                  type="submit"
                  className="w-full sm:w-auto min-h-[42px] px-6 py-2.5 rounded-xl sm:rounded-full bg-gradient-to-r from-[#10B981] to-[#0f4a38] hover:from-[#35D07F] hover:to-[#10B981] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <span>{isBn ? "খুঁজুন" : "Search"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#0B2E22] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/20 overflow-hidden z-50 animate-in fade-in-50 duration-150">
                  <div className="p-2">
                    {suggestions.map((item) => (
                      <Link
                        key={item.id}
                        href={`/destinations/${item.slug}`}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        onClick={() => setShowSuggestions(false)}
                      >
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-200">
                          <Image
                            src={item.image.startsWith("http") || item.image.startsWith("/") ? item.image : `/${item.image.replace(/^\/+/, "")}`}
                            alt={item.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">
                            {isBn ? item.name_bn || item.name : item.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.district}, {item.division}
                          </p>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                          {isBn ? (CATEGORIES_BN[item.category] || item.category) : item.category}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Trending Quick Chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-white/90">
              <span className="font-bold text-[#F4A340] mr-1 flex items-center gap-1">
                <span>🔥</span>
                <span>{isBn ? "ট্রেন্ডিং:" : "Trending:"}</span>
              </span>
              {[
                { name: "Sajek Valley", name_bn: "☁️ সাজেক", slug: "sajek-valley" },
                { name: "Cox's Bazar", name_bn: "🏖️ কক্সবাজার", slug: "coxs-bazar" },
                { name: "Sreemangal", name_bn: "🍵 শ্রীমঙ্গল", slug: "sreemangal" },
                { name: "Tanguar Haor", name_bn: "🛶 টাঙ্গুয়ার হাওর", slug: "tanguar-haor" },
                { name: "Sundarbans", name_bn: "🐅 সুন্দরবন", slug: "sundarbans" },
                { name: "Nilgiri", name_bn: "⛰️ নীলগিরি", slug: "nilgiri" },
              ].map((pop) => (
                <Link
                  key={pop.slug}
                  href={`/destinations/${pop.slug}`}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all font-semibold backdrop-blur-sm"
                >
                  {isBn ? pop.name_bn : pop.name}
                </Link>
              ))}
            </div>

            {/* Verified Counter Stats Cards (Harmonized, tabular-nums, aligned baseline & identical height) */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/15 max-w-lg items-stretch">
              <Link
                href="/destinations"
                className="p-3 rounded-2xl flex flex-col items-center justify-end gap-0.5 text-center group transition-all h-full"
                style={{
                  background: "rgba(6,24,18,0.5)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <div className="text-xl sm:text-2xl font-black text-[#35D07F] group-hover:scale-105 transition-transform tabular-nums">
                  {isBn ? `${formatNumberEnBn(TOTAL_DESTINATIONS, true)}+` : `${TOTAL_DESTINATIONS}+`}
                </div>
                <div className="text-xs font-medium text-[#D1E0D8] min-h-[2.4em] flex items-center justify-center leading-tight">
                  {isBn ? "দর্শনীয় স্থান" : "Places to Explore"}
                </div>
              </Link>

              <Link
                href="/destinations"
                className="p-3 rounded-2xl flex flex-col items-center justify-end gap-0.5 text-center group transition-all h-full"
                style={{
                  background: "rgba(6,24,18,0.5)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <div className="text-xl sm:text-2xl font-black text-[#35D07F] group-hover:scale-105 transition-transform tabular-nums">
                  {isBn ? "৮" : "8"}
                </div>
                <div className="text-xs font-medium text-[#D1E0D8] min-h-[2.4em] flex items-center justify-center leading-tight">
                  {isBn ? "প্রশাসনিক বিভাগ" : "Divisions"}
                </div>
              </Link>

              <Link
                href="/destinations"
                className="p-3 rounded-2xl flex flex-col items-center justify-end gap-0.5 text-center group transition-all h-full"
                style={{
                  background: "rgba(6,24,18,0.5)",
                  border: "1px solid rgba(255,255,255,0.16)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <div className="text-xl sm:text-2xl font-black text-[#35D07F] group-hover:scale-105 transition-transform tabular-nums">
                  {isBn ? "৬৪" : "64"}
                </div>
                <div className="text-xs font-medium text-[#D1E0D8] min-h-[2.4em] flex items-center justify-center leading-tight">
                  {isBn ? "ঐতিহ্যবাহী জেলা" : "Districts"}
                </div>
              </Link>
            </div>

            {/* Live Tourism Weather Pulse Bar (Marquee Viewport + Non-Transparent CTA) */}
            <div className="pt-0.5 max-w-lg">
              <div className="w-full flex items-center justify-between rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-xs group overflow-hidden">
                {/* Marquee Viewport with Edge Masking */}
                <div
                  className="flex items-center gap-2 overflow-hidden flex-1 min-w-0 p-2.5 pl-3.5"
                  style={{
                    maskImage: "linear-gradient(90deg, transparent 0, #000 12px, #000 calc(100% - 32px), transparent 100%)",
                    WebkitMaskImage: "linear-gradient(90deg, transparent 0, #000 12px, #000 calc(100% - 32px), transparent 100%)",
                  }}
                >
                  <span className="font-bold text-[#35D07F] flex items-center gap-1.5 shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span>{isBn ? "লাইভ পালস:" : "Live Pulse:"}</span>
                  </span>
                  <div className="overflow-hidden relative flex-1 min-w-0">
                    <div className="whitespace-nowrap flex items-center gap-6 text-white/95 text-xs font-medium animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:[animation-play-state:paused]">
                      <span>
                        {isBn
                          ? "🏖️ কক্সবাজার ২৮°C · ☁️ সাজেক ২২°C · 🍵 শ্রীমঙ্গল ২৪°C · 🐅 খুলনা ২৬°C"
                          : "🏖️ Cox's Bazar 28°C · ☁️ Sajek 22°C · 🍵 Sreemangal 24°C · 🐅 Khulna 26°C"}
                      </span>
                      <span aria-hidden="true">
                        {isBn
                          ? "🏖️ কক্সবাজার ২৮°C · ☁️ সাজেক ২২°C · 🍵 শ্রীমঙ্গল ২৪°C · 🐅 খুলনা ২৬°C"
                          : "🏖️ Cox's Bazar 28°C · ☁️ Sajek 22°C · 🍵 Sreemangal 24°C · 🐅 Khulna 26°C"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Separate Dedicated Weather Button with Non-Transparent Surface (Text never slides under it) */}
                <Link
                  href="/weather"
                  className="flex items-center gap-1.5 px-3.5 py-3 text-[#35D07F] font-bold shrink-0 bg-[#07251c] hover:bg-[#0c3528] border-l border-white/20 transition-colors z-10 focus:outline-none focus:ring-1 focus:ring-[#35D07F]"
                >
                  <span>{isBn ? "আবহাওয়া" : "Weather"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: The Iconic FEATURED SPOTLIGHT Card */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
            <div className="relative rounded-3xl overflow-hidden bg-[#0B2E22]/90 dark:bg-[#0c241c]/95 backdrop-blur-2xl border border-white/25 shadow-2xl p-4 sm:p-5 text-white transition-all duration-300 hover:shadow-[0_20px_50px_rgba(16,185,129,0.25)]">
              
              {/* Top Header: Badge, Rating & Interactive Bookmark */}
              <div className="flex items-center justify-between mb-3.5 gap-2">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-[#F4A340]/20 border border-[#F4A340]/40 text-xs font-black text-[#F4A340] whitespace-nowrap shrink-0">
                  <span className="w-2 h-2 rounded-full bg-[#F4A340] animate-pulse shrink-0" />
                  <span className="sm:hidden">{isBn ? "স্পটলাইট" : "FEATURED"}</span>
                  <span className="hidden sm:inline">{isBn ? "নির্বাচিত স্পটলাইট" : "FEATURED SPOTLIGHT"}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Real Interactive Bookmark Button */}
                  <button
                    type="button"
                    onClick={() => toggleBookmark(currentSlide.id)}
                    className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-white transition-colors cursor-pointer shrink-0"
                    title={isCurrentBookmarked ? "Remove from saved" : "Save destination"}
                    aria-label={isCurrentBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        isCurrentBookmarked ? "fill-[#F4A340] text-[#F4A340]" : "text-white/80"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Spotlight Image Card */}
              <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden mb-4 group">
                <Image
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 440px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061B14] via-black/25 to-transparent" />
                
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-2xl sm:text-3xl font-black drop-shadow-md">
                    {isBn ? currentSlide.title_bn : currentSlide.title}
                  </h3>
                  <p className="text-xs text-[#D1E0D8] font-medium flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#F4A340]" />
                    <span>{isBn ? currentSlide.location_bn : currentSlide.location}</span>
                  </p>
                </div>
              </div>

              {/* Spotlight Description & Tags */}
              <div className="space-y-3.5">
                <p className="text-xs sm:text-sm text-[#D1E0D8] leading-relaxed line-clamp-2">
                  {isBn ? currentSlide.tagline_bn : currentSlide.tagline}
                </p>

                <div className="flex flex-wrap items-center gap-1.5">
                  {(isBn && currentSlide.tags_bn ? currentSlide.tags_bn : currentSlide.tags).map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-xs font-semibold text-white/90"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Explore CTA Button */}
                <Link
                  href={`/destinations/${currentSlide.slug}`}
                  className="w-full mt-2 min-h-[44px] py-3 px-4 rounded-xl bg-gradient-to-r from-[#10B981] to-[#0f4a38] hover:from-[#35D07F] hover:to-[#10B981] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>{isBn ? "গন্তব্যের বিস্তারিত দেখুন" : "Explore Destination"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Control Ribbon & Ticker */}
      <div className="relative z-10 w-full bg-[#061B14]/90 backdrop-blur-md border-t border-white/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-[#D1E0D8]">
          
          {/* Location Indicator & Pause/Play Control */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <MapPin className="w-3.5 h-3.5 text-[#F4A340]" />
              <span>{isBn ? currentSlide.location_bn : currentSlide.location}</span>
            </div>

            {/* Slider Dots */}
            <div className="flex items-center gap-1.5">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === activeSlide ? "w-6 bg-[#F4A340]" : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Pause / Play Toggle for Accessibility */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="min-w-[34px] min-h-[34px] p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer text-white flex items-center justify-center"
              title={isPlaying ? "Pause background animation" : "Resume background animation"}
              aria-label={isPlaying ? "Pause background animation" : "Resume background animation"}
              aria-pressed={!isPlaying}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Quick Categories Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {[
              { name: "Beaches", name_bn: "সৈকত", href: "/destinations?category=Beach" },
              { name: "Hills", name_bn: "পাহাড়", href: "/destinations?category=Hill" },
              { name: "Forests", name_bn: "বনানী", href: "/destinations?category=Forest" },
              { name: "Islands", name_bn: "দ্বীপ", href: "/destinations?category=Island" },
              { name: "Heritage", name_bn: "ঐতিহ্য", href: "/destinations?category=Heritage" },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-colors"
              >
                {isBn ? cat.name_bn : cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Infinite Scrolling Ticker Track (High-contrast 13px division/district labels) */}
        <div className="w-full overflow-hidden border-t border-white/10 py-2 bg-[#04120D]">
          <div className="flex gap-8 whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D1E0D8]">
                <span>{item.emoji}</span>
                <span className="text-white font-bold">{isBn ? item.name_bn : item.name}</span>
                <span className="text-[13px] text-[#A7F3D0] font-medium">({isBn ? item.loc_bn : item.loc})</span>
                <span className="text-white/20 ml-4">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

