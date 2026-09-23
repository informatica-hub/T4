// src/hooks/useSupportConversations.ts
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface ConversationWithCustomer {
  id: string;
  customer_id: string;
  assigned_agent_id: string | null;
  status: string;
  last_message_at: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  last_message?: string;
  unread_count?: number;
}

export function useSupportConversations() {
  const [conversations, setConversations] = useState<ConversationWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);

    const { data: convs, error: convError } = await supabase
      .from("conversations")
      .select("*")
      .in("status", ["open", "assigned"])
      .order("last_message_at", { ascending: false });

    if (convError) {
      console.error("Error cargando conversaciones:", convError);
      setError(convError.message);
      setLoading(false);
      return;
    }

    if (!convs || convs.length === 0) {
      setConversations([]);
      setLoading(false);
      return;
    }

    // Obtener info de los clientes
    const customerIds = [...new Set(convs.map((c) => c.customer_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, company")
      .in("user_id", customerIds);

    const profileMap = new Map(
      (profiles || []).map((p) => [p.user_id, p])
    );

    // Obtener el último mensaje de cada conversación
    const withDetails: ConversationWithCustomer[] = await Promise.all(
      convs.map(async (conv) => {
        const { data: lastMsg } = await supabase
          .from("messages")
          .select("content")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        const profile = profileMap.get(conv.customer_id);

        return {
          ...conv,
          customer_name: profile?.full_name || profile?.company || "Cliente",
          customer_email: "",
          last_message: lastMsg?.content,
        };
      })
    );

    setConversations(withDetails);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Realtime: refrescar cuando llegue mensaje nuevo o cambie conversación
  useEffect(() => {
    const channel = supabase
      .channel("admin:conversations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations" },
        () => { fetchAll(); }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => { fetchAll(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { conversations, loading, error, refresh: fetchAll };
}