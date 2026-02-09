'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Token } from '@/types';

const FILTERS_KEY = 'apexscreener_filters';

export interface FilterState {
  minLiquidity: number | null;
  minVolume: number | null;
  maxAge: number | null; // in hours
  chain: string;
}

const defaultFilters: FilterState = {
  minLiquidity: null,
  minVolume: null,
  maxAge: null,
  chain: 'solana',
};

export function useFilters() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load filters from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FILTERS_KEY);
      if (stored) {
        setFilters({ ...defaultFilters, ...JSON.parse(stored) });
      }
    } catch (e) {
      console.error('Failed to load filters:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever filters change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
      } catch (e) {
        console.error('Failed to save filters:', e);
      }
    }
  }, [filters, isLoaded]);

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.minLiquidity !== null ||
      filters.minVolume !== null ||
      filters.maxAge !== null
    );
  }, [filters]);

  const filterTokens = useCallback((tokens: Token[]): Token[] => {
    return tokens.filter(token => {
      // Liquidity filter
      if (filters.minLiquidity !== null && token.liquidity < filters.minLiquidity) {
        return false;
      }

      // Volume filter
      if (filters.minVolume !== null && token.volume24h < filters.minVolume) {
        return false;
      }

      // Age filter (maxAge in hours)
      if (filters.maxAge !== null && token.pairCreatedAt) {
        const ageInHours = (Date.now() - token.pairCreatedAt) / (1000 * 60 * 60);
        if (ageInHours > filters.maxAge) {
          return false;
        }
      }

      return true;
    });
  }, [filters]);

  return {
    filters,
    isLoaded,
    updateFilter,
    resetFilters,
    hasActiveFilters,
    filterTokens,
  };
}
