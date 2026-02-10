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
      <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => signOut()}
          className="text-sm text-white/50 hover:text-white transition-colors"
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
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-medium cursor-pointer">
              {session.user.name?.charAt(0) || 'U'}
            </div>
          )}
          {/* Dropdown menu */}
          <div className="absolute right-0 top-full mt-2 w-52 py-1.5 bg-surface border border-white/10 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            <div className="px-4 py-3 border-b border-white/5">
              <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
              <p className="text-xs text-white/40 truncate mt-0.5">{session.user.email}</p>
            </div>
            <button
              onClick={() => signOut()}
              className="w-full px-4 py-2.5 text-left text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors"
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
      className="text-sm text-white/50 hover:text-white transition-colors"
    >
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
      className="lg:hidden p-2 -ml-2 text-white/50 hover:text-white transition-colors"
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

export default function Header() {
  return (
    <header className="sticky top-0 z-50 h-16 bg-surface border-b border-white/[0.06]">
      <div className="h-full max-w-[1800px] mx-auto px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left - Logo & Brand */}
        <div className="flex items-center gap-6">
          <HamburgerButton />
          
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src="/apex-logo.png" 
              alt="Apexscreener" 
              className="h-10 w-auto opacity-90 group-hover:opacity-100 transition-opacity" 
            />
            <span className="text-2xl font-bold text-white tracking-tight">
              Apexscreener
            </span>
          </Link>

          {/* Live indicator */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Live</span>
          </div>
        </div>

        {/* Center - Search */}
        <div className="hidden sm:block flex-1 max-w-md mx-8">
          <SearchBar />
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-6">
          {/* Network indicator */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195]" />
            <span className="text-sm text-white/50">Solana</span>
          </div>

          {/* Connect Wallet */}
          <button className="hidden sm:block text-sm text-white/50 hover:text-white transition-colors">
            Connect
          </button>

          {/* Auth */}
          <AuthButton />
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="sm:hidden px-4 pb-3 bg-surface border-b border-white/[0.06]">
        <SearchBar />
      </div>
    </header>
  );
}
