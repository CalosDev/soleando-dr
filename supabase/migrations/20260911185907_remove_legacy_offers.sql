-- The legacy offers catalogue has been replaced by catalog_items. The table
-- was verified empty and without foreign-key consumers before this removal.
drop table if exists public.offers;
