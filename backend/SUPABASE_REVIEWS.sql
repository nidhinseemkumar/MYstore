-- Create Reviews Table
create table public.reviews (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references public.products(id) on delete cascade not null,
  user_id uuid references public.profiles(id) not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(product_id, user_id) -- A user can only review a product once
);

-- Enable RLS
alter table public.reviews enable row level security;

-- Policies
create policy "Reviews are viewable by everyone."
  on reviews for select
  using ( true );

-- Users can only write reviews if they are authenticated and it's their own user_id
create policy "Authenticated users can write reviews."
  on reviews for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own reviews."
  on reviews for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own reviews."
  on reviews for delete
  using ( auth.uid() = user_id );

-- Create a view or function to calculate avg rating for products 
-- (Optional, but handy for displaying on product cards without querying all reviews every time)
create or replace function public.update_product_rating()
returns trigger as $$
begin
  update public.products
  set 
    rating = (select avg(rating)::numeric(2,1) from public.reviews where product_id = coalesce(new.product_id, old.product_id)),
    reviews = (select count(*) from public.reviews where product_id = coalesce(new.product_id, old.product_id))
  where id = coalesce(new.product_id, old.product_id);
  
  return null;
end;
$$ language plpgsql security definer;

-- Trigger to recalculate rating on review insert, update, or delete
create trigger on_review_change
  after insert or update or delete on public.reviews
  for each row execute procedure public.update_product_rating();
