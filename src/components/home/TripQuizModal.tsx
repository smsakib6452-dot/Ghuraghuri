"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useApp } from "@/context/AppContext";
import { Sparkles } from "lucide-react";

const DynamicQuizModal = dynamic(
  () => import("./TripQuizModalContent").then((m) => m.TripQuizModalContent),
  { ssr: false }
);

export function TripQuizModal() {
  const { language } = useApp();
  const isBn = language === "bn";
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating CTA Trigger Banner */}
      <section className="py-12 bg-gradient-to-r from-[#0f4a38] via-[#156b50] to-[#0f4a38] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#f4a340]" />
            <span>{isBn ? "ট্রিপ ম্যাচমেকার" : "Trip Matcher"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-3">
            {isBn ? "কোথায় যাবেন সিদ্ধান্ত নিতে পারছেন না?" : "Undecided Where to Go Next?"}
          </h2>
          <p className="text-sm sm:text-base text-[#d4ebe0] max-w-xl mx-auto mb-6">
            {isBn
              ? "মাত্র ২০ সেকেন্ডের কুইজে খুঁজে নিন আপনার পছন্দ ও বাজেট অনুযায়ী নিখুঁত পর্যটন স্পট।"
              : "Answer 2 quick questions and let our curated trip explorer pinpoint your dream destination."}
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="px-8 py-3.5 rounded-full bg-[#f4a340] hover:bg-[#e67e22] text-black font-extrabold text-sm shadow-xl transition-all hover:scale-105 cursor-pointer inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isBn ? "২০ সেকেন্ডে আমার স্পট খুঁজুন" : "Find My Match in 20s"}</span>
          </button>
        </div>
      </section>

      {/* Lazily Loaded Quiz Modal Dialog on Click */}
      {isOpen && <DynamicQuizModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
