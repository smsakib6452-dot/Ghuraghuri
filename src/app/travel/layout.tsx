import type { Metadata } from "next";
import { buildRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRouteMetadata({
  title: "Smart Travel Planner, Schedules & Itineraries",
  description:
    "Complete Bangladesh travel guide featuring transport options, curated itineraries, budget calculators, packing checklists, and essential safety tips.",
  path: "/travel",
  image: "/og/travel.jpg",
  imageAlt: "Travel Services and Trip Planner Bangladesh",
});

export default function TravelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
