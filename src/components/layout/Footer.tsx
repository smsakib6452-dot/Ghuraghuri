"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { Heart, ShieldCheck, Mail, Send, CheckCircle2, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { TOTAL_DESTINATIONS } from "@/lib/constants";
import { formatNumberEnBn } from "@/lib/utils";
import { formatDigits } from "@/lib/i18n";

export function Footer() {
  const { language } = useApp();
  const isBn = language === "bn";
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#0f4a38", "#1f9d76", "#f4a340", "#2ecc71"],
    });

    setSubscribed(true);
  };

  const divisions = [
    { name: "Chattogram", name_bn: "চট্টগ্রাম", href: "/destinations?division=Chattogram" },
    { name: "Sylhet", name_bn: "সিলেট", href: "/destinations?division=Sylhet" },
    { name: "Khulna", name_bn: "খুলনা", href: "/destinations?division=Khulna" },
    { name: "Barishal", name_bn: "বরিশাল", href: "/destinations?division=Barishal" },
    { name: "Dhaka", name_bn: "ঢাকা", href: "/destinations?division=Dhaka" },
    { name: "Rajshahi", name_bn: "রাজশাহী", href: "/destinations?division=Rajshahi" },
    { name: "Rangpur", name_bn: "রংপুর", href: "/destinations?division=Rangpur" },
    { name: "Mymensingh", name_bn: "ময়মনসিংহ", href: "/destinations?division=Mymensingh" },
  ];

  return (
    <footer
      className="bg-[#07251c] text-[#e8f3ee] border-t border-white/10 pt-16 pb-28 sm:pb-12 transition-colors [padding-bottom:max(96px,calc(env(safe-area-inset-bottom)+72px))] sm:[padding-bottom:max(48px,env(safe-area-inset-bottom))]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center group focus:outline-none"
              aria-label="Ghuraghuri Homepage"
            >
              <Image
                src="/assets/logo-dark.svg"
                alt="Ghuraghuri - Bangladesh Travel Explorer"
                width={160}
                height={50}
                className="h-11 sm:h-12 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-200"
              />
              <span className="sr-only">
                {isBn ? "ঘুরাঘুরি · বাংলাদেশ" : "Ghuraghuri · Bangladesh Travel Explorer"}
              </span>
            </Link>
            <p className="text-sm text-[#a3c4b6] leading-relaxed">
              {isBn
                ? "বাংলাদেশের ৬৪ জেলার সমৃদ্ধ প্রাকৃতিক সৌন্দর্য, পাহাড়, সমুদ্র, নদী ও ঐতিহ্যকে সবার মাঝে ছড়িয়ে দিতে তৈরি করা পূর্ণাঙ্গ ডিজিটাল ট্রাভেল প্ল্যাটফর্ম।"
                : "The open travel platform showcasing the breathtaking landscapes, heritage, and wonders of Bangladesh across all 8 divisions."}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#7ea897]">
              <ShieldCheck className="w-4 h-4 text-[#2ecc71]" />
              <span>
                {isBn
                  ? `${formatNumberEnBn(TOTAL_DESTINATIONS, true)}+ ভেরিফাইড পর্যটন স্পট`
                  : `${TOTAL_DESTINATIONS}+ Curated & Authentic Guides`}
              </span>
            </div>
          </div>

          {/* Col 2: Divisions */}
          <div>
            <h3 className="text-base font-bold text-white mb-4 tracking-wide">
              {isBn ? "বিভাগসমূহ" : "Explore Divisions"}
            </h3>
            <ul className="grid grid-cols-2 gap-2.5 text-sm">
              {divisions.map((div) => (
                <li key={div.name}>
                  <Link
                    href={div.href}
                    className="text-[#a3c4b6] hover:text-[#f4a340] transition-colors"
                  >
                    {isBn ? div.name_bn : div.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h3 className="text-base font-bold text-white mb-4 tracking-wide">
              {isBn ? "প্রয়োজনীয় লিংক" : "Quick Links"}
            </h3>
            <ul className="space-y-2 text-sm text-[#a3c4b6]">
              <li>
                <Link href="/destinations" className="hover:text-[#f4a340] transition-colors">
                  {isBn
                    ? `সব গন্তব্য (${formatNumberEnBn(TOTAL_DESTINATIONS, true)}+)`
                    : `All Destinations (${TOTAL_DESTINATIONS}+)`}
                </Link>
              </li>
              <li>
                <Link href="/#map" className="hover:text-[#f4a340] transition-colors">
                  {isBn ? "ইন্টারেক্টিভ মানচিত্র" : "Interactive Map"}
                </Link>
              </li>
              <li>
                <Link href="/weather" className="hover:text-[#f4a340] transition-colors">
                  {isBn ? "আবহাওয়া পূর্বাভাস" : "Live Weather Forecast"}
                </Link>
              </li>
              <li>
                <Link href="/travel" className="hover:text-[#f4a340] transition-colors font-medium text-white/95">
                  {isBn ? "ভ্রমণ পরিকল্পনা ও বাজেট" : "Trip Planner & Budget"}
                </Link>
              </li>
              <li>
                <Link href="/chattogram" className="text-[#f4a340] hover:underline font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isBn ? "মাই চট্টগ্রাম (৪টি অভিজ্ঞতা)" : "My Chattogram (4 Experiences)"}</span>
                </Link>
              </li>
              <li>
                <Link href="/hotels" className="hover:text-[#f4a340] transition-colors">
                  {isBn ? "হোটেল ও রিসোর্ট" : "Hotels & Resorts"}
                </Link>
              </li>
              <li>
                <Link href="/restaurants" className="hover:text-[#f4a340] transition-colors">
                  {isBn ? "খাবারের তালিকা" : "Restaurants & Cuisine"}
                </Link>
              </li>
              <li>
                <Link href="/transport" className="hover:text-[#f4a340] transition-colors">
                  {isBn ? "যাতায়াত ও ভাড়া" : "Transport & Routes"}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#f4a340] transition-colors">
                  {isBn ? "আমাদের সম্পর্কে" : "About Ghuraghuri"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h3 className="text-base font-bold text-white mb-4 tracking-wide">
              {isBn ? "ভ্রমণ আপডেট ও অফার" : "Travel Insights"}
            </h3>
            <p className="text-xs text-[#a3c4b6] mb-4">
              {isBn
                ? "নতুন নতুন গোপন স্পট এবং ট্রাভেল গাইডের আপডেট পেতে ইমেইল সাবস্ক্রাইব করুন।"
                : "Receive hidden gems, seasonal itineraries, and local tips directly in your inbox."}
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-[#0f4a38] text-white rounded-xl border border-[#2ecc71]/40 text-sm">
                <CheckCircle2 className="w-5 h-5 text-[#2ecc71]" />
                <span>{isBn ? "অভিনন্দন! আপনি যুক্ত হয়েছেন।" : "You are in! Welcome aboard."}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-[#7ea897]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isBn ? "আপনার ইমেইল দিন..." : "Your email address..."}
                    required
                    className="w-full min-h-[44px] pl-9 pr-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-[#7ea897] text-base sm:text-xs focus:outline-none focus:border-[#f4a340]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#f4a340] hover:bg-[#e67e22] text-black font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isBn ? "সাবস্ক্রাইব করুন" : "Join Free Community"}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7ea897]">
          <p>
            © {isBn ? formatDigits(new Date().getFullYear(), true) : new Date().getFullYear()}{" "}
            {isBn
              ? "Ghuraghuri। উন্মুক্ত ডেটা, লিফলেট এবং ওপেন-মেটিও দিয়ে নির্মিত।"
              : "Ghuraghuri. Built with Open Data, Leaflet & Open-Meteo."}
          </p>
          <div className="flex items-center gap-1">
            <span>{isBn ? "বাংলাদেশ ভ্রমণে আগ্রহীদের জন্য পরম" : "Crafted with"}</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>{isBn ? "ভালোবাসায় তৈরি।" : "for travelers discovering Bangladesh."}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
