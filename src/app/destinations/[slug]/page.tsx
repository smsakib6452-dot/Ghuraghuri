import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import destinationsData from "@/data/destinations.json";
import translationsData from "@/data/translations.json";
import { Destination, DestinationTranslation } from "@/types/destination";
import { JsonLd, getTouristAttractionSchema, getBreadcrumbListSchema } from "@/components/seo/JsonLd";
import { DestinationDetailClient } from "@/components/destinations/DestinationDetailClient";
import { SITE_URL } from "@/lib/constants";
import { getDestinationImage } from "@/lib/destination-image";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const destinations = destinationsData as unknown as Destination[];
  return destinations.map((d) => ({
    slug: d.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const destinations = destinationsData as unknown as Destination[];
  const destination = destinations.find((d) => d.slug === slug);

  if (slug === "division" || !destination) {
    return {
      title: "Destination Not Found",
    };
  }

  const title = `${destination.name} Travel Guide`;
  const desc = destination.shortDesc;
  const ogImgUrl = `${SITE_URL}/og/destinations/${destination.slug}.jpg`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: `/destinations/${destination.slug}`,
    },
    openGraph: {
      title,
      description: desc,
      images: [
        {
          url: ogImgUrl,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: `${destination.name} Travel Guide — Ghuraghuri`,
        },
      ],
      url: `${SITE_URL}/destinations/${destination.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: [ogImgUrl],
    },
    robots: destination.needsReview
      ? {
          index: false,
          follow: true,
        }
      : undefined,
  };
}

export default async function DestinationDetailPage({ params }: Props) {
  const { slug } = await params;
  const destinations = destinationsData as unknown as Destination[];
  const destination = destinations.find((d) => d.slug === slug);

  if (slug === "division" || !destination) {
    notFound();
  }

  const schema = getTouristAttractionSchema({
    name: destination.name,
    name_bn: destination.name_bn,
    alternateNames: destination.alternateNames,
    description: destination.description,
    image: getDestinationImage(destination),
    latitude: destination.latitude,
    longitude: destination.longitude,
    category: destination.category,
    division: destination.division,
    district: destination.district,
    slug: destination.slug,
    imageCredit: destination.imageCredit,
  });

  const breadcrumbSchema = getBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Destinations", url: "/destinations" },
    { name: destination.division, url: `/destinations/division/${destination.division.toLowerCase()}` },
    { name: destination.name, url: `/destinations/${destination.slug}` },
  ]);

  // Nearest 4 destinations in the same division, preferring ones that are not quarantined
  const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const related = destinations
    .filter((d) => d.division === destination.division && d.id !== destination.id)
    .map((d) => ({
      dest: d,
      hasCleanImage: Boolean(getDestinationImage(d)),
      distKm:
        typeof destination.latitude === "number" &&
        typeof destination.longitude === "number" &&
        typeof d.latitude === "number" &&
        typeof d.longitude === "number"
          ? haversineKm(destination.latitude, destination.longitude, d.latitude, d.longitude)
          : 9999,
    }))
    .sort((a, b) => {
      if (a.hasCleanImage !== b.hasCleanImage) {
        return a.hasCleanImage ? -1 : 1;
      }
      return a.distKm - b.distKm;
    })
    .slice(0, 4)
    .map((entry) => entry.dest);

  const destinationTranslation = (translationsData as Record<string, DestinationTranslation>)[destination.slug] || null;

  return (
    <>
      <JsonLd data={[schema, breadcrumbSchema]} id={`jsonld-tourist-${destination.slug}`} />
      <DestinationDetailClient
        destination={destination}
        related={related}
        translation={destinationTranslation}
      />
    </>
  );
}
