'use client';

import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import SearchBar from './SearchBar';
import { useApp } from '@/context/AppContext';

// Auth button component
function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="w-8 h-8 rounded-full bg-surface-light animate-pulse" />
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => signOut()}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-muted hover:text-text-primary transition-colors"
        >
          Sign Out
        </button>
        <div className="relative group">
          {session.user.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="w-8 h-8 rounded-full border border-white/10 cursor-pointer hover:border-white/20 transition-colors"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-muted flex items-center justify-center text-white text-xs font-bold cursor-pointer">
              {session.user.name?.charAt(0) || 'U'}
            </div>
          )}
          {/* Dropdown menu */}
          <div className="absolute right-0 top-full mt-2 w-52 py-1.5 bg-surface-elevated border border-white/10 rounded-lg shadow-elevated opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <div className="px-4 py-3 border-b border-white/5">
              <p className="text-sm font-medium text-text-primary truncate">{session.user.name}</p>
              <p className="text-xs text-text-muted truncate mt-0.5">{session.user.email}</p>
            </div>
            <button
              onClick={() => signOut()}
              className="w-full px-4 py-2.5 text-left text-sm text-text-muted hover:text-text-primary hover:bg-white/[0.03] transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn('google')}
      className="btn-secondary flex items-center gap-1.5"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
      </svg>
      Sign In
    </button>
  );
}

// Hamburger menu button for mobile
function HamburgerButton() {
  const { sidebarOpen, toggleSidebar } = useApp();

  return (
    <button
      onClick={toggleSidebar}
      className="lg:hidden p-2 -ml-2 text-text-muted hover:text-text-primary hover:bg-white/[0.03] rounded-md transition-colors"
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

// Minimal live indicator with premium glow
function LiveIndicator() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-1.5 w-1.5">
        <span className="live-pulse-ring absolute inline-flex h-full w-full rounded-full bg-positive opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-positive shadow-glow-green"></span>
      </span>
      <span className="text-[10px] font-medium text-text-muted uppercase tracking-wider">Live</span>
    </div>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 h-14 bg-background/95 backdrop-blur-md border-b border-white/[0.04]">
      <div className="h-full max-w-[1800px] mx-auto px-4 lg:px-6 flex items-center gap-4">
        {/* Hamburger for mobile */}
        <HamburgerButton />

        {/* Logo & Brand - Premium */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <img src="/apex-logo.png" alt="Apexscreener" className="h-7 w-auto opacity-90 group-hover:opacity-100 transition-opacity" />
          <span className="hidden sm:block text-base font-semibold text-text-primary tracking-tight">
            Apexscreener
          </span>
        </Link>

        {/* Divider */}
        <div className="hidden md:block w-px h-5 bg-white/10" />

        {/* Live indicator */}
        <div className="hidden md:block">
          <LiveIndicator />
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-lg mx-4 hidden sm:block">
          <SearchBar />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Mobile live indicator */}
          <div className="md:hidden">
            <LiveIndicator />
          </div>

          {/* Network Badge - Premium Glass */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.05]">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195]" />
            <span className="text-[11px] font-medium text-text-secondary">Solana</span>
          </div>

          {/* Connect Wallet - Premium Button */}
          <button className="hidden sm:flex btn-secondary items-center gap-2">
            <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
            </svg>
            Connect
          </button>

          {/* Auth Button */}
          <AuthButton />
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="sm:hidden px-4 pb-3 bg-background/95 backdrop-blur-md border-b border-white/[0.04]">
        <SearchBar />
      </div>
    </header>
  );
}
