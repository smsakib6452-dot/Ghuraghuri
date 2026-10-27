import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Mail, ArrowLeft, Lock, EyeOff, CheckCircle2 } from "lucide-react";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Ghuraghuri protects your privacy, what limited information is collected, and how we handle data.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Ghuraghuri",
    description: "Learn how Ghuraghuri protects your privacy. Transparent, open, and tracker-free travel exploration.",
    url: `${SITE_URL}/privacy`,
    images: [`${SITE_URL}/og-default.jpg`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Ghuraghuri",
    description: "Transparent, open, and tracker-free travel exploration in Bangladesh.",
    images: [`${SITE_URL}/og-default.jpg`],
  },
};

export default function PrivacyPage() {
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
            <ShieldCheck className="w-4 h-4" />
            <span>গোপনীয়তা ও স্বচ্ছতা নীতি / Transparency & Privacy</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
            Ghuraghuri is built on open travel data and respect for traveler privacy. We believe in minimal data collection and maximum transparency.
          </p>
        </div>

        {/* Core Commitments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] flex items-center justify-center">
              <EyeOff className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-foreground">Zero Tracking Ads</h2>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              We do not use invasive third-party ad networks, behavioural tracking pixels, or cross-site data broker scripts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-foreground">No Account Required</h2>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              All 280+ destinations, route guides, and hotel lookups are 100% accessible without registration or passwords.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-[#2ecc71]" />
            </div>
            <h2 className="text-base font-bold text-foreground">Consent-First Email</h2>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              We collect your email address only if you voluntarily subscribe to our travel insights. You can unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8 bg-[var(--surface)] border border-[var(--glass-border)] p-6 sm:p-10 rounded-3xl">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span>১. আমরা কী তথ্য সংগ্রহ করি? (What We Collect)</span>
            </h2>
            <ul className="text-xs sm:text-sm text-[var(--text-muted)] space-y-2 list-disc list-inside leading-relaxed">
              <li>
                <strong className="text-foreground">Newsletter Email:</strong> Only your email address, and strictly when you voluntarily submit it via the newsletter form.
              </li>
              <li>
                <strong className="text-foreground">Local Preferences:</strong> Saved destination bookmarks and language toggles are stored entirely in your local browser (`localStorage`) and never transmitted to any central database.
              </li>
            </ul>
          </section>

          <section className="space-y-3 pt-6 border-t border-[var(--glass-border)]">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span>২. কেন আমরা তথ্য ব্যবহার করি? (Why We Use Data)</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              Subscribed email addresses are used exclusively to deliver seasonal travel itineraries, newly curated destinations, and service announcements. We never sell, rent, or trade your contact information to third parties.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-[var(--glass-border)]">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span>৩. তৃতীয় পক্ষের উন্মুক্ত সেবা (Third-Party Open Services)</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              To deliver live weather and maps, Ghuraghuri queries public open APIs (Open-Meteo for weather, OpenStreetMap for base tiles and geocoding, and OSRM for highway distance estimates). These queries send coordinate parameters only and do not transmit personally identifiable data.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-[var(--glass-border)]">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <span>৪. আমাদের সাথে যোগাযোগ (Contact Us)</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
              If you have any questions, feedback regarding our privacy practices, or wish to request immediate removal of your email from our newsletter dispatch:
            </p>
            <div className="pt-2">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                aria-label={`Send privacy inquiries to ${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 text-xs font-bold text-foreground hover:text-[#0f4a38] dark:hover:text-[#2ecc71] underline underline-offset-4 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>{CONTACT_EMAIL}</span>
              </a>
            </div>
          </section>

          <div className="pt-6 border-t border-[var(--glass-border)] flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>Last updated: October 2026</span>
            <span>Ghuraghuri · Open Travel Platform</span>
          </div>
        </div>
      </div>
    </div>
  );
}
