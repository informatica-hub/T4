
-- 1) Add 'kind' column to project_attachments
ALTER TABLE public.project_attachments
  ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'user_excel';

ALTER TABLE public.project_attachments
  DROP CONSTRAINT IF EXISTS project_attachments_kind_check;
ALTER TABLE public.project_attachments
  ADD CONSTRAINT project_attachments_kind_check
  CHECK (kind IN ('user_excel','admin_quote'));

-- 2) Replace SELECT policy for users (see all attachments of their own projects)
DROP POLICY IF EXISTS "Users view own attachments" ON public.project_attachments;
DROP POLICY IF EXISTS "Users view attachments of own projects" ON public.project_attachments;
CREATE POLICY "Users view attachments of own projects"
ON public.project_attachments FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.project_requests pr
    WHERE pr.id = project_attachments.project_request_id
      AND pr.user_id = auth.uid()
  )
);

-- 3) Admin INSERT policy for quote attachments
DROP POLICY IF EXISTS "Admins insert quote attachments" ON public.project_attachments;
CREATE POLICY "Admins insert quote attachments"
ON public.project_attachments FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 4) Storage policies for project-attachments bucket
-- Admins can upload anywhere
DROP POLICY IF EXISTS "Admins upload project files" ON storage.objects;
CREATE POLICY "Admins upload project files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'project-attachments' AND has_role(auth.uid(), 'admin'::app_role)
);

-- Users can read files in quotes/{project_request_id}/... if they own the project
DROP POLICY IF EXISTS "Users read quote files of own projects" ON storage.objects;
CREATE POLICY "Users read quote files of own projects"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'project-attachments'
  AND (storage.foldername(name))[1] = 'quotes'
  AND EXISTS (
    SELECT 1 FROM public.project_requests pr
    WHERE pr.id::text = (storage.foldername(name))[2]
      AND pr.user_id = auth.uid()
  )
);

-- 5) Migrate legacy 'pedidos' rows to 'project_requests' (idempotent)
INSERT INTO public.project_requests
  (id, user_id, institution, laboratory, email, notes, products,
   trigger_product_name, status, created_at, updated_at)
SELECT
  p.id, p.user_id, p.institution, p.laboratory, p.email, p.notes, p.products,
  p.trigger_product_name,
  CASE p.status
    WHEN 'nuevo' THEN 'pending'
    WHEN 'en_proceso' THEN 'en_proceso'
    WHEN 'cerrado' THEN 'cerrado'
    ELSE 'pending'
  END,
  p.created_at, p.updated_at
FROM public.pedidos p
WHERE NOT EXISTS (
  SELECT 1 FROM public.project_requests pr WHERE pr.id = p.id
);
