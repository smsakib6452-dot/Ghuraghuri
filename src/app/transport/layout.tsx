import type { Metadata } from "next";
import { buildRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRouteMetadata({
  title: "Bangladesh Transit & Intercity Transport Directory",
  description:
    "Plan intercity travel across Bangladesh with curated bus, train, launch, and domestic flight routes, terminal guides, fare ranges, and booking links.",
  path: "/transport",
  image: "/og/transport.jpg",
  imageAlt: "Bangladesh Transit and Transport Directory",
});

export default function TransportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
