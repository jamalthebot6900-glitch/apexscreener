'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Token } from '@/types';
import { fetchTokensByAddresses } from '@/lib/api';
import TokenTable from '@/components/TokenTable';
import LoadingSpinner, { InlineLoader } from '@/components/LoadingSpinner';
import StatsBar from '@/components/StatsBar';
import FilterDropdowns from '@/components/FilterDropdowns';
import { useApp, ViewType } from '@/context/AppContext';
import tokenConfig from '@/config/tokens.json';

// View titles and descriptions
const viewConfig: Record<ViewType, { title: string; description: string }> = {
  all: { title: 'All Tokens', description: 'Complete token list' },
  watchlist: { title: 'Watchlist', description: 'Your saved tokens' },
  new: { title: 'New Pairs', description: 'Tokens created in the last 24 hours' },
  gainers: { title: 'Top Gainers', description: 'Best performing tokens by 24h change' },
  losers: { title: 'Top Losers', description: 'Worst performing tokens by 24h change' },
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
      const data = await fetchTokensByAddresses(tokenConfig.tokens);
      setTokens(data);
      setLastUpdated(new Date());
      
      // Calculate real totals from loaded tokens
      const volume = data.reduce((acc, token) => acc + (token.volume24h || 0), 0);
      const txns = data.reduce((acc, token) => acc + (token.txns24h?.total || 0), 0);
      const mcap = data.reduce((acc, token) => acc + (token.marketCap || 0), 0);
      
      setTotalVolume(volume);
      setTotalTxns(txns);
      setTotalMarketCap(mcap);
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

  // Filter and sort tokens based on current view and filters
  const displayTokens = useMemo(() => {
    let filtered = [...tokens];

    // Apply view-specific filtering
    switch (currentView) {
      case 'watchlist':
        filtered = filtered.filter(t => watchlist.includes(t.address));
        break;
      case 'new':
        // Tokens less than 24 hours old
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

    // Apply user filters
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

  // Count hot tokens
  const hotTokensCount = useMemo(() => 
    displayTokens.filter(t => t.priceChange24h > 100).length
  , [displayTokens]);

  return (
    <div className="flex flex-col min-h-full">
      {/* Stats Bar */}
      <StatsBar 
        volume24h={totalVolume} 
        txns24h={totalTxns} 
        marketCap={totalMarketCap}
      />
      
      {/* Main Content */}
      <div className="px-4 lg:px-6 py-4 lg:py-6 flex-1 max-w-[1800px] mx-auto w-full">
        {/* Page Header */}
        <div className="mb-4 lg:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-bold text-text-primary">{config.title}</h1>
                  {hotTokensCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-orange-500/20 text-orange-400 animate-pulse-subtle">
                      🔥 {hotTokensCount} Hot
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-dimmed mt-0.5">
                  {config.description} · {displayTokens.length} tokens
                </p>
              </div>
              {refreshing && <InlineLoader />}
            </div>
            
            {lastUpdated && !loading && (
              <div className="flex items-center gap-4">
                <span className="text-[11px] text-text-dimmed tabular-nums font-mono hidden sm:inline">
                  Updated {lastUpdated.toLocaleTimeString()}
                </span>
                <button
                  onClick={() => fetchData(true)}
                  disabled={refreshing}
                  className="btn-ghost flex items-center gap-1.5 disabled:opacity-50 group"
                >
                  <svg 
                    className={`w-3.5 h-3.5 transition-transform group-hover:rotate-180 ${refreshing ? 'animate-spin' : ''}`} 
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

        {/* Filter Dropdowns - Desktop */}
        <div className="mb-4 hidden sm:block">
          <FilterDropdowns />
        </div>

        {/* Mobile Filter Toggle */}
        <div className="mb-4 sm:hidden">
          <details className="group">
            <summary className="btn-secondary inline-flex items-center gap-2 cursor-pointer list-none">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
              <svg className="w-3 h-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="mt-3 p-3 bg-surface-light rounded-lg border border-border animate-slide-down">
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
            <div className="empty-state py-12">
              <div className="w-14 h-14 rounded-xl bg-surface-light flex items-center justify-center mb-4">
                {currentView === 'watchlist' ? (
                  <svg className="w-7 h-7 text-text-dimmed" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7 text-text-dimmed" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                )}
              </div>
              <p className="empty-state-title">
                {currentView === 'watchlist' 
                  ? 'Your watchlist is empty' 
                  : 'No tokens match your filters'}
              </p>
              <p className="empty-state-description">
                {currentView === 'watchlist'
                  ? 'Click the star icon on any token to add it here'
                  : 'Try adjusting your filters or check back later'}
              </p>
            </div>
          </div>
        ) : (
          <div className="card overflow-hidden animate-fade-in">
            <TokenTable tokens={displayTokens} />
          </div>
        )}

        {/* Stats Summary Cards */}
        {!loading && displayTokens.length > 0 && (
          <div className="mt-4 lg:mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-in-up">
            <StatCard
              label="Tokens Shown"
              value={displayTokens.length.toString()}
            />
            <StatCard
              label="Avg 24h Change"
              value={`${(displayTokens.reduce((a, t) => a + t.priceChange24h, 0) / displayTokens.length).toFixed(1)}%`}
              trend={displayTokens.reduce((a, t) => a + t.priceChange24h, 0) / displayTokens.length >= 0 ? 'up' : 'down'}
            />
            <StatCard
              label="Total Volume"
              value={formatCompact(displayTokens.reduce((a, t) => a + t.volume24h, 0))}
            />
            <StatCard
              label="Total Liquidity"
              value={formatCompact(displayTokens.reduce((a, t) => a + t.liquidity, 0))}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function formatCompact(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

function StatCard({ 
  label, 
  value, 
  trend 
}: { 
  label: string; 
  value: string; 
  trend?: 'up' | 'down';
}) {
  return (
    <div className="card p-3 lg:p-4 hover:border-border-light transition-all duration-200 hover:shadow-lg hover:shadow-black/10">
      <p className="text-text-dimmed text-[10px] uppercase tracking-wider font-semibold mb-1.5 lg:mb-2">
        {label}
      </p>
      <div className="flex items-center gap-2">
        {trend && (
          <svg 
            className={`w-4 h-4 ${trend === 'up' ? 'text-positive' : 'text-negative'}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2.5}
          >
            {trend === 'up' ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 7L7 17M7 17H17M7 17V7" />
            )}
          </svg>
        )}
        <p className={`text-base lg:text-lg font-bold tabular-nums font-mono ${
          trend === 'up' ? 'text-positive' : 
          trend === 'down' ? 'text-negative' : 
          'text-text-primary'
        }`}>
          {value}
        </p>
      </div>
    </div>
  );
}
