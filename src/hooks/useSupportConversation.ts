// src/hooks/useSupportConversation.ts
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Conversation } from "@/types";

export function useSupportConversation() {
  const { user } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setConversation(null);
      setLoading(false);
      return;
    }

    const ensureConversation = async () => {
      setLoading(true);
      setError(null);

      // 1. Buscar conversación abierta existente
      const { data: existing, error: fetchError } = await supabase
        .from("conversations")
        .select("*")
        .eq("customer_id", user.id)
        .in("status", ["open", "assigned"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        console.error("Error buscando conversación:", fetchError);
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      if (existing) {
        setConversation(existing);
        setLoading(false);
        return;
      }

      // 2. Crear una nueva
      const { data: created, error: createError } = await supabase
        .from("conversations")
        .insert({ customer_id: user.id, status: "open" })
        .select()
        .single();

      if (createError) {
        console.error("Error creando conversación:", createError);
        setError(createError.message);
        setLoading(false);
        return;
      }

      setConversation(created);
      setLoading(false);
    };

    ensureConversation();
  }, [user]);

  return { conversation, loading, error };
}