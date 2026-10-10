'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Settings, Info, Languages } from 'lucide-react';
import { useLang } from './LanguageContext';
import { SearchBox } from './SearchBox';
import type { Lang } from '@/lib/i18n';
import {
  LOGO_FALLBACK_STYLE,
  getTodayStyle,
  type DailyLogoStyle,
} from '@/lib/logo-theme';

export function Wordmark({ small = false }: { small?: boolean }) {
  // SSR-safe: render the neutral fallback on the server and first client
  // paint, then swap to today's deterministic daily style after mount
  // (no hydration mismatch).
  const [style, setStyle] = useState<DailyLogoStyle>(LOGO_FALLBACK_STYLE);
  useEffect(() => {
    setStyle(getTodayStyle());
  }, []);

  const vars = {
    '--logo-c1': style.palette.stops[0],
    '--logo-c2': style.palette.stops[1],
    '--logo-c3': style.palette.stops[2],
    '--logo-edge': style.palette.edge,
    '--logo-dark': style.palette.dark,
    '--logo-glow': style.palette.stops[1],
    '--logo-glow-blur': '18px',
    '--logo-grad-angle': `${style.gradAngle}deg`,
    '--logo-shine-duration': `${style.shineDuration}s`,
    '--logo-shine-opacity': String(style.shineOpacity),
  } as React.CSSProperties;

  const extrudeCls =
    style.variant.extrude === 'deep'
      ? 'wordmark-extrude-deep'
      : style.variant.extrude === 'soft'
        ? 'wordmark-extrude-soft'
        : '';
  const faceCls =
    style.variant.face === 'duotone'
      ? 'wordmark-face-duotone'
      : style.variant.face === 'rainbow'
        ? 'wordmark-face-rainbow'
        : style.variant.face === 'chrome'
          ? 'wordmark-face-chrome'
          : '';
  const outlineCls = style.variant.stroke === true ? 'wordmark-outline' : '';
  const glowCls = style.glow ? 'wordmark-glow' : '';

  return (
    <Link href="/" className="inline-block select-none" aria-label="Dhoondho home">
      <span
        className={`wordmark-3d relative inline-block whitespace-nowrap font-black tracking-tight leading-none ${outlineCls} ${
          small ? 'text-2xl' : 'text-6xl sm:text-7xl'
        }`}
        style={vars}
        data-logo-style={style.key}
        data-logo-season={style.season}
      >
        {/* 3D extruded body (middle layer) */}
        <span aria-hidden="true" className={`wordmark-extrude absolute inset-0 select-none ${extrudeCls}`}>
          <span className="wordmark-big-d">D</span>hoondho
        </span>
        {/* Glossy gradient face (base layer, sets the box size) */}
        <span aria-hidden="true" className={`wordmark-face relative ${faceCls} ${glowCls}`}>
          <span className="wordmark-big-d">D</span>hoondho
        </span>
        {/* Animated shine sweep (top layer) */}
        <span aria-hidden="true" className="wordmark-shine absolute inset-0 select-none">
          <span className="wordmark-big-d">D</span>hoondho
        </span>
        <span className="sr-only">Dhoondho</span>
      </span>
      {!small && (
        <span className="mt-2 flex gap-1 justify-center" aria-hidden="true">
          <span className="h-1 w-10 rounded-full bg-saffron" />
          <span className="h-1 w-10 rounded-full bg-gray-200" />
          <span className="h-1 w-10 rounded-full bg-india-green" />
        </span>
      )}
    </Link>
  );
}

export function Header({ compactQuery = '' }: { compactQuery?: string }) {
  const { lang, setLang, t } = useLang();
  const toggle = () => setLang((lang === 'en' ? 'hi' : 'en') as Lang);

  return (
    <header className="w-full">
      <div className="flex items-center gap-3 sm:gap-6 px-4 sm:px-6 py-3 border-b border-gray-100">
          <Wordmark small />
          <div className="flex-1 min-w-0">
            <SearchBox size="compact" initial={compactQuery} />
          </div>
          <nav className="hidden sm:flex items-center gap-4 text-sm text-gray-600 shrink-0">
            <button
              onClick={toggle}
              className="flex items-center gap-1.5 hover:text-gray-900"
              title="Switch language"
            >
              <Languages size={16} />
              {t.langName}
            </button>
            <Link href="/about" className="flex items-center gap-1.5 hover:text-gray-900">
              <Info size={16} />
              {t.headerAbout}
            </Link>
            <Link href="/settings" className="flex items-center gap-1.5 hover:text-gray-900">
              <Settings size={16} />
              {t.headerSettings}
            </Link>
          </nav>
          <button
            onClick={toggle}
            className="sm:hidden flex items-center gap-1 text-sm text-gray-600 shrink-0"
            title="Switch language"
          >
            <Languages size={18} />
          </button>
        </div>
    </header>
  );
}

export function HomeHeader() {
  const { lang, setLang, t } = useLang();
  const toggle = () => setLang((lang === 'en' ? 'hi' : 'en') as Lang);

  return (
    <header className="w-full flex justify-end items-center gap-4 sm:gap-6 px-4 sm:px-8 py-4 text-sm text-gray-600">
      <button onClick={toggle} className="flex items-center gap-1.5 hover:text-gray-900" title="Switch language">
        <Languages size={16} />
        {t.langName}
      </button>
      <Link href="/about" className="flex items-center gap-1.5 hover:text-gray-900">
        <Info size={16} />
        <span className="hidden sm:inline">{t.headerAbout}</span>
      </Link>
      <Link href="/settings" className="flex items-center gap-1.5 hover:text-gray-900">
        <Settings size={16} />
        <span className="hidden sm:inline">{t.headerSettings}</span>
      </Link>
    </header>
  );
}
