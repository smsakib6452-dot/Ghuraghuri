import quarantineData from "@/data/image-quarantine.json";

export interface QuarantinedItem {
  slug: string;
  name?: string;
  district?: string;
  reason: string;
  flags?: string[];
  originalImage: string | null;
  originalImageLg: string | null;
  originalGallery: string[];
}

const quarantinedMap = new Map<string, QuarantinedItem>();
(quarantineData as QuarantinedItem[]).forEach((item) => {
  quarantinedMap.set(item.slug, item);
});

/**
 * Returns true if the destination's images are quarantined.
 */
export function isImageQuarantined(slug: string): boolean {
  if (!slug) return false;
  return quarantinedMap.has(slug);
}

/**
 * Returns the quarantine metadata for a destination, if quarantined.
 */
export function getQuarantinedInfo(slug: string): QuarantinedItem | undefined {
  return quarantinedMap.get(slug);
}

/**
 * Returns the main image path for a destination, or null if quarantined.
 */
export function getDestinationImage(
  destination?: { slug: string; image?: string | null } | null
): string | null {
  if (!destination || !destination.slug) return null;
  if (quarantinedMap.has(destination.slug)) return null;
  return destination.image || null;
}

/**
 * Returns the large hero image path for a destination, or null if quarantined.
 */
export function getDestinationImageLg(
  destination?: { slug: string; imageLg?: string | null; image?: string | null } | null
): string | null {
  if (!destination || !destination.slug) return null;
  if (quarantinedMap.has(destination.slug)) return null;
  return destination.imageLg || destination.image || null;
}

/**
 * Returns the gallery image paths for a destination, or an empty array if quarantined.
 */
export function getDestinationGallery(
  destination?: { slug: string; gallery?: string[] | null } | null
): string[] {
  if (!destination || !destination.slug) return [];
  if (quarantinedMap.has(destination.slug)) return [];
  return destination.gallery || [];
}

