'use client';

import Link from 'next/link';
import { Token } from '@/types';
import { formatPrice, formatNumber, formatPercent, timeAgo, cn } from '@/lib/utils';

interface TokenCardProps {
  token: Token;
  showAge?: boolean;
}

export default function TokenCard({ token, showAge = false }: TokenCardProps) {
  const isPositive = token.priceChange24h >= 0;

  return (
    <Link
      href={`/token/${token.address}`}
      className="block bg-surface hover:bg-surface-light border border-border rounded-lg p-4 transition-all hover:border-border-light"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {token.logo ? (
            <img
              src={token.logo}
              alt={token.symbol}
              className="w-10 h-10 rounded-full bg-surface-light"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-surface-light flex items-center justify-center text-text-secondary font-semibold text-sm">
              {token.symbol.slice(0, 2)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-text-primary">{token.symbol}</h3>
              <span className="text-2xs text-text-muted px-1.5 py-0.5 rounded bg-surface-light">
                {token.dexId}
              </span>
            </div>
            <p className="text-xs text-text-muted truncate max-w-[120px]">
              {token.name}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono font-semibold text-text-primary text-sm">
            {formatPrice(token.priceUsd)}
          </p>
          <p
            className={cn(
              'text-xs font-medium',
              isPositive ? 'text-positive' : 'text-negative'
            )}
          >
            {formatPercent(token.priceChange24h)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <p className="text-text-muted">Vol 24h</p>
          <p className="text-text-primary font-medium">
            ${formatNumber(token.volume24h)}
          </p>
        </div>
        <div>
          <p className="text-text-muted">Liq</p>
          <p className="text-text-primary font-medium">
            ${formatNumber(token.liquidity)}
          </p>
        </div>
        <div>
          <p className="text-text-muted">{showAge ? 'Age' : 'FDV'}</p>
          <p className="text-text-primary font-medium">
            {showAge ? timeAgo(token.pairCreatedAt) : '$' + formatNumber(token.fdv)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-2xs text-text-muted">
        <div className="flex items-center gap-1">
          <span className="text-positive">{token.txns24h.buys}</span>
          <span>/</span>
          <span className="text-negative">{token.txns24h.sells}</span>
          <span className="ml-1">txns</span>
        </div>
      </div>
    </Link>
  );
}
