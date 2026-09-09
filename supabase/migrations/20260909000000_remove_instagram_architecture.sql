-- Migration: 20260909000000_remove_instagram_architecture.sql
-- Description: Elimina de forma segura la tabla instagram_posts y las columnas de Instagram en offers

-- 1. Eliminar la tabla de posts de Instagram si existe
DROP TABLE IF EXISTS public.instagram_posts;

-- 2. Retirar columnas de Instagram en la tabla offers
ALTER TABLE public.offers
  DROP COLUMN IF EXISTS "instagramUrl",
  DROP COLUMN IF EXISTS "instagramMediaId",
  DROP COLUMN IF EXISTS "source",
  DROP COLUMN IF EXISTS "manualOverrides";
