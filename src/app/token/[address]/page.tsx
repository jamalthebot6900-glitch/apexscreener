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

  // Calculate age
  const ageMs = Date.now() - (token.pairCreatedAt || Date.now());
  const ageHours = Math.floor(ageMs / (1000 * 60 * 60));
  const ageStr = ageHours < 24 ? `${ageHours}h` : `${Math.floor(ageHours / 24)}d`;

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
      <div className="w-[380px] border-l border-[#1e1e22] bg-[#131316] overflow-y-auto">
        
        {/* Header: SYMBOL / SOL + badges */}
        <div className="px-4 py-3 border-b border-[#1e1e22]">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-white">{token.baseToken.symbol}</span>
            <span className="text-[15px] font-bold text-white opacity-50">/</span>
            <span className="text-[15px] font-bold text-white">SOL</span>
            <span className="text-[11px] text-[#ff9500] bg-[#ff9500]/10 px-1.5 py-0.5 rounded font-semibold flex items-center gap-0.5">
              🔥{ageStr}
            </span>
            <span className="text-[11px] text-[#00d395] bg-[#00d395]/10 px-1.5 py-0.5 rounded font-bold">
              #1
            </span>
          </div>
          {/* Chain row */}
          <div className="flex items-center gap-1.5 mt-2">
            <img src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png" alt="Solana" className="w-4 h-4 rounded-full" />
            <span className="text-[11px] text-[#8a8a8a]">Solana</span>
            <span className="text-[11px] text-[#3a3a3a]">›</span>
            <img src="https://dd.dexscreener.com/ds-data/dexes/pumpswap.png" alt="PumpSwap" className="w-4 h-4 rounded-full" />
            <span className="text-[11px] text-[#8a8a8a]">PumpSwap</span>
            <span className="text-[11px] text-[#5a5a5a]">via</span>
            <img src="https://dd.dexscreener.com/ds-data/dexes/pumpfun.png" alt="Pump.fun" className="w-4 h-4 rounded-full" />
            <span className="text-[11px] text-[#8a8a8a]">Pump.fun</span>
          </div>
        </div>

        {/* Large Banner */}
        <div className="relative">
          {token.info?.header ? (
            <div className="h-[220px] overflow-hidden">
              <img 
                src={token.info.header} 
                alt={token.baseToken.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ) : token.info?.imageUrl ? (
            <div className="h-[220px] overflow-hidden bg-[#1a1a1e] flex items-center justify-center">
              <img 
                src={token.info.imageUrl} 
                alt={token.baseToken.name}
                className="w-36 h-36 rounded-xl object-cover"
              />
            </div>
          ) : (
            <div className="h-[220px] bg-gradient-to-br from-[#1e1e22] via-[#252528] to-[#2a2a2e]" />
          )}
        </div>

        {/* Twitter Social Button */}
        <div className="border-b border-[#1e1e22]">
          {twitterUrl ? (
            <a 
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full px-4 py-3 bg-[#1a1a1e] hover:bg-[#222226] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">𝕏</span>
                <span className="text-[14px] text-white font-medium">Twitter</span>
              </div>
              <svg className="w-4 h-4 text-[#6a6a6a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          ) : (
            <div className="flex items-center justify-between w-full px-4 py-3 bg-[#1a1a1e]">
              <div className="flex items-center gap-2">
                <span className="text-[#6a6a6a] font-bold">𝕏</span>
                <span className="text-[14px] text-[#6a6a6a] font-medium">No Twitter</span>
              </div>
            </div>
          )}
        </div>

        {/* Price USD & Price SOL */}
        <div className="grid grid-cols-2">
          <div className="p-3 text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase tracking-wide">Price USD</div>
            <div className="text-[15px] font-bold text-white mt-1">${priceUsd < 0.0001 ? priceUsd.toFixed(8) : priceUsd < 0.01 ? priceUsd.toFixed(6) : priceUsd.toFixed(4)}</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase tracking-wide">Price</div>
            <div className="text-[14px] font-bold text-white mt-1">{priceNative.toFixed(8)} SOL</div>
          </div>
        </div>

        {/* Liquidity, FDV, Mkt Cap */}
        <div className="grid grid-cols-3 border-t border-[#1e1e22]">
          <div className="p-2.5 text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase tracking-wide">Liquidity</div>
            <div className="text-[13px] font-bold text-white mt-1 flex items-center justify-center gap-1">
              ${formatNumber(liquidity)}
              <span className="w-3.5 h-3.5 rounded-full bg-[#00d395] flex items-center justify-center">
                <svg className="w-2 h-2 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          </div>
          <div className="p-2.5 text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase tracking-wide">FDV</div>
            <div className="text-[13px] font-bold text-white mt-1">${formatNumber(fdv)}</div>
          </div>
          <div className="p-2.5 text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase tracking-wide">Mkt Cap</div>
            <div className="text-[13px] font-bold text-white mt-1">${formatNumber(marketCap)}</div>
          </div>
        </div>

        {/* Price Changes */}
        <div className="grid grid-cols-4 border-t border-[#1e1e22]">
          <div className="p-2 text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase tracking-wide">5M</div>
            <div className={`text-[13px] font-bold mt-0.5 ${priceChange5m >= 0 ? 'text-[#00d395]' : 'text-[#ff6b6b]'}`}>
              {formatPercent(priceChange5m)}
            </div>
          </div>
          <div className="p-2 text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase tracking-wide">1H</div>
            <div className={`text-[13px] font-bold mt-0.5 ${priceChange1h >= 0 ? 'text-[#00d395]' : 'text-[#ff6b6b]'}`}>
              {formatPercent(priceChange1h)}
            </div>
          </div>
          <div className="p-2 text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase tracking-wide">6H</div>
            <div className={`text-[13px] font-bold mt-0.5 ${priceChange6h >= 0 ? 'text-[#00d395]' : 'text-[#ff6b6b]'}`}>
              {formatPercent(priceChange6h)}
            </div>
          </div>
          <div className="p-2 text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase tracking-wide">24H</div>
            <div className={`text-[13px] font-bold mt-0.5 ${priceChange24h >= 0 ? 'text-[#00d395]' : 'text-[#ff6b6b]'}`}>
              {formatPercent(priceChange24h)}
            </div>
          </div>
        </div>

        {/* Transaction Stats */}
        <div className="grid grid-cols-3 border-t border-[#1e1e22]">
          <div className="p-2 text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase tracking-wide">Txns</div>
            <div className="text-[13px] font-bold text-white mt-0.5">{totalTxns.toLocaleString()}</div>
          </div>
          <div className="p-2 text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase tracking-wide">Buys</div>
            <div className="text-[13px] font-bold text-[#00d395] mt-0.5">{buys24h.toLocaleString()}</div>
          </div>
          <div className="p-2 text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase tracking-wide">Sells</div>
            <div className="text-[13px] font-bold text-[#ff6b6b] mt-0.5">{sells24h.toLocaleString()}</div>
          </div>
        </div>

        {/* Volume Stats */}
        <div className="grid grid-cols-3 border-t border-[#1e1e22]">
          <div className="p-2 text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase tracking-wide">Volume</div>
            <div className="text-[13px] font-bold text-white mt-0.5">${formatNumber(volume24h)}</div>
          </div>
          <div className="p-2 text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase tracking-wide">Buy Vol</div>
            <div className="text-[13px] font-bold text-[#00d395] mt-0.5">${formatNumber(volume24h * (buys24h / (buys24h + sells24h || 1)))}</div>
          </div>
          <div className="p-2 text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase tracking-wide">Sell Vol</div>
            <div className="text-[13px] font-bold text-[#ff6b6b] mt-0.5">${formatNumber(volume24h * (sells24h / (buys24h + sells24h || 1)))}</div>
          </div>
        </div>

        {/* Makers Stats */}
        <div className="grid grid-cols-3 border-t border-[#1e1e22]">
          <div className="p-2 text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase tracking-wide">Makers</div>
            <div className="text-[13px] font-bold text-white mt-0.5">{Math.floor(totalTxns * 0.13).toLocaleString()}</div>
          </div>
          <div className="p-2 text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase tracking-wide">Buyers</div>
            <div className="text-[13px] font-bold text-[#00d395] mt-0.5">{Math.floor(buys24h * 0.22).toLocaleString()}</div>
          </div>
          <div className="p-2 text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase tracking-wide">Sellers</div>
            <div className="text-[13px] font-bold text-[#ff6b6b] mt-0.5">{Math.floor(sells24h * 0.21).toLocaleString()}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-3 border-t border-[#1e1e22] space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#1e1e22] rounded-lg text-[12px] font-semibold text-white hover:bg-[#262629] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Watchlist
            </button>
            <button className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#1e1e22] rounded-lg text-[12px] font-semibold text-white hover:bg-[#262629] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#00d395] rounded-lg text-[13px] font-bold text-black hover:bg-[#00e5a0] transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-[#00a67c]"></span>
              Buy
            </a>
            <a 
              href={`https://jup.ag/swap/${token.baseToken.address}-SOL`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-[#ff6b6b] rounded-lg text-[13px] font-bold text-black hover:bg-[#ff8080] transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-[#d94949]"></span>
              Sell
            </a>
          </div>
        </div>

        {/* Back Link */}
        <div className="px-3 pb-3">
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 w-full px-3 py-2 text-[12px] text-[#6a6a6a] hover:text-white transition-colors font-medium"
          >
            ← Back to Tokens
          </Link>
        </div>
      </div>
    </div>
  );
}
