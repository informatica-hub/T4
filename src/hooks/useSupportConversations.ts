// src/hooks/useSupportConversations.ts
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getClosedCutoffISO } from "@/lib/support/constants";

export interface ConversationWithCustomer {
  id: string;
  customer_id: string;
  assigned_agent_id: string | null;
  status: string;
  last_message_at: string;
  created_at: string;
  closed_at?: string;
  customer_name: string;
  customer_email: string;
  last_message?: string;
  last_message_role?: "customer" | "agent"; 
  unread_count?: number;
  last_agent_name?: string;
}

// Función auxiliar para reproducir el sonido de notificación
function playNotificationSound() {
  try {
    const audioContext = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.3
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (err) {
    console.error("Error playing sound:", err);
  }
}

export function useSupportConversations() {
  const [conversations, setConversations] = useState<ConversationWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ==========================================
  // CARGAR TODAS las conversaciones (activas + cerradas recientes)
  // Las cerradas de más de 30 días se excluyen con el filtro .or()
  // ==========================================
  const fetchAll = async () => {
    setLoading(true);
    setError(null);

    const { data: convs, error: convError } = await supabase
      .from("conversations")
      .select("*")
      .or(
        `status.in.(open,assigned),and(status.eq.closed,closed_at.gte.${getClosedCutoffISO()})`
      )
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

    // 🆕 Obtener email de cada cliente vía RPC (solo admins pueden)
    const emailMap = new Map<string, string>();
    await Promise.all(
      customerIds.map(async (id) => {
        const { data: email } = await supabase.rpc("get_user_email", {
          user_uuid: id,
        });
        if (email) emailMap.set(id, email);
      })
    );

    // Obtener el último mensaje de cada conversación
    const withDetails: ConversationWithCustomer[] = await Promise.all(
      convs.map(async (conv) => {
        // Último mensaje (para preview + saber quién lo envió)
        // 👈 NUEVO: ahora traemos también sender_role
        const { data: lastMsg } = await supabase
          .from("messages")
          .select("content, sender_role")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        // Último agente que respondió (si hay)
        const { data: lastAgentMsg } = await supabase
          .from("messages")
          .select("sender_id")
          .eq("conversation_id", conv.id)
          .eq("sender_role", "agent")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        const profile = profileMap.get(conv.customer_id);

        // Resolver el nombre del último agente
        let lastAgentName: string | undefined;
        if (lastAgentMsg?.sender_id) {
          const { data: agentProfile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("user_id", lastAgentMsg.sender_id)
            .maybeSingle();
          lastAgentName = agentProfile?.full_name || undefined;
        }

        return {
          ...conv,
          customer_name: profile?.full_name || profile?.company || "Cliente",
          customer_email: emailMap.get(conv.customer_id) ?? "",
          last_message: lastMsg?.content,
          // 👈 NUEVO: guardamos el rol del último mensaje
          last_message_role: (lastMsg?.sender_role as
            | "customer"
            | "agent"
            | undefined) ?? undefined,
          last_agent_name: lastAgentName,
        };
      })
    );

    setConversations(withDetails);
    setLoading(false);
  };

  // ==========================================
  // CERRAR CONVERSACIÓN
  // ==========================================
  const closeConversation = async (
    conversationId: string,
    agentId: string
  ) => {
    // 1. Insertar mensaje de sistema en el chat
    const { error: msgError } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: agentId,
      sender_role: "agent",
      content: "— Conversación cerrada por el equipo de soporte —",
    });

    if (msgError) {
      console.error("Error insertando mensaje de cierre:", msgError);
    }

    // 2. Actualizar el estado + closed_at
    const closedAt = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("conversations")
      .update({
        status: "closed",
        closed_at: closedAt,
      })
      .eq("id", conversationId);

    if (updateError) {
      console.error("Error cerrando conversación:", updateError);
      return { error: updateError.message };
    }

    // 3. Actualizar el estado local (mantener en la lista con status="closed")
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, status: "closed", closed_at: closedAt }
          : c
      )
    );

    return { error: null };
  };

  // ==========================================
  // CARGAR AL MONTAR
  // ==========================================
  useEffect(() => {
    fetchAll();
  }, []);

  // ==========================================
  // REALTIME: nuevos mensajes y cambios en conversaciones
  // ==========================================
  useEffect(() => {
    const channel = supabase
      .channel("admin:conversations")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations" },
        () => {
          fetchAll();
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          fetchAll();

          // 🔊 Sonido
          playNotificationSound();

          // 📢 Notificación del navegador
          const msg = payload.new as any;
          if (
            msg.sender_role === "customer" &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification("Nuevo mensaje de soporte", {
              body: msg.content.slice(0, 80),
              icon: "/favicon.ico",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ==========================================
  // RETURN
  // ==========================================
  return {
    conversations,
    loading,
    error,
    refresh: fetchAll,
    closeConversation,
  };
}