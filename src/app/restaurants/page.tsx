"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import travelData from "@/data/travel-services.json";
import {
  UtensilsCrossed,
  Star,
  MapPin,
  ExternalLink,
  PhoneCall,
  MessageCircle,
  Navigation,
  Sparkles,
  ChevronDown,
  ArrowUp,
} from "lucide-react";

type Place = { name: string; name_bn: string };
type RestaurantLine = {
  name: string;
  address: string;
  rating: number;
  review_count: number;
  cuisine: string[];
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
  restaurants: Record<string, RestaurantLine[]>;
  places: Record<string, Place>;
};

export default function RestaurantsPage() {
  const { language } = useApp();
  const isBn = language === "bn";
  const [selectedHub, setSelectedHub] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState<number>(12);

  const handleSelectHub = (hub: string) => {
    setSelectedHub(hub);
    setVisibleCount(12);
  };

  const { restaurants: restLines, places } = travelData as unknown as TravelServicesData;
  const hubs = Object.keys(restLines);

  const allRestaurants: Array<{
    hub: string;
    hubName: string;
    name: string;
    address: string;
    rating: number;
    reviews: number;
    cuisine: string;
    image: string;
    phone: string;
    whatsapp: string;
    signatureDish: string;
    pricePerson: string;
    mapQuery: string;
  }> = [];

  for (const hub of hubs) {
    const list = restLines[hub] || [];
    const place = places[hub];
    for (const item of list) {
      allRestaurants.push({
        hub,
        hubName: place ? (isBn ? place.name_bn : place.name) : hub,
        name: item.name,
        address: item.address,
        rating: item.rating,
        reviews: item.review_count,
        cuisine: item.cuisine.join(", ") || "Authentic Local",
        image: `https://images.unsplash.com/photo-${item.photo}?auto=format&fit=crop&w=700&q=70`,
        phone: item.phone || "+8801711000000",
        whatsapp: item.whatsapp || "8801711000000",
        signatureDish: isBn
          ? item.signature_dish_bn || item.signature_dish || "ঐতিহ্যবাহী দেশি খাবার"
          : item.signature_dish || "Traditional Local Delicacy",
        pricePerson: isBn
          ? item.price_person_bn || "৳৩০০–৳৫৫০"
          : item.price_person || "৳300–৳550",
        mapQuery:
          item.map_query ||
          encodeURIComponent(`${item.name} ${item.address} Bangladesh`),
      });
    }
  }

  const displayedRestaurants =
    selectedHub === "all"
      ? allRestaurants
      : allRestaurants.filter((r) => r.hub === selectedHub);

  return (
    <div className="py-12 bg-[var(--background)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4a340]/10 text-[#d97706] text-xs font-bold mb-3">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>{isBn ? "ঐতিহ্যবাহী স্বাদের সন্ধান" : "Culinary Heritage"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            {isBn ? "খাবার ও রেস্তোরাঁ গাইড" : "Iconic Regional Food & Restaurants"}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] mt-2">
            {isBn
              ? "মেজবানি, কাচ্চি, সাতকড়া, রূপচাঁদা, পাহাড়ি বাঁশ মুরগি ও নদীর তাজা মাছ — সিগনেচার ডিশ ও সরাসরি যোগাযোগের তালিকা।"
              : "Discover legendary food traditions, iconic eateries, verified signature dishes, and direct contact counters across Bangladesh."}
          </p>
        </div>

        {/* Hub filter tabs */}
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none touch-pan-x px-1">
          <button
            onClick={() => handleSelectHub("all")}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center shrink-0 ${
              selectedHub === "all"
                ? "bg-[#0f4a38] text-white shadow-md dark:bg-[#1f9d76]"
                : "bg-[var(--surface)] text-foreground border border-[var(--glass-border)] hover:bg-[var(--surface-raised)]"
            }`}
          >
            {isBn ? "সকল অঞ্চল" : "All Regions"}
          </button>
          {hubs.map((hub) => {
            const p = places[hub];
            const label = p ? (isBn ? p.name_bn : p.name) : hub;
            return (
              <button
                key={hub}
                onClick={() => handleSelectHub(hub)}
                className={`min-h-[40px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center shrink-0 ${
                  selectedHub === hub
                    ? "bg-[#0f4a38] text-white shadow-md dark:bg-[#1f9d76]"
                    : "bg-[var(--surface)] text-foreground border border-[var(--glass-border)] hover:bg-[var(--surface-raised)]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedRestaurants.slice(0, visibleCount).map((item, idx) => (
            <div
              key={idx}
              className="group flex flex-col rounded-2xl overflow-hidden bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
            >
              {/* Photo & Overlays */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-black/60 text-white backdrop-blur-md">
                  {item.hubName}
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-[#0f4a38]/80 text-white backdrop-blur-md border border-white/20">
                  {isBn ? `${item.pricePerson} / জন` : `${item.pricePerson} / person`}
                </span>
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold">
                  <Star className="w-3.5 h-3.5 text-[#f4a340] fill-[#f4a340]" />
                  <span>{item.rating}</span>
                  <span className="text-white/80 text-xs font-semibold">· Explorer Score</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-col flex-1 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-[#0f4a38] dark:group-hover:text-[#2ecc71] transition-colors leading-snug">
                    {item.name}
                  </h3>
                </div>

                <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 mb-3">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-[#f4a340]" />
                  <span className="line-clamp-1">{item.address}</span>
                </p>

                {/* Signature Dish Badge */}
                <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>{isBn ? "সিগনেচার স্পেশালিটি:" : "Signature Speciality:"}</span>
                  </div>
                  <p className="text-foreground font-semibold leading-relaxed line-clamp-2">
                    {item.signatureDish}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-[var(--glass-border)] flex flex-col gap-3">
                  {/* Category Pill */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[var(--surface-raised)] text-[var(--text-muted)]">
                      {item.cuisine}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {item.reviews} {isBn ? "রিভিউ" : "Reviews"}
                    </span>
                  </div>

                  {/* Triple Action Bar (Call, WhatsApp, Maps) */}
                  <div className="grid grid-cols-3 gap-2">
                    <a
                      href={`tel:${item.phone}`}
                      className="flex items-center justify-center gap-1.5 min-h-[38px] px-2 rounded-xl bg-[#0f4a38]/10 hover:bg-[#0f4a38] hover:text-white dark:bg-[#1f9d76]/20 dark:hover:bg-[#1f9d76] text-xs font-bold transition-all text-[#0f4a38] dark:text-[#2ecc71] cursor-pointer"
                      title={isBn ? "সরাসরি কল করুন" : "Call Directly"}
                    >
                      <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                      <span>{isBn ? "কল" : "Call"}</span>
                    </a>

                    <a
                      href={`https://wa.me/${item.whatsapp}?text=${encodeURIComponent(
                        isBn
                          ? `হ্যালো, আমি ঘুরেঘুরি থেকে ${item.name}-এর টেবিল রিজার্ভেশন ও মেন্যু সম্পর্কে জানতে চাচ্ছি।`
                          : `Hello, I would like to inquire about table reservation and menu at ${item.name}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 min-h-[38px] px-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366] hover:text-white dark:bg-[#25D366]/20 text-xs font-bold transition-all text-[#128C7E] dark:text-[#25D366] cursor-pointer"
                      title={isBn ? "হোয়াটসঅ্যাপে মেসেজ দিন" : "WhatsApp Inquiry"}
                    >
                      <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{isBn ? "মেসেজ" : "Chat"}</span>
                    </a>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${item.mapQuery}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 min-h-[38px] px-2 rounded-xl bg-blue-500/10 hover:bg-blue-600 hover:text-white dark:bg-blue-500/20 text-xs font-bold transition-all text-blue-600 dark:text-blue-400 cursor-pointer"
                      title={isBn ? "গুগল ম্যাপসে ডিরেকশন দেখুন" : "View on Google Maps"}
                    >
                      <Navigation className="w-3.5 h-3.5 shrink-0" />
                      <span>{isBn ? "ম্যাপ" : "Map"}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progressive Loading with Luxury Progress Gauge */}
        {visibleCount < displayedRestaurants.length ? (
          <div className="mt-14 max-w-md mx-auto text-center flex flex-col items-center gap-3.5">
            <div className="w-full flex items-center justify-between text-xs font-bold text-[var(--text-muted)] px-1">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {isBn
                    ? `${Math.min(visibleCount, displayedRestaurants.length)} / ${displayedRestaurants.length} টি রেস্তোরাঁ দেখাচ্ছে`
                    : `Showing ${Math.min(visibleCount, displayedRestaurants.length)} of ${displayedRestaurants.length} restaurants`}
                </span>
              </span>
              <span className="text-[#0f4a38] dark:text-emerald-400 font-extrabold text-xs">
                {Math.round((Math.min(visibleCount, displayedRestaurants.length) / displayedRestaurants.length) * 100)}%
              </span>
            </div>

            <div className="w-full h-1.5 bg-[var(--surface-raised)] border border-[var(--glass-border)] rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-[#156b50] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, (Math.min(visibleCount, displayedRestaurants.length) / displayedRestaurants.length) * 100)}%` }}
              />
            </div>

            <button
              type="button"
              onClick={() => setVisibleCount((prev) => Math.min(prev + 12, displayedRestaurants.length))}
              className="mt-1 group px-8 py-3 rounded-2xl bg-gradient-to-r from-[#0f4a38] to-[#156b50] hover:from-[#156b50] hover:to-[#1b8061] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2.5 w-full sm:w-auto"
            >
              <UtensilsCrossed className="w-4 h-4 text-emerald-300" />
              <span>
                {isBn
                  ? `আরও ১২টি রেস্তোরাঁ দেখুন (বাকি ${displayedRestaurants.length - Math.min(visibleCount, displayedRestaurants.length)}টি)`
                  : `Explore More Restaurants (${displayedRestaurants.length - Math.min(visibleCount, displayedRestaurants.length)} remaining)`}
              </span>
              <ChevronDown className="w-4 h-4 opacity-75 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        ) : displayedRestaurants.length > 12 ? (
          <div className="mt-12 text-center py-4">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--surface)] border border-[var(--glass-border)] text-xs font-bold text-[var(--text-muted)] shadow-sm">
              <Sparkles className="w-4 h-4 text-[#f4a340]" />
              <span>
                {isBn
                  ? `সকল ${displayedRestaurants.length}টি রেস্তোরাঁ প্রদর্শিত হয়েছে`
                  : `All ${displayedRestaurants.length} restaurants displayed`}
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
  );
}
