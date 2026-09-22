-- Create cart_items table for shopping cart
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  specifications JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id, specifications)
);

-- Enable Row Level Security
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Create policies for cart access
CREATE POLICY "Users can view their own cart items"
ON public.cart_items
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can add items to their own cart"
ON public.cart_items
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
ON public.cart_items
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can remove items from their own cart"
ON public.cart_items
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_cart_items_updated_at
BEFORE UPDATE ON public.cart_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);