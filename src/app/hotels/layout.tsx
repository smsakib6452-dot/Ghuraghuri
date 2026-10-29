import type { Metadata } from "next";
import { buildRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRouteMetadata({
  title: "Hotels & Eco Resorts in Bangladesh",
  description:
    "Discover verified hotels, eco-resorts, and guest houses across Bangladesh. Access direct phone contacts, locations, and room rates for your next journey.",
  path: "/hotels",
  image: "/og/hotels.jpg",
  imageAlt: "Hotels and Eco Resorts in Bangladesh",
});

export default function HotelsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
