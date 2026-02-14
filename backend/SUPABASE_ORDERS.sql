-- Create Orders Table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  total_amount numeric not null,
  status text check (status in ('pending', 'processing', 'completed', 'cancelled')) default 'pending',
  shipping_address text,
  payment_method text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Order Items Table
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) not null,
  seller_id uuid references auth.users not null, -- To help sellers filter their orders
  quantity integer not null,
  price_at_purchase numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Policies for Orders
create policy "Users can view their own orders." 
  on orders for select 
  using ( auth.uid() = user_id );

create policy "Users can insert their own orders." 
  on orders for insert 
  with check ( auth.uid() = user_id );

-- Policies for Order Items
-- Buyers see items they bought, Sellers see items they sold
create policy "Users can view their own order items." 
  on order_items for select 
  using ( 
    auth.uid() = (select user_id from public.orders where id = order_id)
    OR 
    auth.uid() = seller_id 
  );
  
-- Buyers can insert items for their order
create policy "Users can insert their own order items." 
  on order_items for insert 
  with check ( 
    auth.uid() = (select user_id from public.orders where id = order_id) 
  );
