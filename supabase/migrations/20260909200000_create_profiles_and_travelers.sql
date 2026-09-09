-- Migration: 20260909200000_create_profiles_and_travelers.sql
-- Description: Crea las tablas de perfiles de clientes (profiles) y viajeros guardados (travelers)

-- 1. Tabla de perfiles de cliente (1:1 con user)
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id text PRIMARY KEY REFERENCES public."user"(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  country_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profiles_country_code_check CHECK (country_code IS NULL OR length(country_code) = 2)
);

-- 2. Tabla de viajeros guardados (1:N con user)
CREATE TABLE IF NOT EXISTS public.travelers (
  id text PRIMARY KEY,
  user_id text NOT NULL REFERENCES public."user"(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date,
  nationality_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT travelers_nationality_code_check CHECK (nationality_code IS NULL OR length(nationality_code) = 2)
);

-- 3. Índice para consultas rápidas de viajeros por usuario
CREATE INDEX IF NOT EXISTS travelers_user_id_idx ON public.travelers(user_id);

-- 4. Seguridad RLS para acceso seguro server-side
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travelers ENABLE ROW LEVEL SECURITY;
