'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({ size = 'lg', text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-6 gap-4">
      {/* Skeleton table rows - matching actual table layout */}
      <div className="w-full space-y-0">
        {/* Header skeleton */}
        <div className="flex items-center gap-4 px-3 py-3 bg-gradient-to-r from-surface-light/60 to-surface-light/40 border-b border-border">
          <div className="w-8 h-3 skeleton rounded" />
          <div className="w-6 h-3 skeleton rounded" />
          <div className="w-32 h-3 skeleton rounded" />
          <div className="flex-1" />
          <div className="hidden md:flex items-center gap-6">
            <div className="h-3 skeleton rounded w-12" />
            <div className="h-3 skeleton rounded w-14" />
            <div className="h-3 skeleton rounded w-10" />
            <div className="h-3 skeleton rounded w-10" />
            <div className="h-3 skeleton rounded w-10" />
            <div className="h-3 skeleton rounded w-10" />
            <div className="h-3 skeleton rounded w-14" />
            <div className="h-3 skeleton rounded w-14" />
          </div>
        </div>
        
        {/* Row skeletons with alternating backgrounds */}
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className={`flex items-center gap-4 px-3 py-4 border-b border-border-subtle ${
              i % 2 === 0 ? 'bg-surface/30' : 'bg-transparent'
            }`}
            style={{ 
              animationDelay: `${i * 50}ms`,
              opacity: 1 - (i * 0.05)
            }}
          >
            {/* Watchlist */}
            <div className="w-8 h-8 skeleton rounded-lg" />
            {/* Rank */}
            <div className="w-6 h-6 skeleton rounded-md" />
            {/* Token info */}
            <div className="flex items-center gap-3 min-w-[180px]">
              <div className="relative">
                <div className="w-8 h-8 skeleton rounded-full" />
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 skeleton rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-3.5 skeleton rounded w-24" />
                <div className="h-2.5 skeleton rounded w-12" />
              </div>
            </div>
            {/* Data columns */}
            <div className="hidden md:flex items-center gap-6 flex-1 justify-end">
              <div className="h-3.5 skeleton rounded w-16" />
              <div className="h-5 skeleton rounded w-[70px]" /> {/* Sparkline */}
              <div className="h-3.5 skeleton rounded w-10" />
              <div className="h-3.5 skeleton rounded w-12" />
              <div className="h-3.5 skeleton rounded w-16" />
              <div className="h-5 skeleton rounded-md w-14" />
              <div className="h-5 skeleton rounded-md w-12" />
              <div className="h-5 skeleton rounded-md w-12" />
              <div className="h-5 skeleton rounded-md w-14" />
              <div className="h-3.5 skeleton rounded w-14" />
              <div className="h-3.5 skeleton rounded w-16" />
            </div>
            {/* Mobile visible columns */}
            <div className="flex md:hidden items-center gap-4 ml-auto">
              <div className="h-3.5 skeleton rounded w-14" />
              <div className="h-5 skeleton rounded-md w-12" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Loading indicator */}
      <div className="flex items-center gap-3 py-4">
        <div className="relative">
          <div className="w-5 h-5 border-2 border-border rounded-full" />
          <div className="absolute inset-0 w-5 h-5 border-2 border-transparent border-t-brand-blue rounded-full animate-spin" />
        </div>
        <span className="text-sm text-text-muted font-medium">
          {text || 'Loading tokens...'}
        </span>
      </div>
    </div>
  );
}

// Inline loading indicator for refresh states
export function InlineLoader() {
  return (
    <div className="flex items-center gap-2 text-brand-blue">
      <div className="w-3 h-3 border-[1.5px] border-current border-t-transparent rounded-full animate-spin" />
      <span className="text-[10px] uppercase tracking-wider font-medium text-text-muted">Updating</span>
    </div>
  );
}

// Skeleton row for table loading
export function TableRowSkeleton() {
  return (
    <tr className="animate-fade-in">
      <td className="table-body-cell"><div className="w-8 h-8 skeleton rounded-lg" /></td>
      <td className="table-body-cell"><div className="w-6 h-5 skeleton rounded" /></td>
      <td className="table-body-cell">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 skeleton rounded-full" />
          <div className="space-y-2">
            <div className="h-3.5 skeleton rounded w-24" />
            <div className="h-2.5 skeleton rounded w-12" />
          </div>
        </div>
      </td>
      {[...Array(10)].map((_, i) => (
        <td key={i} className="table-body-cell">
          <div className="h-3.5 skeleton rounded w-14 ml-auto" />
        </td>
      ))}
    </tr>
  );
}

// Pulse dot for live indicators
export function PulseDot({ color = 'positive' }: { color?: 'positive' | 'negative' | 'warning' }) {
  const colorClasses = {
    positive: 'bg-positive',
    negative: 'bg-negative',
    warning: 'bg-warning',
  };
  
  return (
    <span className="relative flex h-2 w-2">
      <span className={`live-pulse-ring absolute inline-flex h-full w-full rounded-full ${colorClasses[color]} opacity-75`} />
      <span className={`relative inline-flex rounded-full h-2 w-2 ${colorClasses[color]}`} />
    </span>
  );
}

// Card skeleton for stats
export function StatCardSkeleton() {
  return (
    <div className="card p-3 lg:p-4">
      <div className="h-2.5 skeleton rounded w-20 mb-3" />
      <div className="h-5 skeleton rounded w-16" />
    </div>
  );
}

// Chart page skeleton
export function ChartPageSkeleton() {
  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto animate-pulse">
      {/* Back button */}
      <div className="h-10 w-20 skeleton rounded-lg" />
      
      {/* Header */}
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 lg:w-24 lg:h-24 skeleton rounded-2xl" />
        <div className="space-y-3 flex-1">
          <div className="h-8 w-32 skeleton rounded" />
          <div className="h-5 w-48 skeleton rounded" />
          <div className="h-6 w-56 skeleton rounded-lg" />
        </div>
        <div className="hidden lg:block">
          <div className="h-20 w-40 skeleton rounded-xl" />
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="h-14 skeleton rounded-xl" />
        <div className="h-14 skeleton rounded-xl" />
        <div className="h-12 skeleton rounded-lg" />
        <div className="h-12 skeleton rounded-lg" />
      </div>
      
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card p-4">
            <div className="h-3 w-16 skeleton rounded mb-3" />
            <div className="h-5 w-12 skeleton rounded" />
          </div>
        ))}
      </div>
      
      {/* Buy/Sell ratio */}
      <div className="card p-5">
        <div className="h-4 w-32 skeleton rounded mb-4" />
        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="h-4 w-24 skeleton rounded" />
            <div className="h-4 w-24 skeleton rounded" />
          </div>
          <div className="h-4 skeleton rounded-full" />
        </div>
      </div>
      
      {/* Chart */}
      <div className="card">
        <div className="flex justify-between p-4 border-b border-border">
          <div className="h-5 w-24 skeleton rounded" />
          <div className="flex gap-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 w-12 skeleton rounded-md" />
            ))}
          </div>
        </div>
        <div className="h-[600px] skeleton" />
      </div>
    </div>
  );
}
