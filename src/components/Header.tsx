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
      className="lg:hidden p-2 -ml-2 text-text-secondary hover:text-text-primary hover:bg-surface-light rounded-lg transition-colors"
      aria-label="Toggle menu"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {sidebarOpen ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        )}
      </svg>
    </button>
  );
}

// Live indicator with smooth pulsing animation
function LiveIndicator() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-positive/10 to-positive/5 border border-positive/20">
      <span className="relative flex h-2 w-2">
        <span className="live-pulse-ring absolute inline-flex h-full w-full rounded-full bg-positive opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-positive shadow-glow-green"></span>
      </span>
      <span className="text-[10px] font-bold text-positive uppercase tracking-wider">Live</span>
    </div>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 header-glass h-16">
      <div className="h-full max-w-[1800px] mx-auto px-4 lg:px-6 flex items-center gap-4 lg:gap-6">
        {/* Hamburger for mobile */}
        <HamburgerButton />

        {/* Logo & Brand - Enhanced */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          {/* Logo with glow effect on hover */}
          <div className="relative transition-transform duration-300 group-hover:scale-105">
            <div className="absolute inset-0 bg-white/20 rounded-lg blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
            <img src="/apex-logo.png" alt="Apexscreener" className="h-8 w-auto relative" />
          </div>
          
          {/* Brand text with tagline */}
          <div className="hidden sm:flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-text-primary tracking-tight leading-none bg-gradient-to-r from-white to-white/80 bg-clip-text">
                Apexscreener
              </span>
              {/* Premium badge */}
              <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/20">
                Pro
              </span>
            </div>
            <span className="text-[9px] text-text-dimmed font-medium tracking-[0.08em] mt-0.5 italic">
              The Apex of Token Screening
            </span>
          </div>
        </Link>

        {/* Divider */}
        <div className="hidden md:block w-px h-8 bg-gradient-to-b from-transparent via-border to-transparent" />

        {/* Live indicator */}
        <div className="hidden md:block">
          <LiveIndicator />
        </div>

        {/* Search Bar - PROMINENT */}
        <div className="flex-1 max-w-xl hidden sm:block">
          <SearchBar />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Mobile live indicator */}
          <div className="md:hidden">
            <LiveIndicator />
          </div>

          {/* Network Status */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-light/50 border border-border/50">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Solana</span>
          </div>

          {/* CTA Button */}
          <button className="btn-primary hidden sm:flex items-center gap-2 bg-gradient-to-r from-white to-gray-100 hover:from-gray-100 hover:to-white">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Get App
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="sm:hidden px-4 pb-3">
        <SearchBar />
      </div>
    </header>
  );
}
