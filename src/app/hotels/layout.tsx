import type { Metadata } from "next";
import { buildRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRouteMetadata({
  title: "Hotels & Eco Resorts in Bangladesh",
  description:
    "Browse curated hotels, eco-lodges, cottages, and resorts across major Bangladesh travel hubs with nightly BDT rates, amenities, and Google Maps links.",
  path: "/hotels",
  image: "/og/hotels.jpg",
  imageAlt: "Hotels and Eco Resorts in Bangladesh",
});

export default function HotelsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
