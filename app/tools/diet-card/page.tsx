import type { Metadata } from "next";
import { DietCardGenerator } from "@/components/tools/diet-card-generator";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vegetarian Diet Card for Taiwan",
  description:
    "Generate a bilingual diet communication card to show restaurant staff in Taiwan. Supports vegan, ovo-lacto, Buddhist vegetarian, and more. Includes hidden ingredient warnings and useful Chinese phrases.",
  keywords: [
    "vegetarian card Taiwan",
    "vegan communication card Chinese",
    "diet card restaurant Taiwan",
    "vegetarian translation card",
    "Taiwan vegan dining",
  ],
  openGraph: {
    title: "Vegetarian Diet Card for Taiwan | VegMap",
    description:
      "Generate a bilingual card to communicate your dietary needs at restaurants in Taiwan.",
  },
};

export default function DietCardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-green-700">
            VegMap
          </Link>
          <Link
            href="/restaurants"
            className="text-sm text-gray-600 hover:text-green-700"
          >
            Find Restaurants
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Diet Communication Card
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Generate a bilingual card to show restaurant staff in Taiwan. Select
            your diet type and any allergies, then show the card on your phone
            when ordering.
          </p>
        </div>

        <DietCardGenerator />
      </main>
    </div>
  );
}
