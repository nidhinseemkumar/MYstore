-- Run this in your Supabase SQL Editor to set up the database

-- 1. Create a table for user profiles (extends auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  role text check (role in ('buyer', 'seller', 'admin')) default 'buyer',
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Create policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 4. Create a trigger to automatically create a profile on signup
-- Note: This trigger function assumes you send 'full_name' and 'role' in user_metadata during signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'role', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Products Table (Simplified)
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric not null,
  category text,
  image_url text,
  stock_quantity integer default 0,
  seller_id uuid references public.profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.products enable row level security;

create policy "Products are viewable by everyone."
  on products for select
  using ( true );

create policy "Sellers can manage their own products."
  on products for all
  using ( auth.uid() = seller_id );
