-- Add new profile fields to support profile settings (FND-09.4.1)
-- Fields: tagline, banner_url, accent_color, interests
ALTER TABLE public.profiles
  ADD COLUMN tagline TEXT,
  ADD COLUMN banner_url TEXT,
  ADD COLUMN accent_color TEXT,
  ADD COLUMN interests TEXT[] DEFAULT '{}';

-- Ensure row-level security remains applied (policies already exist)
-- RLS policies should allow anyone to SELECT and only owners to UPDATE
-- No additional policy changes needed
