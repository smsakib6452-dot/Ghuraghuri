"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  Compass,
  ArrowRight,
  Mountain,
  Sun,
  Trees,
  Landmark,
  Waves,
  Palmtree,
  Sailboat,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { TOTAL_DESTINATIONS } from "@/lib/constants";
import { formatNumberEnBn } from "@/lib/utils";
import { formatDigits } from "@/lib/i18n";

const EXPERIENCE_COUNTS: Record<string, number> = {
  Hill: 8,
  Beach: 13,
  Waterfall: 15,
  Forest: 13,
  Haor: 4,
  Historical: 104,
  Island: 15,
  Religious: 16,
};

interface ExperienceItem {
  key: string;
  category: string;
  icon: LucideIcon;
  name_en: string;
  name_bn: string;
  desc_en: string;
  desc_bn: string;
  gradient: string;
}

const EXPERIENCES: ExperienceItem[] = [
  {
    key: "hills",
    category: "Hill",
    icon: Mountain,
    name_en: "Hills & Peaks",
    name_bn: "পাহাড় ও মেঘের রাজ্য",
    desc_en: "Highland peaks, floating clouds, and breathtaking viewpoints in Sajek & Bandarban.",
    desc_bn: "মেঘের ভেলা, সবুজ উপত্যকা আর রোমাঞ্চকর পাহাড়ি ট্রেইল।",
    gradient: "from-emerald-900/40 via-emerald-800/20 to-transparent",
  },
  {
    key: "beaches",
    category: "Beach",
    icon: Sun,
    name_en: "Beaches & Coast",
    name_bn: "সমুদ্র ও সোনালী সৈকত",
    desc_en: "World's longest unbroken sands, sunset points, and ocean surf from Cox's Bazar to Kuakata.",
    desc_bn: "বিশ্বের দীর্ঘতম ১২০ কিমি বালুকাময় সৈকত ও রক্তিম সূর্যাস্ত।",
    gradient: "from-amber-900/40 via-amber-800/20 to-transparent",
  },
  {
    key: "forests",
    category: "Forest",
    icon: Trees,
    name_en: "Forests",
    name_bn: "বন ও গভীর ম্যানগ্রোভ",
    desc_en: "Sundarbans UNESCO World Heritage, Lawachara rainforest, and wildlife biodiversity.",
    desc_bn: "রয়েল বেঙ্গল টাইগারের সুন্দরবন ও লাউয়াছড়ার জীববৈচিত্র্য।",
    gradient: "from-green-900/40 via-green-800/20 to-transparent",
  },
  {
    key: "heritage",
    category: "Heritage",
    icon: Landmark,
    name_en: "Heritage",
    name_bn: "ঐতিহ্য ও প্রত্নতত্ত্ব",
    desc_en: "Centuries-old zamindar palaces, terracotta temples, and Buddhist viharas.",
    desc_bn: "পাহাড়পুর বৌদ্ধবিহার, কান্তজীউ মন্দির ও ঐতিহাসিক রাজপ্রাসাদ।",
    gradient: "from-orange-900/40 via-orange-800/20 to-transparent",
  },
  {
    key: "waterfalls",
    category: "Waterfall",
    icon: Waves,
    name_en: "Waterfalls",
    name_bn: "ঝরনা ও পাথুরে ক্যাসকেড",
    desc_en: "Hidden mountain springs, crystal streams, and thrilling hidden cascades.",
    desc_bn: "নাফাকুম, মাধবকুণ্ড ও দামতুয়ার গর্জনমুখর নীল জলরাশি।",
    gradient: "from-cyan-900/40 via-cyan-800/20 to-transparent",
  },
  {
    key: "islands",
    category: "Island",
    icon: Palmtree,
    name_en: "Islands & Reefs",
    name_bn: "দ্বীপ ও প্রবাল সৈকত",
    desc_en: "Turquoise lagoons, coconut groves, and tranquil horizons at Saint Martin and Manpura.",
    desc_bn: "স্বচ্ছ নীল সমুদ্রের প্রবাল প্রাচীর ও নারিকেল জিঞ্জিরা।",
    gradient: "from-blue-900/40 via-blue-800/20 to-transparent",
  },
  {
    key: "wetlands",
    category: "Haor",
    icon: Sailboat,
    name_en: "Wetlands & Rivers",
    name_bn: "হাওর ও শান্ত জলাভূমি",
    desc_en: "Vast inland freshwater seas, luxury houseboats, and migratory birds in Tanguar Haor.",
    desc_bn: "টাঙ্গুয়ার হাওরের মেঘালয় সীমান্ত আর রাজকীয় হাউসবোট ক্রুজ।",
    gradient: "from-sky-900/40 via-sky-800/20 to-transparent",
  },
  {
    key: "spiritual",
    category: "Religious",
    icon: Sparkles,
    name_en: "Spiritual Sites",
    name_bn: "আধ্যাত্মিক ও পবিত্র মাজার",
    desc_en: "Sufi shrines of Shah Jalal, historic mosques of Bagerhat, and sacred pilgrimage sites.",
    desc_bn: "হযরত শাহজালাল (র.) মাজার ও ষাট গম্বুজ ঐতিহাসিক মসজিদ।",
    gradient: "from-teal-900/40 via-teal-800/20 to-transparent",
  },
];

export function ExperienceSection() {
  const { language } = useApp();
  const isBn = language === "bn";

  const getCount = (cat: string) => {
    return EXPERIENCE_COUNTS[cat] || 0;
  };

  return (
    <section id="experience" className="py-20 bg-[var(--surface)] border-t border-[var(--glass-border)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#047857]/10 text-[#047857] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] text-xs font-bold mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>{isBn ? "আপনার মতো ভ্রমণ" : "Explore Your Way"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            {isBn ? "পছন্দের ভ্রমণ অনুভূতি বেছে নিন" : "Choose Your Kind of Journey"}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] mt-2">
            {isBn
              ? "পাহাড়ের মেঘ, সমুদ্রের ঢেউ, সবুজ রেইনফরেস্ট কিংবা প্রাচীন স্থাপত্য—যেকোনো অভিজ্ঞতায় সরাসরি প্রবেশ করুন।"
              : "From highland mist and rolling tea hills to coastal horizons and sacred heritage trails."}
          </p>
        </div>

        {/* 8 Experience Cards Grid: Single column on <=360px, 2-col on 361px-1023px, 4-col on desktop */}
        <div className="grid grid-cols-1 min-[361px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 items-stretch">
          {EXPERIENCES.map((exp) => {
            const count = getCount(exp.category);
            const Icon = exp.icon;
            return (
              <Link
                key={exp.key}
                href={`/destinations?category=${encodeURIComponent(exp.category)}`}
                className="group relative p-3.5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[var(--surface-raised)] border border-[var(--glass-border)] hover:border-[#047857]/40 dark:hover:border-[#2ecc71]/40 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden h-full"
              >
                {/* Glow Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${exp.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative z-10 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-2.5 sm:mb-4">
                    <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] group-hover:scale-110 transition-transform flex items-center justify-center text-[#047857] dark:text-[#2ecc71]">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.75} />
                    </div>
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold bg-[#047857]/10 text-[#047857] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71]">
                      {formatDigits(count, isBn)} {isBn ? "টি স্থান" : "places"}
                    </span>
                  </div>

                  {/* Equalized Title Block with min-height: 2.6em, 2-line clamp and balanced text */}
                  <div className="min-h-[2.6em] flex items-center mb-1 sm:mb-2">
                    <h3
                      className="font-bold text-foreground group-hover:text-[#047857] dark:group-hover:text-[#2ecc71] transition-colors leading-[1.25] text-balance line-clamp-2"
                      style={{ fontSize: "clamp(15px, 4.2vw, 17px)" }}
                    >
                      {isBn ? exp.name_bn : exp.name_en}
                    </h3>
                  </div>

                  <p className="text-[11px] sm:text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                    {isBn ? exp.desc_bn : exp.desc_en}
                  </p>
                </div>

                {/* Bottom Action Row: Pinned with mt-auto */}
                <div className="relative z-10 pt-2.5 sm:pt-4 mt-auto border-t border-[var(--glass-border)] flex items-center justify-between text-[11px] sm:text-xs font-bold text-[#047857] dark:text-[#2ecc71]">
                  <span>{isBn ? "স্থানগুলো দেখুন" : "Browse Category"}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
