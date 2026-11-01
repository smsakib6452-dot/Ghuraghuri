import type { Metadata } from "next";
import { buildRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRouteMetadata({
  title: "Curated Restaurants & Regional Food Guide in Bangladesh",
  description:
    "Explore curated local restaurants, traditional biriyani houses, and regional dining spots across Bangladesh with signature dishes, prices, and map links.",
  path: "/restaurants",
  image: "/og/restaurants.jpg",
  imageAlt: "Curated Restaurants and Regional Food Guide in Bangladesh",
});

export default function RestaurantsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
