import type { Metadata } from "next";
import { buildRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRouteMetadata({
  title: "Bangladesh Transit & Intercity Transport Directory",
  description:
    "Explore intercity bus routes, train schedules, ferry crossings, and local fares across Bangladesh with curated counter contacts and ticket booking info.",
  path: "/transport",
});

export default function TransportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
