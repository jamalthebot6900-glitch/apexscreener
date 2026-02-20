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

interface StatItemProps {
  label: string;
  value: string;
  color?: 'default' | 'green' | 'violet';
  icon?: React.ReactNode;
}

function StatItem({ label, value, color = 'default', icon }: StatItemProps) {
  const valueColors = {
    default: 'text-white',
    green: 'text-emerald-400',
    violet: 'text-violet-400',
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.02] border border-white/[0.04]">
      {icon}
      <span className="text-[11px] text-white/40 uppercase font-medium tracking-wide">{label}</span>
      <span className={`text-[13px] font-bold tabular-nums ${valueColors[color]}`}>
        {value}
      </span>
    </div>
  );
}

export default function StatsBar() {
  const [stats, setStats] = useState({
    volume24h: 0,
    txns24h: 0,
    pairs: 0,
  });
  const [blockInfo, setBlockInfo] = useState({
    slot: 0,
    age: '...',
  });
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [solChange, setSolChange] = useState<number>(0);

  // Fetch aggregate stats from DexScreener tokens
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('https://api.dexscreener.com/latest/dex/tokens/solana', {
        cache: 'no-store',
      });
      const data = await res.json();
      const pairs = data.pairs || [];
      
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
        
        let ageSeconds = 0;
        const ageInterval = setInterval(() => {
          ageSeconds++;
          setBlockInfo(prev => ({
            ...prev,
            age: `${ageSeconds}s`,
          }));
        }, 1000);
        
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
        setSolChange(data.pairs[0].priceChange?.h24 || 0);
      }
    } catch (e) {
      console.error('Failed to fetch SOL price:', e);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchBlockInfo();
    fetchSolPrice();
    
    const statsInterval = setInterval(fetchStats, 30000);
    const blockInterval = setInterval(fetchBlockInfo, 10000);
    const priceInterval = setInterval(fetchSolPrice, 30000);
    
    return () => {
      clearInterval(statsInterval);
      clearInterval(blockInterval);
      clearInterval(priceInterval);
    };
  }, [fetchStats, fetchBlockInfo, fetchSolPrice]);

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-[#0a0a0c] to-[#0d0d10] border-b border-white/[0.04]">
      {/* Left stats */}
      <div className="flex items-center gap-3">
        {/* SOL Price */}
        {solPrice && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20">
            <img 
              src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
              alt="SOL"
              className="w-4 h-4 rounded-full"
            />
            <span className="text-[13px] font-bold text-white">${solPrice.toFixed(2)}</span>
            <span className={`text-[11px] font-semibold ${solChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {solChange >= 0 ? '+' : ''}{solChange.toFixed(2)}%
            </span>
          </div>
        )}
        
        <StatItem 
          label="24H Vol" 
          value={stats.volume24h > 0 ? formatNumber(stats.volume24h) : '...'} 
        />
        
        <StatItem 
          label="Txns" 
          value={stats.txns24h > 0 ? formatTxns(stats.txns24h) : '...'} 
        />
        
        <StatItem 
          label="Pairs" 
          value={stats.pairs > 0 ? stats.pairs.toString() : '...'} 
          color="green"
        />
      </div>

      {/* Right - Latest Block */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
        <div className="relative">
          <div className="w-2 h-2 bg-emerald-400 rounded-full" />
          <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping opacity-75" />
        </div>
        <span className="text-[11px] text-white/50 uppercase font-medium">Slot</span>
        <span className="text-[13px] font-bold text-emerald-400 tabular-nums">
          {blockInfo.slot > 0 ? blockInfo.slot.toLocaleString() : '...'}
        </span>
        <span className="text-[10px] text-white/30">{blockInfo.age} ago</span>
      </div>
    </div>
  );
}
