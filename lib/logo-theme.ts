// Dhoondho "living logo" — 365 unique daily styles, seasonally dressed.
// One deterministic style per (year, day-of-year): a seeded PRNG builds the
// whole year's sequence at load, so no style repeats within a year and every
// visitor sees the same logo. No server state, no images — pure CSS/vector.
//
// Seasonal dressing follows the Indian six ritus, so the logo wears colours
// that match the time of year (festive sparkle around Diwali).

export type Ritu =
  | 'vasanta' // Spring      (mid-Mar – mid-May)
  | 'grishma' // Summer      (mid-May – mid-Jul)
  | 'varsha' // Monsoon     (mid-Jul – mid-Sep)
  | 'sharad' // Autumn      (mid-Sep – mid-Nov)
  | 'hemanta' // Pre-winter  (mid-Nov – mid-Jan)
  | 'shishira'; // Winter      (mid-Jan – mid-Mar)

export const RITU_INFO: Record<Ritu, { name: string; en: string }> = {
  vasanta: { name: 'वसंत', en: 'Spring' },
  grishma: { name: 'ग्रीष्म', en: 'Summer' },
  varsha: { name: 'वर्षा', en: 'Monsoon' },
  sharad: { name: 'शरद', en: 'Autumn' },
  hemanta: { name: 'हेमंत', en: 'Pre-winter' },
  shishira: { name: 'शिशिर', en: 'Winter' },
};

export type Palette = {
  name: string;
  /** Gradient fill stops for the glossy face: top → middle → bottom */
  stops: [string, string, string];
  /** Solid colour of the extruded 3D body behind the face */
  edge: string;
  /** Deepest shade used for the extrusion shadow steps */
  dark: string;
  seasons: Ritu[];
  /** Festive palettes (Diwali season) get extra sparkle: faster shine + glow */
  festive?: boolean;
};

// 30 curated palettes — 5 per ritu.
export const PALETTES: Palette[] = [
  // ---- Shishira: icy blues, silvers, crisp whites ----
  { name: 'Glacier Frost', stops: ['#E0F2FE', '#7DD3FC', '#F8FAFC'], edge: '#0369A1', dark: '#0C4A6E', seasons: ['shishira'] },
  { name: 'Silver Moon', stops: ['#F1F5F9', '#CBD5E1', '#94A3B8'], edge: '#475569', dark: '#1E293B', seasons: ['shishira'] },
  { name: 'Arctic Blue', stops: ['#BAE6FD', '#38BDF8', '#E0F7FA'], edge: '#0284C7', dark: '#075985', seasons: ['shishira'] },
  { name: 'Winter Night', stops: ['#A5B4FC', '#6366F1', '#E0E7FF'], edge: '#4338CA', dark: '#1E1B4B', seasons: ['shishira'] },
  { name: 'Frost Berry', stops: ['#FBCFE8', '#F472B6', '#FDF2F8'], edge: '#BE185D', dark: '#831843', seasons: ['shishira'] },
  // ---- Vasanta: fresh greens, blossom pinks, light pastels ----
  { name: 'Blossom Pink', stops: ['#F9A8D4', '#F472B6', '#FCE7F3'], edge: '#DB2777', dark: '#831843', seasons: ['vasanta'] },
  { name: 'Fresh Leaf', stops: ['#86EFAC', '#22C55E', '#ECFDF5'], edge: '#15803D', dark: '#14532D', seasons: ['vasanta'] },
  { name: 'Mango Flower', stops: ['#FDE68A', '#FBBF24', '#FEF3C7'], edge: '#D97706', dark: '#92400E', seasons: ['vasanta'] },
  { name: 'Spring Meadow', stops: ['#A7F3D0', '#34D399', '#F0FDF4'], edge: '#059669', dark: '#064E3B', seasons: ['vasanta'] },
  { name: 'Gulab Rose', stops: ['#FDA4AF', '#F43F5E', '#FFF1F2'], edge: '#BE123C', dark: '#881337', seasons: ['vasanta'] },
  // ---- Grishma: hot oranges, bright yellows ----
  { name: 'Marigold Heat', stops: ['#FCD34D', '#F59E0B', '#FFFBEB'], edge: '#B45309', dark: '#78350F', seasons: ['grishma'] },
  { name: 'Desert Sun', stops: ['#FDBA74', '#F97316', '#FFF7ED'], edge: '#C2410C', dark: '#7C2D12', seasons: ['grishma'] },
  { name: 'Mango Ripe', stops: ['#FDE047', '#EAB308', '#FEFCE8'], edge: '#A16207', dark: '#713F12', seasons: ['grishma'] },
  { name: 'Chilli Blaze', stops: ['#FCA5A5', '#EF4444', '#FEF2F2'], edge: '#B91C1C', dark: '#7F1D1D', seasons: ['grishma'] },
  { name: 'Summer Sky', stops: ['#7DD3FC', '#0EA5E9', '#F0F9FF'], edge: '#0369A1', dark: '#0C4A6E', seasons: ['grishma'] },
  // ---- Varsha: deep blues, teals, rain grays with gloss ----
  { name: 'Monsoon Cloud', stops: ['#93C5FD', '#3B82F6', '#EFF6FF'], edge: '#1D4ED8', dark: '#1E3A8A', seasons: ['varsha'] },
  { name: 'Rain Teal', stops: ['#5EEAD4', '#14B8A6', '#F0FDFA'], edge: '#0F766E', dark: '#134E4A', seasons: ['varsha'] },
  { name: 'Peacock Plume', stops: ['#67E8F9', '#0891B2', '#ECFEFF'], edge: '#0E7490', dark: '#164E63', seasons: ['varsha'] },
  { name: 'Storm Grey', stops: ['#CBD5E1', '#64748B', '#F8FAFC'], edge: '#334155', dark: '#0F172A', seasons: ['varsha'] },
  { name: 'Lotus Pond', stops: ['#A5F3FC', '#06B6D4', '#F0FDFA'], edge: '#0E7490', dark: '#155E75', seasons: ['varsha'] },
  // ---- Sharad: warm ambers, marigold, festive golds ----
  { name: 'Diwali Gold', stops: ['#FDE68A', '#F59E0B', '#FFFBEB'], edge: '#B45309', dark: '#78350F', seasons: ['sharad'], festive: true },
  { name: 'Marigold Fest', stops: ['#FDBA74', '#EA580C', '#FFF7ED'], edge: '#9A3412', dark: '#431407', seasons: ['sharad'], festive: true },
  { name: 'Diya Flame', stops: ['#FCA5A5', '#F97316', '#FEF2F2'], edge: '#C2410C', dark: '#7C2D12', seasons: ['sharad'], festive: true },
  { name: 'Harvest Amber', stops: ['#FCD34D', '#D97706', '#FFFBEB'], edge: '#92400E', dark: '#451A03', seasons: ['sharad'] },
  { name: 'Sandalwood', stops: ['#FDE68A', '#CA8A04', '#FEFCE8'], edge: '#854D0E', dark: '#422006', seasons: ['sharad'] },
  // ---- Hemanta: rich purples, warm reds ----
  { name: 'Royal Plum', stops: ['#C4B5FD', '#8B5CF6', '#F5F3FF'], edge: '#6D28D9', dark: '#2E1065', seasons: ['hemanta'] },
  { name: 'Kashmiri Saffron', stops: ['#FDBA74', '#DC2626', '#FEF2F2'], edge: '#991B1B', dark: '#450A0A', seasons: ['hemanta'] },
  { name: 'Wine Dusk', stops: ['#FDA4AF', '#9F1239', '#FFF1F2'], edge: '#881337', dark: '#4C0519', seasons: ['hemanta'] },
  { name: 'Velvet Night', stops: ['#A78BFA', '#6D28D9', '#EDE9FE'], edge: '#5B21B6', dark: '#2E1065', seasons: ['hemanta'] },
  { name: 'Rosewood', stops: ['#F9A8D4', '#9D174D', '#FDF2F8'], edge: '#831843', dark: '#500724', seasons: ['hemanta'] },
];

export type ExtrudeKind = 'deep' | 'std' | 'soft';
export type FaceKind = 'gradient' | 'duotone' | 'rainbow' | 'chrome';

export type EffectVariant = {
  key: string;
  label: string;
  extrude: ExtrudeKind;
  face: FaceKind;
  /** Bold dark outline around the 3D body */
  stroke?: boolean;
  /** Neon glow around the letterforms */
  glow?: boolean;
  /** Shine sweep duration in seconds */
  shineDuration: number;
  /** Shine sweep opacity 0..1 */
  shineOpacity: number;
  /** Face gradient angle in degrees */
  gradAngle: number;
};

// 13 effect variants. 30 palettes × 13 variants = 390 combos ≥ 366 days.
export const VARIANTS: EffectVariant[] = [
  { key: 'deep', label: 'Deep 3D', extrude: 'deep', face: 'gradient', shineDuration: 7, shineOpacity: 0.9, gradAngle: 180 },
  { key: 'float', label: 'Soft Float', extrude: 'soft', face: 'gradient', shineDuration: 9, shineOpacity: 0.7, gradAngle: 180 },
  { key: 'neon', label: 'Neon Glow', extrude: 'std', face: 'gradient', glow: true, shineDuration: 6, shineOpacity: 0.85, gradAngle: 135 },
  { key: 'metal', label: 'Metallic Sheen', extrude: 'std', face: 'gradient', shineDuration: 5, shineOpacity: 1, gradAngle: 160 },
  { key: 'candy', label: 'Candy Gloss', extrude: 'std', face: 'gradient', shineDuration: 4, shineOpacity: 1, gradAngle: 180 },
  { key: 'outline', label: 'Outline Pop', extrude: 'std', face: 'gradient', stroke: true, shineDuration: 7, shineOpacity: 0.8, gradAngle: 180 },
  { key: 'duotone', label: 'Duotone Split', extrude: 'deep', face: 'duotone', shineDuration: 7, shineOpacity: 0.75, gradAngle: 135 },
  { key: 'fade', label: 'Horizon Fade', extrude: 'soft', face: 'gradient', shineDuration: 10, shineOpacity: 0.6, gradAngle: 90 },
  { key: 'ice', label: 'Ice Gloss', extrude: 'std', face: 'gradient', glow: true, shineDuration: 5, shineOpacity: 1, gradAngle: 180 },
  { key: 'ember', label: 'Ember Glow', extrude: 'deep', face: 'gradient', glow: true, shineDuration: 6, shineOpacity: 0.9, gradAngle: 180 },
  { key: 'pastel', label: 'Pastel Puff', extrude: 'soft', face: 'gradient', shineDuration: 9, shineOpacity: 0.65, gradAngle: 180 },
  { key: 'chrome', label: 'Chrome', extrude: 'deep', face: 'chrome', shineDuration: 5.5, shineOpacity: 0.95, gradAngle: 180 },
  { key: 'rainbow', label: 'Rainbow Flow', extrude: 'std', face: 'rainbow', shineDuration: 7, shineOpacity: 0.7, gradAngle: 90 },
];

export type DailyLogoStyle = {
  /** Unique within a year, e.g. "Diwali Gold|neon" */
  key: string;
  /** Display name, e.g. "Diwali Gold Neon Glow" */
  name: string;
  palette: Palette;
  variant: EffectVariant;
  season: Ritu;
  /** Resolved presentation values (festive palettes get sparkle boosts) */
  shineDuration: number;
  shineOpacity: number;
  glow: boolean;
  gradAngle: number;
  sparkle: boolean;
};

// ---------- deterministic PRNG (mulberry32) ----------
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(arr: T[], rng: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Indian ritu for a calendar date (month 1–12, day 1–31). Mid-month boundaries. */
export function seasonForDate(month: number, day: number): Ritu {
  if (month === 1) return day >= 15 ? 'shishira' : 'hemanta';
  if (month === 2) return 'shishira';
  if (month === 3) return day >= 15 ? 'vasanta' : 'shishira';
  if (month === 4) return 'vasanta';
  if (month === 5) return day >= 15 ? 'grishma' : 'vasanta';
  if (month === 6) return 'grishma';
  if (month === 7) return day >= 15 ? 'varsha' : 'grishma';
  if (month === 8) return 'varsha';
  if (month === 9) return day >= 15 ? 'sharad' : 'varsha';
  if (month === 10) return 'sharad';
  if (month === 11) return day >= 15 ? 'hemanta' : 'sharad';
  return 'hemanta'; // December: Nov 15 – Jan 14 is all Hemanta
}

/** 0-based day of year (UTC-safe, no DST wobble). */
export function dayOfYear(d: Date): number {
  const start = Date.UTC(d.getFullYear(), 0, 1);
  const day = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.floor((day - start) / 86400000);
}

export function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

type Combo = { palette: Palette; variant: EffectVariant; key: string };

const YEAR_CACHE = new Map<number, DailyLogoStyle[]>();

/**
 * The full year's daily sequence — deterministic per year, no repeats.
 * Each day picks the first unused palette×variant combo (from a seeded
 * shuffle) whose palette matches that day's ritu, so the logo always
 * dresses for the season. Falls back to any unused combo (unreachable:
 * every ritu has 5 palettes × 13 variants = 65 combos ≥ ~63 max days).
 */
export function stylesForYear(year: number): DailyLogoStyle[] {
  const cached = YEAR_CACHE.get(year);
  if (cached) return cached;

  const rng = mulberry32(year * 100003 + 7);
  const combos: Combo[] = [];
  for (const palette of PALETTES) {
    for (const variant of VARIANTS) {
      combos.push({ palette, variant, key: `${palette.name}|${variant.key}` });
    }
  }
  const shuffled = seededShuffle(combos, rng);
  const used = new Set<string>();
  const days = isLeapYear(year) ? 366 : 365;
  const result: DailyLogoStyle[] = [];

  for (let d = 0; d < days; d++) {
    const date = new Date(Date.UTC(year, 0, 1 + d));
    const season = seasonForDate(date.getUTCMonth() + 1, date.getUTCDate());
    let pick =
      shuffled.find((c) => !used.has(c.key) && c.palette.seasons.includes(season)) ??
      shuffled.find((c) => !used.has(c.key));
    if (!pick) throw new Error(`[logo-theme] ran out of combos for ${year} day ${d}`);
    used.add(pick.key);
    const sparkle = pick.palette.festive === true;
    result.push({
      key: pick.key,
      name: `${pick.palette.name} ${pick.variant.label}`,
      palette: pick.palette,
      variant: pick.variant,
      season,
      // Festive palettes sparkle: faster shine, full opacity, glow on.
      shineDuration: sparkle ? Math.min(pick.variant.shineDuration, 3.5) : pick.variant.shineDuration,
      shineOpacity: sparkle ? 1 : pick.variant.shineOpacity,
      glow: sparkle ? true : pick.variant.glow === true,
      gradAngle: pick.variant.gradAngle,
      sparkle,
    });
  }

  // Dev-time sanity: no style may repeat within a year.
  if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
    const keys = result.map((s) => s.key);
    if (new Set(keys).size !== keys.length) {
      // eslint-disable-next-line no-console
      console.warn(`[logo-theme] duplicate daily styles generated for year ${year}!`);
    }
  }

  YEAR_CACHE.set(year, result);
  return result;
}

/** Today's style (style.name e.g. "Monsoon Cloud Neon Glow"). Same for all visitors. */
export function getTodayStyle(at: Date = new Date()): DailyLogoStyle {
  const year = at.getFullYear();
  const styles = stylesForYear(year);
  return styles[Math.min(dayOfYear(at), styles.length - 1)];
}

/** Neutral first-paint style (also the SSR fallback — avoids hydration mismatch). */
export const LOGO_FALLBACK_STYLE: DailyLogoStyle = (() => {
  const palette = PALETTES.find((p) => p.name === 'Diwali Gold') ?? PALETTES[0];
  const variant = VARIANTS[0];
  return {
    key: 'fallback',
    name: `${palette.name} ${variant.label}`,
    palette,
    variant,
    season: 'sharad' as Ritu,
    shineDuration: variant.shineDuration,
    shineOpacity: variant.shineOpacity,
    glow: variant.glow === true,
    gradAngle: variant.gradAngle,
    sparkle: false,
  };
})();
