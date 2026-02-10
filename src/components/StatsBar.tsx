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
    <span className={`transition-colors ${
      flash === 'up' ? 'text-[#00e676]' : flash === 'down' ? 'text-[#ff5252]' : ''
    }`}>
      {formatter(displayValue)}
    </span>
  );
}

function StatCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div 
      className="flex-1 flex flex-col items-center justify-center gap-1 py-3 bg-[#161921] border border-[#282d38] rounded-xl relative"
      style={{
        boxShadow: `
          0 0 15px -5px rgba(16, 185, 129, 0.08),
          0 4px 12px -4px rgba(0, 0, 0, 0.5)
        `
      }}
    >
      <span className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">{label}</span>
      <span className="text-xl font-bold text-white tabular-nums">
        {children}
      </span>
    </div>
  );
}

export default function StatsBar({ volume24h = 0, txns24h = 0 }: StatsBarProps) {
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

  return (
    <div className="flex gap-3 px-3 py-2 bg-[#0d0e12]">
      {/* 24hr Volume */}
      <StatCard label="24hr Volume">
        <AnimatedNumber value={volume24h} formatter={formatVolume} />
      </StatCard>

      {/* 24hr Txns */}
      <StatCard label="24hr Txns">
        <AnimatedNumber value={txns24h} formatter={formatTxns} />
      </StatCard>

      {/* $APEX Market Cap */}
      <StatCard label="$APEX Market Cap">
        <span className="text-white/40">TBA</span>
      </StatCard>
    </div>
  );
}
