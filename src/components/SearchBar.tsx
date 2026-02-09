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

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse recent searches:', e);
      }
    }
  }, []);

  // Save recent search
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
      // Remove duplicate if exists
      const filtered = prev.filter(s => 
        token ? s.token?.address !== token.address : s.query !== searchQuery
      );
      const updated = [newSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Clear recent searches
  const clearRecentSearches = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRecentSearches([]);
  };

  // Close on click outside
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

  // Keyboard navigation
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

  // Arrow key navigation
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

  // Check if query is a Solana address (base58, 32-44 chars)
  const isSolanaAddress = (q: string) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(q);

  // Search with debounce
  useEffect(() => {
    setSelectedIndex(-1);
    
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setLoading(true);
        setShowRecent(false);
        const tokens = await searchTokens(query);
        
        // If query looks like an address, prioritize exact match
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
          // Filter by name, symbol
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
          placeholder="Search by name, symbol, or contract..."
          className="w-full bg-surface border border-border rounded-xl px-4 py-3 pl-11 text-sm text-text-primary placeholder:text-text-dimmed focus:outline-none focus:bg-surface-light focus:border-brand-blue/50 focus:ring-2 focus:ring-brand-blue/20 transition-all duration-200 shadow-sm"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dimmed group-focus-within:text-brand-blue transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin" />
          </div>
        )}
        {/* Keyboard shortcut hint */}
        {!loading && !query && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:block">
            <kbd className="text-[10px] text-text-dimmed bg-surface-light px-2 py-1 rounded-md border border-border font-mono shadow-sm">
              /
            </kbd>
          </div>
        )}
        {/* Clear button */}
        {query && !loading && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-text-dimmed hover:text-text-primary transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl overflow-hidden z-50 shadow-xl shadow-black/30 animate-slide-down">
          <div className="px-3 py-2 border-b border-border-subtle bg-surface-light/50">
            <p className="text-[10px] text-text-dimmed font-semibold uppercase tracking-wider">
              {results.length} Result{results.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="max-h-[360px] overflow-y-auto">
            {results.map((token, index) => (
              <Link
                key={token.pairAddress}
                href={`/token/${token.address}`}
                onClick={() => {
                  saveRecentSearch(query, token);
                  setIsOpen(false);
                  setQuery('');
                }}
                className={cn(
                  "flex items-center justify-between px-4 py-3 hover:bg-surface-hover transition-all duration-150",
                  index !== results.length - 1 && "border-b border-border-subtle",
                  selectedIndex === index && "bg-surface-hover"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {token.logo ? (
                      <img
                        src={token.logo}
                        alt={token.symbol}
                        className="w-10 h-10 rounded-full bg-surface-light ring-2 ring-border/40"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-surface-hover to-surface-light flex items-center justify-center text-text-muted text-sm font-bold ring-2 ring-border/40">
                        {token.symbol.charAt(0)}
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 bg-background rounded-full p-[2px]">
                      <SolanaBadge size={14} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-text-primary text-sm">{token.symbol}</p>
                      {token.priceChange24h > 100 && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold animate-pulse">
                          🔥 HOT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted truncate max-w-[160px]">{token.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm text-text-primary tabular-nums font-semibold">
                    {formatPrice(token.priceUsd)}
                  </p>
                  <p
                    className={cn(
                      'text-xs font-semibold tabular-nums font-mono',
                      token.priceChange24h >= 0 ? 'text-positive' : 'text-negative'
                    )}
                  >
                    {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(1)}%
                  </p>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Footer hint */}
          <div className="px-4 py-2.5 bg-surface-light/80 border-t border-border-subtle flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[10px] text-text-dimmed">
                <kbd className="font-mono bg-surface px-1.5 py-0.5 rounded border border-border-subtle">↑↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-text-dimmed">
                <kbd className="font-mono bg-surface px-1.5 py-0.5 rounded border border-border-subtle">↵</kbd>
                select
              </span>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] text-text-dimmed">
              <kbd className="font-mono bg-surface px-1.5 py-0.5 rounded border border-border-subtle">ESC</kbd>
              close
            </span>
          </div>
        </div>
      )}

      {/* Recent Searches Dropdown */}
      {showRecent && !isOpen && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl overflow-hidden z-50 shadow-xl shadow-black/30 animate-slide-down">
          <div className="px-3 py-2 border-b border-border-subtle bg-surface-light/50 flex items-center justify-between">
            <p className="text-[10px] text-text-dimmed font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent Searches
            </p>
            <button
              onClick={clearRecentSearches}
              className="text-[10px] text-text-dimmed hover:text-text-muted transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="max-h-[280px] overflow-y-auto">
            {recentSearches.map((search, index) => (
              <Link
                key={search.timestamp}
                href={search.token ? `/token/${search.token.address}` : '#'}
                onClick={() => {
                  setShowRecent(false);
                  if (search.token) {
                    setQuery('');
                  } else {
                    setQuery(search.query);
                  }
                }}
                className={cn(
                  "flex items-center justify-between px-4 py-3 hover:bg-surface-hover transition-all duration-150",
                  index !== recentSearches.length - 1 && "border-b border-border-subtle",
                  selectedIndex === index && "bg-surface-hover"
                )}
              >
                <div className="flex items-center gap-3">
                  {search.token ? (
                    <>
                      <div className="relative">
                        {search.token.logo ? (
                          <img
                            src={search.token.logo}
                            alt={search.token.symbol}
                            className="w-8 h-8 rounded-full bg-surface-light ring-1 ring-border/40"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center text-text-muted text-xs font-bold">
                            {search.token.symbol.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary text-[13px]">{search.token.symbol}</p>
                        <p className="text-xs text-text-muted truncate max-w-[140px]">{search.token.name}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center">
                        <svg className="w-4 h-4 text-text-dimmed" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <p className="text-text-secondary text-sm">{search.query}</p>
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
