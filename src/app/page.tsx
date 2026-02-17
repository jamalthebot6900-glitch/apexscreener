'use client';

import TokenTable from '@/components/TokenTable';
import StatsBar from '@/components/StatsBar';
import QuickFilters from '@/components/QuickFilters';
import Portfolio from '@/components/Portfolio';
import AlertsView from '@/components/AlertsView';
import { useApp } from '@/context/AppContext';

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
  const { currentView } = useApp();
  
  // Portfolio view
  if (currentView === 'portfolio') {
    return (
      <div className="flex flex-col min-h-full">
        {/* Stats Bar */}
        <StatsBar />
        
        {/* Portfolio Header */}
        <div className="px-4 py-3 border-b border-white/[0.04]">
          <h1 className="text-white text-[18px] font-bold flex items-center gap-2">
            <svg className="w-5 h-5 text-[#9455ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
            </svg>
            Portfolio
          </h1>
          <p className="text-[#888] text-[12px] mt-1">Track your Solana holdings</p>
        </div>
        
        {/* Portfolio Content */}
        <div className="flex-1 p-4">
          <Portfolio />
        </div>
      </div>
    );
  }

  // Alerts view
  if (currentView === 'alerts') {
    return (
      <div className="flex flex-col min-h-full">
        {/* Stats Bar */}
        <StatsBar />
        
        {/* Alerts Header */}
        <div className="px-4 py-3 border-b border-white/[0.04]">
          <h1 className="text-white text-[18px] font-bold flex items-center gap-2">
            <svg className="w-5 h-5 text-[#f7931a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            Price Alerts
          </h1>
          <p className="text-[#888] text-[12px] mt-1">Get notified when prices hit your targets</p>
        </div>
        
        {/* Alerts Content */}
        <div className="flex-1 p-4">
          <AlertsView />
        </div>
      </div>
    );
  }

  // Default view (token screener)
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
