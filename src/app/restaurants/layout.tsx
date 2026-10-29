import type { Metadata } from "next";
import { buildRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRouteMetadata({
  title: "Authentic Restaurants & Food Guide in Bangladesh",
  description:
    "Explore authentic local eateries, traditional Bengali dining, and popular restaurants across Bangladesh. Discover signature dishes, price guides, and maps.",
  path: "/restaurants",
  image: "/og/restaurants.jpg",
  imageAlt: "Authentic Restaurants and Food Guide in Bangladesh",
});

export default function RestaurantsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
