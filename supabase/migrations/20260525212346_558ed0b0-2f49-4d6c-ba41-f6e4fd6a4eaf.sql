-- Drop old permissive insert policy
DROP POLICY IF EXISTS "Anyone can create project requests" ON public.project_requests;

-- New: only authenticated users can create, and only for themselves
CREATE POLICY "Authenticated users can create their own project requests"
ON public.project_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);