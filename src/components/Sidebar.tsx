'use client';

import Link from 'next/link';
import { useApp, ViewType } from '@/context/AppContext';
import { cn } from '@/lib/utils';

interface NavItem {
  id: ViewType | string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  disabled?: boolean;
}

// Icons - clean outlined style
const TrendingIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);

const ArrowUpIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
  </svg>
);

const ArrowDownIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 015.815 5.514l2.699 1.23m0 0l-5.9 2.28m5.9-2.28l-2.28-5.9" />
  </svg>
);

const GridIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
);

const WalletIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
  </svg>
);

const ExternalIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
  </svg>
);

export default function Sidebar() {
  const { currentView, setCurrentView, sidebarOpen, setSidebarOpen, watchlistCount } = useApp();

  const navItems: NavItem[] = [
    { id: 'all', label: 'All Tokens', icon: <TrendingIcon /> },
    { id: 'watchlist', label: 'Watchlist', icon: <StarIcon />, badge: watchlistCount },
    { id: 'new', label: 'New Pairs', icon: <SparklesIcon /> },
    { id: 'gainers', label: 'Gainers', icon: <ArrowUpIcon /> },
    { id: 'losers', label: 'Losers', icon: <ArrowDownIcon /> },
  ];

  const toolItems: NavItem[] = [
    { id: 'multicharts', label: 'Multicharts', icon: <GridIcon />, disabled: true },
    { id: 'portfolio', label: 'Portfolio', icon: <WalletIcon />, disabled: true },
  ];

  const handleNavClick = (id: ViewType) => {
    setCurrentView(id);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-14 left-0 z-40 h-[calc(100vh-56px)] w-[200px] shrink-0',
          'border-r border-border bg-background overflow-y-auto scrollbar-hide',
          'transition-transform duration-200 ease-out',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="py-3">
          {/* Main Navigation */}
          <div className="px-2">
            <p className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-text-dimmed font-medium">
              Screener
            </p>
            
            <div className="space-y-0.5">
              {navItems.map((item) => {
                const isActive = currentView === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id as ViewType)}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors',
                      isActive
                        ? 'bg-white/[0.08] text-text-primary'
                        : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.04]'
                    )}
                  >
                    <span className={cn(
                      'flex-shrink-0',
                      isActive ? 'text-text-primary' : 'text-text-dimmed'
                    )}>
                      {item.icon}
                    </span>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium tabular-nums bg-white/[0.08] text-text-muted">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="my-3 mx-3 border-t border-border" />

          {/* Tools */}
          <div className="px-2">
            <p className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-text-dimmed font-medium">
              Tools
            </p>
            
            <div className="space-y-0.5">
              {toolItems.map((item) => (
                <button
                  key={item.id}
                  disabled={item.disabled}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors',
                    item.disabled
                      ? 'text-text-dimmed cursor-not-allowed'
                      : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.04]'
                  )}
                >
                  <span className="text-text-dimmed flex-shrink-0">{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.disabled && (
                    <span className="text-[9px] text-text-dimmed bg-white/[0.04] px-1.5 py-0.5 rounded">Soon</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="my-3 mx-3 border-t border-border" />

          {/* Chains */}
          <div className="px-2">
            <p className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-text-dimmed font-medium">
              Networks
            </p>
            
            <div className="space-y-0.5">
              {/* Solana - Active */}
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium bg-white/[0.08] text-text-primary">
                <SolanaLogo />
                <span>Solana</span>
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-positive" />
              </div>
              
              {/* Ethereum */}
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium text-text-dimmed cursor-not-allowed">
                <EthereumLogo />
                <span>Ethereum</span>
                <span className="ml-auto text-[9px] bg-white/[0.04] px-1.5 py-0.5 rounded">Soon</span>
              </div>
              
              {/* Base */}
              <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium text-text-dimmed cursor-not-allowed">
                <BaseLogo />
                <span>Base</span>
                <span className="ml-auto text-[9px] bg-white/[0.04] px-1.5 py-0.5 rounded">Soon</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-3 mx-3 border-t border-border" />

          {/* External Links */}
          <div className="px-2">
            <p className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-text-dimmed font-medium">
              Resources
            </p>
            
            <div className="space-y-0.5">
              <a
                href="https://dexscreener.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium text-text-muted hover:text-text-secondary hover:bg-white/[0.04] transition-colors"
              >
                <ExternalIcon />
                <span>DexScreener</span>
              </a>
              
              <a
                href="https://birdeye.so"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium text-text-muted hover:text-text-secondary hover:bg-white/[0.04] transition-colors"
              >
                <ExternalIcon />
                <span>Birdeye</span>
              </a>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}

function SolanaLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 4L7 16.5L16 22L25 16.5L16 4Z" fill="#52525b"/>
      <path d="M7 18L16 28L25 18L16 23.5L7 18Z" fill="#52525b"/>
    </svg>
  );
}

function BaseLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="12" fill="#52525b"/>
      <path d="M16 8C11.6 8 8 11.6 8 16C8 20.4 11.6 24 16 24C18.8 24 21.3 22.6 22.8 20.4L16 16V8Z" fill="#27272a"/>
    </svg>
  );
}
