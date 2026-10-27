"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log non-sensitive diagnostic info in local development
    if (process.env.NODE_ENV !== "production") {
      console.error("Application error boundary triggered:", error);
    }
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center bg-[var(--background)]">
      <div className="max-w-md mx-auto space-y-6">
        <div className="inline-flex p-4 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-foreground">
          কিছু সমস্যা হয়েছে
        </h1>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Something Went Wrong
        </h2>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          পেজটি লোড করার সময় একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন অথবা মূল পাতায় ফিরে যান।
        </p>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          An unexpected error occurred while rendering this page. You can try reloading or navigate back home safely.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0f4a38] hover:bg-[#156b50] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>আবার চেষ্টা করুন / Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[var(--glass-border)] text-foreground font-bold text-sm hover:bg-[var(--surface-raised)] transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>হোমে ফিরুন / Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
