export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://ghuraghuri.vercel.app";

export const TOTAL_DESTINATIONS = 271;
export const TOTAL_DIVISIONS = 8;
export const TOTAL_DISTRICTS = 64;

// Canonical destination counts per division
export const DIVISION_COUNTS: Record<string, number> = {
  Chattogram: 105,
  Dhaka: 52,
  Sylhet: 27,
  Rajshahi: 24,
  Khulna: 19,
  Barishal: 17,
  Rangpur: 17,
  Mymensingh: 10,
};
