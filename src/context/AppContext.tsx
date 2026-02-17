'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useWatchlist, WatchlistItem } from '@/hooks/useWatchlist';
import { useFilters, FilterState } from '@/hooks/useFilters';
import { useAlerts, PriceAlert } from '@/hooks/useAlerts';

export type ViewType = 'all' | 'watchlist' | 'portfolio' | 'new' | 'graduated' | 'gainers' | 'losers' | 'alerts';

interface AppContextType {
  // Sidebar state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  
  // Current view
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  
  // Watchlist
  watchlist: WatchlistItem[];
  isInWatchlist: (address: string) => boolean;
  toggleWatchlist: (item: Omit<WatchlistItem, 'addedAt'>) => void;
  watchlistCount: number;
  
  // Filters
  filters: FilterState;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  
  // Alerts
  alerts: PriceAlert[];
  activeAlertsCount: number;
  addAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => PriceAlert;
  removeAlert: (id: string) => void;
  clearAlerts: () => void;
  getAlertsForToken: (address: string) => PriceAlert[];
  checkAlerts: (prices: Map<string, number>) => void;
  notificationsEnabled: boolean;
  enableNotifications: () => Promise<boolean>;
  soundEnabled: boolean;
  toggleSound: () => void;
  testSound: () => void;
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
  
  const {
    alerts,
    addAlert,
    removeAlert,
    clearAlerts,
    getAlertsForToken,
    checkAlerts,
    notificationsEnabled,
    enableNotifications,
    soundEnabled,
    toggleSound,
    testSound,
    count: activeAlertsCount,
  } = useAlerts();

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
        alerts,
        activeAlertsCount,
        addAlert,
        removeAlert,
        clearAlerts,
        getAlertsForToken,
        checkAlerts,
        notificationsEnabled,
        enableNotifications,
        soundEnabled,
        toggleSound,
        testSound,
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
