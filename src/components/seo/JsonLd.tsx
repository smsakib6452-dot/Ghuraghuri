import React from "react";
import { SITE_URL } from "@/lib/constants";

interface JsonLdProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
  id?: string;
}

export function JsonLd({ data, id = "jsonld-schema" }: JsonLdProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ghuraghuri — Bangladesh Travel Explorer",
    alternateName: ["ঘুরাঘুরি", "ঘোরাঘুরি"],
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/destinations?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ghuraghuri",
    legalName: "Ghuraghuri Travel Technologies",
    url: SITE_URL,
    logo: `${SITE_URL}/assets/logo.png`,
    sameAs: [
      "https://facebook.com/ghuraghuri",
      "https://instagram.com/ghuraghuri",
      "https://twitter.com/ghuraghuri",
    ],
  };
}

export function getTouristAttractionSchema(destination: {
  name: string;
  name_bn?: string;
  description: string;
  image: string;
  latitude: number;
  longitude: number;
  rating?: number;
  reviews?: number;
  category: string;
  division: string;
  district: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: destination.name,
    alternateName: destination.name_bn,
    description: destination.description,
    image: destination.image.startsWith("http")
      ? destination.image
      : `${SITE_URL}/${destination.image.replace(/^\/+/, "")}`,
    url: `${SITE_URL}/destinations/${destination.slug}`,
    geo: {
      "@type": "GeoCoordinates",
      latitude: destination.latitude,
      longitude: destination.longitude,
    },
    address: {
      "@type": "PostalAddress",
      addressRegion: destination.division,
      addressLocality: destination.district,
      addressCountry: "BD",
    },
    touristType: destination.category,
  };
}
