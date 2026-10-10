'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Trophy, Clapperboard, Briefcase, CloudSun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { HomeHeader, Wordmark } from '@/components/Header';
import { SearchBox } from '@/components/SearchBox';
import { Footer } from '@/components/Footer';
import { FloweringTree, PetalDrift } from '@/components/FloweringTree';
import { useLang } from '@/components/LanguageContext';
import { getTodayBg, BG_FALLBACK } from '@/lib/daily-bg';

const CHIP_ICONS = [Newspaper, Trophy, Clapperboard, Briefcase, CloudSun];

export default function HomePage() {
  const { t } = useLang();
  const router = useRouter();
  // Daily pastel tint (whisper-light, seasonal). Pure white on first paint (SSR-safe).
  const [bg, setBg] = useState(BG_FALLBACK);
  useEffect(() => { setBg(getTodayBg().bg); }, []);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-1000" style={{ backgroundColor: bg }}>
      <HomeHeader />

      {/* Mobile scenic strip — flowering tree above the search box */}
      <div className="xl:hidden relative h-32 shrink-0 overflow-hidden">
        <FloweringTree variant="strip" className="absolute inset-x-0 -bottom-8 mx-auto h-52 w-64" />
      </div>

      <main className="relative flex-1 flex flex-col items-center justify-center px-4 -mt-10 overflow-hidden">
        {/* Desktop: flowering trees flanking the hero (decorative, behind content) */}
        <div className="hidden xl:block absolute left-2 2xl:left-16 top-1/2 -translate-y-1/2 w-[300px] 2xl:w-[360px]">
          <FloweringTree variant="side" className="aspect-[400/520] w-full" />
        </div>
        <div className="hidden xl:block absolute right-2 2xl:right-16 top-1/2 -translate-y-1/2 w-[300px] 2xl:w-[360px] -scale-x-100">
          <FloweringTree variant="side" className="aspect-[400/520] w-full" />
        </div>
        {/* Gentle falling petals across the hero */}
        <PetalDrift count={12} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col items-center w-full max-w-3xl bg-white rounded-[2.5rem] border border-black/5 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.15)] px-6 py-10 sm:px-12 sm:py-12"
        >
          <Wordmark />
          <p className="mt-3 text-lg sm:text-xl text-gray-500 font-medium tracking-wide">
            {t.tagline}
          </p>

          <div className="w-full flex justify-center mt-8">
            <SearchBox size="hero" />
          </div>

          <div className="mt-10 w-full max-w-2xl">
            <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">
              {t.quickTitle}
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {t.quick.map((label, i) => {
                const Icon = CHIP_ICONS[i % CHIP_ICONS.length];
                return (
                  <button
                    key={label}
                    onClick={() => router.push(`/search?q=${encodeURIComponent(label)}`)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-700 hover:border-saffron hover:text-saffron-dark hover:shadow-sm transition"
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
