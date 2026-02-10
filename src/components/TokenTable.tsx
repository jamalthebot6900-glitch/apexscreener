'use client';

import Link from 'next/link';
import { Token, SortField, SortDirection } from '@/types';
import { formatPrice, formatNumber, cn } from '@/lib/utils';
import { useState, useMemo, useEffect, useRef, memo } from 'react';
import { SolanaBadge, DexBadge } from './PlatformIcons';
import { useApp } from '@/context/AppContext';
import Sparkline, { generateSparklineData } from './Sparkline';

interface TokenTableProps {
  tokens: Token[];
}

const SORT_STORAGE_KEY = 'apexscreener_sort_preference';

// Format age from timestamp - DexScreener style
function formatAge(timestamp: number): string {
  if (!timestamp) return '-';
  const now = Date.now();
  const diff = now - timestamp;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const months = Math.floor(days / 30);
  
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 30) return `${days}d`;
  return `${months}mo`;
}

// Format price with appropriate precision for small prices
function formatPriceDisplay(price: number): string {
  if (!price || price === 0) return '$0';
  
  if (price < 0.00000001) {
    return '$' + price.toExponential(2);
  }
  if (price < 0.0000001) {
    return '$0.0₈' + Math.floor(price * 100000000).toString().slice(0, 4);
  }
  if (price < 0.000001) {
    return '$0.0₇' + Math.floor(price * 10000000).toString().slice(0, 4);
  }
  if (price < 0.00001) {
    return '$0.0₆' + Math.floor(price * 1000000).toString().slice(0, 4);
  }
  if (price < 0.0001) {
    return '$0.0₅' + Math.floor(price * 100000).toString().slice(0, 4);
  }
  if (price < 0.001) {
    return '$0.0₄' + Math.floor(price * 10000).toString().slice(0, 4);
  }
  if (price < 0.01) {
    return '$' + price.toFixed(6);
  }
  if (price < 1) {
    return '$' + price.toFixed(4);
  }
  if (price < 1000) {
    return '$' + price.toFixed(2);
  }
  return '$' + price.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

// Token placeholder with gradient - compact size
function TokenPlaceholder({ symbol }: { symbol: string }) {
  const hash = symbol.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const hue = Math.abs(hash) % 360;
  
  return (
    <div 
      className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
      style={{ 
        background: `linear-gradient(135deg, hsl(${hue}, 40%, 20%), hsl(${hue}, 50%, 10%))`,
        color: `hsl(${hue}, 60%, 60%)`
      }}
    >
      {symbol.charAt(0).toUpperCase()}
    </div>
  );
}

// Token icon with Solana badge - compact size
const TokenIcon = memo(function TokenIcon({ token }: { token: Token }) {
  const [imgError, setImgError] = useState(false);
  
  return (
    <div className="relative flex-shrink-0">
      {token.logo && !imgError ? (
        <img
          src={token.logo}
          alt={token.symbol}
          className="w-6 h-6 rounded-full bg-surface-light"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <TokenPlaceholder symbol={token.symbol} />
      )}
      <div className="absolute -bottom-0.5 -right-0.5 bg-background rounded-full p-[2px]">
        <SolanaBadge size={11} />
      </div>
    </div>
  );
});

// Watchlist Star - compact
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
        'p-0.5 transition-all',
        isWatched
          ? 'text-amber-400'
          : 'text-white/20 hover:text-amber-400'
      )}
    >
      <svg
        className="w-3 h-3"
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

// Sort indicator
function SortIndicator({ active, direction }: { active: boolean; direction: SortDirection }) {
  return (
    <svg 
      className={cn(
        "w-3 h-3 transition-all",
        active ? "text-text-primary" : "text-text-dimmed opacity-0 group-hover/header:opacity-50",
        active && direction === 'asc' && "rotate-180"
      )}
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// Format compact number
function formatCompact(value: number, decimals: number = 2): string {
  if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(2) + 'B';
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + 'M';
  if (value >= 1_000) return (value / 1_000).toFixed(1) + 'K';
  return value.toFixed(decimals);
}

// Percent display with color
function PercentCell({ value, bold = false }: { value: number; bold?: boolean }) {
  const isPositive = value > 0;
  const isNegative = value < 0;
  
  return (
    <span className={cn(
      'tabular-nums text-sm',
      bold ? 'font-bold' : 'font-semibold',
      isPositive && 'text-[#00e676]',
      isNegative && 'text-[#ff5252]',
      !isPositive && !isNegative && 'text-white/50'
    )}>
      {isPositive ? '+' : ''}{value?.toFixed(2) || '0.00'}%
    </span>
  );
}

// Token row - compact DexScreener style
const TokenRow = memo(function TokenRow({ token, rank }: { token: Token; rank: number }) {
  const isHot = token.priceChange24h > 100;
  
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
    <tr className={cn(
      "border-b border-white/[0.06] hover:bg-white/[0.03] transition-colors group/row",
      isHot && "bg-orange-500/[0.04]"
    )}>
      {/* Rank */}
      <td className="px-3 py-2 w-10 text-center">
        <span className={cn(
          "text-sm tabular-nums font-medium",
          rank <= 3 ? "text-white font-bold" : "text-white/50"
        )}>
          #{rank}
        </span>
      </td>
      
      {/* Token Info */}
      <td className="px-2 py-2 min-w-[220px]">
        <Link href={`/token/${token.address}`} className="flex items-center gap-3 group/link">
          <TokenIcon token={token} />
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-bold text-white group-hover/link:text-blue-400 truncate">
              {token.symbol}
            </span>
            <span className="text-xs text-white/50 font-medium">/SOL</span>
            <span className="text-xs text-white/40 truncate max-w-[100px]">{token.name}</span>
            {isHot && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold">🔥</span>
            )}
          </div>
        </Link>
      </td>
      
      {/* Price */}
      <td className="px-3 py-2 text-right">
        <span className="text-sm text-white font-semibold tabular-nums">
          {formatPriceDisplay(token.priceUsd)}
        </span>
      </td>
      
      {/* Sparkline */}
      <td className="px-2 py-2 hidden xl:table-cell">
        <div className="flex justify-center">
          <Sparkline data={sparklineData} width={70} height={22} />
        </div>
      </td>
      
      {/* Age */}
      <td className="px-3 py-2 text-center hidden sm:table-cell">
        <span className="text-sm text-white/70 tabular-nums font-medium">
          {formatAge(token.pairCreatedAt)}
        </span>
      </td>
      
      {/* Txns */}
      <td className="px-3 py-2 text-right hidden md:table-cell">
        <span className="text-sm text-white/80 tabular-nums font-medium">
          {formatCompact(token.txns24h.total, 0)}
        </span>
      </td>
      
      {/* Volume */}
      <td className="px-3 py-2 text-right">
        <span className="text-sm text-white font-semibold tabular-nums">
          ${formatCompact(token.volume24h)}
        </span>
      </td>
      
      {/* 5M */}
      <td className="px-3 py-2 text-right hidden lg:table-cell">
        <PercentCell value={token.priceChange5m} />
      </td>
      
      {/* 1H */}
      <td className="px-3 py-2 text-right hidden md:table-cell">
        <PercentCell value={token.priceChange1h} />
      </td>
      
      {/* 6H */}
      <td className="px-3 py-2 text-right hidden lg:table-cell">
        <PercentCell value={token.priceChange6h} />
      </td>
      
      {/* 24H */}
      <td className="px-3 py-2 text-right">
        <PercentCell value={token.priceChange24h} bold />
      </td>
      
      {/* Liquidity */}
      <td className="px-3 py-2 text-right hidden md:table-cell">
        <span className="text-sm text-white/80 tabular-nums font-medium">
          ${formatCompact(token.liquidity)}
        </span>
      </td>
      
      {/* Market Cap */}
      <td className="px-3 py-2 text-right hidden lg:table-cell">
        <span className="text-sm text-white font-semibold tabular-nums">
          ${formatCompact(token.marketCap)}
        </span>
      </td>
    </tr>
  );
});

export default function TokenTable({ tokens }: TokenTableProps) {
  const [sortField, setSortField] = useState<SortField>('volume24h');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    const stored = localStorage.getItem(SORT_STORAGE_KEY);
    if (stored) {
      try {
        const { field, direction } = JSON.parse(stored);
        if (field) setSortField(field);
        if (direction) setSortDirection(direction);
      } catch (e) {}
    }
  }, []);

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
      case 'txns24h': return token.txns24h.total;
      default: return (token[field] as number) ?? 0;
    }
  };

  const sortedTokens = useMemo(() => {
    return [...tokens].sort((a, b) => {
      const aVal = getSortValue(a, sortField);
      const bVal = getSortValue(b, sortField);
      return sortDirection === 'desc' ? bVal - aVal : aVal - bVal;
    });
  }, [tokens, sortField, sortDirection]);

  const HeaderCell = ({ 
    field, 
    label, 
    className 
  }: { 
    field?: SortField; 
    label: string; 
    className?: string;
  }) => {
    const sortable = !!field;
    return (
      <th
        className={cn(
          "px-3 py-2 text-xs font-bold text-white/70 uppercase tracking-wide whitespace-nowrap text-right",
          sortable && "cursor-pointer group/header select-none hover:text-white transition-colors",
          className
        )}
        onClick={sortable ? () => handleSort(field) : undefined}
      >
        <div className="flex items-center justify-end gap-1">
          <span className={cn(sortField === field && "text-white")}>{label}</span>
          {sortable && <SortIndicator active={sortField === field} direction={sortDirection} />}
        </div>
      </th>
    );
  };

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr className="border-b border-white/[0.08] bg-white/[0.02]">
            <th className="px-3 py-2 text-xs font-bold text-white/70 uppercase tracking-wide text-center w-10">TOKEN</th>
            <th className="px-2 py-2 text-xs font-bold text-white/70 uppercase tracking-wide text-left min-w-[220px]"></th>
            <HeaderCell label="Price" className="text-right" />
            <th className="px-2 py-2 text-xs font-bold text-white/70 uppercase tracking-wide text-center hidden xl:table-cell w-[86px]"></th>
            <th className="px-3 py-2 text-xs font-bold text-white/70 uppercase tracking-wide text-center hidden sm:table-cell">Age</th>
            <HeaderCell field="txns24h" label="Txns" className="hidden md:table-cell" />
            <HeaderCell field="volume24h" label="Volume" />
            <HeaderCell field="priceChange5m" label="5m" className="hidden lg:table-cell" />
            <HeaderCell field="priceChange1h" label="1h" className="hidden md:table-cell" />
            <HeaderCell field="priceChange6h" label="6h" className="hidden lg:table-cell" />
            <HeaderCell field="priceChange24h" label="24h" />
            <HeaderCell field="liquidity" label="Liquidity" className="hidden md:table-cell" />
            <HeaderCell field="marketCap" label="MCap" className="hidden lg:table-cell" />
          </tr>
        </thead>
        <tbody>
          {sortedTokens.map((token, index) => (
            <TokenRow 
              key={token.pairAddress || token.address} 
              token={token} 
              rank={index + 1}
            />
          ))}
        </tbody>
      </table>
      
      {sortedTokens.length === 0 && (
        <div className="empty-state">
          <svg className="empty-state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <p className="empty-state-title">No tokens found</p>
          <p className="empty-state-description">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
