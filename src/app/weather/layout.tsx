import type { Metadata } from "next";
import { buildRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRouteMetadata({
  title: "Bangladesh 7-Day Live Weather & Climate Guide",
  description:
    "Real-time weather forecasts, seasonal climate guides, and rain updates for all 64 districts in Bangladesh. Plan your journeys with local weather insights.",
  path: "/weather",
  image: "/og/weather.jpg",
  imageAlt: "Live Weather and Climate Guide Bangladesh",
});

export default function WeatherLayout({ children }: { children: React.ReactNode }) {
  return children;
}
