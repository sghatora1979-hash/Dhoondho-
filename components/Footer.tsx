'use client';

import Link from 'next/link';
import { useLang } from './LanguageContext';

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="w-full border-t border-gray-100 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
        <div className="flex items-center gap-5">
          <Link href="/about" className="hover:text-gray-800">
            {t.footerAbout}
          </Link>
          <Link href="/about#privacy" className="hover:text-gray-800">
            {t.footerPrivacy}
          </Link>
          <Link href="/settings" className="hover:text-gray-800">
            {t.footerSettings}
          </Link>
        </div>
        <p className="text-gray-400">{t.footerNote}</p>
      </div>
    </footer>
  );
}
