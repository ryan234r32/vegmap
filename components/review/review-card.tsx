"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/restaurant/star-rating";
import { ThumbsUp } from "lucide-react";
import type { Review } from "@/lib/types";

interface ReviewCardProps {
  review: Review;
  onHelpful?: (reviewId: string) => void;
}

export function ReviewCard({ review, onHelpful }: ReviewCardProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="border-b py-4 last:border-b-0">
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={review.profile?.avatar_url ?? undefined} />
          <AvatarFallback>
            {review.profile?.display_name?.[0]?.toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm">
              {review.profile?.display_name ?? "Anonymous"}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDate(review.created_at)}
            </span>
          </div>

          {/* Ratings */}
          <div className="flex items-center gap-3 mb-2">
            <StarRating rating={review.overall_rating} size="sm" />
            {review.english_friendly_rating && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                English: {review.english_friendly_rating}/5
              </span>
            )}
          </div>

          {/* Sub-ratings */}
          {(review.food_rating || review.service_rating || review.value_rating) && (
            <div className="flex gap-3 text-xs text-muted-foreground mb-2">
              {review.food_rating && <span>Food: {review.food_rating}/5</span>}
              {review.service_rating && <span>Service: {review.service_rating}/5</span>}
              {review.value_rating && <span>Value: {review.value_rating}/5</span>}
            </div>
          )}

          {/* Title & Body */}
          {review.title && (
            <h4 className="font-medium text-sm mb-1">{review.title}</h4>
          )}
          {review.body && (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {review.body}
            </p>
          )}

          {/* Photos */}
          {review.photos && review.photos.length > 0 && (
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {review.photos.map((photo) => (
                <img
                  key={photo.id}
                  src={photo.storage_path}
                  alt="Review photo"
                  className="h-20 w-20 object-cover rounded"
                />
              ))}
            </div>
          )}

          {/* Helpful */}
          <div className="mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => onHelpful?.(review.id)}
            >
              <ThumbsUp className="h-3 w-3 mr-1" />
              Helpful ({review.helpful_count})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
