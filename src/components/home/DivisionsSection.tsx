"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Map, ArrowRight } from "lucide-react";
import { formatDigits } from "@/lib/i18n";
import { DIVISION_COUNTS } from "@/lib/constants";

const DIVISIONS_DATA = [
  {
    name: "Chattogram",
    name_bn: "চট্টগ্রাম",
    tagline: "Beaches, Hills & Marine Drive",
    tagline_bn: "সৈকত, পাহাড় ও মেরিন ড্রাইভ",
    image: "/assets/destinations/coxs-bazar.webp",
  },
  {
    name: "Sylhet",
    name_bn: "সিলেট",
    tagline: "Tea Gardens, Waterfalls & Haors",
    tagline_bn: "চা বাগান, ঝরনা ও হাওর",
    image: "/assets/destinations/srimangal.webp",
  },
  {
    name: "Khulna",
    name_bn: "খুলনা",
    tagline: "Sundarbans & Sixty Dome Mosque",
    tagline_bn: "সুন্দরবন ও ষাট গম্বুজ মসজিদ",
    image: "/assets/destinations/sundarbans.webp",
  },
  {
    name: "Barishal",
    name_bn: "বরিশাল",
    tagline: "Rivers, Guava Markets & Kuakata",
    tagline_bn: "নদী, ভাসমান পেয়ারা বাজার ও কুয়াকাটা",
    image: "/assets/destinations/kuakata.webp",
  },
  {
    name: "Dhaka",
    name_bn: "ঢাকা",
    tagline: "Palaces, Heritage & Vibrant Culture",
    tagline_bn: "ঐতিহাসিক প্রাসাদ ও জীবন্ত সংস্কৃতি",
    image: "/assets/destinations/ahsan-manzil.webp",
  },
  {
    name: "Rajshahi",
    name_bn: "রাজশাহী",
    tagline: "Silk, Mango Orchards & Terracotta",
    tagline_bn: "রেশম, আমবাগান ও প্রাচীন টেরাকোটা",
    image: "/assets/destinations/puthia-temple-complex.webp",
  },
  {
    name: "Rangpur",
    name_bn: "রংপুর",
    tagline: "Tajhat Palace & Teesta River",
    tagline_bn: "তাজহাট জমিদার বাড়ি ও তিস্তা নদী",
    image: "/assets/destinations/tajhat-palace.webp",
  },
  {
    name: "Mymensingh",
    name_bn: "ময়মনসিংহ",
    tagline: "Garo Hills & Brahmaputra Char",
    tagline_bn: "গারো পাহাড় ও ব্রহ্মপুত্র চর",
    image: "/assets/destinations/birishiri.webp",
  },
];

export function DivisionsSection() {
  const { language } = useApp();
  const isBn = language === "bn";

  return (
    <section className="py-20 bg-[var(--surface)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4a340]/10 text-[#d97706] text-xs font-bold mb-3">
            <Map className="w-3.5 h-3.5 text-[#f4a340]" />
            <span>{isBn ? "বাংলাদেশের মানচিত্র" : "Geography & Territory"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            {isBn ? "৮টি বিভাগ অনুযায়ী ভ্রমণ করুন" : "Explore by Division"}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] mt-2 max-w-xl">
            {isBn
              ? "বাংলাদেশের প্রতিটি বিভাগের নিজস্ব অনন্য রূপ, প্রকৃতি ও ঐতিহ্য রয়েছে।"
              : "Every division holds distinct ecosystems, landscapes, and stories waiting to be experienced."}
          </p>
        </div>

        {/* Divisions Cards Grid: 2-column on mobile (~150px height), 2-col on tablet, 4-col on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {DIVISIONS_DATA.map((division) => {
            const count = DIVISION_COUNTS[division.name];
            if (count === undefined && process.env.NODE_ENV !== "production") {
              console.warn(
                `[DivisionsSection] Missing destination count for division key: "${division.name}"`
              );
            }
            const displayCount = count ?? 0;

            return (
              <Link
                key={division.name}
                href={`/destinations/division/${division.name.toLowerCase()}`}
                prefetch={false}
                className="group relative h-[150px] sm:h-72 rounded-2xl overflow-hidden border border-[var(--glass-border)] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Image
                  src={division.image}
                  alt={
                    isBn
                      ? `${division.name_bn || division.name} বিভাগ — ${formatDigits(displayCount, true)}টি পর্যটন স্পট দেখুন`
                      : `${division.name} Division scenic view — Explore ${displayCount} destinations`
                  }
                  fill
                  sizes="(max-width: 640px) 175px, (max-width: 1024px) 25vw, 300px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* WCAG AA Compliant High-Contrast Scrim Overlay */}
                <div
                  className="absolute inset-0 z-[1] pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(3,16,12,0.92) 0%, rgba(3,16,12,0.62) 42%, rgba(3,16,12,0) 78%)",
                  }}
                />

                {/* Destination Count Tag: Solid pill for guaranteed legibility across any bright image */}
                <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#03100c]/90 backdrop-blur-sm text-white text-[11px] sm:text-xs font-bold border border-white/20 shadow-md z-[2]">
                  {isBn ? `${formatDigits(displayCount, true)} টি স্পট` : `${displayCount} spots`}
                </div>

              {/* Division Title & Tagline */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 text-white z-[2]">
                <h3 className="text-sm sm:text-xl font-bold tracking-tight mb-0.5 sm:mb-1 text-white group-hover:text-[#f4a340] transition-colors flex items-center justify-between">
                  <span>{isBn ? division.name_bn : division.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-[11px] sm:text-xs text-[rgba(255,255,255,0.85)] line-clamp-2">
                  {isBn ? division.tagline_bn : division.tagline}
                </p>
              </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
