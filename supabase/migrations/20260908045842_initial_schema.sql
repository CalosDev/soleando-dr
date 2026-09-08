create table if not exists public."user" (
  "id" text primary key,
  "name" text not null,
  "email" text not null unique,
  "emailVerified" boolean not null default false,
  "image" text,
  "role" text not null default 'user' check ("role" in ('user', 'admin')),
  "banned" boolean not null default false,
  "banReason" text,
  "banExpires" timestamptz,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

-- Keep upgrades from the pre-admin Better Auth schema compatible.
alter table public."user" add column if not exists "role" text not null default 'user';
alter table public."user" add column if not exists "banned" boolean not null default false;
alter table public."user" add column if not exists "banReason" text;
alter table public."user" add column if not exists "banExpires" timestamptz;

create table if not exists public."session" (
  "id" text primary key,
  "expiresAt" timestamptz not null,
  "token" text not null unique,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  "ipAddress" text,
  "userAgent" text,
  "userId" text not null references public."user"("id") on delete cascade,
  "impersonatedBy" text
);

alter table public."session" add column if not exists "impersonatedBy" text;

create index if not exists session_user_id_idx on public."session" ("userId");
create index if not exists session_expires_at_idx on public."session" ("expiresAt");

create table if not exists public."account" (
  "id" text primary key,
  "accountId" text not null,
  "providerId" text not null,
  "userId" text not null references public."user"("id") on delete cascade,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamptz,
  "refreshTokenExpiresAt" timestamptz,
  "scope" text,
  "password" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  unique ("providerId", "accountId")
);

create index if not exists account_user_id_idx on public."account" ("userId");

create table if not exists public."verification" (
  "id" text primary key,
  "identifier" text not null,
  "value" text not null,
  "expiresAt" timestamptz not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create index if not exists verification_identifier_idx on public."verification" ("identifier");

create table if not exists public.offers (
  id text primary key,
  slug text not null unique,
  title text not null,
  destination text not null,
  category text not null,
  description text not null,
  price numeric(12, 2) check (price is null or price >= 0),
  currency text not null default 'USD',
  "dateLabel" text,
  includes text[] not null default '{}',
  "imageUrl" text not null,
  "instagramUrl" text,
  "instagramMediaId" text unique,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  featured boolean not null default false,
  source text not null default 'manual' check (source in ('manual', 'instagram')),
  "manualOverrides" text[] not null default '{}',
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create index if not exists offers_published_idx
  on public.offers (featured desc, "createdAt" desc)
  where status = 'published';

create index if not exists offers_category_status_idx on public.offers (category, status);

create table if not exists public.instagram_posts (
  id text primary key,
  media_type text not null check (media_type in ('IMAGE', 'VIDEO', 'CAROUSEL_ALBUM')),
  media_url text not null,
  thumbnail_url text,
  permalink text not null,
  published_at timestamptz not null,
  caption text,
  likes_count integer check (likes_count is null or likes_count >= 0),
  location text,
  sort_order integer not null check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists instagram_posts_sort_order_idx on public.instagram_posts (sort_order);

alter table public."user" enable row level security;
alter table public."session" enable row level security;
alter table public."account" enable row level security;
alter table public."verification" enable row level security;
alter table public.offers enable row level security;
alter table public.instagram_posts enable row level security;

revoke all on table public."user" from anon, authenticated;
revoke all on table public."session" from anon, authenticated;
revoke all on table public."account" from anon, authenticated;
revoke all on table public."verification" from anon, authenticated;
revoke all on table public.offers from anon, authenticated;
revoke all on table public.instagram_posts from anon, authenticated;
