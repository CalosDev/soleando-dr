-- Hotel inventory and pricing now come exclusively from the live booking provider.
-- Delete only records explicitly seeded as mock data; preserve independently
-- managed records even though the public hotel catalog no longer reads them.
delete from public.catalog_items
where kind in ('hotel', 'destination')
  and coalesce(content ->> 'isMock', 'false') = 'true';
