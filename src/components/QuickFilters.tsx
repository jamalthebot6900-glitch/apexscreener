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

const GraduatedIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
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

const UserIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
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

const SettingsIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
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

// Compact rectangular button - dark blue accent when active (DexScreener style)
function PillButton({ children, active, onClick, icon, dropdown, className }: PillButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-8 flex items-center gap-1.5 px-4 rounded-full text-[13px] font-bold transition-all whitespace-nowrap tracking-tight",
        "border",
        active 
          ? "bg-[#5865F2] text-white border-[#5865F2]" 
          : "bg-[#1e222d] border-[#2a3040] text-white hover:bg-[#252a36] hover:border-[#3a4050]",
        className
      )}
    >
      {icon && <span className={active ? "text-white" : "text-white/80"}>{icon}</span>}
      {children}
      {dropdown && <ChevronDownIcon />}
    </button>
  );
}

// Small icon-only button
function IconButton({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-8 w-8 flex items-center justify-center rounded-full transition-all",
        "border",
        active 
          ? "bg-[#5865F2] text-white border-[#5865F2]" 
          : "bg-[#1e222d] border-[#2a3040] text-white/80 hover:bg-[#252a36] hover:border-[#3a4050] hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

// Time toggle button inside trending group
function TimeButton({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-6 px-2.5 rounded text-[12px] font-bold transition-all",
        active 
          ? "bg-[#5865F2] text-white" 
          : "text-white/60 hover:text-white hover:bg-white/10"
      )}
    >
      {label}
    </button>
  );
}

export default function QuickFilters() {
  const [trendingTime, setTrendingTime] = useState('6h');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-[#0d1117] border-b border-[#1e222d] overflow-x-auto scrollbar-hide">
      {/* Time Range Dropdown */}
      <PillButton icon={<ClockIcon />} dropdown active>
        Last 24 hours
      </PillButton>

      {/* Trending with Time Options */}
      <div className="h-8 flex items-center bg-[#5865F2] rounded-full overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 text-[13px] font-bold text-white border-r border-white/20">
          <FireIcon />
          <span>Trending</span>
        </div>
        <div className="flex items-center gap-0.5 px-2">
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

      <PillButton 
        icon={<GraduatedIcon />}
        active={activeFilter === 'graduated'}
        onClick={() => setActiveFilter(activeFilter === 'graduated' ? null : 'graduated')}
      >
        Recently Graduated
      </PillButton>

      {/* Icon Buttons */}
      <IconButton>
        <UserIcon />
      </IconButton>
      <IconButton>
        <BoltIcon />
      </IconButton>
      <IconButton>
        <FireIcon />
      </IconButton>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right Side - Rank & Filters */}
      <PillButton icon={<ChartIcon />} dropdown>
        Rank by: Trending 6H
      </PillButton>

      <PillButton icon={<FilterIcon />}>
        Filters
      </PillButton>

      <IconButton>
        <SettingsIcon />
      </IconButton>
    </div>
  );
}
