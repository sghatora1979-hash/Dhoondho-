// Dhoondho "living flowering-tree" — a decorative Indian flowering tree behind
// the homepage hero, changing daily with the seasons. Deterministic per
// (year, day-of-year): seeded PRNG, same tree for every visitor, no images —
// pure SVG. Seasonal weighting follows the Indian six ritus.

import { seasonForDate, dayOfYear, type Ritu } from './logo-theme';

export type CanopyKind = 'round' | 'wide' | 'tall' | 'balls' | 'brush';

export type TreeSpecies = {
  key: string;
  name: string;
  nameHi: string;
  trunk: string;
  branch: string;
  leaf: string;
  /** Blossom shades (light → mid → deep) */
  flowers: [string, string, string];
  /** Falling-petal tint */
  petal: string;
  /** Real blooming seasons — the daily pick is weighted toward these */
  seasons: Ritu[];
  canopy: CanopyKind;
  /** Base blossom density 0..1 */
  density: number;
};

export const SPECIES: TreeSpecies[] = [
  { key: 'gulmohar', name: 'Gulmohar', nameHi: 'गुलमोहर', trunk: '#6D4C41', branch: '#5D4037', leaf: '#558B2F', flowers: ['#FF8A65', '#FF5722', '#D84315'], petal: '#FF7043', seasons: ['vasanta', 'grishma'], canopy: 'wide', density: 0.95 },
  { key: 'amaltas', name: 'Amaltas', nameHi: 'अमलतास', trunk: '#6D4C41', branch: '#5D4037', leaf: '#689F38', flowers: ['#FFEB8A', '#FFC107', '#FF8F00'], petal: '#FFD54F', seasons: ['vasanta', 'grishma'], canopy: 'wide', density: 0.9 },
  { key: 'jacaranda', name: 'Jacaranda', nameHi: 'जकारंडा', trunk: '#5D4037', branch: '#4E342E', leaf: '#7CB342', flowers: ['#B39DDB', '#7E57C2', '#512DA8'], petal: '#9575CD', seasons: ['vasanta'], canopy: 'round', density: 0.9 },
  { key: 'palash', name: 'Palash', nameHi: 'पलाश', trunk: '#4E342E', branch: '#3E2723', leaf: '#558B2F', flowers: ['#FF6E40', '#FF3D00', '#BF360C'], petal: '#FF5722', seasons: ['shishira', 'vasanta'], canopy: 'round', density: 0.85 },
  { key: 'champa', name: 'Champa', nameHi: 'चंपा', trunk: '#795548', branch: '#5D4037', leaf: '#33691E', flowers: ['#FFFDE7', '#FFECB3', '#FFD54F'], petal: '#FFF9C4', seasons: ['grishma', 'varsha'], canopy: 'round', density: 0.7 },
  { key: 'kadam', name: 'Kadam', nameHi: 'कदंब', trunk: '#6D4C41', branch: '#5D4037', leaf: '#2E7D32', flowers: ['#FFFDE7', '#FFF176', '#F9A825'], petal: '#FFF59D', seasons: ['varsha'], canopy: 'balls', density: 0.8 },
  { key: 'semal', name: 'Semal', nameHi: 'सेमल', trunk: '#616161', branch: '#424242', leaf: '#558B2F', flowers: ['#EF9A9A', '#F44336', '#B71C1C'], petal: '#E57373', seasons: ['shishira'], canopy: 'tall', density: 0.75 },
  { key: 'cherry', name: 'Cherry Blossom', nameHi: 'चेरी ब्लॉसम', trunk: '#4E342E', branch: '#3E2723', leaf: '#7CB342', flowers: ['#FCE4EC', '#F48FB1', '#D81B60'], petal: '#F8BBD0', seasons: ['shishira'], canopy: 'round', density: 1 },
  { key: 'kachnar', name: 'Kachnar', nameHi: 'कचनार', trunk: '#5D4037', branch: '#4E342E', leaf: '#689F38', flowers: ['#FCE4EC', '#F48FB1', '#8E24AA'], petal: '#F48FB1', seasons: ['shishira', 'vasanta'], canopy: 'round', density: 0.85 },
  { key: 'parijat', name: 'Parijat', nameHi: 'पारिजात', trunk: '#6D4C41', branch: '#5D4037', leaf: '#33691E', flowers: ['#FFFFFF', '#FFE0B2', '#FF9800'], petal: '#FFFFFF', seasons: ['sharad'], canopy: 'round', density: 0.7 },
  { key: 'bottlebrush', name: 'Bottlebrush', nameHi: 'बोतलब्रश', trunk: '#5D4037', branch: '#4E342E', leaf: '#2E7D32', flowers: ['#FF8A80', '#EF5350', '#B71C1C'], petal: '#EF5350', seasons: ['vasanta', 'grishma'], canopy: 'brush', density: 0.85 },
  { key: 'tabebuia', name: 'Tabebuia', nameHi: 'टेबेबुइया', trunk: '#6D4C41', branch: '#5D4037', leaf: '#7CB342', flowers: ['#FCE4EC', '#F48FB1', '#AD1457'], petal: '#F48FB1', seasons: ['shishira', 'vasanta'], canopy: 'tall', density: 0.95 },
];

export type BlossomCluster = {
  x: number;
  y: number;
  r: number;
  shade: number; // index into species.flowers
  opacity: number;
  kind: 'puff' | 'ball' | 'brush';
  angle: number; // brush rotation, degrees
};

export type TreeBranch = { x1: number; y1: number; cx: number; cy: number; x2: number; y2: number };

export type DailyTree = {
  species: TreeSpecies;
  season: Ritu;
  clusters: BlossomCluster[];
  branches: TreeBranch[];
  /** Trunk top lean in viewBox units (negative = left) */
  lean: number;
  petalColor: string;
};

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

const CANOPY_ELLIPSE: Record<CanopyKind, { rx: number; ry: number }> = {
  round: { rx: 135, ry: 100 },
  wide: { rx: 170, ry: 88 },
  tall: { rx: 110, ry: 125 },
  balls: { rx: 150, ry: 95 },
  brush: { rx: 155, ry: 92 },
};

function buildTree(species: TreeSpecies, season: Ritu, seed: number): DailyTree {
  const rng = mulberry32(seed);
  const { rx, ry } = CANOPY_ELLIPSE[species.canopy];
  const cx = 200;
  const cy = 168;

  // Branches: 6 seeded limbs fanning from the trunk top.
  const branches: TreeBranch[] = [];
  for (let i = 0; i < 6; i++) {
    const ang = (-62 + (124 / 5) * i + (rng() - 0.5) * 22) * (Math.PI / 180);
    const len = 95 + rng() * 55;
    const x1 = 200 + (rng() - 0.5) * 14;
    const y1 = 268;
    const x2 = x1 + Math.sin(ang) * len;
    const y2 = y1 - Math.cos(ang) * len * 0.9;
    branches.push({
      x1, y1,
      cx: x1 + Math.sin(ang) * len * 0.5 + (rng() - 0.5) * 26,
      cy: y1 - Math.cos(ang) * len * 0.45,
      x2, y2,
    });
  }

  // Blossom clusters: seeded positions inside the canopy ellipse.
  const count = Math.round(24 * species.density * (0.85 + rng() * 0.3));
  const clusters: BlossomCluster[] = [];
  let guard = 0;
  while (clusters.length < count && guard++ < 400) {
    const px = cx + (rng() * 2 - 1) * rx;
    const py = cy + (rng() * 2 - 1) * ry - rng() * 18; // bias to the top
    const nx = (px - cx) / rx;
    const ny = (py - cy) / ry;
    if (nx * nx + ny * ny > 1) continue;
    clusters.push({
      x: px,
      y: py,
      r: 13 + rng() * 15,
      shade: Math.floor(rng() * 3),
      opacity: 0.72 + rng() * 0.28,
      kind: species.canopy === 'balls' ? 'ball' : species.canopy === 'brush' ? 'brush' : 'puff',
      angle: rng() * 180 - 90,
    });
  }

  return {
    species,
    season,
    clusters,
    branches,
    lean: (rng() - 0.5) * 26,
    petalColor: species.petal,
  };
}

const TREE_CACHE = new Map<string, DailyTree>();

/** Today's flowering tree — deterministic per date, independent seed from the logo. */
export function getTodayTree(at: Date = new Date()): DailyTree {
  const year = at.getFullYear();
  const doy = dayOfYear(at);
  const cacheKey = `${year}-${doy}`;
  const cached = TREE_CACHE.get(cacheKey);
  if (cached) return cached;

  const season = seasonForDate(at.getMonth() + 1, at.getDate());
  const rng = mulberry32(year * 1000003 + doy * 7919 + 101);
  const inSeason = SPECIES.filter((s) => s.seasons.includes(season));
  const pool = rng() < 0.78 && inSeason.length > 0 ? inSeason : SPECIES;
  const species = pool[Math.floor(rng() * pool.length)];
  const tree = buildTree(species, season, year * 1000003 + doy * 7919 + 101);
  TREE_CACHE.set(cacheKey, tree);
  return tree;
}

/** Neutral first-paint tree (SSR fallback — avoids hydration mismatch). */
export const TREE_FALLBACK: DailyTree = buildTree(SPECIES[0], 'grishma', 42);
