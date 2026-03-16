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
  "Night Market",
] as const;

export const NIGHT_MARKETS = [
  { name_en: "Shilin Night Market", name_zh: "士林夜市", district: "Shilin", lat: 25.0882, lng: 121.5241 },
  { name_en: "Raohe Night Market", name_zh: "饒河夜市", district: "Songshan", lat: 25.0511, lng: 121.5775 },
  { name_en: "Ningxia Night Market", name_zh: "寧夏夜市", district: "Datong", lat: 25.0558, lng: 121.5155 },
  { name_en: "Tonghua Night Market", name_zh: "通化夜市", district: "Da'an", lat: 25.0275, lng: 121.5533 },
  { name_en: "Gongguan Night Market", name_zh: "公館夜市", district: "Zhongzheng", lat: 25.0150, lng: 121.5342 },
  { name_en: "Jingmei Night Market", name_zh: "景美夜市", district: "Wenshan", lat: 24.9932, lng: 121.5413 },
  { name_en: "Nanjichang Night Market", name_zh: "南機場夜市", district: "Zhongzheng", lat: 25.0283, lng: 121.5088 },
  { name_en: "Huaxi Street Night Market", name_zh: "華西街夜市", district: "Wanhua", lat: 25.0374, lng: 121.4999 },
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
