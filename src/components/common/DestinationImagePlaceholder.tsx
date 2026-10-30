"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import {
  Compass,
  Palmtree,
  Mountain,
  Droplets,
  Trees,
  Landmark,
  Sprout,
  CameraOff,
} from "lucide-react";

interface DestinationImagePlaceholderProps {
  name: string;
  name_bn?: string;
  category?: string;
  variant?: "card" | "hero" | "mini";
  className?: string;
}

export function DestinationImagePlaceholder({
  name,
  name_bn,
  category = "",
  variant = "card",
  className = "",
}: DestinationImagePlaceholderProps) {
  const { language } = useApp();
  const isBn = language === "bn";

  const displayName = isBn && name_bn ? name_bn : name;
  const labelText = isBn ? "ছবি শীঘ্রই আসছে" : "Photo coming soon";
  const ariaLabel = `${displayName} — ${labelText}`;

  // Map category to a Lucide icon
  const getCategoryIcon = () => {
    const cat = (category || "").toLowerCase();
    if (cat.includes("beach") || cat.includes("island") || cat.includes("coastal")) {
      return Palmtree;
    }
    if (cat.includes("hill") || cat.includes("mountain") || cat.includes("peak")) {
      return Mountain;
    }
    if (cat.includes("waterfall")) {
      return Droplets;
    }
    if (cat.includes("forest") || cat.includes("wildlife") || cat.includes("park")) {
      return Trees;
    }
    if (cat.includes("historical") || cat.includes("heritage") || cat.includes("palace") || cat.includes("museum") || cat.includes("archaeological") || cat.includes("mosque")) {
      return Landmark;
    }
    if (cat.includes("tea") || cat.includes("garden") || cat.includes("nature")) {
      return Sprout;
    }
    return Compass;
  };

  const IconComponent = getCategoryIcon();

  if (variant === "mini") {
    return (
      <div
        role="img"
        aria-label={ariaLabel}
        className={`w-full h-full bg-gradient-to-br from-[#061a14] via-[#0d3829] to-[#052219] flex items-center justify-center text-[#34d399] ${className}`}
      >
        <IconComponent className="w-5 h-5 opacity-80" aria-hidden="true" />
      </div>
    );
  }

  const isHero = variant === "hero";

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={`absolute inset-0 w-full h-full bg-gradient-to-br from-[#061a14] via-[#0e3d2c] to-[#042419] flex flex-col items-center justify-center p-6 select-none overflow-hidden ${className}`}
    >
      {/* Decorative radial lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

      {/* Decorative subtle topo-contour lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 500"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,160 Q200,90 400,170 T800,120 L800,500 L0,500 Z" fill="#144d37" />
        <path d="M0,280 Q250,180 500,260 T800,220 L800,500 L0,500 Z" fill="#1b5e43" />
      </svg>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Category Icon Capsule */}
        <div
          className={`rounded-full bg-black/40 border border-emerald-500/30 flex items-center justify-center backdrop-blur-sm shadow-inner text-[#f4a340] mb-3 ${
            isHero ? "w-16 h-16 sm:w-20 sm:h-20" : "w-12 h-12"
          }`}
        >
          <IconComponent
            className={`${isHero ? "w-8 h-8 sm:w-10 sm:h-10" : "w-6 h-6"}`}
            aria-hidden="true"
          />
        </div>

        {/* Status text */}
        <div className="flex items-center gap-1.5 text-emerald-300/90 font-bold tracking-wide uppercase text-xs mb-1">
          <CameraOff className="w-3.5 h-3.5 text-[#f4a340]" aria-hidden="true" />
          <span>{labelText}</span>
        </div>

        {/* Destination Name in Hero variant */}
        {isHero && (
          <p className="text-sm text-emerald-100/70 font-medium max-w-md">
            {isBn ? "আমরা এই স্থানের জন্য খাঁটি ছবি যুক্ত করার কাজ করছি।" : "Authentic verified photography will be updated soon."}
          </p>
        )}
      </div>
    </div>
  );
}

