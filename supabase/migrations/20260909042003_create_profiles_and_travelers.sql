create table public.profiles (
  user_id text primary key references public."user"(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  phone text,
  country_code text check (country_code is null or country_code ~ '^[A-Z]{2}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.travelers (
  id text primary key,
  user_id text not null references public."user"(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  date_of_birth date,
  nationality_code text check (nationality_code is null or nationality_code ~ '^[A-Z]{2}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index travelers_user_id_idx on public.travelers (user_id);

alter table public.profiles enable row level security;
alter table public.travelers enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.travelers from anon, authenticated;
