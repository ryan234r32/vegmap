"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/restaurant/star-rating";
import { createClient } from "@/lib/supabase/client";

interface ReviewFormProps {
  restaurantId: string;
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ReviewForm({
  restaurantId,
  userId,
  onSuccess,
  onCancel,
}: ReviewFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    overall_rating: 0,
    food_rating: 0,
    service_rating: 0,
    value_rating: 0,
    english_friendly_rating: 0,
    title: "",
    body: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.overall_rating === 0) {
      setError("Please select an overall rating");
      return;
    }

    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error: err } = await supabase.from("reviews").insert({
      restaurant_id: restaurantId,
      user_id: userId,
      overall_rating: form.overall_rating,
      food_rating: form.food_rating || null,
      service_rating: form.service_rating || null,
      value_rating: form.value_rating || null,
      english_friendly_rating: form.english_friendly_rating || null,
      title: form.title || null,
      body: form.body || null,
    });

    setSubmitting(false);

    if (err) {
      if (err.code === "23505") {
        setError("You have already reviewed this restaurant");
      } else if (err.code === "42501" || err.message?.includes("policy")) {
        setError("Permission denied. Please sign in and try again.");
      } else if (err.message?.includes("fetch") || err.message?.includes("network")) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded">
          {error}
        </div>
      )}

      {/* Overall Rating */}
      <div>
        <Label className="mb-2 block">
          Overall Rating <span className="text-destructive">*</span>
        </Label>
        <StarRating
          rating={form.overall_rating}
          size="lg"
          interactive
          onChange={(r) => setForm({ ...form, overall_rating: r })}
        />
      </div>

      {/* Sub-ratings */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { key: "food_rating", label: "Food" },
          { key: "service_rating", label: "Service" },
          { key: "value_rating", label: "Value" },
          { key: "english_friendly_rating", label: "English Friendly" },
        ].map(({ key, label }) => (
          <div key={key}>
            <Label className="mb-1 block text-sm">{label}</Label>
            <StarRating
              rating={form[key as keyof typeof form] as number}
              size="md"
              interactive
              onChange={(r) => setForm({ ...form, [key]: r })}
            />
          </div>
        ))}
      </div>

      {/* Title */}
      <div>
        <Label htmlFor="title">Title (optional)</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Sum up your experience"
        />
      </div>

      {/* Body */}
      <div>
        <Label htmlFor="body">Review (optional)</Label>
        <Textarea
          id="body"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          placeholder="Share your experience with other vegetarians..."
          rows={4}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </form>
  );
}
