-- Apexscreener Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users table (token project owners)
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  wallet_address text unique not null,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Token profiles table (the core of our platform)
create table public.token_profiles (
  id uuid primary key default uuid_generate_v4(),
  token_address text unique not null,
  
  -- Basic info
  name text,
  symbol text,
  description text,
  
  -- Branding
  logo_url text,
  banner_url text,
  
  -- Social links
  website text,
  twitter text,
  telegram text,
  discord text,
  
  -- Ownership & verification
  claimed_by uuid references public.users(id),
  claimed_at timestamp with time zone,
  is_verified boolean default false,
  verification_type text, -- 'basic', 'premium', 'gold'
  
  -- Monetization
  is_promoted boolean default false,
  promotion_expires_at timestamp with time zone,
  boost_level integer default 0,
  
  -- Metadata
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Token claim requests (pending claims)
create table public.token_claims (
  id uuid primary key default uuid_generate_v4(),
  token_address text not null,
  user_id uuid references public.users(id) not null,
  wallet_signature text not null, -- Proof of ownership
  status text default 'pending', -- 'pending', 'approved', 'rejected'
  reviewed_at timestamp with time zone,
  reviewed_by uuid references public.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index idx_token_profiles_address on public.token_profiles(token_address);
create index idx_token_profiles_claimed on public.token_profiles(claimed_by);
create index idx_token_profiles_promoted on public.token_profiles(is_promoted) where is_promoted = true;
create index idx_token_claims_status on public.token_claims(status);

-- Row Level Security (RLS) policies
alter table public.users enable row level security;
alter table public.token_profiles enable row level security;
alter table public.token_claims enable row level security;

-- Users can read their own data
create policy "Users can view own profile" on public.users
  for select using (auth.uid()::text = id::text);

-- Anyone can view token profiles
create policy "Token profiles are viewable by everyone" on public.token_profiles
  for select using (true);

-- Only claimed owner can update their token profile
create policy "Token owners can update their profile" on public.token_profiles
  for update using (auth.uid()::text = claimed_by::text);

-- Authenticated users can create claims
create policy "Authenticated users can create claims" on public.token_claims
  for insert with check (auth.uid() is not null);

-- Users can view their own claims
create policy "Users can view own claims" on public.token_claims
  for select using (auth.uid()::text = user_id::text);

-- Storage bucket for images
-- Run this separately or create via Supabase dashboard:
-- insert into storage.buckets (id, name, public) values ('token-assets', 'token-assets', true);
