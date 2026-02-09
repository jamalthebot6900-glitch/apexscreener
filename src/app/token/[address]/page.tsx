'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PairData } from '@/types';
import { fetchTokenDetails } from '@/lib/api';
import { formatPrice, formatNumber, formatPercent, formatAddress, timeAgo, cn } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import { SolanaBadge } from '@/components/PlatformIcons';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Timeframe options for the chart
const TIMEFRAMES = [
  { label: '1m', value: '1' },
  { label: '5m', value: '5' },
  { label: '15m', value: '15' },
  { label: '1h', value: '60' },
  { label: '4h', value: '240' },
  { label: '1D', value: 'D' },
] as const;

// Buy/Sell Ratio Bar
function BuySellRatio({ buys, sells }: { buys: number; sells: number }) {
  const total = buys + sells;
  if (total === 0) return null;
  
  const buyPercent = (buys / total) * 100;
  const sellPercent = (sells / total) * 100;

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-positive" />
          <span className="text-positive font-semibold">{buys.toLocaleString()} Buys</span>
          <span className="text-text-dimmed">({buyPercent.toFixed(0)}%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-text-dimmed">({sellPercent.toFixed(0)}%)</span>
          <span className="text-negative font-semibold">{sells.toLocaleString()} Sells</span>
          <div className="w-3 h-3 rounded-full bg-negative" />
        </div>
      </div>
      <div className="h-4 rounded-full overflow-hidden flex bg-surface-light shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-positive to-emerald-400 transition-all duration-700 ease-out"
          style={{ width: `${buyPercent}%` }}
        />
        <div 
          className="h-full bg-gradient-to-r from-red-400 to-negative transition-all duration-700 ease-out"
          style={{ width: `${sellPercent}%` }}
        />
      </div>
    </div>
  );
}

// Copy Button with feedback
function CopyButton({ text, label, prominent = false }: { text: string; label: string; prominent?: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (prominent) {
    return (
      <button
        onClick={handleCopy}
        className={cn(
          'flex items-center gap-2.5 px-5 py-3 rounded-xl font-semibold text-sm transition-all',
          'min-h-[48px] touch-manipulation shadow-lg',
          copied 
            ? 'bg-positive text-black scale-95' 
            : 'bg-gradient-to-r from-accent/20 to-violet-500/20 border border-accent/40 text-accent hover:from-accent/30 hover:to-violet-500/30 hover:scale-[1.02]'
        )}
      >
        {copied ? (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {label}
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'p-2 rounded-lg transition-all touch-manipulation min-w-[40px] min-h-[40px] flex items-center justify-center',
        copied 
          ? 'bg-positive/20 text-positive' 
          : 'text-text-dimmed hover:text-text-primary hover:bg-surface-light'
      )}
      title={copied ? 'Copied!' : `Copy ${label}`}
    >
      {copied ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
        </svg>
      )}
    </button>
  );
}

// Trade on Jupiter - Prominent CTA
function JupiterTradeButton({ tokenAddress }: { tokenAddress: string }) {
  return (
    <a
      href={`https://jup.ag/swap/SOL-${tokenAddress}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-base transition-all',
        'min-h-[56px] touch-manipulation',
        'bg-gradient-to-r from-[#c7f284] to-[#9de046] text-black',
        'hover:from-[#d4f79a] hover:to-[#aee85a] hover:scale-[1.02] hover:shadow-xl hover:shadow-[#c7f284]/20',
        'active:scale-[0.98]'
      )}
    >
      <span className="text-2xl">🪐</span>
      <span>Trade on Jupiter</span>
      <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </a>
  );
}

// External Link Button
function ExternalLinkButton({ href, icon, label, color = 'default' }: { href: string; icon: React.ReactNode; label: string; color?: 'default' | 'birdeye' }) {
  const colorClasses = {
    default: 'bg-surface-light border-border hover:border-border-light hover:bg-surface-hover',
    birdeye: 'bg-[#1a2332] border-[#2a3a52] hover:bg-[#243042] text-[#ff6b35]',
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all border',
        'min-h-[48px] touch-manipulation',
        colorClasses[color]
      )}
    >
      {icon}
      {label}
      <svg className="w-3 h-3 ml-auto opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}

// DexScreener Chart Embed Component with Timeframes
function DexScreenerChart({ tokenAddress }: { tokenAddress: string }) {
  const [timeframe, setTimeframe] = useState('15');
  
  return (
    <div className="card overflow-hidden">
      {/* Timeframe selector */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface-light/50 border-b border-border">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Price Chart</span>
        </div>
        
        <div className="flex items-center gap-1 bg-surface rounded-lg p-1">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-semibold transition-all',
                timeframe === tf.value
                  ? 'bg-accent text-white shadow-md'
                  : 'text-text-muted hover:text-text-primary hover:bg-surface-light'
              )}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Chart embed - LARGER */}
      <iframe
        key={timeframe}
        src={`https://dexscreener.com/solana/${tokenAddress}?embed=1&theme=dark&trades=0&info=0&interval=${timeframe}`}
        className="w-full border-none"
        style={{ height: '600px' }}
        title="DexScreener Chart"
        allow="clipboard-write"
        loading="lazy"
      />
    </div>
  );
}

// Token Header with larger icon
function TokenHeader({ token }: { token: PairData }) {
  const priceChange24h = token.priceChange?.h24 || 0;
  const isPositive = priceChange24h >= 0;

  // Generate gradient for fallback icon
  const symbol = token.baseToken.symbol;
  const hash = symbol.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  const hue1 = Math.abs(hash) % 360;
  const hue2 = (hue1 + 40) % 360;

  return (
    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
      <div className="flex items-center gap-5">
        {/* Large Token Icon */}
        <div className="relative">
          {token.info?.imageUrl ? (
            <img
              src={token.info.imageUrl}
              alt={token.baseToken.symbol}
              className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-surface-light ring-4 ring-border/30 shadow-2xl"
            />
          ) : (
            <div 
              className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-2xl"
              style={{ 
                background: `linear-gradient(135deg, hsl(${hue1}, 60%, 25%), hsl(${hue2}, 70%, 15%))`,
                color: `hsl(${hue1}, 80%, 70%)`,
              }}
            >
              {token.baseToken.symbol.slice(0, 2)}
            </div>
          )}
          {/* Solana badge */}
          <div className="absolute -bottom-2 -right-2 bg-background rounded-xl p-1 shadow-lg">
            <SolanaBadge size={28} />
          </div>
        </div>
        
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-2xl lg:text-3xl font-bold text-text-primary">
              {token.baseToken.symbol}
            </h1>
            <span className="badge bg-surface-light text-text-muted border border-border text-xs px-2 py-1">
              {token.dexId}
            </span>
          </div>
          <p className="text-text-secondary text-base mb-3 truncate">{token.baseToken.name}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <code className="text-xs text-text-muted bg-surface-light px-3 py-1.5 rounded-lg font-mono truncate max-w-[200px] sm:max-w-none">
              {formatAddress(token.baseToken.address, 8)}
            </code>
            <CopyButton text={token.baseToken.address} label="address" />
          </div>
        </div>
      </div>

      {/* Price & Change */}
      <div className="text-left lg:text-right bg-surface-light/50 rounded-xl p-4 lg:p-5 border border-border/50">
        <p className="text-3xl lg:text-4xl font-bold font-mono text-text-primary tabular-nums">
          {formatPrice(parseFloat(token.priceUsd))}
        </p>
        <div className={cn(
          'inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg text-lg font-bold tabular-nums font-mono',
          isPositive ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'
        )}>
          {isPositive ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 7L7 17M7 17H17M7 17V7" />
            </svg>
          )}
          {formatPercent(priceChange24h)}
        </div>
        <p className="text-text-dimmed text-xs mt-2">24h Change</p>
      </div>
    </div>
  );
}

// Quick stat card
function QuickStat({ label, value, trend }: { label: string; value: number; trend?: boolean }) {
  const isPositive = value >= 0;
  const showTrend = trend !== undefined;
  
  return (
    <div className="card p-4 hover:border-border-light transition-all">
      <p className="text-text-dimmed text-[10px] uppercase tracking-wider font-semibold mb-2">{label}</p>
      <p className={cn(
        'text-sm font-bold tabular-nums font-mono',
        showTrend && (isPositive ? 'text-positive' : 'text-negative'),
        !showTrend && 'text-text-primary'
      )}>
        {showTrend ? formatPercent(value) : typeof value === 'number' ? `$${formatNumber(value)}` : value}
      </p>
    </div>
  );
}

// Page skeleton loader
function PageSkeleton() {
  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto animate-pulse">
      {/* Back button skeleton */}
      <div className="h-10 w-20 skeleton rounded-lg" />
      
      {/* Header skeleton */}
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 lg:w-24 lg:h-24 skeleton rounded-2xl" />
        <div className="space-y-3">
          <div className="h-8 w-32 skeleton rounded" />
          <div className="h-5 w-48 skeleton rounded" />
          <div className="h-6 w-56 skeleton rounded-lg" />
        </div>
      </div>
      
      {/* Action buttons skeleton */}
      <div className="flex gap-3 flex-wrap">
        <div className="h-14 w-48 skeleton rounded-xl" />
        <div className="h-14 w-48 skeleton rounded-xl" />
        <div className="h-12 w-32 skeleton rounded-lg" />
      </div>
      
      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card p-4">
            <div className="h-3 w-16 skeleton rounded mb-3" />
            <div className="h-5 w-12 skeleton rounded" />
          </div>
        ))}
      </div>
      
      {/* Chart skeleton */}
      <div className="card">
        <div className="flex justify-between p-4 border-b border-border">
          <div className="h-5 w-24 skeleton rounded" />
          <div className="flex gap-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 w-12 skeleton rounded-md" />
            ))}
          </div>
        </div>
        <div className="h-[600px] skeleton" />
      </div>
    </div>
  );
}

function TokenPageContent() {
  const params = useParams();
  const address = params.address as string;
  
  const [token, setToken] = useState<PairData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const data = await fetchTokenDetails(address);
      if (data) {
        setToken(data);
      } else {
        setError('Token not found');
      }
    } catch (err) {
      setError('Failed to load token data');
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return <PageSkeleton />;
  }

  if (error || !token) {
    return (
      <div className="p-4 lg:p-6">
        <div className="card">
          <div className="empty-state py-16">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <p className="empty-state-title text-lg">Token Not Found</p>
            <p className="empty-state-description">{error || 'Unable to load token data'}</p>
            <Link href="/" className="btn-secondary mt-6 inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const buys24h = token.txns?.h24?.buys || 0;
  const sells24h = token.txns?.h24?.sells || 0;

  return (
    <div className="p-4 lg:p-6 space-y-5 lg:space-y-6 max-w-[1600px] mx-auto">
      {/* Back link */}
      <Link href="/" className="btn-ghost inline-flex items-center gap-2 min-h-[40px] -ml-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Tokens
      </Link>

      {/* Token Header */}
      <TokenHeader token={token} />

      {/* Primary Actions - Trade on Jupiter is PROMINENT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <JupiterTradeButton tokenAddress={token.baseToken.address} />
        
        <CopyButton text={token.baseToken.address} label="Copy CA" prominent />
        
        <ExternalLinkButton
          href={`https://birdeye.so/token/${token.baseToken.address}?chain=solana`}
          icon={<span className="text-lg">🦅</span>}
          label="View on Birdeye"
          color="birdeye"
        />
        
        <ExternalLinkButton
          href={token.url}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          }
          label="DexScreener"
        />
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <QuickStat label="5m Change" value={token.priceChange?.m5 || 0} trend />
        <QuickStat label="1h Change" value={token.priceChange?.h1 || 0} trend />
        <QuickStat label="6h Change" value={token.priceChange?.h6 || 0} trend />
        <QuickStat label="24h Change" value={token.priceChange?.h24 || 0} trend />
        <QuickStat label="Liquidity" value={token.liquidity?.usd || 0} />
        <QuickStat label="FDV" value={token.fdv || 0} />
      </div>

      {/* Buy/Sell Ratio Card */}
      <div className="card p-5">
        <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
          24h Trading Activity
        </h3>
        <BuySellRatio buys={buys24h} sells={sells24h} />
      </div>

      {/* DexScreener Chart - LARGER with timeframes */}
      <DexScreenerChart tokenAddress={token.baseToken.address} />

      {/* Detailed Stats Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Volume & Transactions */}
        <div className="card p-5">
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Volume & Transactions
          </h3>
          <div className="space-y-3">
            <StatRow label="24h Volume" value={`$${formatNumber(token.volume?.h24 || 0)}`} highlight />
            <StatRow label="6h Volume" value={`$${formatNumber(token.volume?.h6 || 0)}`} />
            <StatRow label="1h Volume" value={`$${formatNumber(token.volume?.h1 || 0)}`} />
            <hr className="border-border-subtle my-4" />
            <StatRow label="24h Buys" value={buys24h.toLocaleString()} valueColor="text-positive" />
            <StatRow label="24h Sells" value={sells24h.toLocaleString()} valueColor="text-negative" />
            <StatRow label="Total Txns (24h)" value={(buys24h + sells24h).toLocaleString()} highlight />
          </div>
        </div>

        {/* Pair Info */}
        <div className="card p-5">
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pair Information
          </h3>
          <div className="space-y-3">
            <StatRow label="Pair" value={`${token.baseToken.symbol}/${token.quoteToken.symbol}`} />
            <StatRow label="DEX" value={token.dexId} capitalize />
            <StatRow label="Created" value={timeAgo(token.pairCreatedAt)} />
            <StatRow label="Market Cap" value={token.marketCap ? `$${formatNumber(token.marketCap)}` : 'N/A'} highlight />
            <hr className="border-border-subtle my-4" />
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-muted">Pair Address</span>
              <div className="flex items-center gap-1">
                <code className="text-xs text-text-secondary bg-surface-light px-2 py-1 rounded font-mono">
                  {formatAddress(token.pairAddress, 6)}
                </code>
                <CopyButton text={token.pairAddress} label="pair address" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      {token.info?.socials && token.info.socials.length > 0 && (
        <div className="card p-5">
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Links & Socials
          </h3>
          <div className="flex flex-wrap gap-2">
            {token.info.websites?.map((site, i) => (
              <a
                key={i}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2 min-h-[44px]"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                {site.label || 'Website'}
              </a>
            ))}
            {token.info.socials.map((social, i) => (
              <a
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2 capitalize min-h-[44px]"
              >
                {social.type === 'twitter' && (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                )}
                {social.type === 'telegram' && (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                )}
                {social.type !== 'twitter' && social.type !== 'telegram' && (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.193-9.193a4.5 4.5 0 016.364 6.364l-4.5 4.5a4.5 4.5 0 01-7.244-1.242" />
                  </svg>
                )}
                {social.type}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatRow({ 
  label, 
  value, 
  valueColor = 'text-text-primary',
  capitalize = false,
  highlight = false
}: { 
  label: string; 
  value: string; 
  valueColor?: string;
  capitalize?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className={cn(
      "flex justify-between text-sm py-1",
      highlight && "bg-surface-light/30 -mx-2 px-2 rounded"
    )}>
      <span className="text-text-muted">{label}</span>
      <span className={cn(
        'font-medium tabular-nums font-mono',
        valueColor,
        capitalize && 'capitalize',
        highlight && 'font-semibold'
      )}>
        {value}
      </span>
    </div>
  );
}

export default function TokenPage() {
  return (
    <ErrorBoundary>
      <TokenPageContent />
    </ErrorBoundary>
  );
}
