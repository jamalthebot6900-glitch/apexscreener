export interface Token {
  address: string;
  name: string;
  symbol: string;
  logo?: string;
  priceUsd: number;
  priceChange24h: number;
  priceChange1h: number;
  priceChange6h: number;
  priceChange5m: number;
  volume24h: number;
  liquidity: number;
  fdv: number;
  marketCap: number;
  pairAddress: string;
  pairCreatedAt: number;
  txns24h: {
    buys: number;
    sells: number;
    total: number;
  };
  makers: number;
  boosts?: number;
  dexId: string;
  chainId: string;
}

export interface PairData {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  txns: {
    m5: { buys: number; sells: number };
    h1: { buys: number; sells: number };
    h6: { buys: number; sells: number };
    h24: { buys: number; sells: number };
  };
  volume: {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
  };
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  liquidity: {
    usd: number;
    base: number;
    quote: number;
  };
  fdv: number;
  marketCap?: number;
  pairCreatedAt: number;
  boosts?: {
    active: number;
  };
  info?: {
    imageUrl?: string;
    header?: string;
    openGraph?: string;
    websites?: { label: string; url: string }[];
    socials?: { type: string; url: string }[];
  };
}

export interface OHLCData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export type TimeFrame = '5m' | '15m' | '1h' | '4h' | '1d';

export type SortField = 'volume24h' | 'priceChange24h' | 'priceChange1h' | 'priceChange6h' | 'priceChange5m' | 'liquidity' | 'pairCreatedAt' | 'marketCap' | 'txns24h' | 'makers';
export type SortDirection = 'asc' | 'desc';
