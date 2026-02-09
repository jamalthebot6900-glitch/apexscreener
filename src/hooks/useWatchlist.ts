'use client';

import { useState, useEffect, useCallback } from 'react';

const WATCHLIST_KEY = 'apexscreener_watchlist';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WATCHLIST_KEY);
      if (stored) {
        setWatchlist(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load watchlist:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever watchlist changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
      } catch (e) {
        console.error('Failed to save watchlist:', e);
      }
    }
  }, [watchlist, isLoaded]);

  const addToWatchlist = useCallback((address: string) => {
    setWatchlist(prev => {
      if (prev.includes(address)) return prev;
      return [...prev, address];
    });
  }, []);

  const removeFromWatchlist = useCallback((address: string) => {
    setWatchlist(prev => prev.filter(a => a !== address));
  }, []);

  const toggleWatchlist = useCallback((address: string) => {
    setWatchlist(prev => {
      if (prev.includes(address)) {
        return prev.filter(a => a !== address);
      }
      return [...prev, address];
    });
  }, []);

  const isInWatchlist = useCallback((address: string) => {
    return watchlist.includes(address);
  }, [watchlist]);

  return {
    watchlist,
    isLoaded,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    isInWatchlist,
    count: watchlist.length,
  };
}
