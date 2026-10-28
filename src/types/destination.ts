export interface Destination {
  id: number;
  name: string;
  name_bn?: string;
  altName?: string;
  slug: string;
  division: string;
  district: string;
  upazila?: string;
  category: string;
  categories: string[];
  rating: number;
  reviews: number;
  badge?: string;
  featured?: boolean;
  popularity?: number | string;
  latitude: number;
  longitude: number;
  image: string;
  imageLg?: string;
  gallery?: string[];
  shortDesc: string;
  description: string;
  bestTime: string;
  bestSeason?: string;
  recommendedDays: string;
  difficulty: "Easy" | "Moderate" | "Challenging" | string;
  budget: string;
  budgetPerDay?: string;
  travelType: string;
  activities: string[];
  attractions: string[];
  tips?: string[];
  travelInfo?: {
    from?: string;
    duration?: string;
    route?: string;
    flight?: string | null;
  };
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
  rating: number;
  reviews: number;
  priceBDT: number;
  type: string;
  image?: string;
}

export interface Restaurant {
  name: string;
  address: string;
  rating: number;
  reviews: number;
  cuisine: string;
  image?: string;
}
