'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Globe, Image as ImageIcon, Newspaper, Info, ChevronLeft, ChevronRight, FlaskConical } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLang } from '@/components/LanguageContext';
import { searchWeb, type SearchResponse } from '@/lib/search';

type Tab = 'web' | 'images' | 'news';

function ResultsInner() {
  const params = useSearchParams();
  const router = useRouter();
  const { t, lang } = useLang();
  const q = params.get('q') ?? '';
  const page = Math.max(1, parseInt(params.get('page') ?? '1', 10) || 1);
  const [tab, setTab] = useState<Tab>('web');
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setTab('web');
  }, [q]);

  useEffect(() => {
    if (tab !== 'web') return;
    let cancelled = false;
    setLoading(true);
    const start = performance.now();
    searchWeb(q, { page, lang }).then((res) => {
      if (cancelled) return;
      setData(res);
      setElapsed((performance.now() - start) / 1000);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [q, page, tab, lang]);

  const tabs: Array<{ id: Tab; label: string; icon: typeof Globe }> = [
    { id: 'web', label: t.tabWeb, icon: Globe },
    { id: 'images', label: t.tabImages, icon: ImageIcon },
    { id: 'news', label: t.tabNews, icon: Newspaper },
  ];

  const goPage = (p: number) => {
    router.push(`/search?q=${encodeURIComponent(q)}&page=${p}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header compactQuery={q} />

      <div className="px-4 sm:px-6 border-b border-gray-100">
        <div className="max-w-3xl flex gap-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm border-b-2 -mb-px transition ${
                tab === id
                  ? 'border-saffron text-saffron-dark font-semibold'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 w-full max-w-3xl px-4 sm:px-6 py-5">
        {tab !== 'web' ? (
          <div className="mt-10 flex flex-col items-center text-center text-gray-500">
            {tab === 'images' ? <ImageIcon size={44} className="text-gray-300" /> : <Newspaper size={44} className="text-gray-300" />}
            <p className="mt-4 text-lg font-medium text-gray-700">
              {tab === 'images' ? t.imagesSoon : t.newsSoon}
            </p>
          </div>
        ) : loading ? (
          <div className="mt-8 space-y-6" aria-busy="true">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : !data || data.items.length === 0 ? (
          <p className="mt-8 text-gray-600">{t.noResults}</p>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-5">
              {t.aboutResults} {data.totalResults} {t.resultsWord} ({elapsed.toFixed(2)} {t.seconds})
            </p>

            {data.demo && (
              <div className="mb-6 flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-900">
                <FlaskConical size={17} className="mt-0.5 shrink-0" />
                <p>
                  {t.demoBanner}{' '}
                  <Link href="/settings" className="font-semibold underline">
                    {t.demoBannerLink}
                  </Link>
                </p>
              </div>
            )}

            <div className="space-y-7">
              {data.items.map((r, i) => (
                <article key={`${r.url}-${i}`}>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500 truncate">{r.displayUrl}</span>
                    {data.demo && (
                      <span className="shrink-0 text-[11px] font-medium bg-amber-100 text-amber-800 rounded-full px-2 py-0.5">
                        {t.demoBadge}
                      </span>
                    )}
                  </div>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="result-title text-xl hover:underline font-normal leading-snug block mt-0.5"
                  >
                    {r.title}
                  </a>
                  <p className="text-sm text-gray-600 leading-relaxed mt-1">{r.snippet}</p>
                </article>
              ))}
            </div>

            <div className="mt-10 flex items-center justify-center gap-6">
              {page > 1 && (
                <button
                  onClick={() => goPage(page - 1)}
                  className="flex items-center gap-1 text-saffron-dark font-medium hover:underline"
                >
                  <ChevronLeft size={17} />
                  {t.prevPage}
                </button>
              )}
              <button
                onClick={() => goPage(page + 1)}
                className="flex items-center gap-1 text-saffron-dark font-medium hover:underline"
              >
                {t.nextPage}
                <ChevronRight size={17} />
              </button>
            </div>
          </>
        )}
      </main>

      <div className="px-4 sm:px-6 pb-4">
        <p className="max-w-3xl mx-auto flex items-center gap-1.5 text-xs text-gray-400">
          <Info size={13} />
          {t.footerNote} · Dhoondho
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <ResultsInner />
    </Suspense>
  );
}
