import type { Metadata } from "next";
import { buildRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = buildRouteMetadata({
  title: "About Our Open Bangladesh Travel Platform",
  description:
    "Learn about Ghuraghuri, the open-access travel directory showcasing Bangladesh's 64 districts with authentic photography, cultural heritage, and guides.",
  path: "/about",
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
