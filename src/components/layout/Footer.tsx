"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { Heart, ShieldCheck, Mail, Send, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { TOTAL_DESTINATIONS } from "@/lib/constants";
import { formatNumberEnBn } from "@/lib/utils";
import { formatDigits } from "@/lib/i18n";
import { FOOTER_CONFIG } from "@/config/footer";

export function Footer() {
  const { language } = useApp();
  const isBn = language === "bn";
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [botField, setBotField] = useState("");

  const newsletterEndpoint = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Honeypot check
    if (botField) {
      return;
    }

    const trimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmed) {
      setErrorMessage(isBn ? "অনুগ্রহ করে আপনার ইমেইল প্রদান করুন।" : "Please enter your email address.");
      return;
    }
    if (!emailRegex.test(trimmed)) {
      setErrorMessage(isBn ? "অনুগ্রহ করে একটি সঠিক ইমেইল প্রদান করুন।" : "Please enter a valid email address.");
      return;
    }

    if (!newsletterEndpoint) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(newsletterEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: trimmed }),
      });

      if (res.ok) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#0f4a38", "#1f9d76", "#f4a340", "#2ecc71"],
        });
        setSubscribed(true);
      } else {
        setErrorMessage(
          isBn
            ? "সাবস্ক্রিপশন সম্পন্ন করা যায়নি। অনুগ্রহ করে পরে চেষ্টা করুন।"
            : "Subscription failed. Please try again later."
        );
      }
    } catch {
      setErrorMessage(
        isBn
          ? "নেটওয়ার্ক সমস্যা। পুনরায় চেষ্টা করুন।"
          : "Network error. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
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
                alt=""
                width={160}
                height={50}
                loading="lazy"
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
                  ? `${formatNumberEnBn(TOTAL_DESTINATIONS, true)}+ বাছাইকৃত পর্যটন স্পট`
                  : `${TOTAL_DESTINATIONS}+ Curated & Authentic Guides`}
              </span>
            </div>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="sr-only">Social media links</span>
              <div className="flex items-center gap-3">
                {FOOTER_CONFIG.socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#f4a340] hover:text-black text-[#a3c4b6] transition-all flex items-center justify-center"
                    aria-label={social.name}
                  >
                    {social.platform === "facebook" && (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    )}
                    {social.platform === "instagram" && (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    )}
                    {social.platform === "youtube" && (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
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
              <li className="pt-2 mt-2 border-t border-white/10 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                {FOOTER_CONFIG.legalLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="hover:text-[#f4a340] transition-colors">
                    {isBn ? item.label_bn : item.label}
                  </Link>
                ))}
              </li>
            </ul>
          </div>

          {/* Col 4: Community Updates & Newsletter */}
          <div>
            <h3 className="text-base font-bold text-white mb-4 tracking-wide">
              {isBn ? "ভ্রমণ আপডেট ও যোগাযোগ" : "Follow Us & Travel Updates"}
            </h3>

            {!newsletterEndpoint ? (
              <div>
                <p className="text-xs text-[#a3c4b6] mb-4 leading-relaxed">
                  {isBn
                    ? "নতুন নতুন গোপন স্পট এবং বিশ্বস্ত ট্রাভেল গাইডের আপডেটের জন্য আমাদের অফিশিয়াল চ্যানেলে যুক্ত থাকুন।"
                    : "Follow our official channels for fresh photography, seasonal itineraries, and verified travel tips."}
                </p>
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  {FOOTER_CONFIG.socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-[#f4a340] hover:text-black text-white text-xs font-bold transition-all inline-flex items-center gap-2"
                      aria-label={`Follow Ghuraghuri on ${social.name}`}
                    >
                      <span>{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            ) : subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-[#0f4a38] text-white rounded-xl border border-[#2ecc71]/40 text-sm">
                <CheckCircle2 className="w-5 h-5 text-[#2ecc71] shrink-0" />
                <span>{isBn ? "অভিনন্দন! আপনি যুক্ত হয়েছেন।" : "You are in! Welcome aboard."}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <p className="text-xs text-[#a3c4b6] mb-3">
                  {isBn
                    ? "নতুন নতুন গোপন স্পট এবং ট্রাভেল গাইডের আপডেট পেতে ইমেইল দিন।"
                    : "Receive hidden gems, seasonal itineraries, and local tips in your inbox."}
                </p>

                {/* Honeypot anti-spam field */}
                <input
                  type="text"
                  name="botcheck"
                  value={botField}
                  onChange={(e) => setBotField(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-[#7ea897]" />
                  <input
                    type="email"
                    value={email}
                    disabled={isSubmitting}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage("");
                    }}
                    placeholder={isBn ? "আপনার ইমেইল দিন..." : "Your email address..."}
                    aria-label="Email address"
                    aria-invalid={!!errorMessage}
                    className={`w-full min-h-[44px] pl-9 pr-3 py-2.5 rounded-xl bg-white/10 border text-white placeholder-[#7ea897] text-base sm:text-xs focus:outline-none ${
                      errorMessage ? "border-red-400 focus:border-red-400" : "border-white/20 focus:border-[#f4a340]"
                    }`}
                  />
                </div>
                {errorMessage && (
                  <p className="text-xs text-red-400 font-medium flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#f4a340] hover:bg-[#e67e22] disabled:opacity-50 text-black font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isSubmitting
                      ? isBn
                        ? "যুক্ত করা হচ্ছে..."
                        : "Subscribing..."
                      : isBn
                      ? "সাবস্ক্রাইব করুন"
                      : "Join Free Community"}
                  </span>
                </button>
                <p className="text-[11px] text-[#7ea897] pt-1.5 leading-relaxed">
                  {isBn
                    ? "আমরা কোনো স্প্যাম পাঠাই না। যেকোনো সময় আনসাবস্ক্রাইব করতে পারেন। বিস্তারিত: "
                    : "We only send travel tips. Unsubscribe anytime. See our "}
                  <Link href="/privacy" className="underline hover:text-white">
                    {isBn ? "গোপনীয়তা নীতি" : "Privacy Policy"}
                  </Link>
                  .
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7ea897]">
          <p className="leading-relaxed text-center sm:text-left">
            © {isBn ? formatDigits(new Date().getFullYear(), true) : new Date().getFullYear()}{" "}
            {isBn
              ? "Ghuraghuri। উন্মুক্ত ডেটা, লিফলেট, ওপেন-মেটিও এবং "
              : "Ghuraghuri. Built with Open Data, Leaflet, Open-Meteo & "}
            <a
              href={FOOTER_CONFIG.attribution.osmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              {isBn ? FOOTER_CONFIG.attribution.osmText_bn : FOOTER_CONFIG.attribution.osmText}
            </a>
            {" · "}
            <span className="text-white/80 font-medium">
              {isBn ? FOOTER_CONFIG.creator.credit_bn : FOOTER_CONFIG.creator.credit}
            </span>
          </p>
          <div className="flex items-center gap-1.5 shrink-0">
            <span>{isBn ? "বাংলাদেশ ভ্রমণে আগ্রহীদের জন্য পরম" : "Crafted with"}</span>
            <Heart
              className="w-3.5 h-3.5 text-red-500 fill-red-500 inline shrink-0 mx-0.5"
              role="img"
              aria-label={isBn ? "ভালোবাসা" : "love"}
            />
            <span>{isBn ? "ভালোবাসায় তৈরি।" : "for travelers discovering Bangladesh."}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
