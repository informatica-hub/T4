import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Movement } from "@/components/wallet/MovementsTable";


export interface AdminUser {
  id: string;
  user_id: string;
  full_name: string | null;
  company: string | null;
  phone?: string | null;
  created_at?: string;
  updated_at?: string;
}

export function useUserAccount() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(false);

  // 1. Cargar lista de usuarios desde Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, user_id, full_name, company")
          .order("full_name", { ascending: true });

        if (error) {
          console.error("Error cargando usuarios:", error);
          setUsers([]);
          return;
        }

        setUsers((data as unknown as AdminUser[]) || []);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  // 2. Cargar movimientos del usuario seleccionado
  useEffect(() => {
    if (!selectedUserId) {
      setBalance(0);
      setMovements([]);
      return;
    }

    const fetchAccount = async () => {
      setLoadingAccount(true);
      try {
        const { data, error } = await supabase
          .from("movimientos")
          .select("*")
          .eq("user_id", selectedUserId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error cargando movimientos:", error);
          setMovements([]);
          setBalance(0);
          return;
        }

        const movs = (data as unknown as Movement[]) || [];

        // Calcular saldo sumando montos
        // (Cargo ya viene con signo negativo desde tu handleSubmit)
        const total = movs.reduce((acc, m) => acc + Number(m.monto), 0);

        setMovements(movs);
        setBalance(total);
      } finally {
        setLoadingAccount(false);
      }
    };
    fetchAccount();
  }, [selectedUserId]);

  return {
    users,
    selectedUserId,
    setSelectedUserId,
    balance,
    movements,
    loadingUsers,
    loadingAccount,
  };
}