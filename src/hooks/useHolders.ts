'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchHolderStats, fetchTopHolders, fetchTokenSecurity, HolderStats, TokenHolder, TokenSecurity } from '@/lib/birdeye';

interface UseHoldersState {
  stats: HolderStats | null;
  holders: TokenHolder[];
  security: TokenSecurity | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export function useHolders(tokenAddress: string | null, enabled: boolean = true) {
  const [state, setState] = useState<UseHoldersState>({
    stats: null,
    holders: [],
    security: null,
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  const fetchData = useCallback(async () => {
    if (!tokenAddress) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const [statsData, holdersData, securityData] = await Promise.all([
        fetchHolderStats(tokenAddress),
        fetchTopHolders(tokenAddress, 20),
        fetchTokenSecurity(tokenAddress),
      ]);

      setState({
        stats: statsData,
        holders: holdersData,
        security: securityData,
        isLoading: false,
        error: null,
        lastUpdated: Date.now(),
      });
    } catch (err) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch holder data',
      }));
    }
  }, [tokenAddress]);

  useEffect(() => {
    if (enabled && tokenAddress) {
      fetchData();
    }
  }, [enabled, tokenAddress, fetchData]);

  // Calculate concentration risk score (0-100, higher = riskier)
  const concentrationRisk = state.stats
    ? Math.min(100, Math.round(state.stats.top10Percentage * 1.2))
    : null;

  // Security flags
  const securityFlags = state.security ? {
    isSafe: !state.security.isMintable && !state.security.isFreezable,
    warnings: [
      ...(state.security.isMintable ? ['Mint authority not revoked'] : []),
      ...(state.security.isFreezable ? ['Freeze authority enabled'] : []),
    ],
  } : null;

  return {
    ...state,
    concentrationRisk,
    securityFlags,
    refresh: fetchData,
  };
}
