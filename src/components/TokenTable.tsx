'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Token } from '@/types';
import { useApp } from '@/context/AppContext';
import AlertModal from './AlertModal';

type SortField = 'volume24h' | 'priceUsd' | 'priceChange5m' | 'priceChange1h' | 'priceChange6h' | 'priceChange24h' | 'txns' | 'makers' | 'pairCreatedAt' | 'liquidity' | 'marketCap';
type SortDir = 'asc' | 'desc';

interface Filters {
  minLiquidity: number;
  minVolume: number;
  maxAgeHours: number;
  minChange: number;
  hideRugged: boolean;
}

const defaultFilters: Filters = {
  minLiquidity: 0,
  minVolume: 0,
  maxAgeHours: 0,
  minChange: -100,
  hideRugged: false,
};

// Filter presets for quick access
const filterPresets: { name: string; icon: string; filters: Filters; sort?: { field: SortField; dir: SortDir } }[] = [
  {
    name: 'All',
    icon: '📊',
    filters: defaultFilters,
    sort: { field: 'volume24h', dir: 'desc' },
  },
  {
    name: 'New',
    icon: '✨',
    filters: { ...defaultFilters, maxAgeHours: 6, minLiquidity: 5000 },
    sort: { field: 'pairCreatedAt', dir: 'desc' },
  },
  {
    name: 'Hot',
    icon: '🔥',
    filters: { ...defaultFilters, minVolume: 100000, minLiquidity: 10000, hideRugged: true },
    sort: { field: 'volume24h', dir: 'desc' },
  },
  {
    name: 'Pumping',
    icon: '🚀',
    filters: { ...defaultFilters, minChange: 20, minLiquidity: 5000, hideRugged: true },
    sort: { field: 'priceChange6h', dir: 'desc' },
  },
  {
    name: 'Safe',
    icon: '🛡️',
    filters: { ...defaultFilters, minLiquidity: 50000, minVolume: 50000, hideRugged: true },
    sort: { field: 'volume24h', dir: 'desc' },
  },
  {
    name: 'Watchlist',
    icon: '⭐',
    filters: defaultFilters,
    sort: { field: 'volume24h', dir: 'desc' },
  },
];

// Solana logo
function SolanaLogo() {
  return (
    <img 
      src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
      alt="Solana"
      className="w-4 h-4 rounded-full"
    />
  );
}

// DEX logo component
function DexLogo({ dex }: { dex?: string }) {
  const logos: Record<string, string> = {
    pumpswap: 'https://dd.dexscreener.com/ds-data/dexes/pumpswap.png',
    raydium: 'https://dd.dexscreener.com/ds-data/dexes/raydium.png',
    meteora: 'https://dd.dexscreener.com/ds-data/dexes/meteora.png',
    orca: 'https://dd.dexscreener.com/ds-data/dexes/orca.png',
  };
  
  return (
    <img 
      src={logos[dex || 'raydium'] || logos.raydium}
      alt={dex || 'dex'}
      className="w-4 h-4 rounded-full"
    />
  );
}

// Trending badge
function TrendingBadge({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] font-bold text-[#f7931a] bg-[#f7931a]/10">
      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z"/>
      </svg>
      {value}
    </span>
  );
}

// Graduated badge (pump.fun -> raydium/pumpswap)
function GraduatedBadge() {
  return (
    <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] font-bold text-[#00d395] bg-[#00d395]/10" title="Graduated from Pump.fun">
      🎓
    </span>
  );
}

// Copy CA button
function CopyCAButton({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  
  return (
    <button
      onClick={handleCopy}
      className={`p-1 rounded transition-all ${
        copied 
          ? 'text-[#00d395] bg-[#00d395]/10' 
          : 'text-[#555] hover:text-[#888] hover:bg-[#1a1a1f]'
      }`}
      title={copied ? 'Copied!' : 'Copy contract address'}
    >
      {copied ? (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}

// Rug warning badge
function RugWarningBadge({ reason }: { reason: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px] font-bold text-[#ff6b6b] bg-[#ff6b6b]/10" title={reason}>
      ⚠️
    </span>
  );
}

// Quick trade button (links to Jupiter)
function QuickTradeButton({ address }: { address: string }) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://jup.ag/swap/SOL-${address}`, '_blank');
  };
  
  return (
    <button
      onClick={handleClick}
      className="p-1 rounded text-[#00d395] hover:text-[#00e5a5] hover:bg-[#00d395]/10 transition-all"
      title="Buy on Jupiter"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </button>
  );
}

// Watchlist star button
function WatchlistStar({ token, isInWatchlist, onToggle }: { 
  token: Token; 
  isInWatchlist: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`p-1 rounded transition-colors ${
        isInWatchlist 
          ? 'text-[#f7931a] hover:text-[#ffaa33]' 
          : 'text-[#444] hover:text-[#888]'
      }`}
      title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <svg className="w-4 h-4" fill={isInWatchlist ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    </button>
  );
}

// Alert bell button
function AlertButton({ token, hasAlerts, onClick }: { 
  token: Token; 
  hasAlerts: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`p-1 rounded transition-colors ${
        hasAlerts 
          ? 'text-[#f7931a] hover:text-[#ffaa33]' 
          : 'text-[#444] hover:text-[#888]'
      }`}
      title="Set price alert"
    >
      <svg className="w-3.5 h-3.5" fill={hasAlerts ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    </button>
  );
}

// Share dropdown button
function ShareButton({ token }: { token: Token }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const tokenUrl = `https://dexscreener.com/solana/${token.pairAddress || token.address}`;
  const tweetText = `Check out $${token.symbol} on Solana!\n\nPrice: $${token.priceUsd < 0.01 ? token.priceUsd.toExponential(2) : token.priceUsd.toFixed(4)}\n24h: ${(token.priceChange24h || 0) >= 0 ? '+' : ''}${(token.priceChange24h || 0).toFixed(2)}%\n\n${tokenUrl}`;

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(tokenUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowDropdown(false);
    }, 1500);
  };

  const handleTweet = (e: React.MouseEvent) => {
    e.stopPropagation();
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowDropdown(!showDropdown);
        }}
        className="p-1 rounded text-[#444] hover:text-[#888] transition-colors"
        title="Share"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      </button>

      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(false);
            }}
          />
          <div className="absolute left-0 top-full mt-1 bg-[#1a1a1f] border border-[#333] rounded-lg shadow-xl z-50 overflow-hidden min-w-[140px]">
            <button
              onClick={handleTweet}
              className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-[#ccc] hover:bg-[#252528] transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>Tweet</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-[#ccc] hover:bg-[#252528] transition-colors"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 text-[#00d395]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[#00d395]">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Calculate rug risk signals
function getRugSignals(token: Token): { isRisky: boolean; reason: string } {
  const signals: string[] = [];
  
  // Very low liquidity
  if (token.liquidity < 1000) signals.push('Low liq');
  
  // Massive price drop
  if ((token.priceChange24h || 0) < -80) signals.push('-80%+ dump');
  
  // Liquidity to market cap ratio (honeypot signal)
  if (token.marketCap > 0 && token.liquidity / token.marketCap < 0.01) {
    signals.push('Low liq/mcap');
  }
  
  // Very new with high volume (possible pump and dump)
  const ageHours = token.pairCreatedAt ? (Date.now() - token.pairCreatedAt) / 3600000 : 999;
  if (ageHours < 1 && token.volume24h > 500000 && (token.priceChange1h || 0) < -30) {
    signals.push('Rapid dump');
  }
  
  return {
    isRisky: signals.length > 0,
    reason: signals.join(', ')
  };
}

// Sort indicator
function SortIndicator({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return (
    <svg className="w-3 h-3 text-[#444] opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
      <path d="M7 7l3-3 3 3M7 13l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
  
  return (
    <svg className="w-3 h-3 text-[#9455ff]" fill="currentColor" viewBox="0 0 20 20">
      {dir === 'desc' ? (
        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
      ) : (
        <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"/>
      )}
    </svg>
  );
}

// Sortable header
function SortableHeader({ 
  children, 
  field, 
  currentField, 
  currentDir, 
  onSort,
  align = 'right'
}: { 
  children: React.ReactNode;
  field: SortField;
  currentField: SortField;
  currentDir: SortDir;
  onSort: (field: SortField) => void;
  align?: 'left' | 'right' | 'center';
}) {
  const alignClass = align === 'left' ? 'justify-start' : align === 'center' ? 'justify-center' : 'justify-end';
  
  return (
    <th 
      className="px-2 py-2.5 text-[11px] font-bold text-[#666] uppercase tracking-wide cursor-pointer hover:text-[#999] transition-colors group"
      onClick={() => onSort(field)}
    >
      <span className={`inline-flex items-center gap-1 ${alignClass}`}>
        {children}
        <SortIndicator active={currentField === field} dir={currentDir} />
      </span>
    </th>
  );
}

// Filter input component
function FilterInput({ 
  label, 
  value, 
  onChange, 
  prefix = '',
  suffix = '',
  min = 0,
  max,
  step = 1
}: { 
  label: string; 
  value: number; 
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] text-[#666] uppercase tracking-wide">{label}</label>
      <div className="flex items-center gap-1 bg-[#1a1a1f] rounded-lg px-2 py-1.5 border border-[#2a2a30] focus-within:border-[#9455ff]">
        {prefix && <span className="text-[11px] text-[#666]">{prefix}</span>}
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-16 bg-transparent text-[12px] text-white outline-none"
          min={min}
          max={max}
          step={step}
          placeholder="Any"
        />
        {suffix && <span className="text-[11px] text-[#666]">{suffix}</span>}
      </div>
    </div>
  );
}

// Format price with appropriate decimals
function formatPrice(price: number): string {
  if (price === 0) return '$0';
  if (price < 0.000001) return `$${price.toExponential(2)}`;
  if (price < 0.0001) return `$${price.toFixed(8)}`;
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  if (price < 1000) return `$${price.toFixed(2)}`;
  return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

// Format volume/market cap
function formatVolume(vol: number): string {
  if (vol >= 1_000_000_000) return `$${(vol / 1_000_000_000).toFixed(1)}B`;
  if (vol >= 1_000_000) return `$${(vol / 1_000_000).toFixed(1)}M`;
  if (vol >= 1_000) return `$${(vol / 1_000).toFixed(1)}K`;
  return `$${vol.toFixed(0)}`;
}

// Format age
function formatAge(timestamp: number): string {
  if (!timestamp) return '-';
  const now = Date.now();
  const diff = now - timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 30) return `${days}d`;
  return `${Math.floor(days / 30)}mo`;
}

// Format number with commas
function formatNumber(num: number): string {
  return num.toLocaleString();
}

// Loading skeleton row
function SkeletonRow() {
  return (
    <tr className="bg-[#0d0d0f] border-b border-white/[0.04] animate-pulse">
      <td className="pl-4 pr-2 py-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-4 bg-[#1a1a1f] rounded" />
          <div className="w-4 h-4 bg-[#1a1a1f] rounded-full" />
          <div className="w-4 h-4 bg-[#1a1a1f] rounded-full" />
          <div className="w-6 h-6 bg-[#1a1a1f] rounded" />
          <div className="w-24 h-4 bg-[#1a1a1f] rounded" />
        </div>
      </td>
      <td className="px-2 py-2"><div className="w-16 h-4 bg-[#1a1a1f] rounded ml-auto" /></td>
      <td className="px-2 py-2"><div className="w-8 h-4 bg-[#1a1a1f] rounded mx-auto" /></td>
      <td className="px-2 py-2"><div className="w-12 h-4 bg-[#1a1a1f] rounded ml-auto" /></td>
      <td className="px-2 py-2"><div className="w-14 h-4 bg-[#1a1a1f] rounded ml-auto" /></td>
      <td className="px-2 py-2"><div className="w-10 h-4 bg-[#1a1a1f] rounded ml-auto" /></td>
      <td className="px-2 py-2"><div className="w-12 h-4 bg-[#1a1a1f] rounded ml-auto" /></td>
      <td className="px-2 py-2"><div className="w-12 h-4 bg-[#1a1a1f] rounded ml-auto" /></td>
      <td className="px-2 py-2"><div className="w-12 h-4 bg-[#1a1a1f] rounded ml-auto" /></td>
      <td className="px-2 py-2"><div className="w-12 h-4 bg-[#1a1a1f] rounded ml-auto" /></td>
      <td className="px-2 py-2 pr-4"><div className="w-12 h-4 bg-[#1a1a1f] rounded ml-auto" /></td>
    </tr>
  );
}

export default function TokenTable() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshCountdown, setRefreshCountdown] = useState(30);
  const [sortField, setSortField] = useState<SortField>('volume24h');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [activePreset, setActivePreset] = useState<string>('All');
  
  // Watchlist
  const { watchlist, isInWatchlist, toggleWatchlist, watchlistCount, setCurrentView, getAlertsForToken, addAlert, removeAlert, notificationsEnabled, enableNotifications, checkAlerts } = useApp();
  
  // Alert modal state
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertModalToken, setAlertModalToken] = useState<Token | null>(null);
  
  const openAlertModal = useCallback((token: Token) => {
    setAlertModalToken(token);
    setAlertModalOpen(true);
  }, []);

  // Apply a filter preset
  const applyPreset = useCallback((preset: typeof filterPresets[0]) => {
    setFilters(preset.filters);
    if (preset.sort) {
      setSortField(preset.sort.field);
      setSortDir(preset.sort.dir);
    }
    setActivePreset(preset.name);
    setShowFilters(false);
  }, []);

  const fetchTokens = useCallback(async () => {
    try {
      const res = await fetch('https://api.dexscreener.com/latest/dex/tokens/solana', {
        cache: 'no-store',
      });
      
      if (!res.ok) throw new Error('API request failed');
      
      const data = await res.json();
      const pairs = data.pairs || [];
      
      const solanaTokens = pairs
        .filter((p: any) => p.chainId === 'solana')
        .slice(0, 200)
        .map((pair: any): Token => {
          const txns24h = pair.txns?.h24 || { buys: 0, sells: 0 };
          return {
            address: pair.baseToken.address,
            name: pair.baseToken.name,
            symbol: pair.baseToken.symbol,
            logo: pair.info?.imageUrl,
            priceUsd: parseFloat(pair.priceUsd) || 0,
            priceChange24h: pair.priceChange?.h24 || 0,
            priceChange6h: pair.priceChange?.h6 || 0,
            priceChange1h: pair.priceChange?.h1 || 0,
            priceChange5m: pair.priceChange?.m5 || 0,
            volume24h: pair.volume?.h24 || 0,
            liquidity: pair.liquidity?.usd || 0,
            fdv: pair.fdv || 0,
            marketCap: pair.marketCap || pair.fdv || 0,
            pairAddress: pair.pairAddress,
            pairCreatedAt: pair.pairCreatedAt || 0,
            txns24h: {
              buys: txns24h.buys || 0,
              sells: txns24h.sells || 0,
              total: (txns24h.buys || 0) + (txns24h.sells || 0),
            },
            makers: (pair.txns?.h24?.buys || 0) + (pair.txns?.h24?.sells || 0),
            boosts: pair.boosts?.active,
            dexId: pair.dexId,
            chainId: pair.chainId,
          };
        });
      
      setTokens(solanaTokens);
      setLastUpdated(new Date());
      setError(null);
      
      // Check price alerts
      const priceMap = new Map<string, number>();
      solanaTokens.forEach((token: Token) => {
        priceMap.set(token.address, token.priceUsd);
      });
      checkAlerts(priceMap);
    } catch (err) {
      console.error('Failed to fetch tokens:', err);
      setError('Failed to load tokens. Retrying...');
    } finally {
      setLoading(false);
    }
  }, [checkAlerts]);

  // Filtered and sorted tokens
  const filteredTokens = useMemo(() => {
    let result = [...tokens];
    
    // Watchlist filter - only show watchlisted tokens
    if (activePreset === 'Watchlist') {
      const watchlistAddresses = new Set(watchlist.map(w => w.address));
      result = result.filter(t => watchlistAddresses.has(t.address));
    }
    
    // Apply filters
    if (filters.minLiquidity > 0) {
      result = result.filter(t => t.liquidity >= filters.minLiquidity);
    }
    if (filters.minVolume > 0) {
      result = result.filter(t => t.volume24h >= filters.minVolume);
    }
    if (filters.maxAgeHours > 0) {
      const maxAge = filters.maxAgeHours * 3600000;
      result = result.filter(t => t.pairCreatedAt && (Date.now() - t.pairCreatedAt) <= maxAge);
    }
    if (filters.minChange > -100) {
      result = result.filter(t => (t.priceChange6h || 0) >= filters.minChange);
    }
    if (filters.hideRugged) {
      result = result.filter(t => t.liquidity > 1000 && (t.priceChange24h || 0) > -90);
    }
    
    // Sort
    result.sort((a, b) => {
      let aVal: number, bVal: number;
      
      switch (sortField) {
        case 'volume24h':
          aVal = a.volume24h; bVal = b.volume24h; break;
        case 'priceUsd':
          aVal = a.priceUsd; bVal = b.priceUsd; break;
        case 'priceChange5m':
          aVal = a.priceChange5m || 0; bVal = b.priceChange5m || 0; break;
        case 'priceChange1h':
          aVal = a.priceChange1h || 0; bVal = b.priceChange1h || 0; break;
        case 'priceChange6h':
          aVal = a.priceChange6h || 0; bVal = b.priceChange6h || 0; break;
        case 'priceChange24h':
          aVal = a.priceChange24h || 0; bVal = b.priceChange24h || 0; break;
        case 'txns':
          aVal = a.txns24h?.total || 0; bVal = b.txns24h?.total || 0; break;
        case 'makers':
          aVal = a.makers || 0; bVal = b.makers || 0; break;
        case 'pairCreatedAt':
          aVal = a.pairCreatedAt || 0; bVal = b.pairCreatedAt || 0; break;
        case 'liquidity':
          aVal = a.liquidity || 0; bVal = b.liquidity || 0; break;
        case 'marketCap':
          aVal = a.marketCap || 0; bVal = b.marketCap || 0; break;
        default:
          aVal = a.volume24h; bVal = b.volume24h;
      }
      
      return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
    });
    
    return result.slice(0, 50);
  }, [tokens, filters, sortField, sortDir, activePreset, watchlist]);

  // Handle sort
  const handleSort = useCallback((field: SortField) => {
    if (field === sortField) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }, [sortField]);

  // Reset filters
  const resetFilters = () => setFilters(defaultFilters);

  // Check if any filter is active
  const hasActiveFilters = filters.minLiquidity > 0 || filters.minVolume > 0 || filters.maxAgeHours > 0 || filters.minChange > -100 || filters.hideRugged;

  // Initial fetch
  useEffect(() => {
    fetchTokens();
  }, [fetchTokens]);

  // Auto-refresh every 30 seconds with countdown
  useEffect(() => {
    setRefreshCountdown(30);
    
    const countdownInterval = setInterval(() => {
      setRefreshCountdown(prev => {
        if (prev <= 1) {
          fetchTokens();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(countdownInterval);
  }, [fetchTokens]);

  // Keyboard shortcuts for quick preset switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      
      // Number keys 1-6 for preset switching
      const num = parseInt(e.key);
      if (num >= 1 && num <= 6 && filterPresets[num - 1]) {
        applyPreset(filterPresets[num - 1]);
      }
      
      // R to refresh
      if (e.key === 'r' || e.key === 'R') {
        fetchTokens();
      }
      
      // P for portfolio
      if (e.key === 'p' || e.key === 'P') {
        setCurrentView('portfolio');
      }
      
      // A for alerts
      if (e.key === 'a' || e.key === 'A') {
        setCurrentView('alerts');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [applyPreset, fetchTokens, setCurrentView]);

  return (
    <div className="overflow-x-auto bg-[#0d0d0f]">
      {/* Preset buttons */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0c] border-b border-white/[0.04] overflow-x-auto">
        {filterPresets.map((preset, index) => (
          <button
            key={preset.name}
            onClick={() => applyPreset(preset)}
            title={`${preset.name} (Press ${index + 1})`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-all ${
              activePreset === preset.name
                ? 'bg-[#9455ff] text-white shadow-lg shadow-[#9455ff]/25'
                : 'bg-[#1a1a1f] text-[#888] hover:text-white hover:bg-[#252528]'
            }`}
          >
            <span>{preset.icon}</span>
            <span>{preset.name}</span>
            {preset.name === 'Watchlist' && watchlistCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.5 text-[10px] bg-[#f7931a]/20 text-[#f7931a] rounded-full">
                {watchlistCount}
              </span>
            )}
          </button>
        ))}
        {/* Keyboard hint */}
        <span className="ml-auto text-[10px] text-[#444] hidden sm:block">
          Press <kbd className="px-1 py-0.5 bg-[#1a1a1f] rounded border border-[#2a2a30]">?</kbd> for shortcuts
        </span>
      </div>

      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-1.5 text-[10px] text-[#555] border-b border-white/[0.04]">
        <div className="flex items-center gap-3">
          <span>Live data • Click headers to sort</span>
          
          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
              showFilters || hasActiveFilters 
                ? 'bg-[#9455ff]/20 text-[#9455ff]' 
                : 'bg-[#1a1a1f] text-[#888] hover:text-white'
            }`}
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {hasActiveFilters && <span className="w-1.5 h-1.5 bg-[#9455ff] rounded-full" />}
          </button>
        </div>
        
        {lastUpdated && (
          <span className="flex items-center gap-2">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#00d395] rounded-full animate-pulse" />
              <span className="text-[#888]">{filteredTokens.length} tokens</span>
            </span>
            <span className="text-[#555]">•</span>
            <button 
              onClick={() => {
                fetchTokens();
                setRefreshCountdown(30);
              }}
              className="flex items-center gap-1 text-[#666] hover:text-[#00d395] transition-colors"
              title="Click to refresh now (or press R)"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="font-mono text-[11px]">{refreshCountdown}s</span>
            </button>
          </span>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="flex flex-wrap items-end gap-4 px-4 py-3 bg-[#12121a] border-b border-white/[0.04]">
          <FilterInput
            label="Min Liquidity"
            value={filters.minLiquidity}
            onChange={(v) => setFilters(f => ({ ...f, minLiquidity: v }))}
            prefix="$"
            step={1000}
          />
          <FilterInput
            label="Min Volume 24H"
            value={filters.minVolume}
            onChange={(v) => setFilters(f => ({ ...f, minVolume: v }))}
            prefix="$"
            step={1000}
          />
          <FilterInput
            label="Max Age"
            value={filters.maxAgeHours}
            onChange={(v) => setFilters(f => ({ ...f, maxAgeHours: v }))}
            suffix="hrs"
            step={1}
          />
          <FilterInput
            label="Min 6H Change"
            value={filters.minChange}
            onChange={(v) => setFilters(f => ({ ...f, minChange: v }))}
            suffix="%"
            min={-100}
            step={5}
          />
          
          {/* Hide rugged toggle */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-[#666] uppercase tracking-wide">Safety</label>
            <button
              onClick={() => setFilters(f => ({ ...f, hideRugged: !f.hideRugged }))}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors ${
                filters.hideRugged
                  ? 'bg-[#00d395]/20 text-[#00d395]'
                  : 'bg-[#1a1a1f] text-[#888] hover:text-white border border-[#2a2a30]'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Hide Rugs
            </button>
          </div>
          
          {/* Reset button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[#ff6b6b] bg-[#ff6b6b]/10 hover:bg-[#ff6b6b]/20 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reset
            </button>
          )}
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="px-4 py-2 text-[12px] text-[#ff6b6b] bg-[#ff6b6b]/10 border-b border-[#ff6b6b]/20">
          {error}
        </div>
      )}

      <table className="w-full">
        {/* Header */}
        <thead>
          <tr className="bg-[#0d0d0f] border-b border-white/[0.04]">
            <th className="pl-4 pr-2 py-2.5 text-[11px] font-bold text-[#666] uppercase tracking-wide text-left">
              TOKEN
            </th>
            <SortableHeader field="priceUsd" currentField={sortField} currentDir={sortDir} onSort={handleSort}>
              PRICE
            </SortableHeader>
            <SortableHeader field="pairCreatedAt" currentField={sortField} currentDir={sortDir} onSort={handleSort} align="center">
              AGE
            </SortableHeader>
            <SortableHeader field="txns" currentField={sortField} currentDir={sortDir} onSort={handleSort}>
              TXNS
            </SortableHeader>
            <SortableHeader field="volume24h" currentField={sortField} currentDir={sortDir} onSort={handleSort}>
              VOLUME
            </SortableHeader>
            <SortableHeader field="liquidity" currentField={sortField} currentDir={sortDir} onSort={handleSort}>
              LIQ
            </SortableHeader>
            <SortableHeader field="priceChange5m" currentField={sortField} currentDir={sortDir} onSort={handleSort}>
              5M
            </SortableHeader>
            <SortableHeader field="priceChange1h" currentField={sortField} currentDir={sortDir} onSort={handleSort}>
              1H
            </SortableHeader>
            <SortableHeader field="priceChange6h" currentField={sortField} currentDir={sortDir} onSort={handleSort}>
              6H
            </SortableHeader>
            <SortableHeader field="priceChange24h" currentField={sortField} currentDir={sortDir} onSort={handleSort}>
              24H
            </SortableHeader>
            <SortableHeader field="marketCap" currentField={sortField} currentDir={sortDir} onSort={handleSort}>
              MCAP
            </SortableHeader>
          </tr>
        </thead>
        
        {/* Body */}
        <tbody>
          {loading ? (
            Array.from({ length: 15 }).map((_, i) => <SkeletonRow key={i} />)
          ) : filteredTokens.length === 0 ? (
            <tr>
              <td colSpan={11} className="text-center py-8 text-[#666]">
                {hasActiveFilters ? 'No tokens match your filters' : 'No tokens found'}
              </td>
            </tr>
          ) : (
            filteredTokens.map((token, index) => (
              <tr 
                key={token.pairAddress || token.address} 
                className="bg-[#0d0d0f] border-b border-white/[0.04] hover:bg-[#12121a] transition-colors cursor-pointer"
                onClick={() => token.pairAddress && (window.location.href = `/token/${token.pairAddress}`)}
              >
                {/* Token info */}
                <td className="pl-4 pr-2 py-2">
                  <div className="flex items-center gap-1.5">
                    <WatchlistStar 
                      token={token}
                      isInWatchlist={isInWatchlist(token.address)}
                      onToggle={() => toggleWatchlist({ 
                        address: token.address, 
                        symbol: token.symbol, 
                        name: token.name 
                      })}
                    />
                    <CopyCAButton address={token.address} />
                    <AlertButton 
                      token={token}
                      hasAlerts={getAlertsForToken(token.address).filter(a => !a.triggered).length > 0}
                      onClick={() => openAlertModal(token)}
                    />
                    <QuickTradeButton address={token.address} />
                    <ShareButton token={token} />
                    <span className="text-[12px] text-[#555] font-medium w-5">#{index + 1}</span>
                    <SolanaLogo />
                    <DexLogo dex={token.dexId} />
                    <img 
                      src={token.logo || 'https://dd.dexscreener.com/ds-data/tokens/default.png'}
                      alt={token.symbol}
                      className="w-6 h-6 rounded-sm object-cover"
                      onError={(e) => { e.currentTarget.src = 'https://dd.dexscreener.com/ds-data/tokens/default.png' }}
                    />
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-bold text-white">{token.symbol}</span>
                      <span className="text-[12px] text-[#555]">/SOL</span>
                      <span className="text-[12px] text-[#555] truncate max-w-[100px]">{token.name}</span>
                      {token.boosts && token.boosts > 0 && <TrendingBadge value={token.boosts} />}
                      {(token.dexId === 'raydium' || token.dexId === 'pumpswap') && 
                        token.pairCreatedAt && (Date.now() - token.pairCreatedAt) < 86400000 * 7 && 
                        <GraduatedBadge />}
                      {(() => {
                        const { isRisky, reason } = getRugSignals(token);
                        return isRisky ? <RugWarningBadge reason={reason} /> : null;
                      })()}
                    </div>
                  </div>
                </td>
                
                {/* Price */}
                <td className="px-2 py-2 text-right">
                  <span className="text-[13px] font-semibold text-white">{formatPrice(token.priceUsd)}</span>
                </td>
                
                {/* Age */}
                <td className="px-2 py-2 text-center">
                  <span className="text-[13px] text-[#888]">{formatAge(token.pairCreatedAt)}</span>
                </td>
                
                {/* Txns */}
                <td className="px-2 py-2 text-right">
                  <span className="text-[13px] text-white">{formatNumber(token.txns24h?.total || 0)}</span>
                </td>
                
                {/* Volume */}
                <td className="px-2 py-2 text-right">
                  <span className="text-[13px] font-semibold text-white">{formatVolume(token.volume24h)}</span>
                </td>
                
                {/* Liquidity */}
                <td className="px-2 py-2 text-right">
                  <span className="text-[13px] text-[#888]">{formatVolume(token.liquidity)}</span>
                </td>
                
                {/* 5M */}
                <td className="px-2 py-2 text-right">
                  <span className={`text-[13px] font-semibold ${(token.priceChange5m || 0) >= 0 ? 'text-[#00d395]' : 'text-[#ff6b6b]'}`}>
                    {(token.priceChange5m || 0) >= 0 ? '+' : ''}{(token.priceChange5m || 0).toFixed(2)}%
                  </span>
                </td>
                
                {/* 1H */}
                <td className="px-2 py-2 text-right">
                  <span className={`text-[13px] font-semibold ${(token.priceChange1h || 0) >= 0 ? 'text-[#00d395]' : 'text-[#ff6b6b]'}`}>
                    {(token.priceChange1h || 0) >= 0 ? '+' : ''}{(token.priceChange1h || 0).toFixed(2)}%
                  </span>
                </td>
                
                {/* 6H */}
                <td className="px-2 py-2 text-right">
                  <span className={`text-[13px] font-semibold ${(token.priceChange6h || 0) >= 0 ? 'text-[#00d395]' : 'text-[#ff6b6b]'}`}>
                    {(token.priceChange6h || 0) >= 0 ? '+' : ''}{(token.priceChange6h || 0).toFixed(2)}%
                  </span>
                </td>
                
                {/* 24H */}
                <td className="px-2 py-2 text-right">
                  <span className={`text-[13px] font-semibold ${(token.priceChange24h || 0) >= 0 ? 'text-[#00d395]' : 'text-[#ff6b6b]'}`}>
                    {(token.priceChange24h || 0) >= 0 ? '+' : ''}{(token.priceChange24h || 0).toFixed(2)}%
                  </span>
                </td>
                
                {/* Market Cap */}
                <td className="px-2 py-2 text-right pr-4">
                  <span className="text-[13px] text-[#888]">{formatVolume(token.marketCap)}</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      
      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        token={alertModalToken ? {
          address: alertModalToken.address,
          symbol: alertModalToken.symbol,
          name: alertModalToken.name,
          priceUsd: alertModalToken.priceUsd,
        } : null}
        existingAlerts={alertModalToken ? getAlertsForToken(alertModalToken.address).filter(a => !a.triggered) : []}
        onAddAlert={addAlert}
        onRemoveAlert={removeAlert}
        notificationsEnabled={notificationsEnabled}
        onEnableNotifications={enableNotifications}
      />
    </div>
  );
}
