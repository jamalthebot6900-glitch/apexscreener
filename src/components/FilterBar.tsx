'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type TimeFilter = '5M' | '1H' | '6H' | '24H';
type ViewFilter = 'trending' | 'top' | 'gainers' | 'new';

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = (searchParams.get('view') || 'trending') as ViewFilter;
  
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('6H');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showRankDropdown, setShowRankDropdown] = useState(false);

  const handleViewChange = (view: ViewFilter) => {
    router.push(`/?view=${view}`);
  };

  const timeOptions: TimeFilter[] = ['5M', '1H', '6H', '24H'];

  return (
    <div className="flex items-center gap-2 px-6 py-3 border-b border-border bg-background overflow-x-auto scrollbar-hide">
      {/* Last 24 hours dropdown */}
      <div className="relative">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#2a2e36] border border-border-light text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all"
          onClick={() => setShowTimeDropdown(!showTimeDropdown)}
        >
          <ClockIcon />
          <span>Last 24 hours</span>
          <ChevronDownIcon />
        </button>
        {showTimeDropdown && (
          <div className="absolute top-full left-0 mt-1 py-1 bg-surface rounded-lg border border-border shadow-xl z-10 min-w-[140px]">
            {['1 hour', '6 hours', '24 hours', '7 days', '30 days'].map((option) => (
              <button
                key={option}
                className="w-full px-4 py-2 text-sm text-left text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                onClick={() => setShowTimeDropdown(false)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Trending with time toggles */}
      <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#2a2e36] border border-border-light">
        <button
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-all ${
            currentView === 'trending' 
              ? 'bg-white text-black' 
              : 'text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => handleViewChange('trending')}
        >
          <span className="text-base">🔥</span>
          <span>Trending</span>
        </button>
        
        {currentView === 'trending' && (
          <div className="flex items-center gap-0.5 ml-1 pl-2 border-l border-border">
            {timeOptions.map((time) => (
              <button
                key={time}
                className={`px-2 py-1 rounded-full text-xs font-semibold transition-all ${
                  timeFilter === time
                    ? 'bg-white text-black'
                    : 'text-text-muted hover:text-text-primary'
                }`}
                onClick={() => setTimeFilter(time)}
              >
                {time}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Top */}
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
          currentView === 'top'
            ? 'bg-white text-black border-white'
            : 'bg-[#2a2e36] border-border-light text-text-secondary hover:text-text-primary hover:bg-surface-hover'
        }`}
        onClick={() => handleViewChange('top')}
      >
        <ChartIcon />
        <span>Top</span>
      </button>

      {/* Gainers */}
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
          currentView === 'gainers'
            ? 'bg-white text-black border-white'
            : 'bg-[#2a2e36] border-border-light text-text-secondary hover:text-text-primary hover:bg-surface-hover'
        }`}
        onClick={() => handleViewChange('gainers')}
      >
        <ArrowUpIcon />
        <span>Gainers</span>
      </button>

      {/* New Pairs */}
      <button
        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
          currentView === 'new'
            ? 'bg-white text-black border-white'
            : 'bg-[#2a2e36] border-border-light text-text-secondary hover:text-text-primary hover:bg-surface-hover'
        }`}
        onClick={() => handleViewChange('new')}
      >
        <SparkleIcon />
        <span>New Pairs</span>
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-border mx-2" />

      {/* Rank by dropdown */}
      <div className="relative">
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#2a2e36] border border-border-light text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all"
          onClick={() => setShowRankDropdown(!showRankDropdown)}
        >
          <span>Rank by: Trending {timeFilter}</span>
          <ChevronDownIcon />
        </button>
        {showRankDropdown && (
          <div className="absolute top-full left-0 mt-1 py-1 bg-surface rounded-lg border border-border shadow-xl z-10 min-w-[180px]">
            {['Trending 5M', 'Trending 1H', 'Trending 6H', 'Trending 24H', 'Volume', 'Liquidity', 'Market Cap'].map((option) => (
              <button
                key={option}
                className="w-full px-4 py-2 text-sm text-left text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                onClick={() => setShowRankDropdown(false)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#2a2e36] border border-border-light text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all ml-auto">
        <FilterIcon />
        <span>Filters</span>
      </button>
    </div>
  );
}

// Icons
function ClockIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  );
}
