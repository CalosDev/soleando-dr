-- The original seed timestamps include microseconds. Keep the cleanup
-- constrained to the known demo IDs and their one-millisecond seed window.
delete from public.catalog_items
where id in (
  'cruise-antillas-sur',
  'cruise-caribe-este',
  'cruise-caribe-occidental',
  'exp-buggies',
  'exp-cayo-arena',
  'exp-los-haitises-montana-redonda',
  'exp-rafting-jarabacoa',
  'exp-safari-campesino',
  'exp-samana-limon',
  'exp-santo-domingo',
  'exp-saona'
)
and created_at >= timestamptz '2026-09-10 03:40:23.610+00'
and created_at < timestamptz '2026-09-10 03:40:23.611+00'
and updated_at >= timestamptz '2026-09-10 03:41:07.391+00'
and updated_at < timestamptz '2026-09-10 03:41:07.392+00';
