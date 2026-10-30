"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Destination } from "@/types/destination";
import { MapPin, Bookmark, Clock, ArrowUpRight, CloudSun } from "lucide-react";
import { getDivisionBn, getDistrictBn, localizeDuration } from "@/lib/i18n";
import { getDestinationImage } from "@/lib/destination-image";
import { DestinationImagePlaceholder } from "@/components/common/DestinationImagePlaceholder";

interface DestinationCardProps {
  destination: Destination & {
    shortDesc_bn?: string;
    recommendedDays_bn?: string;
  };
  priority?: boolean;
}

export function DestinationCard({ destination, priority = false }: DestinationCardProps) {
  const { language, isBookmarked, toggleBookmark } = useApp();
  const isBn = language === "bn";
  const bookmarked = isBookmarked(destination.id);

  const title = isBn && destination.name_bn ? destination.name_bn : destination.name;
  const divisionText = isBn ? getDivisionBn(destination.division) : destination.division;
  const isSameDistrictDivision =
    destination.district.trim().toLowerCase() === destination.division.trim().toLowerCase();
  const isSameNameDistrict =
    destination.name.trim().toLowerCase() === destination.district.trim().toLowerCase();
  const locationText = isBn
    ? (isSameDistrictDivision
        ? getDistrictBn(destination.district)
        : `${getDistrictBn(destination.district)}, ${getDivisionBn(destination.division)}`)
    : (isSameDistrictDivision
        ? destination.district
        : `${destination.district}, ${destination.division}`);
  const descriptionText = isBn
    ? (destination.shortDesc_bn || destination.shortDesc)
    : destination.shortDesc;
  const durationText = isBn
    ? (destination.recommendedDays_bn
        ? localizeDuration(destination.recommendedDays_bn, true)
        : localizeDuration(destination.recommendedDays || "1 – 2 days", true))
    : (destination.recommendedDays || "1 – 2 days");

  const rawImage = getDestinationImage(destination);
  const imageSrc = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `/${rawImage.replace(/^\/+/, "")}`
    : null;

  const descriptiveAlt = isBn
    ? (isSameNameDistrict
        ? `${title}, ${getDivisionBn(destination.division)}: ${destination.category}`
        : `${title}, ${getDistrictBn(destination.district)}, ${getDivisionBn(destination.division)}: ${destination.category}`)
    : (isSameNameDistrict
        ? `${destination.name}, ${destination.division}: ${destination.category}`
        : `${destination.name} in ${destination.district}, ${destination.division}: ${destination.category}`);

  return (
    <article className="group relative flex flex-col rounded-3xl overflow-hidden bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5">
      {/* Image Container with Badge Overlays - Fixed Aspect Ratio prevents CLS */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={descriptiveAlt}
            fill
            sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) calc(50vw - 36px), 286px"
            priority={priority}
            fetchPriority={priority ? "high" : "auto"}
            loading={priority ? undefined : "lazy"}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110 [filter:saturate(1.1)_contrast(1.05)]"
          />
        ) : (
          <DestinationImagePlaceholder
            name={destination.name}
            name_bn={destination.name_bn}
            category={destination.category}
            variant="card"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/15 pointer-events-none" />

        {/* Division Badge (Clean Frosted Tag matching Vanilla) */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0b3d2e]/90 text-white backdrop-blur-md shadow-sm border border-white/10">
            {divisionText}
          </span>
        </div>

        {/* Live Weather Quick Icon Button (Accessible 40x40px tap target) */}
        <Link
          href={`/weather?spot=${destination.slug}`}
          prefetch={false}
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-3.5 right-3.5 w-10 h-10 min-w-[40px] min-h-[40px] rounded-full bg-black/60 hover:bg-black/85 backdrop-blur-md text-[#f4a340] border border-white/20 transition-all shadow-md flex items-center justify-center hover:scale-105 cursor-pointer z-10"
          title={isBn ? `${title}-এর লাইভ আবহাওয়া দেখুন` : `Live weather for ${destination.name}`}
          aria-label={isBn ? `${title}-এর লাইভ আবহাওয়া` : `Live weather for ${destination.name}`}
        >
          <CloudSun className="w-5 h-5" />
        </Link>

        {/* Bookmark Button (Thumb-Friendly Touch Target) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleBookmark(destination.id);
          }}
          className={`absolute top-3.5 right-3.5 w-10 h-10 rounded-full backdrop-blur-md transition-all shadow-md flex items-center justify-center cursor-pointer ${
            bookmarked
              ? "bg-[#f4a340] text-black scale-105"
              : "bg-black/50 text-white hover:bg-black/75 hover:scale-105"
          }`}
          aria-label={bookmarked ? "Remove bookmark" : "Save destination"}
        >
          <Bookmark className={`w-4 h-4 ${bookmarked ? "fill-black" : ""}`} />
        </button>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4.5">
        <div className="flex items-center gap-1.5 text-[13px] text-[var(--text-muted)] font-semibold mb-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#047857] dark:text-[#2ecc71] shrink-0" />
          <span>
            {locationText}
          </span>
        </div>

        <h3 className="text-[1.125rem] font-extrabold text-foreground mb-1.5 group-hover:text-[#047857] dark:group-hover:text-[#2ecc71] transition-colors line-clamp-1 tracking-tight">
          <Link href={`/destinations/${destination.slug}`} prefetch={false} className="hover:underline">
            {title}
          </Link>
        </h3>

        <p className="text-[13.5px] text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-3 flex-1">
          {descriptionText}
        </p>

        {/* Optional Season & Budget Meta */}
        {((destination.bestSeason || destination.bestTime) || (destination.budgetPerDay || destination.budget)) && (
          <div className="grid grid-cols-2 gap-2 py-2 mb-3 border-y border-[var(--glass-border)] text-[11px] text-[var(--text-muted)]">
            {(destination.bestSeason || destination.bestTime) ? (
              <div className="truncate">
                <span className="font-bold text-foreground block">{isBn ? "সেরা সময়:" : "Best season:"}</span>
                <span className="truncate block font-medium" title={destination.bestSeason || destination.bestTime}>
                  {destination.bestSeason || destination.bestTime}
                </span>
              </div>
            ) : <div />}
            {(destination.budgetPerDay || destination.budget) ? (
              <div className="truncate text-right">
                <span className="font-bold text-foreground block">{isBn ? "বাজেট/দিন:" : "Budget/day:"}</span>
                <span className="truncate block font-medium" title={destination.budgetPerDay || destination.budget}>
                  {destination.budgetPerDay || destination.budget}
                </span>
              </div>
            ) : <div />}
          </div>
        )}

        {/* Footer Meta: Recommended Days & Details CTA */}
        <div className="pt-3 border-t border-[var(--glass-border)] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[var(--text-muted)] font-semibold">
            <Clock className="w-3.5 h-3.5 text-[#f4a340]" />
            <span>{durationText}</span>
          </div>

          <Link
            href={`/destinations/${destination.slug}`}
            prefetch={false}
            className="inline-flex items-center gap-1.5 font-bold text-xs text-[#047857] dark:text-[#2ecc71] bg-[#047857]/10 dark:bg-[#1f9d76]/20 hover:bg-[#047857]/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
          >
            <span>{isBn ? "বিস্তারিত" : "Details"}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
