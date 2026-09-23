// src/hooks/useChatMessages.ts
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { Message, ChatMessage } from "@/types";

export function useChatMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Cargar historial
  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchMessages = async () => {
      const { data, error: fetchError } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (fetchError) {
        console.error("Error cargando mensajes:", fetchError);
        setError(fetchError.message);
      } else {
        setMessages(data || []);
      }
      setLoading(false);
    };

    fetchMessages();
  }, [conversationId]);

  // Suscribirse a nuevos mensajes
  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => {
            // Evitar duplicados por si acaso
            if (prev.some((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [conversationId]);

  const sendMessage = async (
    content: string,
    senderId: string,
    senderRole: "customer" | "agent"
  ) => {
    if (!conversationId || !content.trim()) return { error: "Mensaje vacío" };

    const { error: insertError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        sender_role: senderRole,
        content: content.trim(),
      });

    if (insertError) {
      console.error("Error enviando mensaje:", insertError);
      return { error: insertError.message };
    }

    return { error: null };
  };

  return { messages, loading, error, sendMessage };
}