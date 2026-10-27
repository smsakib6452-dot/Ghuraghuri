"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error("Root layout error boundary triggered:", error);
    }
  }, [error]);

  return (
    <html lang="bn">
      <body className="min-h-screen flex items-center justify-center px-4 py-16 text-center bg-[#fbfdfc] dark:bg-[#061510] text-[#0d211a] dark:text-[#e8f3ee] font-sans antialiased">
        <div className="max-w-md mx-auto space-y-6">
          <div className="inline-flex p-4 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-12 h-12" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black">
            গুরুতর সমস্যা হয়েছে
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold">
            Critical System Error
          </h2>
          <p className="text-sm opacity-80 leading-relaxed">
            অ্যাপ্লিকেশন লোড করার সময় একটি সিস্টেম ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।
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
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-black/10 dark:border-white/10 font-bold text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              <span>হোমে ফিরুন / Go Home</span>
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
