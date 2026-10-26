"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import destinationsData from "@/data/destinations.json";
import { Destination } from "@/types/destination";
import { TOTAL_DESTINATIONS, TOTAL_DIVISIONS, TOTAL_DISTRICTS } from "@/lib/constants";
import { formatNumberEnBn } from "@/lib/utils";
import { CATEGORIES_BN, formatDigits } from "@/lib/i18n";
import {
  Search,
  MapPin,
  ArrowRight,
  Pause,
  Play,
  Bookmark,
  Flame,
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
    location: "Khulna · Mangrove Wilderness",
    location_bn: "খুলনা · ম্যানগ্রোভ অরণ্য",
    tagline: "The largest mangrove wilderness on earth, home of the majestic Royal Bengal Tiger.",
    tagline_bn: "পৃথিবীর বৃহত্তম ম্যানগ্রোভ অরণ্য এবং রয়েল বেঙ্গল টাইগারের বিশ্বখ্যাত আবাসভূমি।",
    rating: "4.9 · UNESCO Heritage",
    rating_bn: "৪.৯ · ইউনেস্কো বিশ্ব ঐতিহ্য",
    tags: ["Royal Bengal Tiger", "Mangrove Cruise", "Bio Reserve"],
    tags_bn: ["রয়েল বেঙ্গল টাইগার", "ম্যানগ্রোভ ক্রুজ", "বায়োস্ফিয়ার রিজার্ভ"],
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
    tags: ["Cloud Sea", "Eco Resort", "Konglak Peak"],
    tags_bn: ["মেঘের সমুদ্র", "ইকো রিসোর্ট", "কংলাক পাহাড়"],
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
    tags: ["Longest Beach", "Sunset Point", "Marine Drive"],
    tags_bn: ["দীর্ঘতম সৈকত", "সূর্যাস্ত পয়েন্ট", "মেরিন ড্রাইভ"],
  },
  {
    id: 3,
    image: "/assets/destinations/srimangal.webp",
    slug: "srimangal",
    title: "Sreemangal",
    title_bn: "শ্রীমঙ্গল",
    location: "Moulvibazar · Tea Capital",
    location_bn: "মৌলভীবাজার · চায়ের রাজধানী",
    tagline: "Endless rolling green tea gardens, rainforest trails, and misty quiet mornings.",
    tagline_bn: "সবুজে ঘেরা চায়ের বাগান, লাউয়াছড়া রেইনফরেস্ট আর স্নিগ্ধ কুয়াশাভেজা সকাল।",
    rating: "4.8 · Explorer Score",
    rating_bn: "৪.৮ · এক্সপ্লোরার স্কোর",
    tags: ["Tea Gardens", "Lawachara Forest", "7-Color Tea"],
    tags_bn: ["চা বাগান", "লাউয়াছড়া বন", "৭ রঙের চা"],
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
    tags: ["Coral Reefs", "Blue Waters", "Coconut Groves"],
    tags_bn: ["প্রবাল প্রাচীর", "নীল জলরাশি", "নারিকেল বাগান"],
  },
];

const HERO_DIVISIONS = [
  { name: "", label: "All", label_bn: "সব বিভাগ" },
  { name: "Chattogram", label: "Chattogram", label_bn: "চট্টগ্রাম" },
  { name: "Sylhet", label: "Sylhet", label_bn: "সিলেট" },
  { name: "Dhaka", label: "Dhaka", label_bn: "ঢাকা" },
  { name: "Khulna", label: "Khulna", label_bn: "খুলনা" },
  { name: "Barishal", label: "Barishal", label_bn: "বরিশাল" },
  { name: "Rajshahi", label: "Rajshahi", label_bn: "রাজশাহী" },
  { name: "Rangpur", label: "Rangpur", label_bn: "রংপুর" },
  { name: "Mymensingh", label: "Mymensingh", label_bn: "ময়মনসিংহ" },
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
  const [mountedOtherSlides, setMountedOtherSlides] = useState(false);

  // Live Tourism Weather Pulse State (Connected to Open-Meteo)
  const [liveWeather, setLiveWeather] = useState<{
    coxsBazar: number | null;
    sajek: number | null;
    sreemangal: number | null;
    khulna: number | null;
    lastUpdated: Date | null;
    isLoading: boolean;
    isError: boolean;
  }>({
    coxsBazar: 33,
    sajek: 32,
    sreemangal: 33,
    khulna: 33,
    lastUpdated: null,
    isLoading: true,
    isError: false,
  });

  // Rotate between at least 3 featured destinations on client mount/reload
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * HERO_SLIDES.length);
    setActiveSlide(randomIndex);
  }, []);

  // Fetch real-time weather from Open-Meteo for 4 key hubs
  useEffect(() => {
    let isSubscribed = true;
    const fetchLivePulse = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=21.4272,23.3820,24.3065,22.8456&longitude=92.0058,92.2938,91.7296,89.5403&current=temperature_2m&timezone=Asia%2FDhaka"
        );
        if (!res.ok) throw new Error("Weather fetch failed");
        const data = await res.json();
        if (Array.isArray(data) && data.length >= 4 && isSubscribed) {
          setLiveWeather({
            coxsBazar: Math.round(data[0].current.temperature_2m),
            sajek: Math.round(data[1].current.temperature_2m),
            sreemangal: Math.round(data[2].current.temperature_2m),
            khulna: Math.round(data[3].current.temperature_2m),
            lastUpdated: new Date(),
            isLoading: false,
            isError: false,
          });
        }
      } catch {
        if (isSubscribed) {
          setLiveWeather((prev) => ({
            ...prev,
            isLoading: false,
            isError: true,
            lastUpdated: prev.lastUpdated || new Date(),
          }));
        }
      }
    };

    fetchLivePulse();
    const timer = setInterval(fetchLivePulse, 10 * 60 * 1000);
    return () => {
      isSubscribed = false;
      clearInterval(timer);
    };
  }, []);

  const searchBoxRef = useRef<HTMLDivElement>(null);
  const allDestinations = destinationsData as unknown as Destination[];

  // Idle deferral callback for slides 2-5 after slide 1 loads
  const handleFirstSlideLoaded = () => {
    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback(
          () => setMountedOtherSlides(true),
          { timeout: 1500 }
        );
      } else {
        setTimeout(() => setMountedOtherSlides(true), 1500);
      }
    }
  };

  // Fallback timer to guarantee slides 2-5 mount even if onLoad already completed before hydration
  useEffect(() => {
    const timer = setTimeout(() => {
      setMountedOtherSlides(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Slide rotation timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allDestinations
      .filter((d) => {
        const nameMatch = d.name.toLowerCase().includes(q);
        const nameBnMatch = d.name_bn?.includes(q);
        const distMatch = d.district.toLowerCase().includes(q);
        return nameMatch || nameBnMatch || distMatch;
      })
      .slice(0, 5);
  }, [searchQuery, allDestinations]);

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
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedDivision) params.set("division", selectedDivision);
    router.push(`/destinations?${params.toString()}`);
  };

  const currentSlide = HERO_SLIDES[activeSlide];
  const isCurrentBookmarked = isBookmarked(currentSlide.id);

  return (
    <section
      className="relative flex flex-col justify-between overflow-hidden bg-[#061B14]"
      aria-label="Bangladesh Travel Hero"
    >
      {/* Background Cinematic Crossfade Slider (Slide 1 eager with priority; slides 2-5 deferred until idle) */}
      <div className="absolute inset-0 z-0">
        {HERO_SLIDES.map((slide, idx) => {
          if (idx > 0 && !mountedOtherSlides) return null;
          return (
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
                loading={idx === 0 ? "eager" : "lazy"}
                onLoad={idx === 0 ? handleFirstSlideLoaded : undefined}
                className="object-cover transition-transform duration-7000 ease-linear scale-105"
              />
              {/* Multi-layered directional gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#061B14]/95 via-[#061B14]/65 to-[#061B14]/15" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061B14]/85 via-transparent to-black/25" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12)_0%,transparent_60%)] pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* Main 2-Column Hero Content Grid (Mobile fold optimized) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16 pb-8 sm:pb-10 flex-1 flex items-center w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center w-full">
          
          {/* Left Column: Eyebrow, Title, Subtitle, Search, Division Chips, Trending */}
          <div className="lg:col-span-7 text-left text-white space-y-4 sm:space-y-5">
            
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-widest text-[#35D07F] uppercase shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span>{isBn ? "বাংলাদেশ আবিষ্কার" : "EXPLORE BANGLADESH"}</span>
            </div>

            {/* Title: One Country, Endless Stories */}
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
              className="max-w-xl text-sm sm:text-base text-[#D1E0D8] font-normal leading-relaxed"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}
            >
              {isBn
                ? "সৈকত থেকে পাহাড়, নদী থেকে সুন্দরবনের অরণ্য — বাংলাদেশের অবিস্মরণীয় সৌন্দর্যের গল্প আবিষ্কার করুন সম্পূর্ণ ইন্টারেক্টিভ গাইডসহ।"
                : "From beaches to hills, rivers to mangrove forests — discover the stories that make Bangladesh unforgettable with curated maps, hotels, and travel guides."}
            </p>

            {/* Main Search Bar (Dedicated to Destinations) */}
            <div className="relative max-w-xl" ref={searchBoxRef}>
              <form
                onSubmit={handleSearch}
                className="p-1.5 sm:p-2 rounded-2xl sm:rounded-full bg-white/95 dark:bg-[#0B2E22]/95 backdrop-blur-xl border border-white/30 shadow-2xl flex items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-[#10B981]"
              >
                {/* Search Text Input */}
                <div className="flex items-center gap-2.5 w-full flex-1 px-4 py-1.5 text-foreground min-w-0">
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
                      selectedDivision
                        ? isBn
                          ? `${selectedDivision} বিভাগের স্থান খুঁজুন...`
                          : `Search places in ${selectedDivision}...`
                        : isBn
                        ? "স্থান বা গন্তব্য খুঁজুন..."
                        : "Search places, destinations..."
                    }
                    className="w-full flex-1 min-w-0 bg-transparent text-sm sm:text-base font-medium placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none truncate"
                    aria-label={isBn ? "স্থান বা গন্তব্য খুঁজুন" : "Search places, destinations"}
                  />
                </div>

                {/* Submit Search Button */}
                <button
                  type="submit"
                  className="min-h-[42px] px-6 py-2.5 rounded-xl sm:rounded-full bg-gradient-to-r from-[#10B981] to-[#0f4a38] hover:from-[#35D07F] hover:to-[#10B981] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
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
                            loading="lazy"
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

            {/* Division Filter Chips (Directly below search, sets division filter, single-line horizontal scroll with soft fade) */}
            <div
              className="relative w-full max-w-xl overflow-hidden py-0.5"
              style={{
                maskImage: "linear-gradient(to right, black calc(100% - 28px), transparent 100%)",
                WebkitMaskImage: "linear-gradient(to right, black calc(100% - 28px), transparent 100%)",
              }}
            >
              <div
                className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap py-0.5"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {HERO_DIVISIONS.map((div) => {
                  const isActive = selectedDivision === div.name;
                  return (
                    <button
                      key={div.name || "all"}
                      type="button"
                      onClick={() => {
                        if (div.name === "") {
                          setSelectedDivision("");
                        } else {
                          setSelectedDivision(selectedDivision === div.name ? "" : div.name);
                        }
                      }}
                      className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                        isActive
                          ? "bg-[#10B981] text-[#061B14] font-black border-[#10B981] shadow-md"
                          : "bg-white/10 hover:bg-white/20 text-white/90 border-white/20 hover:border-white/40"
                      }`}
                      aria-pressed={isActive}
                    >
                      {isBn ? div.label_bn : div.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trending Quick Chips (Directly below division chips in a single line) */}
            <div
              className="flex items-center gap-1.5 text-xs text-white/90 overflow-x-auto whitespace-nowrap py-0.5 max-w-xl"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <span className="font-bold text-[#F4A340] mr-1 flex items-center gap-1.5 shrink-0">
                <Flame className="w-3.5 h-3.5 text-[#F4A340] shrink-0" strokeWidth={2} />
                <span>{isBn ? "ট্রেন্ডিং:" : "Trending:"}</span>
              </span>
              {[
                { name: "Sajek Valley", name_bn: "সাজেক", slug: "sajek-valley" },
                { name: "Cox's Bazar", name_bn: "কক্সবাজার", slug: "coxs-bazar" },
                { name: "Sreemangal", name_bn: "শ্রীমঙ্গল", slug: "srimangal" },
                { name: "Tanguar Haor", name_bn: "টাঙ্গুয়ার হাওর", slug: "tanguar-haor" },
                { name: "Sundarbans", name_bn: "সুন্দরবন", slug: "sundarbans" },
                { name: "Nilgiri", name_bn: "নীলগিরি", slug: "nilgiri" },
              ].map((pop) => (
                <Link
                  key={pop.slug}
                  href={`/destinations/${pop.slug}`}
                  className="shrink-0 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all font-semibold backdrop-blur-sm"
                >
                  {isBn ? pop.name_bn : pop.name}
                </Link>
              ))}
            </div>

          </div>

          {/* Right Column: FEATURED SPOTLIGHT Card */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
            <div className="relative rounded-3xl overflow-hidden bg-[#0B2E22]/90 dark:bg-[#0c241c]/95 backdrop-blur-2xl border border-white/25 shadow-2xl p-4 sm:p-5 text-white transition-all duration-300 hover:shadow-[0_20px_50px_rgba(16,185,129,0.25)]">
              
              {/* Top Header: Badge, Rating & Interactive Bookmark */}
              <div className="flex items-center justify-between mb-3.5 gap-2">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-[#F4A340]/20 border border-[#F4A340]/40 text-xs font-black text-[#F4A340] whitespace-nowrap shrink-0">
                  <span className="w-2 h-2 rounded-full bg-[#F4A340] animate-pulse shrink-0" />
                  <span>{isBn ? "নির্বাচিত স্পটলাইট" : "FEATURED SPOTLIGHT"}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
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
              <div className="relative aspect-[16/10] sm:aspect-auto h-52 sm:h-60 rounded-2xl overflow-hidden mb-4 group">
                <Image
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 440px"
                  loading="lazy"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061B14] via-black/25 to-transparent" />
                
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h2 className="text-2xl sm:text-3xl font-black drop-shadow-md">
                    {isBn ? currentSlide.title_bn : currentSlide.title}
                  </h2>
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
                  className="w-full mt-2 min-h-[42px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#10B981] to-[#0f4a38] hover:from-[#35D07F] hover:to-[#10B981] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>{isBn ? "গন্তব্যের বিস্তারিত দেখুন" : "Explore Destination"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BELOW-HERO STRIP: ONE Slim Unified Strip (Counters + Live Pulse Weather + Slide Controls) */}
      <div className="relative z-10 w-full bg-[#061B14]/95 backdrop-blur-xl border-t border-white/15 py-2.5 sm:py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-[#D1E0D8]">
          
          {/* 1. Verified Counter Stats */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 shrink-0">
            <Link href="/destinations" className="flex items-center gap-1.5 group hover:opacity-90 transition-opacity">
              <span className="text-sm sm:text-base font-black text-[#35D07F] tabular-nums">
                {isBn ? `${formatNumberEnBn(TOTAL_DESTINATIONS, true)}+` : `${TOTAL_DESTINATIONS}+`}
              </span>
              <span className="text-xs text-[#D1E0D8] font-medium">
                {isBn ? "দর্শনীয় স্থান" : "Places"}
              </span>
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/destinations" className="flex items-center gap-1.5 group hover:opacity-90 transition-opacity">
              <span className="text-sm sm:text-base font-black text-[#35D07F] tabular-nums">
                {formatNumberEnBn(TOTAL_DIVISIONS, isBn)}
              </span>
              <span className="text-xs text-[#D1E0D8] font-medium">
                {isBn ? "বিভাগ" : "Divisions"}
              </span>
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/destinations" className="flex items-center gap-1.5 group hover:opacity-90 transition-opacity">
              <span className="text-sm sm:text-base font-black text-[#35D07F] tabular-nums">
                {formatNumberEnBn(TOTAL_DISTRICTS, isBn)}
              </span>
              <span className="text-xs text-[#D1E0D8] font-medium">
                {isBn ? "জেলা" : "Districts"}
              </span>
            </Link>
          </div>

          {/* 2. Live Tourism Weather Pulse Bar (Connected to Open-Meteo API) */}
          <div className="flex items-center gap-2 w-full md:w-auto md:flex-1 md:max-w-xl md:mx-4 overflow-hidden rounded-full bg-white/5 border border-white/10 px-3 py-1.5">
            <span className="font-bold text-[#35D07F] flex items-center gap-1.5 shrink-0 text-xs">
              <span className={`w-2 h-2 rounded-full ${liveWeather.isLoading ? "bg-amber-400" : liveWeather.isError ? "bg-amber-400" : "bg-[#10B981]"} animate-pulse`} />
              <span>{isBn ? "লাইভ পালস:" : "Live Pulse:"}</span>
            </span>
            <div className="overflow-hidden relative flex-1 min-w-0">
              <div className="whitespace-nowrap flex items-center gap-6 text-white/95 text-xs font-medium animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:[animation-play-state:paused]">
                <span>
                  {`${isBn ? "🏖️ কক্সবাজার" : "🏖️ Cox's Bazar"} ${liveWeather.coxsBazar !== null ? formatDigits(liveWeather.coxsBazar, isBn) : "২৮"}°C · ${isBn ? "☁️ সাজেক" : "☁️ Sajek"} ${liveWeather.sajek !== null ? formatDigits(liveWeather.sajek, isBn) : "২২"}°C · ${isBn ? "🍵 শ্রীমঙ্গল" : "🍵 Sreemangal"} ${liveWeather.sreemangal !== null ? formatDigits(liveWeather.sreemangal, isBn) : "২৪"}°C · ${isBn ? "🐅 খুলনা" : "🐅 Khulna"} ${liveWeather.khulna !== null ? formatDigits(liveWeather.khulna, isBn) : "২৬"}°C`}
                </span>
                <span aria-hidden="true">
                  {`${isBn ? "🏖️ কক্সবাজার" : "🏖️ Cox's Bazar"} ${liveWeather.coxsBazar !== null ? formatDigits(liveWeather.coxsBazar, isBn) : "২৮"}°C · ${isBn ? "☁️ সাজেক" : "☁️ Sajek"} ${liveWeather.sajek !== null ? formatDigits(liveWeather.sajek, isBn) : "২২"}°C · ${isBn ? "🍵 শ্রীমঙ্গল" : "🍵 Sreemangal"} ${liveWeather.sreemangal !== null ? formatDigits(liveWeather.sreemangal, isBn) : "২৪"}°C · ${isBn ? "🐅 খুলনা" : "🐅 Khulna"} ${liveWeather.khulna !== null ? formatDigits(liveWeather.khulna, isBn) : "২৬"}°C`}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-white/50 shrink-0 font-normal hidden lg:inline">
              {liveWeather.isLoading ? (isBn ? "লোড হচ্ছে..." : "Syncing...") : liveWeather.isError ? (isBn ? "ক্যাশড" : "Cached") : (isBn ? "সরাসরি" : "Live")}
            </span>
            <Link
              href="/weather"
              className="flex items-center gap-1 text-xs text-[#35D07F] font-bold shrink-0 hover:underline pl-2 border-l border-white/15"
            >
              <span>{isBn ? "আবহাওয়া" : "Weather"}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* 3. Slider Controls (Dots + Play/Pause) */}
          <div className="flex items-center gap-3 shrink-0">
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
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="min-w-[30px] min-h-[30px] p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer text-white flex items-center justify-center shrink-0"
              title={isPlaying ? "Pause background animation" : "Resume background animation"}
              aria-label={isPlaying ? "Pause background animation" : "Resume background animation"}
              aria-pressed={!isPlaying}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
