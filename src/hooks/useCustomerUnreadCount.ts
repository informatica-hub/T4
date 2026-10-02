// src/hooks/useCustomerUnreadCount.ts
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

/**
 * Cuenta los mensajes del AGENTE posteriores al último mensaje del CLIENTE
 * en la conversación activa.
 *
 * Reglas de negocio:
 *  - Si el cliente nunca ha escrito → cuenta todos los del agente.
 *  - Si el cliente escribió después → 0.
 *  - Si la conversación está cerrada → 0.
 *  - Si no hay conversationId → 0.
 *
 * NO se resetea al abrir el widget. Solo se resetea cuando:
 *   1. El cliente envía un mensaje (sube el cutoff de MAX(created_at) customer).
 *   2. La conversación se cierra (status = 'closed').
 *
 * Se actualiza en vivo vía Realtime (INSERT en messages, UPDATE en conversations).
 */
export function useCustomerUnreadCount(conversationId: string | null) {
  const [unreadCount, setUnreadCount] = useState(0);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    let cancelled = false;

    const recompute = async () => {
      if (!conversationId) {
        if (!cancelled) setUnreadCount(0);
        return;
      }

      // 1. Verificar que la conversación siga activa
      const { data: conv, error: convErr } = await supabase
        .from("conversations")
        .select("status")
        .eq("id", conversationId)
        .maybeSingle();

      if (cancelled) return;

      if (convErr || !conv || conv.status === "closed") {
        setUnreadCount(0);
        return;
      }

      // 2. Último mensaje del cliente (cutoff)
      const { data: lastCustomer } = await supabase
        .from("messages")
        .select("created_at")
        .eq("conversation_id", conversationId)
        .eq("sender_role", "customer")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cancelled) return;

      const cutoff = lastCustomer?.created_at ?? "1970-01-01T00:00:00Z";

      // 3. Contar mensajes del agente posteriores al cutoff
      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", conversationId)
        .eq("sender_role", "agent")
        .gt("created_at", cutoff);

      if (cancelled) return;
      setUnreadCount(count ?? 0);
    };

    // Carga inicial
    recompute();

    // Realtime
    if (!conversationId) {
      return () => {
        cancelled = true;
      };
    }

    const channel = supabase
      .channel(`customer-unread:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => recompute()
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
          filter: `id=eq.${conversationId}`,
        },
        () => recompute()
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      cancelled = true;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [conversationId]);

  return { unreadCount };
}