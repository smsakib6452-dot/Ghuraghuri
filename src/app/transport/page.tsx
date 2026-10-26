"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import {
  Bus,
  Train,
  Plane,
  Navigation,
  Compass,
  PhoneCall,
  ShieldAlert,
  Calculator,
  Ticket,
  MapPin,
  Clock,
  ArrowRight,
  ExternalLink,
  Info,
  CheckCircle2,
  Users,
  Calendar,
  Wallet,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  BANGLADESH_HUBS,
  getLiveHighwayRoute,
  HighwayRouteResult,
  LOCAL_FARES,
  LocalFareItem,
  calculateTripBudget,
  BudgetBreakdown,
  EMERGENCY_CONTACTS,
  generateSosWhatsAppUrl,
} from "@/lib/free-api-service";
import { getTransportTranslation } from "@/lib/i18n";

type TransportTab = "intercity" | "router" | "local" | "budget" | "police";

export default function TransportPage() {
  const { language } = useApp();
  const isBn = language === "bn";

  // Active Tab state
  const [activeTab, setActiveTab] = useState<TransportTab>("intercity");

  // Sync tab with window.location.hash on mount and hashchange
  useEffect(() => {
    const handleHash = () => {
      if (typeof window === "undefined") return;
      const raw = window.location.hash.replace(/^#/, "").trim().toLowerCase();
      const validTabs: TransportTab[] = ["intercity", "router", "local", "budget", "police"];
      if (validTabs.includes(raw as TransportTab)) {
        setActiveTab(raw as TransportTab);
        requestAnimationFrame(() => {
          setTimeout(() => {
            const el = document.getElementById(raw);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 50);
        });
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // -------------------------------------------------------------
  // 1. OSRM LIVE HIGHWAY ROUTER STATE
  // -------------------------------------------------------------
  const [originKey, setOriginKey] = useState<string>("dhaka");
  const [destKey, setDestKey] = useState<string>("coxsbazar");
  const [isRouting, setIsRouting] = useState<boolean>(false);
  const [routeResult, setRouteResult] = useState<HighwayRouteResult | null>(null);

  const calculateRoute = async (oKey = originKey, dKey = destKey) => {
    setIsRouting(true);
    const originHub = BANGLADESH_HUBS[oKey];
    const destHub = BANGLADESH_HUBS[dKey];

    if (!originHub || !destHub) {
      setIsRouting(false);
      return;
    }

    try {
      const res = await getLiveHighwayRoute(
        { lat: originHub.lat, lng: originHub.lng, name: originHub.name_bn },
        { lat: destHub.lat, lng: destHub.lng, name: destHub.name_bn }
      );
      setRouteResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRouting(false);
    }
  };

  useEffect(() => {
    calculateRoute("dhaka", "coxsbazar");
  }, []);

  // -------------------------------------------------------------
  // 2. VERIFIED FAIR FARES STATE
  // -------------------------------------------------------------
  const [activeFareCat, setActiveFareCat] = useState<string>("all");
  const filteredFares =
    activeFareCat === "all"
      ? LOCAL_FARES
      : LOCAL_FARES.filter((f) => f.category === activeFareCat);

  // -------------------------------------------------------------
  // 3. SMART BUDGET CALCULATOR STATE
  // -------------------------------------------------------------
  const [budgetDest, setBudgetDest] = useState<string>("Cox's Bazar");
  const [budgetDays, setBudgetDays] = useState<number>(3);
  const [budgetPersons, setBudgetPersons] = useState<number>(2);
  const [budgetStyle, setBudgetStyle] = useState<"budget" | "standard" | "luxury">("standard");

  const budget: BudgetBreakdown = calculateTripBudget(
    budgetDest,
    budgetDays,
    budgetPersons,
    budgetStyle
  );

  // -------------------------------------------------------------
  // 4. TOURIST POLICE & SOS STATE
  // -------------------------------------------------------------
  const [sosStatus, setSosStatus] = useState<string>("" );

  const triggerSosWhatsApp = () => {
    setSosStatus(isBn ? "জিপিএস লোকেশন নেওয়া হচ্ছে..." : "Fetching GPS coordinates...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const url = generateSosWhatsAppUrl(
            budgetDest || "Bangladesh Travel Route",
            pos.coords.latitude,
            pos.coords.longitude
          );
          setSosStatus("");
          window.open(url, "_blank");
        },
        () => {
          const originHub = BANGLADESH_HUBS[originKey];
          const url = generateSosWhatsAppUrl(
            originHub ? originHub.name_bn : "Bangladesh Highway",
            originHub?.lat,
            originHub?.lng
          );
          setSosStatus("");
          window.open(url, "_blank");
        },
        { timeout: 5000 }
      );
    } else {
      const url = generateSosWhatsAppUrl("Bangladesh Highway");
      setSosStatus("");
      window.open(url, "_blank");
    }
  };

  // -------------------------------------------------------------
  // 5. STANDARD MAJOR ROUTES GUIDE
  // -------------------------------------------------------------
  const routes = [
    {
      from: "Dhaka",
      from_bn: "ঢাকা",
      to: "Cox's Bazar",
      to_bn: "কক্সবাজার",
      distance: "395 km",
      busDuration: "8 – 10 hrs",
      busFare: "৳১,০০০ – ২,৫০০",
      trainDuration: "8 hrs (Cox's Bazar Express & Parjotok Express)",
      trainFare: "৳৬৯৫ – ২,১৫০",
      airDuration: "55 mins (Biman, US-Bangla, Air Astra)",
      airFare: "৳৪,০০০ – ৭,৫০০",
      highlight: isBn ? "কক্সবাজার এক্সপ্রেস ট্রেন ও সরাসরি ফ্লাইট" : "Direct express train & daily flights",
    },
    {
      from: "Dhaka",
      from_bn: "ঢাকা",
      to: "Sajek Valley",
      to_bn: "সাজেক ভ্যালি",
      distance: "340 km",
      busDuration: "7 – 8 hrs to Khagrachhari + 2 hrs 4x4 Chander Gari",
      busFare: "৳৮০০ – ১,৬০০ (Bus) + ৳৮,০০০ (Chander Gari reserve)",
      trainDuration: "Dhaka to Feni train, then bus to Khagrachhari",
      trainFare: "৳৩৫০ – ৭০০",
      airDuration: "Fly to Chattogram (45 mins) then scenic highway transfer",
      airFare: "৳৩,৫০০ – ৫,৫০০",
      highlight: isBn ? "খাগড়াছড়ি হয়ে ৪x৪ চাঁন্দের গাড়ি কনভয় যাত্রা" : "Via Khagrachhari military convoy escort",
    },
    {
      from: "Dhaka",
      from_bn: "ঢাকা",
      to: "Sreemangal & Sylhet",
      to_bn: "শ্রীমঙ্গল ও সিলেট",
      distance: "240 km",
      busDuration: "4 – 5 hrs (Sreemangal), 6 hrs (Sylhet)",
      busFare: "৳৫০০ – ১,২০০",
      trainDuration: "4 – 5 hrs (Parabat, Upaban, Jayantika Express)",
      trainFare: "৳২৪০ – ১,১০০",
      airDuration: "45 mins to Osmani International Airport Sylhet",
      airFare: "৳৩,৮০০ – ৫,৫০০",
      highlight: isBn ? "ঢাকা–সিলেট রেলপথ ও চা বাগানের দৃশ্য" : "Scenic train journey through tea hills",
    },
    {
      from: "Dhaka",
      from_bn: "ঢাকা",
      to: "Bandarban",
      to_bn: "বান্দরবান",
      distance: "320 km",
      busDuration: "8 – 9 hrs (Direct Non-AC / AC Sleeper)",
      busFare: "৳৯০০ – ১,৮০০",
      trainDuration: "Dhaka to Chattogram train (Subarna/Sonar Bangla), then local bus (2.5 hrs)",
      trainFare: "৳৪০০ – ১,১০০",
      airDuration: "Fly to Chattogram (45 mins) + road transfer",
      airFare: "৳৩,৫০০ – ৬,০০০",
      highlight: isBn ? "সরাসরি স্লিপার বাস ও চান্দের গাড়ি" : "Direct sleeper buses via Chattogram highway",
    },
    {
      from: "Dhaka",
      from_bn: "ঢাকা",
      to: "Sundarbans (Khulna / Mongla)",
      to_bn: "সুন্দরবন (খুলনা / মোংলা)",
      distance: "260 km",
      busDuration: "4 – 5 hrs (via Padma Bridge expressway)",
      busFare: "৳৬৫০ – ১,৪০০",
      trainDuration: "3.5 hrs via Padma Bridge rail link (Sundarban Express)",
      trainFare: "৳৪৫০ – ১,৩০০",
      airDuration: "Fly to Jashore (40 mins) + 1.5 hr drive to Khulna",
      airFare: "৳৩,৫০০ – ৫,২০০",
      highlight: isBn ? "পদ্মা সেতু এক্সপ্রেসওয়ে ও লঞ্চ ক্রুজ" : "Rapid connectivity via Padma Bridge",
    },
    {
      from: "Dhaka",
      from_bn: "ঢাকা",
      to: "Kuakata",
      to_bn: "কুয়াকাটা",
      distance: "285 km",
      busDuration: "5 – 6 hrs via Padma Bridge & Payra Bridge",
      busFare: "৳৭৫০ – ১,৬০০",
      trainDuration: "Dhaka to Bhanga/Barishal corridor, then express bus",
      trainFare: "৳৩০০ – ৮৫০",
      airDuration: "Fly to Barishal (35 mins) + 2.5 hr drive",
      airFare: "৳৩,২০০ – ৪,৮০০",
      highlight: isBn ? "পায়রা সেতু ও সূর্যোদয়-সূর্যাস্ত বিচ" : "Direct smooth highway via Payra Bridge",
    },
  ];

  const busOperators = [
    {
      name: "Green Line Paribahan",
      name_bn: "গ্রিন লাইন পরিবহন",
      type: "Scania Multi-Axle & Double Decker Luxury",
      type_bn: "স্ক্যানিয়া মাল্টি-অ্যাক্সেল ও ডাবল ডেকার লাক্সারি",
      phone: "01730-060000",
      helpline: "09613-445566",
      hub: "Rajarbagh / Arambagh / Kalabagan",
      hub_bn: "রাজারবাগ / আরামবাগ / কলাবাগান",
    },
    {
      name: "Hanif Enterprise",
      name_bn: "হানিফ এন্টারপ্রাইজ",
      type: "Volvo 9600 & Non-AC Countrywide Network",
      type_bn: "ভলভো ৯৬০০ ও নন-এসি দেশব্যাপী নেটওয়ার্ক",
      phone: "01713-049500",
      helpline: "01713-402671",
      hub: "Gabtoli / Sayedabad / Panthapath",
      hub_bn: "গাবতলী / সায়েদাবাদ / পান্থপথ",
    },
    {
      name: "Shyamoli Paribahan NR",
      name_bn: "শ্যামলী পরিবহন (এনআর)",
      type: "Mercedes-Benz & Hyundai AC Suites",
      type_bn: "মার্সিডিজ-বেঞ্জ ও হুন্দাই এসি স্যুট",
      phone: "01711-440856",
      helpline: "01711-440857",
      hub: "Arambagh / Sayedabad / Fakirapool",
      hub_bn: "আরামবাগ / সায়েদাবাদ / ফকিরাপুল",
    },
    {
      name: "Ena Transport",
      name_bn: "এনা ট্রান্সপোর্ট",
      type: "Sylhet-Chittagong High Frequency Service",
      type_bn: "সিলেট-চট্টগ্রাম হাই ফ্রিকোয়েন্সি সার্ভিস",
      phone: "01760-737600",
      helpline: "01760-737600",
      hub: "Mohakhali / Uttara / Kadamtoli",
      hub_bn: "মহাখালী / উত্তরা / কদমতলী (সিলেট)",
    },
    {
      name: "Saintmartin Paribahan",
      name_bn: "সেন্টমার্টিন পরিবহন",
      type: "Direct Hill Express & Sleeper Coach",
      type_bn: "সরাসরি হিল এক্সপ্রেস ও স্লিপার কোচ",
      phone: "01711-300444",
      helpline: "01762-692723",
      hub: "Arambagh / Sayedabad / Khagrachhari",
      hub_bn: "আরামবাগ / সায়েদাবাদ / খাগড়াছড়ি (সাজেক)",
    },
    {
      name: "Desh Travels",
      name_bn: "দেশ ট্রাভেলস",
      type: "Hyundai Luxury AC Coach",
      type_bn: "হুন্দাই লাক্সারি এসি কোচ",
      phone: "01762-684400",
      helpline: "01762-684401",
      hub: "Arambagh / Sayedabad / Rajshahi",
      hub_bn: "আরামবাগ / সায়েদাবাদ / রাজশাহী",
    },
    {
      name: "National Travels",
      name_bn: "ন্যাশনাল ট্রাভেলস",
      type: "Scania Multi-Axle (North Bengal)",
      type_bn: "স্ক্যানিয়া মাল্টি-অ্যাক্সেল (উত্তরবঙ্গ)",
      phone: "01711-418854",
      helpline: "01713-333333",
      hub: "Gabtoli / Kalyanpur / Shiroil",
      hub_bn: "গাবতলী / কল্যাণপুর / শিরোইল (রাজশাহী)",
    },
    {
      name: "Sakura Paribahan",
      name_bn: "সাকুরা পরিবহন",
      type: "Padma Bridge South Express",
      type_bn: "পদ্মা সেতু দক্ষিণ এক্সপ্রেস",
      phone: "01711-010450",
      helpline: "01729-555555",
      hub: "Sayedabad / Gabtoli / Nathullabad",
      hub_bn: "সায়েদাবাদ / গাবতলী / নথুল্লাবাদ (বরিশাল)",
    },
  ];

  return (
    <div className="py-12 bg-[var(--background)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* =========================================================
            HEADER & HERO
            ========================================================= */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] text-xs font-bold mb-3">
            <Bus className="w-3.5 h-3.5" />
            <span>{isBn ? "ভেরিফাইড পরিবহন ও রুট নির্দেশিকা" : "Verified Transport & Transit Portal"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
            {isBn ? "যাতায়াত ব্যবস্থা, লাইভ রুট ও লোকাল ভাড়া" : "Highway Routing & Fair Fare Portal"}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] mt-3 leading-relaxed">
            {isBn
              ? "আন্তঃজেলা বাস-ট্রেন টিকেট, ওএসআরএম লাইভ হাইওয়ে রুট ফাইন্ডার, চাঁন্দের গাড়ি ও ট্রলারের সরকারি ভেরিফাইড ভাড়া এবং ২৪/৭ ট্যুরিস্ট পুলিশ জরুরি হটলাইন।"
              : "Intercity express routes, live road distance calculator, government-notified jeep & boat fares, and 24/7 Tourist Police safety helpline."}
          </p>
        </div>

        {/* =========================================================
            WORLD-CLASS SEGMENTED TABS NAVIGATION
            ========================================================= */}
        <div className="sticky top-16 z-30 py-3 bg-[var(--background)]/80 backdrop-blur-md border-y border-[var(--glass-border)]">
          <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto scrollbar-none touch-pan-x px-2">
            
            <button
              onClick={() => setActiveTab("intercity")}
              className={`min-h-[44px] px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 shrink-0 ${
                activeTab === "intercity"
                  ? "bg-[#0f4a38] text-white shadow-lg shadow-[#0f4a38]/25 dark:bg-[#1f9d76]"
                  : "bg-[var(--surface)] text-foreground border border-[var(--glass-border)] hover:border-[#0f4a38]"
              }`}
            >
              <Bus className="w-4 h-4" />
              <span>{isBn ? "আন্তঃজেলা রুট ও টিকেট হাব" : "Intercity Routes & Tickets"}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            </button>

            <button
              onClick={() => setActiveTab("router")}
              className={`min-h-[44px] px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 shrink-0 ${
                activeTab === "router"
                  ? "bg-[#0f4a38] text-white shadow-lg shadow-[#0f4a38]/25 dark:bg-[#1f9d76]"
                  : "bg-[var(--surface)] text-foreground border border-[var(--glass-border)] hover:border-[#0f4a38]"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>{isBn ? "লাইভ হাইওয়ে রাউটার" : "Live Highway Router"}</span>
            </button>

            <button
              onClick={() => setActiveTab("local")}
              className={`min-h-[44px] px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 shrink-0 ${
                activeTab === "local"
                  ? "bg-[#0f4a38] text-white shadow-lg shadow-[#0f4a38]/25 dark:bg-[#1f9d76]"
                  : "bg-[var(--surface)] text-foreground border border-[var(--glass-border)] hover:border-[#0f4a38]"
              }`}
            >
              <Navigation className="w-4 h-4" />
              <span>{isBn ? "চাঁন্দের গাড়ি ও লোকাল ভাড়া" : "Fair Local Fares"}</span>
            </button>

            <button
              onClick={() => setActiveTab("budget")}
              className={`min-h-[44px] px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 shrink-0 ${
                activeTab === "budget"
                  ? "bg-[#0f4a38] text-white shadow-lg shadow-[#0f4a38]/25 dark:bg-[#1f9d76]"
                  : "bg-[var(--surface)] text-foreground border border-[var(--glass-border)] hover:border-[#0f4a38]"
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>{isBn ? "বাজেট ক্যালকুলেটর" : "Budget Calculator"}</span>
            </button>

            <button
              onClick={() => setActiveTab("police")}
              className={`min-h-[44px] px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 shrink-0 ${
                activeTab === "police"
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/25"
                  : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20"
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{isBn ? "ট্যুরিস্ট পুলিশ SOS" : "Tourist Police SOS"}</span>
            </button>

          </div>
        </div>

        {/* =========================================================
            TAB 1: INTERCITY ROUTES & OFFICIAL TICKET HUB
            ========================================================= */}
        {activeTab === "intercity" && (
          <div id="intercity" className="space-y-12 animate-fadeIn">
            
            {/* Direct Official Online Portals */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href="https://eticket.railway.gov.bd"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-[var(--surface)] border border-emerald-500/30 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Train className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-foreground group-hover:text-emerald-600 transition-colors">
                      {isBn ? "বাংলাদেশ রেলওয়ে ই-টিকেট" : "Bangladesh Railway E-Ticket"}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {isBn ? "অফিসিয়াল সরকারি ট্রেন টিকেট পোর্টাল" : "Official Online Train Booking"}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[var(--text-muted)] group-hover:text-emerald-600 transition-colors shrink-0" />
              </a>

              <a
                href="https://www.shohoz.com/bus-tickets"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-[var(--surface)] border border-sky-500/30 hover:border-sky-500 shadow-sm hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                    <Bus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-foreground group-hover:text-sky-600 transition-colors">
                      {isBn ? "সহজ ডট কম বাস টিকেট" : "Shohoz Bus Tickets"}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {isBn ? "দেশব্যাপী এসি/নন-এসি বাস সিট বুকিং" : "All Bangladesh Intercity Coach Seats"}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[var(--text-muted)] group-hover:text-sky-600 transition-colors shrink-0" />
              </a>

              <a
                href="https://www.biman-airlines.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-[var(--surface)] border border-amber-500/30 hover:border-amber-500 shadow-sm hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Plane className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-foreground group-hover:text-amber-600 transition-colors">
                      {isBn ? "বিমান বাংলাদেশ ও অভ্যন্তরীণ ফ্লাইট" : "Domestic Air Tickets"}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {isBn ? "কক্সবাজার, সিলেট, যশোর ও চট্টগ্রাম" : "Cox's Bazar, Sylhet, Jashore & Ctg"}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[var(--text-muted)] group-hover:text-amber-600 transition-colors shrink-0" />
              </a>
            </div>

            {/* Major Intercity Routes */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground">
                    {isBn ? "ঢাকা থেকে প্রধান পর্যটন রুট ও সময়সূচী" : "Major Intercity Routes From Capital"}
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
                    {isBn
                      ? "দূরত্ব, আনুমানিক ভ্রমণ সময় ও বাস/ট্রেন/ফ্লাইটের সমন্বিত তুলনামূলক তালিকা।"
                      : "Distance, travel time, and comparative fares across Bus, Train, and Flights."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {routes.map((route, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 pb-4 border-b border-[var(--glass-border)]">
                        <div className="flex items-center gap-2 text-base font-black text-foreground">
                          <span>{isBn ? route.from_bn : route.from}</span>
                          <ArrowRight className="w-4 h-4 text-[#0f4a38] dark:text-emerald-400" />
                          <span className="text-[#0f4a38] dark:text-[#2ecc71]">
                            {isBn ? route.to_bn : route.to}
                          </span>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-[var(--surface-raised)] border border-[var(--glass-border)] text-xs font-bold text-[var(--text-muted)]">
                          {getTransportTranslation(route.distance, isBn)}
                        </span>
                      </div>

                      <div className="mt-4 space-y-3 text-xs">
                        <div className="p-3 rounded-2xl bg-[var(--surface-raised)] flex items-start gap-3">
                          <Bus className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-foreground">
                                {isBn ? "বাস সার্ভিস:" : "Intercity Bus:"}
                              </span>
                              <span className="font-extrabold text-[#0f4a38] dark:text-emerald-400">
                                {route.busFare}
                              </span>
                            </div>
                            <span className="text-[var(--text-muted)] block mt-0.5">
                              ⏱️ {getTransportTranslation(route.busDuration, isBn)}
                            </span>
                          </div>
                        </div>

                        <div className="p-3 rounded-2xl bg-[var(--surface-raised)] flex items-start gap-3">
                          <Train className="w-4 h-4 text-sky-600 dark:text-sky-400 mt-0.5 shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-foreground">
                                {isBn ? "রেলওয়ে এক্সপ্রেস:" : "Express Train:"}
                              </span>
                              <span className="font-extrabold text-sky-600 dark:text-sky-400">
                                {route.trainFare}
                              </span>
                            </div>
                            <span className="text-[var(--text-muted)] block mt-0.5">
                              ⏱️ {getTransportTranslation(route.trainDuration, isBn)}
                            </span>
                          </div>
                        </div>

                        {route.airDuration !== "—" && (
                          <div className="p-3 rounded-2xl bg-[var(--surface-raised)] flex items-start gap-3">
                            <Plane className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-foreground">
                                  {isBn ? "অভ্যন্তরীণ বিমান:" : "Domestic Flights:"}
                                </span>
                                <span className="font-extrabold text-amber-600 dark:text-amber-400">
                                  {route.airFare}
                                </span>
                              </div>
                              <span className="text-[var(--text-muted)] block mt-0.5">
                                ⏱️ {getTransportTranslation(route.airDuration, isBn)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-[var(--glass-border)] flex items-center justify-between text-xs">
                      <span className="text-[var(--text-muted)] font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#f4a340]" />
                        <span>{route.highlight}</span>
                      </span>
                      <button
                        onClick={() => {
                          setOriginKey("dhaka");
                          if (route.to.includes("Cox")) setDestKey("coxsbazar");
                          else if (route.to.includes("Sajek")) setDestKey("sajek");
                          else if (route.to.includes("Sylhet")) setDestKey("sylhet");
                          else if (route.to.includes("Bandarban")) setDestKey("bandarban");
                          else if (route.to.includes("Sundarbans")) setDestKey("khulna");
                          setActiveTab("router");
                        }}
                        className="font-bold text-[#0f4a38] dark:text-[#2ecc71] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isBn ? "রাউটারে দেখুন" : "View on Router"}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Bus Counters & Helplines */}
            <div className="p-8 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-md">
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-black text-foreground">
                  {isBn ? "প্রধান আন্তঃজেলা বাস কাউন্টার ও হেল্পলাইন" : "Intercity Bus Operators & Central Helplines"}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                  {isBn
                    ? "সরাসরি বাসের টিকিট বুকিং ও আসন নিশ্চিতে কাউন্টারের ফোন নম্বরে কল করুন।"
                    : "Verified phone numbers for central counters across Dhaka, Chattogram, and tourist destinations."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {busOperators.map((op, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] flex flex-col justify-between hover:border-[#0f4a38] transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="text-sm font-black text-foreground">
                          {isBn ? op.name_bn : op.name}
                        </h4>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shrink-0">
                          {isBn ? "ভেরিফায়েড" : "Verified"}
                        </span>
                      </div>
                      <span className="text-[11px] text-[var(--text-muted)] block font-medium">
                        {isBn ? (op.type_bn || getTransportTranslation(op.type, isBn)) : op.type}
                      </span>
                      <p className="text-[11px] text-[var(--text-muted)] mt-1.5">
                        📍 {isBn ? op.hub_bn : op.hub}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[var(--glass-border)] flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-[var(--text-muted)] block">
                          {isBn ? "সরাসরি ফোন:" : "Direct Phone:"}
                        </span>
                        <span className="text-xs font-bold text-foreground">{op.phone}</span>
                      </div>
                      <a
                        href={`tel:${op.phone.replace(/[^0-9+]/g, "")}`}
                        className="px-3 py-1.5 rounded-xl bg-[#0f4a38] hover:bg-[#156b50] text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>{isBn ? "কল" : "Call"}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================
            TAB 2: OSRM LIVE HIGHWAY ROUTER & DRIVING CALCULATOR
            ========================================================= */}
        {activeTab === "router" && (
          <div id="router" className="p-6 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-md animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[var(--glass-border)]">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38bdf8]/10 text-[#0284c7] dark:text-[#38bdf8] text-xs font-bold mb-2">
                  <Compass className="w-3.5 h-3.5" />
                  <span>OSRM (Open Source Routing Machine) · 100% Free Open API</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                  {isBn ? "লাইভ হাইওয়ে রুট ও ড্রাইভিং সময় নির্ণয়" : "Live Highway Router & Driving Calculator"}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                  {isBn
                    ? "যেকোনো দুটি জেলার মধ্যে বাস্তব হাইওয়ে দূরত্ব, ড্রাইভিং সময় ও সংযোগকারী করিডোর দেখুন।"
                    : "Calculate true road distance, duration, and road corridors across Bangladesh using live OSRM data."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Zero API Key / Open Data</span>
                </span>
              </div>
            </div>

            {/* Selector Form */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end mb-8">
              <div className="sm:col-span-5 space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-muted)]">
                  {isBn ? "যাত্রার শুরু (Origin Hub)" : "Origin Point"}
                </label>
                <select
                  value={originKey}
                  onChange={(e) => setOriginKey(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-[#0f4a38]"
                >
                  {Object.entries(BANGLADESH_HUBS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {isBn ? v.name_bn : v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-5 space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-muted)]">
                  {isBn ? "গন্তব্য (Destination Hub)" : "Destination Point"}
                </label>
                <select
                  value={destKey}
                  onChange={(e) => setDestKey(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-[#0f4a38]"
                >
                  {Object.entries(BANGLADESH_HUBS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {isBn ? v.name_bn : v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={() => calculateRoute(originKey, destKey)}
                  disabled={isRouting}
                  className="w-full py-3 px-4 rounded-2xl bg-[#0f4a38] text-white font-bold text-sm hover:bg-[#156b50] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isRouting ? (
                    <span>{isBn ? "গণনা হচ্ছে..." : "Routing..."}</span>
                  ) : (
                    <>
                      <span>{isBn ? "রুট দেখুন" : "Get Route"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Route Result Display */}
            {routeResult && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-xs font-bold text-[var(--text-muted)] block">
                      {isBn ? "মোট হাইওয়ে দূরত্ব" : "True Road Distance"}
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-1 block">
                      {routeResult.distanceKm} km
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                    <span className="text-xs font-bold text-[var(--text-muted)] block">
                      {isBn ? "আনুমানিক ড্রাইভ সময়" : "Estimated Driving Time"}
                    </span>
                    <span className="text-2xl sm:text-3xl font-black text-amber-700 dark:text-amber-400 mt-1 block">
                      {routeResult.durationHours} hrs ({routeResult.durationMinutes} mins)
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-[var(--text-muted)] block">
                        {isBn ? "লাইভ গুগল ম্যাপে নেভিগেশন" : "Turn-by-Turn Navigation"}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] mt-1 block">
                        Open in Google Maps GPS
                      </span>
                    </div>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
                        BANGLADESH_HUBS[originKey]?.name || ""
                      )}&destination=${encodeURIComponent(
                        BANGLADESH_HUBS[destKey]?.name || ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-sky-700 transition-all"
                    >
                      <span>{isBn ? "গুগল ম্যাপে চালু করুন" : "Open in Google Maps"}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Road Corridor Steps */}
                {routeResult.steps && routeResult.steps.length > 0 && (
                  <div className="p-6 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)]">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                      {isBn ? "সংযোগকারী হাইওয়ে করিডোর ও সেগমেন্ট" : "Major Road Corridors & Highways"}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {routeResult.steps.slice(0, 6).map((step, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)] text-xs flex items-center justify-between"
                        >
                          <span className="font-semibold text-foreground truncate mr-2">
                            🛣️ {step.name || "National Highway Segment"}
                          </span>
                          <span className="font-bold text-[#0f4a38] dark:text-[#2ecc71] shrink-0">
                            {step.distance_km} km
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            TAB 3: FAIR LOCAL FARES (CHANDER GARI & BOATS)
            ========================================================= */}
        {activeTab === "local" && (
          <div id="local" className="p-6 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-md animate-fadeIn space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--glass-border)]">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                  {isBn ? "চাঁন্দের গাড়ি, ট্রলার ও লোকাল বাহনের ভেরিফাইড ভাড়া" : "Verified Fair Local Transport Rates"}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                  {isBn
                    ? "সাজেক, বান্দরবান ও কক্সবাজারের রেজিস্টার্ড চালক সমিতির সরকারি তালিকাভুক্ত ন্যায্য ভাড়া।"
                    : "Government and driver association verified rates to protect travelers from local overcharging."}
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                {[
                  { id: "all", label_en: "All Zones", label_bn: "সকল জোন" },
                  { id: "hill", label_en: "Hill Tracts (Sajek/Bandarban)", label_bn: "পার্বত্য জোন" },
                  { id: "beach", label_en: "Beach & Cox's Bazar", label_bn: "কক্সবাজার সৈকত" },
                  { id: "water", label_en: "Boats & Trawlers", label_bn: "নৌকা ও ট্রলার" },
                  { id: "sylhet", label_en: "Sylhet & Haor", label_bn: "সিলেট ও হাওর" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveFareCat(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                      activeFareCat === cat.id
                        ? "bg-[#0f4a38] text-white dark:bg-[#1f9d76]"
                        : "bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-foreground"
                    }`}
                  >
                    {isBn ? cat.label_bn : cat.label_en}
                  </button>
                ))}
              </div>
            </div>

            {/* Fares Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFares.map((fare, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] hover:border-[#0f4a38] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71]">
                        {fare.vehicle}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] font-semibold">
                        {fare.category.toUpperCase()}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-foreground">
                      {fare.route}
                    </h4>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--glass-border)]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--text-muted)] font-medium">
                        {isBn ? "ভেরিফাইড ভাড়া:" : "Standard Fare:"}
                      </span>
                      <span className="text-base font-black text-[#0f4a38] dark:text-[#2ecc71]">
                        {fare.fare}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] mt-1.5 italic">
                      💡 {fare.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 4: SMART TRIP BUDGET CALCULATOR
            ========================================================= */}
        {activeTab === "budget" && (
          <div id="budget" className="p-6 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-md animate-fadeIn space-y-8">
            <div className="pb-6 border-b border-[var(--glass-border)]">
              <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                {isBn ? "স্মার্ট ভ্রমণ বাজেট ক্যালকুলেটর ও গ্রুপ খরচ" : "Calculate Travel Budget & Group Split"}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                {isBn
                  ? "গন্তব্য, দিন ও ভ্রমণের ধরন নির্বাচন করে মোট খরচ ও মাথাপিছু বাজেট স্বয়ংক্রিয় হিসাব করুন।"
                  : "Automatic estimates for transport, lodging, meals, and local transit across budget, standard, and luxury tiers."}
              </p>
            </div>

            {/* Input Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-muted)] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#f4a340]" />
                  <span>{isBn ? "গন্তব্য" : "Destination"}</span>
                </label>
                <select
                  value={budgetDest}
                  onChange={(e) => setBudgetDest(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-[#0f4a38]"
                >
                  <option value="Cox's Bazar">কক্সবাজার (Cox's Bazar)</option>
                  <option value="Sajek Valley">সাজেক ভ্যালি (Sajek Valley)</option>
                  <option value="Sreemangal">শ্রীমঙ্গল (Sreemangal)</option>
                  <option value="Sylhet">সিলেট (Sylhet)</option>
                  <option value="Bandarban">বান্দরবান (Bandarban)</option>
                  <option value="Kuakata">কুয়াকাটা (Kuakata)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-muted)] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-sky-500" />
                  <span>{isBn ? "ভ্রমণের সময়কাল (দিন)" : "Duration (Days)"}</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={budgetDays}
                  onChange={(e) => setBudgetDays(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-[#0f4a38]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-muted)] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{isBn ? "যাত্রীর সংখ্যা (Persons)" : "Travelers (Persons)"}</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={budgetPersons}
                  onChange={(e) => setBudgetPersons(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-[#0f4a38]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-muted)] flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-purple-500" />
                  <span>{isBn ? "ভ্রমণের ধরন" : "Travel Style"}</span>
                </label>
                <select
                  value={budgetStyle}
                  onChange={(e) => setBudgetStyle(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-[#0f4a38]"
                >
                  <option value="budget">{isBn ? "বাজেট ফ্রেন্ডলি" : "Budget Backpacking"}</option>
                  <option value="standard">{isBn ? "স্ট্যান্ডার্ড কমফোর্ট" : "Standard Comfort"}</option>
                  <option value="luxury">{isBn ? "লাক্সারি ও প্রিমিয়াম" : "Luxury Premium"}</option>
                </select>
              </div>
            </div>

            {/* Budget Results Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface-raised)] border border-[var(--glass-border)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--glass-border)]">
                <div>
                  <span className="text-xs font-bold text-[var(--text-muted)] block">
                    {isBn ? "সর্বমোট আনুমানিক ট্যুর বাজেট" : "Estimated Grand Total"}
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-[#0f4a38] dark:text-[#2ecc71] mt-1 block">
                    ৳{budget.grandTotal.toLocaleString()}
                  </span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs font-bold text-[var(--text-muted)] block">
                    {isBn ? "মাথাপিছু খরচ (Per Person)" : "Per Person Share"}
                  </span>
                  <span className="text-2xl font-black text-foreground mt-1 block">
                    ৳{budget.perPerson.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 text-xs">
                <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)]">
                  <span className="text-[var(--text-muted)] block font-semibold">🚌 {isBn ? "দূরপাল্লার যাতায়াত" : "Transit"}</span>
                  <span className="font-extrabold text-foreground text-sm mt-0.5 block">
                    ৳{budget.breakdown.transport.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)]">
                  <span className="text-[var(--text-muted)] block font-semibold">🏨 {isBn ? "হোটেল/কটেজ" : "Hotel"}</span>
                  <span className="font-extrabold text-foreground text-sm mt-0.5 block">
                    ৳{budget.breakdown.hotel.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)]">
                  <span className="text-[var(--text-muted)] block font-semibold">🍲 {isBn ? "খাবার ও পানি" : "Meals"}</span>
                  <span className="font-extrabold text-foreground text-sm mt-0.5 block">
                    ৳{budget.breakdown.food.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)]">
                  <span className="text-[var(--text-muted)] block font-semibold">🚙 {isBn ? "লোকাল জিপ/সিএনজি" : "Local Transit"}</span>
                  <span className="font-extrabold text-foreground text-sm mt-0.5 block">
                    ৳{budget.breakdown.localTransit.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)] col-span-2 sm:col-span-1">
                  <span className="text-[var(--text-muted)] block font-semibold">🛡️ {isBn ? "জরুরি ব্যাকআপ" : "Emergency Fund"}</span>
                  <span className="font-extrabold text-foreground text-sm mt-0.5 block">
                    ৳{budget.breakdown.miscAndEmergency.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 5: TOURIST POLICE & EMERGENCY SOS
            ========================================================= */}
        {activeTab === "police" && (
          <div id="police" className="p-6 sm:p-10 rounded-3xl bg-[var(--surface)] border border-red-500/20 shadow-lg shadow-red-500/5 animate-fadeIn space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--glass-border)]">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isBn ? "২৪/৭ সরকারি জাতীয় নিরাপত্তা নেটওয়ার্ক" : "National 24/7 Security Network"}</span>
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                  {isBn ? "বাংলাদেশ ট্যুরিস্ট পুলিশ ও জরুরি যোগাযোগ" : "Tourist Police & GPS Emergency SOS"}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                  {isBn
                    ? "যেকোনো ভ্রমণ সংক্রান্ত বিপদে সরাসরি ট্যুরিস্ট পুলিশ বা ৯৯৯ এ কল করুন। অথবা এক ক্লিকে লাইভ জিপিএস লোকেশনসহ WhatsApp SOS পাঠান।"
                    : "National 24/7 Tourist Police command control helplines, regional outposts, and instant one-click GPS WhatsApp SOS."}
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={triggerSosWhatsApp}
                  className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center gap-2.5 shadow-lg shadow-red-600/25 transition-all cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>{isBn ? "🚨 লাইভ GPS WhatsApp SOS পাঠান" : "🚨 Send GPS WhatsApp SOS"}</span>
                </button>
                {sosStatus && <span className="text-xs text-red-500 font-semibold block mt-1.5">{sosStatus}</span>}
              </div>
            </div>

            {/* Central Helplines */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/25 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                    {isBn ? "জাতীয় জরুরি সেবা (টোল ফ্রি)" : "National Emergency (Toll Free)"}
                  </span>
                  <h4 className="text-3xl font-black text-foreground mt-1">999</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {isBn ? "পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্স ২৪/৭" : "Police, Fire & Ambulance 24/7"}
                  </p>
                </div>
                <a
                  href="tel:999"
                  className="mt-5 px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold text-center hover:bg-red-700 transition-all flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{isBn ? "সরাসরি কল (999)" : "Direct Call (999)"}</span>
                </a>
              </div>

              <div className="p-6 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0f4a38] dark:text-[#2ecc71]">
                    {isBn ? "ট্যুরিস্ট পুলিশ সদর দপ্তর" : "Tourist Police HQ"}
                  </span>
                  <h4 className="text-2xl font-black text-foreground mt-1">01320-163599</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {isBn ? "২৪/৭ কেন্দ্রীয় ট্যুরিস্ট কন্ট্রোল রুম" : "Central 24/7 Incident Control Room"}
                  </p>
                </div>
                <a
                  href="tel:01320163599"
                  className="mt-5 px-4 py-2.5 rounded-xl bg-[#0f4a38] text-white text-xs font-bold text-center hover:bg-[#156b50] transition-all flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{isBn ? "কল করুন" : "Direct Call"}</span>
                </a>
              </div>

              <div className="p-6 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                    {isBn ? "ট্যুরিস্ট পুলিশ অপারেশন্স রুম" : "Operations Room"}
                  </span>
                  <h4 className="text-2xl font-black text-foreground mt-1">01320-163598</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    {isBn ? "জরুরি অভিযান ও তাৎক্ষণিক পুলিশ ফোর্স সহায়তা" : "Immediate Incident & Field Response"}
                  </p>
                </div>
                <a
                  href="tel:01320163598"
                  className="mt-5 px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)] text-foreground text-xs font-bold text-center hover:border-[#0f4a38] transition-all flex items-center justify-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>{isBn ? "কল করুন" : "Direct Call"}</span>
                </a>
              </div>
            </div>

            {/* Regional Outposts */}
            <div className="pt-6 border-t border-[var(--glass-border)]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                {isBn ? "আঞ্চলিক ট্যুরিস্ট পুলিশ ক্যাম্প ও হটলাইন" : "Regional Outposts & Hotlines"}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)]">
                  <span className="font-bold text-foreground block">কক্সবাজার বিচ</span>
                  <a href="tel:01320163610" className="text-sky-600 dark:text-sky-400 font-semibold block mt-1">
                    01320-163610
                  </a>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)]">
                  <span className="font-bold text-foreground block">বান্দরবান জোন</span>
                  <a href="tel:01320163622" className="text-sky-600 dark:text-sky-400 font-semibold block mt-1">
                    01320-163622
                  </a>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)]">
                  <span className="font-bold text-foreground block">রাঙ্গামাটি কাপ্তাই</span>
                  <a href="tel:01320163620" className="text-sky-600 dark:text-sky-400 font-semibold block mt-1">
                    01320-163620
                  </a>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)]">
                  <span className="font-bold text-foreground block">সিলেট ও জাফলং</span>
                  <a href="tel:01320163625" className="text-sky-600 dark:text-sky-400 font-semibold block mt-1">
                    01320-163625
                  </a>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)]">
                  <span className="font-bold text-foreground block">কুয়াকাটা বিচ</span>
                  <a href="tel:01320163630" className="text-sky-600 dark:text-sky-400 font-semibold block mt-1">
                    01320-163630
                  </a>
                </div>
                <div className="p-3.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)]">
                  <span className="font-bold text-foreground block">সুন্দরবন মোংলা</span>
                  <a href="tel:01320163635" className="text-sky-600 dark:text-sky-400 font-semibold block mt-1">
                    01320-163635
                  </a>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
