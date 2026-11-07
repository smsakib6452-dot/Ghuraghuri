import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Camera, ShieldCheck, Scale, Info, Sparkles } from "lucide-react";
import destinationsData from "@/data/destinations.json";
import { Destination } from "@/types/destination";

export const metadata: Metadata = {
  title: "Image Credits & Licensing — Ghuraghuri",
  description:
    "Attribution and open-source licensing documentation for authentic Wikimedia Commons photographs used across Ghuraghuri's Bangladesh travel explorer.",
};

export default function CreditsPage() {
  const destinations = destinationsData as Destination[];

  const creditedDestinations = destinations
    .filter((d) => d.imageCredit || (d.image && d.image.includes("-commons.webp")))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="min-h-screen bg-[var(--background)] text-foreground pb-20">
      {/* Breadcrumb Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-[var(--text-muted)] font-medium mb-6"
        >
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-bold">Credits & Licensing</span>
        </nav>

        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f4a38]/15 text-[#0f4a38] dark:text-[#2ecc71] text-xs font-bold mb-4 border border-[#0f4a38]/20">
            <Camera className="w-3.5 h-3.5" />
            <span>Open Culture Photography</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
            Image Credits & Licensing
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            Ghuraghuri is committed to truthful travel documentation and complete attribution.
            Below is the full registry of open-licensed photographs sourced from Wikimedia Commons
            contributors across Bangladesh.
          </p>
        </div>
      </div>

      {/* Licensing Policy & Compliance Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#0f4a38]/20 text-[#0f4a38] dark:text-[#2ecc71] flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold mb-2">Authentic Documentation</h2>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              We never use AI-generated landscape imagery or unverified stock photos. Every landmark
              image is verified against genuine geographical and historical coordinates.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#f4a340]/20 text-[#f4a340] flex items-center justify-center mb-4">
              <Scale className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold mb-2">Creative Commons Compliance</h2>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              All imagery adheres to CC0, Public Domain, CC BY, or CC BY-SA licenses. In compliance
              with CC BY-SA (ShareAlike), our optimized derivative images provide direct links to the original authors, licenses, and repository sources.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold mb-2">Technical Processing Note</h2>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              All images listed below have been resized from the Wikimedia Commons original and
              converted to high-efficiency WebP format (under 350 KB) strictly for web performance and responsive delivery.
            </p>
          </div>
        </div>
      </div>

      {/* Credit Registry */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">
            Wikimedia Commons Attribution Registry ({creditedDestinations.length})
          </h2>
        </div>

        {/* Mobile View: Clean Card List */}
        <div className="md:hidden space-y-3">
          {creditedDestinations.map((d) => {
            const credit = d.imageCredit;
            const author = credit?.author || "Wikimedia Commons Contributor";
            const authorUrl = credit?.authorUrl || credit?.sourceUrl;
            const license = credit?.license || "Creative Commons";
            const licenseUrl = credit?.licenseUrl || "https://creativecommons.org/";
            const sourceUrl = credit?.sourceUrl || "https://commons.wikimedia.org/";
            const cleanImg = d.image ? d.image.replace(/^\/+/, "") : "";

            return (
              <div
                key={d.slug}
                className="p-4 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)] shadow-xs flex items-start gap-3.5"
              >
                {d.image ? (
                  <div className="relative w-16 h-14 rounded-lg overflow-hidden border border-[var(--glass-border)] bg-black/10 shrink-0 mt-0.5">
                    <Image
                      src={`/${cleanImg}`}
                      alt={d.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-14 rounded-lg bg-black/10 shrink-0 mt-0.5" />
                )}

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/destinations/${d.slug}`}
                    className="font-bold text-sm hover:text-[#f4a340] hover:underline transition-colors block truncate"
                  >
                    {d.name}
                  </Link>
                  <p className="text-xs text-[var(--text-muted)] truncate mb-2">
                    {d.district}, {d.division}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-[var(--text-muted)]">By:</span>
                    {authorUrl ? (
                      <a
                        href={authorUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-foreground hover:text-[#f4a340] inline-flex items-center gap-0.5 underline decoration-[var(--text-muted)]/40"
                      >
                        <span className="truncate max-w-[130px]">{author}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-60" />
                      </a>
                    ) : (
                      <span className="font-medium text-foreground truncate max-w-[130px]">{author}</span>
                    )}

                    <a
                      href={licenseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--surface-raised)] border border-[var(--glass-border)] text-foreground hover:border-[#f4a340] transition-colors"
                    >
                      {license}
                    </a>

                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[var(--text-muted)] hover:text-[#f4a340] underline decoration-[var(--text-muted)]/40 inline-flex items-center gap-0.5"
                    >
                      <span>Commons</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop / Tablet Table View */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-[var(--glass-border)] bg-[var(--surface)] shadow-sm">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--glass-border)] bg-[var(--surface-raised)]/60 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                <th scope="col" className="py-4 px-4 sm:px-6">Destination</th>
                <th scope="col" className="py-4 px-4">Preview</th>
                <th scope="col" className="py-4 px-4 sm:px-6">Author / Contributor</th>
                <th scope="col" className="py-4 px-4">License</th>
                <th scope="col" className="py-4 px-4 sm:px-6">Source Repository</th>
                <th scope="col" className="py-4 px-4 sm:px-6">Derivative Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--glass-border)]">
              {creditedDestinations.map((d) => {
                const credit = d.imageCredit;
                const author = credit?.author || "Wikimedia Commons Contributor";
                const authorUrl = credit?.authorUrl || credit?.sourceUrl;
                const license = credit?.license || "Creative Commons";
                const licenseUrl = credit?.licenseUrl || "https://creativecommons.org/";
                const sourceUrl = credit?.sourceUrl || "https://commons.wikimedia.org/";
                const cleanImg = d.image ? d.image.replace(/^\/+/, "") : "";

                return (
                  <tr
                    key={d.slug}
                    className="hover:bg-[var(--surface-raised)]/40 transition-colors"
                  >
                    <td className="py-4 px-4 sm:px-6 font-semibold">
                      <Link
                        href={`/destinations/${d.slug}`}
                        className="hover:text-[#f4a340] hover:underline transition-colors block"
                      >
                        {d.name}
                      </Link>
                      <span className="text-xs text-[var(--text-muted)] block mt-0.5">
                        {d.district}, {d.division}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {d.image ? (
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-[var(--glass-border)] bg-black/10 shrink-0">
                          <Image
                            src={`/${cleanImg}`}
                            alt={d.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-12 rounded-lg bg-black/10" />
                      )}
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      {authorUrl ? (
                        <a
                          href={authorUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-foreground hover:text-[#f4a340] inline-flex items-center gap-1 underline decoration-[var(--text-muted)]/40 hover:decoration-[#f4a340] transition-colors"
                        >
                          <span>{author}</span>
                          <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
                        </a>
                      ) : (
                        <span className="font-medium text-foreground">{author}</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <a
                        href={licenseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--surface-raised)] border border-[var(--glass-border)] text-foreground hover:border-[#f4a340] transition-colors"
                      >
                        <span>{license}</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                      </a>
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <a
                        href={sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-foreground/80 hover:text-[#f4a340] inline-flex items-center gap-1.5 underline decoration-[var(--text-muted)]/40 hover:decoration-[#f4a340] transition-colors"
                      >
                        <span>Wikimedia Commons</span>
                        <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
                      </a>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-xs text-[var(--text-muted)]">
                      Resized from the Wikimedia Commons original and converted to WebP for web performance.
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Notice */}
        <div className="mt-8 p-4 rounded-xl bg-[var(--surface)] border border-[var(--glass-border)] flex items-start gap-3 text-xs text-[var(--text-muted)]">
          <Info className="w-4 h-4 text-[#f4a340] shrink-0 mt-0.5" />
          <p>
            If you are the copyright holder of any image displayed on Ghuraghuri and believe an attribution requires update, correction, or license clarification, please contact us immediately via our <Link href="/contact" className="underline hover:text-foreground">Contact page</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
