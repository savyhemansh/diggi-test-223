-- Run this once in Supabase Dashboard → SQL Editor → New Query.
-- Creates the two tables the Diggi Palace site writes to, with RLS locked down
-- so the public anon key can only INSERT, never read/update/delete other people's rows.

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now()
);

alter table newsletter_subscribers enable row level security;

create policy "Anyone can subscribe"
  on newsletter_subscribers
  for insert
  to anon
  with check (true);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  enquiry_type text not null,
  title text not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  country text,
  message text not null,
  wants_updates boolean not null default false,
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;

create policy "Anyone can submit an enquiry"
  on contact_messages
  for insert
  to anon
  with check (true);
