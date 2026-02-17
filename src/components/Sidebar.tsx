'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useApp, ViewType } from '@/context/AppContext';
import { cn } from '@/lib/utils';

// Network logos
function SolanaLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 128 128" fill="none">
      <defs>
        <linearGradient id="solana-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9945FF" />
          <stop offset="50%" stopColor="#14F195" />
          <stop offset="100%" stopColor="#00FFA3" />
        </linearGradient>
      </defs>
      <path d="M25.1 96.6c0.9-0.9 2.2-1.5 3.5-1.5h92.4c2.2 0 3.3 2.7 1.8 4.2l-18.9 18.9c-0.9 0.9-2.2 1.5-3.5 1.5H8c-2.2 0-3.3-2.7-1.8-4.2L25.1 96.6z" fill="url(#solana-gradient)"/>
      <path d="M25.1 8.3c1-0.9 2.2-1.5 3.5-1.5h92.4c2.2 0 3.3 2.7 1.8 4.2l-18.9 18.9c-0.9 0.9-2.2 1.5-3.5 1.5H8c-2.2 0-3.3-2.7-1.8-4.2L25.1 8.3z" fill="url(#solana-gradient)"/>
      <path d="M102.9 52.2c-0.9-0.9-2.2-1.5-3.5-1.5H7c-2.2 0-3.3 2.7-1.8 4.2l18.9 18.9c0.9 0.9 2.2 1.5 3.5 1.5h92.4c2.2 0 3.3-2.7 1.8-4.2L102.9 52.2z" fill="url(#solana-gradient)"/>
    </svg>
  );
}

function BaseLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" fill="#0052FF"/>
      <path d="M16 7C11 7 7 11 7 16C7 21 11 25 16 25C19.3 25 22.2 23.3 23.8 20.7L16 16V7Z" fill="white"/>
    </svg>
  );
}

function BSCLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" fill="#F3BA2F"/>
      <path d="M16 8l-3 3 3 3 3-3-3-3zm-6 6l-3 3 3 3 3-3-3-3zm12 0l-3 3 3 3 3-3-3-3zm-6 6l-3 3 3 3 3-3-3-3z" fill="white"/>
    </svg>
  );
}

function EthereumLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
      <path d="M16 4L8 16l8 5 8-5L16 4z" fill="#627EEA"/>
      <path d="M16 4v17l8-5L16 4z" fill="#627EEA" opacity="0.6"/>
      <path d="M8 18l8 10 8-10-8 5-8-5z" fill="#627EEA"/>
      <path d="M16 28v-10l8-5-8 15z" fill="#627EEA" opacity="0.6"/>
    </svg>
  );
}

function PolygonLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
      <path d="M21.5 12l-4-2.3c-.6-.4-1.4-.4-2 0l-4 2.3c-.6.4-1 1-1 1.7v4.6c0 .7.4 1.4 1 1.7l4 2.3c.6.4 1.4.4 2 0l4-2.3c.6-.4 1-1 1-1.7v-4.6c0-.7-.4-1.3-1-1.7z" fill="#8247E5"/>
    </svg>
  );
}

// Icons
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);

const GridIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);

const TrendingIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);

const WalletIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
  </svg>
);

const AdIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
  </svg>
);

const networks = [
  { id: 'solana', name: 'Solana', logo: SolanaLogo, active: true },
  { id: 'base', name: 'Base', logo: BaseLogo, active: false },
  { id: 'bsc', name: 'BSC', logo: BSCLogo, active: false },
  { id: 'ethereum', name: 'Ethereum', logo: EthereumLogo, active: false },
  { id: 'polygon', name: 'Polygon', logo: PolygonLogo, active: false },
];

export default function Sidebar() {
  const { currentView, setCurrentView, sidebarOpen, setSidebarOpen, watchlistCount } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoreNetworks, setShowMoreNetworks] = useState(false);

  const handleNavClick = (id: ViewType) => {
    setCurrentView(id);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-14 left-0 z-40 h-[calc(100vh-56px)] w-[180px] shrink-0',
          'border-r border-white/[0.04] bg-[#0d0d0f] overflow-y-auto scrollbar-hide',
          'transition-transform duration-200 ease-out',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="py-3 flex flex-col h-full">
          {/* Search */}
          <div className="px-3 mb-3">
            <div className="relative">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#16161a] border border-[#2a2a30] rounded-lg pl-9 pr-8 py-2 text-[13px] text-white placeholder-[#666] focus:outline-none focus:border-[#3a3a40]"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]">
                <SearchIcon />
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#555] bg-[#1e1e22] px-1.5 py-0.5 rounded border border-[#2a2a30]">
                /
              </div>
            </div>
          </div>

          {/* Get the App */}
          <div className="px-3 mb-3">
            <button className="w-full flex items-center justify-center gap-2 bg-[#1e222d] hover:bg-[#252930] border border-[#2a2a30] rounded-lg py-2.5 text-[13px] font-semibold text-white transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span>Get the App!</span>
            </button>
          </div>

          {/* Main Navigation */}
          <div className="px-2 space-y-0.5">
            <button
              onClick={() => handleNavClick('watchlist')}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all',
                currentView === 'watchlist'
                  ? 'bg-[#1e222d] text-white'
                  : 'text-[#888] hover:text-white hover:bg-[#16161a]'
              )}
            >
              <StarIcon />
              <span>Watchlist</span>
              {watchlistCount > 0 && (
                <span className="ml-auto text-[11px] text-[#666]">{watchlistCount}</span>
              )}
            </button>

            <button
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold text-[#888] hover:text-white hover:bg-[#16161a] transition-all"
            >
              <BellIcon />
              <span>Alerts</span>
            </button>

            <button
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold text-[#888] hover:text-white hover:bg-[#16161a] transition-all"
            >
              <GridIcon />
              <span>Multicharts</span>
            </button>

            <button
              onClick={() => handleNavClick('new')}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all',
                currentView === 'new'
                  ? 'bg-[#1e222d] text-white'
                  : 'text-[#888] hover:text-white hover:bg-[#16161a]'
              )}
            >
              <SparklesIcon />
              <span>New Pairs</span>
            </button>

            <button
              onClick={() => handleNavClick('gainers')}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all',
                currentView === 'gainers' || currentView === 'losers'
                  ? 'bg-[#1e222d] text-white'
                  : 'text-[#888] hover:text-white hover:bg-[#16161a]'
              )}
            >
              <TrendingIcon />
              <span>Gainers & Losers</span>
            </button>

            <button
              onClick={() => handleNavClick('portfolio')}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all',
                currentView === 'portfolio'
                  ? 'bg-[#1e222d] text-white'
                  : 'text-[#888] hover:text-white hover:bg-[#16161a]'
              )}
            >
              <WalletIcon />
              <span>Portfolio</span>
            </button>

            <button
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold text-[#888] hover:text-white hover:bg-[#16161a] transition-all"
            >
              <AdIcon />
              <span>Advertise</span>
            </button>

            <button
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-[#555] hover:text-[#888] transition-all"
            >
              <span className="text-[11px]">more</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="my-3 mx-3 border-t border-white/[0.04]" />

          {/* Networks */}
          <div className="px-2 space-y-0.5">
            {networks.slice(0, showMoreNetworks ? networks.length : 5).map((network) => {
              const Logo = network.logo;
              return (
                <button
                  key={network.id}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all',
                    network.active
                      ? 'bg-[#1e222d] text-white'
                      : 'text-[#888] hover:text-white hover:bg-[#16161a]'
                  )}
                >
                  <Logo />
                  <span>{network.name}</span>
                  {network.active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00d395]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Divider */}
          <div className="my-3 mx-3 border-t border-white/[0.04]" />

          {/* Watchlist section */}
          <div className="px-3 mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <StarIcon />
                <span className="text-[12px] font-bold text-[#888] uppercase tracking-wide">Watchlist</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1 text-[#555] hover:text-white transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                  </svg>
                </button>
                <button className="p-1 text-[#555] hover:text-white transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2 py-1.5 bg-[#16161a] rounded-lg border border-[#2a2a30]">
              <span className="text-[12px] text-[#888]">Main Watchlist</span>
              <svg className="w-3 h-3 text-[#555] ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <p className="text-[11px] text-[#555] mt-2 px-1">Nothing in this list yet...</p>
          </div>

          {/* Divider */}
          <div className="mx-3 border-t border-white/[0.04]" />

          {/* User section */}
          <div className="px-3 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#1e222d] flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-[#888]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-[13px] text-[#888]">anon</span>
            </div>
            <button className="flex items-center gap-1.5 text-[12px] text-[#00d395] hover:text-[#00e5a5] font-semibold transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Sign-in
            </button>
          </div>

          {/* Social links */}
          <div className="px-3 pb-3 flex items-center gap-3">
            <a href="#" className="text-[#555] hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="text-[#555] hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
            <a href="#" className="text-[#555] hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>
            <a href="#" className="text-[#555] hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </nav>
      </aside>
    </>
  );
}
