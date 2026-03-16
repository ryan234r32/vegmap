// Generate simple PWA icons using SVG → PNG via canvas
// Run: npx tsx scripts/generate-icons.ts
// Note: For production, replace with proper designed icons

import { writeFileSync } from "fs";

// Simple SVG icon
function createSvg(size: number): string {
  const fontSize = Math.round(size * 0.5);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" fill="#16a34a"/>
  <text x="50%" y="55%" font-size="${fontSize}" text-anchor="middle" dominant-baseline="middle">🥬</text>
</svg>`;
}

// Write SVG files as fallback (browsers will use these)
writeFileSync("public/icon-192.svg", createSvg(192));
writeFileSync("public/icon-512.svg", createSvg(512));
console.log("Generated SVG icons in public/");
