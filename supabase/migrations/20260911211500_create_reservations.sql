create table public.reservations (
  id text primary key,
  user_id text not null references public."user"(id) on delete cascade,
  kind text not null check (kind in ('hotel', 'tour', 'excursion_national', 'excursion_international', 'cruise')),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  title text not null,
  destination text not null,
  starts_on date,
  ends_on date,
  traveler_count integer not null default 1 check (traveler_count between 1 and 30),
  provider text,
  provider_reference text,
  total_amount numeric(12,2) check (total_amount is null or total_amount >= 0),
  currency text check (currency is null or currency ~ '^[A-Z]{3}$'),
  customer_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_on is null or starts_on is null or ends_on >= starts_on)
);

create index reservations_user_created_idx on public.reservations (user_id, created_at desc);
create index reservations_provider_reference_idx on public.reservations (provider_reference) where provider_reference is not null;

alter table public.reservations enable row level security;
revoke all on table public.reservations from anon, authenticated;
