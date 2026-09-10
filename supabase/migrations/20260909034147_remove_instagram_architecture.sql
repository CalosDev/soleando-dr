-- Preserve the images still referenced by live offers before removing /public/ig.
update public.offers
set "imageUrl" = case "imageUrl"
  when '/ig/ig-DctcjZsxf3O.jpg' then '/uploads/legacy-ig-DctcjZsxf3O.jpg'
  when '/ig/ig-DcuYcW-u1WA.jpg' then '/uploads/legacy-ig-DcuYcW-u1WA.jpg'
  when '/ig/ig-DcuqlyHJl--.jpg' then '/uploads/legacy-ig-DcuqlyHJl--.jpg'
  when '/ig/ig-Dc1bVjPvrfJ.jpg' then '/uploads/legacy-ig-Dc1bVjPvrfJ.jpg'
  else "imageUrl"
end
where "imageUrl" in (
  '/ig/ig-DctcjZsxf3O.jpg',
  '/ig/ig-DcuYcW-u1WA.jpg',
  '/ig/ig-DcuqlyHJl--.jpg',
  '/ig/ig-Dc1bVjPvrfJ.jpg'
);

drop table if exists public.instagram_posts;

alter table public.offers
  drop column if exists "instagramUrl",
  drop column if exists "instagramMediaId",
  drop column if exists "source",
  drop column if exists "manualOverrides";
