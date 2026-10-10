-- NanakLove schema. Run in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 180),
  author text,
  category text not null default 'other' check (category in ('gurbani','history','gurmat','biography','other')),
  language text,
  pages integer check (pages is null or pages > 0),
  description text,
  cover_url text,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.radio_stations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subtitle text,
  location text,
  stream_url text not null,
  enabled boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists books_category_idx on public.books(category);
create index if not exists books_title_idx on public.books using gin (to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(author,'')));
create index if not exists radio_stations_order_idx on public.radio_stations(sort_order);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists books_updated_at on public.books;
create trigger books_updated_at before update on public.books for each row execute function public.set_updated_at();
drop trigger if exists radio_stations_updated_at on public.radio_stations;
create trigger radio_stations_updated_at before update on public.radio_stations for each row execute function public.set_updated_at();

-- Enable RLS. Server accesses tables with service_role; never expose service_role in the browser.
alter table public.books enable row level security;
alter table public.radio_stations enable row level security;

-- No anon policies are created intentionally. The Node API uses the server-only service role key.


-- Contact form submissions are private; only the server service role may access them.
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) <= 254),
  message text not null check (char_length(message) between 5 and 5000),
  created_at timestamptz not null default now()
);
alter table public.contact_messages enable row level security;
