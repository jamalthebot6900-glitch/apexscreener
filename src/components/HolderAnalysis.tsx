'use client';

import { useState, useEffect } from 'react';
import { fetchHolderStats, fetchTopHolders, HolderStats, TokenHolder } from '@/lib/birdeye';

interface HolderAnalysisProps {
  tokenAddress: string;
  tokenSymbol?: string;
}

// Truncate address for display
function truncateAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

// Format large numbers
function formatNumber(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toFixed(2);
}

// Concentration risk level
function getConcentrationRisk(percentage: number): { level: string; color: string } {
  if (percentage >= 80) return { level: 'Extreme', color: 'text-red-500' };
  if (percentage >= 60) return { level: 'High', color: 'text-orange-500' };
  if (percentage >= 40) return { level: 'Medium', color: 'text-yellow-500' };
  if (percentage >= 20) return { level: 'Low', color: 'text-green-500' };
  return { level: 'Healthy', color: 'text-emerald-500' };
}

export default function HolderAnalysis({ tokenAddress, tokenSymbol }: HolderAnalysisProps) {
  const [stats, setStats] = useState<HolderStats | null>(null);
  const [holders, setHolders] = useState<TokenHolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const [statsData, holdersData] = await Promise.all([
          fetchHolderStats(tokenAddress),
          fetchTopHolders(tokenAddress, 10),
        ]);

        if (cancelled) return;

        setStats(statsData);
        setHolders(holdersData);
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load holder data');
          console.error(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [tokenAddress]);

  if (loading) {
    return (
      <div className="bg-[#12141a] rounded-lg border border-white/[0.04] p-4">
        <div className="animate-pulse">
          <div className="h-5 bg-white/10 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-white/10 rounded w-full"></div>
            <div className="h-4 bg-white/10 rounded w-2/3"></div>
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-[#12141a] rounded-lg border border-white/[0.04] p-4">
        <div className="flex items-center gap-2 text-[#888] text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Holder data unavailable</span>
        </div>
        <p className="text-[11px] text-[#666] mt-2">
          Add BIRDEYE_API_KEY to enable holder analysis
        </p>
      </div>
    );
  }

  const risk = getConcentrationRisk(stats.top10Percentage);

  return (
    <div className="bg-[#12141a] rounded-lg border border-white/[0.04] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/[0.04]">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
            <svg className="w-4 h-4 text-[#9455ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Holder Analysis
          </h3>
          {stats.totalHolders > 0 && (
            <span className="text-[#888] text-xs">
              {formatNumber(stats.totalHolders)} holders
            </span>
          )}
        </div>
      </div>

      {/* Concentration Stats */}
      <div className="p-4 space-y-3">
        {/* Concentration Risk Indicator */}
        <div className="flex items-center justify-between py-2 px-3 bg-[#1a1c24] rounded-lg">
          <span className="text-[#888] text-xs">Concentration Risk</span>
          <span className={`text-sm font-semibold ${risk.color}`}>
            {risk.level}
          </span>
        </div>

        {/* Top Holder Percentages */}
        <div className="space-y-2">
          <ConcentrationBar label="Top 10" percentage={stats.top10Percentage} />
          <ConcentrationBar label="Top 20" percentage={stats.top20Percentage} />
          <ConcentrationBar label="Top 50" percentage={stats.top50Percentage} />
        </div>
      </div>

      {/* Top Holders List */}
      {holders.length > 0 && (
        <div className="border-t border-white/[0.04]">
          <div className="px-4 py-2 text-xs text-[#888] font-medium">
            Top Holders
          </div>
          <div className="px-4 pb-4">
            <div className="space-y-1">
              {holders.map((holder) => (
                <div
                  key={holder.address}
                  className="flex items-center justify-between py-2 px-3 bg-[#1a1c24] rounded-lg hover:bg-[#1e2028] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[#666] text-xs w-5">#{holder.rank}</span>
                    <a
                      href={`https://solscan.io/account/${holder.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#9455ff] text-xs hover:underline font-mono"
                    >
                      {truncateAddress(holder.address)}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white text-xs">
                      {formatNumber(holder.balance)} {tokenSymbol || ''}
                    </span>
                    <span className="text-[#888] text-xs w-16 text-right">
                      {holder.percentage.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Concentration bar component
function ConcentrationBar({ label, percentage }: { label: string; percentage: number }) {
  const color = percentage >= 80 ? 'bg-red-500' :
                percentage >= 60 ? 'bg-orange-500' :
                percentage >= 40 ? 'bg-yellow-500' :
                percentage >= 20 ? 'bg-green-500' : 'bg-emerald-500';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#888]">{label}</span>
        <span className="text-white font-medium">{percentage.toFixed(1)}%</span>
      </div>
      <div className="h-1.5 bg-[#1a1c24] rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}
