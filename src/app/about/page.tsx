"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Compass, ShieldCheck, Heart, Globe } from "lucide-react";
import { TOTAL_DESTINATIONS } from "@/lib/constants";
import { formatDigits } from "@/lib/i18n";

export default function AboutPage() {
  const { language } = useApp();
  const isBn = language === "bn";

  return (
    <div className="py-16 bg-[var(--background)] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Banner */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] text-xs font-bold">
            <Compass className="w-3.5 h-3.5" />
            <span>{isBn ? "আমাদের লক্ষ্য ও দৃষ্টিভঙ্গি" : "Our Mission & Vision"}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
            {isBn ? "ঘুরাঘুরি — বাংলাদেশের রূপ আবিষ্কার" : "About Ghuraghuri Travel Explorer"}
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            {isBn
              ? "বাংলাদেশের পর্যটন শিল্পকে ডিজিটাল বিশ্বের শীর্ষে তুলে ধরতে তৈরি করা একটি আধুনিক ও ওপেন ট্রাভেল ইকোসিস্টেম।"
              : "An open, high-performance digital ecosystem empowering travelers to discover authentic Bangladesh."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            {
              label: isBn ? "যাচাইকৃত স্পট" : "Curated Spots",
              value: isBn ? `${formatDigits(TOTAL_DESTINATIONS, true)}+` : `${TOTAL_DESTINATIONS}+`,
            },
            {
              label: isBn ? "জেলা কভারেজ" : "Districts",
              value: isBn ? "৬৪/৬৪" : "64/64",
            },
            {
              label: isBn ? "বিভাগ" : "Divisions",
              value: isBn ? "৮" : "8",
            },
            {
              label: isBn ? "ব্যবহারকারী রেটিং" : "Satisfaction",
              value: isBn ? "৪.৮★" : "4.8★",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] text-center shadow-sm"
            >
              <span className="text-3xl sm:text-4xl font-black text-[#0f4a38] dark:text-[#2ecc71] block mb-1">
                {stat.value}
              </span>
              <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="p-8 sm:p-10 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-foreground">
            {isBn ? "কেন ঘুরাঘুরি?" : "Why Ghuraghuri Was Built"}
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-foreground/85 leading-relaxed">
            <p>
              {isBn
                ? "বাংলাদেশ প্রকৃতির অপরূপ সৌন্দর্যে ভরপুর। কিন্তু সঠিক তথ্যের অভাব, বিভ্রান্তিকর রুট ও ভাড়ার তথ্যের কারণে ভ্রমণপিপাসুরা প্রায়ই দ্বিধায় পড়েন। ঘুরাঘুরি এই সমস্যার আধুনিক ও নির্ভরযোগ্য সমাধান।"
                : "Bangladesh holds astonishing natural diversity — from the rolling clouds of Sajek to the untouched mangrove waterways of the Sundarbans. Ghuraghuri was created to deliver authentic, unbiased, and high-speed travel intelligence."}
            </p>
            <p>
              {isBn
                ? "আমাদের প্ল্যাটফর্মে রয়েছে ৮টি বিভাগের ৬৪টি জেলার ২৭১টি প্রমাণিত পর্যটন গন্তব্য, হোটেল গাইড, আঞ্চলিক খাবারের ঐতিহ্য এবং সুস্পষ্ট যাতায়াত রুট।"
                : "Built with cutting-edge web architecture (Next.js App Router, Tailwind CSS, and Supabase), Ghuraghuri guarantees ultra-fast load times, WCAG AAA accessibility, and flawless mobile experience."}
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] space-y-3">
            <div className="p-3 w-fit rounded-xl bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {isBn ? "১০০% যাচাইকৃত তথ্য" : "100% Curated Truth"}
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {isBn
                ? "কোনো ফেক বা বিভ্রান্তিকর তথ্য নেই — বাস্তব অবস্থান ও অভিজ্ঞতার সমন্বয়।"
                : "Every coordinate, timing, and rate is grounded in verified traveler experiences."}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] space-y-3">
            <div className="p-3 w-fit rounded-xl bg-[#f4a340]/10 text-[#d97706]">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {isBn ? "দ্বিভাষিক প্ল্যাটফর্ম" : "Bilingual Accessibility"}
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {isBn
                ? "বাংলা ও ইংরেজি উভয় ভাষায় নিরবচ্ছিন্ন ভ্রমণ অভিজ্ঞতা।"
                : "Seamless translation between English and Bangla with screen-reader readiness."}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] space-y-3">
            <div className="p-3 w-fit rounded-xl bg-[#2ecc71]/10 text-[#2ecc71]">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {isBn ? "সবার জন্য উন্মুক্ত" : "Free for Everyone"}
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {isBn
                ? "ভ্রমণপ্রেমী সম্প্রদায়ের জন্য সম্পূর্ণ বিনামূল্যে উন্মুক্ত প্ল্যাটফর্ম।"
                : "A community-focused open initiative supporting local tourism and eco-travel."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
