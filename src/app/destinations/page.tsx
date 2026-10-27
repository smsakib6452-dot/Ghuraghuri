import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import destinationsData from "@/data/destinations.json";
import translationsData from "@/data/translations.json";
import { Destination } from "@/types/destination";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { DestinationsFilterControls } from "@/components/destinations/DestinationsFilterControls";
import { Compass, ChevronLeft, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Explore All Destinations in Bangladesh | Ghuraghuri",
  description: "Browse 295+ authentic travel destinations across all 8 divisions of Bangladesh. Find beaches, hills, waterfalls, tea gardens, and historic monuments.",
  alternates: {
    canonical: "/destinations",
  },
  openGraph: {
    title: "Explore All Destinations in Bangladesh | Ghuraghuri",
    description: "Browse 295+ authentic travel destinations across all 8 divisions of Bangladesh.",
    url: "https://ghuraghuri.vercel.app/destinations",
  },
};

const DIVISIONS = [
  "Chattogram",
  "Sylhet",
  "Khulna",
  "Barishal",
  "Dhaka",
  "Rajshahi",
  "Rangpur",
  "Mymensingh",
];

const CATEGORIES = [
  "Beach",
  "Hill",
  "Waterfall",
  "Forest",
  "Island",
  "Haor",
  "Historical",
  "Archaeological",
  "Religious",
  "Heritage",
];

const PAGE_SIZE = 24;

export interface DestinationsSearchParams {
  q?: string;
  division?: string;
  category?: string;
  sort?: string;
  page?: string;
}

interface PageProps {
  searchParams?: Promise<DestinationsSearchParams>;
}

export default async function DestinationsPage(props: PageProps) {
  const sp: DestinationsSearchParams = (await props.searchParams) || {};

  const q = (sp.q || "").trim();
  const division = sp.division || "";
  const category = sp.category || "";
  const sort = sp.sort || "popular";
  const requestedPage = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const allDestinations = destinationsData as unknown as Destination[];

  // Server-side Filtering
  const filtered = allDestinations
    .filter((item) => {
      if (q) {
        const qLower = q.toLowerCase();
        const matchName = item.name.toLowerCase().includes(qLower);
        const matchBn = item.name_bn?.toLowerCase().includes(qLower);
        const matchDistrict = item.district.toLowerCase().includes(qLower);
        const matchCat = item.category.toLowerCase().includes(qLower);
        if (!matchName && !matchBn && !matchDistrict && !matchCat) return false;
      }

      if (division && item.division !== division) {
        return false;
      }

      if (category) {
        if (category === "Heritage" || category === "Historical") {
          const isHistoricalOrArch =
            item.category === "Historical" ||
            item.category === "Archaeological" ||
            item.category === "Heritage" ||
            item.categories?.includes("Historical") ||
            item.categories?.includes("Archaeological") ||
            item.categories?.includes("Heritage");
          if (!isHistoricalOrArch) return false;
        } else if (item.category !== category && !item.categories?.includes(category)) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (sort === "name") {
        return a.name.localeCompare(b.name);
      }
      const popWeight: Record<string, number> = { high: 3, medium: 2, low: 1 };
      const pA = (popWeight[a.popularity || ""] || 0) + (a.featured ? 2 : 0);
      const pB = (popWeight[b.popularity || ""] || 0) + (b.featured ? 2 : 0);
      if (pB !== pA) return pB - pA;
      return a.name.localeCompare(b.name);
    });

  const totalResults = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedDestinations = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  const buildUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (division) params.set("division", division);
    if (category) params.set("category", category);
    if (sort && sort !== "popular") params.set("sort", sort);
    if (targetPage > 1) params.set("page", targetPage.toString());
    const qs = params.toString();
    return qs ? `/destinations?${qs}` : "/destinations";
  };

  return (
    <div className="py-8 sm:py-12 bg-[var(--background)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Server Rendered Header Block with Crawlable H1 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0f4a38]/10 text-[#0f4a38] dark:bg-[#1f9d76]/20 dark:text-[#2ecc71] text-xs font-bold mb-2">
              <Compass className="w-4 h-4 text-[#f4a340]" />
              <span>Comprehensive Bangladesh Directory</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
              {division
                ? `${division} Division Destinations`
                : category
                ? `${category} Destinations in Bangladesh`
                : "Explore All Destinations"}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-medium mt-1">
              Found {totalResults} of {allDestinations.length} curated destinations across 64 districts
              {totalPages > 1 ? ` (Page ${currentPage} of ${totalPages})` : ""}
            </p>
          </div>
        </div>

        {/* Lightweight Client Controls (updates URL searchParams, does NOT bundle full dataset) */}
        <DestinationsFilterControls
          initialQuery={q}
          initialDivision={division}
          initialCategory={category}
          initialSort={sort}
          divisions={DIVISIONS}
          categories={CATEGORIES}
          totalResults={totalResults}
        />

        {/* 24 Server-Rendered Destination Cards */}
        {paginatedDestinations.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedDestinations.map((destination, idx) => {
                const tr = (translationsData as Record<string, any>)[destination.slug];
                const destWithTr = {
                  ...destination,
                  shortDesc_bn: tr?.shortDesc,
                  recommendedDays_bn: tr?.recommendedDays,
                };
                return (
                  <DestinationCard
                    key={destination.id}
                    destination={destWithTr}
                    priority={idx < 2 && currentPage === 1}
                  />
                );
              })}
            </div>

            {/* Crawlable Pagination Bar with Real Links */}
            {totalPages > 1 && (
              <nav aria-label="Destinations pagination" className="mt-14 flex items-center justify-center gap-2">
                {currentPage > 1 ? (
                  <Link
                    href={buildUrl(currentPage - 1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] text-xs font-bold text-foreground hover:border-[#0f4a38] transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </Link>
                ) : null}

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                    .map((p, index, array) => {
                      const prevPage = array[index - 1];
                      const showEllipsis = prevPage && p - prevPage > 1;
                      const isCurrent = p === currentPage;

                      return (
                        <React.Fragment key={p}>
                          {showEllipsis && (
                            <span className="px-2 text-xs text-[var(--text-muted)]">...</span>
                          )}
                          <Link
                            href={buildUrl(p)}
                            className={`min-w-[40px] h-10 px-3 rounded-2xl flex items-center justify-center text-xs font-bold transition-all ${
                              isCurrent
                                ? "bg-[#0f4a38] text-white shadow-md"
                                : "bg-[var(--surface)] border border-[var(--glass-border)] text-foreground hover:border-[#0f4a38]"
                            }`}
                            aria-current={isCurrent ? "page" : undefined}
                          >
                            {p}
                          </Link>
                        </React.Fragment>
                      );
                    })}
                </div>

                {currentPage < totalPages ? (
                  <Link
                    href={buildUrl(currentPage + 1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] text-xs font-bold text-foreground hover:border-[#0f4a38] transition-colors"
                    aria-label="Next page"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : null}
              </nav>
            )}
          </>
        ) : (
          <div className="text-center py-20 px-4 rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)]">
            <Compass className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-3 opacity-50" />
            <h2 className="text-xl font-bold text-foreground">No Destinations Found</h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1 mb-6">
              Try adjusting your search criteria or resetting active filters.
            </p>
            <Link
              href="/destinations"
              className="inline-block px-6 py-2.5 rounded-xl bg-[#0f4a38] text-white font-bold text-xs shadow-md"
            >
              Reset All Filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
