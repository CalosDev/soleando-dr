-- Catálogo editorial administrado por el backend de Soleando.
-- No sustituye la disponibilidad ni tarifas en vivo del proveedor hotelero.
create table if not exists public.catalog_items (
  id text primary key,
  kind text not null check (kind in ('destination', 'experience', 'cruise', 'hotel')),
  slug text not null,
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (kind, slug)
);

create index if not exists catalog_items_published_idx
  on public.catalog_items (kind, sort_order asc, created_at asc)
  where status = 'published';

alter table public.catalog_items enable row level security;
revoke all on table public.catalog_items from anon, authenticated;
