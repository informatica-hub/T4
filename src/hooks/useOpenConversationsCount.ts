// src/hooks/useOpenConversationsCount.ts
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useOpenConversationsCount() {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    // 1. Traer todas las conversaciones activas
    const { data: conversations, error: convError } = await supabase
      .from("conversations")
      .select("id")
      .in("status", ["open", "assigned"]);

    if (convError) {
      console.error("Error contando conversaciones:", convError);
      return;
    }

    if (!conversations || conversations.length === 0) {
      setCount(0);
      return;
    }

    const conversationIds = conversations.map((c) => c.id);

    // 2. Traer los mensajes de esas conversaciones (solo el conversation_id)
    const { data: messages, error: msgError } = await supabase
      .from("messages")
      .select("conversation_id")
      .in("conversation_id", conversationIds);

    if (msgError) {
      console.error("Error contando mensajes:", msgError);
      return;
    }

    // 3. Contar conversaciones ÚNICAS que tienen al menos 1 mensaje
    const uniqueWithMessages = new Set(
      (messages || []).map((m) => m.conversation_id)
    );
    setCount(uniqueWithMessages.size);
  };

  useEffect(() => {
    fetchCount();

    // Realtime: actualizar cuando cambien conversaciones o mensajes
    const channel = supabase
      .channel(`open-conversations-count:${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations" },
        () => {
          fetchCount();
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => {
          fetchCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return count;
}