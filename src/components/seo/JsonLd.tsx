import React from "react";
import { SITE_URL, TOTAL_DISTRICTS_OFFICIAL } from "@/lib/constants";
import { SOCIAL_LINKS } from "@/config/footer";

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
    description: `Comprehensive travel guide covering all ${TOTAL_DISTRICTS_OFFICIAL} districts of Bangladesh.`,
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
    url: SITE_URL,
    logo: `${SITE_URL}/assets/logo.png`,
    sameAs: SOCIAL_LINKS,
  };
}

export function getBreadcrumbListSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${SITE_URL}${item.url.startsWith("/") ? "" : "/"}${item.url}`,
    })),
  };
}

export function getTouristAttractionSchema(destination: {
  name: string;
  name_bn?: string;
  description: string;
  image?: string | null;
  latitude: number;
  longitude: number;
  rating?: number;
  reviews?: number;
  category: string;
  division: string;
  district: string;
  slug: string;
}) {
  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: destination.name,
    alternateName: destination.name_bn,
    description: destination.description,
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

  if (destination.image) {
    schema.image = destination.image.startsWith("http")
      ? destination.image
      : `${SITE_URL}/${destination.image.replace(/^\/+/, "")}`;
  }

  return schema;
}
