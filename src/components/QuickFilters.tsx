'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

// Icons - small 14px
const ClockIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const FireIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 23c-3.866 0-7-3.134-7-7 0-2.551 1.238-4.78 2.975-6.478A15.91 15.91 0 0 0 10.5 5.5c0-1.807-.595-3.47-1.6-4.81a.5.5 0 0 1 .54-.763c2.476.546 4.56 2.058 5.894 4.073.752-1.034 1.166-2.316 1.166-3.71 0-.165-.006-.329-.017-.492a.5.5 0 0 1 .788-.435C19.83 1.596 22 4.712 22 8.5c0 1.632-.395 3.17-1.093 4.524A6.974 6.974 0 0 1 19 16c0 3.866-3.134 7-7 7z"/>
  </svg>
);

const ChartIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);

const ArrowUpIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
  </svg>
);

const SparkleIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 1l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 1z"/>
  </svg>
);

const UserIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

const BoltIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
);

const TrophyIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-4.5A3.375 3.375 0 0 0 13.125 11h-.25A3.375 3.375 0 0 0 9.5 14.25v4.5m6-10.125V6a2.25 2.25 0 0 0-2.25-2.25h-3A2.25 2.25 0 0 0 8 6v2.125" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

// Button - 32px height, 13px font, 6px radius
function FilterButton({ 
  children, 
  active, 
  onClick, 
  icon, 
  dropdown,
  className 
}: { 
  children?: React.ReactNode; 
  active?: boolean; 
  onClick?: () => void; 
  icon?: React.ReactNode;
  dropdown?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-7 flex items-center gap-1.5 px-2.5 rounded text-[12px] font-semibold transition-all whitespace-nowrap",
        active 
          ? "bg-[#1e3a4c] text-white border border-[#2a5a70]" 
          : "bg-[#18181c] text-[#888] border border-[#2a2a30] hover:bg-[#222228] hover:text-white hover:border-[#3a3a42]",
        className
      )}
    >
      {icon}
      {children}
      {dropdown && <ChevronDownIcon />}
    </button>
  );
}

// Small icon button with dropdown
function IconDropdown({ icon, color }: { icon: React.ReactNode; color?: string }) {
  return (
    <button className="h-7 flex items-center gap-0.5 px-2 rounded bg-[#18181c] border border-[#2a2a30] text-[#888] hover:bg-[#222228] hover:text-white hover:border-[#3a3a42] transition-all">
      <span className={color}>{icon}</span>
      <ChevronDownIcon />
    </button>
  );
}

// Time pill inside trending
function TimePill({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-5 px-1.5 rounded text-[11px] font-bold transition-all",
        active 
          ? "bg-[#2d5a6e] text-white" 
          : "text-[#8a9aa4] hover:text-white"
      )}
    >
      {label}
    </button>
  );
}

export default function QuickFilters() {
  const [trendingTime, setTrendingTime] = useState('6H');

  return (
    <div className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0b0b0d] border-b border-[#1a1a1e] overflow-x-auto scrollbar-hide">
      {/* Last 24 hours - active teal */}
      <FilterButton icon={<ClockIcon />} dropdown active>
        Last 24 hours
      </FilterButton>

      {/* Trending with time options */}
      <div className="h-7 flex items-center bg-[#1e3a4c] border border-[#2a5a70] rounded overflow-hidden">
        <div className="flex items-center gap-1.5 px-2.5 text-[12px] font-semibold text-white">
          <FireIcon />
          <span>Trending</span>
        </div>
        <div className="flex items-center gap-0.5 px-1 border-l border-[#2d5a6e]">
          {['5M', '1H', '6H', '24H'].map((t) => (
            <TimePill 
              key={t} 
              label={t} 
              active={trendingTime === t}
              onClick={() => setTrendingTime(t)}
            />
          ))}
        </div>
      </div>

      {/* Other filters - grey */}
      <FilterButton icon={<ChartIcon />}>
        Top
      </FilterButton>

      <FilterButton icon={<ArrowUpIcon />}>
        Gainers
      </FilterButton>

      <FilterButton icon={<SparkleIcon />}>
        New Pairs
      </FilterButton>

      {/* Icon dropdowns */}
      <IconDropdown icon={<UserIcon />} color="text-[#f0b90b]" />
      <IconDropdown icon={<BoltIcon />} color="text-[#f0b90b]" />
      <IconDropdown icon={<TrophyIcon />} color="text-[#f0b90b]" />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side */}
      <FilterButton icon={<TrophyIcon />} dropdown>
        Rank by: <span className="text-white ml-1">Trending 6H</span>
      </FilterButton>

      <FilterButton icon={<FilterIcon />}>
        Filters
      </FilterButton>

      <button className="h-7 w-7 flex items-center justify-center rounded bg-[#18181c] border border-[#2a2a30] text-[#888] hover:bg-[#222228] hover:text-white hover:border-[#3a3a42] transition-all">
        <SettingsIcon />
      </button>
    </div>
  );
}
