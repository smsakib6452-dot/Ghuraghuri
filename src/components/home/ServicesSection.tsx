"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  Hotel,
  UtensilsCrossed,
  Bus,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { TRAVEL_HUB_REMOTE_IMAGES } from "@/data/remote-images";

export function ServicesSection() {
  const { language } = useApp();
  const isBn = language === "bn";

  const services = [
    {
      title: isBn ? "হোটেল ও ইকো রিসোর্ট" : "Hotels & Eco Resorts",
      desc: isBn
        ? "সাজেক, কক্সবাজার, শ্রীমঙ্গল ও সিলেটের সেরা মানের স্থানীয় ও লাক্সারি আবাসন।"
        : "Curated stays from tranquil hill-top bamboo cottages to beachfront luxury resorts.",
      icon: Hotel,
      href: "/hotels",
      badge: isBn ? "বাছাইকৃত আবাসন" : "Curated Stays",
      image: TRAVEL_HUB_REMOTE_IMAGES.hotels,
    },
    {
      title: isBn ? "ঐতিহ্যবাহী আঞ্চলিক খাবার" : "Authentic Regional Cuisine",
      desc: isBn
        ? "মেজবানি মাংস, সাতকড়া বিফ, ইলিশ পাতুরি থেকে কাচ্চি বিরিয়ানি — লোকাল ফুড গাইড।"
        : "Discover legendary local dishes, secret street food spots, and authentic culinary traditions.",
      icon: UtensilsCrossed,
      href: "/restaurants",
      badge: isBn ? "স্বাদের অভিযান" : "Local Flavors",
      image: TRAVEL_HUB_REMOTE_IMAGES.dining,
    },
    {
      title: isBn ? "যাতায়াত ও সরাসরি রুট" : "Transport & Scenic Routes",
      desc: isBn
        ? "ঢাকা ও চট্টগ্রাম থেকে বাস, এক্সপ্রেস ট্রেন, বিমান ও চান্দের গাড়ির সঠিক দিকনির্দেশনা।"
        : "Detailed schedules, estimated fares, scenic highway routes, and local 4x4 guides.",
      icon: Bus,
      href: "/transport",
      badge: isBn ? "নির্ভুল দিকনির্দেশনা" : "Route Planner",
      image: "/assets/destinations/marine-drive.webp",
    },
    {
      title: isBn ? "ট্যুরিস্ট পুলিশ ও জরুরি সহায়তা" : "Tourist Police & Safety",
      desc: isBn
        ? "২৪/৭ জরুরি হটলাইন, নিরাপত্তা জোন তথ্য এবং পর্যটন পুলিশ কন্ট্রোল রুম যোগাযোগ।"
        : "24/7 dedicated Tourist Police hotlines, safety zones, and emergency distress support.",
      icon: ShieldAlert,
      href: "/transport#police",
      badge: isBn ? "২৪/৭ নিরাপত্তা" : "24/7 Protection",
      image: "/assets/destinations/patenga-beach.webp",
    },
  ];

  const trustPoints = [
    {
      title: isBn ? "নির্ভরযোগ্য লোকাল গাইড" : "Trusted Local Guides",
      desc: isBn ? "বিনামূল্যে ব্যবহারযোগ্য, কোনো বুকিং ফি নেই" : "Free to use, no booking fees",
    },
    {
      title: isBn ? "ন্যায্য ভাড়ার স্পষ্ট তালিকা" : "Transparent Fair Fares",
      desc: isBn ? "লোকাল ট্র্যাপ মুক্ত সঠিক খরচের হিসাব" : "Official rates for 4x4 & buses",
    },
    {
      title: isBn ? "ট্যুরিস্ট পুলিশ জরুরি হটলাইন" : "Tourist Police Helpline",
      desc: isBn ? "জরুরিতে ডায়াল করুন: ০১৩২০-১৬৯৫৯৮" : "Direct SOS: 01320-169598 / 999",
    },
    {
      title: isBn ? "দায়িত্বশীল ইকো-ট্যুরিজম" : "Responsible Eco-Tourism",
      desc: isBn ? "প্রকৃতি ও স্থানীয় সংস্কৃতি সংরক্ষণ" : "Preserving local heritage",
    },
  ];

  return (
    <section className="py-20 bg-[var(--surface-raised)] border-t border-[var(--glass-border)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#047857]/10 text-[#047857] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isBn ? "ভ্রমণ সহযোগী সেবা" : "Complete Travel Hub"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            {isBn ? "এক নজরে সম্পূর্ণ ভ্রমণ সুবিধা" : "Everything for Your Trip"}
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] mt-2 max-w-xl">
            {isBn
              ? "শুধুমাত্র স্পট নয় — আপনার পুরো যাত্রার জন্য বিশ্বস্ত হোটেল, স্থানীয় খাবার, বাস-ট্রেন ও নিরাপত্তা তথ্য।"
              : "Beyond destinations: seamless lodging, genuine food recommendations, travel connectivity, and 24/7 security."}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group flex flex-col rounded-3xl overflow-hidden bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    loading="lazy"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#0f4a38]/90 text-white backdrop-blur-md">
                    {item.badge}
                  </span>
                </div>

                <div className="flex flex-col flex-1 p-5">
                  <div className="p-2.5 w-fit rounded-xl bg-[#047857]/10 dark:bg-[#1f9d76]/20 text-[#047857] dark:text-[#2ecc71] mb-3">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-bold text-foreground mb-1.5 group-hover:text-[#047857] dark:group-hover:text-[#2ecc71] transition-colors line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4 flex-1 line-clamp-3">
                    {item.desc}
                  </p>

                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#047857] dark:text-[#2ecc71] group-hover:underline pt-3 border-t border-[var(--glass-border)]"
                  >
                    <span>{isBn ? "বিস্তারিত দেখুন" : "Explore Guide"}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Why Ghuraghuri Trust Bar */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#047857]/10 via-[#047857]/5 to-[#f4a340]/10 border border-[#047857]/20 dark:border-[#2ecc71]/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#047857] dark:text-[#2ecc71]">
                {isBn ? "কেন ঘুরাঘুরি?" : "Why Ghuraghuri?"}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-foreground mt-1">
                {isBn ? "বাংলাদেশের পর্যটকদের জন্য বিশ্বস্ত প্ল্যাটফর্ম" : "Built for Confident, Hassle-Free Travel"}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
              <a
                href="tel:999"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-colors shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
                <span>{isBn ? "ট্যুরিস্ট পুলিশ (৯৯৯)" : "Tourist Police 999"}</span>
              </a>
              <Link
                href="/weather"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[var(--surface)] text-foreground border border-[var(--glass-border)] hover:bg-[var(--surface-raised)] transition-colors shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#f4a340]" />
                <span>{isBn ? "লাইভ ওয়েদার" : "Live Weather"}</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trustPoints.map((tp, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] flex items-start gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-foreground">{tp.title}</h4>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{tp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

