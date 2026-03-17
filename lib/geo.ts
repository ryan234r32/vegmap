/**
 * Parse a PostGIS WKB hex (EWKB with SRID 4326) POINT to {lat, lng}.
 * Format: 0101000020E6100000 + 8-byte X (lng) + 8-byte Y (lat), little-endian.
 */
export function parseWkbPoint(wkb: string | null): { lat: number; lng: number } | null {
  if (!wkb || typeof wkb !== "string") return null;

  let offset: number;
  if (wkb.length >= 50 && wkb.substring(2, 10).toUpperCase() === "01000020") {
    // EWKB with SRID (most common from PostGIS)
    offset = 18;
  } else if (wkb.length >= 42 && wkb.substring(2, 10).toUpperCase() === "01000000") {
    // Standard WKB
    offset = 10;
  } else {
    return null;
  }

  try {
    const xHex = wkb.substring(offset, offset + 16);
    const yHex = wkb.substring(offset + 16, offset + 32);
    const lng = readFloat64LE(xHex);
    const lat = readFloat64LE(yHex);
    if (isNaN(lat) || isNaN(lng)) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}

function readFloat64LE(hex: string): number {
  const buf = new ArrayBuffer(8);
  const view = new DataView(buf);
  for (let i = 0; i < 8; i++) {
    view.setUint8(i, parseInt(hex.substring(i * 2, i * 2 + 2), 16));
  }
  return view.getFloat64(0, true);
}

/**
 * Transform an array of restaurant rows, converting PostGIS WKB location to {lat, lng}.
 */
export function transformRestaurantLocations<T extends Record<string, unknown>>(rows: T[]): T[] {
  return rows.map((r) => ({
    ...r,
    location: parseWkbPoint(r.location as string | null),
  }));
}
