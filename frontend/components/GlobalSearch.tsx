'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchEnhanced } from '@/components/SearchEnhanced';
import {
  preloadSmartSearch,
  smartProductSearch,
  type SmartSearchResult,
} from '@/lib/search/smartSearch';

const RECENT_KEY = 'ecostore:recent-searches';
const MAX_RECENTS = 6;

const TRENDING_TERMS = [
  'noise cancelling headphones',
  'wireless mechanical keyboard',
  'smart projector',
  'fitness tracker',
  'espresso machine',
  'trail running shoes',
];

export function GlobalSearch({ className = '' }: { className?: string }) {
  const router = useRouter();
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    preloadSmartSearch();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(RECENT_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as string[];
        setRecent(parsed.slice(0, MAX_RECENTS));
      } catch {
        // ignore corrupt storage
      }
    }
  }, []);

  const persistRecent = useCallback((term: string) => {
    if (!term.trim()) return;
    setRecent((prev) => {
      const next = [term, ...prev.filter((entry) => entry !== term)].slice(0, MAX_RECENTS);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    const results = await smartProductSearch(query);
    if (query.trim() && results.length > 0) {
      persistRecent(query.trim());
    }
    return results;
  }, [persistRecent]);

  const handleSelect = useCallback((result: SmartSearchResult) => {
    persistRecent(result.name);
    router.push(`/product/${result.id}`);
  }, [persistRecent, router]);

  const trending = useMemo(() => TRENDING_TERMS, []);

  return (
    <div className={className}>
      <SearchEnhanced
        onSearch={handleSearch}
        onSelectResult={handleSelect}
        recentSearches={recent}
        trendingSearches={trending}
      />
    </div>
  );
}
