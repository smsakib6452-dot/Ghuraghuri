import React from "react";
import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center bg-[var(--background)]">
      <div className="max-w-md mx-auto space-y-6">
        <div className="inline-flex p-4 rounded-2xl bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71]">
          <Compass className="w-12 h-12 animate-spin-slow" />
        </div>
        <h1 className="text-6xl font-black text-foreground">404</h1>
        <h2 className="text-2xl font-bold text-foreground">
          রাস্তা হারিয়ে ফেলেছেন? / Page Not Found
        </h2>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          The travel destination or page you are looking for doesn&apos;t exist or has moved. Let&apos;s get you back on track!
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0f4a38] hover:bg-[#156b50] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
          <Link
            href="/destinations"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[var(--glass-border)] text-foreground font-bold text-sm hover:bg-[var(--surface-raised)] transition-all flex items-center justify-center gap-2"
          >
            <span>Browse Destinations</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
