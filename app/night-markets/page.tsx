import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NightMarketGuide } from "@/components/restaurant/night-market-guide";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Night Market Vegetarian Guide",
  description:
    "Find vegetarian and vegan food at Taipei's famous night markets. English guide to meat-free street food at Shilin, Raohe, Ningxia, and more.",
  keywords: [
    "vegetarian night market Taipei",
    "vegan street food Taiwan",
    "Shilin night market vegetarian",
    "Raohe vegetarian food",
    "meat-free night market Taiwan",
  ],
};

export default function NightMarketsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <NightMarketGuide />
      </main>
      <Footer />
    </div>
  );
}
