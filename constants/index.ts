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

export type MrtLine = "red" | "blue" | "green" | "brown" | "orange" | "yellow";

export const MRT_LINE_COLORS: Record<MrtLine, string> = {
  red: "#e3002c",
  blue: "#0070bd",
  green: "#008659",
  brown: "#c48c31",
  orange: "#f8b61c",
  yellow: "#ffdb00",
};

export const MRT_STATIONS: {
  name_en: string;
  name_zh: string;
  line: MrtLine;
  lat: number;
  lng: number;
}[] = [
  // Red Line (Tamsui–Xinyi)
  { name_en: "Tamsui", name_zh: "淡水", line: "red", lat: 25.1677, lng: 121.4463 },
  { name_en: "Beitou", name_zh: "北投", line: "red", lat: 25.1316, lng: 121.4985 },
  { name_en: "Shipai", name_zh: "石牌", line: "red", lat: 25.1157, lng: 121.5155 },
  { name_en: "Mingde", name_zh: "明德", line: "red", lat: 25.1093, lng: 121.5188 },
  { name_en: "Zhishan", name_zh: "芝山", line: "red", lat: 25.1028, lng: 121.5228 },
  { name_en: "Shilin", name_zh: "士林", line: "red", lat: 25.0935, lng: 121.5260 },
  { name_en: "Jiantan", name_zh: "劍潭", line: "red", lat: 25.0847, lng: 121.5252 },
  { name_en: "Yuanshan", name_zh: "圓山", line: "red", lat: 25.0714, lng: 121.5201 },
  { name_en: "Minquan W. Rd.", name_zh: "民權西路", line: "red", lat: 25.0627, lng: 121.5193 },
  { name_en: "Shuanglian", name_zh: "雙連", line: "red", lat: 25.0578, lng: 121.5208 },
  { name_en: "Zhongshan", name_zh: "中山", line: "red", lat: 25.0529, lng: 121.5204 },
  { name_en: "Taipei Main Station", name_zh: "台北車站", line: "red", lat: 25.0478, lng: 121.5170 },
  { name_en: "NTU Hospital", name_zh: "台大醫院", line: "red", lat: 25.0418, lng: 121.5184 },
  { name_en: "Chiang Kai-Shek Memorial", name_zh: "中正紀念堂", line: "red", lat: 25.0325, lng: 121.5186 },
  { name_en: "Dongmen", name_zh: "東門", line: "red", lat: 25.0339, lng: 121.5289 },
  { name_en: "Daan Park", name_zh: "大安森林公園", line: "red", lat: 25.0331, lng: 121.5355 },
  { name_en: "Daan", name_zh: "大安", line: "red", lat: 25.0330, lng: 121.5435 },
  { name_en: "Xinyi Anhe", name_zh: "信義安和", line: "red", lat: 25.0335, lng: 121.5527 },
  { name_en: "Taipei 101", name_zh: "台北101/世貿", line: "red", lat: 25.0330, lng: 121.5637 },
  { name_en: "Xiangshan", name_zh: "象山", line: "red", lat: 25.0330, lng: 121.5704 },
  // Blue Line (Bannan)
  { name_en: "Ximen", name_zh: "西門", line: "blue", lat: 25.0420, lng: 121.5081 },
  { name_en: "Longshan Temple", name_zh: "龍山寺", line: "blue", lat: 25.0367, lng: 121.5000 },
  { name_en: "善導寺", name_zh: "善導寺", line: "blue", lat: 25.0445, lng: 121.5256 },
  { name_en: "Zhongxiao Xinsheng", name_zh: "忠孝新生", line: "blue", lat: 25.0425, lng: 121.5330 },
  { name_en: "Zhongxiao Dunhua", name_zh: "忠孝敦化", line: "blue", lat: 25.0416, lng: 121.5510 },
  { name_en: "Zhongxiao Fuxing", name_zh: "忠孝復興", line: "blue", lat: 25.0416, lng: 121.5436 },
  { name_en: "Sun Yat-Sen Memorial", name_zh: "國父紀念館", line: "blue", lat: 25.0410, lng: 121.5573 },
  { name_en: "Taipei City Hall", name_zh: "市政府", line: "blue", lat: 25.0410, lng: 121.5668 },
  { name_en: "Yongchun", name_zh: "永春", line: "blue", lat: 25.0407, lng: 121.5764 },
  { name_en: "Houshanpi", name_zh: "後山埤", line: "blue", lat: 25.0445, lng: 121.5829 },
  { name_en: "Kunyang", name_zh: "昆陽", line: "blue", lat: 25.0503, lng: 121.5856 },
  { name_en: "Nangang", name_zh: "南港", line: "blue", lat: 25.0520, lng: 121.6065 },
  // Green Line (Songshan–Xindian)
  { name_en: "Songshan", name_zh: "松山", line: "green", lat: 25.0500, lng: 121.5776 },
  { name_en: "Nanjing Sanmin", name_zh: "南京三民", line: "green", lat: 25.0514, lng: 121.5594 },
  { name_en: "Taipei Arena", name_zh: "台北小巨蛋", line: "green", lat: 25.0515, lng: 121.5505 },
  { name_en: "Nanjing Fuxing", name_zh: "南京復興", line: "green", lat: 25.0520, lng: 121.5440 },
  { name_en: "Songjiang Nanjing", name_zh: "松江南京", line: "green", lat: 25.0520, lng: 121.5330 },
  { name_en: "Zhongshan Elementary", name_zh: "中山國小", line: "green", lat: 25.0620, lng: 121.5268 },
  { name_en: "Xingtian Temple", name_zh: "行天宮", line: "green", lat: 25.0597, lng: 121.5333 },
  { name_en: "Guting", name_zh: "古亭", line: "green", lat: 25.0260, lng: 121.5226 },
  { name_en: "Taipower Building", name_zh: "台電大樓", line: "green", lat: 25.0210, lng: 121.5287 },
  { name_en: "Gongguan", name_zh: "公館", line: "green", lat: 25.0145, lng: 121.5342 },
  { name_en: "Wanlong", name_zh: "萬隆", line: "green", lat: 25.0020, lng: 121.5400 },
  { name_en: "Jingmei", name_zh: "景美", line: "green", lat: 24.9933, lng: 121.5413 },
  // Brown Line (Wenhu)
  { name_en: "Dazhi", name_zh: "大直", line: "brown", lat: 25.0845, lng: 121.5467 },
  { name_en: "Jiannan Rd.", name_zh: "劍南路", line: "brown", lat: 25.0850, lng: 121.5573 },
  { name_en: "Neihu", name_zh: "內湖", line: "brown", lat: 25.0835, lng: 121.5912 },
  { name_en: "Liuzhangli", name_zh: "六張犁", line: "brown", lat: 25.0240, lng: 121.5530 },
  { name_en: "Technology Building", name_zh: "科技大樓", line: "brown", lat: 25.0260, lng: 121.5435 },
  { name_en: "Zhongxiao Fuxing", name_zh: "忠孝復興", line: "brown", lat: 25.0416, lng: 121.5436 },
  { name_en: "Nanjing Fuxing", name_zh: "南京復興", line: "brown", lat: 25.0520, lng: 121.5440 },
  // Orange Line (Zhonghe–Xinlu)
  { name_en: "Dingxi", name_zh: "頂溪", line: "orange", lat: 25.0148, lng: 121.5105 },
  { name_en: "Yongan Market", name_zh: "永安市場", line: "orange", lat: 25.0092, lng: 121.5105 },
  { name_en: "Nanshijiao", name_zh: "南勢角", line: "orange", lat: 24.9985, lng: 121.5085 },
  { name_en: "Luzhou", name_zh: "蘆洲", line: "orange", lat: 25.0855, lng: 121.4731 },
  // Yellow Line (Circular)
  { name_en: "Dapinglin", name_zh: "大坪林", line: "yellow", lat: 24.9827, lng: 121.5412 },
];

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
