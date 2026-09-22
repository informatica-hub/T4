
-- 1. Add image_url column to catalog_products
ALTER TABLE public.catalog_products ADD COLUMN image_url text;

-- 2. Create public bucket for catalog images
INSERT INTO storage.buckets (id, name, public)
VALUES ('catalog-images', 'catalog-images', true);

-- 3. RLS policies for storage.objects on catalog-images bucket
-- Anyone can view images
CREATE POLICY "Public read access for catalog images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'catalog-images');

-- Only admins can upload
CREATE POLICY "Admins can upload catalog images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'catalog-images' AND public.has_role(auth.uid(), 'admin'));

-- Only admins can update
CREATE POLICY "Admins can update catalog images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'catalog-images' AND public.has_role(auth.uid(), 'admin'));

-- Only admins can delete
CREATE POLICY "Admins can delete catalog images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'catalog-images' AND public.has_role(auth.uid(), 'admin'));
