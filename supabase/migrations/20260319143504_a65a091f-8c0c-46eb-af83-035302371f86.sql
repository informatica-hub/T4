
-- Tighten UPDATE policy: only allow updating downloaded_at and status columns
DROP POLICY IF EXISTS "Anyone can update download status" ON public.certificates;

-- Instead of open UPDATE, we'll handle download tracking via a security definer function
CREATE OR REPLACE FUNCTION public.mark_certificate_downloaded(_cert_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.certificates 
  SET downloaded_at = now(), status = 'descargado'
  WHERE id = _cert_id;
END;
$$;
