
CREATE TABLE public.pedidos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  institution TEXT NOT NULL,
  laboratory TEXT NOT NULL,
  email TEXT NOT NULL,
  notes TEXT,
  products JSONB NOT NULL DEFAULT '[]'::jsonb,
  trigger_product_id TEXT,
  trigger_product_name TEXT,
  status TEXT NOT NULL DEFAULT 'nuevo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create pedidos"
  ON public.pedidos FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all pedidos"
  ON public.pedidos FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update pedidos"
  ON public.pedidos FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete pedidos"
  ON public.pedidos FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_pedidos_updated_at
  BEFORE UPDATE ON public.pedidos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_pedidos_created_at ON public.pedidos (created_at DESC);
CREATE INDEX idx_pedidos_status ON public.pedidos (status);
