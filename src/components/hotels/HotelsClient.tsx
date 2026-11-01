"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import travelData from "@/data/travel-services.json";
import {
  Hotel,
  Star,
  MapPin,
  ExternalLink,
  PhoneCall,
  MessageCircle,
  Navigation,
  ChevronDown,
  Sparkles,
  ArrowUp,
} from "lucide-react";

export type Place = { name: string; name_bn: string; district?: string; division?: string };
export type HotelLine = {
  name: string;
  address: string;
  rating: number;
  review_count: number;
  price: number;
  hotel_type: string;
  photo: string;
  phone?: string;
  whatsapp?: string;
  phoneVerified?: boolean;
  website?: string;
  ratingSource?: string;
  ratingCheckedAt?: string;
  map_query?: string;
};
export type TravelServicesData = {
  hotels: Record<string, HotelLine[]>;
  places: Record<string, Place>;
};

const HOTEL_TYPE_LABELS: Record<string, { en: string; bn: string }> = {
  eco_lodge: { en: "Eco Lodge", bn: "ইকো লজ" },
  resort: { en: "Resort", bn: "রিসোর্ট" },
  cottage: { en: "Cottage", bn: "কটেজ" },
  hotel: { en: "Hotel", bn: "হোটেল" },
  guesthouse: { en: "Guest House", bn: "গেস্ট হাউস" },
};

export function formatHotelType(rawType?: string, isBn = false): string {
  if (!rawType) return isBn ? "হোটেল ও রিসোর্ট" : "Hotel & Resort";
  const key = rawType.trim().toLowerCase();
  if (HOTEL_TYPE_LABELS[key]) {
    return isBn ? HOTEL_TYPE_LABELS[key].bn : HOTEL_TYPE_LABELS[key].en;
  }
  return rawType
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const DISTRICT_TO_HUB_FALLBACK: Record<string, string> = {
  moulvibazar: "sreemangal",
  srimangal: "sreemangal",
  sreemangal: "sreemangal",
  sunamganj: "sylhet",
  habiganj: "sreemangal",
  patuakhali: "kuakata",
  barguna: "kuakata",
  bhola: "barishal",
  pirojpur: "barishal",
  jhalokati: "barishal",
  khagrachhari: "sajek-valley",
  cumilla: "chattogram",
  feni: "chattogram",
  noakhali: "chattogram",
  lakshmipur: "chattogram",
  chandpur: "chattogram",
  brahmanbaria: "chattogram",
  bagerhat: "khulna",
  satkhira: "khulna",
  jashore: "khulna",
  kushtia: "khulna",
  jhenaidah: "khulna",
  magura: "khulna",
  narail: "khulna",
  chuadanga: "khulna",
  meherpur: "khulna",
  bogura: "rajshahi",
  naogaon: "rajshahi",
  natore: "rajshahi",
  pabna: "rajshahi",
  sirajganj: "rajshahi",
  chapainawabganj: "rajshahi",
  joypurhat: "rajshahi",
  rangpur: "rajshahi",
  dinajpur: "rajshahi",
  panchagarh: "rajshahi",
  nilphamari: "rajshahi",
  kurigram: "rajshahi",
  lalmonirhat: "rajshahi",
  thakurgaon: "rajshahi",
  gaibandha: "rajshahi",
  gazipur: "dhaka",
  narayanganj: "dhaka",
  munshiganj: "dhaka",
  manikganj: "dhaka",
  narsingdi: "dhaka",
  tangail: "dhaka",
  kishoreganj: "dhaka",
  faridpur: "dhaka",
  gopalganj: "dhaka",
  madaripur: "dhaka",
  rajbari: "dhaka",
  shariatpur: "dhaka",
  mymensingh: "dhaka",
  netrokona: "dhaka",
  jamalpur: "dhaka",
  sherpur: "dhaka",
};

export function resolveHubParam(
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
    if (places[h]?.district?.toLowerCase() === p && h === slugified) return h;
  }

  for (const h of hubs) {
    if (places[h]?.district?.toLowerCase() === p) return h;
  }

  if (DISTRICT_TO_HUB_FALLBACK[p] && hubs.includes(DISTRICT_TO_HUB_FALLBACK[p])) {
    return DISTRICT_TO_HUB_FALLBACK[p];
  }
  if (DISTRICT_TO_HUB_FALLBACK[slugified] && hubs.includes(DISTRICT_TO_HUB_FALLBACK[slugified])) {
    return DISTRICT_TO_HUB_FALLBACK[slugified];
  }

  return null;
}

/**
 * Isolated search param reader inside a Suspense boundary.
 * Keeps the main page and hotel cards rendering on the server during SSG.
 */
function SearchParamsSync({
  hubs,
  places,
  onHubResolved,
}: {
  hubs: string[];
  places: Record<string, Place>;
  onHubResolved: (hub: string) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const hubParam = searchParams.get("hub") || searchParams.get("district");
    const matched = resolveHubParam(hubParam, hubs, places);
    if (matched) {
      onHubResolved(matched);
    } else if (!searchParams.get("hub") && !searchParams.get("district")) {
      onHubResolved("all");
    }
  }, [searchParams, hubs, places, onHubResolved]);

  return null;
}

export function HotelsClient() {
  const { language } = useApp();
  const isBn = language === "bn";

  const { hotels: hotelLines, places } = travelData as unknown as TravelServicesData;
  const hubs = Object.keys(hotelLines);

  const [selectedHub, setSelectedHub] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState<number>(12);

  const handleSelectHub = (hub: string) => {
    setSelectedHub(hub);
    setVisibleCount(12);
  };

  const handleHubResolved = useCallback((hub: string) => {
    setSelectedHub(hub);
    setVisibleCount(12);
  }, []);

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
    phoneVerified: boolean;
    website?: string;
    mapQuery: string;
    ratingSource?: string;
    ratingCheckedAt?: string;
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
        ratingSource: item.ratingSource,
        ratingCheckedAt: item.ratingCheckedAt,
        phone: item.phone || "",
        whatsapp: item.whatsapp || "",
        phoneVerified: item.phoneVerified === true,
        website: item.website,
        mapQuery: item.map_query || encodeURIComponent(`${item.name} ${item.address}`),
      });
    }
  }

  const displayedHotels =
    selectedHub === "all"
      ? allHotels
      : allHotels.filter((h) => h.hub === selectedHub);

  return (
    <div className="py-12 bg-[var(--background)] min-h-screen">
      {/* Invisible listener isolated inside Suspense so initial SSR HTML is never blocked */}
      <Suspense fallback={null}>
        <SearchParamsSync
          hubs={hubs}
          places={places}
          onHubResolved={handleHubResolved}
        />
      </Suspense>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Server-Rendered Semantic H1 and Short Intro */}
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
              ? "কক্সবাজার, সাজেক, সিলেট, ঢাকা এবং প্রধান পর্যটন অঞ্চলের বাছাইকৃত হোটেল, ইকো-রিসোর্ট ও গেস্ট হাউস গাইড।"
              : "Explore curated hotels, eco-resorts, and guest houses across Bangladesh with nightly rates, amenities, and Google Maps locations."}
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

        {/* Hotels Grid — All items rendered in SSR HTML for crawlability; items beyond visibleCount hidden via CSS until Load More */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedHotels.map((hotel, idx) => {
            const typeBadge = formatHotelType(hotel.type, isBn);
            const typeEn = formatHotelType(hotel.type, false);
            return (
              <div
                key={`${hotel.hub}-${hotel.name}-${idx}`}
                className={`${
                  idx >= visibleCount ? "hidden" : "flex"
                } group flex-col rounded-2xl overflow-hidden bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5`}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-emerald-950/40 via-teal-900/30 to-slate-900/40 flex flex-col items-center justify-center p-4 text-center">
                  {hotel.image ? (
                    <Image
                      src={hotel.image}
                      alt={`${hotel.name} (${typeEn}) in ${hotel.hubName}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <>
                      <Hotel className="w-12 h-12 text-emerald-400/60 mb-2" />
                      <span className="text-xs font-semibold text-emerald-200/80">
                        {typeBadge}
                      </span>
                    </>
                  )}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-black/60 text-white backdrop-blur-md">
                      {hotel.hubName}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0f4a38]/85 text-emerald-100 backdrop-blur-md border border-white/10">
                      {typeBadge}
                    </span>
                  </div>
                  {hotel.ratingSource && hotel.ratingCheckedAt && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold">
                      <Star className="w-3.5 h-3.5 text-[#f4a340] fill-[#f4a340]" />
                      <span>
                        {hotel.rating} · Rating from {hotel.ratingSource}, checked {hotel.ratingCheckedAt}
                      </span>
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
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{typeBadge}</span>
                    </span>
                  </div>

                  {/* Action Bar: Call & WhatsApp render only when phoneVerified === true; otherwise Google Maps (+ website if present) */}
                  {hotel.phoneVerified ? (
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--glass-border)]">
                      <a
                        href={`tel:${hotel.phone}`}
                        className="flex flex-col items-center justify-center p-2 rounded-xl bg-[var(--background)] hover:bg-[#0f4a38]/10 hover:text-[#0f4a38] dark:hover:text-[#2ecc71] text-xs font-semibold text-foreground transition-all duration-200 border border-[var(--glass-border)] min-h-[44px]"
                        aria-label={`Call ${hotel.name}`}
                      >
                        <PhoneCall className="w-4 h-4 mb-1 text-[#0f4a38] dark:text-[#2ecc71]" />
                        <span className="truncate w-full text-center">
                          {isBn ? "কল করুন" : "Call"}
                        </span>
                      </a>

                      <a
                        href={`https://wa.me/${hotel.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Hello, I would like to inquire about room booking at ${hotel.name}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-2 rounded-xl bg-[var(--background)] hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-semibold text-foreground transition-all duration-200 border border-[var(--glass-border)] min-h-[44px]"
                        aria-label={`WhatsApp ${hotel.name}`}
                      >
                        <MessageCircle className="w-4 h-4 mb-1 text-emerald-600 dark:text-emerald-400" />
                        <span className="truncate w-full text-center">
                          {isBn ? "হোয়াটসঅ্যাপ" : "WhatsApp"}
                        </span>
                      </a>

                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${hotel.mapQuery}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-2 rounded-xl bg-[var(--background)] hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 text-xs font-semibold text-foreground transition-all duration-200 border border-[var(--glass-border)] min-h-[44px]"
                        aria-label={`Navigate to ${hotel.name}`}
                      >
                        <Navigation className="w-4 h-4 mb-1 text-amber-500" />
                        <span className="truncate w-full text-center">
                          {isBn ? "ম্যাপ দেখুন" : "Maps"}
                        </span>
                      </a>
                    </div>
                  ) : (
                    <div
                      className={`grid ${
                        hotel.website ? "grid-cols-2" : "grid-cols-1"
                      } gap-2 pt-2 border-t border-[var(--glass-border)]`}
                    >
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${hotel.mapQuery}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[var(--background)] hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 text-xs font-semibold text-foreground transition-all duration-200 border border-[var(--glass-border)] min-h-[44px]"
                        aria-label={`View ${hotel.name} on Google Maps`}
                      >
                        <Navigation className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>{isBn ? "গুগল ম্যাপে দেখুন" : "View on Google Maps"}</span>
                      </a>
                      {hotel.website && (
                        <a
                          href={hotel.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[var(--background)] hover:bg-[#0f4a38]/10 hover:text-[#0f4a38] dark:hover:text-[#2ecc71] text-xs font-semibold text-foreground transition-all duration-200 border border-[var(--glass-border)] min-h-[44px]"
                          aria-label={`Visit website of ${hotel.name}`}
                        >
                          <ExternalLink className="w-4 h-4 text-[#0f4a38] dark:text-[#2ecc71] shrink-0" />
                          <span>{isBn ? "ওয়েবসাইট" : "Website"}</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Button or Completion Indicator */}
        {displayedHotels.length > visibleCount ? (
          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 12)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0f4a38] hover:bg-[#135d46] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer min-h-[48px] group"
            >
              <span>
                {isBn
                  ? `আরও ১২টি হোটেল দেখুন (বাকি ${
                      displayedHotels.length - visibleCount
                    }টি)`
                  : `Load More Hotels (${
                      displayedHotels.length - visibleCount
                    } remaining)`}
              </span>
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
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

