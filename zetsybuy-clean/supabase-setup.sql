-- ═══════════════════════════════════════════════════════════
-- ZETSYBUY GIFT — SUPABASE DATABASE SETUP
-- Supabase Dashboard → SQL Editor → Paste karo → Run karo
-- ═══════════════════════════════════════════════════════════

-- 1. PRODUCTS TABLE
create table if not exists products (
  id text primary key,
  name text not null,
  emoji text default '🎁',
  price integer default 0,
  mrp integer default 0,
  category text default 'birthday',
  link text default '#',
  active boolean default true,
  featured boolean default false,
  created_at timestamptz default now()
);

-- 2. FRAMES TABLE (custom frames from admin)
create table if not exists frames (
  id text primary key,
  category text not null,
  label text not null,
  emoji text default '✨',
  color1 text default '#e8416f',
  color2 text default '#f7a548',
  banner text default '✨ Frame ✨',
  decoration text default 'sparkle',
  border_style text default 'gradient',
  is_custom boolean default true,
  created_at timestamptz default now()
);

-- 3. SETTINGS TABLE
create table if not exists settings (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

-- 4. EID USERS TABLE
create table if not exists eid_users (
  id bigint generated always as identity primary key,
  name text not null,
  phone text,
  user_agent text,
  created_at timestamptz default now()
);

-- ═══ ENABLE ROW LEVEL SECURITY ═══
alter table products enable row level security;
alter table frames enable row level security;
alter table settings enable row level security;
alter table eid_users enable row level security;

-- ═══ PUBLIC READ POLICY (everyone can read) ═══
create policy "Public read products" on products for select using (true);
create policy "Public read frames" on frames for select using (true);
create policy "Public read settings" on settings for select using (true);

-- ═══ PUBLIC INSERT/UPDATE POLICY (needed for admin panel) ═══
-- Note: In production, use proper auth. For now allow anon.
create policy "Anon insert products" on products for insert with check (true);
create policy "Anon update products" on products for update using (true);
create policy "Anon delete products" on products for delete using (true);
create policy "Anon insert frames" on frames for insert with check (true);
create policy "Anon update frames" on frames for update using (true);
create policy "Anon insert settings" on settings for insert with check (true);
create policy "Anon update settings" on settings for update using (true);
create policy "Anon insert eid_users" on eid_users for insert with check (true);
create policy "Anon read eid_users" on eid_users for select using (true);

-- ═══ REALTIME ENABLE ═══
alter publication supabase_realtime add table products;
alter publication supabase_realtime add table frames;

-- ═══ DEFAULT PRODUCTS INSERT ═══
insert into products (id, name, emoji, price, mrp, category, link, active, featured) values
('p1','Personalized Photo Frame','🖼️',599,999,'birthday','https://www.amazon.in/s?k=personalized+photo+frame&tag=YOURID-21',true,true),
('p2','Scented Candle Gift Set','🕯️',849,1299,'love','https://www.amazon.in/s?k=scented+candle+gift+set&tag=YOURID-21',true,true),
('p3','Spa Hamper for Mom','🛁',1199,1799,'mom','https://www.amazon.in/s?k=spa+gift+hamper+mom&tag=YOURID-21',true,true),
('p4','Luxury Chocolate Box','🍫',699,999,'birthday','https://www.amazon.in/s?k=luxury+chocolate+gift+box&tag=YOURID-21',true,false),
('p5','Couple Cushion Set','🛋️',799,1200,'anniversary','https://www.amazon.in/s?k=couple+cushion+gift&tag=YOURID-21',true,false),
('p6','LED Galaxy Night Lamp','🌟',1099,1599,'birthday','https://www.amazon.in/s?k=star+projector+lamp&tag=YOURID-21',true,true),
('p7','Kids Art Craft Kit','🎨',549,799,'kids','https://www.amazon.in/s?k=kids+art+craft+kit&tag=YOURID-21',true,false),
('p8','Floral Perfume Gift Set','🌺',1499,2199,'mom','https://www.amazon.in/s?k=floral+perfume+gift+set&tag=YOURID-21',true,true),
('p9','Wedding Gift Hamper','💒',2499,3499,'wedding','https://www.amazon.in/s?k=wedding+gift+hamper&tag=YOURID-21',true,true),
('p10','Graduation Photo Frame','🎓',799,1199,'graduation','https://www.amazon.in/s?k=graduation+photo+frame&tag=YOURID-21',true,false),
('p11','Get Well Soon Basket','🌻',999,1499,'getwell','https://www.amazon.in/s?k=get+well+soon+gift+basket&tag=YOURID-21',true,false),
('p12','New Year Gift Box','🎆',1199,1799,'newyear','https://www.amazon.in/s?k=new+year+gift+box&tag=YOURID-21',true,false)
on conflict (id) do nothing;

-- ✅ Done! Ab Supabase URL aur Key copy karo aur index.html / admin.html mein daalo
