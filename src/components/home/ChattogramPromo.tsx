"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Sparkles, ArrowRight, Wand2 } from "lucide-react";

export function ChattogramPromo() {
  const { language } = useApp();
  const isBn = language === "bn";

  return (
    <section className="py-8 sm:py-10 bg-[var(--background)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#06241b] via-[#0b3d2e] to-[#041913] border border-white/15 shadow-xl">
          {/* Subtle Ambient Light Glow */}
          <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#10b981]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-[#f4a340]/10 blur-3xl" />

          <div className="relative z-10 p-5 sm:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6 lg:gap-10">
            {/* Left Content Column */}
            <div className="flex-1 space-y-3.5 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#f4a340] text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {isBn ? "ইন্টারেক্টিভ ট্রাভেল স্টুডিও" : "Interactive Travel Studio"}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-snug">
                {isBn ? "বানিয়ে নিন নিজের চট্টগ্রাম পোস্টার" : "Make your own Chattogram poster"}
              </h2>

              <p className="text-xs sm:text-sm text-[#b2d5c6] leading-relaxed max-w-xl">
                {isBn
                  ? "পতেঙ্গা থেকে সাজেক রোডের স্মৃতি সাজিয়ে তৈরি করুন চমৎকার রেট্রো পোস্টার।"
                  : "Craft custom vintage travel posters with your favorite spots in Chattogram and download in HD."}
              </p>

              <div className="pt-1.5 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Link
                  href="/chattogram"
                  className="inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 rounded-2xl bg-[#f4a340] hover:bg-[#e67e22] text-black font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer min-h-[42px]"
                >
                  <Wand2 className="w-4 h-4 shrink-0" />
                  <span>{isBn ? "পোস্টার তৈরি করুন" : "Create Poster"}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              </div>
            </div>

            {/* Right Preview Poster Column */}
            <Link
              href="/chattogram"
              className="group relative shrink-0 block cursor-pointer transition-transform duration-300 hover:scale-105"
              aria-label={isBn ? "চট্টগ্রাম পোস্টার স্টুডিও দেখুন" : "View Chattogram Poster Studio"}
            >
              <div className="relative w-44 h-28 sm:w-56 sm:h-36 lg:w-64 lg:h-40 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black/40">
                <Image
                  src="/og-chattogram.jpg"
                  alt={
                    isBn
                      ? "চট্টগ্রাম রেট্রো ট্রাভেল পোস্টার স্টুডিও প্রিভিউ"
                      : "Chattogram Vintage Travel Poster Studio Preview"
                  }
                  fill
                  sizes="(max-width: 640px) 176px, (max-width: 1024px) 224px, 256px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                
                {/* Vintage Poster Tag */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-bold text-white/95">
                  <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm border border-white/20">
                    {isBn ? "রেট্রো স্টুডিও" : "Retro Studio"}
                  </span>
                  <span className="text-[#f4a340] flex items-center gap-0.5">
                    <span>{isBn ? "খুলুন" : "Open"}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
