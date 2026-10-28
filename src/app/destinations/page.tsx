import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import destinationsData from "@/data/destinations.json";
import translationsData from "@/data/translations.json";
import { Destination } from "@/types/destination";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { DestinationsFilterControls } from "@/components/destinations/DestinationsFilterControls";
import { Compass, ChevronLeft, ChevronRight } from "lucide-react";
import { buildRouteMetadata } from "@/lib/seo";
import { CATEGORY_GROUPS, resolveCategoryGroup } from "@/lib/constants";

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

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const sp: DestinationsSearchParams = (await props.searchParams) || {};
  const q = (sp.q || "").trim();
  const division = (sp.division || "").trim();
  const category = (sp.category || "").trim();
  const requestedPage = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const hasFilter = Boolean(q || division || category);
  const isPaginated = !hasFilter && requestedPage > 1;

  // Filtered URLs canonicalize to /destinations with noindex,follow
  // Paginated ?page=N pages get self-referencing canonical
  const canonicalPath = isPaginated
    ? `/destinations?page=${requestedPage}`
    : `/destinations`;

  return buildRouteMetadata({
    title: "Explore 295+ Destinations Across Bangladesh",
    description:
      "Browse 295+ curated travel destinations across Bangladesh. Filter by division, landscape category, or popularity to plan your ideal Bangladesh journey.",
    path: canonicalPath,
    noIndex: hasFilter,
  });
}

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

const CATEGORIES = Object.keys(CATEGORY_GROUPS);

const PAGE_SIZE = 24;

export default async function DestinationsPage(props: PageProps) {
  const sp: DestinationsSearchParams = (await props.searchParams) || {};

  const q = (sp.q || "").trim();
  const division = sp.division || "";
  const category = sp.category || "";
  const sort = sp.sort || "popular";
  const requestedPage = Math.max(1, parseInt(sp.page || "1", 10) || 1);

  const allDestinations = destinationsData as unknown as Destination[];
  const targetCategoryGroup = resolveCategoryGroup(category);

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
        if (targetCategoryGroup) {
          if (resolveCategoryGroup(item.category) !== targetCategoryGroup) {
            return false;
          }
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
      // Most Popular sort: popularity numeric weight first, then rating, then name
      const pA = typeof a.popularity === "number" ? a.popularity : 0;
      const pB = typeof b.popularity === "number" ? b.popularity : 0;
      if (pB !== pA) return pB - pA;
      if (b.rating !== a.rating) return b.rating - a.rating;
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
                : targetCategoryGroup
                ? `${targetCategoryGroup} Destinations in Bangladesh`
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
                    priority={idx < 4}
                  />
                );
              })}
            </div>

            {/* Accessible Server-Driven Pagination */}
            {totalPages > 1 && (
              <nav
                className="mt-12 flex items-center justify-center gap-2"
                aria-label="Destinations Pagination"
              >
                {currentPage > 1 ? (
                  <Link
                    href={buildUrl(currentPage - 1)}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[var(--surface)] border border-[var(--glass-border)] text-foreground hover:bg-[var(--surface-raised)] transition-colors min-h-[40px]"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev</span>
                  </Link>
                ) : (
                  <span
                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[var(--surface)]/50 border border-[var(--glass-border)]/50 text-[var(--text-muted)] opacity-50 cursor-not-allowed min-h-[40px]"
                    aria-disabled="true"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev</span>
                  </span>
                )}

                <div className="flex items-center gap-1.5 px-3">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      if (totalPages <= 7) return true;
                      if (p === 1 || p === totalPages) return true;
                      return Math.abs(p - currentPage) <= 1;
                    })
                    .map((p, idx, arr) => {
                      const prevPage = arr[idx - 1];
                      const showEllipsis = prevPage && p - prevPage > 1;

                      return (
                        <React.Fragment key={p}>
                          {showEllipsis && (
                            <span className="px-2 text-xs text-[var(--text-muted)] select-none">
                              …
                            </span>
                          )}
                          <Link
                            href={buildUrl(p)}
                            className={`min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl text-xs sm:text-sm font-bold transition-all ${
                              currentPage === p
                                ? "bg-[#0f4a38] text-white dark:bg-[#1f9d76] shadow-sm pointer-events-none"
                                : "bg-[var(--surface)] text-[var(--text-muted)] hover:text-foreground border border-[var(--glass-border)] hover:bg-[var(--surface-raised)]"
                            }`}
                            aria-current={currentPage === p ? "page" : undefined}
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
                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[var(--surface)] border border-[var(--glass-border)] text-foreground hover:bg-[var(--surface-raised)] transition-colors min-h-[40px]"
                    aria-label="Next Page"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <span
                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[var(--surface)]/50 border border-[var(--glass-border)]/50 text-[var(--text-muted)] opacity-50 cursor-not-allowed min-h-[40px]"
                    aria-disabled="true"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </nav>
            )}
          </>
        ) : (
          <div className="py-20 text-center rounded-3xl bg-[var(--surface)] border border-[var(--glass-border)] p-8">
            <Compass className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4 animate-spin-slow" />
            <h2 className="text-xl font-bold text-foreground">No destinations found</h2>
            <p className="text-sm text-[var(--text-muted)] mt-1 max-w-md mx-auto">
              We couldn&apos;t find any spots matching your current filters. Try resetting the search or category filters.
            </p>
            <Link
              href="/destinations"
              className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0f4a38] hover:bg-[#156b50] text-white text-xs font-bold transition-all shadow-sm"
            >
              Reset All Filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
