import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ArrowLeft, CheckCircle2, Shield, AlertCircle } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/constants";
import { buildRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRouteMetadata({
  title: "Terms of Service & Usage Guidelines",
  description:
    "Review the terms of service for Ghuraghuri. Understand guidelines for using our open Bangladesh travel guides, directory information, and trip tools.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="py-16 bg-[var(--background)] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#0f4a38] dark:text-[#2ecc71] hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>হোমে ফিরুন / Back to Home</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#f4a340]">
            <FileText className="w-4 h-4" />
            <span>ব্যবহারের শর্তাবলী / Terms of Service</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
            Welcome to Ghuraghuri. By accessing our travel guides, interactive maps, and travel planning tools, you agree to these transparent and community-oriented terms.
          </p>
        </div>

        {/* Core Terms Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-foreground">Open Information</h2>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Our travel content is curated for public educational and travel planning use across all 64 districts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-foreground">Accurate Curation</h2>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              We continually audit itineraries, local fares, and contact numbers to maintain reliable Bangladesh travel guides.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-foreground">Traveler Safety</h2>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Travel conditions, weather, and fares may vary locally. Always check local guidelines and emergency contacts before departure.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)] space-y-6 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-foreground">1. Acceptance of Terms</h3>
            <p>
              By browsing Ghuraghuri, using our transit guides, or downloading commemorative travel posters, you acknowledge that you have read and understood these terms of service.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-foreground">2. Permitted Use</h3>
            <p>
              You may freely use our destination guides, itineraries, and maps for personal, non-commercial travel planning. Attribution to Ghuraghuri and OpenStreetMap contributors is appreciated when sharing our itineraries.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm sm:text-base font-bold text-foreground">3. Questions & Feedback</h3>
            <p>
              If you discover an outdated phone number, incorrect bus schedule, or have suggestions for new destinations, please reach out directly at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#0f4a38] dark:text-[#2ecc71] font-bold underline">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
