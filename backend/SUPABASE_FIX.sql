-- Drop existing policies if they exist to avoid duplication errors
drop policy if exists "Users can view their own orders." on orders;
drop policy if exists "Users can insert their own orders." on orders;
drop policy if exists "Users can view their own order items." on order_items;
drop policy if exists "Users can insert their own order items." on order_items;

-- Safe creation of tables (if not exists)
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  total_amount numeric not null,
  status text check (status in ('pending', 'processing', 'completed', 'cancelled')) default 'pending',
  shipping_address text,
  payment_method text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) not null,
  seller_id uuid references auth.users not null,
  quantity integer not null,
  price_at_purchase numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Insert policies safely 
do $$
begin
    -- Orders
    if not exists (select 1 from pg_policies where policyname = 'Users can view their own orders.' and tablename = 'orders') then
        create policy "Users can view their own orders." on orders for select using ( auth.uid() = user_id );
    end if;

    if not exists (select 1 from pg_policies where policyname = 'Users can insert their own orders.' and tablename = 'orders') then
        create policy "Users can insert their own orders." on orders for insert with check ( auth.uid() = user_id );
    end if;

    -- Order Items
    if not exists (select 1 from pg_policies where policyname = 'Users can view their own order items.' and tablename = 'order_items') then
        create policy "Users can view their own order items." on order_items for select using ( 
            auth.uid() = (select user_id from public.orders where public.orders.id = order_items.order_id)
            OR auth.uid() = seller_id 
        );
    end if;
    
    if not exists (select 1 from pg_policies where policyname = 'Users can insert their own order items.' and tablename = 'order_items') then
        create policy "Users can insert their own order items." on order_items for insert with check ( 
            auth.uid() = (select user_id from public.orders where public.orders.id = order_items.order_id)
        );
    end if;
end
$$;

-- Insert mock products and grab any available user profile to use as the seller ID
DO $$
DECLARE
    fallback_seller_id UUID;
BEGIN
    -- Grab the first available profile ID to use as a placeholder seller for mock data
    SELECT id INTO fallback_seller_id FROM public.profiles LIMIT 1;
    
    IF fallback_seller_id IS NOT NULL THEN
        insert into public.products (id, name, description, price, category, image_url, stock_quantity, seller_id) 
        values 
        ('11111111-1111-1111-1111-111111111111', 'Amul Taaza Fresh Toned Milk', 'Pasteurized Toned Milk', 27, 'Dairy & Breakfast', 'https://www.bigbasket.com/media/uploads/p/l/306926-2_4-amul-homogenised-toned-milk.jpg', 100, fallback_seller_id),
        ('22222222-2222-2222-2222-222222222222', 'Lay''s India''s Magic Masala Chips', 'Spicy and crunchy potato chips', 20, 'Munchies', 'https://www.bigbasket.com/media/uploads/p/l/294297-8_1-lays-potato-chips-indias-magic-masala.jpg', 100, fallback_seller_id),
        ('33333333-3333-3333-3333-333333333333', 'Coca-Cola Soft Drink - Original Taste', 'Refreshing carbonated soft drink', 40, 'Cold Drinks', 'https://www.bigbasket.com/media/uploads/p/l/251023_8-coca-cola-soft-drink-original-taste.jpg', 100, fallback_seller_id),
        ('44444444-4444-4444-4444-444444444444', 'Onion (Loose)', 'Fresh onions from local farms', 35, 'Vegetables & Fruits', 'https://www.bigbasket.com/media/uploads/p/l/10000148_30-fresho-onion.jpg', 100, fallback_seller_id),
        ('55555555-5555-5555-5555-555555555555', 'Fortune Sunlite Refined Sunflower Oil', 'Healthy cooking oil', 145, 'Instant Food', 'https://www.bigbasket.com/media/uploads/p/l/274145_14-fortune-sunlite-refined-sunflower-oil.jpg', 100, fallback_seller_id),
        ('66666666-6666-6666-6666-666666666666', 'Tata Salt Vacuum Evaporated Iodised Salt', 'Iodised salt for daily cooking', 24, 'Instant Food', 'https://www.bigbasket.com/media/uploads/p/l/241600_5-tata-salt-vacuum-evaporated-iodised-salt.jpg', 100, fallback_seller_id)
        on conflict (id) do nothing;
    END IF;
END $$;
