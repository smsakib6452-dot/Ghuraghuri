import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import destinationsData from "@/data/destinations.json";
import translationsData from "@/data/translations.json";
import { Destination, DestinationTranslation } from "@/types/destination";
import { JsonLd, getTouristAttractionSchema, getBreadcrumbListSchema } from "@/components/seo/JsonLd";
import { DestinationDetailClient } from "@/components/destinations/DestinationDetailClient";
import { SITE_URL } from "@/lib/constants";

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
    description: destination.description,
    image: destination.image,
    latitude: destination.latitude,
    longitude: destination.longitude,
    rating: destination.rating,
    reviews: destination.reviews,
    category: destination.category,
    division: destination.division,
    district: destination.district,
    slug: destination.slug,
  });

  const breadcrumbSchema = getBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Destinations", url: "/destinations" },
    { name: destination.division, url: `/destinations?division=${encodeURIComponent(destination.division)}` },
    { name: destination.name, url: `/destinations/${destination.slug}` },
  ]);

  // Nearby or related destinations
  const related = destinations
    .filter((d) => d.division === destination.division && d.id !== destination.id)
    .slice(0, 3);

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
