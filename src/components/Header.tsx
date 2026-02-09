'use client';

import Link from 'next/link';
import SearchBar from './SearchBar';
import { useApp } from '@/context/AppContext';

// Hamburger menu button for mobile
function HamburgerButton() {
  const { sidebarOpen, toggleSidebar } = useApp();

  return (
    <button
      onClick={toggleSidebar}
      className="lg:hidden p-2 -ml-2 text-text-muted hover:text-text-primary hover:bg-surface-light rounded-md transition-colors"
      aria-label="Toggle menu"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        {sidebarOpen ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
        )}
      </svg>
    </button>
  );
}

// Minimal live indicator
function LiveIndicator() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-1.5 w-1.5">
        <span className="live-pulse-ring absolute inline-flex h-full w-full rounded-full bg-positive opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-positive"></span>
      </span>
      <span className="text-[10px] font-medium text-text-muted uppercase tracking-wide">Live</span>
    </div>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 h-14 bg-background border-b border-border">
      <div className="h-full max-w-[1800px] mx-auto px-3 lg:px-4 flex items-center gap-3">
        {/* Hamburger for mobile */}
        <HamburgerButton />

        {/* Logo & Brand - Minimal */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <img src="/apex-logo.png" alt="Apexscreener" className="h-7 w-auto" />
          <span className="hidden sm:block text-sm font-semibold text-text-primary tracking-tight">
            Apexscreener
          </span>
        </Link>

        {/* Divider */}
        <div className="hidden md:block w-px h-5 bg-border" />

        {/* Live indicator */}
        <div className="hidden md:block">
          <LiveIndicator />
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4 hidden sm:block">
          <SearchBar />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Mobile live indicator */}
          <div className="md:hidden">
            <LiveIndicator />
          </div>

          {/* Network Badge - Minimal */}
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded bg-surface-light/50">
            <div className="w-1.5 h-1.5 rounded-full bg-[#9945FF]" />
            <span className="text-[10px] font-medium text-text-muted">Solana</span>
          </div>

          {/* Connect Wallet */}
          <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-primary bg-surface-light hover:bg-surface-hover border border-border hover:border-border-light rounded-md transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
            </svg>
            Connect
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="sm:hidden px-3 pb-2 bg-background border-b border-border">
        <SearchBar />
      </div>
    </header>
  );
}
