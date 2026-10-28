import type { Metadata } from "next";
import { buildRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRouteMetadata({
  title: "Authentic Restaurants & Food Guide in Bangladesh",
  description:
    "Explore authentic local eateries, traditional Bengali dining, and popular restaurants across Bangladesh. Discover signature dishes and price guides.",
  path: "/restaurants",
});

export default function RestaurantsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
