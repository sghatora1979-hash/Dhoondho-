'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { STRINGS, type Lang, type Strings } from '@/lib/i18n';

type LangCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Strings;
};

const Ctx = createContext<LangCtx>({ lang: 'en', setLang: () => {}, t: STRINGS.en });

const KEY = 'dhoondho-lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved === 'hi' || saved === 'en') setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* ignore */
    }
  };

  return <Ctx.Provider value={{ lang, setLang, t: STRINGS[lang] }}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  return useContext(Ctx);
}
