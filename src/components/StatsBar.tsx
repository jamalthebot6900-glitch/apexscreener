'use client';

import { useEffect, useRef, useState } from 'react';

interface StatsBarProps {
  volume24h?: number;
  txns24h?: number;
  marketCap?: number;
}

// Animated number display
function AnimatedNumber({ value, formatter }: { value: number; formatter: (v: number) => string }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value && value > 0) {
      if (value > prevValue.current) {
        setFlash('up');
      } else {
        setFlash('down');
      }
      prevValue.current = value;
      setDisplayValue(value);
      
      const timer = setTimeout(() => setFlash(null), 800);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  return (
    <p className={`text-base font-bold text-text-primary tabular-nums font-mono leading-tight transition-colors duration-300 ${
      flash === 'up' ? 'text-positive' : flash === 'down' ? 'text-negative' : ''
    }`}>
      {formatter(displayValue)}
    </p>
  );
}

export default function StatsBar({ volume24h = 0, txns24h = 0, marketCap = 0 }: StatsBarProps) {
  const formatVolume = (value: number) => {
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(2)}B`;
    }
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`;
    }
    if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  const formatTxns = (value: number) => {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2)}M`;
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  };

  const formatMcap = (value: number) => {
    if (value >= 1_000_000_000_000) {
      return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
    }
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(2)}B`;
    }
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`;
    }
    if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(1)}K`;
    }
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="flex flex-wrap items-center gap-4 lg:gap-8 px-4 lg:px-6 py-3 border-b border-border-subtle bg-surface/30">
      {/* 24H Volume */}
      <StatItem
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        iconColor="text-positive"
        iconBg="bg-positive/10"
        label="24H Volume"
      >
        <AnimatedNumber value={volume24h} formatter={formatVolume} />
      </StatItem>

      {/* Divider */}
      <div className="hidden md:block divider h-8" />

      {/* 24H Txns */}
      <StatItem
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        }
        iconColor="text-brand-blue"
        iconBg="bg-brand-blue/10"
        label="24H Transactions"
      >
        <AnimatedNumber value={txns24h} formatter={formatTxns} />
      </StatItem>

      {/* Divider */}
      <div className="hidden lg:block divider h-8" />

      {/* Total Market Cap */}
      <StatItem
        icon={
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
          </svg>
        }
        iconColor="text-purple-400"
        iconBg="bg-purple-500/10"
        label="Total Market Cap"
        className="hidden lg:flex"
      >
        <AnimatedNumber value={marketCap} formatter={formatMcap} />
      </StatItem>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Real-time indicator - desktop only */}
      <div className="hidden lg:flex items-center gap-2 text-xs text-text-dimmed">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-positive opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-positive" />
        </span>
        <span className="font-medium">Real-time data</span>
      </div>
    </div>
  );
}

function StatItem({ 
  icon, 
  iconColor, 
  iconBg, 
  label, 
  children,
  className = '',
}: { 
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`flex items-center justify-center w-9 h-9 rounded-lg ${iconBg} transition-transform hover:scale-105`}>
        <div className={iconColor}>{icon}</div>
      </div>
      <div>
        <p className="text-[10px] text-text-dimmed font-semibold uppercase tracking-wider">{label}</p>
        {children}
      </div>
    </div>
  );
}
