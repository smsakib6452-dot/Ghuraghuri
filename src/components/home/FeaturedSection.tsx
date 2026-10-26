"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Destination } from "@/types/destination";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { ArrowRight, Flame } from "lucide-react";
import { TOTAL_DESTINATIONS } from "@/lib/constants";
import { formatNumberEnBn } from "@/lib/utils";

interface FeaturedSectionProps {
  destinations: Destination[];
}

export function FeaturedSection({ destinations }: FeaturedSectionProps) {
  const { language } = useApp();
  const isBn = language === "bn";
  const [selectedTab, setSelectedTab] = useState<string>("all");

  const categories = [
    { id: "all", label: isBn ? "সব জনপ্রিয়" : "All Popular" },
    { id: "Beach", label: isBn ? "সৈকত ও দ্বীপ" : "Beaches & Islands" },
    { id: "Hill", label: isBn ? "পাহাড় ও চূড়া" : "Hills & Peaks" },
    { id: "Waterfall", label: isBn ? "ঝরনা ও জলপ্রপাত" : "Waterfalls" },
    { id: "Historical", label: isBn ? "ঐতিহাসিক ও ঐতিহ্য" : "Heritage" },
  ];

  // Filter curated destinations
  const topDestinations = destinations.filter((d) => {
    if (selectedTab === "all") return d.featured || d.popularity === "high";
    if (selectedTab === "Beach") return d.category === "Beach" || d.category === "Island";
    if (selectedTab === "Hill") return d.category === "Hill" || d.category === "Mountain";
    if (selectedTab === "Waterfall") return d.category === "Waterfall";
    if (selectedTab === "Historical") return d.category === "Historical" || d.category === "Archaeological" || d.category === "Heritage";
    return true;
  }).slice(0, 8);

  return (
    <section className="py-20 bg-[var(--surface-raised)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#047857]/10 text-[#047857] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] text-xs font-bold mb-3">
              <Flame className="w-3.5 h-3.5 text-[#f4a340] fill-[#f4a340]" />
              <span>{isBn ? "শীর্ষ পছন্দের স্থানসমূহ" : "Curated Explorer Picks"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              {isBn ? "জনপ্রিয় ভ্রমণ গন্তব্য" : "Most Loved Destinations"}
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] mt-2 max-w-xl">
              {isBn
                ? "ভ্রমণপিপাসুদের জন্য নির্বাচিত সেরা দর্শনীয় স্থান ও খাঁটি ভ্রমণ নির্দেশিকা।"
                : "Handcrafted collection of iconic travel spots across Bangladesh with verified routes and guides."}
            </p>
          </div>

          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#047857] dark:text-[#2ecc71] hover:underline"
          >
            <span>
              {isBn
                ? `সব ${formatNumberEnBn(TOTAL_DESTINATIONS, true)}+ গন্তব্য দেখুন`
                : `View All ${TOTAL_DESTINATIONS}+ Spots`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Tabs: Horizontal scroll with proximity snap and right fade affordance */}
        <div className="relative mb-8">
          <div className="flex items-center gap-2 overflow-x-auto overscroll-contain snap-x snap-proximity px-4 sm:px-0 -mx-4 sm:mx-0 scroll-px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex-none snap-start min-h-[40px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center justify-center ${
                  selectedTab === tab.id
                    ? "bg-[#0f4a38] text-white shadow-md dark:bg-[#1f9d76]"
                    : "bg-[var(--surface)] text-foreground border border-[var(--glass-border)] hover:bg-[#0f4a38]/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <div className="w-5 shrink-0 sm:hidden" aria-hidden="true" />
          </div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-[var(--surface-raised)] to-transparent sm:hidden" />
        </div>

        {/* Destination Cards: Horizontal swipe row on mobile (<640px), 8pt grid on tablet/desktop */}
        <div className="relative">
          <div className="flex overflow-x-auto overscroll-contain snap-x snap-proximity px-4 sm:px-0 -mx-4 sm:mx-0 scroll-px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 sm:overflow-visible">
            {topDestinations.map((dest) => (
              <div key={dest.id} className="flex-none w-[80vw] max-w-[320px] snap-start sm:w-auto sm:max-w-none">
                <DestinationCard destination={dest} />
              </div>
            ))}
            <div className="w-4 shrink-0 sm:hidden" aria-hidden="true" />
          </div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-[var(--surface-raised)] to-transparent sm:hidden" />
        </div>
      </div>
    </section>
  );
}
