"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  Sparkles,
  X,
  CheckCircle2,
  ArrowRight,
  Users,
  Heart,
  UsersRound,
  Compass,
  Mountain,
  Waves,
  Trees,
  Landmark,
} from "lucide-react";
import confetti from "canvas-confetti";

export function TripQuizModal() {
  const { language } = useApp();
  const isBn = language === "bn";
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [result, setResult] = useState<{
    name: string;
    name_bn: string;
    slug: string;
    tagline: string;
    tagline_bn: string;
  } | null>(null);

  const handleStart = () => {
    setIsOpen(true);
    setStep(1);
    setResult(null);
  };

  const handleFinish = (selectedVibe: string) => {

    // Pick personalized recommendation
    let pick = {
      name: "Sajek Valley",
      name_bn: "সাজেক ভ্যালি",
      slug: "sajek-valley",
      tagline: "Misty clouds and panoramic peak sunrises.",
      tagline_bn: "মেঘের কোলে সূর্যোদয়ের অভূতপূর্ব দৃশ্য।",
    };

    if (selectedVibe === "beach") {
      pick = {
        name: "Cox's Bazar",
        name_bn: "কক্সবাজার",
        slug: "coxs-bazar",
        tagline: "Endless golden sand and gentle waves.",
        tagline_bn: "১২০ কিমি সোনালি সৈকত ও মৃদু ঢেউ।",
      };
    } else if (selectedVibe === "tea") {
      pick = {
        name: "Sreemangal",
        name_bn: "শ্রীমঙ্গল",
        slug: "srimangal",
        tagline: "Rolling tea slopes and pure serenity.",
        tagline_bn: "সবুজ চা বাগান আর নির্মল প্রকৃতি।",
      };
    } else if (selectedVibe === "heritage") {
      pick = {
        name: "Puthia Temple Complex",
        name_bn: "পুঠিয়া রাজবাড়ি ও মন্দির",
        slug: "puthia-temple-complex",
        tagline: "Magnificent terracotta masterpieces.",
        tagline_bn: "প্রাচীন টেরাকোটা স্থাপত্যের অপূর্ব নিদর্শন।",
      };
    }

    setResult(pick);
    setStep(3);

    // Celebratory confetti burst!
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#2ecc71", "#f4a340", "#0f4a38", "#ffffff"],
    });
  };

  return (
    <>
      {/* Floating CTA Trigger */}
      <section className="py-12 bg-gradient-to-r from-[#0f4a38] via-[#156b50] to-[#0f4a38] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#f4a340]" />
            <span>{isBn ? "স্মার্ট ট্রিপ ম্যাচমেকার" : "AI Trip Matcher"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-3">
            {isBn ? "কোথায় যাবেন সিদ্ধান্ত নিতে পারছেন না?" : "Undecided Where to Go Next?"}
          </h2>
          <p className="text-sm sm:text-base text-[#d4ebe0] max-w-xl mx-auto mb-6">
            {isBn
              ? "মাত্র ২০ সেকেন্ডের কুইজে খুঁজে নিন আপনার পছন্দ ও বাজেট অনুযায়ী নিখুঁত পর্যটন স্পট।"
              : "Answer 2 quick questions and let our intelligent explorer pinpoint your dream destination."}
          </p>
          <button
            onClick={handleStart}
            className="px-8 py-3.5 rounded-full bg-[#f4a340] hover:bg-[#e67e22] text-black font-extrabold text-sm shadow-xl transition-all hover:scale-105 cursor-pointer inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isBn ? "২০ সেকেন্ডে আমার স্পট খুঁজুন" : "Find My Match in 20s"}</span>
          </button>
        </div>
      </section>

      {/* Quiz Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-2xl p-6 sm:p-8 text-foreground animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 min-w-[36px] min-h-[36px] flex items-center justify-center p-2 rounded-full hover:bg-[var(--surface-raised)] text-[var(--text-muted)] hover:text-foreground transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Step 1: Who with */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <span className="text-xs font-bold text-[#0f4a38] dark:text-[#2ecc71] uppercase tracking-wider">
                    {isBn ? "ধাপ ১ / ২" : "Step 1 of 2"}
                  </span>
                  <h3 className="text-2xl font-bold mt-1 text-foreground">
                    {isBn ? "কার সাথে ঘুরতে যাচ্ছেন?" : "Who are you traveling with?"}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "friends", label: isBn ? "বন্ধুদের দল" : "Friends", icon: Users },
                    { id: "couple", label: isBn ? "দম্পতি / রোমান্টিক" : "Couple", icon: Heart },
                    { id: "family", label: isBn ? "পরিবার সহ" : "Family", icon: UsersRound },
                    { id: "solo", label: isBn ? "একাকী অভিযাত্রী" : "Solo Traveler", icon: Compass },
                  ].map((option) => {
                    const OptionIcon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => {
                          setStep(2);
                        }}
                        className="group flex flex-col items-center justify-center p-5 rounded-xl border border-[var(--glass-border)] bg-[var(--surface-raised)] hover:border-[#0f4a38] dark:hover:border-[#2ecc71] hover:scale-102 transition-all cursor-pointer text-center"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#0f4a38]/10 dark:bg-[#2ecc71]/15 text-[#0f4a38] dark:text-[#2ecc71] flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110">
                          <OptionIcon className="w-6 h-6" strokeWidth={1.75} aria-hidden="true" />
                        </div>
                        <span className="font-bold text-sm text-foreground">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Preferred Vibe */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <span className="text-xs font-bold text-[#0f4a38] dark:text-[#2ecc71] uppercase tracking-wider">
                    {isBn ? "ধাপ ২ / ২" : "Step 2 of 2"}
                  </span>
                  <h3 className="text-2xl font-bold mt-1 text-foreground">
                    {isBn ? "কেমন পরিবেশ আপনার পছন্দ?" : "What's your ideal trip vibe?"}
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "hills", label: isBn ? "পাহাড় ও মেঘ" : "Clouds & Peaks", icon: Mountain },
                    { id: "beach", label: isBn ? "সমুদ্র সৈকত" : "Waves & Sunset", icon: Waves },
                    { id: "tea", label: isBn ? "সবুজ চা বাগান" : "Lush Tea Valleys", icon: Trees },
                    { id: "heritage", label: isBn ? "প্রাচীন ঐতিহ্য" : "Ancient Heritage", icon: Landmark },
                  ].map((option) => {
                    const OptionIcon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleFinish(option.id)}
                        className="group flex flex-col items-center justify-center p-5 rounded-xl border border-[var(--glass-border)] bg-[var(--surface-raised)] hover:border-[#0f4a38] dark:hover:border-[#2ecc71] hover:scale-102 transition-all cursor-pointer text-center"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#0f4a38]/10 dark:bg-[#2ecc71]/15 text-[#0f4a38] dark:text-[#2ecc71] flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110">
                          <OptionIcon className="w-6 h-6" strokeWidth={1.75} aria-hidden="true" />
                        </div>
                        <span className="font-bold text-sm text-foreground">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Result Showcase */}
            {step === 3 && result && (
              <div className="text-center space-y-6">
                <div className="inline-flex p-3 rounded-full bg-[#2ecc71]/20 text-[#2ecc71]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#f4a340] uppercase tracking-wider">
                    {isBn ? "আপনার জন্য নিখুঁত গন্তব্য" : "Your Perfect Match"}
                  </span>
                  <h3 className="text-3xl font-black mt-1 text-foreground">
                    {isBn ? result.name_bn : result.name}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] mt-2">
                    {isBn ? result.tagline_bn : result.tagline}
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={`/destinations/${result.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-[#0f4a38] to-[#1f9d76] hover:from-[#156b50] hover:to-[#2ecc71] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>{isBn ? "গন্তব্যের গাইড দেখুন" : "View Destination Guide"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setStep(1)}
                    className="py-3 px-4 rounded-xl border border-[var(--glass-border)] text-xs font-bold hover:bg-[var(--surface-raised)] transition-colors"
                  >
                    {isBn ? "আবার শুরু করুন" : "Retake"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
