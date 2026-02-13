'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';

// DEX options
const dexTabs = [
  { id: 'all', name: 'All DEXes', icon: null },
  { id: 'pumpswap', name: 'PumpSwap', icon: 'https://dd.dexscreener.com/ds-data/dexes/pumpswap.png' },
  { id: 'meteora', name: 'Meteora', icon: 'https://dd.dexscreener.com/ds-data/dexes/meteora.png' },
  { id: 'orca', name: 'Orca', icon: 'https://dd.dexscreener.com/ds-data/dexes/orca.png' },
  { id: 'raydium', name: 'Raydium', icon: 'https://dd.dexscreener.com/ds-data/dexes/raydium.png' },
  { id: 'pumpfun', name: 'Pump.fun', icon: 'https://dd.dexscreener.com/ds-data/dexes/pumpfun.png' },
  { id: 'launchlab', name: 'LaunchLab', icon: 'https://dd.dexscreener.com/ds-data/dexes/raydium-launchlab.png' },
];

export default function Header() {
  const { setSidebarOpen, sidebarOpen } = useApp();
  const [activeDex, setActiveDex] = useState('all');
  const [showMoreDexes, setShowMoreDexes] = useState(false);

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-white/[0.04] bg-[#0d0d0f]">
      <div className="flex h-full items-center">
        {/* Logo section */}
        <div className="flex items-center h-full border-r border-white/[0.04] px-4">
          <Link href="/" className="flex items-center gap-2.5">
            {/* Logo icon */}
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#00d395] to-[#00a878] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-[15px] font-bold text-white tracking-tight hidden sm:block">
              DEX<span className="text-[#00d395]">SCREENER</span>
            </span>
          </Link>
          
          {/* Collapse button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-3 p-1 text-[#666] hover:text-white transition-colors hidden lg:block"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* DEX Tabs */}
        <div className="flex-1 flex items-center h-full overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1 px-2">
            {dexTabs.map((dex) => (
              <button
                key={dex.id}
                onClick={() => setActiveDex(dex.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-all ${
                  activeDex === dex.id
                    ? 'bg-[#1e222d] text-white'
                    : 'text-[#888] hover:text-white hover:bg-[#16161a]'
                }`}
              >
                {dex.icon && (
                  <img src={dex.icon} alt={dex.name} className="w-4 h-4 rounded-full" />
                )}
                <span>{dex.name}</span>
              </button>
            ))}
            
            {/* More dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMoreDexes(!showMoreDexes)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold text-[#888] hover:text-white hover:bg-[#16161a] transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                <span>More</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3 px-4 h-full border-l border-white/[0.04]">
          {/* Mobile menu */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 text-[#888] hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
