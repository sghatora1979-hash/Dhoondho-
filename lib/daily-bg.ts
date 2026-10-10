// Dhoondho daily background tint — a "buffet" of very light pastel colours,
// one per day, seasonally dressed like the logo. The search island
// (wordmark + search box + chips) always stays clean white; everything
// around it wears the day's whisper-light tint.

import { Ritu, seasonForDate, dayOfYear } from './logo-theme';

export type BgTint = {
  /** Very light pastel background colour (near-white) */
  bg: string;
  name: string;
  season: Ritu;
};

// 24 whisper-light tints — 4 per ritu. All near-white so text stays readable.
const TINTS: { bg: string; name: string; seasons: Ritu[] }[] = [
  // Shishira (winter): icy blue-white, lavender-white
  { bg: '#F2F8FE', name: 'Glacier Whisper', seasons: ['shishira'] },
  { bg: '#F6F4FE', name: 'Lavender Mist', seasons: ['shishira'] },
  { bg: '#F0F7FA', name: 'Frost Air', seasons: ['shishira'] },
  { bg: '#F7F3FA', name: 'Winter Blossom', seasons: ['shishira'] },
  // Vasanta (spring): blossom white-pink, leaf white-green
  { bg: '#FEF6F9', name: 'Blossom Veil', seasons: ['vasanta'] },
  { bg: '#F4FBF6', name: 'New Leaf', seasons: ['vasanta'] },
  { bg: '#FDF8F3', name: 'Mango Flower', seasons: ['vasanta'] },
  { bg: '#F9FBF3', name: 'Meadow Dew', seasons: ['vasanta'] },
  // Grishma (summer): warm cream, peach-white
  { bg: '#FFFBF2', name: 'Summer Cream', seasons: ['grishma'] },
  { bg: '#FFF8F3', name: 'Peach Cloud', seasons: ['grishma'] },
  { bg: '#FFFDF4', name: 'Marigold Haze', seasons: ['grishma'] },
  { bg: '#FEF9F1', name: 'Heat Shimmer', seasons: ['grishma'] },
  // Varsha (monsoon): rain blue-white, teal-white
  { bg: '#F3F8FD', name: 'Rain Wash', seasons: ['varsha'] },
  { bg: '#F2FBFA', name: 'Teal Mist', seasons: ['varsha'] },
  { bg: '#F4F7FC', name: 'Monsoon Veil', seasons: ['varsha'] },
  { bg: '#F1F9FC', name: 'Lotus Pond', seasons: ['varsha'] },
  // Sharad (autumn/festive): cream-gold, marigold-white
  { bg: '#FFFBF0', name: 'Festive Glow', seasons: ['sharad'] },
  { bg: '#FFFAF3', name: 'Marigold Light', seasons: ['sharad'] },
  { bg: '#FDF9F0', name: 'Diya Light', seasons: ['sharad'] },
  { bg: '#FFFCF5', name: 'Harvest Haze', seasons: ['sharad'] },
  // Hemanta (pre-winter): plum-white, rose-white
  { bg: '#FAF6FE', name: 'Plum Mist', seasons: ['hemanta'] },
  { bg: '#FDF6F7', name: 'Rose Veil', seasons: ['hemanta'] },
  { bg: '#F8F5FB', name: 'Dusk Whisper', seasons: ['hemanta'] },
  { bg: '#FBF7F4', name: 'Saffron Cream', seasons: ['hemanta'] },
];

// Deterministic daily pick — seeded by date, same for all visitors.
function hashDay(year: number, doy: number): number {
  let h = (year * 372 + doy) >>> 0;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h ^= h >>> 16;
  return h >>> 0;
}

/** Today's background tint. SSR-safe fallback is pure white. */
export function getTodayBg(at: Date = new Date()): BgTint {
  const season = seasonForDate(at.getMonth() + 1, at.getDate());
  const pool = TINTS.filter((t) => t.seasons.includes(season));
  const list = pool.length ? pool : TINTS;
  const idx = hashDay(at.getFullYear(), dayOfYear(at)) % list.length;
  const pick = list[idx];
  return { bg: pick.bg, name: pick.name, season };
}

/** Pure white — SSR/first-paint fallback (no hydration mismatch). */
export const BG_FALLBACK = '#FFFFFF';
