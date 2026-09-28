// src/hooks/useSupportConversation.ts
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Conversation } from "@/types";

export function useSupportConversation(enabled: boolean = true) {
  const { user } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  // ==========================================
  // CARGAR O CREAR LA CONVERSACIÓN
  // ==========================================
  const ensureConversation = useCallback(async () => {
    if (!user) {
      setConversation(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Buscar conversación abierta
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

    // No existe → crear una nueva
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
  }, [user]);

  // ✅ Solo cargar/crear si `enabled` es true
  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    ensureConversation();
  }, [enabled, ensureConversation]);

  // ==========================================
  // ESCUCHAR CAMBIOS EN LA CONVERSACIÓN
  // ==========================================
  useEffect(() => {
    if (!enabled || !conversation?.id) return;

    const channel = supabase
      .channel(`conversation:${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
          filter: `id=eq.${conversation.id}`,
        },
        (payload) => {
          const updated = payload.new as Conversation;
          setConversation(updated);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, conversation?.id]);

  // ==========================================
  // CREAR NUEVA CONVERSACIÓN EXPLÍCITAMENTE
  // ==========================================
  const createNewConversation = async () => {
    if (!user) return { error: "No hay usuario autenticado" };

    setLoading(true);
    setError(null);

    const { data: created, error: createError } = await supabase
      .from("conversations")
      .insert({ customer_id: user.id, status: "open" })
      .select()
      .single();

    if (createError) {
      console.error("Error creando conversación:", createError);
      setError(createError.message);
      setLoading(false);
      return { error: createError.message };
    }

    setConversation(created);
    setLoading(false);
    return { error: null };
  };

  return {
    conversation,
    loading,
    error,
    createNewConversation,
  };
}