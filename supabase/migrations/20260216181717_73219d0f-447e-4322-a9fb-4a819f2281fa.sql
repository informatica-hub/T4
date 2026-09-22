
-- Allow admins to update any order (e.g. change status to shipped, completed)
CREATE POLICY "Admins can update all orders"
ON public.orders FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Allow users to cancel their own pending orders
CREATE POLICY "Users can cancel their pending orders"
ON public.orders FOR UPDATE TO authenticated
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (auth.uid() = user_id AND status = 'cancelled');
