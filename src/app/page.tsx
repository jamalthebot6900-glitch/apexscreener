'use client';

import TokenTable from '@/components/TokenTable';
import StatsBar from '@/components/StatsBar';
import QuickFilters from '@/components/QuickFilters';

// Ad banner component
function AdBanner() {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-[#1e222d] border-b border-white/[0.04]">
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-bold text-white bg-[#2a2a30] px-2 py-0.5 rounded">Ad</span>
        <div className="flex items-center gap-2">
          <img 
            src="https://dd.dexscreener.com/ds-data/ads/metawin.png" 
            alt="MetaWin" 
            className="w-5 h-5 rounded"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          <span className="text-[13px] font-semibold text-white">MetaWin</span>
          <span className="text-[13px] text-[#888]">The Only Crypto Casino with 30% Bonus on Every Deposit!</span>
          <span className="text-[13px] text-[#00d395] font-semibold">Deposit $100, Play $130!</span>
        </div>
      </div>
      <button className="text-[#666] hover:text-white transition-colors p-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Ad Banner */}
      <AdBanner />

      {/* Stats Bar */}
      <StatsBar />

      {/* Quick Filters */}
      <QuickFilters />
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Token Table */}
        <TokenTable />
      </div>
    </div>
  );
}
