"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";
import { Camera, Upload, Loader2, Check, AlertCircle } from "lucide-react";
import type { MenuItem } from "@/lib/types";

interface MenuUploadProps {
  restaurantId: string;
  onSuccess?: () => void;
}

export function MenuUpload({ restaurantId, onSuccess }: MenuUploadProps) {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translatedItems, setTranslatedItems] = useState<MenuItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB");
      return;
    }

    setFile(selected);
    setError(null);
    setTranslatedItems(null);

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(selected);
  };

  const handleUploadAndTranslate = async () => {
    if (!file || !preview) return;

    setUploading(true);
    setError(null);

    try {
      // Upload to Supabase Storage
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `menus/${restaurantId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("menu-photos")
        .upload(path, file);

      if (uploadError) {
        // If storage bucket doesn't exist, use data URL directly
        console.warn("Storage upload failed, using data URL:", uploadError.message);
      }

      setUploading(false);
      setTranslating(true);

      // Get public URL or use data URL
      let imageUrl = preview;
      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("menu-photos")
          .getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }

      // Create menu record
      const { data: menuData } = await supabase
        .from("menus")
        .insert({
          restaurant_id: restaurantId,
          photo_storage_path: path,
          translation_status: "pending",
          items: [],
          uploaded_by: user.id,
        })
        .select("id")
        .single();

      // Trigger AI translation
      const res = await fetch("/api/menus/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menu_id: menuData?.id,
          image_url: imageUrl,
        }),
      });

      const result = await res.json();

      if (result.error) {
        setError(result.error);
      } else {
        const items = result.data?.items ?? [];
        setTranslatedItems(items);
        onSuccess?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      setTranslating(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Camera className="h-5 w-5" />
        <h3 className="font-semibold">Upload Menu Photo</h3>
      </div>

      <p className="text-sm text-muted-foreground">
        Take a photo of the menu and our AI will translate it to English
        with ingredient alerts.
      </p>

      {/* File Input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {!preview ? (
        <Button
          variant="outline"
          className="w-full h-32 border-dashed"
          onClick={() => inputRef.current?.click()}
        >
          <div className="text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Tap to take a photo or choose from gallery
            </span>
          </div>
        </Button>
      ) : (
        <div className="space-y-3">
          <img
            src={preview}
            alt="Menu preview"
            className="w-full rounded-lg max-h-64 object-contain bg-muted"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleUploadAndTranslate}
              disabled={uploading || translating}
              className="flex-1"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : translating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  AI Translating...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Upload & Translate
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setFile(null);
                setPreview(null);
                setTranslatedItems(null);
                setError(null);
              }}
              disabled={uploading || translating}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Translated Results */}
      {translatedItems && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Check className="h-4 w-4" />
            <span className="font-medium">
              {translatedItems.length} items translated
            </span>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {translatedItems.map((item, i) => (
              <div key={i} className="border rounded p-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">{item.name_en}</span>
                  {item.price && (
                    <span className="text-muted-foreground">NT${item.price}</span>
                  )}
                </div>
                <p className="text-muted-foreground text-xs">{item.name_zh}</p>
                {item.is_vegan && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    Vegan
                  </Badge>
                )}
                {item.allergens.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {item.allergens.map((a) => (
                      <Badge key={a} variant="outline" className="text-xs">
                        {a}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
