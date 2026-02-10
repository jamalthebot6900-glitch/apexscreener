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
      <div className="flex items-center justify-center h-screen bg-[#0d0d0f]">
        <div className="text-[#6a6a6a]">Loading...</div>
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0d0d0f]">
        <div className="text-[#6a6a6a] mb-4">{error || 'Token not found'}</div>
        <Link href="/" className="text-[#4752c4] hover:underline">← Back to Home</Link>
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

  // Calculate age
  const ageMs = Date.now() - (token.pairCreatedAt || Date.now());
  const ageHours = Math.floor(ageMs / (1000 * 60 * 60));
  const ageStr = ageHours < 24 ? `${ageHours}h` : `${Math.floor(ageHours / 24)}d`;

  // Progress percentages
  const buyPercent = totalTxns > 0 ? (buys24h / totalTxns) * 100 : 50;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#0d0d0f]">
      {/* Left Side - Chart */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1">
          <iframe
            src={`https://dexscreener.com/solana/${token.pairAddress}?embed=1&theme=dark&trades=0&info=0`}
            className="w-full h-full border-none"
            title="Chart"
            allow="clipboard-write"
          />
        </div>
        
        {/* Transactions Table */}
        <div className="h-[250px] border-t border-[#1e1e22] overflow-auto">
          <div className="flex items-center gap-4 px-4 py-2 border-b border-[#1e1e22] bg-[#111114]">
            <button className="text-[13px] font-semibold text-white border-b-2 border-[#4752c4] pb-1">Transactions</button>
            <button className="text-[13px] text-[#6a6a6a] hover:text-white">Top Traders</button>
            <button className="text-[13px] text-[#6a6a6a] hover:text-white">Holders</button>
          </div>
          <div className="text-center py-8 text-[#6a6a6a] text-[13px]">
            Transaction data coming soon
          </div>
        </div>
      </div>

      {/* Right Side - Token Info Panel */}
      <div className="w-[400px] border-l border-[#1e1e22] bg-[#0c0c0e] overflow-y-auto flex flex-col">
        
        {/* Header: Square Logo + Name + KOTH */}
        <div className="flex items-center gap-3 px-4 py-4">
          {token.info?.imageUrl ? (
            <img src={token.info.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-[#333] flex items-center justify-center text-white font-bold text-xl">
              {token.baseToken.symbol.charAt(0)}
            </div>
          )}
          <span className="text-[20px] font-semibold text-white flex-1">{token.baseToken.name}</span>
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#2a2a2e]">
            <span className="text-base">👑</span>
            <span className="text-[11px] font-bold text-[#FFD700]">KOTH</span>
          </div>
        </div>

        {/* Ticker Row: GIRAFFES / SOL + age + #1 (no boxes) */}
        <div className="flex items-center gap-2 px-4 pb-4">
          <span className="text-[18px] font-bold text-white">{token.baseToken.symbol}</span>
          <span className="text-[18px] font-bold text-white">/</span>
          <span className="text-[18px] font-bold text-white">SOL</span>
          <span className="text-[14px] text-[#a78bfa] font-medium ml-2">🚀{ageStr}</span>
          <span className="text-[14px] text-[#f97316] font-medium">🔥#1</span>
        </div>

        {/* Banner - Full Width, No Gap */}
        {token.info?.header && (
          <img 
            src={token.info.header} 
            alt={token.baseToken.name}
            className="w-full"
          />
        )}

        {/* Twitter Button - Directly Under Banner (no gap) */}
        <a 
          href={twitterUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3.5 bg-[#18181b] hover:bg-[#1f1f23] transition-colors border-b border-[#2a2a2e]"
        >
          <span className="text-white font-bold text-lg">𝕏</span>
          <span className="text-[15px] text-white font-medium">Twitter</span>
          <svg className="w-5 h-5 text-[#666] ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </a>

        {/* Price USD & Price SOL */}
        <div className="grid grid-cols-2 gap-3 p-4">
          <div className="bg-[#18181b] rounded-xl p-4">
            <div className="text-[11px] text-[#666] uppercase tracking-wider text-center mb-2">Price USD</div>
            <div className="text-[20px] font-bold text-white text-center">${priceUsd < 0.0001 ? priceUsd.toFixed(8) : priceUsd < 0.01 ? priceUsd.toFixed(6) : priceUsd.toFixed(4)}</div>
          </div>
          <div className="bg-[#18181b] rounded-xl p-4">
            <div className="text-[11px] text-[#666] uppercase tracking-wider text-center mb-2">Price</div>
            <div className="text-[18px] font-bold text-white text-center">{priceNative.toFixed(8)} SOL</div>
          </div>
        </div>

        {/* Liquidity / FDV / MKT CAP */}
        <div className="grid grid-cols-3 gap-2 px-4 pb-4">
          <div className="bg-[#18181b] rounded-xl p-3">
            <div className="text-[10px] text-[#666] uppercase tracking-wider text-center mb-1">Liquidity</div>
            <div className="text-[15px] font-bold text-white text-center flex items-center justify-center gap-1">
              ${formatNumber(liquidity)}
              <span className="text-[#22c55e]">🔒</span>
            </div>
          </div>
          <div className="bg-[#18181b] rounded-xl p-3">
            <div className="text-[10px] text-[#666] uppercase tracking-wider text-center mb-1">FDV</div>
            <div className="text-[15px] font-bold text-white text-center">${formatNumber(fdv)}</div>
          </div>
          <div className="bg-[#18181b] rounded-xl p-3">
            <div className="text-[10px] text-[#666] uppercase tracking-wider text-center mb-1">Mkt Cap</div>
            <div className="text-[15px] font-bold text-white text-center">${formatNumber(marketCap)}</div>
          </div>
        </div>

        {/* Price Changes - 5M, 1H, 6H, 24H */}
        <div className="grid grid-cols-4 gap-2 px-4 pb-4">
          <div className="bg-[#18181b] rounded-xl p-3">
            <div className="text-[10px] text-[#666] uppercase text-center mb-1">5M</div>
            <div className={`text-[14px] font-bold text-center ${priceChange5m >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
              {formatPercent(priceChange5m)}
            </div>
          </div>
          <div className="bg-[#18181b] rounded-xl p-3">
            <div className="text-[10px] text-[#666] uppercase text-center mb-1">1H</div>
            <div className={`text-[14px] font-bold text-center ${priceChange1h >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
              {formatPercent(priceChange1h)}
            </div>
          </div>
          <div className="bg-[#18181b] rounded-xl p-3">
            <div className="text-[10px] text-[#666] uppercase text-center mb-1">6H</div>
            <div className={`text-[14px] font-bold text-center ${priceChange6h >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
              {formatPercent(priceChange6h)}
            </div>
          </div>
          <div className="bg-[#18181b] rounded-xl p-3 ring-2 ring-[#444]">
            <div className="text-[10px] text-[#666] uppercase text-center mb-1">24H</div>
            <div className={`text-[14px] font-bold text-center ${priceChange24h >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
              {formatPercent(priceChange24h)}
            </div>
          </div>
        </div>

        {/* TXNS / BUYS / SELLS */}
        <div className="grid grid-cols-3 gap-2 px-4 pb-2">
          <div className="bg-[#18181b] rounded-xl p-3">
            <div className="text-[10px] text-[#666] uppercase tracking-wider mb-1">Txns</div>
            <div className="text-[16px] font-bold text-white">{totalTxns.toLocaleString()}</div>
          </div>
          <div className="bg-[#18181b] rounded-xl p-3">
            <div className="text-[10px] text-[#666] uppercase tracking-wider mb-1">Buys</div>
            <div className="text-[16px] font-bold text-[#22c55e]">{buys24h.toLocaleString()}</div>
          </div>
          <div className="bg-[#18181b] rounded-xl p-3">
            <div className="text-[10px] text-[#666] uppercase tracking-wider mb-1">Sells</div>
            <div className="text-[16px] font-bold text-[#ef4444]">{sells24h.toLocaleString()}</div>
          </div>
        </div>
        {/* Single Progress Bar for Buys vs Sells */}
        <div className="flex h-2 mx-4 mb-4 rounded-full overflow-hidden">
          <div className="bg-[#22c55e] h-full transition-all" style={{ width: `${buyPercent}%` }}></div>
          <div className="bg-[#ef4444] h-full transition-all" style={{ width: `${100 - buyPercent}%` }}></div>
        </div>

        {/* VOLUME / BUY VOL / SELL VOL */}
        <div className="grid grid-cols-3 gap-2 px-4 pb-2">
          <div className="bg-[#18181b] rounded-xl p-3">
            <div className="text-[10px] text-[#666] uppercase tracking-wider mb-1">Volume</div>
            <div className="text-[16px] font-bold text-white">${formatNumber(volume24h)}</div>
          </div>
          <div className="bg-[#18181b] rounded-xl p-3">
            <div className="text-[10px] text-[#666] uppercase tracking-wider mb-1">Buy Vol</div>
            <div className="text-[16px] font-bold text-[#22c55e]">${formatNumber(volume24h * (buys24h / (totalTxns || 1)))}</div>
          </div>
          <div className="bg-[#18181b] rounded-xl p-3">
            <div className="text-[10px] text-[#666] uppercase tracking-wider mb-1">Sell Vol</div>
            <div className="text-[16px] font-bold text-[#ef4444]">${formatNumber(volume24h * (sells24h / (totalTxns || 1)))}</div>
          </div>
        </div>
        <div className="flex h-2 mx-4 mb-4 rounded-full overflow-hidden">
          <div className="bg-[#22c55e] h-full transition-all" style={{ width: `${buyPercent}%` }}></div>
          <div className="bg-[#ef4444] h-full transition-all" style={{ width: `${100 - buyPercent}%` }}></div>
        </div>

        {/* MAKERS / BUYERS / SELLERS */}
        <div className="grid grid-cols-3 gap-2 px-4 pb-2">
          <div className="bg-[#18181b] rounded-xl p-3">
            <div className="text-[10px] text-[#666] uppercase tracking-wider mb-1">Makers</div>
            <div className="text-[16px] font-bold text-white">{Math.floor(totalTxns * 0.13).toLocaleString()}</div>
          </div>
          <div className="bg-[#18181b] rounded-xl p-3">
            <div className="text-[10px] text-[#666] uppercase tracking-wider mb-1">Buyers</div>
            <div className="text-[16px] font-bold text-[#22c55e]">{Math.floor(buys24h * 0.22).toLocaleString()}</div>
          </div>
          <div className="bg-[#18181b] rounded-xl p-3">
            <div className="text-[10px] text-[#666] uppercase tracking-wider mb-1">Sellers</div>
            <div className="text-[16px] font-bold text-[#ef4444]">{Math.floor(sells24h * 0.21).toLocaleString()}</div>
          </div>
        </div>
        <div className="flex h-2 mx-4 mb-4 rounded-full overflow-hidden">
          <div className="bg-[#22c55e] h-full transition-all" style={{ width: `${buyPercent}%` }}></div>
          <div className="bg-[#ef4444] h-full transition-all" style={{ width: `${100 - buyPercent}%` }}></div>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Watchlist & Alerts */}
        <div className="grid grid-cols-2 gap-3 px-4 pb-3">
          <button className="flex items-center justify-center gap-2 px-4 py-3.5 bg-[#18181b] rounded-xl text-[15px] font-semibold text-white hover:bg-[#222] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
            Watchlist
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3.5 bg-[#18181b] rounded-xl text-[15px] font-semibold text-white hover:bg-[#222] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            Alerts
          </button>
        </div>

        {/* Buy / Sell */}
        <div className="grid grid-cols-2 gap-3 px-4 pb-4">
          <a 
            href={`https://jup.ag/swap/SOL-${token.baseToken.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3.5 bg-[#22c55e]/10 rounded-xl text-[15px] font-bold text-[#22c55e] hover:bg-[#22c55e]/20 transition-colors"
          >
            <span>⬆</span>
            Buy
          </a>
          <a 
            href={`https://jup.ag/swap/${token.baseToken.address}-SOL`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3.5 bg-[#ef4444]/10 rounded-xl text-[15px] font-bold text-[#ef4444] hover:bg-[#ef4444]/20 transition-colors"
          >
            <span>⬇</span>
            Sell
          </a>
        </div>

      </div>
    </div>
  );
}
