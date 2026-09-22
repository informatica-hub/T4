
-- Tabla para almacenar solicitudes de cotización del flujo "Arma tu Proyecto"
CREATE TABLE public.project_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NULL, -- opcional, puede ser anónimo
  institution TEXT NOT NULL,
  laboratory TEXT NOT NULL,
  email TEXT NOT NULL,
  notes TEXT NULL,
  products JSONB NOT NULL DEFAULT '[]'::jsonb, -- lista de {product_id, product_name}
  trigger_product_id UUID NULL, -- producto que detonó el proyecto
  trigger_product_name TEXT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_requests ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede crear solicitudes (no requiere login)
CREATE POLICY "Anyone can create project requests"
ON public.project_requests FOR INSERT
WITH CHECK (true);

-- Usuarios autenticados ven sus propias solicitudes
CREATE POLICY "Users can view their own requests"
ON public.project_requests FOR SELECT
USING (auth.uid() = user_id);

-- Admins pueden ver todas
CREATE POLICY "Admins can view all requests"
ON public.project_requests FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins pueden actualizar status
CREATE POLICY "Admins can update requests"
ON public.project_requests FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para updated_at
CREATE TRIGGER update_project_requests_updated_at
BEFORE UPDATE ON public.project_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
