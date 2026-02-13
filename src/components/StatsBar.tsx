'use client';

import { useEffect, useState, useCallback } from 'react';

function formatNumber(num: number): string {
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}

function formatTxns(num: number): string {
  return num.toLocaleString();
}

interface StatsBarProps {
  volume24h?: number;
  txns24h?: number;
}

export default function StatsBar({ volume24h: propVolume, txns24h: propTxns }: StatsBarProps) {
  const [stats, setStats] = useState({
    volume24h: propVolume || 0,
    txns24h: propTxns || 0,
    pairs: 0,
  });
  const [blockInfo, setBlockInfo] = useState({
    slot: 0,
    age: '...',
  });
  const [solPrice, setSolPrice] = useState<number | null>(null);

  // Fetch aggregate stats from DexScreener tokens
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('https://api.dexscreener.com/latest/dex/tokens/solana', {
        cache: 'no-store',
      });
      const data = await res.json();
      const pairs = data.pairs || [];
      
      // Calculate totals from top pairs
      const solanaPairs = pairs.filter((p: any) => p.chainId === 'solana').slice(0, 100);
      const totalVolume = solanaPairs.reduce((sum: number, p: any) => sum + (p.volume?.h24 || 0), 0);
      const totalTxns = solanaPairs.reduce((sum: number, p: any) => {
        const txns = p.txns?.h24 || { buys: 0, sells: 0 };
        return sum + (txns.buys || 0) + (txns.sells || 0);
      }, 0);
      
      setStats({
        volume24h: totalVolume,
        txns24h: totalTxns,
        pairs: solanaPairs.length,
      });
    } catch (e) {
      console.error('Failed to fetch stats:', e);
    }
  }, []);

  // Fetch Solana block info
  const fetchBlockInfo = useCallback(async () => {
    try {
      const res = await fetch('https://api.mainnet-beta.solana.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getSlot',
        }),
      });
      const data = await res.json();
      if (data.result) {
        setBlockInfo({
          slot: data.result,
          age: 'now',
        });
        
        // Update age counter
        let ageSeconds = 0;
        const ageInterval = setInterval(() => {
          ageSeconds++;
          setBlockInfo(prev => ({
            ...prev,
            age: `${ageSeconds}s`,
          }));
        }, 1000);
        
        // Clear interval after 10 seconds (before next fetch)
        setTimeout(() => clearInterval(ageInterval), 9000);
      }
    } catch (e) {
      console.error('Failed to fetch block:', e);
    }
  }, []);

  // Fetch SOL price
  const fetchSolPrice = useCallback(async () => {
    try {
      const res = await fetch('https://api.dexscreener.com/latest/dex/tokens/So11111111111111111111111111111111111111112');
      const data = await res.json();
      if (data.pairs?.[0]) {
        setSolPrice(parseFloat(data.pairs[0].priceUsd));
      }
    } catch (e) {
      console.error('Failed to fetch SOL price:', e);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchBlockInfo();
    fetchSolPrice();
    
    // Refresh stats every 30 seconds
    const statsInterval = setInterval(fetchStats, 30000);
    // Refresh block every 10 seconds
    const blockInterval = setInterval(fetchBlockInfo, 10000);
    // Refresh SOL price every 30 seconds
    const priceInterval = setInterval(fetchSolPrice, 30000);
    
    return () => {
      clearInterval(statsInterval);
      clearInterval(blockInterval);
      clearInterval(priceInterval);
    };
  }, [fetchStats, fetchBlockInfo, fetchSolPrice]);

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-[#0d0d0f] border-b border-white/[0.04]">
      {/* Left stats */}
      <div className="flex items-center gap-6">
        {/* SOL Price */}
        {solPrice && (
          <div className="flex items-center gap-2">
            <img 
              src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
              alt="SOL"
              className="w-4 h-4 rounded-full"
            />
            <span className="text-[13px] font-bold text-white">${solPrice.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#666] uppercase font-medium">24H Vol:</span>
          <span className="text-[13px] font-bold text-white">
            {stats.volume24h > 0 ? formatNumber(stats.volume24h) : '...'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#666] uppercase font-medium">24H Txns:</span>
          <span className="text-[13px] font-bold text-white">
            {stats.txns24h > 0 ? formatTxns(stats.txns24h) : '...'}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#666] uppercase font-medium">Pairs:</span>
          <span className="text-[13px] font-bold text-[#00d395]">
            {stats.pairs > 0 ? stats.pairs : '...'}
          </span>
        </div>
      </div>

      {/* Right - Latest Block */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-[#00d395] rounded-full animate-pulse" />
        <span className="text-[12px] text-[#666] uppercase font-medium">Slot:</span>
        <span className="text-[13px] font-bold text-white tabular-nums">
          {blockInfo.slot > 0 ? blockInfo.slot.toLocaleString() : '...'}
        </span>
        <span className="text-[11px] text-[#555]">{blockInfo.age} ago</span>
      </div>
    </div>
  );
}
