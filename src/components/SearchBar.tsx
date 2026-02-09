'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Token } from '@/types';
import { searchTokens } from '@/lib/api';
import { formatPrice, cn } from '@/lib/utils';
import { SolanaBadge } from './PlatformIcons';

const MAX_RECENT_SEARCHES = 5;
const STORAGE_KEY = 'apexscreener_recent_searches';

interface RecentSearch {
  query: string;
  token?: {
    address: string;
    symbol: string;
    name: string;
    logo?: string;
  };
  timestamp: number;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Token[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [showRecent, setShowRecent] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  const saveRecentSearch = useCallback((searchQuery: string, token?: Token) => {
    const newSearch: RecentSearch = {
      query: searchQuery,
      token: token ? {
        address: token.address,
        symbol: token.symbol,
        name: token.name,
        logo: token.logo,
      } : undefined,
      timestamp: Date.now(),
    };

    setRecentSearches(prev => {
      const filtered = prev.filter(s => 
        token ? s.token?.address !== token.address : s.query !== searchQuery
      );
      const updated = [newSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearRecentSearches = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRecentSearches([]);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowRecent(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setShowRecent(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    const items = isOpen ? results : (showRecent ? recentSearches : []);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      if (isOpen && results[selectedIndex]) {
        const token = results[selectedIndex];
        saveRecentSearch(query, token);
        window.location.href = `/token/${token.address}`;
      } else if (showRecent && recentSearches[selectedIndex]?.token) {
        window.location.href = `/token/${recentSearches[selectedIndex].token!.address}`;
      }
    }
  };

  const isSolanaAddress = (q: string) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(q);

  useEffect(() => {
    setSelectedIndex(-1);
    
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        setShowRecent(false);
        const tokens = await searchTokens(query);
        
        if (isSolanaAddress(query)) {
          const exactMatch = tokens.find(t => 
            t.address.toLowerCase() === query.toLowerCase() ||
            t.pairAddress.toLowerCase() === query.toLowerCase()
          );
          if (exactMatch) {
            setResults([exactMatch, ...tokens.filter(t => t.address !== exactMatch.address)].slice(0, 8));
          } else {
            setResults(tokens.slice(0, 8));
          }
        } else {
          const filtered = tokens.filter(t => 
            t.name.toLowerCase().includes(query.toLowerCase()) ||
            t.symbol.toLowerCase().includes(query.toLowerCase()) ||
            t.address.toLowerCase().includes(query.toLowerCase())
          );
          setResults(filtered.slice(0, 8));
        }
        setIsOpen(true);
        setLoading(false);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleFocus = () => {
    if (results.length > 0) {
      setIsOpen(true);
    } else if (query.length < 2 && recentSearches.length > 0) {
      setShowRecent(true);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative group">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleInputKeyDown}
          placeholder="Search tokens..."
          className="w-full h-9 bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 pl-9 text-sm text-text-primary placeholder:text-text-dimmed focus:outline-none focus:border-white/[0.12] focus:bg-white/[0.04] transition-all"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dimmed"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
          </div>
        )}
        {!loading && !query && (
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:block text-[10px] text-text-dimmed bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06] font-mono">
            /
          </kbd>
        )}
        {query && !loading && (
          <button
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-text-dimmed hover:text-text-muted transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface-elevated border border-white/[0.08] rounded-xl overflow-hidden z-50 shadow-elevated animate-slide-down">
          <div className="px-3 py-2 border-b border-white/[0.05] bg-white/[0.02]">
            <p className="text-[10px] text-text-dimmed font-semibold uppercase tracking-wider">
              {results.length} Result{results.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="max-h-[320px] overflow-y-auto">
            {results.map((token, index) => (
              <Link
                key={token.pairAddress}
                href={`/token/${token.address}`}
                onClick={() => { saveRecentSearch(query, token); setIsOpen(false); setQuery(''); }}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 hover:bg-white/[0.03] transition-all",
                  index !== results.length - 1 && "border-b border-white/[0.03]",
                  selectedIndex === index && "bg-white/[0.04]"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {token.logo ? (
                      <img src={token.logo} alt={token.symbol} className="w-8 h-8 rounded-full bg-surface-light border border-white/[0.05]" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center text-text-muted text-[11px] font-bold">
                        {token.symbol.charAt(0)}
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 bg-background rounded-full p-[2px]">
                      <SolanaBadge size={11} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text-primary text-[13px]">{token.symbol}</span>
                      <span className="text-[11px] text-text-dimmed">/SOL</span>
                    </div>
                    <p className="text-[11px] text-text-muted truncate max-w-[140px]">{token.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[12px] text-text-primary tabular-nums font-medium">
                    {formatPrice(token.priceUsd)}
                  </p>
                  <p className={cn(
                    'text-[11px] font-medium tabular-nums font-mono',
                    token.priceChange24h >= 0 ? 'text-positive' : 'text-negative'
                  )}>
                    {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Searches */}
      {showRecent && !isOpen && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface-elevated border border-white/[0.08] rounded-xl overflow-hidden z-50 shadow-elevated animate-slide-down">
          <div className="px-3 py-2 border-b border-white/[0.05] bg-white/[0.02] flex items-center justify-between">
            <p className="text-[10px] text-text-dimmed font-semibold uppercase tracking-wider">Recent</p>
            <button onClick={clearRecentSearches} className="text-[10px] text-text-dimmed hover:text-text-muted transition-colors">Clear</button>
          </div>
          <div className="max-h-[260px] overflow-y-auto">
            {recentSearches.map((search, index) => (
              <Link
                key={search.timestamp}
                href={search.token ? `/token/${search.token.address}` : '#'}
                onClick={() => { setShowRecent(false); setQuery(search.token ? '' : search.query); }}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 hover:bg-white/[0.03] transition-all",
                  index !== recentSearches.length - 1 && "border-b border-white/[0.03]",
                  selectedIndex === index && "bg-white/[0.04]"
                )}
              >
                <div className="flex items-center gap-3">
                  {search.token ? (
                    <>
                      <div className="relative">
                        {search.token.logo ? (
                          <img src={search.token.logo} alt={search.token.symbol} className="w-7 h-7 rounded-full bg-surface-light border border-white/[0.05]" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-surface-hover flex items-center justify-center text-text-muted text-[10px] font-bold">
                            {search.token.symbol.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-text-primary text-[12px]">{search.token.symbol}</span>
                        <span className="text-[11px] text-text-muted ml-2">{search.token.name}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-7 h-7 rounded-full bg-white/[0.03] flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-text-dimmed" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <span className="text-text-secondary text-[12px]">{search.query}</span>
                    </>
                  )}
                </div>
                <svg className="w-4 h-4 text-text-dimmed" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
