'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Token } from '@/types';
import { MOCK_TOKENS, getMockStats } from '@/lib/mockData';
import TokenTable from '@/components/TokenTable';
import LoadingSpinner, { InlineLoader } from '@/components/LoadingSpinner';
import StatsBar from '@/components/StatsBar';
import FilterDropdowns from '@/components/FilterDropdowns';
import { useApp, ViewType } from '@/context/AppContext';

const viewConfig: Record<ViewType, { title: string; description: string }> = {
  all: { title: 'All Tokens', description: 'Complete token list' },
  watchlist: { title: 'Watchlist', description: 'Your saved tokens' },
  new: { title: 'New Pairs', description: 'Created in the last 24h' },
  graduated: { title: 'Recently Graduated', description: 'Tokens that recently graduated from launchpad' },
  gainers: { title: 'Top Gainers', description: 'Best 24h performance' },
  losers: { title: 'Top Losers', description: 'Worst 24h performance' },
};

export default function HomePage() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [totalVolume, setTotalVolume] = useState(0);
  const [totalTxns, setTotalTxns] = useState(0);
  const [totalMarketCap, setTotalMarketCap] = useState(0);

  const { currentView, watchlist, filters } = useApp();

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      
      // Use mock data for reliable demo
      const data = MOCK_TOKENS;
      const stats = getMockStats();
      
      setTokens(data);
      setLastUpdated(new Date());
      setTotalVolume(stats.volume24h);
      setTotalTxns(stats.txns24h);
      setTotalMarketCap(stats.marketCap);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const displayTokens = useMemo(() => {
    let filtered = [...tokens];

    switch (currentView) {
      case 'watchlist':
        filtered = filtered.filter(t => watchlist.includes(t.address));
        break;
      case 'new':
        const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
        filtered = filtered.filter(t => t.pairCreatedAt && t.pairCreatedAt > twentyFourHoursAgo);
        filtered.sort((a, b) => b.pairCreatedAt - a.pairCreatedAt);
        break;
      case 'gainers':
        filtered = filtered.filter(t => t.priceChange24h > 0);
        filtered.sort((a, b) => b.priceChange24h - a.priceChange24h);
        break;
      case 'losers':
        filtered = filtered.filter(t => t.priceChange24h < 0);
        filtered.sort((a, b) => a.priceChange24h - b.priceChange24h);
        break;
    }

    if (filters.minLiquidity !== null) {
      filtered = filtered.filter(t => t.liquidity >= filters.minLiquidity!);
    }
    if (filters.minVolume !== null) {
      filtered = filtered.filter(t => t.volume24h >= filters.minVolume!);
    }
    if (filters.maxAge !== null) {
      const cutoff = Date.now() - filters.maxAge * 60 * 60 * 1000;
      filtered = filtered.filter(t => t.pairCreatedAt && t.pairCreatedAt > cutoff);
    }

    return filtered;
  }, [tokens, currentView, watchlist, filters]);

  const config = viewConfig[currentView];

  return (
    <div className="flex flex-col min-h-full">
      {/* Stats Bar */}
      <StatsBar 
        volume24h={totalVolume} 
        txns24h={totalTxns} 
        marketCap={totalMarketCap}
      />
      
      {/* Main Content */}
      <div className="px-3 lg:px-4 py-3 lg:py-4 flex-1 max-w-[1800px] mx-auto w-full">
        {/* Page Header */}
        <div className="mb-3 lg:mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-sm font-semibold text-text-primary">{config.title}</h1>
                <p className="text-[11px] text-text-muted">
                  {config.description} · {displayTokens.length} tokens
                </p>
              </div>
              {refreshing && <InlineLoader />}
            </div>
            
            {lastUpdated && !loading && (
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-text-dimmed tabular-nums font-mono hidden sm:inline">
                  {lastUpdated.toLocaleTimeString()}
                </span>
                <button
                  onClick={() => fetchData(true)}
                  disabled={refreshing}
                  className="btn-ghost flex items-center gap-1 disabled:opacity-50"
                >
                  <svg 
                    className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-3 hidden sm:block">
          <FilterDropdowns />
        </div>

        {/* Mobile Filters */}
        <div className="mb-3 sm:hidden">
          <details className="group">
            <summary className="btn-secondary inline-flex items-center gap-1.5 cursor-pointer list-none text-[11px]">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </summary>
            <div className="mt-2 p-2.5 bg-surface-light rounded-md border border-border animate-slide-down">
              <FilterDropdowns />
            </div>
          </details>
        </div>

        {/* Token Table */}
        {loading ? (
          <div className="card overflow-hidden">
            <LoadingSpinner />
          </div>
        ) : displayTokens.length === 0 ? (
          <div className="card animate-fade-in">
            <div className="empty-state">
              <div className="w-10 h-10 rounded-md bg-surface-light flex items-center justify-center mb-3">
                {currentView === 'watchlist' ? (
                  <svg className="w-5 h-5 text-text-dimmed" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-text-dimmed" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                )}
              </div>
              <p className="empty-state-title">
                {currentView === 'watchlist' ? 'Your watchlist is empty' : 'No tokens match your filters'}
              </p>
              <p className="empty-state-description">
                {currentView === 'watchlist'
                  ? 'Click the star icon on any token to add it here'
                  : 'Try adjusting your filters'}
              </p>
            </div>
          </div>
        ) : (
          <div className="card overflow-hidden animate-fade-in">
            <TokenTable tokens={displayTokens} />
          </div>
        )}
      </div>
    </div>
  );
}
