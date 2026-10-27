export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://ghuraghuri.vercel.app";

export const CONTACT_EMAIL = "smsakib6452@gmail.com";

export const TOTAL_DESTINATIONS = 295;
export const TOTAL_DIVISIONS = 8;
export const TOTAL_DISTRICTS = 64;

// Canonical destination counts per division
export const DIVISION_COUNTS: Record<string, number> = {
  Chattogram: 110,
  Dhaka: 56,
  Sylhet: 30,
  Rajshahi: 27,
  Khulna: 22,
  Barishal: 19,
  Rangpur: 19,
  Mymensingh: 12,
};
