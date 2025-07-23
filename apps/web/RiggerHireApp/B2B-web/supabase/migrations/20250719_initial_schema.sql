-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Create businesses table
create table public.businesses (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    email text not null unique,
    phone text not null,
    industry text not null,
    address text,
    verified boolean default false,
    subscription_tier text default 'free',
    constraint subscription_tier_check check (subscription_tier in ('free', 'premium', 'enterprise'))
);

-- Create staff_profiles table
create table public.staff_profiles (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    full_name text not null,
    email text not null unique,
    phone text not null,
    location text not null,
    experience_years integer not null,
    certifications text[] default array[]::text[],
    skills text[] default array[]::text[],
    availability text default 'available',
    verified boolean default false,
    constraint availability_check check (availability in ('available', 'unavailable', 'contract'))
);

-- Create jobs table
create table public.jobs (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    business_id uuid references public.businesses(id) on delete cascade not null,
    title text not null,
    description text not null,
    location text not null,
    type text not null,
    salary_range text,
    requirements text[] default array[]::text[],
    status text default 'open',
    expires_at timestamp with time zone not null,
    constraint status_check check (status in ('open', 'filled', 'closed')),
    constraint type_check check (type in ('full-time', 'part-time', 'contract', 'casual'))
);

-- Create RLS policies
alter table public.businesses enable row level security;
alter table public.staff_profiles enable row level security;
alter table public.jobs enable row level security;

-- Businesses policies
create policy "Businesses are viewable by all"
    on businesses for select
    to authenticated
    using (true);

create policy "Businesses can be created by anyone"
    on businesses for insert
    to authenticated
    with check (true);

create policy "Businesses can be updated by owners"
    on businesses for update
    to authenticated
    using (auth.uid() in (
        select user_id from auth.users
        where email = businesses.email
    ));

-- Staff profiles policies
create policy "Staff profiles are viewable by all"
    on staff_profiles for select
    to authenticated
    using (true);

create policy "Staff profiles can be created by owners"
    on staff_profiles for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Staff profiles can be updated by owners"
    on staff_profiles for update
    to authenticated
    using (auth.uid() = user_id);

-- Jobs policies
create policy "Jobs are viewable by all"
    on jobs for select
    to authenticated
    using (true);

create policy "Jobs can be created by business owners"
    on jobs for insert
    to authenticated
    with check (exists (
        select 1 from businesses
        where businesses.id = business_id
        and auth.uid() in (
            select user_id from auth.users
            where email = businesses.email
        )
    ));

create policy "Jobs can be updated by business owners"
    on jobs for update
    to authenticated
    using (exists (
        select 1 from businesses
        where businesses.id = business_id
        and auth.uid() in (
            select user_id from auth.users
            where email = businesses.email
        )
    ));
