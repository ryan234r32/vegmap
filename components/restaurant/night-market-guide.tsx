"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NIGHT_MARKETS } from "@/constants";
import { MapPin, Moon, AlertTriangle, Utensils } from "lucide-react";
import Link from "next/link";

// Curated safe vegetarian items commonly found at night markets
const SAFE_ITEMS = [
  {
    name_en: "Stinky Tofu (臭豆腐)",
    name_zh: "臭豆腐",
    warning: "Ask for no meat sauce. Fried version is usually vegan; braised version often uses pork broth.",
    safe_phrase: "我吃素，請問有素的嗎？",
    markets: ["Shilin", "Raohe", "Ningxia"],
  },
  {
    name_en: "Oyster Mushroom Fritters (杏鮑菇)",
    name_zh: "炸杏鮑菇",
    warning: null,
    safe_phrase: null,
    markets: ["Shilin", "Raohe", "Ningxia"],
  },
  {
    name_en: "Sweet Potato Balls (地瓜球)",
    name_zh: "地瓜球",
    warning: null,
    safe_phrase: null,
    markets: ["Shilin", "Raohe", "Ningxia", "Tonghua"],
  },
  {
    name_en: "Scallion Pancake (蔥抓餅)",
    name_zh: "蔥抓餅",
    warning: "Ask for 素的 (vegetarian). Some stalls use lard. Safe to add egg if ovo-lacto.",
    safe_phrase: "素的，不要肉",
    markets: ["Shilin", "Raohe", "Ningxia"],
  },
  {
    name_en: "Taro Balls (芋圓)",
    name_zh: "芋圓",
    warning: null,
    safe_phrase: null,
    markets: ["Gongguan", "Shilin"],
  },
  {
    name_en: "Grass Jelly (仙草)",
    name_zh: "仙草",
    warning: "Usually vegan. Check toppings if getting a combo.",
    safe_phrase: null,
    markets: ["Ningxia", "Gongguan", "Tonghua"],
  },
  {
    name_en: "Vegetarian Vermicelli (素麵線)",
    name_zh: "素麵線",
    warning: "Only from stalls labeled 素. Regular 麵線 uses pork intestine and bonito broth.",
    safe_phrase: "有素的麵線嗎？",
    markets: ["Ningxia", "Nanjichang"],
  },
  {
    name_en: "Fruit on a Stick (水果串)",
    name_zh: "水果串",
    warning: null,
    safe_phrase: null,
    markets: ["Shilin", "Raohe"],
  },
  {
    name_en: "Tofu Pudding (豆花)",
    name_zh: "豆花",
    warning: "Usually vegan base. Check if syrup is honey-based for strict vegans.",
    safe_phrase: "豆花是素的嗎？",
    markets: ["Ningxia", "Gongguan", "Tonghua"],
  },
  {
    name_en: "Vegetable Tempura (蔬菜天婦羅)",
    name_zh: "炸蔬菜",
    warning: "Some stalls share oil with seafood. Ask: 有炸海鮮嗎？",
    safe_phrase: "請問油有炸海鮮嗎？",
    markets: ["Shilin", "Raohe"],
  },
];

const DANGER_ITEMS = [
  { name: "Oyster Omelette (蚵仔煎)", reason: "Contains oysters + often uses lard" },
  { name: "Pepper Bun (胡椒餅)", reason: "Pork filling" },
  { name: "Braised Pork Rice (滷肉飯)", reason: "Pork-based" },
  { name: "Chicken Cutlet (雞排)", reason: "Chicken, even if it looks plant-based" },
  { name: "Meatball Soup (貢丸湯)", reason: "Pork balls, even clear broth" },
  { name: "Fish Ball Soup (魚丸湯)", reason: "Fish-based" },
];

export function NightMarketGuide() {
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null);

  const filteredItems = selectedMarket
    ? SAFE_ITEMS.filter((item) => item.markets.includes(selectedMarket))
    : SAFE_ITEMS;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Moon className="h-7 w-7" />
          <h1 className="text-2xl font-bold">Night Market Vegetarian Guide</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Taipei's night markets are legendary, but navigating them as a
          vegetarian can be tricky. This guide shows you what's safe to eat,
          what to avoid, and the exact Chinese phrases to use.
        </p>
      </div>

      {/* Night Market Selector */}
      <div>
        <h2 className="font-semibold mb-3">Select a Night Market</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedMarket === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedMarket(null)}
          >
            All Markets
          </Button>
          {NIGHT_MARKETS.map((market) => (
            <Button
              key={market.name_en}
              variant={selectedMarket === market.district ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setSelectedMarket(
                  selectedMarket === market.district ? null : market.district
                )
              }
            >
              <MapPin className="h-3 w-3 mr-1" />
              {market.name_en}
            </Button>
          ))}
        </div>
      </div>

      {/* Safe Items */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Utensils className="h-5 w-5 text-green-600" />
          <h2 className="text-xl font-bold">Safe Vegetarian Street Food</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div key={item.name_en} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{item.name_en}</h3>
                  <p className="text-sm text-muted-foreground">{item.name_zh}</p>
                </div>
                <Badge variant="secondary" className="text-xs shrink-0">
                  {item.markets.length} markets
                </Badge>
              </div>
              {item.warning && (
                <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded p-2">
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="h-3 w-3 inline mr-1" />
                    {item.warning}
                  </p>
                </div>
              )}
              {item.safe_phrase && (
                <div className="bg-muted rounded p-2">
                  <p className="text-xs text-muted-foreground">Say this:</p>
                  <p className="text-sm font-medium">{item.safe_phrase}</p>
                </div>
              )}
              <div className="flex flex-wrap gap-1">
                {item.markets.map((m) => (
                  <Badge key={m} variant="outline" className="text-xs">
                    {m}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Items */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <h2 className="text-xl font-bold">Items to Avoid</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {DANGER_ITEMS.map((item) => (
            <div
              key={item.name}
              className="border border-red-200 dark:border-red-900 rounded-lg p-3 bg-red-50 dark:bg-red-950"
            >
              <p className="font-medium text-sm">{item.name}</p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                {item.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Phrases */}
      <div className="bg-muted rounded-lg p-6">
        <h2 className="text-lg font-bold mb-4">Essential Night Market Phrases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { zh: "我吃素", en: "I'm vegetarian" },
            { zh: "有素的嗎？", en: "Do you have a vegetarian option?" },
            { zh: "不要肉", en: "No meat" },
            { zh: "不要蛋", en: "No egg" },
            { zh: "全素", en: "Fully vegan (no egg, no dairy)" },
            { zh: "有放蔥蒜嗎？", en: "Does it contain onion/garlic?" },
            { zh: "這個多少錢？", en: "How much is this?" },
            { zh: "謝謝！好吃！", en: "Thanks! Delicious!" },
          ].map((phrase) => (
            <div
              key={phrase.zh}
              className="flex items-center justify-between bg-background rounded p-3"
            >
              <span className="font-medium">{phrase.zh}</span>
              <span className="text-sm text-muted-foreground">{phrase.en}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-4">
        <p className="text-muted-foreground mb-3">
          Want the full Diet Communication Card with detailed allergen info?
        </p>
        <Link href="/tools/diet-card">
          <Button variant="outline">Get Your Diet Card</Button>
        </Link>
      </div>
    </div>
  );
}
