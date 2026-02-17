'use client';

import { useState, useEffect, useCallback } from 'react';

const WATCHLIST_KEY = 'apexscreener_watchlist';

export interface WatchlistItem {
  address: string;
  symbol: string;
  name: string;
  addedAt: number;
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
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

  const addToWatchlist = useCallback((item: Omit<WatchlistItem, 'addedAt'>) => {
    setWatchlist(prev => {
      // Don't add if already exists
      if (prev.some(w => w.address === item.address)) {
        return prev;
      }
      return [...prev, { ...item, addedAt: Date.now() }];
    });
  }, []);

  const removeFromWatchlist = useCallback((address: string) => {
    setWatchlist(prev => prev.filter(w => w.address !== address));
  }, []);

  const isInWatchlist = useCallback((address: string) => {
    return watchlist.some(w => w.address === address);
  }, [watchlist]);

  const toggleWatchlist = useCallback((item: Omit<WatchlistItem, 'addedAt'>) => {
    if (isInWatchlist(item.address)) {
      removeFromWatchlist(item.address);
    } else {
      addToWatchlist(item);
    }
  }, [isInWatchlist, addToWatchlist, removeFromWatchlist]);

  // Export watchlist to CSV
  const exportToCSV = useCallback(() => {
    if (watchlist.length === 0) return;
    
    const headers = ['Symbol', 'Name', 'Address', 'Added Date'];
    const rows = watchlist.map(item => [
      item.symbol,
      item.name,
      item.address,
      new Date(item.addedAt).toISOString(),
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `watchlist-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [watchlist]);

  // Clear entire watchlist
  const clearWatchlist = useCallback(() => {
    setWatchlist([]);
  }, []);

  return {
    watchlist,
    isLoaded,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
    exportToCSV,
    clearWatchlist,
    count: watchlist.length,
  };
}
