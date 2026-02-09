'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

// Icons
const ClockIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const TrendingIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);

const ArrowUpIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.941" />
  </svg>
);

const SparkleIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
);

const BoltIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
  </svg>
);

const FireIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.048 8.287 8.287 0 0 0 9 9.6a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

interface PillButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  dropdown?: boolean;
  className?: string;
}

function PillButton({ children, active, onClick, icon, dropdown, className }: PillButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all",
        "border",
        active 
          ? "bg-white/10 border-white/20 text-white shadow-[0_0_15px_-3px_rgba(255,255,255,0.15)]" 
          : "bg-white/[0.03] border-white/[0.08] text-white/60 hover:bg-white/[0.06] hover:border-white/[0.12] hover:text-white/80",
        className
      )}
      style={active ? {
        boxShadow: '0 0 20px -5px rgba(255, 255, 255, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
      } : undefined}
    >
      {icon && <span className={active ? "text-white" : "text-white/50"}>{icon}</span>}
      {children}
      {dropdown && <ChevronDownIcon />}
    </button>
  );
}

function TimeButton({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all",
        active 
          ? "bg-white/15 text-white" 
          : "text-white/40 hover:text-white/70 hover:bg-white/5"
      )}
    >
      {label}
    </button>
  );
}

export default function QuickFilters() {
  const [timeframe, setTimeframe] = useState('24h');
  const [trendingTime, setTrendingTime] = useState('6h');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-black border-b border-white/[0.04] overflow-x-auto scrollbar-hide">
      {/* Time Range Dropdown */}
      <PillButton icon={<ClockIcon />} dropdown active>
        Last 24 hours
      </PillButton>

      {/* Trending with Time Options */}
      <div className="flex items-center bg-white/[0.03] border border-white/[0.08] rounded-full overflow-hidden">
        <button className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white/80 border-r border-white/[0.08]">
          <TrendingIcon />
          Trending
        </button>
        <div className="flex items-center gap-0.5 px-1.5">
          {['5M', '1H', '6H', '24H'].map((t) => (
            <TimeButton 
              key={t} 
              label={t} 
              active={trendingTime === t.toLowerCase()}
              onClick={() => setTrendingTime(t.toLowerCase())}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-white/[0.08] mx-1" />

      {/* Quick Filters */}
      <PillButton 
        icon={<ChartIcon />}
        active={activeFilter === 'top'}
        onClick={() => setActiveFilter(activeFilter === 'top' ? null : 'top')}
      >
        Top
      </PillButton>

      <PillButton 
        icon={<ArrowUpIcon />}
        active={activeFilter === 'gainers'}
        onClick={() => setActiveFilter(activeFilter === 'gainers' ? null : 'gainers')}
      >
        Gainers
      </PillButton>

      <PillButton 
        icon={<SparkleIcon />}
        active={activeFilter === 'new'}
        onClick={() => setActiveFilter(activeFilter === 'new' ? null : 'new')}
      >
        New Pairs
      </PillButton>

      {/* Divider */}
      <div className="w-px h-6 bg-white/[0.08] mx-1" />

      {/* Icon Buttons */}
      <div className="flex items-center gap-1">
        <button className="p-2 rounded-full bg-white/[0.03] border border-white/[0.08] text-white/50 hover:bg-white/[0.06] hover:text-white/80 transition-all">
          <BoltIcon />
        </button>
        <button className="p-2 rounded-full bg-white/[0.03] border border-white/[0.08] text-white/50 hover:bg-white/[0.06] hover:text-white/80 transition-all">
          <FireIcon />
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right Side - Rank & Filters */}
      <PillButton icon={<ChartIcon />} dropdown>
        Rank by: Trending 6H
      </PillButton>

      <PillButton icon={<FilterIcon />}>
        Filters
      </PillButton>
    </div>
  );
}
