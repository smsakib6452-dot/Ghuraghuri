import generatedCounts from "@/data/generated-counts.json";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://ghuraghuri.vercel.app";

export const CONTACT_EMAIL = "smsakib6452@gmail.com";

export const TOTAL_DESTINATIONS = generatedCounts.totalDestinations;
export const TOTAL_DIVISIONS = generatedCounts.totalDivisions;
export const TOTAL_DISTRICTS = generatedCounts.totalDistricts;

// Canonical destination counts per division (computed at build-time from destinations.json)
export const DIVISION_COUNTS: Record<string, number> = generatedCounts.divisionCounts;

/**
 * 11 High-Level Destination Taxonomy Groups
 * Maps all 31 free-form destination categories into 11 canonical clusters.
 */
export const CATEGORY_GROUPS: Record<string, string[]> = {
  "Beaches & Coast": ["Beach", "Coastal"],
  "Hills & Peaks": ["Hill", "Mountain"],
  "Waterfalls": ["Waterfall"],
  "Forests & Wildlife": ["Forest", "National Park", "Wildlife", "Eco Tourism"],
  "Islands": ["Island"],
  "Rivers, Lakes & Wetlands": ["River", "Lake", "Haor"],
  "Heritage & History": ["Historical", "Archaeological", "Palace", "Heritage", "Campus & Heritage"],
  "Religious Sites": ["Religious", "Mosque", "Shrine"],
  "Culture & Museums": ["Cultural", "Museum", "Village", "City"],
  "Nature & Gardens": ["Nature", "Tea Garden", "Campus & Nature"],
  "Family & Fun": ["Family", "Adventure", "Resort Area"],
};

export const CATEGORY_GROUPS_BN: Record<string, string> = {
  "Beaches & Coast": "সমুদ্র ও উপকূল",
  "Hills & Peaks": "পাহাড় ও চূড়া",
  "Waterfalls": "ঝরনা ও ক্যাসকেড",
  "Forests & Wildlife": "বন ও বন্যপ্রাণী",
  "Islands": "দ্বীপ ও প্রবাল",
  "Rivers, Lakes & Wetlands": "নদী, হ্রদ ও হাওর",
  "Heritage & History": "ঐতিহ্য ও প্রত্নতত্ত্ব",
  "Religious Sites": "ধর্মীয় ও পবিত্র স্থান",
  "Culture & Museums": "সংস্কৃতি ও জাদুঘর",
  "Nature & Gardens": "প্রকৃতি ও চা বাগান",
  "Family & Fun": "পরিবার ও রোমাঞ্চ",
};

/**
 * Reverse lookup mapping from any raw category to its canonical taxonomy group
 */
export const CATEGORY_TO_GROUP: Record<string, string> = {};
for (const [groupName, categories] of Object.entries(CATEGORY_GROUPS)) {
  for (const cat of categories) {
    CATEGORY_TO_GROUP[cat] = groupName;
  }
}

/**
 * Maps any input category or group name to its canonical taxonomy group.
 * Handles exact group names as well as individual category values.
 */
export function resolveCategoryGroup(input: string): string | null {
  if (!input) return null;
  if (CATEGORY_GROUPS[input]) return input;
  return CATEGORY_TO_GROUP[input] || null;
}

/**
 * Precomputed canonical counts per category group from destinations.json (computed at build-time)
 */
export const CATEGORY_GROUP_COUNTS: Record<string, number> = generatedCounts.categoryGroupCounts;
