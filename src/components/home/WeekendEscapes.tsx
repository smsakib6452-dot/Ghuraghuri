"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  Compass,
  Clock,
  Wallet,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
} from "lucide-react";

interface ItineraryItem {
  id: string;
  title: string;
  title_bn: string;
  tagline: string;
  tagline_bn: string;
  duration: string;
  duration_bn: string;
  estCost: string;
  estCost_bn: string;
  route: string;
  route_bn: string;
  badges: string[];
  badges_bn: string[];
  image: string;
  link: string;
}

const WEEKEND_TRIPS: ItineraryItem[] = [
  {
    id: "sajek-cloud",
    title: "Sajek Cloud Ridge Escape",
    title_bn: "৩ দিনের সাজেক ক্লাউড এস্কেপ",
    tagline: "Wake up above floating sea of clouds, trek Konglak Peak, and explore Alutila Cave.",
    tagline_bn: "মেঘের ভেলায় ভেসে চলা, কংলাক পাহাড়ের চূড়া ও আলুটিলা রহস্যময় গুহা অভিযান।",
    duration: "3 Days / 2 Nights",
    duration_bn: "৩ দিন / ২ রাত",
    estCost: "৳6,500 / person",
    estCost_bn: "৳৬,৫০০ / জন",
    route: "Dhaka ➔ Khagrachhari ➔ Sajek Valley ➔ Dighinala",
    route_bn: "ঢাকা ➔ খাগড়াছড়ি ➔ সাজেক ভ্যালি ➔ দীঘিনালা",
    badges: ["☁️ Sea of Clouds", "🏕️ Wooden Cottage", "🚙 4x4 Chander Gari"],
    badges_bn: ["☁️ মেঘের ভেলা", "🏕️ কাঠের কটেজ", "🚙 ৪x৪ জিপ"],
    image: "/assets/destinations/sajek-valley.webp",
    link: "/destinations/sajek-valley",
  },
  {
    id: "coxs-marine",
    title: "Cox's Bazar & Marine Drive Relax",
    title_bn: "৪ দিনের কক্সবাজার ও মেরিন ড্রাইভ রিল্যাক্স",
    tagline: "World's longest beach, sunset dinners, fresh Rupchanda seafood BBQ, and Marine Drive.",
    tagline_bn: "বিশ্বের দীর্ঘতম সমুদ্র সৈকত, মেরিন ড্রাইভের বাতাস, ইনানী প্রবাল ও তাজা সীফুড বারবিকিউ।",
    duration: "4 Days / 3 Nights",
    duration_bn: "৪ দিন / ৩ রাত",
    estCost: "৳8,500 / person",
    estCost_bn: "৳৮,৫০০ / জন",
    route: "Dhaka ➔ Direct Express Train ➔ Cox's Bazar ➔ Inani Beach",
    route_bn: "ঢাকা ➔ এক্সপ্রেস ট্রেন ➔ কক্সবাজার ➔ ইনানী ও পাটুয়ারটেক",
    badges: ["🏖️ Ocean Waves", "🚆 Direct Train", "🦐 Rupchanda BBQ"],
    badges_bn: ["🏖️ নীল জলরাশি", "🚆 সরাসরি ট্রেন", "🦐 রূপচাঁদা ফ্রাই"],
    image: "/assets/destinations/coxs-bazar.webp",
    link: "/destinations/coxs-bazar",
  },
  {
    id: "sreemangal-tea",
    title: "Sreemangal Tea Valley Trail",
    title_bn: "২ দিনের শ্রীমঙ্গল চা বাগান ও রেইনফরেস্ট ট্রেইল",
    tagline: "Rolling tea gardens, Lawachara gibbons, Madhabpur lake, and original 7-layer tea.",
    tagline_bn: "সবুজ চা বাগান সাইক্লিং, লাউয়াছড়া রেইনফরেস্টের নিস্তব্ধতা ও রমেশ রামের ৭ রঙের চা।",
    duration: "2 Days / 1 Night",
    duration_bn: "২ দিন / ১ রাত",
    estCost: "৳4,200 / person",
    estCost_bn: "৳৪,২০০ / জন",
    route: "Dhaka ➔ Parabat Express ➔ Sreemangal Town ➔ Kamalganj",
    route_bn: "ঢাকা ➔ পারাবত এক্সপ্রেস ➔ শ্রীমঙ্গল ➔ কমলগঞ্জ",
    badges: ["🍵 Tea Gardens", "🌲 Rainforest Trail", "☕ 7-Layer Tea"],
    badges_bn: ["🍵 চা বাগান", "🌲 রেইনফরেস্ট", "☕ ৭ রঙের চা"],
    image: "/assets/destinations/srimangal.webp",
    link: "/destinations/lawachara-national-park",
  },
];

export function WeekendEscapes() {
  const { language } = useApp();
  const isBn = language === "bn";

  return (
    <section className="py-20 bg-[var(--background)] border-t border-[var(--glass-border)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f4a340]/10 text-[#f4a340] border border-[#f4a340]/25 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isBn ? "স্মার্ট ভ্রমণ পরিকল্পনা" : "Curated Trip Itineraries"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              {isBn ? "উইকএন্ড এস্কেপ ও রেডিমেড ট্রিপ আইডিয়া" : "Ready-Made Weekend Getaways"}
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] mt-2 max-w-xl">
              {isBn
                ? "ছুটিতে কোথায় যাবেন ভাবছেন? সময়কাল, সম্ভাব্য বাজেট ও সাজানো রুটসহ ভ্রমণের সেরা পরিকল্পনা।"
                : "Handcrafted weekend plans with verified travel routes, realistic expense estimates, and lodging."}
            </p>
          </div>

          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#047857] dark:text-[#2ecc71] hover:underline"
          >
            <span>{isBn ? "সকল দর্শনীয় স্থান দেখুন" : "Explore All Destinations"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Escapes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {WEEKEND_TRIPS.map((trip) => (
            <div
              key={trip.id}
              className="group flex flex-col rounded-3xl overflow-hidden bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex-1"
            >
              {/* Image & Badges */}
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={trip.image}
                  alt={trip.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                
                {/* Duration Tag */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-black/60 text-white backdrop-blur-md border border-white/20">
                  <Clock className="w-3.5 h-3.5 text-[#f4a340]" />
                  <span>{isBn ? trip.duration_bn : trip.duration}</span>
                </div>

                {/* Est Cost Tag */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-600/90 text-white backdrop-blur-md shadow-md">
                  <Wallet className="w-3.5 h-3.5" />
                  <span>{isBn ? trip.estCost_bn : trip.estCost}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-col flex-1 p-6">
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-[#0f4a38] dark:group-hover:text-[#2ecc71] transition-colors line-clamp-2">
                  {isBn ? trip.title_bn : trip.title}
                </h3>

                <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-4">
                  {isBn ? trip.tagline_bn : trip.tagline}
                </p>

                {/* Route Segment */}
                <div className="p-3 rounded-2xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-xs mb-4">
                  <span className="text-[var(--text-muted)] block font-semibold text-[11px] mb-1">
                    🛣️ {isBn ? "প্রস্তাবিত রুট করিডোর:" : "Suggested Route Corridor:"}
                  </span>
                  <span className="font-bold text-foreground line-clamp-2">
                    {isBn ? trip.route_bn : trip.route}
                  </span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-1.5 mb-6">
                  {(isBn ? trip.badges_bn : trip.badges).map((b) => (
                    <span
                      key={b}
                      className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[var(--surface-raised)] border border-[var(--glass-border)] text-foreground"
                    >
                      {b}
                    </span>
                  ))}
                </div>

                {/* Action Link */}
                <div className="mt-auto pt-4 border-t border-[var(--glass-border)] flex items-center justify-between">
                  <span className="text-xs text-[var(--text-muted)] font-medium">
                    {isBn ? "যাচাইকৃত গাইডলাইন" : "Verified Itinerary"}
                  </span>
                  <Link
                    href={trip.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#047857] dark:text-[#2ecc71] group-hover:translate-x-1 transition-transform"
                  >
                    <span>{isBn ? "প্ল্যানটি দেখুন" : "View Plan"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
