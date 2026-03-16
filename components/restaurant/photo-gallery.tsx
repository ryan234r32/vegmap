"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";
import { Camera, Upload, Loader2, X, ImageIcon } from "lucide-react";

interface PhotoGalleryProps {
  restaurantId: string;
  photos: { id: string; url: string; caption?: string }[];
  onPhotosChange?: () => void;
}

export function PhotoGallery({
  restaurantId,
  photos,
  onPhotosChange,
}: PhotoGalleryProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length || !user) return;

    setUploading(true);
    const supabase = createClient();

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024)
        continue;

      const ext = file.name.split(".").pop();
      const path = `restaurants/${restaurantId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      await supabase.storage.from("restaurant-photos").upload(path, file);
    }

    setUploading(false);
    onPhotosChange?.();
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      {/* Photo Grid */}
      {photos.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground mb-1">No photos yet</p>
          <p className="text-sm text-muted-foreground">
            Be the first to share a photo of this restaurant!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {photos.map((photo) => (
            <button
              key={photo.id}
              onClick={() => setSelectedPhoto(photo.url)}
              className="aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity"
            >
              <img
                src={photo.url}
                alt={photo.caption ?? "Restaurant photo"}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {user && (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Camera className="h-4 w-4 mr-2" />
                Add Photos
              </>
            )}
          </Button>
        </div>
      )}

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setSelectedPhoto(null)}
          >
            <X className="h-6 w-6" />
          </Button>
          <img
            src={selectedPhoto}
            alt="Full size photo"
            className="max-w-full max-h-[90vh] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
