import type { Metadata } from "next";
import Link from "next/link";
import { Mail, PhoneCall, ShieldAlert, Globe, MessageSquare, MapPin } from "lucide-react";
import { EMERGENCY_CONFIG } from "@/lib/emergency";
import { FOOTER_CONFIG } from "@/config/footer";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Ghuraghuri travel team, tourist emergency helplines, or submit destination feedback.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | Ghuraghuri",
    description: "Get in touch with the Ghuraghuri travel team, tourist emergency helplines, or submit destination feedback.",
    url: `${SITE_URL}/contact`,
    images: [
      {
        url: `${SITE_URL}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "Contact Ghuraghuri",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Ghuraghuri",
    description: "Get in touch with the Ghuraghuri travel team, tourist emergency helplines, or submit destination feedback.",
    images: [`${SITE_URL}/og-default.jpg`],
  },
};

export default function ContactPage() {
  return (
    <div className="py-16 bg-[var(--background)] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] text-xs font-bold">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>যোগাযোগ ও সহায়তা · Get In Touch</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
            Contact & Safety Helpdesk
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            Have questions, feedback, or need travel emergency assistance in Bangladesh? Connect with our team or dial official 24/7 helplines.
          </p>
        </div>

        {/* 24/7 Emergency Helplines Callout */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-500/10 via-rose-500/5 to-amber-500/10 border border-red-500/20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                <ShieldAlert className="w-4 h-4" />
                <span>24/7 Emergency Helplines · জরুরি হেল্পলাইন</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground">
                Immediate Tourist Police & Safety Support
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)]">
                For immediate emergency response across Bangladesh, dial 999 or the dedicated Tourist Police helpline.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={EMERGENCY_CONFIG.nationalEmergency.telLink}
                className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>National Emergency: 999</span>
              </a>
              <a
                href={EMERGENCY_CONFIG.touristPolice.telLink}
                className="px-5 py-3 rounded-2xl bg-[#0f4a38] hover:bg-[#156b50] text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Tourist Police: {EMERGENCY_CONFIG.touristPolice.display}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Official Government Portal</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Official guidelines, camp locations, and incident reporting via Bangladesh Police.
            </p>
            <a
              href={EMERGENCY_CONFIG.touristPoliceOfficialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f4a38] dark:text-[#2ecc71] hover:underline pt-2"
            >
              <span>touristpolice.gov.bd ↗</span>
            </a>
          </div>

          <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Direct Feedback</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Have suggestions or corrections for destinations? Send us your travel stories and updates.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              aria-label={`Send email to Ghuraghuri helpdesk at ${CONTACT_EMAIL}`}
              className="text-xs font-bold text-foreground hover:text-[#0f4a38] dark:hover:text-[#2ecc71] underline underline-offset-4 pt-2 inline-block transition-colors"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Community & Social</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Follow our official channels for fresh photography, weather updates, and itinerary tips.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {FOOTER_CONFIG.socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#0f4a38] dark:text-[#2ecc71] hover:underline"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Back navigation */}
        <div className="text-center pt-6">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] text-foreground font-bold text-xs hover:border-[#0f4a38] transition-colors"
          >
            <span>← Explore 271+ Destinations</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
