
-- Add new columns to certificates table
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS downloaded_at timestamptz DEFAULT NULL;
ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'no_descargado';

-- Drop existing restrictive RLS policy
DROP POLICY IF EXISTS "Users can view their own certificates" ON public.certificates;

-- Allow public SELECT on certificates
CREATE POLICY "Anyone can view certificates"
ON public.certificates FOR SELECT
TO public
USING (true);

-- Allow public UPDATE for download tracking only
CREATE POLICY "Anyone can update download status"
ON public.certificates FOR UPDATE
TO public
USING (true)
WITH CHECK (true);
