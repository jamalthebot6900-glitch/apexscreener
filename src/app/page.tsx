'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Token } from '@/types';
import { MOCK_TOKENS, getMockStats } from '@/lib/mockData';
import TokenTable from '@/components/TokenTable';
import LoadingSpinner, { InlineLoader } from '@/components/LoadingSpinner';
import StatsBar from '@/components/StatsBar';
import QuickFilters from '@/components/QuickFilters';
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

      {/* Quick Filters */}
      <QuickFilters />
      
      {/* Main Content */}
      <div className="px-2 lg:px-3 py-2 flex-1 max-w-[1800px] mx-auto w-full">
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
