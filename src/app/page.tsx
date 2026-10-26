import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { ExperienceSection } from "@/components/home/ExperienceSection";
import { MapSection } from "@/components/home/MapSection";
import { DivisionsSection } from "@/components/home/DivisionsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { TripQuizModal } from "@/components/home/TripQuizModal";
import destinationsData from "@/data/destinations.json";
import { Destination } from "@/types/destination";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  const destinations = destinationsData as unknown as Destination[];

  return (
    <>
      {/* 1. Iconic 2-Column Hero Section with Featured Spotlight & Marquee */}
      <HeroSection />

      {/* 2. Top Curated & Featured Destinations */}
      <FeaturedSection destinations={destinations} />

      {/* 3. Explore by Experience (Hills, Beaches, Forests, Heritage, etc.) */}
      <ExperienceSection />

      {/* 4. Interactive Leaflet Map of Bangladesh */}
      <MapSection />

      {/* 5. 8 Divisions Cultural & Scenic Explorer */}
      <DivisionsSection />

      {/* 6. Complete Travel Hub (Hotels, Dining, Transport, Tourist Police) */}
      <ServicesSection />

      {/* 7. Smart Trip Quiz Modal */}
      <TripQuizModal />
    </>
  );
}

