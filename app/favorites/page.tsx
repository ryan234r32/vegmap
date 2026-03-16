"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RestaurantCard } from "@/components/restaurant/restaurant-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/hooks/use-auth";
import { Heart, LogIn, Share2, Plus, Check } from "lucide-react";
import Link from "next/link";
import type { Restaurant } from "@/lib/types";

interface FavoriteListWithItems {
  id: string;
  name: string;
  is_public: boolean;
  items: { restaurant_id: string; restaurant: Restaurant }[];
}

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const [lists, setLists] = useState<FavoriteListWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeList, setActiveList] = useState<string | null>(null);
  const [newListName, setNewListName] = useState("");
  const [showNewList, setShowNewList] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const res = await fetch("/api/favorites");
        if (res.ok) {
          const { data } = await res.json();
          setLists(data ?? []);
          if (data?.length > 0 && !activeList) {
            setActiveList(data[0].id);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  const currentList = activeList
    ? lists.find((l) => l.id === activeList)
    : lists[0];

  const restaurants =
    currentList?.items
      ?.map((item) => item.restaurant)
      .filter(Boolean) ?? [];

  const handleCreateList = async () => {
    if (!newListName.trim()) return;

    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newListName.trim() }),
    });

    if (res.ok) {
      const { data } = await res.json();
      if (data) {
        setLists((prev) => [...prev, { ...data, items: [] }]);
        setActiveList(data.id);
      }
    }
    setNewListName("");
    setShowNewList(false);
  };

  const handleShare = async () => {
    if (!currentList) return;

    const restaurantNames = restaurants.map((r) => r.name_en).join(", ");
    const text = `My favorite vegetarian restaurants in Taipei: ${restaurantNames}`;

    if (navigator.share) {
      await navigator.share({
        title: `${currentList.name} | VegMap`,
        text,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(
        `${text}\n\nFind more at ${window.location.origin}`
      );
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            <h1 className="text-2xl font-bold">My Favorites</h1>
          </div>
          {user && restaurants.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleShare}>
              {shared ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </>
              )}
            </Button>
          )}
        </div>

        {authLoading || loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-72 bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : !user ? (
          <div className="text-center py-16">
            <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">
              Sign in to save favorites
            </h2>
            <p className="text-muted-foreground mb-4">
              Keep track of your favorite vegetarian restaurants in Taipei.
            </p>
            <Link href="/auth/login">
              <Button>
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* List tabs */}
            {lists.length > 0 && (
              <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                {lists.map((list) => (
                  <Button
                    key={list.id}
                    variant={activeList === list.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveList(list.id)}
                  >
                    {list.name}
                    <span className="ml-1 text-xs opacity-60">
                      ({list.items?.length ?? 0})
                    </span>
                  </Button>
                ))}
                {!showNewList && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNewList(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {/* New list form */}
            {showNewList && (
              <div className="flex gap-2 mb-6">
                <Input
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="List name (e.g., Date Night Spots)"
                  onKeyDown={(e) => e.key === "Enter" && handleCreateList()}
                  autoFocus
                />
                <Button size="sm" onClick={handleCreateList}>
                  Create
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowNewList(false);
                    setNewListName("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}

            {restaurants.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
                <p className="text-muted-foreground mb-4">
                  Tap the heart icon on any restaurant to save it here.
                </p>
                <Link href="/">
                  <Button variant="outline">Explore Restaurants</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {restaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
