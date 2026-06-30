-- ============================================================
-- FITNESS TRACKER — Supabase Schema
-- Paste this into: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Weight logs: one entry per week
create table if not exists weight_logs (
  id uuid default gen_random_uuid() primary key,
  week integer not null unique,
  kg numeric(5,1) not null,
  logged_at date not null default current_date,
  created_at timestamptz default now()
);

-- Food entries: multiple per day, tagged by meal
create table if not exists food_entries (
  id uuid default gen_random_uuid() primary key,
  date date not null,
  meal text not null check (meal in ('breakfast', 'lunch', 'dinner', 'snack')),
  name text not null,
  grams numeric(7,1) not null default 0,
  calories numeric(7,1) not null default 0,
  protein_g numeric(6,1) not null default 0,
  carbs_g numeric(6,1) not null default 0,
  fat_g numeric(6,1) not null default 0,
  fiber_g numeric(6,1) not null default 0,
  iron_mg numeric(6,1) not null default 0,
  calcium_mg numeric(7,0) not null default 0,
  vitamin_d_iu numeric(7,0) not null default 0,
  vitamin_b12_mcg numeric(6,1) not null default 0,
  magnesium_mg numeric(7,0) not null default 0,
  potassium_mg numeric(7,0) not null default 0,
  zinc_mg numeric(6,1) not null default 0,
  sodium_mg numeric(7,0) not null default 0,
  logged_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Check-ins: one per day
create table if not exists checkins (
  id uuid default gen_random_uuid() primary key,
  date date not null unique,
  diet text check (diet in ('full', 'partial', 'no')),
  workout text check (workout in ('full', 'partial', 'skipped')),
  walking text check (walking in ('yes', 'no')),
  medication text check (medication in ('yes', 'no')),
  sleep text check (sleep in ('good', 'average', 'poor')),
  mood text check (mood in ('excellent', 'good', 'average', 'low')),
  energy integer not null default 5 check (energy between 1 and 10),
  did_not_follow boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- Indexes for fast date lookups
create index if not exists idx_food_entries_date on food_entries(date);
create index if not exists idx_checkins_date on checkins(date);
create index if not exists idx_weight_logs_week on weight_logs(week);

-- Enable Row Level Security (add policies once auth is set up)
alter table weight_logs enable row level security;
alter table food_entries enable row level security;
alter table checkins enable row level security;

-- Temporary open policies (replace with auth-based policies later)
create policy "Allow all on weight_logs" on weight_logs for all using (true) with check (true);
create policy "Allow all on food_entries" on food_entries for all using (true) with check (true);
create policy "Allow all on checkins" on checkins for all using (true) with check (true);
