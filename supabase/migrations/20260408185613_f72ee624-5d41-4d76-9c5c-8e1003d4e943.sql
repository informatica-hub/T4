
CREATE TABLE public.product_subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.product_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category_id, name)
);

ALTER TABLE public.product_subcategories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view subcategories" ON public.product_subcategories FOR SELECT USING (true);
CREATE POLICY "Admins can insert subcategories" ON public.product_subcategories FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update subcategories" ON public.product_subcategories FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete subcategories" ON public.product_subcategories FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));

ALTER TABLE public.catalog_products
  ADD COLUMN subcategory_id uuid REFERENCES public.product_subcategories(id) ON DELETE SET NULL;
