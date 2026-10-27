"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import travelData from "@/data/travel-services.json";
import BookingEngine from "@/components/travel/BookingEngine";
import {
  CURATED_ITINERARIES,
  DestinationItinerary,
  ItineraryDay,
} from "@/data/curated-itineraries";
import {
  calculateTripBudget,
  LOCAL_FARES,
  getEmergencyContacts,
  generateSosWhatsAppUrl,
  BudgetBreakdown,
} from "@/lib/free-api-service";
import {
  Search,
  MapPin,
  Star,
  Hotel,
  UtensilsCrossed,
  Bus,
  Train,
  ShieldAlert,
  PhoneCall,
  MessageCircle,
  Navigation,
  Calculator,
  CheckSquare,
  Square,
  Ticket,
  ChevronRight,
  ExternalLink,
  Users,
  Calendar,
  Sparkles,
  Luggage,
  Printer,
  Share2,
  Copy,
  Bookmark,
  Check,
  Clock,
  Compass,
} from "lucide-react";

type Place = { name: string; name_bn: string };
type HotelLine = {
  name: string;
  address: string;
  rating: number;
  review_count: number;
  price: number;
  hotel_type: string;
  photo: string;
  phone?: string;
  whatsapp?: string;
  map_query?: string;
};
type RestLine = {
  name: string;
  address: string;
  rating: number;
  review_count: number;
  price_level: string;
  price_for_two: number;
  cuisine: string;
  photo: string;
  phone?: string;
  whatsapp?: string;
  signature_dish?: string;
  signature_dish_bn?: string;
  price_person?: string;
  price_person_bn?: string;
  map_query?: string;
};
type TravelServicesData = {
  hotels: Record<string, HotelLine[]>;
  restaurants: Record<string, RestLine[]>;
  places: Record<string, Place>;
};

const DESTINATION_CHIPS = [
  { key: "coxs-bazar", en: "Cox's Bazar", bn: "কক্সবাজার", emoji: "🏖️" },
  { key: "sajek-valley", en: "Sajek Valley", bn: "সাজেক ভ্যালি", emoji: "☁️" },
  { key: "sylhet", en: "Sylhet", bn: "সিলেট", emoji: "🍃" },
  { key: "bandarban", en: "Bandarban", bn: "বান্দরবান", emoji: "⛰️" },
  { key: "chattogram", en: "Chattogram", bn: "চট্টগ্রাম", emoji: "⚓" },
  { key: "dhaka", en: "Dhaka", bn: "ঢাকা", emoji: "🏙️" },
];

const PACKING_BASE_ITEMS = [
  { id: "c1", label_en: "Light cotton clothing & breathable shirts", label_bn: "হালকা সুতি কাপড় ও আরামদায়ক পোশাক" },
  { id: "c2", label_en: "Comfortable trekking / walking shoes & socks", label_bn: "হাঁটার আরামদায়ক স্নিকার্স / ট্র্যাকিং জুতো ও মোজা" },
  { id: "g1", label_en: "High-capacity power bank (10,000–20,000 mAh)", label_bn: "হাই-ক্যাপাসিটি পাওয়ারব্যাংক (১০,০০০–২০,০০০ mAh)" },
  { id: "g2", label_en: "Waterproof mobile pouch & charging cables", label_bn: "ওয়াটারপ্রুফ মোবাইল পাউচ ও চার্জার ক্যাবল" },
  { id: "m1", label_en: "Basic medicines (Paracetamol, Antacid, Saline)", label_bn: "জরুরি ওষুধ (প্যারাসিটামল, এন্টাসিড, ওরস্যালাইন, বমির ওষুধ)" },
  { id: "m2", label_en: "Mosquito repellent cream (Odomos / herbal)", label_bn: "মশা নিরোধক ওডোমস লোশন (পাহাড় ও হাওরে অত্যন্ত জরুরি)" },
  { id: "d1", label_en: "National ID card (NID) / Birth Certificate photocopy", label_bn: "জাতীয় পরিচয়পত্র (NID) বা জন্মনিবন্ধন ফটোকপি" },
  { id: "d2", label_en: "Physical cash in wallet (Hill ATMs often have no network)", label_bn: "পর্যাপ্ত নগদ টাকা (পাহাড়ে এটিএম ও অনলাইন পেমেন্ট প্রায়ই অচল)" },
  { id: "s1", label_en: "Compact umbrella or light raincoat", label_bn: "ছোট ছাতা বা ফোল্ডিং রেইনকোট" },
  { id: "s2", label_en: "Sunscreen lotion, UV sunglasses & hat", label_bn: "সানস্ক্রিন লোশন, ইউভি সানগ্লাস ও রোদ টুপি" },
];

export default function TravelPlannerPage() {
  const { language } = useApp();
  const isBn = language === "bn";

  // Selected Trip Parameters
  const [selectedDestKey, setSelectedDestKey] = useState<string>("coxs-bazar");
  const [selectedDuration, setSelectedDuration] = useState<2 | 3 | 4>(3);
  const [travelStyle, setTravelStyle] = useState<"family" | "couple" | "friends">("family");
  const [budgetTier, setBudgetTier] = useState<"budget" | "standard" | "luxury">("standard");
  const [budgetPersons, setBudgetPersons] = useState<number>(2);

  // UI Feedback States
  const [copiedPlan, setCopiedPlan] = useState<boolean>(false);
  const [savedLocally, setSavedLocally] = useState<boolean>(false);

  // Active Tab for Services (Hotels, Food, Transit)
  const [servicesTab, setServicesTab] = useState<"all" | "hotels" | "restaurants" | "transport">("all");

  // Packing Checklist State
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    c1: true,
    c2: true,
    g1: true,
    d1: true,
    d2: true,
  });

  const togglePackingItem = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const [sharingLocation, setSharingLocation] = useState<boolean>(false);

  const handleShareLocation = () => {
    setSharingLocation(true);
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setSharingLocation(false);
          const url = generateSosWhatsAppUrl(destNameEn, {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          window.open(url, "_blank", "noopener,noreferrer");
        },
        () => {
          setSharingLocation(false);
          const url = generateSosWhatsAppUrl(destNameEn);
          window.open(url, "_blank", "noopener,noreferrer");
        },
        { timeout: 7000 }
      );
    } else {
      setSharingLocation(false);
      const url = generateSosWhatsAppUrl(destNameEn);
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const completedCount = useMemo(() => {
    return Object.values(checkedItems).filter(Boolean).length;
  }, [checkedItems]);

  const progressPercent = Math.round((completedCount / PACKING_BASE_ITEMS.length) * 100);

  // Data Lookup
  const { hotels: allHotelsMap, restaurants: allRestsMap, places } = travelData as unknown as TravelServicesData;

  // Retrieve Active Curated Itinerary
  const activeItinerary = useMemo<DestinationItinerary | null>(() => {
    return CURATED_ITINERARIES[selectedDestKey] || CURATED_ITINERARIES["coxs-bazar"];
  }, [selectedDestKey]);

  const activeDaysList = useMemo<ItineraryDay[]>(() => {
    if (!activeItinerary) return [];
    return activeItinerary.plans[selectedDuration] || activeItinerary.plans[3] || [];
  }, [activeItinerary, selectedDuration]);

  // Destination Display Name
  const destNameEn = activeItinerary ? activeItinerary.name_en : "Cox's Bazar";
  const destNameBn = activeItinerary ? activeItinerary.name_bn : "কক্সবাজার";
  const currentDestDisplay = isBn ? destNameBn : destNameEn;

  // Real-time Dynamic Budget Calculation
  const budgetResult: BudgetBreakdown = useMemo(() => {
    return calculateTripBudget(destNameEn, selectedDuration, budgetPersons, budgetTier);
  }, [destNameEn, selectedDuration, budgetPersons, budgetTier]);

  // Destination-specific Hotels
  const matchedHotels = useMemo(() => {
    const list = allHotelsMap[selectedDestKey] || allHotelsMap["dhaka"] || [];
    const place = places[selectedDestKey];
    const placeName = place ? (isBn ? place.name_bn : place.name) : currentDestDisplay;

    return list.map((item) => ({
      name: item.name,
      address: item.address,
      rating: item.rating,
      reviews: item.review_count || 0,
      price: item.price,
      type: item.hotel_type || "Standard",
      photo: item.photo,
      phone: item.phone || "+8801700000000",
      whatsapp: item.whatsapp || "8801700000000",
      mapQuery: item.map_query || encodeURIComponent(`${item.name} ${item.address}`),
      hubName: placeName,
    }));
  }, [selectedDestKey, allHotelsMap, places, isBn, currentDestDisplay]);

  // Destination-specific Restaurants
  const matchedRestaurants = useMemo(() => {
    const list = allRestsMap[selectedDestKey] || allRestsMap["dhaka"] || [];
    const place = places[selectedDestKey];
    const placeName = place ? (isBn ? place.name_bn : place.name) : currentDestDisplay;

    return list.map((item) => ({
      name: item.name,
      address: item.address,
      rating: item.rating || 4.2,
      reviews: item.review_count || 0,
      pricePerson: isBn ? item.price_person_bn || "৳৩০০–৳৫৫০" : item.price_person || "৳300–৳550",
      cuisine: Array.isArray(item.cuisine) ? item.cuisine.join(", ") : (item.cuisine || "Bangladeshi"),
      photo: item.photo || "1563379091339-03b21ab4a4f8",
      phone: item.phone || "+8801711000000",
      whatsapp: item.whatsapp || "8801711000000",
      signatureDish: isBn
        ? item.signature_dish_bn || item.signature_dish || "ঐতিহ্যবাহী দেশি খাবার"
        : item.signature_dish || "Traditional Signature Dish",
      mapQuery: item.map_query || encodeURIComponent(`${item.name} ${item.address}`),
      hubName: placeName,
    }));
  }, [selectedDestKey, allRestsMap, places, isBn, currentDestDisplay]);

  // Action: Print / PDF
  const handlePrint = () => {
    window.print();
  };

  // Action: Share on WhatsApp
  const handleShareWhatsApp = () => {
    let msg = `*🇧🇩 ঘুরেঘুরি ভ্রমণ পরিকল্পনা — ${currentDestDisplay} (${selectedDuration} দিন)*\n`;
    msg += `👥 ভ্রমণসঙ্গী: ${budgetPersons} জন | ধরণ: ${
      travelStyle === "family" ? "পারিবারিক" : travelStyle === "couple" ? "দম্পতি" : "বন্ধুবান্ধব"
    }\n`;
    msg += `💰 আনুমানিক মোট বাজেট: ৳${budgetResult.grandTotal.toLocaleString()} (জনপ্রতি ৳${budgetResult.perPerson.toLocaleString()})\n\n`;

    activeDaysList.forEach((day) => {
      msg += `📍 *দিন ${day.dayNumber}: ${isBn ? day.title_bn : day.title_en}*\n`;
      day.activities.forEach((act) => {
        msg += `• _${isBn ? act.time_bn : act.time_en}_: *${isBn ? act.title_bn : act.title_en}* (${act.spot})\n`;
        if (act.dining_recommendation) {
          msg += `  🍽️ খাবার: ${isBn ? act.dining_recommendation_bn : act.dining_recommendation}\n`;
        }
      });
      msg += `\n`;
    });

    msg += `🌐 বিস্তারিত গাইড দেখুন: https://ghuraghuri.com/travel\n`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // Action: Copy Plan
  const handleCopyPlan = () => {
    let text = `🇧🇩 ঘুরেঘুরি ভ্রমণ পরিকল্পনা — ${currentDestDisplay} (${selectedDuration} দিন)\n\n`;
    activeDaysList.forEach((day) => {
      text += `[দিন ${day.dayNumber}]: ${isBn ? day.title_bn : day.title_en}\n`;
      day.activities.forEach((act) => {
        text += `• ${isBn ? act.time_bn : act.time_en} - ${isBn ? act.title_bn : act.title_en}\n  ${isBn ? act.desc_bn : act.desc_en}\n`;
      });
      text += `\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedPlan(true);
    setTimeout(() => setCopiedPlan(false), 2500);
  };

  // Action: Save Itinerary Locally
  const handleSaveLocally = () => {
    if (typeof window !== "undefined") {
      const planData = {
        destKey: selectedDestKey,
        duration: selectedDuration,
        travelStyle,
        budgetTier,
        persons: budgetPersons,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem("saved_ghuraghuri_trip", JSON.stringify(planData));
      setSavedLocally(true);
      setTimeout(() => setSavedLocally(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-foreground pb-24">
      {/* 1. Header & Interactive Plan Builder */}
      <section className="relative py-12 sm:py-16 bg-gradient-to-b from-[#0f4a38]/15 via-[var(--surface-raised)] to-[var(--background)] border-b border-[var(--glass-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] mb-4">
            <Link href="/" className="hover:text-foreground">
              {isBn ? "হোম" : "Home"}
            </Link>
            <span>/</span>
            <span className="text-[#0f4a38] dark:text-[#2ecc71]">
              {isBn ? "ভ্রমণ পরিকল্পনা ও আইটিনারেরি" : "Plan Trip & Itinerary"}
            </span>
          </nav>

          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isBn ? "স্মার্ট ডে-বাই-ডে ট্যুর প্ল্যানার" : "Smart Day-by-Day Tour Planner"}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">
              {isBn ? "আপনার ভ্রমণ সাজিয়ে নিন" : "Plan Your Dream Trip to Bangladesh"}
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
              {isBn
                ? "গন্তব্য ও দিন নির্বাচন করুন—তাত্ক্ষণিক পেয়ে যান বাস্তব ভ্রমণসূচি, বিখ্যাত খাবার, হোটেল, যাতায়াত এবং প্রিন্ট/হোয়াটসঅ্যাপে শেয়ার করার সুবিধা।"
                : "Select destination and duration to instantly generate a curated day-by-day travel itinerary with meals, direct contacts, and one-click WhatsApp sharing."}
            </p>
          </div>

          {/* Interactive Planner Configuration Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-xl">
            {/* Step A: Destination Selection Chips */}
            <div className="mb-6">
              <label className="text-xs font-bold text-[var(--text-muted)] block mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                <Compass className="w-4 h-4 text-[#0f4a38] dark:text-[#2ecc71]" />
                <span>{isBn ? "১. গন্তব্য পছন্দ করুন:" : "1. Choose Destination:"}</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {DESTINATION_CHIPS.map((chip) => {
                  const isSelected = selectedDestKey === chip.key;
                  return (
                    <button
                      key={chip.key}
                      type="button"
                      onClick={() => setSelectedDestKey(chip.key)}
                      className={`min-h-[44px] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        isSelected
                          ? "bg-[#0f4a38] text-white shadow-md dark:bg-[#1f9d76]"
                          : "bg-[var(--surface-raised)] text-foreground border border-[var(--glass-border)] hover:bg-[#0f4a38]/10"
                      }`}
                    >
                      <span className="text-base">{chip.emoji}</span>
                      <span>{isBn ? chip.bn : chip.en}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step B: Duration, Style & Travelers Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[var(--glass-border)]">
              {/* Duration */}
              <div>
                <label className="text-xs font-bold text-[var(--text-muted)] block mb-2.5 flex items-center gap-1.5 uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-[#f4a340]" />
                  <span>{isBn ? "২. ভ্রমণের সময়কাল:" : "2. Duration:"}</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[2, 3, 4].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDuration(d as 2 | 3 | 4)}
                      className={`min-h-[42px] rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                        selectedDuration === d
                          ? "bg-[#0f4a38] text-white border-[#0f4a38] dark:bg-[#1f9d76] dark:border-[#1f9d76] shadow-sm"
                          : "bg-[var(--surface-raised)] text-foreground border-[var(--glass-border)] hover:bg-[#0f4a38]/10"
                      }`}
                    >
                      {d} {isBn ? "দিন" : "Days"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Style */}
              <div>
                <label className="text-xs font-bold text-[var(--text-muted)] block mb-2.5 flex items-center gap-1.5 uppercase tracking-wider">
                  <Users className="w-3.5 h-3.5 text-[#2ecc71]" />
                  <span>{isBn ? "৩. ভ্রমণের ধরন:" : "3. Travel Style:"}</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "family", en: "Family", bn: "পরিবার" },
                    { key: "couple", en: "Couple", bn: "দম্পতি" },
                    { key: "friends", en: "Friends", bn: "বন্ধুরা" },
                  ].map((style) => (
                    <button
                      key={style.key}
                      type="button"
                      onClick={() => setTravelStyle(style.key as any)}
                      className={`min-h-[42px] rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                        travelStyle === style.key
                          ? "bg-[#0f4a38] text-white border-[#0f4a38] dark:bg-[#1f9d76] dark:border-[#1f9d76] shadow-sm"
                          : "bg-[var(--surface-raised)] text-foreground border-[var(--glass-border)] hover:bg-[#0f4a38]/10"
                      }`}
                    >
                      {isBn ? style.bn : style.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travelers Count */}
              <div>
                <label className="text-xs font-bold text-[var(--text-muted)] block mb-2.5 flex items-center gap-1.5 uppercase tracking-wider">
                  <Users className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>{isBn ? "৪. ভ্রমণসঙ্গী সংখ্যা:" : "4. Travelers:"}</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 4, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setBudgetPersons(num)}
                      className={`min-h-[42px] flex-1 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                        budgetPersons === num
                          ? "bg-[#0f4a38] text-white border-[#0f4a38] dark:bg-[#1f9d76] dark:border-[#1f9d76] shadow-sm"
                          : "bg-[var(--surface-raised)] text-foreground border-[var(--glass-border)] hover:bg-[#0f4a38]/10"
                      }`}
                    >
                      {num} {isBn ? "জন" : "p"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-16">
        {/* 2. THE MASTER DAY-BY-DAY ITINERARY DOSSIER */}
        <section id="itinerary-dossier" className="scroll-mt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4a340]/15 text-[#d97706] text-xs font-bold mb-2">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {isBn
                    ? `${currentDestDisplay} — ${selectedDuration} দিনের পূর্ণাঙ্গ সূচি`
                    : `Curated ${selectedDuration}-Day Itinerary for ${destNameEn}`}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                {isBn
                  ? `দিনভিত্তিক সুনির্দিষ্ট ভ্রমণ পরিকল্পনা`
                  : `Curated Hour-by-Hour Travel Itinerary`}
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {isBn
                  ? `সকাল থেকে রাত পর্যন্ত দর্শনীয় স্থান, বিখ্যাত খাবারের দোকান ও যাতায়াতের সময়সূচি।`
                  : `Structured morning to night timeline with authentic regional meals and transit routes.`}
              </p>
            </div>

            {/* Utility Action Buttons: Print, WhatsApp, Copy, Save */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--surface-raised)] hover:bg-[#0f4a38] hover:text-white border border-[var(--glass-border)] text-xs font-bold transition-all cursor-pointer"
                title={isBn ? "পিডিএফ বা প্রিন্ট করুন" : "Print or Save as PDF"}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{isBn ? "প্রিন্ট / পিডিএফ" : "Print PDF"}</span>
              </button>

              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366] text-[#128C7E] dark:text-[#25D366] hover:text-white border border-[#25D366]/30 text-xs font-bold transition-all cursor-pointer"
                title={isBn ? "হোয়াটসঅ্যাপে পাঠান" : "Share to WhatsApp Group"}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{isBn ? "হোয়াটসঅ্যাপে শেয়ার" : "Share WhatsApp"}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyPlan}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--surface-raised)] hover:bg-[var(--surface)] border border-[var(--glass-border)] text-xs font-bold transition-all cursor-pointer"
              >
                {copiedPlan ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">{isBn ? "কপি হয়েছে!" : "Copied!"}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isBn ? "প্ল্যান কপি" : "Copy Plan"}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSaveLocally}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--surface-raised)] hover:bg-[var(--surface)] border border-[var(--glass-border)] text-xs font-bold transition-all cursor-pointer"
              >
                {savedLocally ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">{isBn ? "সেভ হয়েছে!" : "Saved!"}</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{isBn ? "সেভ করুন" : "Save Trip"}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Days Accordion / Timeline List */}
          <div className="space-y-8">
            {activeDaysList.map((day) => (
              <div
                key={day.dayNumber}
                className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-md"
              >
                {/* Day Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[var(--glass-border)] mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#0f4a38] text-white flex items-center justify-center font-black text-sm shrink-0">
                      D{day.dayNumber}
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-foreground">
                        {isBn ? `দিন ${day.dayNumber}: ${day.title_bn}` : `Day ${day.dayNumber}: ${day.title_en}`}
                      </h3>
                      <p className="text-xs text-[#0f4a38] dark:text-[#2ecc71] font-semibold">
                        {isBn ? day.theme_bn : day.theme_en}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Day Activities Timeline */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {day.activities.map((act, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] flex flex-col justify-between hover:border-[#0f4a38]/40 transition-colors"
                    >
                      <div>
                        {/* Time & Spot */}
                        <div className="flex items-center justify-between text-xs font-bold text-[#d97706] mb-2">
                          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10">
                            <Clock className="w-3.5 h-3.5" />
                            {isBn ? act.time_bn : act.time_en}
                          </span>
                          <span className="text-[var(--text-muted)] flex items-center gap-1 font-semibold truncate max-w-[180px]">
                            <MapPin className="w-3.5 h-3.5 text-[#0f4a38] dark:text-[#2ecc71] shrink-0" />
                            {act.spot}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-foreground mb-2">
                          {isBn ? act.title_bn : act.title_en}
                        </h4>

                        <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
                          {isBn ? act.desc_bn : act.desc_en}
                        </p>
                      </div>

                      {/* Dining / Transit Extra Callout */}
                      <div className="space-y-2 pt-3 border-t border-[var(--glass-border)] text-xs">
                        {act.dining_recommendation && (
                          <div className="flex items-start gap-2 text-amber-700 dark:text-amber-400 font-medium">
                            <UtensilsCrossed className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>
                              <strong>{isBn ? "খাবারের সন্ধান: " : "Recommended Dining: "}</strong>
                              {isBn ? act.dining_recommendation_bn : act.dining_recommendation}
                            </span>
                          </div>
                        )}
                        {act.transit_tip && (
                          <div className="flex items-start gap-2 text-[#0f4a38] dark:text-[#2ecc71] font-medium">
                            <Bus className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>
                              <strong>{isBn ? "যাতায়াত টিপ: " : "Transit Tip: "}</strong>
                              {isBn ? act.transit_tip_bn : act.transit_tip}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. SYNCHRONIZED BUDGET ESTIMATOR (Based on Selected Itinerary) */}
        <section className="p-6 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4a340]/15 text-[#d97706] text-xs font-bold mb-2">
                <Calculator className="w-3.5 h-3.5" />
                <span>{isBn ? "ট্যুর বাজেট এস্টিমেটর" : "Itemized Tour Budget"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                {isBn
                  ? `${currentDestDisplay} ভ্রমণের সুনির্দিষ্ট আনুমানিক খরচ`
                  : `Estimated Tour Budget for ${destNameEn}`}
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {isBn
                  ? `${selectedDuration} দিন, ${budgetPersons} জনের জন্য ক্যাটাগরিভিত্তিক খরচের তালিকা।`
                  : `Detailed cost breakdown based on ${selectedDuration} days and ${budgetPersons} travelers.`}
              </p>
            </div>

            {/* Comfort Tier Buttons */}
            <div className="flex items-center bg-[var(--surface-raised)] p-1 rounded-2xl border border-[var(--glass-border)]">
              {[
                { key: "budget", label_en: "Budget", label_bn: "বাজেট" },
                { key: "standard", label_en: "Standard", label_bn: "মানসম্মত" },
                { key: "luxury", label_en: "Luxury", label_bn: "লাক্সারি" },
              ].map((tier) => (
                <button
                  key={tier.key}
                  type="button"
                  onClick={() => setBudgetTier(tier.key as any)}
                  className={`min-h-[40px] px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    budgetTier === tier.key
                      ? "bg-[#0f4a38] text-white shadow-sm dark:bg-[#1f9d76]"
                      : "text-[var(--text-muted)] hover:text-foreground"
                  }`}
                >
                  {isBn ? tier.label_bn : tier.label_en}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Grand Total Capsule */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0f4a38] to-[#156b50] text-white shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-white/80">
                  {isBn ? "সর্বমোট আনুমানিক বাজেট" : "Total Estimated Tour Budget"}
                </span>
                <div className="text-3xl sm:text-4xl font-black mt-2">
                  ৳{budgetResult.grandTotal.toLocaleString()}
                </div>
                <p className="text-xs text-white/80 mt-1">
                  {budgetPersons} {isBn ? "জনের দলের জন্য" : "travelers group"} · {selectedDuration} {isBn ? "দিন" : "days"}
                </p>
              </div>

              <div className="pt-6 border-t border-white/20 mt-6 space-y-2">
                <div className="flex items-center justify-between text-xs text-white/90">
                  <span>{isBn ? "জনপ্রতি গড় খরচ:" : "Estimated Per Person:"}</span>
                  <span className="text-lg font-bold text-[#f4a340]">
                    ৳{budgetResult.perPerson.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-white/90">
                  <span>{isBn ? "দৈনিক খরচ (দলগত):" : "Daily Run Rate:"}</span>
                  <span className="font-semibold text-white">
                    ৳{Math.round(budgetResult.grandTotal / selectedDuration).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Itemized Cost Breakdown List */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  label_en: "Hotel / Lodging",
                  label_bn: "আবাসন ও হোটেল কটেজ",
                  val: budgetResult.breakdown.hotel,
                  desc_en: "Clean curated rooms matching party size",
                  desc_bn: "মানসম্মত হোটেল বা পাহাড়ি কটেজ রুম",
                  icon: Hotel,
                  color: "text-[#2ecc71]",
                },
                {
                  label_en: "Food & Authentic Meals",
                  label_bn: "খাবার ও ঐতিহ্যবাহী রেস্তোরাঁ",
                  val: budgetResult.breakdown.food,
                  desc_en: "3 signature regional meals + tea per day",
                  desc_bn: "প্রতিদিন ৩ বেলার খাবার ও রিফ্রেশমেন্ট",
                  icon: UtensilsCrossed,
                  color: "text-[#f4a340]",
                },
                {
                  label_en: "Intercity Transit",
                  label_bn: "আন্তঃনগর যাতায়াত (বাস / ট্রেন)",
                  val: budgetResult.breakdown.transport,
                  desc_en: "Dhaka ⇄ destination tickets",
                  desc_bn: "ঢাকা থেকে এক্সপ্রেস বাস বা ট্রেনের টিকিট",
                  icon: Bus,
                  color: "text-[#38bdf8]",
                },
                {
                  label_en: "Local Sightseeing & 4x4",
                  label_bn: "লোকাল ট্রানজিট ও চান্দের গাড়ি",
                  val: budgetResult.breakdown.localTransit,
                  desc_en: "Chander Gari, TomTom, boats & entry fees",
                  desc_bn: "চান্দের গাড়ি, টমটম, বোট ও স্পট এন্ট্রি ফি",
                  icon: MapPin,
                  color: "text-[#a78bfa]",
                },
                {
                  label_en: "Emergency Contingency Buffer",
                  label_bn: "জরুরি নিরাপত্তা তহবিল",
                  val: budgetResult.breakdown.miscAndEmergency,
                  desc_en: "Medical emergency or sudden price change",
                  desc_bn: "মেডিকেল বা অপ্রত্যাশিত খরচের ব্যাকআপ",
                  icon: ShieldAlert,
                  color: "text-[#f87171]",
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className={`p-2.5 rounded-xl bg-[var(--surface)] ${item.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">
                          {isBn ? item.label_bn : item.label_en}
                        </h4>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">
                          {isBn ? item.desc_bn : item.desc_en}
                        </p>
                      </div>
                    </div>
                    <div className="text-xl font-black text-foreground pt-2 border-t border-[var(--glass-border)] text-right">
                      ৳{item.val.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. ESSENTIAL TRAVEL PACKING CHECKLIST */}
        <section className="p-6 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] text-xs font-bold mb-2">
                <Luggage className="w-3.5 h-3.5" />
                <span>{isBn ? "স্মার্ট প্যাকিং চেকলিস্ট" : "Smart Travel Packing Checklist"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                {isBn ? `${currentDestDisplay} সফরে সাথে কী কী নিবেন?` : `Essential Packing Checklist for ${destNameEn}`}
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {isBn ? "ব্যাগে নেওয়ার পর টিক চিহ্ন দিন—জরুরি কোনো সরঞ্জাম যাতে বাদ না পড়ে।" : "Check off items as you pack so you never leave crucial gear behind."}
              </p>
            </div>

            {/* Progress Bar Badge */}
            <div className="flex items-center gap-3 bg-[var(--surface-raised)] p-3 rounded-2xl border border-[var(--glass-border)] w-fit">
              <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#0f4a38] to-[#2ecc71] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-bold text-foreground">
                {completedCount}/{PACKING_BASE_ITEMS.length} ({progressPercent}%)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {PACKING_BASE_ITEMS.map((item) => {
              const checked = !!checkedItems[item.id];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => togglePackingItem(item.id)}
                  className={`min-h-[48px] p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    checked
                      ? "bg-[#0f4a38]/10 border-[#0f4a38]/30 dark:border-[#2ecc71]/40"
                      : "bg-[var(--surface-raised)] border-[var(--glass-border)] hover:bg-[#0f4a38]/5"
                  }`}
                >
                  <div className="mt-0.5 text-[#0f4a38] dark:text-[#2ecc71]">
                    {checked ? (
                      <CheckSquare className="w-5 h-5 fill-[#0f4a38] dark:fill-[#2ecc71] text-white" />
                    ) : (
                      <Square className="w-5 h-5 text-[var(--text-muted)]" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-semibold leading-snug ${
                      checked ? "line-through text-[var(--text-muted)]" : "text-foreground"
                    }`}
                  >
                    {isBn ? item.label_bn : item.label_en}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 5. DIRECT VERIFIED CONTACTS (Hotels & Restaurants in This Destination) */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] text-xs font-bold mb-2">
                <Hotel className="w-3.5 h-3.5" />
                <span>{isBn ? "বাছাইকৃত সেবা ও হেল্পলাইন" : "Curated Local Services"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                {isBn ? `${currentDestDisplay}-এর বাছাইকৃত হোটেল ও রেস্তোরাঁ` : `Curated Hotels & Dining in ${destNameEn}`}
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                {isBn
                  ? "সরাসরি ফোন কল, হোয়াটসঅ্যাপ বা গুগল ম্যাপস লোকেশনের মাধ্যমে যোগাযোগ করুন।"
                  : "Direct telephone, WhatsApp reservation, and Google Maps location for each spot."}
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center bg-[var(--surface)] p-1 rounded-2xl border border-[var(--glass-border)]">
              {[
                { key: "all", label_en: "All", label_bn: "সব" },
                { key: "hotels", label_en: "Hotels", label_bn: "হোটেল" },
                { key: "restaurants", label_en: "Dining", label_bn: "খাবার" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setServicesTab(tab.key as any)}
                  className={`min-h-[38px] px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    servicesTab === tab.key
                      ? "bg-[#0f4a38] text-white shadow-sm dark:bg-[#1f9d76]"
                      : "text-[var(--text-muted)] hover:text-foreground"
                  }`}
                >
                  {isBn ? tab.label_bn : tab.label_en}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Hotels Cards */}
            {(servicesTab === "all" || servicesTab === "hotels") &&
              matchedHotels.slice(0, 3).map((h, i) => (
                <div
                  key={`h-${i}`}
                  className="group rounded-2xl overflow-hidden bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--surface-raised)]">
                      {h.photo && h.photo.startsWith("/assets/") ? (
                        <Image
                          src={h.photo}
                          alt={h.name}
                          fill
                          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 360px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-950/40 via-teal-900/30 to-slate-900/40 flex flex-col items-center justify-center p-4 text-center">
                          <Hotel className="w-10 h-10 text-emerald-400/60 mb-1" />
                          <span className="text-[11px] font-medium text-emerald-200/80">{h.type || "Hotel"}</span>
                        </div>
                      )}
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-[#0f4a38] text-white">
                        {h.type}
                      </span>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-[#0f4a38] dark:text-[#2ecc71]">
                          {h.hubName}
                        </span>
                        {(h as any).ratingSource && (
                          <div className="flex items-center gap-1 text-xs font-bold text-[#f4a340]">
                            <Star className="w-3.5 h-3.5 fill-[#f4a340]" />
                            <span>{h.rating}</span>
                          </div>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-foreground mb-1 truncate">{h.name}</h3>
                      <p className="text-xs text-[var(--text-muted)] line-clamp-1 mb-3">{h.address}</p>

                      <div className="text-sm font-extrabold text-foreground mb-4">
                        ৳{h.price.toLocaleString()} <span className="text-xs font-normal text-[var(--text-muted)]">/ night</span>
                      </div>
                    </div>
                  </div>

                  {/* Triple Action Bar */}
                  <div className="p-5 pt-0">
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[var(--glass-border)]">
                      <a
                        href={`tel:${h.phone}`}
                        className="flex items-center justify-center gap-1 min-h-[38px] rounded-xl bg-[#0f4a38]/10 hover:bg-[#0f4a38] hover:text-white text-[#0f4a38] dark:text-[#2ecc71] text-xs font-bold transition-all"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{isBn ? "কল" : "Call"}</span>
                      </a>
                      <a
                        href={`https://wa.me/${h.whatsapp}?text=${encodeURIComponent(
                          isBn
                            ? `হ্যালো, আমি ঘুরেঘুরি থেকে ${h.name}-এর রুম বুকিং ও রেট সম্পর্কে জানতে চাচ্ছি।`
                            : `Hello, I want to inquire about room booking at ${h.name}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 min-h-[38px] rounded-xl bg-[#25D366]/15 hover:bg-[#25D366] text-[#128C7E] dark:text-[#25D366] hover:text-white text-xs font-bold transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{isBn ? "মেসেজ" : "Chat"}</span>
                      </a>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${h.mapQuery}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 min-h-[38px] rounded-xl bg-blue-500/10 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 text-xs font-bold transition-all"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>{isBn ? "ম্যাপ" : "Map"}</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}

            {/* Restaurants Cards */}
            {(servicesTab === "all" || servicesTab === "restaurants") &&
              matchedRestaurants.slice(0, 3).map((r, i) => (
                <div
                  key={`r-${i}`}
                  className="group rounded-2xl overflow-hidden bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--surface-raised)]">
                      {r.photo && r.photo.startsWith("/assets/") ? (
                        <Image
                          src={r.photo}
                          alt={r.name}
                          fill
                          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 360px"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-950/40 via-orange-950/30 to-stone-900/40 flex flex-col items-center justify-center p-4 text-center">
                          <UtensilsCrossed className="w-10 h-10 text-amber-400/60 mb-1" />
                          <span className="text-[11px] font-medium text-amber-200/80">{r.cuisine || "Dining"}</span>
                        </div>
                      )}
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-[#f4a340] text-black">
                        {r.cuisine}
                      </span>
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-black/60 text-white backdrop-blur-md">
                        {r.pricePerson}
                      </span>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-[#0f4a38] dark:text-[#2ecc71]">
                          {r.hubName}
                        </span>
                        {(r as any).ratingSource && (
                          <div className="flex items-center gap-1 text-xs font-bold text-[#f4a340]">
                            <Star className="w-3.5 h-3.5 fill-[#f4a340]" />
                            <span>{r.rating}</span>
                          </div>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-foreground mb-1 truncate">{r.name}</h3>
                      <p className="text-xs text-[var(--text-muted)] line-clamp-1 mb-2">{r.address}</p>

                      {/* Signature Dish Pill */}
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs mb-3">
                        <span className="font-bold text-amber-700 dark:text-amber-400 block mb-0.5">
                          {isBn ? "সিগনেচার খাবার:" : "Signature Dish:"}
                        </span>
                        <span className="font-semibold text-foreground line-clamp-1">{r.signatureDish}</span>
                      </div>
                    </div>
                  </div>

                  {/* Triple Action Bar */}
                  <div className="p-5 pt-0">
                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[var(--glass-border)]">
                      <a
                        href={`tel:${r.phone}`}
                        className="flex items-center justify-center gap-1 min-h-[38px] rounded-xl bg-[#0f4a38]/10 hover:bg-[#0f4a38] hover:text-white text-[#0f4a38] dark:text-[#2ecc71] text-xs font-bold transition-all"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{isBn ? "কল" : "Call"}</span>
                      </a>
                      <a
                        href={`https://wa.me/${r.whatsapp}?text=${encodeURIComponent(
                          isBn
                            ? `হ্যালো, আমি ঘুরেঘুরি থেকে ${r.name}-এর টেবিল রিজার্ভেশন ও স্পেশাল মেন্যু সম্পর্কে জানতে চাচ্ছি।`
                            : `Hello, I want to inquire about reservation at ${r.name}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 min-h-[38px] rounded-xl bg-[#25D366]/15 hover:bg-[#25D366] text-[#128C7E] dark:text-[#25D366] hover:text-white text-xs font-bold transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{isBn ? "মেসেজ" : "Chat"}</span>
                      </a>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${r.mapQuery}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 min-h-[38px] rounded-xl bg-blue-500/10 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 text-xs font-bold transition-all"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>{isBn ? "ম্যাপ" : "Map"}</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* 6. INTERCITY TIMETABLES & OPERATOR CONTACTS */}
        <section>
          <BookingEngine
            currentDestination={destNameEn}
            isBn={isBn}
            externalTrigger={null}
            onClearTrigger={() => {}}
          />
        </section>

        {/* 7. TYPICAL LOCAL TRANSPORT FARE GUIDE */}
        <section className="p-6 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-xl">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38bdf8]/15 text-[#0284c7] dark:text-[#38bdf8] text-xs font-bold mb-2">
              <Bus className="w-3.5 h-3.5" />
              <span>{isBn ? "প্রচলিত ভাড়ার গাইড" : "Typical Local Fares"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              {isBn ? "প্রচলিত লোকাল ভাড়া (আনুমানিক: ওঠার আগে নিশ্চিত করুন)" : "Typical Local Fares (approximate: confirm before you pay)"}
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {isBn
                ? "চান্দের গাড়ি, বোট ও লোকাল ট্রানজিটের সাধারণ ভাড়ার ধারণা যাতে অতিরিক্ত খরচ এড়ানো যায়।"
                : "Estimated market rates for 4x4s, boats, and local transit to help you negotiate."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {LOCAL_FARES.map((fare: any, idx: number) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#0f4a38] dark:text-[#2ecc71] mb-2">
                    <span className="uppercase">{fare.category || "Transit"}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--glass-border)]">
                      {fare.vehicle}
                    </span>
                  </div>
                  <h4 className="text-base font-black text-foreground mb-1">{fare.route}</h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">{fare.note}</p>
                </div>
                <div className="pt-3 border-t border-[var(--glass-border)] flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text-muted)]">
                      {isBn ? "প্রচলিত ভাড়া:" : "Typical Fare:"}
                    </span>
                    <span className="text-base font-extrabold text-[#0f4a38] dark:text-[#2ecc71]">
                      {fare.fare}
                    </span>
                  </div>
                  {fare.lastChecked && (
                    <span className="text-[10px] text-[var(--text-muted)] text-right">
                      Last checked: {fare.lastChecked}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. 24/7 TOURIST POLICE & EMERGENCY GPS SOS */}
        <section className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#061a14] via-[#09261d] to-[#04130e] text-white border border-[#2ecc71]/30 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f87171]/20 text-[#f87171] text-xs font-bold mb-3">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{isBn ? "২৪/৭ জরুরি নিরাপত্তা ও সাহায্য" : "24/7 Tourist Police & Safety"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                {isBn ? "ভ্রমণে কোনো বিপদে পড়লে তাত্ক্ষণিক যোগাযোগ" : "Emergency Assistance & GPS SOS Hotlines"}
              </h2>
              <p className="text-sm text-white/80 mt-1 max-w-xl">
                {isBn
                  ? "জরুরি প্রয়োজনে জাতীয় হেল্পলাইন ৯৯৯ ডায়াল করুন অথবা অফিশিয়াল ট্যুরিস্ট পুলিশ পোর্টালে যোগাযোগ করুন।"
                  : "For urgent assistance, dial 999 or visit the official Tourist Police portal."}
              </p>
            </div>

            {/* Direct WhatsApp SOS Trigger */}
            <button
              type="button"
              onClick={handleShareLocation}
              disabled={sharingLocation}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#2ecc71] hover:bg-[#27ae60] text-black font-extrabold text-sm shadow-xl transition-all hover:scale-105 shrink-0 cursor-pointer disabled:opacity-60"
            >
              <PhoneCall className="w-4 h-4" />
              <span>
                {sharingLocation
                  ? (isBn ? "লোকেশন নেওয়া হচ্ছে..." : "Locating...")
                  : (isBn ? "হোয়াটসঅ্যাপে আমার লোকেশন শেয়ার করুন" : "Share my location on WhatsApp")}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {getEmergencyContacts(destNameEn).map((contact, i) => {
              const hasPhone = Boolean(contact.phone);
              const href = contact.telLink || (hasPhone
                ? (contact.phone === "999" ? "tel:999" : `tel:+88${contact.phone!.replace(/[^0-9]/g, "")}`)
                : (contact.officialUrl || "https://touristpolice.gov.bd"));
              const isExternal = !hasPhone;

              return (
                <a
                  key={i}
                  href={href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <span className="text-xs font-semibold text-[#2ecc71]">{contact.note}</span>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#2ecc71] transition-colors mt-0.5">
                      {contact.name}
                    </h4>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#f4a340]">
                    <span>{contact.phone || "touristpolice.gov.bd"}</span>
                    <span className="text-white/60 group-hover:translate-x-1 transition-transform">
                      {hasPhone
                        ? (isBn ? "📞 কল করুন" : "📞 Call")
                        : (isBn ? "🌐 অফিসিয়াল পোর্টাল" : "🌐 Official Tourist Police portal")}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* 9. OFFICIAL DIRECT TICKETING PORTALS */}
        <section className="p-6 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-xl">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] text-xs font-bold mb-2">
              <Ticket className="w-3.5 h-3.5" />
              <span>{isBn ? "অফিশিয়াল টিকিট ও বুকিং গেটওয়ে" : "Official Ticket & Booking Services"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              {isBn ? "সরাসরি সরকারি ও বিশ্বস্ত বুকিং সার্ভিস" : "Direct Ticket & Travel Booking Services"}
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {isBn
                ? "বাংলাদেশ রেলওয়ে ই-টিকিট, দূরপাল্লার আন্তঃনগর বাস ও নির্ভরযোগ্য পোর্টাল।"
                : "Access official Bangladesh Railway e-ticketing and reliable express buses."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Railway */}
            <div className="p-6 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#0f4a38]/10 text-[#0f4a38] dark:text-[#2ecc71] flex items-center justify-center mb-4">
                  <Train className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#0f4a38]/10 text-[#0f4a38] dark:text-[#2ecc71]">
                  {isBn ? "সরকারি পোর্টাল" : "Government Official"}
                </span>
                <h3 className="text-lg font-bold text-foreground mt-2 mb-1">
                  {isBn ? "বাংলাদেশ রেলওয়ে ই-টিকিট" : "Bangladesh Railway E-Ticket"}
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-6">
                  {isBn
                    ? "সুবর্ণ, সোনার বাংলা, পারাবত ও কক্সবাজার এক্সপ্রেস সহ সকল ট্রেনের অনলাইন টিকিট।"
                    : "Official portal for Cox's Bazar Express, Subarna, Parabat and intercity trains."}
                </p>
              </div>
              <a
                href="https://eticket.railway.gov.bd"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-[#0f4a38] hover:bg-[#156b50] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <span>{isBn ? "ট্রেন টিকিট কাটুন" : "Book Train Tickets"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Intercity Bus */}
            <div className="p-6 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#f4a340]/15 text-[#f4a340] flex items-center justify-center mb-4">
                  <Bus className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#f4a340]/15 text-[#f4a340]">
                  {isBn ? "দূরপাল্লার এক্সপ্রেস বাস" : "Intercity Express Bus"}
                </span>
                <h3 className="text-lg font-bold text-foreground mt-2 mb-1">
                  {isBn ? "আন্তঃনগর বাস বুকিং" : "Intercity Bus Booking"}
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-6">
                  {isBn
                    ? "গ্রিন লাইন, হানিফ, সোহাগ, শ্যামলী, সেন্টমার্টিন হুন্দাই সহ সকল প্রিমিয়াম বাস।"
                    : "Direct tickets for Green Line, Hanif, Shohag, Shyamoli, and luxury AC coaches."}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href="https://www.shohoz.com/bus-tickets"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl bg-[var(--surface)] hover:bg-[#f4a340]/20 text-foreground border border-[var(--glass-border)] text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <span>Shohoz ↗</span>
                </a>
                <a
                  href="https://www.busbd.com.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl bg-[var(--surface)] hover:bg-[#f4a340]/20 text-foreground border border-[var(--glass-border)] text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <span>BusBD ↗</span>
                </a>
              </div>
            </div>

            {/* Flight Booking */}
            <div className="p-6 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#38bdf8]/15 text-[#38bdf8] flex items-center justify-center mb-4">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#38bdf8]/15 text-[#38bdf8]">
                  {isBn ? "বিমান টিকিট পোর্টাল" : "Domestic Flight Bookings"}
                </span>
                <h3 className="text-lg font-bold text-foreground mt-2 mb-1">
                  {isBn ? "অভ্যন্তরীণ ফ্লাইট টিকিট" : "Domestic Air Tickets"}
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-6">
                  {isBn
                    ? "বিমান বাংলাদেশ, ইউএস-বাংলা ও নভোএয়ার এর কক্সবাজার, সিলেট ও চট্টগ্রাম ফ্লাইট।"
                    : "Official flight tickets for Biman Bangladesh, US-Bangla, and Novoair."}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href="https://www.biman-airlines.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl bg-[var(--surface)] hover:bg-[#38bdf8]/20 text-foreground border border-[var(--glass-border)] text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <span>Biman ↗</span>
                </a>
                <a
                  href="https://usbair.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl bg-[var(--surface)] hover:bg-[#38bdf8]/20 text-foreground border border-[var(--glass-border)] text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <span>US-Bangla ↗</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
