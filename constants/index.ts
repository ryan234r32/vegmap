import type { VegetarianType, PriceRange } from "@/lib/types";

export const VEGETARIAN_TYPES: {
  value: VegetarianType;
  label: string;
  emoji: string;
  color: string;
}[] = [
  { value: "vegan", label: "Vegan", emoji: "🌱", color: "bg-green-600" },
  {
    value: "ovo_lacto",
    label: "Ovo-Lacto",
    emoji: "🥛",
    color: "bg-blue-500",
  },
  { value: "lacto", label: "Lacto", emoji: "🧀", color: "bg-yellow-500" },
  { value: "ovo", label: "Ovo", emoji: "🥚", color: "bg-orange-500" },
  {
    value: "five_spice",
    label: "Five Allium Free",
    emoji: "🧄",
    color: "bg-purple-500",
  },
  {
    value: "vegetarian_friendly",
    label: "Veg Friendly",
    emoji: "🥗",
    color: "bg-teal-500",
  },
];

export const PRICE_RANGES: { value: PriceRange; label: string }[] = [
  { value: "$", label: "$ (Under NT$150)" },
  { value: "$$", label: "$$ (NT$150-300)" },
  { value: "$$$", label: "$$$ (NT$300-600)" },
  { value: "$$$$", label: "$$$$ (NT$600+)" },
];

export const TAIPEI_DISTRICTS = [
  "Zhongzheng",
  "Datong",
  "Zhongshan",
  "Songshan",
  "Da'an",
  "Wanhua",
  "Xinyi",
  "Shilin",
  "Beitou",
  "Neihu",
  "Nangang",
  "Wenshan",
] as const;

export const CUISINE_TAGS = [
  "Taiwanese",
  "Chinese",
  "Japanese",
  "Korean",
  "Thai",
  "Indian",
  "Italian",
  "Western",
  "Buffet",
  "Fast Food",
  "Bakery",
  "Dessert",
  "Juice & Smoothie",
  "Hot Pot",
  "Noodles",
  "Rice Box",
  "Dim Sum",
] as const;

export const TAIPEI_CENTER = { lat: 25.033, lng: 121.5654 };
export const DEFAULT_ZOOM = 13;
export const NEARBY_RADIUS_METERS = 2000;

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;
