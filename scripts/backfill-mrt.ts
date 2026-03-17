/**
 * Backfill nearest_mrt for all restaurants that have a location.
 *
 * Usage:
 *   npx tsx scripts/backfill-mrt.ts
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const MRT_STATIONS = [
  { name_en: "Tamsui", lat: 25.1677, lng: 121.4463 },
  { name_en: "Beitou", lat: 25.1316, lng: 121.4985 },
  { name_en: "Shipai", lat: 25.1157, lng: 121.5155 },
  { name_en: "Mingde", lat: 25.1093, lng: 121.5188 },
  { name_en: "Zhishan", lat: 25.1028, lng: 121.5228 },
  { name_en: "Shilin", lat: 25.0935, lng: 121.526 },
  { name_en: "Jiantan", lat: 25.0847, lng: 121.5252 },
  { name_en: "Yuanshan", lat: 25.0714, lng: 121.5201 },
  { name_en: "Minquan W. Rd.", lat: 25.0627, lng: 121.5193 },
  { name_en: "Shuanglian", lat: 25.0578, lng: 121.5208 },
  { name_en: "Zhongshan", lat: 25.0529, lng: 121.5204 },
  { name_en: "Taipei Main Station", lat: 25.0478, lng: 121.517 },
  { name_en: "NTU Hospital", lat: 25.0418, lng: 121.5184 },
  { name_en: "Chiang Kai-Shek Memorial", lat: 25.0325, lng: 121.5186 },
  { name_en: "Dongmen", lat: 25.0339, lng: 121.5289 },
  { name_en: "Daan Park", lat: 25.0331, lng: 121.5355 },
  { name_en: "Daan", lat: 25.033, lng: 121.5435 },
  { name_en: "Xinyi Anhe", lat: 25.0335, lng: 121.5527 },
  { name_en: "Taipei 101", lat: 25.033, lng: 121.5637 },
  { name_en: "Xiangshan", lat: 25.033, lng: 121.5704 },
  { name_en: "Ximen", lat: 25.042, lng: 121.5081 },
  { name_en: "Longshan Temple", lat: 25.0367, lng: 121.5 },
  { name_en: "Zhongxiao Xinsheng", lat: 25.0425, lng: 121.533 },
  { name_en: "Zhongxiao Dunhua", lat: 25.0416, lng: 121.551 },
  { name_en: "Zhongxiao Fuxing", lat: 25.0416, lng: 121.5436 },
  { name_en: "Sun Yat-Sen Memorial", lat: 25.041, lng: 121.5573 },
  { name_en: "Taipei City Hall", lat: 25.041, lng: 121.5668 },
  { name_en: "Yongchun", lat: 25.0407, lng: 121.5764 },
  { name_en: "Houshanpi", lat: 25.0445, lng: 121.5829 },
  { name_en: "Kunyang", lat: 25.0503, lng: 121.5856 },
  { name_en: "Nangang", lat: 25.052, lng: 121.6065 },
  { name_en: "Songshan", lat: 25.05, lng: 121.5776 },
  { name_en: "Nanjing Sanmin", lat: 25.0514, lng: 121.5594 },
  { name_en: "Taipei Arena", lat: 25.0515, lng: 121.5505 },
  { name_en: "Nanjing Fuxing", lat: 25.052, lng: 121.544 },
  { name_en: "Songjiang Nanjing", lat: 25.052, lng: 121.533 },
  { name_en: "Zhongshan Elementary", lat: 25.062, lng: 121.5268 },
  { name_en: "Xingtian Temple", lat: 25.0597, lng: 121.5333 },
  { name_en: "Guting", lat: 25.026, lng: 121.5226 },
  { name_en: "Taipower Building", lat: 25.021, lng: 121.5287 },
  { name_en: "Gongguan", lat: 25.0145, lng: 121.5342 },
  { name_en: "Wanlong", lat: 25.002, lng: 121.54 },
  { name_en: "Jingmei", lat: 24.9933, lng: 121.5413 },
  { name_en: "Dazhi", lat: 25.0845, lng: 121.5467 },
  { name_en: "Jiannan Rd.", lat: 25.085, lng: 121.5573 },
  { name_en: "Neihu", lat: 25.0835, lng: 121.5912 },
  { name_en: "Liuzhangli", lat: 25.024, lng: 121.553 },
  { name_en: "Technology Building", lat: 25.026, lng: 121.5435 },
  { name_en: "Dingxi", lat: 25.0148, lng: 121.5105 },
  { name_en: "Yongan Market", lat: 25.0092, lng: 121.5105 },
  { name_en: "Nanshijiao", lat: 24.9985, lng: 121.5085 },
  { name_en: "Luzhou", lat: 25.0855, lng: 121.4731 },
  { name_en: "Dapinglin", lat: 24.9827, lng: 121.5412 },
];

function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function findNearestMrt(lat: number, lng: number): string {
  let minDist = Infinity;
  let nearest = MRT_STATIONS[0].name_en;
  for (const station of MRT_STATIONS) {
    const dist = haversineKm({ lat, lng }, station);
    if (dist < minDist) {
      minDist = dist;
      nearest = station.name_en;
    }
  }
  return nearest;
}

async function main() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, key);

  // Fetch all restaurants with location data
  const { data: restaurants, error } = await supabase
    .from("restaurants")
    .select("id, location")
    .not("location", "is", null);

  if (error) {
    console.error("Failed to fetch restaurants:", error);
    process.exit(1);
  }

  console.log(`Found ${restaurants.length} restaurants with locations`);

  let updated = 0;
  for (const r of restaurants) {
    // location comes back as WKB hex or GeoJSON depending on setup
    let lat: number | null = null;
    let lng: number | null = null;

    if (typeof r.location === "object" && r.location !== null) {
      // GeoJSON or {lat, lng} object
      if ("lat" in r.location && "lng" in r.location) {
        lat = r.location.lat;
        lng = r.location.lng;
      } else if ("coordinates" in r.location) {
        // GeoJSON Point: [lng, lat]
        lng = (r.location as { coordinates: number[] }).coordinates[0];
        lat = (r.location as { coordinates: number[] }).coordinates[1];
      }
    } else if (typeof r.location === "string") {
      // WKB hex — skip for now, PostGIS GEOGRAPHY is complex to decode here
      // The API route already uses parseWkbPoint, but we don't have that here
      // For WKB, decode the hex: first 4 bytes byte order, next 4 type, then coordinates
      try {
        const hex = r.location;
        // EWKB: byte order (1 byte) + type with SRID flag (4 bytes) + SRID (4 bytes) + X (8 bytes) + Y (8 bytes)
        const buf = Buffer.from(hex, "hex");
        const le = buf[0] === 1; // little-endian
        const readDouble = (offset: number) =>
          le ? buf.readDoubleLE(offset) : buf.readDoubleBE(offset);
        // Check if SRID is present (bit 0x20000000 in type)
        const typeRaw = le ? buf.readUInt32LE(1) : buf.readUInt32BE(1);
        const hasSRID = (typeRaw & 0x20000000) !== 0;
        const coordOffset = hasSRID ? 9 : 5;
        lng = readDouble(coordOffset);
        lat = readDouble(coordOffset + 8);
      } catch {
        console.warn(`Could not parse WKB for restaurant ${r.id}`);
        continue;
      }
    }

    if (lat === null || lng === null) continue;

    const nearestMrt = findNearestMrt(lat, lng);

    const { error: updateError } = await supabase
      .from("restaurants")
      .update({ nearest_mrt: nearestMrt })
      .eq("id", r.id);

    if (updateError) {
      console.warn(`Failed to update ${r.id}:`, updateError.message);
    } else {
      updated++;
      console.log(`  ${r.id} → ${nearestMrt}`);
    }
  }

  console.log(`\nDone! Updated ${updated}/${restaurants.length} restaurants.`);
}

main();
