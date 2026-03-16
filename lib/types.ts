export type VegetarianType =
  | "vegan"
  | "ovo_lacto"
  | "lacto"
  | "ovo"
  | "five_spice"
  | "vegetarian_friendly";

export type PriceRange = "$" | "$$" | "$$$" | "$$$$";

export type TranslationStatus =
  | "pending"
  | "ai_translated"
  | "community_reviewed"
  | "verified";

export type ContributionStatus = "pending" | "approved" | "rejected";

export interface OpeningHours {
  [day: string]: { open: string; close: string } | null;
}

export interface Restaurant {
  id: string;
  name_en: string;
  name_zh: string | null;
  slug: string;
  description_en: string | null;
  description_zh: string | null;
  vegetarian_types: VegetarianType[];
  cuisine_tags: string[];
  price_range: PriceRange | null;
  address_en: string | null;
  address_zh: string | null;
  city: string;
  district: string | null;
  location: { lat: number; lng: number } | null;
  phone: string | null;
  website: string | null;
  opening_hours: OpeningHours;
  google_place_id: string | null;
  google_rating: number | null;
  google_maps_url: string | null;
  cover_image_url: string | null;
  avg_rating: number;
  review_count: number;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  preferred_language: string;
  nationality: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  restaurant_id: string;
  user_id: string;
  overall_rating: number;
  food_rating: number | null;
  service_rating: number | null;
  value_rating: number | null;
  english_friendly_rating: number | null;
  title: string | null;
  body: string | null;
  visit_date: string | null;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  // Joined
  profile?: Profile;
  photos?: ReviewPhoto[];
}

export interface ReviewPhoto {
  id: string;
  review_id: string;
  storage_path: string;
  sort_order: number;
  created_at: string;
}

export interface MenuItem {
  name_zh: string;
  name_en: string;
  description_en: string | null;
  price: number | null;
  category: string | null;
  is_vegan: boolean;
  allergens: string[];
  ai_translated: boolean;
  community_verified: boolean;
}

export interface Menu {
  id: string;
  restaurant_id: string;
  photo_storage_path: string | null;
  translation_status: TranslationStatus;
  items: MenuItem[];
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface MenuContribution {
  id: string;
  menu_id: string;
  user_id: string;
  item_index: number;
  field: string;
  old_value: string | null;
  new_value: string;
  status: ContributionStatus;
  created_at: string;
}

export interface FavoriteList {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  slug: string | null;
  created_at: string;
  updated_at: string;
  items?: FavoriteItem[];
}

export interface FavoriteItem {
  id: string;
  list_id: string;
  restaurant_id: string;
  note: string | null;
  sort_order: number;
  created_at: string;
  restaurant?: Restaurant;
}

export interface NearbyParams {
  lat: number;
  lng: number;
  radius?: number;
  limit?: number;
}

export interface RestaurantFilters {
  vegetarianTypes?: VegetarianType[];
  district?: string;
  priceRange?: PriceRange;
  minRating?: number;
  search?: string;
  sortBy?: "rating" | "reviews" | "distance" | "name" | "english_friendly";
}
