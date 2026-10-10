'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Mic } from 'lucide-react';
import { useLang } from './LanguageContext';

export function SearchBox({
  initial = '',
  size = 'hero',
}: {
  initial?: string;
  size?: 'hero' | 'compact';
}) {
  const [q, setQ] = useState(initial);
  const router = useRouter();
  const { t } = useLang();

  const go = () => {
    const query = q.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  if (size === 'compact') {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go();
        }}
        className="flex items-center w-full max-w-xl bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm hover:shadow focus-within:shadow focus-within:border-gray-400"
        role="search"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.searchPlaceholder}
          aria-label={t.searchAria}
          className="flex-1 bg-transparent outline-none text-[15px] text-gray-900"
        />
        <button
          type="button"
          title={t.voiceTitle}
          aria-label={t.voiceTitle}
          className="p-1.5 text-gray-500 hover:text-gray-700"
        >
          <Mic size={18} />
        </button>
        <button type="submit" aria-label={t.searchAria} className="p-1.5 text-saffron hover:text-saffron-dark">
          <Search size={18} />
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        go();
      }}
      className="flex items-center w-full max-w-2xl bg-white border border-gray-300 rounded-full pl-5 pr-2 py-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] focus-within:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow"
      role="search"
    >
      <Search size={20} className="text-gray-400 mr-3 shrink-0" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t.searchPlaceholder}
        aria-label={t.searchAria}
        className="flex-1 bg-transparent outline-none text-base sm:text-lg text-gray-900"
      />
      <button
        type="button"
        title={t.voiceTitle}
        aria-label={t.voiceTitle}
        className="p-2.5 text-gray-500 hover:text-gray-700"
      >
        <Mic size={20} />
      </button>
      <button
        type="submit"
        aria-label={t.searchAria}
        className="ml-1 bg-saffron hover:bg-saffron-dark text-white rounded-full p-3 transition-colors"
      >
        <Search size={20} />
      </button>
    </form>
  );
}
