"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/hooks/use-auth";
import { VEGETARIAN_TYPES, TAIPEI_DISTRICTS, PRICE_RANGES } from "@/constants";
import { Plus, Check, LogIn } from "lucide-react";
import Link from "next/link";
import type { VegetarianType, PriceRange } from "@/lib/types";

export default function SuggestRestaurantPage() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [nameEn, setNameEn] = useState("");
  const [nameZh, setNameZh] = useState("");
  const [addressEn, setAddressEn] = useState("");
  const [addressZh, setAddressZh] = useState("");
  const [district, setDistrict] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRange | "">("");
  const [vegTypes, setVegTypes] = useState<VegetarianType[]>([]);
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");

  const toggleVegType = (type: VegetarianType) => {
    setVegTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEn || vegTypes.length === 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name_en: nameEn,
          name_zh: nameZh || null,
          address_en: addressEn || null,
          address_zh: addressZh || null,
          district: district || null,
          price_range: priceRange || null,
          vegetarian_types: vegTypes,
          website: website || null,
          description_en: description || null,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <Plus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-2xl font-bold mb-2">Suggest a Restaurant</h1>
          <p className="text-muted-foreground mb-4">
            Sign in to suggest a new vegetarian restaurant.
          </p>
          <Link href="/auth/login">
            <Button>
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <div className="bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Check className="h-8 w-8 text-green-600 dark:text-green-300" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
          <p className="text-muted-foreground mb-6">
            Your restaurant suggestion has been submitted. Our team will review
            it and add it to the map.
          </p>
          <div className="flex gap-2 justify-center">
            <Link href="/">
              <Button variant="outline">Back to Map</Button>
            </Link>
            <Button
              onClick={() => {
                setSubmitted(false);
                setNameEn("");
                setNameZh("");
                setAddressEn("");
                setAddressZh("");
                setDistrict("");
                setPriceRange("");
                setVegTypes([]);
                setWebsite("");
                setDescription("");
              }}
            >
              Suggest Another
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-2">Suggest a Restaurant</h1>
        <p className="text-muted-foreground mb-6">
          Know a great vegetarian restaurant in Taipei? Help the community by
          adding it to VegMap.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name_en">
                Restaurant Name (English) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name_en"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g., Green Kitchen"
                required
              />
            </div>
            <div>
              <Label htmlFor="name_zh">Restaurant Name (Chinese)</Label>
              <Input
                id="name_zh"
                value={nameZh}
                onChange={(e) => setNameZh(e.target.value)}
                placeholder="e.g., 綠色廚房"
              />
            </div>
          </div>

          {/* Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address_en">Address (English)</Label>
              <Input
                id="address_en"
                value={addressEn}
                onChange={(e) => setAddressEn(e.target.value)}
                placeholder="e.g., No. 10, Lane 5, Dunhua S. Rd."
              />
            </div>
            <div>
              <Label htmlFor="address_zh">Address (Chinese)</Label>
              <Input
                id="address_zh"
                value={addressZh}
                onChange={(e) => setAddressZh(e.target.value)}
                placeholder="e.g., 敦化南路一段5巷10號"
              />
            </div>
          </div>

          {/* District & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>District</Label>
              <Select value={district} onValueChange={(v) => setDistrict(v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {TAIPEI_DISTRICTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price Range</Label>
              <Select
                value={priceRange}
                onValueChange={(v) => setPriceRange((v ?? "") as PriceRange | "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
                <SelectContent>
                  {PRICE_RANGES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Veg Types */}
          <div>
            <Label>
              Vegetarian Type <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-muted-foreground mb-2">
              Select all that apply
            </p>
            <div className="flex flex-wrap gap-2">
              {VEGETARIAN_TYPES.map((type) => {
                const isActive = vegTypes.includes(type.value);
                return (
                  <Badge
                    key={type.value}
                    variant={isActive ? "default" : "outline"}
                    className="cursor-pointer select-none"
                    onClick={() => toggleVegType(type.value)}
                  >
                    {type.emoji} {type.label}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Website */}
          <div>
            <Label htmlFor="website">Website or Google Maps Link</Label>
            <Input
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
              type="url"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">
              Description / Notes
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about this restaurant — what makes it special, any tips for first-time visitors..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={!nameEn || vegTypes.length === 0 || submitting}
            className="w-full"
          >
            {submitting ? "Submitting..." : "Submit Restaurant"}
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
