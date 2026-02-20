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

const UsersIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
);

const navItems = [
  { id: 'all', label: 'All Tokens', icon: TrendingIcon, color: 'violet' },
  { id: 'watchlist', label: 'Watchlist', icon: StarIcon, color: 'amber' },
  { id: 'alerts', label: 'Alerts', icon: BellIcon, color: 'orange' },
  { id: 'new', label: 'New Pairs', icon: SparklesIcon, color: 'cyan' },
  { id: 'gainers', label: 'Gainers', icon: TrendingIcon, color: 'emerald' },
  { id: 'losers', label: 'Losers', icon: TrendingIcon, color: 'red' },
  { id: 'portfolio', label: 'Portfolio', icon: WalletIcon, color: 'fuchsia' },
];

const colorClasses: Record<string, { active: string; inactive: string }> = {
  violet: { active: 'bg-violet-500/15 text-violet-400 border-violet-500/30', inactive: 'hover:bg-violet-500/10' },
  amber: { active: 'bg-amber-500/15 text-amber-400 border-amber-500/30', inactive: 'hover:bg-amber-500/10' },
  orange: { active: 'bg-orange-500/15 text-orange-400 border-orange-500/30', inactive: 'hover:bg-orange-500/10' },
  cyan: { active: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', inactive: 'hover:bg-cyan-500/10' },
  emerald: { active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', inactive: 'hover:bg-emerald-500/10' },
  fuchsia: { active: 'bg-fuchsia-500/15 text-fuchsia-400 border-fuchsia-500/30', inactive: 'hover:bg-fuchsia-500/10' },
  red: { active: 'bg-red-500/15 text-red-400 border-red-500/30', inactive: 'hover:bg-red-500/10' },
};

export default function Sidebar() {
  const { currentView, setCurrentView, sidebarOpen, setSidebarOpen, watchlistCount, activeAlertsCount } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

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
          'fixed lg:sticky top-14 left-0 z-40 h-[calc(100vh-56px)] w-[200px] shrink-0',
          'border-r border-white/[0.06] bg-[#0a0a0c]/95 backdrop-blur-xl overflow-y-auto scrollbar-hide',
          'transition-transform duration-300 ease-out',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="py-4 flex flex-col h-full">
          {/* Search */}
          <div className="px-3 mb-4">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-10 pr-8 py-2.5 text-[13px] text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-violet-400 transition-colors">
                <SearchIcon />
              </div>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-white/20 bg-white/[0.05] px-1.5 py-0.5 rounded border border-white/[0.06]">
                /
              </div>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="px-2 space-y-1">
            <div className="px-2 mb-2">
              <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Navigation</span>
            </div>
            
            {navItems.map((item) => {
              const Icon = item.icon;
              const colors = colorClasses[item.color];
              const isActive = currentView === item.id;
              const count = item.id === 'watchlist' ? watchlistCount : item.id === 'alerts' ? activeAlertsCount : 0;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as ViewType)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200',
                    isActive
                      ? `${colors.active} border`
                      : `text-white/60 hover:text-white ${colors.inactive} border border-transparent`
                  )}
                >
                  <Icon />
                  <span>{item.label}</span>
                  {count > 0 && (
                    <span className={cn(
                      'ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                      isActive ? 'bg-white/20' : 'bg-white/10 text-white/50'
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="my-4 mx-3 border-t border-white/[0.06]" />

          {/* Network Selector */}
          <div className="px-2">
            <div className="px-2 mb-2">
              <span className="text-[10px] font-semibold text-white/30 uppercase tracking-widest">Network</span>
            </div>
            
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 text-white transition-all hover:border-violet-500/40">
              <SolanaLogo />
              <span>Solana</span>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <svg className="w-3 h-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom Section */}
          <div className="mt-4 px-3 space-y-3">
            {/* Pro Badge */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent uppercase tracking-wide">
                  Apex Pro
                </span>
                <span className="text-[9px] bg-fuchsia-500/20 text-fuchsia-400 px-1.5 py-0.5 rounded-full font-medium">Soon</span>
              </div>
              <p className="text-[11px] text-white/40 leading-relaxed">
                Real-time alerts, advanced analytics, and more.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-4 py-2">
              <a href="#" className="text-white/30 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="text-white/30 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
              <a href="#" className="text-white/30 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
            </div>

            {/* Version */}
            <div className="text-center">
              <span className="text-[10px] text-white/20">ApexScreener v1.0</span>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
