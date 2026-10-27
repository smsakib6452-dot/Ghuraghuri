"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import travelData from "@/data/travel-services.json";
import { Hotel, Star, MapPin, ExternalLink, PhoneCall, MessageCircle, Navigation, ChevronDown, Sparkles, ArrowUp } from "lucide-react";

type Place = { name: string; name_bn: string; district?: string; division?: string };
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
type TravelServicesData = {
  hotels: Record<string, HotelLine[]>;
  places: Record<string, Place>;
};

function resolveHubParam(
  param: string | null,
  hubs: string[],
  places: Record<string, Place>
): string | null {
  if (!param) return null;
  const p = param.trim().toLowerCase();
  if (!p) return null;

  if (hubs.includes(p)) return p;

  const slugified = p.replace(/[\s_]+/g, "-").replace(/['’]/g, "");
  if (hubs.includes(slugified)) return slugified;

  for (const h of hubs) {
    if (places[h]?.name?.toLowerCase() === p) return h;
  }

  for (const h of hubs) {
    if (places[h]?.district?.toLowerCase() === p) return h;
  }

  return null;
}

function HotelsContent() {
  const { language } = useApp();
  const isBn = language === "bn";
  const searchParams = useSearchParams();

  const { hotels: hotelLines, places } = travelData as unknown as TravelServicesData;
  const hubs = Object.keys(hotelLines);

  const initialMatched =
    resolveHubParam(searchParams.get("hub"), hubs, places) ||
    resolveHubParam(searchParams.get("district"), hubs, places) ||
    "all";

  const [selectedHub, setSelectedHub] = useState<string>(initialMatched);
  const [visibleCount, setVisibleCount] = useState<number>(12);

  useEffect(() => {
    const matched =
      resolveHubParam(searchParams.get("hub"), hubs, places) ||
      resolveHubParam(searchParams.get("district"), hubs, places);

    if (matched) {
      setSelectedHub(matched);
      setVisibleCount(12);
    } else if (!searchParams.get("hub") && !searchParams.get("district")) {
      setSelectedHub("all");
    }
  }, [searchParams]);

  const handleSelectHub = (hub: string) => {
    setSelectedHub(hub);
    setVisibleCount(12);
  };

  const allHotels: Array<{
    hub: string;
    hubName: string;
    name: string;
    address: string;
    rating: number;
    reviews: number;
    priceBDT: number;
    type: string;
    image: string;
    phone: string;
    whatsapp: string;
    mapQuery: string;
    ratingSource?: string;
  }> = [];

  for (const hub of hubs) {
    const list = hotelLines[hub];
    const place = places[hub];
    for (const item of list) {
      allHotels.push({
        hub,
        hubName: place ? (isBn ? place.name_bn : place.name) : hub,
        name: item.name,
        address: item.address,
        rating: item.rating,
        reviews: item.review_count,
        priceBDT: item.price,
        type: item.hotel_type,
        image: item.photo.startsWith("/assets/") ? item.photo : "",
        ratingSource: (item as any).ratingSource,
        phone: item.phone || "+8801700000000",
        whatsapp: item.whatsapp || "8801700000000",
        mapQuery: item.map_query || encodeURIComponent(`${item.name} ${item.address}`),
      });
    }
  }

  const displayedHotels = selectedHub === "all"
    ? allHotels
    : allHotels.filter((h) => h.hub === selectedHub);

  return (
    <div className="py-12 bg-[var(--background)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] text-xs font-bold mb-3">
            <Hotel className="w-3.5 h-3.5" />
            <span>{isBn ? "আবাসন ও রিসোর্ট গাইড" : "Curated Lodging"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            {isBn ? "হোটেল ও ইকো রিসোর্টসমূহ" : "Hotels & Eco Resorts in Bangladesh"}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] mt-2">
            {isBn
              ? "কক্সবাজার, সাজেক, সিলেট, ঢাকা এবং প্রধান প্রধান পর্যটন এলাকার যাচাইকৃত হোটেল।"
              : "Hand-picked comfort and luxury stays across top destinations with curated rates."}
          </p>
        </div>

        {/* Hub filter tabs */}
        <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none touch-pan-x px-1">
          <button
            onClick={() => handleSelectHub("all")}
            className={`min-h-[40px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center justify-center shrink-0 ${
              selectedHub === "all"
                ? "bg-[#0f4a38] text-white shadow-md dark:bg-[#1f9d76]"
                : "bg-[var(--surface)] text-foreground border border-[var(--glass-border)]"
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
                    : "bg-[var(--surface)] text-foreground border border-[var(--glass-border)]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedHotels.slice(0, visibleCount).map((hotel, idx) => (
            <div
              key={idx}
              className="group flex flex-col rounded-2xl overflow-hidden bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-emerald-950/40 via-teal-900/30 to-slate-900/40 flex flex-col items-center justify-center p-4 text-center">
                {hotel.image ? (
                  <Image
                    src={hotel.image}
                    alt={hotel.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <>
                    <Hotel className="w-12 h-12 text-emerald-400/60 mb-2" />
                    <span className="text-xs font-semibold text-emerald-200/80">{hotel.type || "Hotel & Resort"}</span>
                  </>
                )}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-black/60 text-white backdrop-blur-md">
                  {hotel.hubName}
                </span>
                {(hotel as any).ratingSource && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold">
                    <Star className="w-3.5 h-3.5 text-[#f4a340] fill-[#f4a340]" />
                    <span>{hotel.rating}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-1 p-6">
                <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-[#0f4a38] dark:group-hover:text-[#2ecc71] transition-colors">
                  {hotel.name}
                </h3>
                <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5 mb-4 flex-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-[#f4a340]" />
                  <span>{hotel.address}</span>
                </p>

                <div className="pt-4 border-t border-[var(--glass-border)] flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-semibold text-[var(--text-muted)] block">
                      {isBn ? "আনুমানিক শুরু" : "From approx"}
                    </span>
                    <span className="text-base font-black text-[#0f4a38] dark:text-[#2ecc71]">
                      ৳{hotel.priceBDT.toLocaleString()}
                      <span className="text-xs font-normal text-[var(--text-muted)]">
                        /{isBn ? "রাত" : "night"}
                      </span>
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>{isBn ? "সরাসরি বুকিং" : "Direct Booking"}</span>
                  </span>
                </div>

                {/* Triple Action Bar: Direct Call, WhatsApp, Google Maps */}
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`tel:${hotel.phone}`}
                    className="min-h-[42px] px-2 py-2 rounded-xl bg-[#0f4a38]/10 hover:bg-[#0f4a38] text-[#0f4a38] hover:text-white dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] dark:hover:bg-[#1f9d76] dark:hover:text-white text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 text-center cursor-pointer shadow-sm"
                    title={isBn ? "হোটেলের রিসেপশনে সরাসরি কল করুন" : "Call Hotel Reception"}
                  >
                    <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                    <span>{isBn ? "কল করুন" : "Call"}</span>
                  </a>

                  <a
                    href={`https://wa.me/${hotel.whatsapp}?text=${encodeURIComponent(
                      isBn
                        ? `আসসালামু আলাইকুম, আমি ঘুরাঘুরি (Ghuraghuri) অ্যাপ থেকে ${hotel.name}-এ রুম বুকিং ও ভাড়ার বিষয়ে জানতে চাচ্ছি।`
                        : `Hello, I found ${hotel.name} on Ghuraghuri Travel App and want to inquire about room booking and rates.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[42px] px-2 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-600 text-emerald-700 hover:text-white dark:bg-emerald-500/25 dark:text-emerald-300 dark:hover:bg-emerald-600 dark:hover:text-white text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 text-center cursor-pointer shadow-sm"
                    title={isBn ? "হোয়াটসঅ্যাপে সরাসরি মেসেজ পাঠান" : "WhatsApp Inquiry"}
                  >
                    <MessageCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{isBn ? "মেসেজ" : "WhatsApp"}</span>
                  </a>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${hotel.mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[42px] px-2 py-2 rounded-xl bg-[var(--surface-raised)] hover:bg-[#f4a340] text-foreground hover:text-black border border-[var(--glass-border)] text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 text-center cursor-pointer shadow-sm"
                    title={isBn ? "গুগল ম্যাপে লোকেশন ও ডিরেকশন দেখুন" : "View on Google Maps"}
                  >
                    <Navigation className="w-3.5 h-3.5 shrink-0" />
                    <span>{isBn ? "ম্যাপ" : "Map"}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progressive Loading with Luxury Progress Gauge */}
        {visibleCount < displayedHotels.length ? (
          <div className="mt-14 max-w-md mx-auto text-center flex flex-col items-center gap-3.5">
            <div className="w-full flex items-center justify-between text-xs font-bold text-[var(--text-muted)] px-1">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {isBn
                    ? `${Math.min(visibleCount, displayedHotels.length)} / ${displayedHotels.length} টি হোটেল দেখাচ্ছে`
                    : `Showing ${Math.min(visibleCount, displayedHotels.length)} of ${displayedHotels.length} hotels`}
                </span>
              </span>
              <span className="text-[#0f4a38] dark:text-emerald-400 font-extrabold text-xs">
                {Math.round((Math.min(visibleCount, displayedHotels.length) / displayedHotels.length) * 100)}%
              </span>
            </div>

            <div className="w-full h-1.5 bg-[var(--surface-raised)] border border-[var(--glass-border)] rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-[#156b50] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, (Math.min(visibleCount, displayedHotels.length) / displayedHotels.length) * 100)}%` }}
              />
            </div>

            <button
              type="button"
              onClick={() => setVisibleCount((prev) => Math.min(prev + 12, displayedHotels.length))}
              className="mt-1 group px-8 py-3 rounded-2xl bg-gradient-to-r from-[#0f4a38] to-[#156b50] hover:from-[#156b50] hover:to-[#1b8061] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2.5 w-full sm:w-auto"
            >
              <Hotel className="w-4 h-4 text-emerald-300" />
              <span>
                {isBn
                  ? `আরও ১২টি হোটেল দেখুন (বাকি ${displayedHotels.length - Math.min(visibleCount, displayedHotels.length)}টি)`
                  : `Explore More Hotels (${displayedHotels.length - Math.min(visibleCount, displayedHotels.length)} remaining)`}
              </span>
              <ChevronDown className="w-4 h-4 opacity-75 group-hover:translate-y-0.5 transition-transform" />
            </button>
          </div>
        ) : displayedHotels.length > 12 ? (
          <div className="mt-12 text-center py-4">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--surface)] border border-[var(--glass-border)] text-xs font-bold text-[var(--text-muted)] shadow-sm">
              <Sparkles className="w-4 h-4 text-[#f4a340]" />
              <span>
                {isBn
                  ? `সকল ${displayedHotels.length}টি হোটেল প্রদর্শিত হয়েছে`
                  : `All ${displayedHotels.length} hotels displayed`}
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

export default function HotelsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen p-12 text-center text-sm font-semibold text-[#4e6b60]">
          Loading hotels...
        </div>
      }
    >
      <HotelsContent />
    </Suspense>
  );
}

