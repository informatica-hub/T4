// src/hooks/useOpenConversationsCount.ts
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useOpenConversationsCount() {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    const { count: c, error } = await supabase
      .from("conversations")
      .select("*", { count: "exact", head: true })
      .in("status", ["open", "assigned"]);

    if (error) {
      console.error("Error contando conversaciones:", error);
      return;
    }
    setCount(c ?? 0);
  };

  useEffect(() => {
    fetchCount();

    // Suscribirse a Realtime para actualizar el contador
    const channel = supabase
      .channel("open-conversations-count")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversations" },
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