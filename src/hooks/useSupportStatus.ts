// src/hooks/useSupportStatus.ts
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SupportStatus = "online" | "away";

interface UseSupportStatusReturn {
  status: SupportStatus | null;
  loading: boolean;
  setStatus: (status: SupportStatus | null) => Promise<{ error: string | null }>;
}

export function useSupportStatus(): UseSupportStatusReturn {
  const [status, setStatusState] = useState<SupportStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      const { data, error } = await supabase
        .from("support_settings")
        .select("status_override")
        .eq("id", 1)
        .maybeSingle();

      if (error) {
        console.error("Error cargando estado de soporte:", error);
        setLoading(false);
        return;
      }

      setStatusState((data?.status_override as SupportStatus) || null);
      setLoading(false);
    };

    fetchStatus();

    // ✅ El .on() va ANTES del .subscribe()
    // Nombre único por instancia para evitar conflictos
    const channelName = `support-settings:${Math.random().toString(36).slice(2)}`;

    const channel = supabase
    .channel(channelName)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "support_settings" },
        (payload) => {
          const newStatus = (payload.new as { status_override?: string })
            ?.status_override;
          setStatusState((newStatus as SupportStatus) || null);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const setStatus = async (newStatus: SupportStatus | null) => {
    const { error } = await supabase
      .from("support_settings")
      .update({
        status_override: newStatus,
        override_updated_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    if (error) {
      console.error("Error actualizando estado:", error);
      return { error: error.message };
    }

    setStatusState(newStatus);
    return { error: null };
  };

  return { status, loading, setStatus };
}