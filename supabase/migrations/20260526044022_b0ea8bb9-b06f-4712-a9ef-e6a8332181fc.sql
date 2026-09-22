
-- Table for project attachments
CREATE TABLE public.project_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_request_id UUID NOT NULL,
  user_id UUID NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_attachments_project ON public.project_attachments(project_request_id);
CREATE INDEX idx_project_attachments_user ON public.project_attachments(user_id);

ALTER TABLE public.project_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own attachments"
  ON public.project_attachments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins view all attachments"
  ON public.project_attachments FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users insert own attachments"
  ON public.project_attachments FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.project_requests pr
      WHERE pr.id = project_request_id AND pr.user_id = auth.uid()
    )
  );

CREATE POLICY "Users delete own attachments"
  ON public.project_attachments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins delete attachments"
  ON public.project_attachments FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-attachments', 'project-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: path is {user_id}/{project_request_id}/{filename}
CREATE POLICY "Users read own project files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'project-attachments'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins read all project files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'project-attachments'
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Users upload own project files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'project-attachments'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users delete own project files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'project-attachments'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins delete project files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'project-attachments'
    AND public.has_role(auth.uid(), 'admin')
  );
