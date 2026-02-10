'use client';

import { useEffect, useRef, useState } from 'react';

interface StatsBarProps {
  volume24h?: number;
  txns24h?: number;
}

function AnimatedNumber({ value, formatter }: { value: number; formatter: (v: number) => string }) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value && value > 0) {
      prevValue.current = value;
      setDisplayValue(value);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  return <span>{formatter(displayValue)}</span>;
}

export default function StatsBar({ volume24h = 0, txns24h = 0 }: StatsBarProps) {
  const formatVolume = (value: number) => {
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value.toLocaleString()}`;
  };

  const formatTxns = (value: number) => {
    return value.toLocaleString();
  };

  return (
    <div className="flex gap-3 px-4 py-2 bg-[#0d0d0f]">
      {/* 24H Volume */}
      <div className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#16161a] border border-[#2a2a2e] rounded-md">
        <span className="text-[12px] text-[#6b6b6b] uppercase tracking-wide">24H Volume:</span>
        <span className="text-[14px] font-semibold text-white">
          <AnimatedNumber value={volume24h} formatter={formatVolume} />
        </span>
      </div>

      {/* 24H Txns */}
      <div className="flex-1 flex items-center justify-center gap-2 py-2 bg-[#16161a] border border-[#2a2a2e] rounded-md">
        <span className="text-[12px] text-[#6b6b6b] uppercase tracking-wide">24H Txns:</span>
        <span className="text-[14px] font-semibold text-white">
          <AnimatedNumber value={txns24h} formatter={formatTxns} />
        </span>
      </div>
    </div>
  );
}
