import type { Lang } from './i18n';

export type SearchResultItem = {
  title: string;
  url: string;
  displayUrl: string;
  snippet: string;
};

export type Provider = 'brave' | 'tavily' | 'google' | 'demo';

export type SearchResponse = {
  items: SearchResultItem[];
  totalResults: string;
  demo: boolean;
  provider: Provider;
  notice?: string;
};

const K_BRAVE = 'dhoondho-brave-key';
const K_TAVILY = 'dhoondho-tavily-key';
const K_GKEY = 'dhoondho-google-key';
const K_GCX = 'dhoondho-google-cx';

function readKeys(): { brave: string; tavily: string; gkey: string; gcx: string } {
  if (typeof window === 'undefined') return { brave: '', tavily: '', gkey: '', gcx: '' };
  return {
    brave: localStorage.getItem(K_BRAVE) || '',
    tavily: localStorage.getItem(K_TAVILY) || '',
    gkey: localStorage.getItem(K_GKEY) || '',
    gcx: localStorage.getItem(K_GCX) || '',
  };
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

async function braveSearch(
  query: string,
  key: string,
  page: number,
  lang: Lang
): Promise<SearchResponse> {
  const offset = (page - 1) * 10;
  const url =
    `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}` +
    `&count=10&offset=${offset}&country=IN&search_lang=${lang === 'hi' ? 'hi' : 'en'}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/json', 'X-Subscription-Token': key },
  });
  if (!res.ok) throw new Error(`Brave API error ${res.status}`);
  const data = await res.json();
  const raw = data?.web?.results ?? [];
  const items: SearchResultItem[] = raw.map((r: Record<string, string>) => ({
    title: r.title || '',
    url: r.url || '',
    displayUrl: hostOf(r.url || ''),
    snippet: r.description || '',
  }));
  return {
    items,
    totalResults: String(data?.web?.totalResults ?? items.length * page),
    demo: false,
    provider: 'brave',
  };
}

/** Tavily: free tier (1,000 searches/month), no credit card needed. */
async function tavilySearch(
  query: string,
  key: string,
  page: number,
  lang: Lang
): Promise<SearchResponse> {
  const res = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      query,
      max_results: 10,
      search_depth: 'basic',
      include_answer: false,
      include_raw_content: false,
    }),
  });
  if (!res.ok) throw new Error(`Tavily API error ${res.status}`);
  const data = await res.json();
  const raw = data?.results ?? [];
  const items: SearchResultItem[] = raw.map((r: Record<string, string>) => ({
    title: r.title || '',
    url: r.url || '',
    displayUrl: hostOf(r.url || ''),
    snippet: r.content || '',
  }));
  return {
    items,
    totalResults: String(items.length * page),
    demo: false,
    provider: 'tavily',
  };
}

async function googleSearch(
  query: string,
  key: string,
  cx: string,
  page: number,
  lang: Lang
): Promise<SearchResponse> {
  const start = (page - 1) * 10 + 1;
  const url =
    `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(key)}` +
    `&cx=${encodeURIComponent(cx)}&q=${encodeURIComponent(query)}` +
    `&num=10&start=${start}&lr=lang_${lang === 'hi' ? 'hi' : 'en'}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Google API error ${res.status}`);
  const data = await res.json();
  const raw = data?.items ?? [];
  const items: SearchResultItem[] = raw.map((r: Record<string, string>) => ({
    title: r.title || '',
    url: r.link || '',
    displayUrl: r.displayLink || hostOf(r.link || ''),
    snippet: r.snippet || '',
  }));
  return {
    items,
    totalResults: data?.searchInformation?.formattedTotalResults ?? String(items.length * page),
    demo: false,
    provider: 'google',
  };
}

function cap(s: string): string {
  const t = s.trim();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : t;
}

/** Clearly-labeled demo results so the UI works with no API key. */
function demoResults(query: string, page: number): SearchResponse {
  const q = query.trim() || 'India';
  const slug = encodeURIComponent(q.trim().replace(/\s+/g, '_'));
  const templates: Array<{ host: string; url: string; title: string; snippet: string }> = [
    {
      host: 'en.wikipedia.org',
      url: `https://en.wikipedia.org/wiki/${slug}`,
      title: `${cap(q)} — Wikipedia`,
      snippet: `Learn about ${q}: history, key facts and background on Wikipedia, the free encyclopedia.`,
    },
    {
      host: 'timesofindia.indiatimes.com',
      url: `https://timesofindia.indiatimes.com/topic/${slug}`,
      title: `${cap(q)}: Latest News, Photos and Videos | The Times of India`,
      snippet: `Latest news and updates about ${q} — photos, videos and top stories from across India.`,
    },
    {
      host: 'ndtv.com',
      url: `https://www.ndtv.com/topic/${slug}`,
      title: `${cap(q)} News and Updates | NDTV`,
      snippet: `Find the latest ${q} news, analysis and live updates on NDTV.com.`,
    },
    {
      host: 'bbc.com',
      url: `https://www.bbc.com/news/topics/${slug}`,
      title: `${cap(q)} | BBC News`,
      snippet: `BBC News coverage of ${q} — in-depth reporting and explainers.`,
    },
    {
      host: 'thehindu.com',
      url: `https://www.thehindu.com/topic/${slug}`,
      title: `${cap(q)} — The Hindu`,
      snippet: `The Hindu's coverage of ${q}: news, opinion and editorials.`,
    },
    {
      host: 'indiatoday.in',
      url: `https://www.indiatoday.in/topic/${slug}`,
      title: `${cap(q)} | India Today`,
      snippet: `India Today brings you the latest on ${q} — stories, videos and fact checks.`,
    },
    {
      host: 'moneycontrol.com',
      url: `https://www.moneycontrol.com/news/topic/${slug}`,
      title: `${cap(q)} — Business & Market News | Moneycontrol`,
      snippet: `Business angle on ${q}: markets, economy and personal finance coverage.`,
    },
    {
      host: 'quora.com',
      url: `https://www.quora.com/topic/${slug}`,
      title: `What do people ask about ${cap(q)}? | Quora`,
      snippet: `Questions and answers about ${q} from people across India and the world.`,
    },
  ];
  // Vary slightly per page so "Next" feels alive in demo mode
  const rot = (page - 1) % templates.length;
  const ordered = [...templates.slice(rot), ...templates.slice(0, rot)];
  const items: SearchResultItem[] = ordered.map((t) => ({
    title: t.title,
    url: t.url,
    displayUrl: t.host,
    snippet: t.snippet,
  }));
  return {
    items,
    totalResults: '8',
    demo: true,
    provider: 'demo',
  };
}

export async function searchWeb(
  query: string,
  opts: { page?: number; lang?: Lang } = {}
): Promise<SearchResponse> {
  const page = Math.max(1, opts.page ?? 1);
  const lang = opts.lang ?? 'en';
  const { brave, tavily, gkey, gcx } = readKeys();

  if (brave) {
    try {
      return await braveSearch(query, brave, page, lang);
    } catch {
      // fall through to next provider
    }
  }
  if (tavily) {
    try {
      return await tavilySearch(query, tavily, page, lang);
    } catch {
      // fall through to next provider
    }
  }
  if (gkey && gcx) {
    try {
      return await googleSearch(query, gkey, gcx, page, lang);
    } catch {
      // fall through to demo
    }
  }
  return demoResults(query, page);
}

export const KEY_NAMES = { K_BRAVE, K_TAVILY, K_GKEY, K_GCX };
