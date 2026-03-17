"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Locate } from "lucide-react";
import { VEGETARIAN_TYPES } from "@/constants";
import type { VegetarianType } from "@/lib/types";

const STORAGE_KEY = "vegmap_onboarded";

interface WelcomeSheetProps {
  onComplete: (diet: VegetarianType | null, requestLocation: boolean) => void;
}

export function WelcomeSheet({ onComplete }: WelcomeSheetProps) {
  const [visible, setVisible] = useState(false);
  const [selectedDiet, setSelectedDiet] = useState<VegetarianType | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      // Small delay so the map loads first
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }, []);

  const handleFindFood = useCallback(() => {
    dismiss();
    onComplete(selectedDiet, true);
  }, [dismiss, onComplete, selectedDiet]);

  const handleSkip = useCallback(() => {
    dismiss();
    onComplete(selectedDiet, false);
  }, [dismiss, onComplete, selectedDiet]);

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50 animate-in fade-in duration-300"
        onClick={handleSkip}
      />

      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300">
        <div className="bg-background rounded-t-2xl shadow-2xl mx-auto max-w-md">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>

          <div className="px-6 pb-8 pt-2">
            {/* Title */}
            <div className="text-center mb-6">
              <span className="text-4xl mb-3 block">🥬</span>
              <h2 className="text-xl font-bold mb-1">Welcome to VegMap</h2>
              <p className="text-sm text-muted-foreground">
                Find vegetarian food near you in Taipei
              </p>
            </div>

            {/* Diet selection */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3 text-center">
                What&apos;s your diet?
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {VEGETARIAN_TYPES.map((type) => {
                  const isActive = selectedDiet === type.value;
                  return (
                    <Badge
                      key={type.value}
                      variant={isActive ? "default" : "outline"}
                      className="cursor-pointer select-none text-sm px-3 py-1.5"
                      onClick={() =>
                        setSelectedDiet(isActive ? null : type.value)
                      }
                    >
                      {type.emoji} {type.label}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="space-y-3">
              <Button
                className="w-full h-12 text-base"
                onClick={handleFindFood}
              >
                <Locate className="h-5 w-5 mr-2" />
                Find Food Near Me
              </Button>
              <button
                onClick={handleSkip}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2 cursor-pointer"
              >
                Skip — Browse All Restaurants
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
