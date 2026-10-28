import type { Metadata } from "next";
import { SITE_URL } from "./constants";

export interface RouteSeoOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
  isAbsoluteTitle?: boolean;
}

/**
 * Builds standardized, WCAG- and SEO-compliant metadata for any Ghuraghuri route.
 * Emits full OpenGraph and Twitter Card specifications, canonical URL,
 * and respects the root layout title template (`%s | Ghuraghuri`).
 */
export function buildRouteMetadata({
  title,
  description,
  path,
  image = "/og-default.jpg",
  imageAlt = "Ghuraghuri Bangladesh Travel Explorer",
  noIndex = false,
  isAbsoluteTitle = false,
}: RouteSeoOptions): Metadata {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${SITE_URL}${cleanPath === "/" ? "" : cleanPath}`;
  const imageUrl = image.startsWith("http")
    ? image
    : `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;

  // When isAbsoluteTitle is true (e.g. on homepage), bypass root template "%s | Ghuraghuri"
  const titleObj = isAbsoluteTitle ? { absolute: title } : title;

  return {
    title: titleObj,
    description,
    alternates: {
      canonical: cleanPath,
    },
    robots: noIndex
      ? {
          index: false,
          follow: true,
          nocache: true,
          googleBot: {
            index: false,
            follow: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Ghuraghuri",
      type: "website",
      locale: "bn_BD",
      alternateLocale: "en_US",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt || title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
