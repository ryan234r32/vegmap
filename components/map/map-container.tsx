"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { TAIPEI_CENTER, DEFAULT_ZOOM } from "@/constants";
import type { Restaurant } from "@/lib/types";
import Link from "next/link";
import { VegTypeBadge } from "@/components/restaurant/veg-type-badge";
import { Star, MapPin, Navigation } from "lucide-react";

interface MapContainerProps {
  restaurants: Restaurant[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onBoundsChanged?: (bounds: google.maps.LatLngBounds) => void;
  className?: string;
  userLocation?: { lat: number; lng: number } | null;
}

function ClusteredMarkers({
  restaurants,
  onMarkerClick,
}: {
  restaurants: Restaurant[];
  onMarkerClick: (restaurant: Restaurant) => void;
}) {
  const map = useMap();
  const clusterer = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<globalThis.Map<string, google.maps.marker.AdvancedMarkerElement>>(new globalThis.Map());

  // Initialize clusterer
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({
        map,
        renderer: {
          render: ({ count, position }) => {
            const el = document.createElement("div");
            el.style.cssText = `
              background: #16a34a;
              color: white;
              border-radius: 50%;
              width: ${count > 50 ? 48 : count > 20 ? 40 : 36}px;
              height: ${count > 50 ? 48 : count > 20 ? 40 : 36}px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: ${count > 50 ? 14 : 12}px;
              font-weight: bold;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            `;
            el.textContent = String(count);

            return new google.maps.marker.AdvancedMarkerElement({
              position,
              content: el,
              zIndex: count,
            });
          },
        },
      });
    }
  }, [map]);

  // Update markers when restaurants change
  useEffect(() => {
    if (!clusterer.current) return;

    // Clear old markers
    clusterer.current.clearMarkers();
    markersRef.current.clear();

    const markers: google.maps.marker.AdvancedMarkerElement[] = [];

    for (const restaurant of restaurants) {
      if (!restaurant.location) continue;

      const el = document.createElement("div");
      el.style.cssText = `
        background: #16a34a;
        color: white;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        cursor: pointer;
      `;
      el.textContent = "🌱";

      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: restaurant.location,
        content: el,
        title: restaurant.name_en,
      });

      marker.addListener("click", () => onMarkerClick(restaurant));
      markers.push(marker);
      markersRef.current.set(restaurant.id, marker);
    }

    clusterer.current.addMarkers(markers);

    return () => {
      clusterer.current?.clearMarkers();
    };
  }, [restaurants, onMarkerClick]);

  return null;
}

export function MapContainer({
  restaurants,
  center = TAIPEI_CENTER,
  zoom = DEFAULT_ZOOM,
  className = "w-full h-[600px]",
  userLocation,
}: MapContainerProps) {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const handleMarkerClick = useCallback((restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  }, []);

  if (!apiKey) {
    return (
      <div
        className={`${className} bg-muted rounded-lg flex items-center justify-center`}
      >
        <div className="text-center p-8">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Map Preview</h3>
          <p className="text-muted-foreground text-sm">
            {restaurants.length} vegetarian restaurants in Taipei
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable the interactive map
          </p>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        defaultCenter={center}
        defaultZoom={zoom}
        mapId="vegmap-main"
        className={className}
        gestureHandling="greedy"
        disableDefaultUI={false}
      >
        {/* Clustered Restaurant Markers */}
        <ClusteredMarkers
          restaurants={restaurants}
          onMarkerClick={handleMarkerClick}
        />

        {/* User Location Marker */}
        {userLocation && (
          <AdvancedMarker position={userLocation}>
            <div className="bg-blue-500 rounded-full w-6 h-6 border-3 border-white shadow-lg flex items-center justify-center">
              <Navigation className="h-3 w-3 text-white" />
            </div>
          </AdvancedMarker>
        )}

        {/* Info Window */}
        {selectedRestaurant?.location && (
          <InfoWindow
            position={selectedRestaurant.location}
            onCloseClick={() => setSelectedRestaurant(null)}
          >
            <Link
              href={`/restaurants/${selectedRestaurant.slug}`}
              className="block max-w-[280px] p-1"
            >
              <h3 className="font-semibold text-sm">
                {selectedRestaurant.name_en}
              </h3>
              {selectedRestaurant.name_zh && (
                <p className="text-xs text-gray-500 mb-1">
                  {selectedRestaurant.name_zh}
                </p>
              )}
              {selectedRestaurant.avg_rating > 0 && (
                <div className="flex items-center gap-1 mb-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">
                    {selectedRestaurant.avg_rating}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({selectedRestaurant.review_count} reviews)
                  </span>
                </div>
              )}
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedRestaurant.vegetarian_types.slice(0, 3).map((type) => (
                  <VegTypeBadge key={type} type={type} size="sm" />
                ))}
              </div>
              {selectedRestaurant.address_en && (
                <p className="text-xs text-gray-500 mt-1">
                  {selectedRestaurant.address_en}
                </p>
              )}
            </Link>
          </InfoWindow>
        )}
      </Map>
    </APIProvider>
  );
}
