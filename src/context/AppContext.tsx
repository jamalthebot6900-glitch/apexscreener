'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useFilters, FilterState } from '@/hooks/useFilters';

export type ViewType = 'all' | 'watchlist' | 'new' | 'graduated' | 'gainers' | 'losers';

interface AppContextType {
  // Sidebar state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  
  // Current view
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  
  // Watchlist
  watchlist: string[];
  isInWatchlist: (address: string) => boolean;
  toggleWatchlist: (address: string) => void;
  watchlistCount: number;
  
  // Filters
  filters: FilterState;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('all');
  
  const {
    watchlist,
    isInWatchlist,
    toggleWatchlist,
    count: watchlistCount,
  } = useWatchlist();
  
  const {
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters,
  } = useFilters();

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        currentView,
        setCurrentView,
        watchlist,
        isInWatchlist,
        toggleWatchlist,
        watchlistCount,
        filters,
        updateFilter,
        resetFilters,
        hasActiveFilters,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
