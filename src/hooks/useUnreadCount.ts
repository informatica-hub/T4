// src/hooks/useUnreadCount.ts
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

const LAST_READ_KEY = "support_last_read_at";

export function useUnreadCount(
  conversationId: string | null,
  isWidgetOpen: boolean
) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastReadAt, setLastReadAt] = useState<string | null>(() =>
    localStorage.getItem(LAST_READ_KEY)
  );
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Cargar no leídos al inicio
  useEffect(() => {
    if (!conversationId) return;

    const fetchUnread = async () => {
      const { count } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", conversationId)
        .eq("sender_role", "agent")
        .gt("created_at", lastReadAt ?? "1970-01-01");

      setUnreadCount(count ?? 0);
    };

    fetchUnread();
  }, [conversationId, lastReadAt]);

  // Suscribirse a mensajes nuevos
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`unread:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const msg = payload.new as any;
          if (msg.sender_role === "agent" && !isWidgetOpen) {
            setUnreadCount((prev) => prev + 1);
          }
        }
      )
      .subscribe();

    channelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [conversationId, isWidgetOpen]);

  // Cuando se abre el widget, marcar como leído
  useEffect(() => {
    if (isWidgetOpen && conversationId) {
      const now = new Date().toISOString();
      localStorage.setItem(LAST_READ_KEY, now);
      setLastReadAt(now);
      setUnreadCount(0);
    }
  }, [isWidgetOpen, conversationId]);

  return { unreadCount, reset: () => setUnreadCount(0) };
}