'use client';

import { useEffect, useRef, useState } from 'react';

interface StatsBarProps {
  volume24h?: number;
  txns24h?: number;
  marketCap?: number;
}

function AnimatedNumber({ value, formatter }: { value: number; formatter: (v: number) => string }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value && value > 0) {
      setFlash(value > prevValue.current ? 'up' : 'down');
      prevValue.current = value;
      setDisplayValue(value);
      const timer = setTimeout(() => setFlash(null), 600);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  return (
    <span className={`text-[12px] font-semibold text-text-primary tabular-nums font-mono transition-colors ${
      flash === 'up' ? 'text-positive' : flash === 'down' ? 'text-negative' : ''
    }`}>
      {formatter(displayValue)}
    </span>
  );
}

export default function StatsBar({ volume24h = 0, txns24h = 0, marketCap = 0 }: StatsBarProps) {
  const formatVolume = (value: number) => {
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value.toLocaleString()}`;
  };

  const formatTxns = (value: number) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  const formatMcap = (value: number) => {
    if (value >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="flex items-center gap-4 lg:gap-6 px-3 lg:px-4 py-2 border-b border-border bg-surface/50 text-[11px] overflow-x-auto scrollbar-hide">
      {/* Volume */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-text-dimmed">Vol 24h:</span>
        <AnimatedNumber value={volume24h} formatter={formatVolume} />
      </div>

      <div className="w-px h-3.5 bg-border shrink-0" />

      {/* Txns */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-text-dimmed">Txns:</span>
        <AnimatedNumber value={txns24h} formatter={formatTxns} />
      </div>

      <div className="w-px h-3.5 bg-border shrink-0 hidden sm:block" />

      {/* Market Cap */}
      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
        <span className="text-text-dimmed">MCap:</span>
        <AnimatedNumber value={marketCap} formatter={formatMcap} />
      </div>

      {/* Spacer */}
      <div className="flex-1 min-w-0" />

      {/* Live indicator */}
      <div className="hidden md:flex items-center gap-1.5 shrink-0">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-positive" />
        </span>
        <span className="text-text-dimmed">Live</span>
      </div>
    </div>
  );
}
