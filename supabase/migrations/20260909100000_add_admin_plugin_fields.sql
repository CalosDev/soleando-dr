-- Migration: 20260909100000_add_admin_plugin_fields.sql
-- Description: Agrega campos de rol y control administrativo requeridos por el plugin admin de Better Auth

ALTER TABLE public."user"
  ADD COLUMN IF NOT EXISTS "role" text DEFAULT 'user',
  ADD COLUMN IF NOT EXISTS "banned" boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS "banReason" text,
  ADD COLUMN IF NOT EXISTS "banExpires" timestamp;

ALTER TABLE public."session"
  ADD COLUMN IF NOT EXISTS "impersonatedBy" text;
