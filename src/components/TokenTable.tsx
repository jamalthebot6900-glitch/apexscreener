'use client';

import Link from 'next/link';
import { Token, SortField, SortDirection } from '@/types';
import { formatPrice, formatNumber, cn } from '@/lib/utils';
import { useState, useMemo, useEffect, useRef, memo } from 'react';
import { SolanaBadge, PlatformBadge } from './PlatformIcons';
import { useApp } from '@/context/AppContext';
import Sparkline, { generateSparklineData } from './Sparkline';

interface TokenTableProps {
  tokens: Token[];
}

const SORT_STORAGE_KEY = 'apexscreener_sort_preference';

// Format age from timestamp
function formatAge(timestamp: number): string {
  if (!timestamp) return '-';
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

// Enhanced token placeholder with gradient based on name
function TokenPlaceholder({ symbol, name }: { symbol: string; name: string }) {
  const hash = (symbol + name).split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const hue1 = Math.abs(hash) % 360;
  const hue2 = (hue1 + 40) % 360;
  
  return (
    <div 
      className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shadow-inner"
      style={{ 
        background: `linear-gradient(135deg, hsl(${hue1}, 60%, 25%), hsl(${hue2}, 70%, 15%))`,
        color: `hsl(${hue1}, 80%, 70%)`,
        boxShadow: `inset 0 1px 0 0 hsl(${hue1}, 60%, 35%), 0 2px 8px -2px hsl(${hue1}, 60%, 10%)`
      }}
    >
      {symbol.charAt(0).toUpperCase()}
    </div>
  );
}

// Token icon with error handling and Solana badge
const TokenIcon = memo(function TokenIcon({ 
  token, 
  size = 32 
}: { 
  token: Token; 
  size?: number;
}) {
  const [imgError, setImgError] = useState(false);
  
  return (
    <div className="relative flex-shrink-0">
      {token.logo && !imgError ? (
        <img
          src={token.logo}
          alt={token.symbol}
          className="rounded-full bg-surface-light ring-2 ring-border/30 shadow-lg"
          style={{ width: size, height: size }}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <TokenPlaceholder symbol={token.symbol} name={token.name} />
      )}
      
      {/* Crisp Solana badge */}
      <div className="absolute -bottom-0.5 -right-0.5 bg-background rounded-full p-[2px] shadow-lg">
        <SolanaBadge size={14} />
      </div>
    </div>
  );
});

// Watchlist Star Button - memoized
const WatchlistButton = memo(function WatchlistButton({ address }: { address: string }) {
  const { isInWatchlist, toggleWatchlist } = useApp();
  const isWatched = isInWatchlist(address);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWatchlist(address);
      }}
      className={cn(
        'p-1.5 rounded-lg transition-all touch-manipulation',
        'min-w-[32px] min-h-[32px] flex items-center justify-center',
        isWatched
          ? 'text-amber-400 hover:text-amber-300'
          : 'text-text-dimmed hover:text-amber-400 hover:bg-surface-light'
      )}
      title={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <svg
        className="w-4 h-4"
        fill={isWatched ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    </button>
  );
});

// Rank badge component
function RankBadge({ rank }: { rank: number }) {
  if (rank <= 3) {
    const colors = {
      1: 'from-amber-400 to-yellow-500 text-amber-900',
      2: 'from-gray-300 to-gray-400 text-gray-800',
      3: 'from-orange-400 to-amber-600 text-orange-900',
    };
    
    return (
      <div className={cn(
        'w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold bg-gradient-to-br shadow-lg',
        colors[rank as 1 | 2 | 3]
      )}>
        {rank}
      </div>
    );
  }
  
  return (
    <span className="text-[11px] text-text-dimmed font-medium tabular-nums w-6 text-center">
      {rank}
    </span>
  );
}

// Hot Badge component
function HotBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/20 animate-pulse-subtle">
      🔥
    </span>
  );
}

// Sort indicator with animation
function SortIndicator({ active, direction }: { active: boolean; direction: SortDirection }) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center w-3 h-3 transition-opacity",
      active ? "opacity-100" : "opacity-0 group-hover/header:opacity-30"
    )}>
      <svg 
        className={cn(
          "w-3 h-3 transition-all duration-200",
          active && direction === 'asc' ? "text-brand-blue" : active ? "text-brand-blue rotate-180" : "text-text-dimmed"
        )}
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </div>
  );
}

// Animated data cell - optimized with memo
const AnimatedCell = memo(function AnimatedCell({ 
  value, 
  children, 
  className 
}: { 
  value: number | string; 
  children: React.ReactNode; 
  className?: string;
}) {
  const [flash, setFlash] = useState<'positive' | 'negative' | null>(null);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      const numValue = typeof value === 'number' ? value : parseFloat(String(value));
      const numPrevValue = typeof prevValue.current === 'number' ? prevValue.current : parseFloat(String(prevValue.current));
      
      if (!isNaN(numValue) && !isNaN(numPrevValue)) {
        if (numValue > numPrevValue) {
          setFlash('positive');
        } else if (numValue < numPrevValue) {
          setFlash('negative');
        }
      }
      prevValue.current = value;
      
      const timer = setTimeout(() => setFlash(null), 600);
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <span className={cn(
      className,
      flash === 'positive' && 'animate-flash-positive',
      flash === 'negative' && 'animate-flash-negative'
    )}>
      {children}
    </span>
  );
});

// Format numbers with proper commas and decimals
function formatNumberDisplay(value: number, decimals: number = 2): string {
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }) + 'B';
  }
  if (value >= 1_000_000) {
    return (value / 1_000_000).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }) + 'M';
  }
  if (value >= 1_000) {
    return (value / 1_000).toLocaleString('en-US', { 
      minimumFractionDigits: 1, 
      maximumFractionDigits: 1 
    }) + 'K';
  }
  return value.toLocaleString('en-US', { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: decimals 
  });
}

// Token row - memoized for performance
const TokenRow = memo(function TokenRow({ 
  token, 
  rank 
}: { 
  token: Token; 
  rank: number;
}) {
  const isTopPerformer = token.priceChange24h > 50;
  const isHot = token.priceChange24h > 100;
  
  // Generate sparkline data
  const sparklineData = useMemo(() => 
    generateSparklineData(
      token.priceChange5m,
      token.priceChange1h,
      token.priceChange6h,
      token.priceChange24h
    ),
    [token.priceChange5m, token.priceChange1h, token.priceChange6h, token.priceChange24h]
  );

  return (
    <tr
      className={cn(
        "table-row transition-all duration-200",
        rank % 2 === 0 ? "bg-surface/30" : "bg-transparent",
        isTopPerformer && "bg-positive-bg/30 hover:bg-positive-bg/50",
        isHot && "ring-1 ring-inset ring-orange-500/20"
      )}
    >
      {/* Watchlist Button - Sticky */}
      <td className="table-body-cell text-center sticky left-0 z-10 bg-background/95 backdrop-blur-sm border-r border-border/30">
        <WatchlistButton address={token.address} />
      </td>

      {/* Rank */}
      <td className="table-body-cell">
        <RankBadge rank={rank} />
      </td>
      
      {/* Token */}
      <td className="table-body-cell">
        <Link
          href={`/token/${token.address}`}
          className="flex items-center gap-3 group/link"
        >
          <TokenIcon token={token} />
          
          {/* Name, Symbol & Badges */}
          <div className="flex flex-col min-w-0 gap-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-[13px] text-text-primary group-hover/link:text-white transition-colors truncate max-w-[100px] sm:max-w-[120px]">
                {token.name}
              </span>
              {isHot && <HotBadge />}
              <span className="hidden sm:inline-flex">
                <PlatformBadge dexId={token.dexId} address={token.address} />
              </span>
              {token.boosts && token.boosts > 0 && (
                <span className="text-[9px] text-amber-400 flex items-center gap-0.5 bg-amber-400/10 px-1.5 py-0.5 rounded font-medium">
                  ⚡{token.boosts}
                </span>
              )}
            </div>
            <span className="text-[11px] text-text-muted font-medium truncate">
              {token.symbol}
            </span>
          </div>
        </Link>
      </td>
      
      {/* Price */}
      <td className="table-body-cell text-right">
        <AnimatedCell value={token.priceUsd}>
          <span className="font-mono text-[13px] text-text-primary tabular-nums font-medium">
            {formatPrice(token.priceUsd)}
          </span>
        </AnimatedCell>
      </td>
      
      {/* Sparkline - New! */}
      <td className="table-body-cell hidden xl:table-cell">
        <div className="flex justify-end">
          <Sparkline 
            data={sparklineData} 
            width={70} 
            height={24}
          />
        </div>
      </td>
      
      {/* Age */}
      <td className="table-body-cell text-right hidden sm:table-cell">
        <span className="text-xs text-text-muted tabular-nums font-mono">
          {formatAge(token.pairCreatedAt)}
        </span>
      </td>
      
      {/* Txns */}
      <td className="table-body-cell text-right hidden md:table-cell">
        <AnimatedCell value={token.txns24h.total}>
          <span className="text-xs text-text-secondary tabular-nums font-mono">
            {formatNumberDisplay(token.txns24h.total, 0)}
          </span>
        </AnimatedCell>
      </td>
      
      {/* Volume */}
      <td className="table-body-cell text-right">
        <AnimatedCell value={token.volume24h}>
          <span className="text-[13px] text-text-primary font-medium tabular-nums font-mono">
            ${formatNumberDisplay(token.volume24h)}
          </span>
        </AnimatedCell>
      </td>
      
      {/* 5M */}
      <td className="table-body-cell text-right hidden lg:table-cell">
        <PercentBadge value={token.priceChange5m} />
      </td>
      
      {/* 1H */}
      <td className="table-body-cell text-right hidden md:table-cell">
        <PercentBadge value={token.priceChange1h} />
      </td>
      
      {/* 6H */}
      <td className="table-body-cell text-right hidden lg:table-cell">
        <PercentBadge value={token.priceChange6h} />
      </td>
      
      {/* 24H - Bold for emphasis */}
      <td className="table-body-cell text-right">
        <PercentBadge value={token.priceChange24h} bold />
      </td>
      
      {/* Liquidity */}
      <td className="table-body-cell text-right hidden md:table-cell">
        <span className="text-xs text-text-muted tabular-nums font-mono">
          ${formatNumberDisplay(token.liquidity)}
        </span>
      </td>
      
      {/* Market Cap */}
      <td className="table-body-cell text-right hidden lg:table-cell">
        <AnimatedCell value={token.marketCap}>
          <span className="text-[13px] text-text-primary font-medium tabular-nums font-mono">
            ${formatNumberDisplay(token.marketCap)}
          </span>
        </AnimatedCell>
      </td>
    </tr>
  );
});

// Percent badge with background
function PercentBadge({ value, bold = false }: { value: number; bold?: boolean }) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  
  return (
    <span
      className={cn(
        'text-xs tabular-nums font-mono inline-block px-1.5 py-0.5 rounded',
        bold ? 'font-semibold' : 'font-medium',
        isPositive && 'text-positive bg-positive/10',
        isNegative && 'text-negative bg-negative/10',
        !isPositive && !isNegative && 'text-text-dimmed bg-surface-light/50'
      )}
    >
      {isPositive ? '+' : ''}{value?.toFixed(1) || '0.0'}%
    </span>
  );
}

export default function TokenTable({ tokens }: TokenTableProps) {
  const [sortField, setSortField] = useState<SortField>('volume24h');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Load sort preference from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(SORT_STORAGE_KEY);
    if (stored) {
      try {
        const { field, direction } = JSON.parse(stored);
        if (field) setSortField(field);
        if (direction) setSortDirection(direction);
      } catch (e) {
        console.error('Failed to parse sort preference:', e);
      }
    }
  }, []);

  // Save sort preference
  const handleSort = (field: SortField) => {
    let newDirection: SortDirection = 'desc';
    if (sortField === field) {
      newDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    }
    
    setSortField(field);
    setSortDirection(newDirection);
    
    localStorage.setItem(SORT_STORAGE_KEY, JSON.stringify({ field, direction: newDirection }));
  };

  const getSortValue = (token: Token, field: SortField): number => {
    switch (field) {
      case 'txns24h':
        return token.txns24h.total;
      default:
        return (token[field] as number) ?? 0;
    }
  };

  const sortedTokens = useMemo(() => {
    return [...tokens].sort((a, b) => {
      const aVal = getSortValue(a, sortField);
      const bVal = getSortValue(b, sortField);
      return sortDirection === 'desc' ? bVal - aVal : aVal - bVal;
    });
  }, [tokens, sortField, sortDirection]);

  const SortHeader = ({ field, label, className }: { field: SortField; label: string; className?: string }) => (
    <th
      className={cn(
        "table-header-cell text-right cursor-pointer group/header hover:text-text-secondary transition-colors select-none",
        className
      )}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center justify-end gap-1.5">
        <span className={cn(
          "transition-colors",
          sortField === field ? "text-brand-blue font-bold" : ""
        )}>
          {label}
        </span>
        <SortIndicator active={sortField === field} direction={sortDirection} />
      </div>
    </th>
  );

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 scrollbar-thin">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr className="border-b border-border bg-gradient-to-r from-surface-light/60 to-surface-light/40">
            <th className="table-header-cell text-center w-10 sticky left-0 bg-surface-light/95 backdrop-blur-sm z-20 border-r border-border/30"></th>
            <th className="table-header-cell text-left w-12">#</th>
            <th className="table-header-cell text-left min-w-[180px]">Token</th>
            <th className="table-header-cell text-right">Price</th>
            <th className="table-header-cell text-right hidden xl:table-cell w-[90px]">Trend</th>
            <th className="table-header-cell text-right hidden sm:table-cell">Age</th>
            <SortHeader field="txns24h" label="Txns" className="hidden md:table-cell" />
            <SortHeader field="volume24h" label="Volume" />
            <SortHeader field="priceChange5m" label="5m" className="hidden lg:table-cell" />
            <SortHeader field="priceChange1h" label="1h" className="hidden md:table-cell" />
            <SortHeader field="priceChange6h" label="6h" className="hidden lg:table-cell" />
            <SortHeader field="priceChange24h" label="24h" />
            <SortHeader field="liquidity" label="Liquidity" className="hidden md:table-cell" />
            <SortHeader field="marketCap" label="MCap" className="hidden lg:table-cell" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {sortedTokens.map((token, index) => (
            <TokenRow 
              key={token.pairAddress || token.address} 
              token={token} 
              rank={index + 1}
            />
          ))}
        </tbody>
      </table>
      
      {/* Empty State */}
      {sortedTokens.length === 0 && (
        <div className="empty-state py-12">
          <svg className="empty-state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <p className="empty-state-title">No tokens found</p>
          <p className="empty-state-description">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
}
