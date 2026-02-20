import { OHLCData, TimeFrame } from '@/types';

const BIRDEYE_API_BASE = 'https://public-api.birdeye.so';

// Map timeframe to Birdeye interval
const timeframeToInterval: Record<TimeFrame, string> = {
  '5m': '5m',
  '15m': '15m',
  '1h': '1H',
  '4h': '4H',
  '1d': '1D',
};

// Calculate time range for timeframe
function getTimeRange(timeframe: TimeFrame): { from: number; to: number } {
  const now = Math.floor(Date.now() / 1000);
  const ranges: Record<TimeFrame, number> = {
    '5m': 24 * 60 * 60,      // 24 hours of 5m candles
    '15m': 3 * 24 * 60 * 60, // 3 days
    '1h': 7 * 24 * 60 * 60,  // 7 days
    '4h': 30 * 24 * 60 * 60, // 30 days
    '1d': 90 * 24 * 60 * 60, // 90 days
  };
  
  return {
    from: now - ranges[timeframe],
    to: now,
  };
}

/**
 * Fetch OHLC candlestick data from Birdeye
 * Requires BIRDEYE_API_KEY environment variable
 */
export async function fetchOHLCData(
  tokenAddress: string,
  timeframe: TimeFrame = '1h'
): Promise<OHLCData[]> {
  const apiKey = process.env.NEXT_PUBLIC_BIRDEYE_API_KEY;
  
  if (!apiKey) {
    console.warn('Birdeye API key not configured, returning mock data');
    return generateMockOHLC(timeframe);
  }

  try {
    const interval = timeframeToInterval[timeframe];
    const { from, to } = getTimeRange(timeframe);
    
    const url = new URL(`${BIRDEYE_API_BASE}/defi/ohlcv`);
    url.searchParams.set('address', tokenAddress);
    url.searchParams.set('type', interval);
    url.searchParams.set('time_from', from.toString());
    url.searchParams.set('time_to', to.toString());

    const res = await fetch(url.toString(), {
      headers: {
        'X-API-KEY': apiKey,
        'x-chain': 'solana',
      },
      next: { revalidate: 60 }, // Cache for 1 minute
    });

    if (!res.ok) {
      throw new Error(`Birdeye API error: ${res.status}`);
    }

    const data = await res.json();
    
    if (!data.data?.items) {
      return generateMockOHLC(timeframe);
    }

    return data.data.items.map((item: any) => ({
      time: item.unixTime,
      open: item.o,
      high: item.h,
      low: item.l,
      close: item.c,
    }));
  } catch (error) {
    console.error('Failed to fetch OHLC data:', error);
    return generateMockOHLC(timeframe);
  }
}

/**
 * Fetch token holder statistics
 */
export async function fetchHolderStats(tokenAddress: string): Promise<HolderStats | null> {
  const apiKey = process.env.NEXT_PUBLIC_BIRDEYE_API_KEY;
  
  if (!apiKey) {
    // Use Solana RPC fallback for basic holder count
    return fetchHolderStatsRPC(tokenAddress);
  }

  try {
    const res = await fetch(`${BIRDEYE_API_BASE}/defi/token_holder_stat?address=${tokenAddress}`, {
      headers: {
        'X-API-KEY': apiKey,
        'x-chain': 'solana',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      return fetchHolderStatsRPC(tokenAddress);
    }

    const data = await res.json();
    
    return {
      totalHolders: data.data?.holder || 0,
      top10Percentage: data.data?.top10Percent || 0,
      top20Percentage: data.data?.top20Percent || 0,
      top50Percentage: data.data?.top50Percent || 0,
      top100Percentage: data.data?.top100Percent || 0,
    };
  } catch (error) {
    console.error('Failed to fetch holder stats:', error);
    return fetchHolderStatsRPC(tokenAddress);
  }
}

/**
 * Fetch top token holders
 */
export async function fetchTopHolders(tokenAddress: string, limit: number = 10): Promise<TokenHolder[]> {
  const apiKey = process.env.NEXT_PUBLIC_BIRDEYE_API_KEY;
  
  if (!apiKey) {
    return [];
  }

  try {
    const res = await fetch(
      `${BIRDEYE_API_BASE}/defi/token_holder?address=${tokenAddress}&offset=0&limit=${limit}`,
      {
        headers: {
          'X-API-KEY': apiKey,
          'x-chain': 'solana',
        },
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    
    return (data.data?.items || []).map((item: any, index: number) => ({
      rank: index + 1,
      address: item.owner,
      balance: item.uiAmount || 0,
      percentage: item.percent || 0,
      valueUsd: item.valueUsd || 0,
    }));
  } catch (error) {
    console.error('Failed to fetch top holders:', error);
    return [];
  }
}

/**
 * Fetch token security info
 */
export async function fetchTokenSecurity(tokenAddress: string): Promise<TokenSecurity | null> {
  const apiKey = process.env.NEXT_PUBLIC_BIRDEYE_API_KEY;
  
  if (!apiKey) {
    return null;
  }

  try {
    const res = await fetch(`${BIRDEYE_API_BASE}/defi/token_security?address=${tokenAddress}`, {
      headers: {
        'X-API-KEY': apiKey,
        'x-chain': 'solana',
      },
      next: { revalidate: 600 }, // Cache for 10 minutes
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    const security = data.data;
    
    return {
      isVerified: security?.isVerified || false,
      isMintable: security?.isMintable || false,
      isFreezable: security?.isFreezable || false,
      ownerAddress: security?.ownerAddress,
      creationTime: security?.creationTime,
      creatorAddress: security?.creatorAddress,
      metadataUpdateAuthority: security?.metadataUpdateAuthority,
    };
  } catch (error) {
    console.error('Failed to fetch token security:', error);
    return null;
  }
}

// Types
export interface HolderStats {
  totalHolders: number;
  top10Percentage: number;
  top20Percentage: number;
  top50Percentage: number;
  top100Percentage: number;
}

export interface TokenHolder {
  rank: number;
  address: string;
  balance: number;
  percentage: number;
  valueUsd: number;
}

export interface TokenSecurity {
  isVerified: boolean;
  isMintable: boolean;
  isFreezable: boolean;
  ownerAddress?: string;
  creationTime?: number;
  creatorAddress?: string;
  metadataUpdateAuthority?: string;
}

// Fallback: Fetch holder count from Solana RPC
async function fetchHolderStatsRPC(tokenAddress: string): Promise<HolderStats | null> {
  try {
    // Use Helius or public RPC to get token accounts
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenLargestAccounts',
        params: [tokenAddress],
      }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    const accounts = data.result?.value || [];
    
    if (accounts.length === 0) return null;

    // Calculate rough concentration from top 10 accounts
    const totalFromTop10 = accounts.slice(0, 10).reduce(
      (sum: number, acc: any) => sum + parseFloat(acc.uiAmount || '0'),
      0
    );

    return {
      totalHolders: 0, // Can't get total from this endpoint
      top10Percentage: 0, // Would need total supply to calculate
      top20Percentage: 0,
      top50Percentage: 0,
      top100Percentage: 0,
    };
  } catch (error) {
    console.error('RPC holder fetch failed:', error);
    return null;
  }
}

// Generate mock OHLC data for development
function generateMockOHLC(timeframe: TimeFrame): OHLCData[] {
  const now = Math.floor(Date.now() / 1000);
  const intervals: Record<TimeFrame, number> = {
    '5m': 5 * 60,
    '15m': 15 * 60,
    '1h': 60 * 60,
    '4h': 4 * 60 * 60,
    '1d': 24 * 60 * 60,
  };
  
  const interval = intervals[timeframe];
  const numCandles = 100;
  const data: OHLCData[] = [];
  
  let price = 0.00001 + Math.random() * 0.0001; // Random starting price
  
  for (let i = numCandles - 1; i >= 0; i--) {
    const time = now - (i * interval);
    const volatility = 0.05 + Math.random() * 0.1;
    const change = (Math.random() - 0.5) * 2 * volatility;
    
    const open = price;
    price *= (1 + change);
    const close = price;
    
    const high = Math.max(open, close) * (1 + Math.random() * 0.03);
    const low = Math.min(open, close) * (1 - Math.random() * 0.03);
    
    data.push({ time, open, high, low, close });
  }
  
  return data;
}
