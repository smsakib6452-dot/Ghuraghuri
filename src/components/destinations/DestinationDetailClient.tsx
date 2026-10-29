"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Destination, DestinationTranslation } from "@/types/destination";
import DestinationMap from "@/components/destinations/DestinationMap";
import DestinationWeather from "@/components/destinations/DestinationWeather";
import {
  MapPin,
  Clock,
  Calendar,
  Wallet,
  Sparkles,
  ChevronLeft,
  Compass,
  CheckCircle,
  Navigation,
  Bus,
  Plane,
  ExternalLink,
} from "lucide-react";
import {
  DESTINATION_DETAIL_I18N,
  getDivisionBn,
  getDistrictBn,
  CATEGORIES_BN,
  formatDigits,
  localizeDuration,
} from "@/lib/i18n";

interface DestinationDetailClientProps {
  destination: Destination;
  related: Destination[];
  translation?: DestinationTranslation | null;
}

export function DestinationDetailClient({
  destination,
  related,
  translation,
}: DestinationDetailClientProps) {
  const { language } = useApp();
  const isBn = language === "bn";
  const t = isBn ? DESTINATION_DETAIL_I18N.bn : DESTINATION_DETAIL_I18N.en;

  const tr = translation || null;

  // Title & subtitles
  const title = isBn
    ? (tr?.name || destination.name_bn || destination.name)
    : destination.name;

  const subName = isBn
    ? (destination.name !== title ? destination.name : "")
    : (destination.name_bn || "");

  const divisionText = isBn
    ? getDivisionBn(destination.division)
    : destination.division;

  const divisionBadgeText = `${divisionText} ${t.divisionSuffix}`.trim();

  const categoryText = isBn
    ? (CATEGORIES_BN[destination.category] || destination.category)
    : destination.category;

  const diffMap: Record<string, string> = {
    Easy: t.easy,
    Moderate: t.moderate,
    Challenging: t.challenging,
  };
  const diffLabel = destination.difficulty
    ? (diffMap[destination.difficulty] || destination.difficulty)
    : "";
  const difficultyText = diffLabel
    ? `${diffLabel} ${t.difficultySuffix}`.trim()
    : "";

  const locationText = isBn
    ? `${getDistrictBn(destination.district)}, ${getDivisionBn(destination.division)}`
    : `${destination.district}, ${destination.division}`;

  const aboutHeading = isBn
    ? `${title} ${t.aboutSuffix}`.trim()
    : `${t.aboutPrefix} ${title}`.trim();

  const descriptionText = isBn
    ? (tr?.description || destination.description)
    : destination.description;

  const activitiesList: string[] =
    isBn && Array.isArray(tr?.activities) && tr.activities.length > 0
      ? tr.activities
      : destination.activities || [];

  const attractionsList: string[] =
    isBn && Array.isArray(tr?.attractions) && tr.attractions.length > 0
      ? tr.attractions
      : destination.attractions || [];

  const tipsList: string[] =
    isBn && Array.isArray(tr?.tips) && tr.tips.length > 0
      ? tr.tips
      : destination.tips || [];

  const travelRoute = isBn
    ? (tr?.travelInfo?.route || destination.travelInfo?.route)
    : destination.travelInfo?.route;

  const travelFlight = isBn
    ? (tr?.travelInfo?.flight || destination.travelInfo?.flight)
    : destination.travelInfo?.flight;

  const bestTimeText = isBn
    ? (tr?.bestTime || destination.bestTime)
    : destination.bestTime;

  const durationText = isBn
    ? (tr?.recommendedDays
        ? localizeDuration(tr.recommendedDays, true)
        : localizeDuration(destination.recommendedDays || "1 – 2 days", true))
    : (destination.recommendedDays || "1 – 2 days");

  const budgetText = isBn
    ? (tr?.budget || destination.budget)
    : destination.budget;

  const planTripText = isBn
    ? `${title}${t.planTripSuffix}`
    : `${t.planTripPrefix} ${title}`.trim();

  const moreInTitle = isBn
    ? `${getDivisionBn(destination.division)} ${t.moreInSuffix}`.trim()
    : `${t.moreInPrefix} ${destination.division}`.trim();

  const imageSrc = destination.image.startsWith("http")
    ? destination.image
    : `/${destination.image.replace(/^\/+/, "")}`;

  return (
    <article className="min-h-screen bg-[var(--background)] pb-20">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-medium">
          <Link href="/" className="hover:text-foreground">
            {t.home}
          </Link>
          <span>/</span>
          <Link href="/destinations" className="hover:text-foreground">
            {t.destinations}
          </Link>
          <span>/</span>
          <Link
            href={`/destinations?division=${destination.division}`}
            className="hover:text-foreground"
          >
            {divisionText}
          </Link>
          <span>/</span>
          <span className="text-foreground font-bold">{title}</span>
        </nav>
      </div>

      {/* Hero Visual Section - Fixed Aspect Ratio to prevent CLS */}
      <div className="relative aspect-[16/10] sm:aspect-[21/9] h-auto min-h-[380px] sm:min-h-[440px] max-h-[600px] w-full overflow-hidden bg-[#061B14]">
        <Image
          src={imageSrc}
          alt={
            isBn
              ? `${destination.name_bn || destination.name}, ${getDistrictBn(destination.district)}, ${getDivisionBn(destination.division)} — ${destination.category} ভ্রমণ নির্দেশিকা`
              : `${destination.name} in ${destination.district}, ${destination.division} — ${destination.category} Travel Guide`
          }
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px"
          priority
          fetchPriority="high"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

        {/* Floating Back Button */}
        <div className="absolute top-6 left-6 z-10">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white text-xs font-bold transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t.backToDirectory}</span>
          </Link>
        </div>

        {/* Hero Header Content */}
        <div className="absolute bottom-8 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0f4a38]/90 text-white backdrop-blur-md">
              {divisionBadgeText}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f4a340] text-black">
              {categoryText}
            </span>
            {destination.difficulty && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
                {difficultyText}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2 leading-tight">
            {title}{" "}
            {subName && (
              <span className="text-lg sm:text-2xl md:text-3xl text-white/80 font-normal">
                ({subName})
              </span>
            )}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/90">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-[#2ecc71]" />
              <span>{locationText}</span>
            </div>
            {categoryText && (
              <div className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-[#f4a340]" />
                <span className="font-semibold">{categoryText}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content (2 Columns) */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview & Description */}
            <section className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {aboutHeading}
              </h2>
              <p className="text-base text-foreground/80 leading-relaxed whitespace-pre-line">
                {descriptionText}
              </p>
            </section>

            {/* Key Highlights & Activities */}
            {activitiesList.length > 0 && (
              <section className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#f4a340]" />
                  <span>{t.topActivities}</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activitiesList.map((activity, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-sm font-medium text-foreground"
                    >
                      <CheckCircle className="w-4 h-4 text-[#2ecc71] shrink-0" />
                      <span>{activity}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Major Attractions */}
            {attractionsList.length > 0 && (
              <section className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#0f4a38] dark:text-[#2ecc71]" />
                  <span>{t.sightseeingSpots}</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {attractionsList.map((spot, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-sm font-semibold text-foreground flex items-center justify-between"
                    >
                      <span>{spot}</span>
                      <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Tips Section (if available) */}
            {tipsList.length > 0 && (
              <section className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#f4a340]" />
                  <span>{t.travelTips}</span>
                </h2>
                <div className="space-y-3">
                  {tipsList.map((tip, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--glass-border)] text-sm font-medium text-foreground"
                    >
                      <span className="text-[#f4a340] font-bold shrink-0 mt-0.5">•</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Travel Route & Logistics */}
            {(travelRoute || travelFlight) && (
              <section className="p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-[#0f4a38] dark:text-[#2ecc71]" />
                  <span>{t.howToReach}</span>
                </h2>
                <div className="space-y-4 text-sm text-foreground">
                  {travelRoute && (
                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[var(--surface-raised)]">
                      <Bus className="w-5 h-5 text-[#f4a340] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-foreground">
                          {t.roadRoute}
                        </span>
                        <span className="text-[var(--text-muted)]">
                          {travelRoute}
                        </span>
                      </div>
                    </div>
                  )}
                  {travelFlight && (
                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[var(--surface-raised)]">
                      <Plane className="w-5 h-5 text-[#2ecc71] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block text-foreground">
                          {t.airConnectivity}
                        </span>
                        <span className="text-[var(--text-muted)]">
                          {travelFlight}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar (1 Column) */}
          <div className="space-y-6">
            {/* Quick Trip Snapshot Card - Fixed min-height to prevent layout shifts */}
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm space-y-4 min-h-[290px]">
              <h3 className="text-lg font-bold text-foreground pb-3 border-b border-[var(--glass-border)]">
                {t.tripSnapshot}
              </h3>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#f4a340]" />
                  {t.bestTime}
                </span>
                <span className="font-bold text-foreground">{bestTimeText}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#2ecc71]" />
                  {t.duration}
                </span>
                <span className="font-bold text-foreground">{durationText}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-[#0f4a38] dark:text-[#2ecc71]" />
                  {t.estBudget}
                </span>
                <span className="font-bold text-foreground">{budgetText}</span>
              </div>

              <div className="pt-4 flex flex-col gap-2">
                <Link
                  href={`/hotels?district=${encodeURIComponent(destination.district)}`}
                  className="w-full py-3 px-4 rounded-xl bg-[#0f4a38] hover:bg-[#156b50] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>{t.findStays}</span>
                </Link>
                <Link
                  href={`/travel?to=${encodeURIComponent(destination.name)}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-[var(--surface-raised)] hover:bg-[#0f4a38]/10 text-foreground border border-[var(--glass-border)] font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span>{planTripText}</span>
                </Link>
              </div>
            </div>

            {/* Live Weather Card */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-foreground px-1">
                {t.liveWeather}
              </h3>
              <DestinationWeather
                latitude={destination.latitude}
                longitude={destination.longitude}
                locationName={destination.name}
              />
            </div>

            {/* Location & Mini-Map */}
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">
                  {t.exactLocation}
                </h3>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${destination.latitude},${destination.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#0f4a38] dark:text-[#2ecc71] hover:underline flex items-center gap-1"
                >
                  <span>{t.openInMaps}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <DestinationMap
                name={title}
                latitude={destination.latitude}
                longitude={destination.longitude}
              />
              <span className="text-xs text-[var(--text-muted)] block text-right">
                {t.gpsPrefix} {formatDigits(destination.latitude.toFixed(4), isBn, { useGrouping: false })}° {t.north}, {formatDigits(destination.longitude.toFixed(4), isBn, { useGrouping: false })}° {t.east}
              </span>
            </div>

            {/* Related in this Division */}
            {related.length > 0 && (
              <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm">
                <h3 className="text-base font-bold text-foreground mb-4">
                  {moreInTitle}
                </h3>
                <div className="space-y-3">
                  {related.map((rel) => {
                    const relTitle = isBn && rel.name_bn ? rel.name_bn : rel.name;
                    const relDistrict = isBn
                      ? getDistrictBn(rel.district)
                      : rel.district;

                    return (
                      <Link
                        key={rel.id}
                        href={`/destinations/${rel.slug}`}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--surface-raised)] transition-colors group"
                      >
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={
                              rel.image.startsWith("http")
                                ? rel.image
                                : `/${rel.image.replace(/^\/+/, "")}`
                            }
                            alt={
                              isBn
                                ? `${relTitle}, ${relDistrict}`
                                : `${rel.name} in ${rel.district}, ${rel.division}`
                            }
                            fill
                            sizes="56px"
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-foreground group-hover:text-[#0f4a38] dark:group-hover:text-[#2ecc71] truncate">
                            {relTitle}
                          </h4>
                          <span className="text-xs font-medium text-[var(--text-muted)] block">
                            {relDistrict} • {isBn ? (CATEGORIES_BN[rel.category] || rel.category) : rel.category}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
