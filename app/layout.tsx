import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/components/LanguageContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const noto = Noto_Sans_Devanagari({ subsets: ['devanagari'], variable: '--font-noto', display: 'swap' });

export const metadata: Metadata = {
  title: 'Dhoondho — ढूंढो',
  description: 'Dhoondho: a simple, fast search homepage for India. Search the web in English or Hindi.',
  keywords: ['dhoondho', 'dhoondho search', 'india search', 'search engine india'],
};

export const viewport: Viewport = {
  themeColor: '#FF9933',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${noto.variable}`}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
