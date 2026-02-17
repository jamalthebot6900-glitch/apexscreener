'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL, ParsedAccountData } from '@solana/web3.js';

const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

export interface PortfolioToken {
  mint: string;
  balance: number;
  decimals: number;
  symbol?: string;
  name?: string;
  logo?: string;
  priceUsd?: number;
  valueUsd?: number;
  priceChange24h?: number;
}

export interface PortfolioData {
  solBalance: number;
  solValueUsd: number;
  tokens: PortfolioToken[];
  totalValueUsd: number;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

// Fetch token prices from DexScreener
async function fetchTokenPrices(mints: string[]): Promise<Map<string, { price: number; change24h: number; symbol: string; name: string; logo?: string }>> {
  const priceMap = new Map();
  
  // DexScreener allows batching up to 30 addresses
  const chunks = [];
  for (let i = 0; i < mints.length; i += 30) {
    chunks.push(mints.slice(i, i + 30));
  }
  
  for (const chunk of chunks) {
    try {
      const addresses = chunk.join(',');
      const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${addresses}`);
      if (!res.ok) continue;
      
      const data = await res.json();
      const pairs = data.pairs || [];
      
      for (const pair of pairs) {
        if (pair.chainId !== 'solana') continue;
        const mint = pair.baseToken?.address;
        if (!mint || priceMap.has(mint)) continue;
        
        priceMap.set(mint, {
          price: parseFloat(pair.priceUsd) || 0,
          change24h: pair.priceChange?.h24 || 0,
          symbol: pair.baseToken?.symbol || 'UNKNOWN',
          name: pair.baseToken?.name || 'Unknown Token',
          logo: pair.info?.imageUrl,
        });
      }
    } catch (err) {
      console.error('Error fetching token prices:', err);
    }
  }
  
  return priceMap;
}

// Fetch SOL price
async function fetchSolPrice(): Promise<number> {
  try {
    const res = await fetch('https://api.dexscreener.com/latest/dex/tokens/So11111111111111111111111111111111111111112');
    if (!res.ok) return 0;
    const data = await res.json();
    const pair = data.pairs?.find((p: any) => p.chainId === 'solana');
    return parseFloat(pair?.priceUsd) || 0;
  } catch {
    return 0;
  }
}

export function usePortfolio() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  
  const [portfolio, setPortfolio] = useState<PortfolioData>({
    solBalance: 0,
    solValueUsd: 0,
    tokens: [],
    totalValueUsd: 0,
    isLoading: false,
    error: null,
    lastUpdated: null,
  });

  const fetchPortfolio = useCallback(async () => {
    if (!publicKey || !connected) {
      setPortfolio(prev => ({
        ...prev,
        solBalance: 0,
        solValueUsd: 0,
        tokens: [],
        totalValueUsd: 0,
        isLoading: false,
        error: null,
      }));
      return;
    }

    setPortfolio(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Fetch SOL balance
      const solBalance = await connection.getBalance(publicKey);
      const solAmount = solBalance / LAMPORTS_PER_SOL;
      
      // Fetch SOL price
      const solPrice = await fetchSolPrice();
      const solValueUsd = solAmount * solPrice;

      // Fetch token accounts
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID }
      );

      // Parse token accounts
      const tokensWithBalance: PortfolioToken[] = [];
      const mints: string[] = [];

      for (const { account } of tokenAccounts.value) {
        const parsedData = account.data as ParsedAccountData;
        const info = parsedData.parsed?.info;
        if (!info) continue;

        const balance = parseFloat(info.tokenAmount?.uiAmountString || '0');
        if (balance <= 0) continue; // Skip zero balances

        const mint = info.mint;
        const decimals = info.tokenAmount?.decimals || 0;

        tokensWithBalance.push({
          mint,
          balance,
          decimals,
        });
        mints.push(mint);
      }

      // Fetch prices for all tokens
      const priceMap = await fetchTokenPrices(mints);

      // Enrich tokens with price data
      const enrichedTokens: PortfolioToken[] = tokensWithBalance.map(token => {
        const priceData = priceMap.get(token.mint);
        const priceUsd = priceData?.price || 0;
        const valueUsd = token.balance * priceUsd;

        return {
          ...token,
          symbol: priceData?.symbol,
          name: priceData?.name,
          logo: priceData?.logo,
          priceUsd,
          valueUsd,
          priceChange24h: priceData?.change24h,
        };
      });

      // Sort by value (highest first)
      enrichedTokens.sort((a, b) => (b.valueUsd || 0) - (a.valueUsd || 0));

      // Calculate total
      const tokenValueUsd = enrichedTokens.reduce((sum, t) => sum + (t.valueUsd || 0), 0);
      const totalValueUsd = solValueUsd + tokenValueUsd;

      setPortfolio({
        solBalance: solAmount,
        solValueUsd,
        tokens: enrichedTokens,
        totalValueUsd,
        isLoading: false,
        error: null,
        lastUpdated: Date.now(),
      });
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setPortfolio(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load portfolio',
      }));
    }
  }, [publicKey, connected, connection]);

  // Fetch on mount and when wallet changes
  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  return {
    ...portfolio,
    refresh: fetchPortfolio,
    isConnected: connected,
  };
}
