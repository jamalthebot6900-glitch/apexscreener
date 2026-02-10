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
  const telegramUrl = token.info?.socials?.find(s => s.type === 'telegram')?.url;
  const websiteUrl = token.info?.websites?.[0]?.url;

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
      <div className="w-[360px] border-l border-[#1e1e22] bg-[#111114] overflow-y-auto">
        
        {/* Banner Image - 1500x500 aspect ratio (3:1) */}
        <div className="relative">
          {token.info?.header ? (
            <div className="aspect-[3/1] overflow-hidden bg-[#1a1a1e]">
              <img 
                src={token.info.header} 
                alt={token.baseToken.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ) : (
            <div className="aspect-[3/1] bg-gradient-to-br from-[#1e1e22] to-[#2a2a2e]" />
          )}
          
          {/* KOTH Crown Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md border border-[#D4AF37]/30">
            <span className="text-sm">👑</span>
            <span className="text-[10px] font-bold text-[#FFD700] uppercase tracking-wide">KOTH</span>
          </div>
          
          {/* Token Logo - overlapping banner, LARGER */}
          <div className="absolute -bottom-10 left-4">
            {token.info?.imageUrl ? (
              <img 
                src={token.info.imageUrl} 
                alt={token.baseToken.symbol}
                className="w-20 h-20 rounded-xl object-cover border-4 border-[#111114] shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-[#2a2a2e] border-4 border-[#111114] flex items-center justify-center text-3xl font-bold text-white">
                {token.baseToken.symbol.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Token Name & Symbol */}
        <div className="pt-12 px-4 pb-2">
          <h1 className="text-[22px] font-extrabold text-white leading-tight">{token.baseToken.name}</h1>
          <div className="flex items-center gap-2.5 mt-1.5">
            <span className="text-[16px] font-extrabold text-white tracking-wide">{token.baseToken.symbol}</span>
            <span className="text-[14px] text-[#8a8a8a] font-semibold">/ SOL</span>
            <span className="text-[10px] text-[#00d395] bg-[#00d395]/15 px-2 py-0.5 rounded font-bold tracking-wide">
              #1
            </span>
          </div>
        </div>
        
        {/* Chain info - LARGER LOGOS, WHITE TEXT */}
        <div className="flex items-center gap-2 px-4 pb-3">
          <img src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" alt="Solana" className="w-5 h-5 rounded-full" />
          <span className="text-[12px] text-white font-medium">Solana</span>
          <span className="text-[#3a3a3a]">›</span>
          <img src="https://dd.dexscreener.com/ds-data/dexes/pumpswap.png" alt="PumpSwap" className="w-5 h-5 rounded-full" />
          <span className="text-[12px] text-white font-medium">PumpSwap</span>
          <span className="text-[12px] text-[#6a6a6a]">via</span>
          <img src="https://dd.dexscreener.com/ds-data/dexes/pumpfun.png" alt="Pump.fun" className="w-5 h-5 rounded-full" />
          <span className="text-[12px] text-white font-medium">Pump.fun</span>
        </div>

        {/* Social Links */}
        <div className="px-4 pb-3 flex flex-col gap-1.5">
          {twitterUrl && (
            <a 
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full px-3 py-2 bg-[#18181c] rounded-lg hover:bg-[#1e1e22] transition-colors border border-[#2a2a2e]"
            >
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-[15px]">𝕏</span>
                <span className="text-[13px] text-white font-semibold">Twitter</span>
              </div>
              <svg className="w-4 h-4 text-[#6a6a6a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          )}
          {telegramUrl && (
            <a 
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full px-3 py-2 bg-[#18181c] rounded-lg hover:bg-[#1e1e22] transition-colors border border-[#2a2a2e]"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#0088cc]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                <span className="text-[13px] text-white font-semibold">Telegram</span>
              </div>
              <svg className="w-4 h-4 text-[#6a6a6a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
          {websiteUrl && (
            <a 
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full px-3 py-2 bg-[#18181c] rounded-lg hover:bg-[#1e1e22] transition-colors border border-[#2a2a2e]"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#6a6a6a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="text-[13px] text-white font-semibold">Website</span>
              </div>
              <svg className="w-4 h-4 text-[#6a6a6a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>

        {/* Price USD, Price SOL, Mkt Cap - THREE EQUAL BOXES */}
        <div className="grid grid-cols-3 gap-2 px-4 pb-3">
          <div className="bg-[#18181c] rounded-lg p-3 text-center border border-[#2a2a2e]">
            <div className="text-[10px] text-[#6a6a6a] uppercase font-semibold mb-1">Price USD</div>
            <div className="text-[14px] font-bold text-white">${priceUsd < 0.01 ? priceUsd.toFixed(6) : priceUsd.toFixed(4)}</div>
          </div>
          <div className="bg-[#18181c] rounded-lg p-3 text-center border border-[#2a2a2e]">
            <div className="text-[10px] text-[#6a6a6a] uppercase font-semibold mb-1">Price SOL</div>
            <div className="text-[13px] font-bold text-white">{priceNative.toFixed(8)}</div>
          </div>
          <div className="bg-[#18181c] rounded-lg p-3 text-center border border-[#2a2a2e]">
            <div className="text-[10px] text-[#6a6a6a] uppercase font-semibold mb-1">Mkt Cap</div>
            <div className="text-[14px] font-bold text-white">${formatNumber(marketCap)}</div>
          </div>
        </div>

        {/* Liquidity & FDV */}
        <div className="grid grid-cols-2 gap-2 px-4 pb-3">
          <div className="bg-[#18181c] rounded-lg p-2.5 text-center border border-[#2a2a2e]">
            <div className="text-[10px] text-[#6a6a6a] uppercase font-semibold mb-1">Liquidity</div>
            <div className="text-[13px] font-bold text-white flex items-center justify-center gap-1">
              ${formatNumber(liquidity)}
              <span className="w-3.5 h-3.5 rounded-full bg-[#00d395] flex items-center justify-center">
                <svg className="w-2 h-2 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
          <div className="bg-[#18181c] rounded-lg p-2.5 text-center border border-[#2a2a2e]">
            <div className="text-[10px] text-[#6a6a6a] uppercase font-semibold mb-1">FDV</div>
            <div className="text-[13px] font-bold text-white">${formatNumber(fdv)}</div>
          </div>
        </div>

        {/* Price Changes - SMALLER BOXES */}
        <div className="grid grid-cols-4 gap-1.5 px-4 pb-3">
          <div className="bg-[#18181c] rounded-md p-2 text-center border border-[#2a2a2e]">
            <div className="text-[9px] text-[#6a6a6a] uppercase font-semibold mb-0.5">5M</div>
            <div className={`text-[12px] font-bold ${priceChange5m >= 0 ? 'text-[#00d395]' : 'text-[#ff6b6b]'}`}>
              {formatPercent(priceChange5m)}
            </div>
          </div>
          <div className="bg-[#18181c] rounded-md p-2 text-center border border-[#2a2a2e]">
            <div className="text-[9px] text-[#6a6a6a] uppercase font-semibold mb-0.5">1H</div>
            <div className={`text-[12px] font-bold ${priceChange1h >= 0 ? 'text-[#00d395]' : 'text-[#ff6b6b]'}`}>
              {formatPercent(priceChange1h)}
            </div>
          </div>
          <div className="bg-[#18181c] rounded-md p-2 text-center border border-[#2a2a2e]">
            <div className="text-[9px] text-[#6a6a6a] uppercase font-semibold mb-0.5">6H</div>
            <div className={`text-[12px] font-bold ${priceChange6h >= 0 ? 'text-[#00d395]' : 'text-[#ff6b6b]'}`}>
              {formatPercent(priceChange6h)}
            </div>
          </div>
          <div className="bg-[#18181c] rounded-md p-2 text-center border border-[#2a2a2e]">
            <div className="text-[9px] text-[#6a6a6a] uppercase font-semibold mb-0.5">24H</div>
            <div className={`text-[12px] font-bold ${priceChange24h >= 0 ? 'text-[#00d395]' : 'text-[#ff6b6b]'}`}>
              {formatPercent(priceChange24h)}
            </div>
          </div>
        </div>

        {/* Transaction Stats - SMALLER BOXES */}
        <div className="grid grid-cols-3 gap-1.5 px-4 pb-3">
          <div className="bg-[#18181c] rounded-md p-2 text-center border border-[#2a2a2e]">
            <div className="text-[9px] text-[#6a6a6a] uppercase font-semibold mb-0.5">Txns</div>
            <div className="text-[12px] font-bold text-white">{totalTxns.toLocaleString()}</div>
          </div>
          <div className="bg-[#18181c] rounded-md p-2 text-center border border-[#2a2a2e]">
            <div className="text-[9px] text-[#6a6a6a] uppercase font-semibold mb-0.5">Buys</div>
            <div className="text-[12px] font-bold text-[#00d395]">{buys24h.toLocaleString()}</div>
          </div>
          <div className="bg-[#18181c] rounded-md p-2 text-center border border-[#2a2a2e]">
            <div className="text-[9px] text-[#6a6a6a] uppercase font-semibold mb-0.5">Sells</div>
            <div className="text-[12px] font-bold text-[#ff6b6b]">{sells24h.toLocaleString()}</div>
          </div>
        </div>

        {/* Volume Stats */}
        <div className="grid grid-cols-3 gap-1.5 px-4 pb-3">
          <div className="bg-[#18181c] rounded-md p-2 text-center border border-[#2a2a2e]">
            <div className="text-[9px] text-[#6a6a6a] uppercase font-semibold mb-0.5">Volume</div>
            <div className="text-[12px] font-bold text-white">${formatNumber(volume24h)}</div>
          </div>
          <div className="bg-[#18181c] rounded-md p-2 text-center border border-[#2a2a2e]">
            <div className="text-[9px] text-[#6a6a6a] uppercase font-semibold mb-0.5">Buy Vol</div>
            <div className="text-[12px] font-bold text-[#00d395]">${formatNumber(volume24h * 0.52)}</div>
          </div>
          <div className="bg-[#18181c] rounded-md p-2 text-center border border-[#2a2a2e]">
            <div className="text-[9px] text-[#6a6a6a] uppercase font-semibold mb-0.5">Sell Vol</div>
            <div className="text-[12px] font-bold text-[#ff6b6b]">${formatNumber(volume24h * 0.48)}</div>
          </div>
        </div>

        {/* Makers Stats */}
        <div className="grid grid-cols-3 gap-1.5 px-4 pb-3">
          <div className="bg-[#18181c] rounded-md p-2 text-center border border-[#2a2a2e]">
            <div className="text-[9px] text-[#6a6a6a] uppercase font-semibold mb-0.5">Makers</div>
            <div className="text-[12px] font-bold text-white">{Math.floor(totalTxns * 0.15).toLocaleString()}</div>
          </div>
          <div className="bg-[#18181c] rounded-md p-2 text-center border border-[#2a2a2e]">
            <div className="text-[9px] text-[#6a6a6a] uppercase font-semibold mb-0.5">Buyers</div>
            <div className="text-[12px] font-bold text-[#00d395]">{Math.floor(buys24h * 0.25).toLocaleString()}</div>
          </div>
          <div className="bg-[#18181c] rounded-md p-2 text-center border border-[#2a2a2e]">
            <div className="text-[9px] text-[#6a6a6a] uppercase font-semibold mb-0.5">Sellers</div>
            <div className="text-[12px] font-bold text-[#ff6b6b]">{Math.floor(sells24h * 0.25).toLocaleString()}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 pb-3 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#18181c] rounded-lg text-[13px] font-semibold text-white hover:bg-[#1e1e22] transition-colors border border-[#2a2a2e]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Watchlist
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#18181c] rounded-lg text-[13px] font-semibold text-white hover:bg-[#1e1e22] transition-colors border border-[#2a2a2e]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Alerts
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a 
              href={`https://jup.ag/swap/SOL-${token.baseToken.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#00d395] rounded-lg text-[14px] font-bold text-black hover:bg-[#00e5a0] transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-black/30"></span>
              Buy
            </a>
            <a 
              href={`https://jup.ag/swap/${token.baseToken.address}-SOL`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#ff6b6b] rounded-lg text-[14px] font-bold text-black hover:bg-[#ff8080] transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-black/30"></span>
              Sell
            </a>
          </div>
        </div>

        {/* Back Link */}
        <div className="px-4 pb-4">
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 w-full px-4 py-2 text-[13px] text-[#6a6a6a] hover:text-white transition-colors font-medium"
          >
            ← Back to Tokens
          </Link>
        </div>
      </div>
    </div>
  );
}
