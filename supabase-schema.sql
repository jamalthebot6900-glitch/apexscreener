-- Apexscreener Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

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
  owner_id uuid references auth.users(id),
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

-- Indexes for performance
create index idx_token_profiles_address on public.token_profiles(token_address);
create index idx_token_profiles_owner on public.token_profiles(owner_id);
create index idx_token_profiles_promoted on public.token_profiles(is_promoted) where is_promoted = true;

-- Row Level Security (RLS) policies
alter table public.token_profiles enable row level security;

-- Anyone can view token profiles
create policy "Token profiles are viewable by everyone" on public.token_profiles
  for select using (true);

-- Owners can update their token profile
create policy "Token owners can update their profile" on public.token_profiles
  for update using (auth.uid() = owner_id);

-- Authenticated users can insert (claim) token profiles
create policy "Authenticated users can claim tokens" on public.token_profiles
  for insert with check (auth.uid() is not null);
