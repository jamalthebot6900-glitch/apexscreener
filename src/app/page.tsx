'use client';

import TokenTable from '@/components/TokenTable';
import StatsBar from '@/components/StatsBar';
import QuickFilters from '@/components/QuickFilters';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Stats Bar */}
      <StatsBar 
        volume24h={1840000000} 
        txns24h={898600}
      />

      {/* Quick Filters */}
      <QuickFilters />
      
      {/* Main Content */}
      <div className="flex-1">
        {/* Token Table */}
        <TokenTable />
      </div>
    </div>
  );
}
