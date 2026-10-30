import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { ExperienceSection } from "@/components/home/ExperienceSection";
import { MapSectionLazy } from "@/components/home/MapSectionLazy";
import { DivisionsSection } from "@/components/home/DivisionsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ChattogramPromo } from "@/components/home/ChattogramPromo";
import { TripQuizModal } from "@/components/home/TripQuizModal";
import destinationsData from "@/data/destinations.json";
import translationsData from "@/data/translations.json";
import { Destination } from "@/types/destination";
import { JsonLd, getWebsiteSchema, getOrganizationSchema } from "@/components/seo/JsonLd";
import { getDestinationImage } from "@/lib/destination-image";

import { buildRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRouteMetadata({
  title: "Ghuraghuri — Bangladesh Travel Explorer | ঘুরাঘুরি",
  description:
    "Discover 295+ authentic tourist spots across all 8 divisions of Bangladesh. Explore hill tracks, sandy beaches, tea gardens, and complete travel guides.",
  path: "/",
  isAbsoluteTitle: true,
});

export default function HomePage() {
  const trData = translationsData as Record<string, any>;
  const curatedDestinations = (destinationsData as unknown as Destination[])
    .filter(
      (d) =>
        d.featured ||
        d.popularity === "high" ||
        ["Beach", "Island", "Hill", "Mountain", "Waterfall", "Historical", "Archaeological", "Heritage"].includes(d.category)
    )
    .slice(0, 40)
    .map((d) => {
      const tr = trData[d.slug];
      return {
        id: d.id,
        slug: d.slug,
        name: d.name,
        name_bn: d.name_bn,
        division: d.division,
        district: d.district,
        category: d.category,
        categories: d.categories || [],
        rating: d.rating,
        reviews: d.reviews,
        image: getDestinationImage(d) || "",
        recommendedDays: d.recommendedDays,
        shortDesc: d.shortDesc,
        shortDesc_bn: tr?.shortDesc,
        recommendedDays_bn: tr?.recommendedDays,
        featured: d.featured,
        popularity: d.popularity,
      };
    }) as unknown as Destination[];

  return (
    <>
      {/* Search Engine Structured Data - WebSite + Organization strictly on Homepage */}
      <JsonLd data={[getWebsiteSchema(), getOrganizationSchema()]} id="jsonld-home-schema" />

      {/* 1. Iconic 2-Column Hero Section with Featured Spotlight & Marquee */}
      <HeroSection />

      {/* 2. Top Curated & Featured Destinations */}
      <FeaturedSection destinations={curatedDestinations} />

      {/* 3. Explore by Experience (Hills, Beaches, Forests, Heritage, etc.) */}
      <ExperienceSection />

      {/* 4. Interactive Leaflet Map of Bangladesh (Loaded on viewport proximity) */}
      <MapSectionLazy />

      {/* 5. 8 Divisions Cultural & Scenic Explorer */}
      <DivisionsSection />

      {/* 6. Chattogram Interactive Poster Studio Promo */}
      <ChattogramPromo />

      {/* 7. Complete Travel Hub (Hotels, Dining, Transport, Tourist Police) */}
      <ServicesSection />

      {/* 7. Smart Trip Quiz Modal */}
      <TripQuizModal />
    </>
  );
}
