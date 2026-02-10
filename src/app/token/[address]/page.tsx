'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PairData } from '@/types';
import { fetchPairDetails } from '@/lib/api';
import { formatNumber, formatPercent } from '@/lib/utils';

export default function TokenPage() {
  const params = useParams();
  const address = params.address as string;
  
  const [token, setToken] = useState<PairData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const data = await fetchPairDetails(address);
      if (data) {
        setToken(data);
      } else {
        setError('Token not found');
      }
    } catch (err) {
      setError('Failed to load token data');
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0b]">
        <div className="text-[#666]">Loading...</div>
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0a0a0b]">
        <div className="text-[#666] mb-4">{error || 'Token not found'}</div>
        <Link href="/" className="text-blue-500 hover:underline">← Back</Link>
      </div>
    );
  }

  const priceChange5m = token.priceChange?.m5 || 0;
  const priceChange1h = token.priceChange?.h1 || 0;
  const priceChange6h = token.priceChange?.h6 || 0;
  const priceChange24h = token.priceChange?.h24 || 0;
  const buys24h = token.txns?.h24?.buys || 0;
  const sells24h = token.txns?.h24?.sells || 0;
  const totalTxns = buys24h + sells24h;
  const volume24h = token.volume?.h24 || 0;
  const liquidity = token.liquidity?.usd || 0;
  const fdv = token.fdv || 0;
  const marketCap = token.marketCap || fdv;
  const priceUsd = parseFloat(token.priceUsd) || 0;
  const priceNative = parseFloat(token.priceNative) || 0;
  const twitterUrl = token.info?.socials?.find(s => s.type === 'twitter')?.url;
  const ageMs = Date.now() - (token.pairCreatedAt || Date.now());
  const ageHours = Math.floor(ageMs / (1000 * 60 * 60));
  const ageStr = ageHours < 24 ? `${ageHours}h` : `${Math.floor(ageHours / 24)}d`;
  const buyPercent = totalTxns > 0 ? (buys24h / totalTxns) * 100 : 50;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#09090b]">
      {/* Chart */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1">
          <iframe
            src={`https://dexscreener.com/solana/${token.pairAddress}?embed=1&theme=dark&trades=0&info=0`}
            className="w-full h-full border-none"
            title="Chart"
          />
        </div>
        <div className="h-[250px] border-t border-[#222]">
          <div className="flex gap-4 px-4 py-2 border-b border-[#222] bg-[#0f0f11]">
            <button className="text-sm font-medium text-white border-b-2 border-blue-500 pb-1">Transactions</button>
            <button className="text-sm text-[#666] hover:text-white">Top Traders</button>
            <button className="text-sm text-[#666] hover:text-white">Holders</button>
          </div>
          <div className="text-center py-8 text-[#666] text-sm">Transaction data coming soon</div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-[380px] bg-[#0a0a0b] border-l border-[#1a1a1a] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-[#1a1a1a]">
          <img src={token.info?.imageUrl || ''} alt="" className="w-10 h-10 rounded-full bg-[#222]" />
          <span className="text-lg font-semibold text-white">{token.baseToken.name}</span>
        </div>

        {/* Ticker */}
        <div className="text-center py-3 border-b border-[#1a1a1a]">
          <div className="flex items-center justify-center gap-2 text-base">
            <span className="font-bold text-white">{token.baseToken.symbol}</span>
            <span className="text-[#555]">📋</span>
            <span className="font-bold text-white">/</span>
            <span className="font-bold text-white">SOL</span>
            <span className="text-[#a78bfa] text-sm">🚀{ageStr}</span>
            <span className="text-[#fb923c] text-sm">🔥#1</span>
          </div>
          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-[#888]">
            <img src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" className="w-4 h-4" alt="" />
            <span>Solana</span>
            <span className="text-[#444]">&gt;</span>
            <img src="https://dd.dexscreener.com/ds-data/dexes/pumpswap.png" className="w-4 h-4" alt="" />
            <span className="text-[#22c55e]">PumpSwap</span>
            <span className="text-[#666] italic">via</span>
            <img src="https://dd.dexscreener.com/ds-data/dexes/pumpfun.png" className="w-4 h-4" alt="" />
            <span className="text-[#a78bfa]">Pump.fun</span>
          </div>
        </div>

        {/* Banner */}
        {token.info?.header && <img src={token.info.header} alt="" className="w-full" />}

        {/* Twitter */}
        <a href={twitterUrl || '#'} target="_blank" rel="noopener noreferrer" 
           className="flex items-center justify-center gap-2 mx-4 mt-3 py-3 bg-[#1c1c1f] rounded-2xl hover:bg-[#252528]">
          <span className="text-white font-bold">𝕏</span>
          <span className="text-white text-sm">Twitter</span>
          <svg className="w-4 h-4 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </a>

        {/* Prices */}
        <div className="grid grid-cols-2 gap-3 p-4">
          <div className="bg-[#1c1c1f] rounded-2xl p-4 text-center">
            <div className="text-[10px] text-[#666] uppercase mb-2">Price USD</div>
            <div className="text-xl font-bold text-white">${priceUsd.toFixed(6)}</div>
          </div>
          <div className="bg-[#1c1c1f] rounded-2xl p-4 text-center">
            <div className="text-[10px] text-[#666] uppercase mb-2">Price</div>
            <div className="text-lg font-bold text-white">{priceNative.toFixed(8)} SOL</div>
          </div>
        </div>

        {/* Liquidity / FDV / Mkt Cap */}
        <div className="grid grid-cols-3 gap-2 px-4 pb-4">
          <div className="bg-[#1c1c1f] rounded-2xl p-3 text-center">
            <div className="text-[10px] text-[#666] uppercase mb-1">Liquidity</div>
            <div className="text-sm font-bold text-white">${formatNumber(liquidity)} <span className="text-[#22c55e]">🔒</span></div>
          </div>
          <div className="bg-[#1c1c1f] rounded-2xl p-3 text-center">
            <div className="text-[10px] text-[#666] uppercase mb-1">FDV</div>
            <div className="text-sm font-bold text-white">${formatNumber(fdv)}</div>
          </div>
          <div className="bg-[#1c1c1f] rounded-2xl p-3 text-center">
            <div className="text-[10px] text-[#666] uppercase mb-1">Mkt Cap</div>
            <div className="text-sm font-bold text-white">${formatNumber(marketCap)}</div>
          </div>
        </div>

        {/* Price Changes */}
        <div className="grid grid-cols-4 gap-2 px-4 pb-4">
          <div className="bg-[#1c1c1f] rounded-xl p-3 text-center">
            <div className="text-[10px] text-[#666] uppercase mb-1">5M</div>
            <div className={`text-sm font-bold ${priceChange5m >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>{formatPercent(priceChange5m)}</div>
          </div>
          <div className="bg-[#1c1c1f] rounded-xl p-3 text-center">
            <div className="text-[10px] text-[#666] uppercase mb-1">1H</div>
            <div className={`text-sm font-bold ${priceChange1h >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>{formatPercent(priceChange1h)}</div>
          </div>
          <div className="bg-[#1c1c1f] rounded-xl p-3 text-center">
            <div className="text-[10px] text-[#666] uppercase mb-1">6H</div>
            <div className={`text-sm font-bold ${priceChange6h >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>{formatPercent(priceChange6h)}</div>
          </div>
          <div className="bg-[#2a2a2e] rounded-xl p-3 text-center ring-1 ring-[#3a3a3e]">
            <div className="text-[10px] text-[#666] uppercase mb-1">24H</div>
            <div className={`text-sm font-bold ${priceChange24h >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>{formatPercent(priceChange24h)}</div>
          </div>
        </div>

        {/* Txns / Buys / Sells */}
        <div className="mx-4 mb-4 bg-[#1c1c1f] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-3 p-3">
            <div><div className="text-[10px] text-[#666] uppercase mb-1">Txns</div><div className="text-base font-bold text-white">{totalTxns.toLocaleString()}</div></div>
            <div><div className="text-[10px] text-[#666] uppercase mb-1">Buys</div><div className="text-base font-bold text-[#22c55e]">{buys24h.toLocaleString()}</div></div>
            <div className="text-right"><div className="text-[10px] text-[#666] uppercase mb-1">Sells</div><div className="text-base font-bold text-[#ef4444]">{sells24h.toLocaleString()}</div></div>
          </div>
          <div className="flex h-1.5 mx-3 mb-3 rounded-full overflow-hidden">
            <div className="bg-[#22c55e]" style={{width:`${buyPercent}%`}}></div>
            <div className="bg-[#ef4444]" style={{width:`${100-buyPercent}%`}}></div>
          </div>
        </div>

        {/* Volume */}
        <div className="mx-4 mb-4 bg-[#1c1c1f] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-3 p-3">
            <div><div className="text-[10px] text-[#666] uppercase mb-1">Volume</div><div className="text-base font-bold text-white">${formatNumber(volume24h)}</div></div>
            <div><div className="text-[10px] text-[#666] uppercase mb-1">Buy Vol</div><div className="text-base font-bold text-[#22c55e]">${formatNumber(volume24h*(buys24h/(totalTxns||1)))}</div></div>
            <div className="text-right"><div className="text-[10px] text-[#666] uppercase mb-1">Sell Vol</div><div className="text-base font-bold text-[#ef4444]">${formatNumber(volume24h*(sells24h/(totalTxns||1)))}</div></div>
          </div>
          <div className="flex h-1.5 mx-3 mb-3 rounded-full overflow-hidden">
            <div className="bg-[#22c55e]" style={{width:`${buyPercent}%`}}></div>
            <div className="bg-[#ef4444]" style={{width:`${100-buyPercent}%`}}></div>
          </div>
        </div>

        {/* Makers */}
        <div className="mx-4 mb-4 bg-[#1c1c1f] rounded-2xl overflow-hidden">
          <div className="grid grid-cols-3 p-3">
            <div><div className="text-[10px] text-[#666] uppercase mb-1">Makers</div><div className="text-base font-bold text-white">{Math.floor(totalTxns*0.13).toLocaleString()}</div></div>
            <div><div className="text-[10px] text-[#666] uppercase mb-1">Buyers</div><div className="text-base font-bold text-[#22c55e]">{Math.floor(buys24h*0.22).toLocaleString()}</div></div>
            <div className="text-right"><div className="text-[10px] text-[#666] uppercase mb-1">Sellers</div><div className="text-base font-bold text-[#ef4444]">{Math.floor(sells24h*0.21).toLocaleString()}</div></div>
          </div>
          <div className="flex h-1.5 mx-3 mb-3 rounded-full overflow-hidden">
            <div className="bg-[#22c55e]" style={{width:`${buyPercent}%`}}></div>
            <div className="bg-[#ef4444]" style={{width:`${100-buyPercent}%`}}></div>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 mx-4 mb-3">
          <button className="flex items-center justify-center gap-2 py-3 bg-[#1c1c1f] rounded-2xl text-white font-medium hover:bg-[#252528]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
            Watchlist
          </button>
          <button className="flex items-center justify-center gap-2 py-3 bg-[#1c1c1f] rounded-2xl text-white font-medium hover:bg-[#252528]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
            Alerts
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mx-4 mb-4">
          <a href={`https://jup.ag/swap/SOL-${token.baseToken.address}`} target="_blank" rel="noopener noreferrer"
             className="flex items-center justify-center gap-2 py-3 bg-[#a3e635] rounded-2xl text-black font-bold hover:bg-[#bef264]">
            <span>⬆</span> Buy
          </a>
          <a href={`https://jup.ag/swap/${token.baseToken.address}-SOL`} target="_blank" rel="noopener noreferrer"
             className="flex items-center justify-center gap-2 py-3 bg-[#3f3f46] rounded-2xl text-white font-bold hover:bg-[#52525b]">
            <span>⬇</span> Sell
          </a>
        </div>

      </div>
    </div>
  );
}
