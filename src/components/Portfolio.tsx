'use client';

import { usePortfolio, PortfolioToken } from '@/hooks/usePortfolio';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { formatNumber, formatUsd } from '@/lib/utils';

function TokenRow({ token }: { token: PortfolioToken }) {
  const valueUsd = token.valueUsd || 0;
  const priceChange = token.priceChange24h || 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-[#1a1a1f] transition-colors border-b border-white/[0.04] last:border-b-0">
      {/* Token icon */}
      <div className="w-8 h-8 rounded-full bg-[#2a2a30] flex items-center justify-center overflow-hidden shrink-0">
        {token.logo ? (
          <img 
            src={token.logo} 
            alt={token.symbol} 
            className="w-8 h-8 rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = `<span class="text-[11px] font-bold text-[#888]">${(token.symbol || '?')[0]}</span>`;
            }}
          />
        ) : (
          <span className="text-[11px] font-bold text-[#888]">{(token.symbol || '?')[0]}</span>
        )}
      </div>

      {/* Token info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white text-[13px] truncate">
            {token.symbol || 'Unknown'}
          </span>
          {token.priceUsd !== undefined && token.priceUsd > 0 && (
            <span className="text-[11px] text-[#888]">
              ${token.priceUsd < 0.01 ? token.priceUsd.toExponential(2) : formatNumber(token.priceUsd)}
            </span>
          )}
        </div>
        <div className="text-[11px] text-[#666] truncate">
          {formatNumber(token.balance)} tokens
        </div>
      </div>

      {/* Value & change */}
      <div className="text-right shrink-0">
        <div className="font-semibold text-white text-[13px]">
          {valueUsd > 0 ? formatUsd(valueUsd) : '-'}
        </div>
        {token.priceChange24h !== undefined && (
          <div className={`text-[11px] font-medium ${isPositive ? 'text-[#00d395]' : 'text-[#ff6b6b]'}`}>
            {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
          </div>
        )}
      </div>
    </div>
  );
}

function SolRow({ balance, valueUsd }: { balance: number; valueUsd: number }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#9945ff]/10 to-[#14f195]/10 border-b border-white/[0.04]">
      {/* SOL icon */}
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9945ff] to-[#14f195] flex items-center justify-center shrink-0">
        <svg width="16" height="16" viewBox="0 0 128 128" fill="none">
          <path d="M25.1 96.6c0.9-0.9 2.2-1.5 3.5-1.5h92.4c2.2 0 3.3 2.7 1.8 4.2l-18.9 18.9c-0.9 0.9-2.2 1.5-3.5 1.5H8c-2.2 0-3.3-2.7-1.8-4.2L25.1 96.6z" fill="white"/>
          <path d="M25.1 8.3c1-0.9 2.2-1.5 3.5-1.5h92.4c2.2 0 3.3 2.7 1.8 4.2l-18.9 18.9c-0.9 0.9-2.2 1.5-3.5 1.5H8c-2.2 0-3.3-2.7-1.8-4.2L25.1 8.3z" fill="white"/>
          <path d="M102.9 52.2c-0.9-0.9-2.2-1.5-3.5-1.5H7c-2.2 0-3.3 2.7-1.8 4.2l18.9 18.9c0.9 0.9 2.2 1.5 3.5 1.5h92.4c2.2 0 3.3-2.7 1.8-4.2L102.9 52.2z" fill="white"/>
        </svg>
      </div>

      {/* SOL info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white text-[13px]">SOL</span>
          <span className="text-[11px] text-[#888]">Solana</span>
        </div>
        <div className="text-[11px] text-[#666]">
          {formatNumber(balance)} SOL
        </div>
      </div>

      {/* Value */}
      <div className="text-right shrink-0">
        <div className="font-semibold text-white text-[13px]">
          {formatUsd(valueUsd)}
        </div>
      </div>
    </div>
  );
}

function ConnectWalletPrompt() {
  const { setVisible } = useWalletModal();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9455ff]/20 to-[#7c3aed]/20 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-[#9455ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
        </svg>
      </div>
      <h3 className="text-white font-semibold text-[15px] mb-2">Connect Your Wallet</h3>
      <p className="text-[#888] text-[13px] text-center mb-4 max-w-xs">
        Connect your Solana wallet to view your portfolio and track your holdings
      </p>
      <button
        onClick={() => setVisible(true)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-semibold bg-gradient-to-r from-[#9455ff] to-[#7c3aed] text-white hover:from-[#a066ff] hover:to-[#8b5cf6] transition-all shadow-lg shadow-[#9455ff]/20"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        Connect Wallet
      </button>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-8 h-8 border-2 border-[#9455ff] border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-[#888] text-[13px]">Loading portfolio...</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-[#1e222d] flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
        </svg>
      </div>
      <h3 className="text-white font-semibold text-[15px] mb-2">No Holdings Found</h3>
      <p className="text-[#888] text-[13px] text-center max-w-xs">
        Your wallet doesn't have any SOL or tokens yet. Start trading to build your portfolio!
      </p>
    </div>
  );
}

export default function Portfolio() {
  const { connected } = useWallet();
  const portfolio = usePortfolio();

  if (!connected) {
    return <ConnectWalletPrompt />;
  }

  if (portfolio.isLoading) {
    return <LoadingState />;
  }

  if (portfolio.error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <p className="text-[#ff6b6b] text-[13px] mb-4">{portfolio.error}</p>
        <button
          onClick={portfolio.refresh}
          className="px-4 py-2 bg-[#1e222d] hover:bg-[#252830] rounded-lg text-[13px] text-white transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const hasHoldings = portfolio.solBalance > 0 || portfolio.tokens.length > 0;

  if (!hasHoldings) {
    return <EmptyState />;
  }

  // Filter tokens with meaningful value (> $0.01)
  const meaningfulTokens = portfolio.tokens.filter(t => (t.valueUsd || 0) >= 0.01);
  const dustTokens = portfolio.tokens.filter(t => (t.valueUsd || 0) < 0.01 && (t.valueUsd || 0) > 0);

  return (
    <div className="bg-[#131318] rounded-xl border border-white/[0.04] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-white/[0.04]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[#888] text-[12px] uppercase tracking-wide">Total Value</span>
          <button
            onClick={portfolio.refresh}
            className="p-1.5 hover:bg-[#1e222d] rounded-lg transition-colors"
            title="Refresh portfolio"
          >
            <svg className="w-4 h-4 text-[#888] hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        <div className="text-white text-[28px] font-bold">
          {formatUsd(portfolio.totalValueUsd)}
        </div>
        {portfolio.lastUpdated && (
          <div className="text-[11px] text-[#555] mt-1">
            Updated {new Date(portfolio.lastUpdated).toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Holdings */}
      <div>
        {/* SOL */}
        {portfolio.solBalance > 0 && (
          <SolRow balance={portfolio.solBalance} valueUsd={portfolio.solValueUsd} />
        )}

        {/* Tokens */}
        {meaningfulTokens.map((token) => (
          <TokenRow key={token.mint} token={token} />
        ))}

        {/* Dust tokens (collapsed) */}
        {dustTokens.length > 0 && (
          <details className="group">
            <summary className="px-4 py-2 text-[11px] text-[#666] cursor-pointer hover:text-[#888] transition-colors list-none flex items-center gap-1">
              <svg className="w-3 h-3 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              {dustTokens.length} dust tokens (&lt;$0.01)
            </summary>
            <div className="bg-[#0d0d0f]">
              {dustTokens.map((token) => (
                <TokenRow key={token.mint} token={token} />
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
