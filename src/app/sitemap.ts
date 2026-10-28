import { MetadataRoute } from "next";
import destinations from "@/data/destinations.json";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/destinations`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/hotels`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/restaurants`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/transport`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/weather`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/travel`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/chattogram`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const divisionRoutes: MetadataRoute.Sitemap = [
    "chattogram",
    "sylhet",
    "khulna",
    "barishal",
    "dhaka",
    "rajshahi",
    "rangpur",
    "mymensingh",
  ].map((div) => ({
    url: `${baseUrl}/destinations/division/${div}`,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const destinationRoutes: MetadataRoute.Sitemap = destinations.map((dest: any) => {
    const entry: MetadataRoute.Sitemap[number] = {
      url: `${baseUrl}/destinations/${dest.slug}`,
      changeFrequency: "weekly",
      priority: (dest.rating || 0) >= 4.5 ? 0.8 : 0.6,
    };

    // Use a real per-destination date if the data has one, otherwise omit lastModified
    if (dest.updatedAt || dest.lastModified || dest.date) {
      entry.lastModified = new Date(dest.updatedAt || dest.lastModified || dest.date);
    }

    return entry;
  });

  return [...staticRoutes, ...divisionRoutes, ...destinationRoutes];
}
