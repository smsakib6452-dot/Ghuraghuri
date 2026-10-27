"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const DynamicMapSection = dynamic(
  () => import("./MapSection").then((mod) => mod.MapSection),
  {
    ssr: false,
    loading: () => (
      <section className="py-20 bg-[var(--background)] transition-colors min-h-[600px] flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <div className="p-12 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm animate-pulse flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0f4a38]/20 flex items-center justify-center text-2xl">
              🗺️
            </div>
            <div className="h-6 w-64 bg-gray-300 dark:bg-gray-700 rounded-full" />
            <div className="h-4 w-96 max-w-full bg-gray-200 dark:bg-gray-800 rounded-full" />
          </div>
        </div>
      </section>
    ),
  }
);

export function MapSectionLazy() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="min-h-[500px]">
      {shouldLoad ? (
        <DynamicMapSection />
      ) : (
        <section
          id="map"
          className="py-20 bg-[var(--background)] transition-colors min-h-[500px] flex items-center justify-center"
          aria-label="Interactive Map Section Placeholder"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#0f4a38]/10 text-[#0f4a38] dark:text-[#2ecc71] flex items-center justify-center text-2xl">
                📍
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Interactive Map of Bangladesh
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md">
                Explore authentic destinations across 8 divisions with GPS coordinates and live regional insights.
              </p>
              <button
                type="button"
                onClick={() => setShouldLoad(true)}
                className="mt-2 px-5 py-2.5 rounded-xl bg-[#0f4a38] text-white text-xs font-bold hover:bg-[#156b50] transition-colors shadow-sm"
              >
                Load Interactive Map
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
