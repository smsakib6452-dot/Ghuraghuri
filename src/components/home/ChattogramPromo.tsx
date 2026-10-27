"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Sparkles, ArrowRight, Compass, Camera } from "lucide-react";

export function ChattogramPromo() {
  const { language } = useApp();
  const isBn = language === "bn";

  return (
    <section className="py-12 bg-[var(--background)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b3d2e] via-[#0f4a38] to-[#06241b] border border-white/10 shadow-xl">
          {/* Subtle Ambient Background Artwork */}
          <div className="absolute right-0 top-0 bottom-0 w-full lg:w-1/2 opacity-35 lg:opacity-60 pointer-events-none">
            <Image
              src="/assets/destinations/patenga-beach.webp"
              alt="Chattogram Patenga Beach Horizon"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b3d2e] via-[#0b3d2e]/80 to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#f4a340] text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {isBn
                  ? "ইন্টারেক্টিভ স্পেশাল স্টুডিও · Interactive Feature"
                  : "Interactive Studio · Chattogram Edition"}
              </span>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                {isBn
                  ? "চট্টগ্রাম পোস্টার স্টুডিও ও পর্যটন ডিরেক্টরি"
                  : "Chattogram: Queen of the East & Poster Studio"}
              </h2>
              <p className="text-sm sm:text-base text-[#a3c4b6] leading-relaxed">
                {isBn
                  ? "পতেঙ্গা সমুদ্রসৈকত, সীতাকুণ্ডের ট্রেকিং ট্রেইল থেকে বায়েজিদ বোস্তামীর পবিত্র মাজার—১০৫+ স্পট ঘুরে দেখুন এবং আপনার ভ্রমণের ডিজিটাল রেট্রো পোস্টার তৈরি করুন।"
                  : "Explore 105+ hand-curated spots across the port city, generate retro travel posters with your itinerary, and calculate live road corridors."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/chattogram"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#f4a340] hover:bg-[#e67e22] text-black font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>{isBn ? "চট্টগ্রাম স্টুডিও খুলুন" : "Open Chattogram Studio"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/destinations?division=Chattogram"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/15 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Compass className="w-4 h-4 text-[#2ecc71]" />
                <span>{isBn ? "সকল চট্টগ্রামের স্থান" : "Browse All Spots"}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
