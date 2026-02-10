'use client';

import Link from 'next/link';
import { Token, SortField, SortDirection } from '@/types';
import { useState, useMemo, useEffect, memo } from 'react';
import { useApp } from '@/context/AppContext';

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
  const years = Math.floor(days / 365);
  
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 30) return `${days}d`;
  if (months < 12) return `${months}mo`;
  return `${years}y`;
}

// Format price with subscript zeros like DexScreener
function formatPrice(price: number): string {
  if (!price || price === 0) return '$0';
  
  if (price >= 1) {
    return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  
  const priceStr = price.toFixed(10);
  const match = priceStr.match(/^0\.(0*)([1-9]\d*)/);
  
  if (match) {
    const zeros = match[1].length;
    const significantDigits = match[2].slice(0, 4);
    
    if (zeros >= 4) {
      return `$0.0${subscript(zeros)}${significantDigits}`;
    }
  }
  
  if (price < 0.01) {
    return '$' + price.toFixed(6);
  }
  return '$' + price.toFixed(4);
}

function subscript(num: number): string {
  const subscripts: Record<string, string> = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
  };
  return String(num).split('').map(d => subscripts[d] || d).join('');
}

// Format compact number
function formatCompact(value: number): string {
  if (value >= 1_000_000_000) return '$' + (value / 1_000_000_000).toFixed(1) + 'B';
  if (value >= 1_000_000) return '$' + (value / 1_000_000).toFixed(2) + 'M';
  if (value >= 1_000) return '$' + (value / 1_000).toFixed(0) + 'K';
  return '$' + value.toFixed(0);
}

// Format number without dollar sign
function formatNum(value: number): string {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(2) + 'M';
  if (value >= 1_000) return (value / 1_000).toFixed(1) + 'K';
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

// Solana chain badge - visible
function SolanaBadge() {
  return (
    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#9945FF] via-[#14F195] to-[#00FFA3] flex items-center justify-center flex-shrink-0">
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="white">
        <path d="M4 17.5L8 13.5H20L16 17.5H4Z" />
        <path d="M4 6.5L8 10.5H20L16 6.5H4Z" />
        <path d="M4 12L8 8H20L16 12H4Z" />
      </svg>
    </div>
  );
}

// Pump.fun badge
function PumpFunBadge() {
  return (
    <div className="w-5 h-5 rounded-full bg-[#00D18C] flex items-center justify-center flex-shrink-0">
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="black">
        <circle cx="12" cy="12" r="4" />
        <ellipse cx="12" cy="12" rx="8" ry="3" stroke="black" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  );
}

// Raydium badge
function RaydiumBadge() {
  return (
    <div className="w-5 h-5 rounded-full bg-[#5AC4BE] flex items-center justify-center flex-shrink-0">
      <span className="text-[9px] font-bold text-black">R</span>
    </div>
  );
}

// Token row exactly like DexScreener
const TokenRow = memo(function TokenRow({ token, rank }: { token: Token; rank: number }) {
  // Determine platform (pump.fun vs raydium) - using a simple heuristic
  const isPumpFun = token.liquidity < 100000 || token.pairCreatedAt > Date.now() - 7 * 24 * 60 * 60 * 1000;
  
  return (
    <tr className="border-b border-[#21262d] hover:bg-[#161b22] transition-colors">
      {/* Rank */}
      <td className="pl-4 pr-2 py-[10px] text-[13px] text-[#8b949e] font-medium">
        #{rank}
      </td>
      
      {/* Badges - Solana + Platform */}
      <td className="px-1 py-[10px]">
        <div className="flex items-center gap-1">
          <SolanaBadge />
          {isPumpFun ? <PumpFunBadge /> : <RaydiumBadge />}
        </div>
      </td>
      
      {/* Token Logo - Larger square */}
      <td className="px-2 py-[10px]">
        {token.logo ? (
          <img src={token.logo} alt="" className="w-8 h-8 rounded-lg bg-white/10 object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-[12px] font-bold text-white">
            {token.symbol.charAt(0)}
          </div>
        )}
      </td>
      
      {/* Token Name - Bold white */}
      <td className="px-2 py-[10px] min-w-[220px]">
        <Link href={`/token/${token.address}`} className="flex items-center gap-2 group">
          <span className="text-[14px] font-bold text-white group-hover:text-[#58a6ff] transition-colors">
            {token.symbol}
          </span>
          <span className="text-[13px] text-[#8b949e]">/SOL</span>
          <span className="text-[13px] text-[#6e7681]">{token.name}</span>
        </Link>
      </td>
      
      {/* Price */}
      <td className="px-3 py-[10px] text-right">
        <span className="text-[13px] text-[#c9d1d9] font-medium tabular-nums">
          {formatPrice(token.priceUsd)}
        </span>
      </td>
      
      {/* Age */}
      <td className="px-3 py-[10px] text-center">
        <span className="text-[13px] text-[#8b949e] tabular-nums">
          {formatAge(token.pairCreatedAt)}
        </span>
      </td>
      
      {/* Txns */}
      <td className="px-3 py-[10px] text-right">
        <span className="text-[13px] text-[#c9d1d9] tabular-nums">
          {formatNum(token.txns24h.total)}
        </span>
      </td>
      
      {/* Volume */}
      <td className="px-3 py-[10px] text-right">
        <span className="text-[13px] text-[#c9d1d9] tabular-nums">
          {formatCompact(token.volume24h)}
        </span>
      </td>
      
      {/* Makers - using txns as placeholder */}
      <td className="px-3 py-[10px] text-right hidden xl:table-cell">
        <span className="text-[13px] text-[#8b949e] tabular-nums">
          {formatNum(Math.floor(token.txns24h.total / 10))}
        </span>
      </td>
      
      {/* 5M */}
      <td className="px-3 py-[10px] text-right hidden lg:table-cell">
        <span className={`text-[13px] font-medium tabular-nums ${token.priceChange5m >= 0 ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>
          {token.priceChange5m?.toFixed(2)}%
        </span>
      </td>
      
      {/* 1H */}
      <td className="px-3 py-[10px] text-right hidden md:table-cell">
        <span className={`text-[13px] font-medium tabular-nums ${token.priceChange1h >= 0 ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>
          {token.priceChange1h?.toFixed(2)}%
        </span>
      </td>
      
      {/* 6H */}
      <td className="px-3 py-[10px] text-right hidden lg:table-cell">
        <span className={`text-[13px] font-medium tabular-nums ${token.priceChange6h >= 0 ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>
          {token.priceChange6h?.toFixed(2)}%
        </span>
      </td>
      
      {/* 24H */}
      <td className="px-3 py-[10px] text-right">
        <span className={`text-[13px] font-medium tabular-nums ${token.priceChange24h >= 0 ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>
          {token.priceChange24h?.toFixed(2)}%
        </span>
      </td>
      
      {/* Liquidity */}
      <td className="px-3 py-[10px] text-right hidden md:table-cell">
        <span className="text-[13px] text-[#3fb950] tabular-nums">
          {formatCompact(token.liquidity)}
        </span>
      </td>
      
      {/* Market Cap */}
      <td className="px-3 pr-4 py-[10px] text-right">
        <span className="text-[13px] text-[#c9d1d9] tabular-nums">
          {formatCompact(token.marketCap)}
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

  const sortedTokens = useMemo(() => {
    return [...tokens].sort((a, b) => {
      let aVal: number, bVal: number;
      switch (sortField) {
        case 'txns24h': aVal = a.txns24h.total; bVal = b.txns24h.total; break;
        default: aVal = (a[sortField] as number) ?? 0; bVal = (b[sortField] as number) ?? 0;
      }
      return sortDirection === 'desc' ? bVal - aVal : aVal - bVal;
    });
  }, [tokens, sortField, sortDirection]);

  const HeaderCell = ({ field, label, className = '' }: { field?: SortField; label: string; className?: string }) => {
    const active = field && sortField === field;
    return (
      <th
        className={`px-3 py-2.5 text-[11px] font-medium text-[#8b949e] uppercase tracking-wider whitespace-nowrap ${field ? 'cursor-pointer hover:text-white/70' : ''} ${className}`}
        onClick={field ? () => handleSort(field) : undefined}
      >
        <div className={`flex items-center gap-1 ${className.includes('text-left') ? '' : 'justify-end'}`}>
          <span className={active ? 'text-white' : ''}>{label}</span>
          {field && (
            <svg className={`w-3 h-3 transition-transform ${active ? 'text-white' : 'text-[#8b949e]/50'} ${active && sortDirection === 'asc' ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </th>
    );
  };

  return (
    <div className="overflow-x-auto bg-[#0d0e12]">
      <table className="w-full min-w-[1000px]">
        <thead>
          <tr className="border-b border-[#21262d]">
            <th className="pl-4 pr-2 py-2.5 text-[11px] font-medium text-[#8b949e] uppercase tracking-wider text-left w-12"></th>
            <th className="px-1 py-2.5 w-10"></th>
            <th className="px-1 py-2.5 w-10"></th>
            <th className="px-2 py-2.5 text-[11px] font-medium text-[#8b949e] uppercase tracking-wider text-left min-w-[200px]">TOKEN</th>
            <HeaderCell label="Price" />
            <HeaderCell label="Age" className="text-center" />
            <HeaderCell field="txns24h" label="Txns" />
            <HeaderCell field="volume24h" label="Volume" />
            <HeaderCell label="Makers" className="hidden xl:table-cell" />
            <HeaderCell field="priceChange5m" label="5m" className="hidden lg:table-cell" />
            <HeaderCell field="priceChange1h" label="1h" className="hidden md:table-cell" />
            <HeaderCell field="priceChange6h" label="6h" className="hidden lg:table-cell" />
            <HeaderCell field="priceChange24h" label="24h" />
            <HeaderCell field="liquidity" label="Liquidity" className="hidden md:table-cell" />
            <HeaderCell field="marketCap" label="MCap" />
          </tr>
        </thead>
        <tbody>
          {sortedTokens.map((token, index) => (
            <TokenRow key={token.pairAddress || token.address} token={token} rank={index + 1} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
