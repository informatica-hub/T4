// src/hooks/useTypingIndicator.ts
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface TypingUser {
  userId: string;
  userName: string;
}

export function useTypingIndicator(
  conversationId: string | null,
  currentUserId: string
) {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const timeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase.channel(`typing:${conversationId}`, {
      config: { broadcast: { self: false } },
    });

    channel
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        const { userId, userName } = payload as TypingUser;
        if (userId === currentUserId) return;

        // Agregar usuario a la lista
        setTypingUsers((prev) => {
          if (prev.some((u) => u.userId === userId)) return prev;
          return [...prev, { userId, userName }];
        });

        // Limpiar el timeout previo
        if (timeoutsRef.current[userId]) {
          clearTimeout(timeoutsRef.current[userId]);
        }

        // Quitar después de 3 segundos de inactividad
        timeoutsRef.current[userId] = setTimeout(() => {
          setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
          delete timeoutsRef.current[userId];
        }, 3000);
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      // Limpiar timeouts
      Object.values(timeoutsRef.current).forEach(clearTimeout);
      timeoutsRef.current = {};

      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [conversationId, currentUserId]);

  const broadcastTyping = (userName: string) => {
    if (!channelRef.current) return;
    channelRef.current.send({
      type: "broadcast",
      event: "typing",
      payload: { userId: currentUserId, userName },
    });
  };

  return { typingUsers, broadcastTyping };
}