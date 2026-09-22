
-- 1. Role system
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- 2. Product categories
CREATE TABLE public.product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  color text NOT NULL DEFAULT '#888888',
  icon_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
ON public.product_categories FOR SELECT USING (true);

CREATE POLICY "Admins can insert categories"
ON public.product_categories FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update categories"
ON public.product_categories FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete categories"
ON public.product_categories FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 3. Catalog products
CREATE TABLE public.catalog_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.product_categories(id) ON DELETE SET NULL,
  subcategory text,
  catalog_number text,
  name text NOT NULL,
  description text,
  long_description text,
  slogan text,
  presentations text,
  sku text,
  list_price numeric,
  delivery_time text,
  applications text[] DEFAULT '{}',
  upselling uuid[] DEFAULT '{}',
  product_type text NOT NULL DEFAULT 'producto',
  brand text NOT NULL DEFAULT 't4',
  featured boolean NOT NULL DEFAULT false,
  ruo boolean NOT NULL DEFAULT false,
  tags text[] DEFAULT '{}',
  differentiator text,
  cta text,
  href text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.catalog_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
ON public.catalog_products FOR SELECT USING (true);

CREATE POLICY "Admins can insert products"
ON public.catalog_products FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update products"
ON public.catalog_products FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete products"
ON public.catalog_products FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_catalog_products_updated_at
BEFORE UPDATE ON public.catalog_products
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Seed 8 categories
INSERT INTO public.product_categories (slug, name, color, icon_url, sort_order) VALUES
('oligonucleotidos', 'Oligonucleótidos', '#5B6FC0', '/images/dot_oligos-2.jpg', 1),
('sondas-hidrolisis', 'Sondas de Hidrólisis', '#8B2332', '/images/dot_starq.jpg', 2),
('genes-sinteticos', 'Genes y Controles Sintéticos', '#7A8B2D', '/images/dot_genes-2.jpg', 3),
('enzimas', 'Enzimas', '#5A5A5A', '/images/dot_reactivos-2.jpg', 4),
('extraccion-purificacion', 'Sistemas de Extracción y Purificación', '#6B7B6B', '/images/dot_soluciones-2.jpg', 5),
('kits-deteccion', 'Kits de Detección Molecular', '#9B8B2F', '/images/dot_kdm-2.jpg', 6),
('primers', 'Primers', '#4A90D9', '/images/dot_primers-2.jpg', 7),
('innovaciones', 'Innovaciones', '#C5D92D', NULL, 8);
