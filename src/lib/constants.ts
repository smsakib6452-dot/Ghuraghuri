import destinationsData from "@/data/destinations.json";
import taxonomyData from "@/data/taxonomy.json";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://ghuraghuri.vercel.app";

export const TOTAL_DESTINATIONS = destinationsData.length;
export const TOTAL_DIVISIONS = taxonomyData.DIVISIONS.length;
export const TOTAL_DISTRICTS = taxonomyData.DISTRICTS.length;

// Compute canonical destination counts per division from the single destinations data source
export const DIVISION_COUNTS: Record<string, number> = (() => {
  const counts: Record<string, number> = {};
  destinationsData.forEach((d) => {
    if (d.division) {
      counts[d.division] = (counts[d.division] || 0) + 1;
    }
  });
  return counts;
})();
