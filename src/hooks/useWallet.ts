// src/hooks/useWallet.ts
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables } from "@/integrations/supabase/types";

type Movement = Tables<"movimientos">;

export function useWallet() {
  const { user } = useAuth();
  const [movements, setMovements] = useState<Movement[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Obtener movimientos del usuario
        const { data, error } = await supabase
          .from("movimientos")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setMovements((data as Movement[]) || []);

        // Obtener saldo
        const { data: saldo, error: saldoErr } = await supabase.rpc("get_saldo", {
          p_user_id: user.id,
        });

        if (saldoErr) throw saldoErr;
        setBalance(typeof saldo === "number" ? saldo : 0);
      } catch (error) {
        console.error("Error al cargar monedero:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return { movements, balance, loading };
}