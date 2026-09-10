alter table public.catalog_items
  drop constraint if exists catalog_items_kind_check;

alter table public.catalog_items
  add constraint catalog_items_kind_check
  check (kind in (
    'experience',
    'destination',
    'hotel',
    'tour',
    'excursion_national',
    'excursion_international',
    'cruise'
  ));

-- El catálogo deja de ser una copia sincronizada y pasa a ser contenido editorial.
-- Conservamos los registros actuales y su contenido.
update public.catalog_items
set kind = 'excursion_national'
where kind = 'experience';

alter table public.catalog_items
  drop constraint if exists catalog_items_kind_check;

alter table public.catalog_items
  add constraint catalog_items_kind_check
  check (kind in (
    'destination',
    'hotel',
    'tour',
    'excursion_national',
    'excursion_international',
    'cruise'
  ));

drop index if exists public.catalog_items_published_idx;

create index if not exists catalog_items_published_idx
  on public.catalog_items (kind, sort_order asc, created_at asc)
  where status = 'published';
