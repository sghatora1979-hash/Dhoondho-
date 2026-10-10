'use client';

import { useEffect, useState } from 'react';
import { KeyRound, Save, Trash2, CheckCircle2, Circle, ExternalLink, ServerCog } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLang } from '@/components/LanguageContext';
import { KEY_NAMES } from '@/lib/search';

export default function SettingsPage() {
  const { t } = useLang();
  const [brave, setBrave] = useState('');
  const [gkey, setGkey] = useState('');
  const [gcx, setGcx] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setBrave(localStorage.getItem(KEY_NAMES.K_BRAVE) || '');
    setGkey(localStorage.getItem(KEY_NAMES.K_GKEY) || '');
    setGcx(localStorage.getItem(KEY_NAMES.K_GCX) || '');
  }, []);

  const flash = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(''), 2500);
  };

  const saveBrave = () => {
    if (brave.trim()) localStorage.setItem(KEY_NAMES.K_BRAVE, brave.trim());
    else localStorage.removeItem(KEY_NAMES.K_BRAVE);
    flash(t.saved);
  };
  const clearBrave = () => {
    localStorage.removeItem(KEY_NAMES.K_BRAVE);
    setBrave('');
    flash(t.cleared);
  };
  const saveGoogle = () => {
    if (gkey.trim()) localStorage.setItem(KEY_NAMES.K_GKEY, gkey.trim());
    else localStorage.removeItem(KEY_NAMES.K_GKEY);
    if (gcx.trim()) localStorage.setItem(KEY_NAMES.K_GCX, gcx.trim());
    else localStorage.removeItem(KEY_NAMES.K_GCX);
    flash(t.saved);
  };
  const clearGoogle = () => {
    localStorage.removeItem(KEY_NAMES.K_GKEY);
    localStorage.removeItem(KEY_NAMES.K_GCX);
    setGkey('');
    setGcx('');
    flash(t.cleared);
  };

  const braveOn = brave.trim().length > 0;
  const googleOn = gkey.trim().length > 0 && gcx.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900">{t.settingsTitle}</h1>
        <p className="text-gray-500 mt-2 text-sm leading-relaxed">{t.settingsSubtitle}</p>

        {msg && (
          <div className="mt-4 flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-sm rounded-xl px-4 py-2.5">
            <CheckCircle2 size={16} />
            {msg}
          </div>
        )}

        {/* Brave */}
        <section className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <KeyRound size={18} className="text-saffron-dark" />
              {t.braveTitle}
            </h2>
            <span className={`flex items-center gap-1.5 text-xs font-medium ${braveOn ? 'text-green-700' : 'text-gray-400'}`}>
              {braveOn ? <CheckCircle2 size={14} /> : <Circle size={14} />}
              {braveOn ? t.configured : t.notConfigured}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{t.braveDesc}</p>
          <label className="block mt-4">
            <span className="text-sm font-medium text-gray-700">{t.braveKeyLabel}</span>
            <input
              type="password"
              value={brave}
              onChange={(e) => setBrave(e.target.value)}
              placeholder={t.braveKeyPh}
              className="mt-1.5 w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40"
              autoComplete="off"
            />
          </label>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={saveBrave}
              className="flex items-center gap-1.5 bg-saffron hover:bg-saffron-dark text-white text-sm font-semibold px-5 py-2.5 rounded-full transition"
            >
              <Save size={15} />
              {t.save}
            </button>
            <button
              onClick={clearBrave}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 px-3 py-2.5"
            >
              <Trash2 size={15} />
              {t.clear}
            </button>
            <a
              href="https://brave.com/search/api"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1 text-sm text-saffron-dark hover:underline"
            >
              {t.getBrave}
              <ExternalLink size={13} />
            </a>
          </div>
        </section>

        {/* Google */}
        <section className="mt-5 bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <KeyRound size={18} className="text-saffron-dark" />
              {t.googleTitle}
            </h2>
            <span className={`flex items-center gap-1.5 text-xs font-medium ${googleOn ? 'text-green-700' : 'text-gray-400'}`}>
              {googleOn ? <CheckCircle2 size={14} /> : <Circle size={14} />}
              {googleOn ? t.configured : t.notConfigured}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{t.googleDesc}</p>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">{t.googleKeyLabel}</span>
              <input
                type="password"
                value={gkey}
                onChange={(e) => setGkey(e.target.value)}
                placeholder={t.googleKeyPh}
                className="mt-1.5 w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40"
                autoComplete="off"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700">{t.googleCxLabel}</span>
              <input
                value={gcx}
                onChange={(e) => setGcx(e.target.value)}
                placeholder={t.googleCxPh}
                className="mt-1.5 w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40"
                autoComplete="off"
              />
            </label>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={saveGoogle}
              className="flex items-center gap-1.5 bg-saffron hover:bg-saffron-dark text-white text-sm font-semibold px-5 py-2.5 rounded-full transition"
            >
              <Save size={15} />
              {t.save}
            </button>
            <button
              onClick={clearGoogle}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 px-3 py-2.5"
            >
              <Trash2 size={15} />
              {t.clear}
            </button>
            <a
              href="https://programmablesearchengine.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1 text-sm text-saffron-dark hover:underline"
            >
              {t.getGoogle}
              <ExternalLink size={13} />
            </a>
          </div>
        </section>

        {/* How it works */}
        <section className="mt-8">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <ServerCog size={18} className="text-saffron-dark" />
            {t.howTitle}
          </h2>
          <ol className="mt-3 space-y-2.5 text-sm text-gray-600 leading-relaxed list-decimal list-inside">
            <li>{t.how1}</li>
            <li>{t.how2}</li>
            <li>{t.how3}</li>
          </ol>
          <p className="mt-4 text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 leading-relaxed">
            {t.howNote}
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
