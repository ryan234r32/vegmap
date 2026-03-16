import { WifiOff } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: "Offline",
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 text-center">
        <WifiOff className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-3">You're Offline</h1>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          It looks like you've lost your internet connection. Don't worry —
          previously visited restaurant pages are still available offline.
        </p>
        <div className="bg-muted rounded-lg p-6 max-w-sm mx-auto text-left space-y-3">
          <h2 className="font-semibold">Tips while offline:</h2>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>Previously visited restaurants are cached</li>
            <li>Your Diet Communication Card works offline</li>
            <li>Bookmarked pages load from cache</li>
            <li>New searches require an internet connection</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
