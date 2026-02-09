import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface User {
  id: string;
  wallet_address: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface TokenProfile {
  id: string;
  token_address: string;
  name?: string;
  symbol?: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  discord?: string;
  claimed_by?: string;
  claimed_at?: string;
  is_verified: boolean;
  verification_type?: 'basic' | 'premium' | 'gold';
  is_promoted: boolean;
  promotion_expires_at?: string;
  boost_level: number;
  created_at: string;
  updated_at: string;
}

export interface TokenClaim {
  id: string;
  token_address: string;
  user_id: string;
  wallet_signature: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_at?: string;
  reviewed_by?: string;
  created_at: string;
}

// Database helper functions
export async function getTokenProfile(tokenAddress: string): Promise<TokenProfile | null> {
  const { data, error } = await supabase
    .from('token_profiles')
    .select('*')
    .eq('token_address', tokenAddress)
    .single();
  
  if (error || !data) return null;
  return data;
}

export async function getOrCreateTokenProfile(tokenAddress: string, name?: string, symbol?: string): Promise<TokenProfile> {
  // Try to get existing profile
  const existing = await getTokenProfile(tokenAddress);
  if (existing) return existing;
  
  // Create new profile
  const { data, error } = await supabase
    .from('token_profiles')
    .insert({
      token_address: tokenAddress,
      name,
      symbol,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateTokenProfile(
  tokenAddress: string, 
  updates: Partial<TokenProfile>
): Promise<TokenProfile | null> {
  const { data, error } = await supabase
    .from('token_profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('token_address', tokenAddress)
    .select()
    .single();
  
  if (error) return null;
  return data;
}

export async function getPromotedTokens(): Promise<TokenProfile[]> {
  const { data, error } = await supabase
    .from('token_profiles')
    .select('*')
    .eq('is_promoted', true)
    .gte('promotion_expires_at', new Date().toISOString())
    .order('boost_level', { ascending: false });
  
  if (error) return [];
  return data || [];
}

export async function getVerifiedTokens(): Promise<TokenProfile[]> {
  const { data, error } = await supabase
    .from('token_profiles')
    .select('*')
    .eq('is_verified', true)
    .order('updated_at', { ascending: false });
  
  if (error) return [];
  return data || [];
}

// User functions
export async function getOrCreateUser(walletAddress: string): Promise<User> {
  // Try to get existing user
  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();
  
  if (existing) return existing;
  
  // Create new user
  const { data, error } = await supabase
    .from('users')
    .insert({ wallet_address: walletAddress })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Claim functions
export async function createTokenClaim(
  tokenAddress: string,
  userId: string,
  walletSignature: string
): Promise<TokenClaim> {
  const { data, error } = await supabase
    .from('token_claims')
    .insert({
      token_address: tokenAddress,
      user_id: userId,
      wallet_signature: walletSignature,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getUserClaims(userId: string): Promise<TokenClaim[]> {
  const { data, error } = await supabase
    .from('token_claims')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) return [];
  return data || [];
}

// Image upload
export async function uploadTokenImage(
  tokenAddress: string,
  file: File,
  type: 'logo' | 'banner'
): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${tokenAddress}/${type}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from('token-assets')
    .upload(fileName, file, { upsert: true });
  
  if (error) return null;
  
  const { data } = supabase.storage
    .from('token-assets')
    .getPublicUrl(fileName);
  
  return data.publicUrl;
}
