import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AdminUserOption {
  user_id: string;
  email: string;
  full_name: string | null;
  company: string | null;
}

export function useAdminUserList(enabled: boolean) {
  const [users, setUsers] = useState<AdminUserOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    setLoading(true);
    setError(null);

    supabase.rpc("list_users_for_admin").then(({ data, error }) => {
      if (cancelled) return;
      if (error) {
        console.error("list_users_for_admin error:", error);
        setError(error.message);
        setUsers([]);
      } else {
        setUsers((data ?? []) as AdminUserOption[]);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { users, loading, error };
}