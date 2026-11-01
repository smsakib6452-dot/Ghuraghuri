export interface DestinationSource {
  title: string;
  url: string;
}

export interface Destination {
  id: number;
  name: string;
  name_bn?: string;
  altName?: string;
  alternateNames?: string[];
  slug: string;
  division: string;
  district: string;
  upazila?: string;
  category: string;
  categories: string[];
  rating?: number;
  reviews?: number;
  ratingSource?: string;
  ratingCheckedAt?: string;
  badge?: string;
  featured?: boolean;
  popularity?: number | string;
  latitude: number;
  longitude: number;
  coordsApproximate?: boolean;
  image: string | null;
  imageLg?: string | null;
  gallery?: string[];
  photoId?: string | null;
  galleryIds?: string[];
  shortDesc: string;
  description: string;
  bestTime: string;
  bestTimeNote?: string;
  bestSeason?: string;
  recommendedDays: string;
  difficulty?: "Easy" | "Moderate" | "Challenging" | string;
  budget: string;
  budgetPerDay?: string;
  travelType: string;
  activities: string[];
  attractions: string[];
  tips?: string[];
  things_to_do?: string[];
  what_to_see?: string[];
  travel_tips?: string[];
  transport_options?: string[];
  nearby_destinations?: string[];
  nearby_hotels?: string[];
  status?: string;
  tags?: string[];
  travelInfo?: {
    from?: string;
    duration?: string;
    route?: string;
    flight?: string | null;
    distanceKm?: number;
    transport?: string[];
  };
  sources?: DestinationSource[];
  factsCheckedAt?: string;
  needsReview?: boolean;
}

export interface DivisionInfo {
  id: number;
  name: string;
  name_bn: string;
  destCount?: number;
  heroImage?: string;
  description?: string;
}

export interface CategoryInfo {
  id: number;
  name: string;
  name_bn: string;
  icon?: string;
}

export interface Hotel {
  name: string;
  address: string;
  rating?: number;
  reviews?: number;
  ratingSource?: string;
  ratingCheckedAt?: string;
  priceBDT: number;
  type: string;
  image?: string;
}

export interface Restaurant {
  name: string;
  address: string;
  rating?: number;
  reviews?: number;
  ratingSource?: string;
  ratingCheckedAt?: string;
  cuisine: string;
  image?: string;
}

export interface DestinationTranslation {
  name?: string;
  shortDesc?: string;
  description?: string;
  bestTime?: string;
  bestTimeNote?: string;
  recommendedDays?: string;
  budget?: string;
  travelType?: string;
  activities?: string[];
  attractions?: string[];
  tips?: string[];
  travelInfo?: {
    from?: string;
    duration?: string;
    route?: string;
    flight?: string | null;
  };
}
