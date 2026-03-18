"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { TAIPEI_CENTER, DEFAULT_ZOOM } from "@/constants";
import type { Restaurant } from "@/lib/types";
import { MapPin, Navigation } from "lucide-react";

interface MapContainerProps {
  restaurants: Restaurant[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onBoundsChanged?: (bounds: google.maps.LatLngBounds) => void;
  className?: string;
  userLocation?: { lat: number; lng: number } | null;
  onMarkerClick?: (restaurant: Restaurant) => void;
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
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const onClickRef = useRef(onMarkerClick);
  const prevIdsRef = useRef("");

  // Keep callback ref current without triggering marker rebuild
  useEffect(() => {
    onClickRef.current = onMarkerClick;
  }, [onMarkerClick]);

  useEffect(() => {
    if (!map) return;

    // Skip rebuild if restaurant IDs haven't changed
    const ids = restaurants.map((r) => r.id).join(",");
    if (ids === prevIdsRef.current && markersRef.current.length > 0) return;
    prevIdsRef.current = ids;

    let cancelled = false;

    google.maps.importLibrary("marker").then((lib) => {
      if (cancelled) return;

      const markerLib = lib as google.maps.MarkerLibrary;

      // Clean up previous
      clusterer.current?.clearMarkers();
      for (const m of markersRef.current) m.map = null;
      markersRef.current = [];

      if (!clusterer.current) {
        clusterer.current = new MarkerClusterer({
          map,
          onClusterClick: (_event, cluster, _map) => {
            // Zoom into the cluster to expand it
            if (cluster.bounds) {
              _map.fitBounds(cluster.bounds, { bottom: 200, top: 60, left: 20, right: 20 });
            }
          },
        });
      }

      const newMarkers: google.maps.marker.AdvancedMarkerElement[] = [];

      for (const restaurant of restaurants) {
        if (!restaurant.location) continue;

        const el = document.createElement("div");
        el.style.cssText = "background:#16a34a;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:bold;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3);cursor:pointer";
        el.textContent = "🌱";

        const marker = new markerLib.AdvancedMarkerElement({
          position: restaurant.location,
          content: el,
          title: restaurant.name_en,
        });

        const r = restaurant;
        marker.addEventListener("gmp-click", () => {
          onClickRef.current(r);
          // Pan map so marker appears in the upper portion of the viewport
          // (above the bottom sheet)
          if (r.location && map) {
            const zoom = map.getZoom() ?? 14;
            // Shift center south so marker appears above center
            // ~80px offset adjusted for zoom level
            const metersPerPx =
              (156543.03392 * Math.cos((r.location.lat * Math.PI) / 180)) /
              Math.pow(2, zoom);
            const offsetLat = (80 * metersPerPx) / 111320;
            map.panTo({
              lat: r.location.lat - offsetLat,
              lng: r.location.lng,
            });
          }
        });
        newMarkers.push(marker);
      }

      markersRef.current = newMarkers;
      clusterer.current.addMarkers(newMarkers);
    });

    return () => { cancelled = true; };
  }, [map, restaurants]);

  // Full cleanup on unmount only
  useEffect(() => {
    return () => {
      clusterer.current?.clearMarkers();
      for (const m of markersRef.current) m.map = null;
      markersRef.current = [];
    };
  }, []);

  return null;
}

/** Shows MRT/transit lines on the map */
function TransitLayer() {
  const map = useMap();
  const layerRef = useRef<google.maps.TransitLayer | null>(null);

  useEffect(() => {
    if (!map) return;
    if (!layerRef.current) {
      layerRef.current = new google.maps.TransitLayer();
    }
    layerRef.current.setMap(map);
    return () => {
      layerRef.current?.setMap(null);
    };
  }, [map]);

  return null;
}

export function MapContainer({
  restaurants,
  center = TAIPEI_CENTER,
  zoom = DEFAULT_ZOOM,
  className = "w-full h-[600px]",
  userLocation,
  onMarkerClick,
}: MapContainerProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const handleMarkerClick = useCallback(
    (restaurant: Restaurant) => {
      onMarkerClick?.(restaurant);
    },
    [onMarkerClick]
  );

  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "vegmap-main";

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
        {...(mapId ? { mapId } : {})}
        className={className}
        gestureHandling="greedy"
        disableDefaultUI={false}
        clickableIcons={false}
      >
        <TransitLayer />
        <ClusteredMarkers
          restaurants={restaurants}
          onMarkerClick={handleMarkerClick}
        />

        {userLocation && (
          <AdvancedMarker position={userLocation}>
            <div className="bg-blue-500 rounded-full w-6 h-6 border-3 border-white shadow-lg flex items-center justify-center">
              <Navigation className="h-3 w-3 text-white" />
            </div>
          </AdvancedMarker>
        )}
      </Map>
    </APIProvider>
  );
}
