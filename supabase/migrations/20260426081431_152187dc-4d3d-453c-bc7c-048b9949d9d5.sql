-- Fix 1: Restrict certificates SELECT to owners and admins; provide SECURITY DEFINER lookup for public ID-based lookup
DROP POLICY IF EXISTS "Anyone can view certificates" ON public.certificates;

CREATE POLICY "Users can view their own certificates"
  ON public.certificates
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all certificates"
  ON public.certificates
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Lookup function for the public certificate download page (returns only the requested cert by ID)
CREATE OR REPLACE FUNCTION public.get_certificate_by_id(_cert_id uuid)
RETURNS TABLE (
  id uuid,
  file_path text,
  lot_number text,
  product_name text,
  certificate_type text,
  status text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, file_path, lot_number, product_name, certificate_type, status
  FROM public.certificates
  WHERE id = _cert_id
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_certificate_by_id(uuid) TO anon, authenticated;

-- Fix 2: Add storage policies for the private 'certificates' bucket so admins can upload/update/delete
CREATE POLICY "Admins can upload certificate files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'certificates'
    AND public.has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins can update certificate files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'certificates'
    AND public.has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins can delete certificate files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'certificates'
    AND public.has_role(auth.uid(), 'admin'::app_role)
  );

-- Allow owners to download their own certificate files; admins too
CREATE POLICY "Users can download their own certificate files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'certificates'
    AND (
      public.has_role(auth.uid(), 'admin'::app_role)
      OR (storage.foldername(name))[1] = auth.uid()::text
    )
  );