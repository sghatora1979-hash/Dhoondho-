'use client';

import { Rocket, ShieldCheck } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLang } from '@/components/LanguageContext';

export default function AboutPage() {
  const { t } = useLang();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900">{t.aboutTitle}</h1>
        <p className="mt-4 text-gray-600 leading-relaxed">{t.aboutP1}</p>
        <p className="mt-3 text-gray-600 leading-relaxed">{t.aboutP2}</p>

        <h2 className="mt-8 font-bold text-gray-900 flex items-center gap-2">
          <Rocket size={18} className="text-saffron-dark" />
          {t.roadmapTitle}
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-gray-600">
          {t.roadmap.map((r) => (
            <li key={r} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-saffron shrink-0" />
              {r}
            </li>
          ))}
        </ul>

        <h2 id="privacy" className="mt-8 font-bold text-gray-900 flex items-center gap-2 scroll-mt-24">
          <ShieldCheck size={18} className="text-saffron-dark" />
          {t.privacyTitle}
        </h2>
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">{t.privacyBody}</p>
      </main>

      <Footer />
    </div>
  );
}
