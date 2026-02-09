'use client';

import Link from 'next/link';
import { useApp, ViewType } from '@/context/AppContext';
import { cn } from '@/lib/utils';

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const StarIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const TrendingIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const NewIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export default function Sidebar() {
  const { currentView, setCurrentView, sidebarOpen, setSidebarOpen, watchlistCount } = useApp();

  const navItems: NavItem[] = [
    { id: 'all', label: 'All Tokens', icon: <TrendingIcon /> },
    { id: 'watchlist', label: 'Watchlist', icon: <StarIcon />, badge: watchlistCount },
    { id: 'new', label: 'New Pairs', icon: <NewIcon /> },
    { id: 'gainers', label: 'Gainers', icon: <ChartIcon /> },
    { id: 'losers', label: 'Losers', icon: <ChartIcon /> },
  ];

  const handleNavClick = (id: ViewType) => {
    setCurrentView(id);
    setSidebarOpen(false); // Close on mobile after selection
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-14 left-0 z-40 h-[calc(100vh-56px)] w-[220px] shrink-0',
          'border-r border-border bg-background overflow-y-auto',
          'transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="py-4">
          {/* Main Navigation */}
          <div className="px-3 space-y-1">
            <p className="px-3 py-2 text-[10px] uppercase tracking-wider text-text-muted font-semibold">
              Navigation
            </p>
            
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-accent/10 text-accent border border-accent/20'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-light border border-transparent'
                  )}
                >
                  <span className={cn(isActive ? 'text-accent' : 'text-text-muted')}>{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={cn(
                      'px-1.5 py-0.5 rounded text-[10px] font-bold tabular-nums',
                      isActive ? 'bg-accent/20 text-accent' : 'bg-surface-light text-text-muted'
                    )}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="my-4 mx-4 border-t border-border" />

          {/* Chains */}
          <div className="px-3">
            <p className="px-3 py-2 text-[10px] uppercase tracking-wider text-text-muted font-semibold">
              Chains
            </p>
            
            {/* Solana - Selected */}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-surface-light text-text-primary border border-border">
              <SolanaLogo />
              <span>Solana</span>
              <span className="ml-auto w-2 h-2 rounded-full bg-positive animate-pulse" />
            </div>
            
            {/* Other chains - disabled/coming soon */}
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted opacity-50 cursor-not-allowed">
              <EthereumLogo />
              <span>Ethereum</span>
              <span className="ml-auto text-[10px] bg-surface-light px-1.5 py-0.5 rounded">Soon</span>
            </div>
            
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted opacity-50 cursor-not-allowed">
              <BaseLogo />
              <span>Base</span>
              <span className="ml-auto text-[10px] bg-surface-light px-1.5 py-0.5 rounded">Soon</span>
            </div>
          </div>

          {/* Divider */}
          <div className="my-4 mx-4 border-t border-border" />

          {/* Quick Actions */}
          <div className="px-3">
            <p className="px-3 py-2 text-[10px] uppercase tracking-wider text-text-muted font-semibold">
              Quick Links
            </p>
            
            <a
              href="https://dexscreener.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-light transition-all"
            >
              <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>DexScreener</span>
            </a>
            
            <a
              href="https://birdeye.so"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface-light transition-all"
            >
              <svg className="w-4 h-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>Birdeye</span>
            </a>
          </div>
        </nav>
      </aside>
    </>
  );
}

function SolanaLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
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

function EthereumLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4L7 16.5L16 22L25 16.5L16 4Z" fill="#71717a"/>
      <path d="M7 18L16 28L25 18L16 23.5L7 18Z" fill="#71717a"/>
    </svg>
  );
}

function BaseLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="12" fill="#71717a"/>
      <path d="M16 8C11.6 8 8 11.6 8 16C8 20.4 11.6 24 16 24C18.8 24 21.3 22.6 22.8 20.4L16 16V8Z" fill="#27272a"/>
    </svg>
  );
}
