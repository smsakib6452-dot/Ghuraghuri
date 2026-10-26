import React from "react";

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
    url: "https://ghuraghuri.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://ghuraghuri.com/destinations?q={search_term_string}",
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
    url: "https://ghuraghuri.com",
    logo: "https://ghuraghuri.com/assets/logo.png",
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
    image: `https://ghuraghuri.com/${destination.image}`,
    url: `https://ghuraghuri.com/destinations/${destination.slug}`,
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
