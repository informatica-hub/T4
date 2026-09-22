
-- Allow admins to INSERT certificates
CREATE POLICY "Admins can insert certificates"
ON public.certificates FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to DELETE certificates
CREATE POLICY "Admins can delete certificates"
ON public.certificates FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to UPDATE certificates
CREATE POLICY "Admins can update certificates"
ON public.certificates FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
