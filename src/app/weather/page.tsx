"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  CloudSun,
  Sun,
  CloudRain,
  Cloud,
  Wind,
  Droplets,
  ArrowRight,
  MapPin,
  RefreshCw,
  Sparkles,
  Search,
  Clock,
  Sunrise,
  Sunset,
  Navigation,
  Zap,
  Thermometer,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  Radio,
  SlidersHorizontal,
  ChevronDown,
  ArrowUp,
} from "lucide-react";

export interface WeatherSpot {
  name: string;
  name_bn: string;
  district: string;
  division: string;
  lat: number;
  lng: number;
  image: string;
  slug: string;
}

interface WeatherData {
  current?: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  hourly?: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: number[];
  };
  daily?: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise?: string[];
    sunset?: string[];
    uv_index_max?: number[];
  };
}

// 8 Divisions of Bangladesh
const DIVISIONS = [
  { key: "all", en: "All Bangladesh", bn: "সমগ্র বাংলাদেশ" },
  { key: "Chattogram", en: "Chattogram", bn: "চট্টগ্রাম" },
  { key: "Sylhet", en: "Sylhet", bn: "সিলেট" },
  { key: "Dhaka", en: "Dhaka", bn: "ঢাকা" },
  { key: "Khulna", en: "Khulna", bn: "খুলনা" },
  { key: "Barishal", en: "Barishal", bn: "বরিশাল" },
  { key: "Rajshahi", en: "Rajshahi", bn: "রাজশাহী" },
  { key: "Rangpur", en: "Rangpur", bn: "রংপুর" },
  { key: "Mymensingh", en: "Mymensingh", bn: "ময়মনসিংহ" },
];

// Top 6 Premier Holiday Havens
const ICONIC_HUBS: WeatherSpot[] = [
  {
    name: "Sajek Valley",
    name_bn: "সাজেক ভ্যালি",
    district: "Rangamati",
    division: "Chattogram",
    lat: 23.3819,
    lng: 92.2938,
    image: "/assets/destinations/sajek-valley-konglak-peak.webp",
    slug: "sajek-valley",
  },
  {
    name: "Cox's Bazar",
    name_bn: "কক্সবাজার সমুদ্র সৈকত",
    district: "Cox's Bazar",
    division: "Chattogram",
    lat: 21.43,
    lng: 91.98,
    image: "/assets/destinations/coxs-bazar.webp",
    slug: "coxs-bazar",
  },
  {
    name: "Saint Martin's Island",
    name_bn: "সেন্ট মার্টিন প্রবাল দ্বীপ",
    district: "Cox's Bazar",
    division: "Chattogram",
    lat: 20.627,
    lng: 92.322,
    image: "/assets/destinations/saint-martins-island.webp",
    slug: "saint-martins-island",
  },
  {
    name: "Sreemangal & Lawachara",
    name_bn: "শ্রীমঙ্গল চা বাগান ও লাউয়াছড়া",
    district: "Moulvibazar",
    division: "Sylhet",
    lat: 24.32,
    lng: 91.78,
    image: "/assets/destinations/lawachara-national-park.webp",
    slug: "lawachara-national-park",
  },
  {
    name: "Tanguar Haor",
    name_bn: "টাঙ্গুয়ার হাওর জলরাশি",
    district: "Sunamganj",
    division: "Sylhet",
    lat: 25.12,
    lng: 91.07,
    image: "/assets/destinations/tanguar-haor.webp",
    slug: "tanguar-haor",
  },
  {
    name: "Sundarbans",
    name_bn: "সুন্দরবন ম্যানগ্রোভ বন",
    district: "Bagerhat",
    division: "Khulna",
    lat: 22.0,
    lng: 89.6,
    image: "/assets/destinations/sundarbans.webp",
    slug: "sundarbans",
  },
];

function getWeatherCondition(code: number, isBn: boolean) {
  if (code === 0) {
    return {
      category: "clear",
      label: isBn ? "রৌদ্রোজ্জ্বল পরিষ্কার আকাশ" : "Clear Sunny Sky",
      icon: Sun,
      color: "text-amber-400",
      bgGradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    };
  }
  if (code >= 1 && code <= 3) {
    return {
      category: "cloudy",
      label: isBn ? "আংশিক মেঘলা স্নিগ্ধ আকাশ" : "Partly Cloudy",
      icon: CloudSun,
      color: "text-sky-400",
      bgGradient: "from-sky-500/20 via-teal-500/10 to-transparent",
    };
  }
  if (code >= 45 && code <= 48) {
    return {
      category: "fog",
      label: isBn ? "কুয়াশাচ্ছন্ন মিষ্টি ভোর" : "Misty / Foggy",
      icon: Cloud,
      color: "text-slate-300",
      bgGradient: "from-slate-400/20 via-zinc-500/10 to-transparent",
    };
  }
  if (code >= 51 && code <= 67) {
    return {
      category: "rain",
      label: isBn ? "ঝিরিঝিরি স্নিগ্ধ বৃষ্টিপাত" : "Rain Showers",
      icon: CloudRain,
      color: "text-blue-400",
      bgGradient: "from-blue-600/25 via-indigo-950/20 to-transparent",
    };
  }
  if (code >= 80 && code <= 99) {
    return {
      category: "thunder",
      label: isBn ? "বজ্রবৃষ্টি ও দমকা বাতাস" : "Thunderstorm & Rain",
      icon: Zap,
      color: "text-purple-400",
      bgGradient: "from-purple-600/30 via-indigo-950/25 to-transparent",
    };
  }
  return {
    category: "pleasant",
    label: isBn ? "মনোরম আরামদায়ক আবহাওয়া" : "Pleasant Mild Weather",
    icon: CloudSun,
    color: "text-emerald-400",
    bgGradient: "from-emerald-500/20 via-teal-900/10 to-transparent",
  };
}

function getWindDirectionText(degrees: number, isBn: boolean) {
  const directions = isBn
    ? ["উত্তর", "উত্তর-পূর্ব", "পূর্ব", "দক্ষিণ-পূর্ব", "দক্ষিণ", "দক্ষিণ-পশ্চিম", "পশ্চিম", "উত্তর-পশ্চিম"]
    : ["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

function formatTimeString(isoString?: string) {
  if (!isoString) return "--:--";
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  } catch {
    return "--:--";
  }
}

function WeatherSpotSync({
  allSpots,
  onSpotResolved,
}: {
  allSpots: WeatherSpot[];
  onSpotResolved: (spot: WeatherSpot) => void;
}) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const spotParam = searchParams.get("spot");
    if (spotParam) {
      const match = allSpots.find((s) => s.slug === spotParam);
      if (match) onSpotResolved(match);
    }
  }, [searchParams, allSpots, onSpotResolved]);

  return null;
}

function WeatherContent() {
  const { language } = useApp();
  const isBn = language === "bn";

  const [extraSpots, setExtraSpots] = useState<WeatherSpot[]>([]);

  useEffect(() => {
    fetch("/data/map-destinations.json")
      .then((res) => res.json())
      .then((items: Array<{
        name: string;
        name_bn: string;
        dist: string;
        div: string;
        lat: number;
        lng: number;
        img: string;
        slug: string;
      }>) => {
        const loaded: WeatherSpot[] = items.map((it) => ({
          name: it.name,
          name_bn: it.name_bn,
          district: it.dist,
          division: it.div,
          lat: it.lat,
          lng: it.lng,
          image: it.img,
          slug: it.slug,
        }));
        setExtraSpots(loaded);
      })
      .catch(() => {});
  }, []);

  // Map spots (ICONIC_HUBS initial + full spots on client load)
  const allDestSpots: WeatherSpot[] = useMemo(() => {
    if (extraSpots.length === 0) return ICONIC_HUBS;
    const seen = new Set<string>();
    const spots: WeatherSpot[] = [];
    for (const d of [...ICONIC_HUBS, ...extraSpots]) {
      if (!d.slug || seen.has(d.slug)) continue;
      seen.add(d.slug);
      spots.push(d);
    }
    return spots;
  }, [extraSpots]);

  // Default to Sajek Valley or spot query param
  const initialSpot = useMemo(() => {
    return allDestSpots.find((s) => s.slug === "sajek-valley") || ICONIC_HUBS[0];
  }, [allDestSpots]);

  const [selectedHub, setSelectedHub] = useState<WeatherSpot>(initialSpot);

  const handleSpotResolved = useCallback((spot: WeatherSpot) => {
    setSelectedHub(spot);
  }, []);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [allTemps, setAllTemps] = useState<Record<string, number>>({});
  const [showHowToGuide, setShowHowToGuide] = useState(false);

  // Live Current Clock for Dribbble Image-2 Header
  const [currentTime, setCurrentTime] = useState("");
  const [currentDateStr, setCurrentDateStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
      );
      setCurrentDateStr(
        isBn
          ? now.toLocaleDateString("bn-BD", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
          : now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, [isBn]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number>(24);

  const heroRef = useRef<HTMLDivElement>(null);

  // Search Autocomplete Matching
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allDestSpots
      .filter((d) => {
        return (
          d.name.toLowerCase().includes(q) ||
          (d.name_bn && d.name_bn.includes(q)) ||
          d.district.toLowerCase().includes(q) ||
          d.division.toLowerCase().includes(q)
        );
      })
      .slice(0, 8);
  }, [searchQuery, allDestSpots]);

  // Filtered Spots for the Regional Weather Explorer
  const filteredSpots = useMemo(() => {
    let list = allDestSpots;

    if (selectedDivision !== "all") {
      list = list.filter(
        (h) => h.division.toLowerCase() === selectedDivision.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          (d.name_bn && d.name_bn.includes(q)) ||
          d.district.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedDivision, searchQuery, allDestSpots]);

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(24);
  }, [selectedDivision, searchQuery]);

  // Fetch Full Telemetry from Open-Meteo for Selected Spot
  useEffect(() => {
    let isCancelled = false;

    async function fetchWeather() {
      setLoading(true);
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${selectedHub.lat}&longitude=${selectedHub.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=Asia%2FDhaka&forecast_days=7`;
        const res = await fetch(url);
        const data = await res.json();
        if (!isCancelled) {
          setWeatherData(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch weather", err);
        if (!isCancelled) setLoading(false);
      }
    }

    fetchWeather();
    return () => {
      isCancelled = true;
    };
  }, [selectedHub]);

  // Preload Sample Temperatures for Top Hubs
  useEffect(() => {
    let isCancelled = false;
    async function fetchSampleTemps() {
      const sampleSpots = allDestSpots.slice(0, 48);
      const temps: Record<string, number> = {};

      await Promise.all(
        sampleSpots.map(async (spot) => {
          try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${spot.lat}&longitude=${spot.lng}&current=temperature_2m&timezone=Asia%2FDhaka`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.current?.temperature_2m !== undefined) {
              temps[spot.name] = data.current.temperature_2m;
            }
          } catch {
            // silent fail
          }
        })
      );

      if (!isCancelled) {
        setAllTemps((prev) => ({ ...prev, ...temps }));
      }
    }

    fetchSampleTemps();
    return () => {
      isCancelled = true;
    };
  }, [allDestSpots]);

  const current = weatherData?.current;
  const condition = current ? getWeatherCondition(current.weather_code, isBn) : null;
  const ConditionIcon = condition?.icon || Sun;

  // Next 24 Hours Timeline (AirEast / Cancun style)
  const next24Hours = useMemo(() => {
    if (!weatherData?.hourly) return [];
    const hourly = weatherData.hourly;
    const items = [];
    const count = Math.min(24, hourly.time.length);
    for (let i = 0; i < count; i++) {
      items.push({
        time: hourly.time[i],
        temp: Math.round(hourly.temperature_2m[i]),
        code: hourly.weather_code[i],
        rainProb: hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0,
      });
    }
    return items;
  }, [weatherData]);

  // 7-Day Extended Forecast (Göteborg Image-2 & Cancun Image-5 style)
  const dailyForecast = useMemo(() => {
    if (!weatherData?.daily) return [];
    const d = weatherData.daily;
    const items = [];
    let globalMin = 100;
    let globalMax = -100;

    for (let i = 0; i < d.time.length; i++) {
      const min = Math.round(d.temperature_2m_min[i]);
      const max = Math.round(d.temperature_2m_max[i]);
      if (min < globalMin) globalMin = min;
      if (max > globalMax) globalMax = max;

      items.push({
        date: d.time[i],
        code: d.weather_code[i],
        min,
        max,
        sunrise: d.sunrise?.[i],
        sunset: d.sunset?.[i],
        uv: d.uv_index_max?.[i] ?? 5,
      });
    }

    return items.map((item) => ({
      ...item,
      globalMin,
      globalMax,
    }));
  }, [weatherData]);

  const sunriseTime = formatTimeString(weatherData?.daily?.sunrise?.[0]);
  const sunsetTime = formatTimeString(weatherData?.daily?.sunset?.[0]);
  const maxUV = weatherData?.daily?.uv_index_max?.[0] ?? 5.5;
  const todayHigh = weatherData?.daily?.temperature_2m_max?.[0] ? Math.round(weatherData.daily.temperature_2m_max[0]) : null;
  const todayLow = weatherData?.daily?.temperature_2m_min?.[0] ? Math.round(weatherData.daily.temperature_2m_min[0]) : null;

  // Sun Arc progress
  const sunProgress = useMemo(() => {
    if (!weatherData?.daily?.sunrise?.[0] || !weatherData?.daily?.sunset?.[0]) return 50;
    const now = new Date().getTime();
    const rise = new Date(weatherData.daily.sunrise[0]).getTime();
    const set = new Date(weatherData.daily.sunset[0]).getTime();
    if (now <= rise) return 0;
    if (now >= set) return 100;
    return Math.round(((now - rise) / (set - rise)) * 100);
  }, [weatherData]);

  const handleSelectSpot = (spot: WeatherSpot) => {
    setSelectedHub(spot);
    setShowSearchDropdown(false);
    setSearchQuery("");
    heroRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen pt-20 pb-20 bg-background relative overflow-hidden transition-colors duration-500">
      <Suspense fallback={null}>
        <WeatherSpotSync allSpots={allDestSpots} onSpotResolved={handleSpotResolved} />
      </Suspense>
      {/* 0. DYNAMIC ATMOSPHERIC SKY CANOPY WITH ANIMATED FLOATING CLOUDS & RADIANT SUN CORONA (Inspired by Reference Image 1 & 3) */}
      <div className="relative w-full overflow-hidden pt-6 pb-4">
        {/* Living Ambient Sky Mesh Backdrop */}
        <div
          className={`pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[1600px] h-[550px] rounded-full blur-[160px] opacity-80 transition-all duration-1000 weather-ambient-glow bg-gradient-to-b ${
            condition?.bgGradient || "from-sky-500/20 via-teal-900/10 to-transparent"
          }`}
        />

        {/* Animated Floating Clouds & Radiant Sun (Inspired by Image 1 & 3) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden max-w-7xl mx-auto opacity-70 dark:opacity-40 select-none">
          {/* Cloud Layer 1 (Left Slow Drift) */}
          <div className="absolute top-4 left-6 cloud-drift-slow text-sky-200/60 dark:text-sky-900/40">
            <svg width="220" height="90" viewBox="0 0 220 90" fill="currentColor">
              <path d="M 40 75 Q 15 75 15 50 Q 15 30 35 28 Q 50 5 85 10 Q 115 -5 145 12 Q 170 0 190 22 Q 215 30 210 55 Q 215 75 185 75 Z" />
            </svg>
          </div>

          {/* Cloud Layer 2 (Right Fast Drift) */}
          <div className="absolute top-12 right-16 cloud-drift-fast text-teal-200/50 dark:text-teal-900/30">
            <svg width="180" height="75" viewBox="0 0 180 75" fill="currentColor">
              <path d="M 30 60 Q 10 60 10 40 Q 10 25 28 22 Q 40 5 70 8 Q 95 -4 120 10 Q 140 0 155 18 Q 175 25 170 45 Q 175 60 150 60 Z" />
            </svg>
          </div>

          {/* Radiant Sun Corona Glow (Pulsing Light Source) */}
          <div className="absolute -top-10 right-28 w-44 h-44 rounded-full bg-gradient-to-br from-amber-400/40 via-orange-400/20 to-transparent sun-corona-pulse blur-2xl" />
        </div>

        {/* TOP CANOPY DECK: LIVE SATELLITE RADAR BEACON & COMPACT SEARCH */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 z-40 text-center">
          {/* Live Satellite Radar Telemetry Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--surface-raised)]/90 backdrop-blur-xl border border-[var(--glass-border)] text-xs font-bold text-[#0f4a38] dark:text-[#2ecc71] mb-3 shadow-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="radar-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <Radio className="w-3.5 h-3.5 text-emerald-500" />
            <span>
              {isBn
                ? "লাইভ স্যাটেলাইট রাডার সক্রিয় • ৬৪ জেলা সংযুক্ত • রিয়েল-টাইম পূর্বাভাস"
                : "Live Satellite Telemetry Connected • 64 Districts • Real-Time"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight mb-2">
            {isBn ? "বাংলাদেশ লাইভ আবহাওয়া ও ভ্রমণ পূর্বাভাস" : "Bangladesh 7-Day Live Weather & Climate Guide"}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-2xl mx-auto mb-4">
            {isBn
              ? "৬৪ জেলার রিয়েল-টাইম তাপমাত্রা, বৃষ্টিপাত আপডেট ও পর্যটন আবহাওয়ার সঠিক নির্দেশিকা।"
              : "Real-time 7-day weather forecasts, seasonal climate guides, and rain updates across all 64 districts in Bangladesh."}
          </p>

          {/* Dynamic Travel Condition Banner (Live Status) */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/10 via-[#0f4a38]/10 to-teal-500/10 border border-[var(--glass-border)] text-xs font-semibold text-foreground">
              <Sparkles className="w-3.5 h-3.5 text-[#f4a340]" />
              <span>
                {current && current.precipitation > 0
                  ? isBn
                    ? "আজ বিভিন্ন অঞ্চলে বৃষ্টিপাত চলছে, ছাতা সাথে রাখুন।"
                    : "Showers reported in some areas, carry rainwear."
                  : isBn
                  ? `আজকের আবহাওয়া পর্যটনের জন্য চমৎকার! ${selectedHub.name}-এ উপভোগ্য আবহাওয়া বিরাজ করছে।`
                  : `Optimal travel weather reported across ${selectedHub.name}.`}
              </span>
            </span>
          </div>

          {/* Sleek Integrated Glass Search Input */}
          <div className="relative max-w-2xl mx-auto mb-3">
            <div className="relative shadow-xl rounded-2xl">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                placeholder={
                  isBn
                    ? "যেকোনো জেলা বা পর্যটন স্পট খুঁজুন (সাজেক, কক্সবাজার, সিলেট, শ্রীমঙ্গল...)"
                    : "Search any district, city, or destination (Sajek, Cox's Bazar, Sylhet...)"
                }
                className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-[var(--surface)]/95 backdrop-blur-xl border border-[var(--glass-border)] text-foreground placeholder:text-[var(--text-muted)] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0f4a38] dark:focus:ring-[#1f9d76] transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-xs font-bold px-2 py-1 rounded bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-foreground cursor-pointer"
                  >
                    {isBn ? "মুছুন" : "Clear"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowHowToGuide((prev) => !prev)}
                  className="px-2.5 py-1 rounded-xl bg-[var(--surface-raised)] hover:bg-[var(--surface)] border border-[var(--glass-border)] text-[11px] font-bold text-foreground transition-all flex items-center gap-1 cursor-pointer"
                  title="How to check"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#f4a340]" />
                  <span>{isBn ? "নিয়ম" : "Guide"}</span>
                </button>
              </div>
            </div>

            {/* Autocomplete Dropdown List */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-2xl z-50 overflow-hidden max-h-72 overflow-y-auto backdrop-blur-2xl text-left">
                {searchResults.map((dest, idx) => (
                  <button
                    key={`${dest.slug}-${idx}`}
                    type="button"
                    onClick={() => handleSelectSpot(dest)}
                    className="w-full px-5 py-3 flex items-center justify-between text-left hover:bg-[var(--surface-raised)] border-b border-[var(--glass-border)] last:border-none transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-[#f4a340] shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-foreground">
                          {isBn ? dest.name_bn || dest.name : dest.name}
                        </h4>
                        <p className="text-xs text-[var(--text-muted)]">
                          {dest.district}, {dest.division}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-lg bg-[#0f4a38]/10 text-[#0f4a38] dark:text-[#2ecc71]">
                      {isBn ? "আবহাওয়া দেখুন →" : "View Weather →"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 8-Division Quick Switcher (Directly inside Top Canopy) */}
          <div className="flex items-center justify-center gap-1.5 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
            {DIVISIONS.map((div) => {
              const isSelected = selectedDivision === div.key;
              return (
                <button
                  key={div.key}
                  type="button"
                  onClick={() => setSelectedDivision(div.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center shrink-0 ${
                    isSelected
                      ? "bg-[#0f4a38] text-white shadow-md dark:bg-[#1f9d76]"
                      : "bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--glass-border)] hover:bg-[var(--surface-raised)] hover:text-foreground"
                  }`}
                >
                  {isBn ? div.bn : div.en}
                </button>
              );
            })}
          </div>

          {/* Collapsible How-To-Check 3-Step Guide Banner */}
          {showHowToGuide && (
            <div className="mt-3 p-4 rounded-2xl bg-[#0f4a38]/10 dark:bg-[#1f9d76]/15 border border-[#0f4a38]/20 shadow-md animate-in fade-in slide-in-from-top-2 duration-300 text-left">
              <h4 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#f4a340]" />
                <span>{isBn ? "সহজ ৩টি ধাপে যেকোনো স্থানের আবহাওয়া দেখুন:" : "How to check weather in 3 easy steps:"}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-[var(--text-muted)]">
                <div className="p-2.5 rounded-xl bg-[var(--surface)]/80 border border-[var(--glass-border)]">
                  <strong className="text-foreground block mb-0.5 font-bold">
                    {isBn ? "১. যেকোনো জেলা সার্চ করুন" : "1. Search any spot"}
                  </strong>
                  <span>{isBn ? "সার্চবারে আপনার গন্তব্যের নাম লিখলেই সরাসরি সেই স্থানের আবহাওয়া আসবে।" : "Type any city or spot in the search bar above."}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--surface)]/80 border border-[var(--glass-border)]">
                  <strong className="text-foreground block mb-0.5 font-bold">
                    {isBn ? "২. ১-ক্লিকে শীর্ষ স্পট" : "2. 1-Click top spots"}
                  </strong>
                  <span>{isBn ? "সাজেক, কক্সবাজার বা সুন্দরবনের ছবিতে ক্লিক করে তৎক্ষণাৎ দৃশ্যপট পরিবর্তন করুন।" : "Tap any premier spot pill to instantly switch view."}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--surface)]/80 border border-[var(--glass-border)]">
                  <strong className="text-foreground block mb-0.5 font-bold">
                    {isBn ? "৩. বিভাগ বেছে নিন" : "3. Filter by division"}
                  </strong>
                  <span>{isBn ? "উপরের ৮টি বিভাগের যেকোনোটিতে ক্লিক করে সংশ্লিষ্ট জেলার আবহাওয়া দেখুন।" : "Explore Bangladesh's 8 divisions in the matrix below."}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. CINEMATIC FULL-BLEED WEATHER THEATRE (Inspired by Image-2 Göteborg & Image-5 Cancun) */}
        <div
          ref={heroRef}
          className="relative rounded-3xl overflow-hidden shadow-2xl border border-[var(--glass-border)] min-h-[480px] lg:min-h-[520px] flex flex-col justify-between mb-8 group"
        >
          {/* Full-Bleed Scenic Background Photo */}
          <Image
            src={selectedHub.image}
            alt={
              isBn
                ? `${selectedHub.name_bn || selectedHub.name} লাইভ আবহাওয়া থিয়েটার`
                : `${selectedHub.name} Live Weather Theatre`
            }
            fill
            sizes="100vw"
            priority
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Vignette Gradients for Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/60 pointer-events-none" />

          {/* Top Bar Overlay (Image-2 Göteborg Style: Time, Date & Active Location) */}
          <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-white">
            <div>
              <div className="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-md">
                {currentTime || "12:00 PM"}
              </div>
              <p className="text-xs sm:text-sm text-white/80 font-medium mt-0.5 drop-shadow">
                {currentDateStr}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wider border border-white/25 shadow-sm mb-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#f4a340]" />
                <span>{selectedHub.division} বিভাগ</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight drop-shadow-lg">
                {isBn ? selectedHub.name_bn : selectedHub.name}
              </h2>
              <span className="text-xs text-white/80 block drop-shadow">
                {selectedHub.district}, বাংলাদেশ
              </span>
            </div>
          </div>

          {/* Middle Ambient Badge: Condition & Travel Guide Button */}
          <div className="relative z-10 px-6 sm:px-8 py-2 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/20 text-white shadow-lg">
              <ConditionIcon className={`w-6 h-6 ${condition?.color} animate-pulse`} />
              <div>
                <span className="text-xs font-bold block leading-tight">{condition?.label}</span>
                <span className="text-[10px] text-white/70">{isBn ? "লাইভ স্যাটেলাইট টেলিমিতি" : "Live satellite feed"}</span>
              </div>
            </div>

            <Link
              href={`/destinations/${selectedHub.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 hover:bg-white text-black font-bold text-xs transition-all shadow-lg hover:scale-105"
            >
              <span>{isBn ? "ভ্রমণ গাইড" : "Travel Guide"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Bottom Docked Frosted Glass Weather Bar (Image-2 & Image-5 Cancun Style) */}
          <div className="relative z-10 bg-black/75 backdrop-blur-2xl border-t border-white/20 p-5 sm:p-6 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              {/* Today's Giant Temperature (Image-2 Style) */}
              <div className="lg:col-span-4 flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15">
                  <ConditionIcon className={`w-12 h-12 ${condition?.color}`} />
                </div>
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#f4a340] block">
                    {isBn ? "আজকের তাপমাত্রা" : "CURRENT WEATHER"}
                  </span>
                  <div className="text-4xl sm:text-5xl font-black tracking-tight flex items-start">
                    <span>{current ? Math.round(current.temperature_2m) : "--"}</span>
                    <span className="text-2xl font-bold text-[#f4a340] ml-0.5">°C</span>
                  </div>
                  <div className="text-xs text-white/80 font-medium flex items-center gap-2 mt-0.5">
                    <span>
                      {isBn ? "অনুভূত" : "Feels"}: {current ? Math.round(current.apparent_temperature) : "--"}°C
                    </span>
                    {todayHigh !== null && todayLow !== null && (
                      <span className="border-l border-white/20 pl-2 text-white/90">
                        H: {todayHigh}° L: {todayLow}°
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Horizontal 6-Day Dock Forecast (Image-2 Göteborg & Image-5 Style) */}
              <div className="lg:col-span-8 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
                <div className="flex items-center gap-2.5 min-w-max">
                  {dailyForecast.slice(1, 7).map((d, idx) => {
                    const dateObj = new Date(d.date);
                    const dayLabel = isBn
                      ? dateObj.toLocaleDateString("bn-BD", { weekday: "short" })
                      : dateObj.toLocaleDateString("en-US", { weekday: "short" });
                    const dCond = getWeatherCondition(d.code, isBn);
                    const DIcon = dCond.icon;

                    return (
                      <div
                        key={d.date}
                        className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-center transition-all min-w-[76px]"
                      >
                        <span className="text-[11px] font-bold text-white/80 block uppercase mb-1">
                          {dayLabel}
                        </span>
                        <DIcon className={`w-5 h-5 mx-auto mb-1 ${dCond.color}`} />
                        <span className="text-xs font-black text-white block">{d.max}°</span>
                        <span className="text-[10px] text-white/60 block">{d.min}°</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. THREE LUXURY TELEMETRY WIDGETS (Skypher Image-3 Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {/* Widget 1: Wind Compass & Celestial Sun Arc */}
          <div className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-emerald-500" />
                <span>{isBn ? "বাতাস ও সূর্যোদয়" : "Wind & Sun Trajectory"}</span>
              </span>
              <span className="text-xs font-black text-foreground">
                {current?.wind_speed_10m} km/h
              </span>
            </div>

            {/* Sun Arc SVG Mini */}
            <div className="py-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--text-muted)] mb-1">
                <span className="flex items-center gap-1 text-amber-500">
                  <Sunrise className="w-3.5 h-3.5" />
                  <span>{sunriseTime}</span>
                </span>
                <span className="text-[10px] text-foreground font-bold">
                  {isBn ? `দিবালোক: ${sunProgress}%` : `Daylight: ${sunProgress}%`}
                </span>
                <span className="flex items-center gap-1 text-orange-500">
                  <Sunset className="w-3.5 h-3.5" />
                  <span>{sunsetTime}</span>
                </span>
              </div>
              <svg viewBox="0 0 240 40" className="w-full h-8 stroke-current text-[var(--glass-border)]">
                <path d="M 15 35 Q 120 5 225 35" fill="none" strokeWidth="2" strokeDasharray="3 3" />
                <path
                  d="M 15 35 Q 120 5 225 35"
                  fill="none"
                  stroke="#f4a340"
                  strokeWidth="2.5"
                  strokeDasharray="210"
                  strokeDashoffset={210 - (210 * sunProgress) / 100}
                />
              </svg>
            </div>

            <p className="text-xs text-[var(--text-muted)] mt-1">
              {isBn ? "দিক:" : "Direction:"}{" "}
              <strong className="text-foreground">
                {current ? getWindDirectionText(current.wind_direction_10m, isBn) : "--"}
              </strong>
            </p>
          </div>

          {/* Widget 2: 24-Hour Horizon Snippet (AirEast Image-4 Style) */}
          <div className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#0f4a38] dark:text-[#2ecc71]" />
                <span>{isBn ? "পরবর্তী ২৪ ঘণ্টার টাইমলাইন" : "24-Hour Hourly Timeline"}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
              {next24Hours.slice(0, 8).map((h, idx) => {
                const dateObj = new Date(h.time);
                const timeLabel = idx === 0
                  ? (isBn ? "এখন" : "Now")
                  : dateObj.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
                const hCond = getWeatherCondition(h.code, isBn);
                const HIcon = hCond.icon;

                return (
                  <div
                    key={`${h.time}-${idx}`}
                    className="p-2 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-center min-w-[58px]"
                  >
                    <span className="text-[10px] text-[var(--text-muted)] block mb-0.5">{timeLabel}</span>
                    <HIcon className={`w-4 h-4 mx-auto mb-0.5 ${hCond.color}`} />
                    <span className="text-xs font-bold text-foreground block">{h.temp}°</span>
                  </div>
                );
              })}
            </div>

            <span className="text-[11px] text-[var(--text-muted)] block mt-2">
              {isBn ? "আর্দ্রতা:" : "Humidity:"} <strong className="text-foreground">{current?.relative_humidity_2m}%</strong> •{" "}
              {isBn ? "বৃষ্টিপাত:" : "Rain:"} <strong className="text-foreground">{current?.precipitation} mm</strong>
            </span>
          </div>

          {/* Widget 3: Travel Advisory & Comfort Score (Image-1 & Image-3 Style) */}
          <div className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#f4a340]" />
                <span>{isBn ? "ঘুরাঘুরি ভ্রমণ প্রস্তুতি" : "Travel Feasibility"}</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                UV: {maxUV.toFixed(1)}
              </span>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-1 flex-1">
              {current?.precipitation && current.precipitation > 0
                ? isBn
                  ? "বৃষ্টিপাতের সম্ভাবনা রয়েছে। সাথে রেইনকোট বা ছাতা রাখুন। পাহাড়ি ও ঝর্ণা এলাকার পরিবেশ থাকবে স্নিগ্ধ।"
                  : "Showers expected. Carry compact rainwear and water-resistant footwear."
                : isBn
                ? "ভ্রমণ ও আউটডোর সাইটসিয়িংয়ের জন্য অত্যন্ত চমৎকার আবহাওয়া। ছবি তোলা ও ট্র্যাকিংয়ের দারুণ সুযোগ।"
                : "Optimal conditions. Ideal for hiking, photography, and exploring attractions."}
            </p>

            <div className="mt-3 pt-2.5 border-t border-[var(--glass-border)] flex items-center justify-between text-xs font-semibold">
              <span className="text-foreground">{selectedHub.name}</span>
              <Link href={`/hotels?district=${encodeURIComponent(selectedHub.district)}`} className="text-[#0f4a38] dark:text-[#2ecc71] hover:underline font-bold">
                {isBn ? "হোটেল বুকিং →" : "Area Hotels →"}
              </Link>
            </div>
          </div>
        </div>

        {/* 3. POPULAR DESTINATIONS 1-CLICK CAROUSEL (Image-3 Skypher & Image-4 AirEast Style) */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#f4a340]" />
                <span>{isBn ? "জনপ্রিয় পর্যটন কেন্দ্রসমূহের লাইভ আবহাওয়া" : "Popular Destinations Weather"}</span>
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                {isBn ? "যেকোনো ছবিতে ক্লিক করে সরাসরি সেই স্থানের আবহাওয়া ও ব্যাকগ্রাউন্ড দেখুন" : "Click any card to instantly update the background & telemetry above"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {ICONIC_HUBS.map((hub) => {
              const isSelected = selectedHub.slug === hub.slug;
              const liveTemp = allTemps[hub.name] || (isSelected && current ? Math.round(current.temperature_2m) : null);

              return (
                <div
                  key={hub.slug}
                  onClick={() => handleSelectSpot(hub)}
                  className={`group relative h-36 rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 shadow-md ${
                    isSelected
                      ? "ring-2 ring-[#f4a340] border-[#f4a340] scale-[1.03] shadow-xl"
                      : "border-[var(--glass-border)] hover:border-[#0f4a38]/50 hover:-translate-y-1"
                  }`}
                >
                  <Image
                    src={hub.image}
                    alt={
                      isBn
                        ? `${hub.name_bn || hub.name}, ${hub.district}`
                        : `${hub.name} in ${hub.district}`
                    }
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Temperature Pill */}
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-black border border-white/20">
                      {liveTemp ? `${Math.round(liveTemp)}°C` : "--"}
                    </span>
                  </div>

                  {/* Destination Info */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                    <span className="text-[10px] font-bold text-[#f4a340] uppercase tracking-wider block">
                      {hub.district}
                    </span>
                    <h4 className="text-xs sm:text-sm font-extrabold leading-tight truncate">
                      {isBn ? hub.name_bn : hub.name}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. BANGLADESH REGIONAL WEATHER MATRIX (Image-5 Style Regional Summary) */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-foreground">
                {isBn ? "বিভাগভিত্তিক সকল জেলার আবহাওয়া" : "Weather Across Bangladesh Divisions"}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {isBn
                  ? `নিচের তালিকা থেকে যেকোনো জেলা বেছে নিন এবং সরাসরি লাইভ স্যাটেলাইট ডাটা দেখুন`
                  : `Browse live temperature & weather reports across all 8 divisions`}
              </p>
            </div>

            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)] text-[#0f4a38] dark:text-[#2ecc71] self-start sm:self-auto">
              {filteredSpots.length} {isBn ? "টি স্টেশন অন্তর্ভুক্ত" : "Stations Active"}
            </span>
          </div>

          {/* ELEGANT CLICKABLE WEATHER MATRIX CARDS (No Clumsy "Inspect" Buttons) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {filteredSpots.slice(0, visibleCount).map((spot, idx) => {
              const isSelected = selectedHub.name === spot.name;
              const tempVal = allTemps[spot.name];

              return (
                <div
                  key={`${spot.slug}-${idx}`}
                  onClick={() => handleSelectSpot(spot)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer group flex items-center justify-between gap-3 ${
                    isSelected
                      ? "border-[#f4a340] bg-[#f4a340]/10 shadow-lg ring-1 ring-[#f4a340]"
                      : "border-[var(--glass-border)] bg-[var(--surface)] hover:bg-[var(--surface-raised)] hover:border-[#0f4a38]/40 shadow-sm hover:-translate-y-0.5"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-gray-200 dark:bg-gray-800">
                      <Image
                        src={spot.image}
                        alt=""
                        aria-hidden="true"
                        fill
                        sizes="48px"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-foreground truncate group-hover:text-[#0f4a38] dark:group-hover:text-[#2ecc71] transition-colors">
                        {isBn ? spot.name_bn : spot.name}
                      </h4>
                      <p className="text-xs text-[var(--text-muted)] truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#f4a340] shrink-0" />
                        <span>{spot.district}, {spot.division}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-black text-foreground block">
                      {tempVal ? `${Math.round(tempVal)}°C` : "--"}
                    </span>
                    <span className="text-[10px] font-bold text-[#f4a340] group-hover:underline block">
                      {isSelected ? (isBn ? "সক্রিয়" : "Active") : isBn ? "দেখুন →" : "View →"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progressive Station Explorer with Luxury Progress Gauge */}
          {visibleCount < filteredSpots.length ? (
            <div className="mt-12 max-w-md mx-auto text-center flex flex-col items-center gap-3.5">
              <div className="w-full flex items-center justify-between text-xs font-bold text-[var(--text-muted)] px-1">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    {isBn
                      ? `${Math.min(visibleCount, filteredSpots.length)} / ${filteredSpots.length} টি স্টেশন দেখাচ্ছে`
                      : `Showing ${Math.min(visibleCount, filteredSpots.length)} of ${filteredSpots.length} weather stations`}
                  </span>
                </span>
                <span className="text-[#0f4a38] dark:text-emerald-400 font-extrabold text-xs">
                  {Math.round((Math.min(visibleCount, filteredSpots.length) / filteredSpots.length) * 100)}%
                </span>
              </div>

              <div className="w-full h-1.5 bg-[var(--surface-raised)] border border-[var(--glass-border)] rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 to-[#156b50] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(100, (Math.min(visibleCount, filteredSpots.length) / filteredSpots.length) * 100)}%` }}
                />
              </div>

              <button
                type="button"
                onClick={() => setVisibleCount((prev) => Math.min(prev + 24, filteredSpots.length))}
                className="mt-1 group px-8 py-3 rounded-2xl bg-gradient-to-r from-[#0f4a38] to-[#156b50] hover:from-[#156b50] hover:to-[#1b8061] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2.5 w-full sm:w-auto"
              >
                <CloudSun className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform duration-300" />
                <span>
                  {isBn
                    ? `আরও ২৪টি স্টেশন দেখুন (বাকি ${filteredSpots.length - Math.min(visibleCount, filteredSpots.length)}টি)`
                    : `Explore More Weather Stations (${filteredSpots.length - Math.min(visibleCount, filteredSpots.length)} remaining)`}
                </span>
                <ChevronDown className="w-4 h-4 opacity-75 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          ) : filteredSpots.length > 24 ? (
            <div className="mt-10 text-center py-4">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--surface)] border border-[var(--glass-border)] text-xs font-bold text-[var(--text-muted)] shadow-sm">
                <Sparkles className="w-4 h-4 text-[#f4a340]" />
                <span>
                  {isBn
                    ? `সকল ${filteredSpots.length}টি আবহাওয়া স্টেশন প্রদর্শিত হয়েছে`
                    : `All ${filteredSpots.length} weather stations displayed`}
                </span>
              </div>
              <div className="mt-2.5">
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
        </div>
      </div>
    </div>
  );
}

export default function WeatherPage() {
  return <WeatherContent />;
}
