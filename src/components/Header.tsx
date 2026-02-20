'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import WalletButton from './WalletButton';

// DEX options
const dexTabs = [
  { id: 'all', name: 'All DEXes', icon: null },
  { id: 'pumpswap', name: 'PumpSwap', icon: 'https://dd.dexscreener.com/ds-data/dexes/pumpswap.png' },
  { id: 'meteora', name: 'Meteora', icon: 'https://dd.dexscreener.com/ds-data/dexes/meteora.png' },
  { id: 'orca', name: 'Orca', icon: 'https://dd.dexscreener.com/ds-data/dexes/orca.png' },
  { id: 'raydium', name: 'Raydium', icon: 'https://dd.dexscreener.com/ds-data/dexes/raydium.png' },
  { id: 'pumpfun', name: 'Pump.fun', icon: 'https://dd.dexscreener.com/ds-data/dexes/pumpfun.png' },
];

// Apex Logo Component
function ApexLogo() {
  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute inset-0 blur-xl bg-gradient-to-r from-violet-500/30 via-fuchsia-500/30 to-cyan-500/30 rounded-full" />
      
      {/* Logo icon */}
      <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-violet-500/25">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {/* Mountain/Apex peak */}
          <path d="M12 2L3 20h18L12 2z" />
          <path d="M12 8l-5 12h10L12 8z" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

export default function Header() {
  const { setSidebarOpen, sidebarOpen } = useApp();
  const [activeDex, setActiveDex] = useState('all');

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-white/[0.06] bg-[#0a0a0c]/80 backdrop-blur-xl">
      <div className="flex h-full items-center">
        {/* Logo section */}
        <div className="flex items-center h-full border-r border-white/[0.06] px-4 gap-3">
          <Link href="/" className="flex items-center gap-3 group">
            <ApexLogo />
            <div className="hidden sm:flex flex-col">
              <span className="text-[15px] font-bold tracking-tight">
                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                  APEX
                </span>
                <span className="text-white/90">SCREENER</span>
              </span>
              <span className="text-[9px] text-white/40 font-medium tracking-widest uppercase -mt-0.5">
                Token Analytics
              </span>
            </div>
          </Link>
          
          {/* Collapse button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-all hidden lg:block"
          >
            <svg className={`w-4 h-4 transition-transform duration-200 ${sidebarOpen ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* DEX Tabs */}
        <div className="flex-1 flex items-center h-full overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1 px-3">
            {dexTabs.map((dex) => (
              <button
                key={dex.id}
                onClick={() => setActiveDex(dex.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all duration-200 ${
                  activeDex === dex.id
                    ? 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-white border border-violet-500/30'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {dex.icon && (
                  <img src={dex.icon} alt={dex.name} className="w-4 h-4 rounded-full" />
                )}
                <span>{dex.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3 px-4 h-full border-l border-white/[0.06]">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wide">Live</span>
          </div>
          
          {/* Wallet connect */}
          <WalletButton />
          
          {/* Mobile menu */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.06] transition-all"
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
