-- Run this in your Supabase SQL Editor to set up the categories table

create table public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  image_url text,
  color text default 'bg-gray-50',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.categories enable row level security;

create policy "Categories are viewable by everyone."
  on categories for select
  using ( true );

-- Allow admins to manage categories
create policy "Admins can manage categories."
  on categories for all
  using ( (select role from public.profiles where id = auth.uid()) = 'admin' );

-- Insert seed data based on the original mock data
insert into public.categories (name, image_url, color) values 
('Vegetables & Fruits', 'https://cdn-icons-png.flaticon.com/512/2909/2909787.png', 'bg-green-50'),
('Dairy & Breakfast', 'https://cdn-icons-png.flaticon.com/512/3050/3050158.png', 'bg-blue-50'),
('Munchies', 'https://cdn-icons-png.flaticon.com/512/2553/2553691.png', 'bg-orange-50'),
('Cold Drinks', 'https://cdn-icons-png.flaticon.com/512/2405/2405479.png', 'bg-red-50'),
('Instant Food', 'https://cdn-icons-png.flaticon.com/512/2515/2515127.png', 'bg-yellow-50'),
('Tea, Coffee & Health Drinks', 'https://cdn-icons-png.flaticon.com/512/3050/3050239.png', 'bg-amber-50');
