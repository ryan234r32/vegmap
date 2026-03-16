"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./use-auth";

interface UseFavoritesReturn {
  favoriteIds: Set<string>;
  loading: boolean;
  toggle: (restaurantId: string) => Promise<void>;
  isFavorited: (restaurantId: string) => boolean;
}

export function useFavorites(): UseFavoritesReturn {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Fetch user's favorites on mount / user change
  useEffect(() => {
    if (!user) {
      setFavoriteIds(new Set());
      return;
    }

    let cancelled = false;
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/favorites");
        if (res.ok) {
          const { data } = await res.json();
          if (!cancelled && data) {
            const ids = new Set<string>();
            for (const list of data) {
              for (const item of list.items ?? []) {
                ids.add(item.restaurant_id);
              }
            }
            setFavoriteIds(ids);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchFavorites();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const toggle = useCallback(
    async (restaurantId: string) => {
      if (!user) return;

      const wasFavorited = favoriteIds.has(restaurantId);

      // Optimistic update
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (wasFavorited) {
          next.delete(restaurantId);
        } else {
          next.add(restaurantId);
        }
        return next;
      });

      try {
        if (wasFavorited) {
          await fetch(`/api/favorites?restaurantId=${restaurantId}`, {
            method: "DELETE",
          });
        } else {
          await fetch("/api/favorites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ restaurant_id: restaurantId }),
          });
        }
      } catch {
        // Revert on error
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (wasFavorited) {
            next.add(restaurantId);
          } else {
            next.delete(restaurantId);
          }
          return next;
        });
      }
    },
    [user, favoriteIds]
  );

  const isFavorited = useCallback(
    (restaurantId: string) => favoriteIds.has(restaurantId),
    [favoriteIds]
  );

  return { favoriteIds, loading, toggle, isFavorited };
}
