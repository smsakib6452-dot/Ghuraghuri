import type { Metadata } from "next";
import { buildRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRouteMetadata({
  title: "Best Hotels, Resorts & Eco-Stays in Bangladesh",
  description:
    "Find top-rated hotels, eco-resorts, and guest houses across Bangladesh. Compare prices, amenities, and curated guest reviews to book the perfect stay.",
  path: "/hotels",
});

export default function HotelsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
