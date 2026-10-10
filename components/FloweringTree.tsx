'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  getTodayTree,
  TREE_FALLBACK,
  type DailyTree,
  type BlossomCluster,
} from '@/lib/trees';

/** One blossom cluster rendered as soft layered circles. */
function Cluster({ c, flowers }: { c: BlossomCluster; flowers: [string, string, string] }) {
  const [f0, f1, f2] = flowers;
  if (c.kind === 'ball') {
    // Kadam-style: round ball with dotted texture
    return (
      <g opacity={c.opacity}>
        <circle cx={c.x} cy={c.y} r={c.r} fill={f0} />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <circle
              key={i}
              cx={c.x + Math.cos(a) * c.r * 0.62}
              cy={c.y + Math.sin(a) * c.r * 0.62}
              r={c.r * 0.13}
              fill={f1}
            />
          );
        })}
        <circle cx={c.x} cy={c.y} r={c.r * 0.22} fill={f2} />
      </g>
    );
  }
  if (c.kind === 'brush') {
    // Bottlebrush-style: elongated brush along a seeded angle
    const shade = flowers[c.shade];
    return (
      <g opacity={c.opacity} transform={`rotate(${c.angle} ${c.x} ${c.y})`}>
        <ellipse cx={c.x} cy={c.y} rx={c.r * 0.34} ry={c.r} fill={shade} />
        {[-0.5, 0, 0.5].map((off, i) => (
          <circle key={i} cx={c.x + off * c.r * 0.4} cy={c.y - c.r * 0.55} r={c.r * 0.16} fill={f0} />
        ))}
        <circle cx={c.x} cy={c.y + c.r * 0.5} r={c.r * 0.18} fill={f2} />
      </g>
    );
  }
  // Puff: soft layered blossom
  const shade = flowers[c.shade];
  const alt = flowers[(c.shade + 1) % 3];
  return (
    <g opacity={c.opacity}>
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2 + c.x * 0.01;
        return (
          <circle
            key={i}
            cx={c.x + Math.cos(a) * c.r * 0.55}
            cy={c.y + Math.sin(a) * c.r * 0.55}
            r={c.r * 0.34}
            fill={i % 2 === 0 ? shade : alt}
          />
        );
      })}
      <circle cx={c.x} cy={c.y} r={c.r * 0.5} fill={shade} />
      <circle cx={c.x - c.r * 0.15} cy={c.y - c.r * 0.18} r={c.r * 0.16} fill="#ffffff" opacity={0.55} />
    </g>
  );
}

/** Decorative SVG flowering tree. Pure vector, no images. */
export function FloweringTree({
  variant = 'side',
  className = '',
}: {
  variant?: 'side' | 'strip';
  className?: string;
}) {
  // SSR-safe: fallback on first paint, today's tree after mount.
  const [tree, setTree] = useState<DailyTree>(TREE_FALLBACK);
  useEffect(() => {
    setTree(getTodayTree());
  }, []);

  const s = tree.species;
  const topX = 200 + tree.lean;

  return (
    <div aria-hidden="true" className={`pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 400 520"
        preserveAspectRatio="xMidYMax meet"
        className="h-full w-full"
        role="presentation"
      >
        {/* ground shadow */}
        <ellipse cx={200} cy={505} rx={70} ry={12} fill="#0f172a" opacity={0.08} />
        {/* trunk */}
        <path
          d={`M ${186} 508 C ${190} 430 ${196} 350 ${topX - 8} 262 L ${topX + 8} 262 C ${204} 350 ${208} 430 ${216} 508 Z`}
          fill={s.trunk}
        />
        {/* branches */}
        {tree.branches.map((b, i) => (
          <path
            key={i}
            d={`M ${b.x1} ${b.y1} Q ${b.cx} ${b.cy} ${b.x2} ${b.y2}`}
            fill="none"
            stroke={s.branch}
            strokeWidth={6 - i * 0.4}
            strokeLinecap="round"
            opacity={0.9}
          />
        ))}
        {/* leafy underlay */}
        <ellipse cx={200} cy={165} rx={128} ry={92} fill={s.leaf} opacity={0.45} />
        <ellipse cx={150} cy={200} rx={80} ry={60} fill={s.leaf} opacity={0.35} />
        <ellipse cx={252} cy={195} rx={84} ry={62} fill={s.leaf} opacity={0.35} />
        {/* blossoms */}
        {tree.clusters.map((c, i) => (
          <Cluster key={i} c={c} flowers={s.flowers} />
        ))}
      </svg>
    </div>
  );
}

/** Gentle falling petals drifting across a layer. Species-tinted. */
export function PetalDrift({ count = 10, className = '' }: { count?: number; className?: string }) {
  const [tree, setTree] = useState<DailyTree>(TREE_FALLBACK);
  useEffect(() => {
    setTree(getTodayTree());
  }, []);

  const petals = useMemo(() => {
    // Deterministic per day so petals don't reshuffle on re-render.
    let seed = 7;
    const rnd = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${6 + rnd() * 88}%`,
      size: 7 + rnd() * 7,
      duration: 9 + rnd() * 7,
      delay: -rnd() * 14,
      sway: `${18 + rnd() * 34}px`,
      shade: [tree.species.flowers[0], tree.species.flowers[1], tree.petalColor][i % 3],
      opacity: 0.55 + rnd() * 0.35,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree.species.key, count]);

  return (
    <div aria-hidden="true" className={`petals-layer pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {petals.map((p) => (
        <span
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            width: p.size,
            height: p.size * 1.35,
            background: p.shade,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            ['--sway' as string]: p.sway,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
