import type { Metadata } from "next";
import { buildRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRouteMetadata({
  title: "Bangladesh 7-Day Live Weather & Climate Guide",
  description:
    "Live 7-day weather forecasts, seasonal climate guides, and monsoon updates for all 64 districts of Bangladesh. Plan safe and scenic travel year-round.",
  path: "/weather",
});

export default function WeatherLayout({ children }: { children: React.ReactNode }) {
  return children;
}
