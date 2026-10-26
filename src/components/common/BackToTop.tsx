"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function BackToTop() {
  const { language } = useApp();
  const isBn = language === "bn";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label={isBn ? "পৃষ্ঠার শীর্ষে যান" : "Scroll to top"}
      title={isBn ? "উপরে যান" : "Back to top"}
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#0f4a38] dark:bg-[#1f9d76] text-white shadow-2xl shadow-[#0f4a38]/40 border-2 border-[#f4a340]/60 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-[#156b50] focus:outline-none focus:ring-2 focus:ring-[#f4a340]"
    >
      <ArrowUp className="w-5 h-5 text-[#f4a340] stroke-[2.5]" />
    </button>
  );
}
