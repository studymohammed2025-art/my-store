-- شغّل هذا الملف في Supabase → SQL Editor
create table if not exists products (
  id text primary key,
  name_ar text not null,
  name_en text not null,
  brand text not null,
  category text not null,
  price numeric not null,
  old_price numeric,
  rating numeric not null default 0,
  reviews int not null default 0,
  sold int not null default 0,
  colors jsonb not null default '[]',
  sizes jsonb not null default '[]',
  badges jsonb not null default '[]',
  images jsonb not null default '[]',
  created_at date not null default current_date,
  flash boolean not null default false,
  stock int not null default 0
);

-- القراءة متاحة للجميع، أما الكتابة فمن مفتاح service role فقط (يتجاوز RLS)
alter table products enable row level security;
drop policy if exists "products are public" on products;
create policy "products are public" on products for select using (true);
