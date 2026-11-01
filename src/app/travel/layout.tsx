import type { Metadata } from "next";
import { buildRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRouteMetadata({
  title: "Smart Travel Planner, Schedules & Itineraries",
  description:
    "Plan your Bangladesh trip with curated intercity transit routes, regional hotels, local dining spots, and multi-day itineraries across 8 divisions.",
  path: "/travel",
  image: "/og/travel.jpg",
  imageAlt: "Travel Services and Trip Planner Bangladesh",
});

export default function TravelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
