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
      flash === 'up' ? 'text-positive' : flash === 'down' ? 'text-negative' : ''
    }`}>
      {formatter(displayValue)}
    </span>
  );
}

function StatCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div 
      className="flex-1 flex flex-col items-center justify-center gap-2 py-5 bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/[0.12] rounded-2xl relative overflow-hidden"
      style={{
        boxShadow: `
          0 0 40px -10px rgba(255, 255, 255, 0.1),
          0 10px 30px -10px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.08),
          inset 0 -1px 0 rgba(0, 0, 0, 0.15)
        `
      }}
    >
      {/* Subtle top highlight for 3D effect */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      
      <span className="text-xs font-medium text-white/50 uppercase tracking-widest">{label}</span>
      <span className="text-2xl font-semibold text-white tabular-nums tracking-tight">
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
    <div className="flex gap-4 px-4 py-4 bg-surface">
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
        <span className="text-white/50">TBA</span>
      </StatCard>
    </div>
  );
}
