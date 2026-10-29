"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Compass, ShieldCheck, Heart, Globe } from "lucide-react";
import { TOTAL_DESTINATIONS, TOTAL_DISTRICTS_OFFICIAL } from "@/lib/constants";
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
              label: isBn ? "বাছাইকৃত স্পট" : "Curated Spots",
              value: isBn ? `${formatDigits(TOTAL_DESTINATIONS, true)}+` : `${TOTAL_DESTINATIONS}+`,
            },
            {
              label: isBn ? "জেলা কভারেজ" : "Districts",
              value: isBn
                ? `${formatDigits(TOTAL_DISTRICTS_OFFICIAL, true)}/${formatDigits(TOTAL_DISTRICTS_OFFICIAL, true)}`
                : `${TOTAL_DISTRICTS_OFFICIAL}/${TOTAL_DISTRICTS_OFFICIAL}`,
            },
            {
              label: isBn ? "বিভাগ" : "Divisions",
              value: isBn ? "৮" : "8",
            },
            {
              label: isBn ? "প্ল্যাটফর্ম অ্যাক্সেস" : "Access",
              value: isBn ? "উন্মুক্ত" : "Free & Open",
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
                ? "বাংলাদেশ প্রকৃতির অপরূপ সৌন্দর্যে ভরপুর। কিন্তু সঠিক তথ্যের অভাব, বিভ্রান্তিকর রুট ও ভাড়ার তথ্যের কারণে ভ্রমণপিপাসুরা প্রায়ই দ্বিধায় পড়েন। ঘুরাঘুরি এই সমস্যার সহজ ও বাস্তবসম্মত সমাধান।"
                : "Bangladesh holds astonishing natural diversity — from the rolling clouds of Sajek to the untouched mangrove waterways of the Sundarbans. Ghuraghuri was created to deliver authentic, unbiased, and accessible travel information."}
            </p>
            <p>
              {isBn
                ? "আমাদের প্ল্যাটফর্মে রয়েছে ৮টি বিভাগের ৬৪টি জেলার ২৭১টি বাছাইকৃত পর্যটন গন্তব্য, হোটেল ও খাবারের তথ্য এবং প্রাথমিক যাতায়াত রুট নির্দেশিকা।"
                : "Our platform catalogs over 270 curated destinations across all 64 districts in Bangladesh, providing travel itineraries, transit schedules, and regional culinary traditions."}
            </p>
          </div>
        </div>

        {/* Creator & Data Sources Section */}
        <div className="p-8 sm:p-10 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-foreground">
            {isBn ? "কারা বানিয়েছেন এবং তথ্যের উৎস" : "Who Made This & Where the Data Comes From"}
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-foreground/85 leading-relaxed">
            <p>
              {isBn
                ? "ঘুরাঘুরি তৈরি করেছেন সাকিব (Created by Sakib)। এটি একটি ব্যক্তিগত ও স্বাধীন উদ্যোগ, যা বাংলাদেশের পর্যটনকে সহজে খুঁজে পেতে তৈরি করা হয়েছে।"
                : "Ghuraghuri was created by Sakib as an independent passion project to make travel discovery in Bangladesh open, straightforward, and reliable."}
            </p>
            <div className="pt-2">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">
                {isBn ? "তথ্যের প্রধান উৎসসমূহ:" : "Primary Data Sources:"}
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-[var(--text-muted)]">
                <li>
                  <strong className="text-foreground">OpenStreetMap (OSM) & OSRM:</strong>{" "}
                  {isBn ? "ভৌগোলিক স্থানাঙ্ক ও হাইওয়ে রুট হিসাব।" : "Geographic coordinates and highway routing calculations."}
                </li>
                <li>
                  <strong className="text-foreground">Open-Meteo:</strong>{" "}
                  {isBn ? "লাইভ তাপমাত্রা ও আবহাওয়ার পূর্বাভাস।" : "Live temperatures and weather forecasts."}
                </li>
                <li>
                  <strong className="text-foreground">Bangladesh Railway & Transit Operators:</strong>{" "}
                  {isBn ? "প্রকাশিত ইন্টারসিটি ট্রেনের সময়সূচি ও বাস কাউন্টার তালিকা।" : "Published intercity railway timetables and transit operator helplines."}
                </li>
                <li>
                  <strong className="text-foreground">Community & Direct Research:</strong>{" "}
                  {isBn ? "স্থানীয় চালক সমিতির প্রচলিত ভাড়ার আনুমানিক রেট এবং পর্যটকদের অভিজ্ঞতা।" : "Typical fare ranges from local driver associations and curated field research."}
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-[var(--glass-border)] flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span>{isBn ? "সর্বশেষ তথ্য হালনাগাদ: অক্টোবর ২০২৬" : "Last updated: October 2026"}</span>
              <span>{isBn ? "যোগাযোগ: ghuraghuri.vercel.app" : "Contact: ghuraghuri.vercel.app"}</span>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] space-y-3">
            <div className="p-3 w-fit rounded-xl bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              {isBn ? "বাছাইকৃত তথ্য" : "Curated & Grounded"}
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {isBn
                ? "বাস্তব অবস্থান, জেলা ও ভ্রমণের সুবিধার ভিত্তিতে তথ্য যাচাই করে উপস্থাপন করা হয়।"
                : "Coordinates, estimated travel times, and tips are checked against real traveler experience."}
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
                : "Seamless translation between English and Bangla across all destinations and routes."}
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
