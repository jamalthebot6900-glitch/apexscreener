'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { PairData } from '@/types';
import { fetchPairDetails } from '@/lib/api';
import { formatPrice, formatNumber, formatPercent, formatAddress, timeAgo, cn } from '@/lib/utils';

// Solana logo
function SolanaLogo() {
  return (
    <img 
      src="https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
      alt="Solana"
      className="w-5 h-5 rounded-full"
    />
  );
}

// PumpSwap logo
function PumpSwapLogo() {
  return (
    <img 
      src="https://dd.dexscreener.com/ds-data/dexes/pumpswap.png"
      alt="PumpSwap"
      className="w-5 h-5 rounded-full"
    />
  );
}

// Pump.fun logo
function PumpFunLogo() {
  return (
    <img 
      src="https://dd.dexscreener.com/ds-data/dexes/pumpfun.png"
      alt="Pump.fun"
      className="w-5 h-5 rounded-full"
    />
  );
}

// Stat box component
function StatBox({ label, value, color = 'white' }: { label: string; value: string; color?: 'white' | 'green' | 'red' }) {
  const colorClass = color === 'green' ? 'text-[#00d395]' : color === 'red' ? 'text-[#ff6b6b]' : 'text-white';
  return (
    <div className="text-center">
      <div className="text-[10px] text-[#6a6a6a] uppercase tracking-wide mb-1">{label}</div>
      <div className={`text-[14px] font-bold ${colorClass}`}>{value}</div>
    </div>
  );
}

// Info row component  
function InfoRow({ label, value, valueColor = 'white' }: { label: string; value: string; valueColor?: 'white' | 'green' | 'red' }) {
  const colorClass = valueColor === 'green' ? 'text-[#00d395]' : valueColor === 'red' ? 'text-[#ff6b6b]' : 'text-white';
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-[12px] text-[#6a6a6a] uppercase">{label}</span>
      <span className={`text-[13px] font-semibold ${colorClass}`}>{value}</span>
    </div>
  );
}

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

  // Calculate SOL price (approximate)
  const priceUsd = parseFloat(token.priceUsd) || 0;
  const solPrice = 86; // Approximate SOL price
  const priceSol = priceUsd / solPrice;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#0d0d0f]">
      {/* Left Side - Chart */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chart */}
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
      <div className="w-[320px] border-l border-[#1e1e22] bg-[#111114] overflow-y-auto">
        {/* Token Header */}
        <div className="p-4 border-b border-[#1e1e22]">
          {/* Token Name & Logo */}
          <div className="flex items-center gap-3 mb-3">
            {token.info?.imageUrl ? (
              <img 
                src={token.info.imageUrl} 
                alt={token.baseToken.symbol}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-[#1e1e22] flex items-center justify-center text-2xl font-bold text-white">
                {token.baseToken.symbol.charAt(0)}
              </div>
            )}
            <div>
              <div className="text-[18px] font-bold text-white">{token.baseToken.name}</div>
            </div>
          </div>

          {/* Symbol & Badges */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[15px] font-bold text-white">{token.baseToken.symbol}</span>
            <span className="text-[13px] text-[#6a6a6a]">/ SOL</span>
            <span className="text-[11px] text-[#00d395] bg-[#00d395]/10 px-1.5 py-0.5 rounded">
              {timeAgo(token.pairCreatedAt)}
            </span>
          </div>

          {/* Network Badges */}
          <div className="flex items-center gap-2 text-[12px] text-[#6a6a6a]">
            <SolanaLogo />
            <span>Solana</span>
            <span className="text-[#3a3a3a]">&gt;</span>
            <PumpSwapLogo />
            <span>PumpSwap</span>
            <span className="text-[#3a3a3a]">via</span>
            <PumpFunLogo />
            <span>Pump.fun</span>
          </div>
        </div>

        {/* Twitter Button */}
        {token.info?.socials?.find(s => s.type === 'twitter') && (
          <div className="px-4 py-2 border-b border-[#1e1e22]">
            <a 
              href={token.info.socials.find(s => s.type === 'twitter')?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full px-3 py-2 bg-[#1e1e22] rounded-lg hover:bg-[#2a2a2e] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-white">𝕏</span>
                <span className="text-[13px] text-white">Twitter</span>
              </div>
              <svg className="w-4 h-4 text-[#6a6a6a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        )}

        {/* Price Boxes */}
        <div className="grid grid-cols-2 gap-2 p-4 border-b border-[#1e1e22]">
          <div className="bg-[#1e1e22] rounded-lg p-3 text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase mb-1">Price USD</div>
            <div className="text-[16px] font-bold text-white">{formatPrice(priceUsd)}</div>
          </div>
          <div className="bg-[#1e1e22] rounded-lg p-3 text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase mb-1">Price</div>
            <div className="text-[14px] font-bold text-white">{priceSol.toFixed(8)} SOL</div>
          </div>
        </div>

        {/* Liquidity, FDV, Mkt Cap */}
        <div className="grid grid-cols-3 gap-2 p-4 border-b border-[#1e1e22]">
          <div className="text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase mb-1">Liquidity</div>
            <div className="text-[13px] font-bold text-white">${formatNumber(liquidity)}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase mb-1">FDV</div>
            <div className="text-[13px] font-bold text-white">${formatNumber(fdv)}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase mb-1">Mkt Cap</div>
            <div className="text-[13px] font-bold text-white">${formatNumber(marketCap)}</div>
          </div>
        </div>

        {/* Price Changes */}
        <div className="grid grid-cols-4 gap-2 p-4 border-b border-[#1e1e22]">
          <StatBox label="5M" value={formatPercent(priceChange5m)} color={priceChange5m >= 0 ? 'green' : 'red'} />
          <StatBox label="1H" value={formatPercent(priceChange1h)} color={priceChange1h >= 0 ? 'green' : 'red'} />
          <StatBox label="6H" value={formatPercent(priceChange6h)} color={priceChange6h >= 0 ? 'green' : 'red'} />
          <StatBox label="24H" value={formatPercent(priceChange24h)} color={priceChange24h >= 0 ? 'green' : 'red'} />
        </div>

        {/* Transaction Stats */}
        <div className="grid grid-cols-3 gap-2 p-4 border-b border-[#1e1e22]">
          <div className="text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase mb-1">Txns</div>
            <div className="text-[13px] font-bold text-white">{totalTxns.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase mb-1">Buys</div>
            <div className="text-[13px] font-bold text-[#00d395]">{buys24h.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase mb-1">Sells</div>
            <div className="text-[13px] font-bold text-[#ff6b6b]">{sells24h.toLocaleString()}</div>
          </div>
        </div>

        {/* Volume Stats */}
        <div className="grid grid-cols-3 gap-2 p-4 border-b border-[#1e1e22]">
          <div className="text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase mb-1">Volume</div>
            <div className="text-[13px] font-bold text-white">${formatNumber(volume24h)}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase mb-1">Buy Vol</div>
            <div className="text-[13px] font-bold text-[#00d395]">${formatNumber(volume24h * 0.52)}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-[#6a6a6a] uppercase mb-1">Sell Vol</div>
            <div className="text-[13px] font-bold text-[#ff6b6b]">${formatNumber(volume24h * 0.48)}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-2">
          {/* Watchlist & Alerts */}
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1e1e22] rounded-lg text-[13px] font-semibold text-white hover:bg-[#2a2a2e] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Watchlist
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1e1e22] rounded-lg text-[13px] font-semibold text-white hover:bg-[#2a2a2e] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Alerts
            </button>
          </div>

          {/* Buy & Sell */}
          <div className="grid grid-cols-2 gap-2">
            <a 
              href={`https://jup.ag/swap/SOL-${token.baseToken.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#00d395] rounded-lg text-[14px] font-bold text-black hover:bg-[#00e5a0] transition-colors"
            >
              <span>🟢</span> Buy
            </a>
            <a 
              href={`https://jup.ag/swap/${token.baseToken.address}-SOL`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#ff6b6b] rounded-lg text-[14px] font-bold text-black hover:bg-[#ff8080] transition-colors"
            >
              <span>🔴</span> Sell
            </a>
          </div>
        </div>

        {/* Back Link */}
        <div className="p-4 border-t border-[#1e1e22]">
          <Link 
            href="/"
            className="flex items-center justify-center gap-2 w-full px-4 py-2 text-[13px] text-[#6a6a6a] hover:text-white transition-colors"
          >
            ← Back to Tokens
          </Link>
        </div>
      </div>
    </div>
  );
}
