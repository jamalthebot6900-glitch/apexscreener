'use client';

import { useState } from 'react';

const timeFilters = ['5M', '1H', '6H', '24H'] as const;

export default function QuickFilters() {
  const [timeRange, setTimeRange] = useState<'5M' | '1H' | '6H' | '24H'>('6H');
  const [activeFilter, setActiveFilter] = useState<'trending' | 'top' | 'gainers' | 'new'>('trending');

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0d0d0f] border-b border-white/[0.04] overflow-x-auto scrollbar-hide">
      {/* Time period dropdown */}
      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00d395]/10 text-[#00d395] rounded-lg text-[12px] font-semibold whitespace-nowrap">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Last 24 hours</span>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Trending toggle with time periods */}
      <div className="flex items-center bg-[#16161a] rounded-lg border border-[#2a2a30] overflow-hidden">
        <button
          onClick={() => setActiveFilter('trending')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold whitespace-nowrap transition-colors ${
            activeFilter === 'trending' ? 'bg-[#00d395]/10 text-[#00d395]' : 'text-[#888] hover:text-white'
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          </svg>
          <span>Trending</span>
        </button>
        
        {/* Time period buttons */}
        {timeFilters.map((time) => (
          <button
            key={time}
            onClick={() => setTimeRange(time)}
            className={`px-2.5 py-1.5 text-[11px] font-bold whitespace-nowrap transition-colors ${
              timeRange === time
                ? 'bg-[#2a2a30] text-white'
                : 'text-[#666] hover:text-white'
            }`}
          >
            {time}
          </button>
        ))}
      </div>

      {/* Top */}
      <button
        onClick={() => setActiveFilter('top')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-colors ${
          activeFilter === 'top'
            ? 'bg-[#1e222d] text-white'
            : 'text-[#888] hover:text-white hover:bg-[#16161a]'
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
        <span>Top</span>
      </button>

      {/* Gainers */}
      <button
        onClick={() => setActiveFilter('gainers')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-colors ${
          activeFilter === 'gainers'
            ? 'bg-[#1e222d] text-white'
            : 'text-[#888] hover:text-white hover:bg-[#16161a]'
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <span>Gainers</span>
      </button>

      {/* New Pairs */}
      <button
        onClick={() => setActiveFilter('new')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-colors ${
          activeFilter === 'new'
            ? 'bg-[#1e222d] text-white'
            : 'text-[#888] hover:text-white hover:bg-[#16161a]'
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
        <span>New Pairs</span>
      </button>

      {/* People icons - socials filter */}
      <div className="flex items-center gap-1 ml-2">
        <button className="p-1.5 rounded-lg text-[#888] hover:text-white hover:bg-[#16161a] transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        </button>
        <button className="p-1.5 rounded-lg bg-[#f7931a]/10 text-[#f7931a] transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </button>
        <button className="p-1.5 rounded-lg text-[#888] hover:text-white hover:bg-[#16161a] transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
          </svg>
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Rank by dropdown */}
      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-[#888] hover:text-white hover:bg-[#16161a] whitespace-nowrap transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
        </svg>
        <span>Rank by:</span>
        <span className="text-white">Trending 6H</span>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}
