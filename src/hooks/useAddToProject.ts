import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProject, ProjectItem } from "@/contexts/ProjectContext";
import { toast } from "sonner";

const PENDING_KEY = "t4-pending-add";

export function consumePendingAdd(addItem: (i: ProjectItem) => void) {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(PENDING_KEY);
    const item = JSON.parse(raw) as ProjectItem & { redirect?: string };
    if (item?.product_id && item?.product_name) {
      addItem({ product_id: item.product_id, product_name: item.product_name });
      toast.success(`${item.product_name} agregado a tu proyecto`);
      return item.redirect || null;
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Returns a function that adds a product to the project if the user is authenticated.
 * If not authenticated, stores the pending item and redirects to /auth.
 */
export function useAddToProject() {
  const { user } = useAuth();
  const { addItem } = useProject();
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (item: ProjectItem, opts?: { redirectAfter?: string; silent?: boolean }) => {
      if (user) {
        addItem(item);
        if (!opts?.silent) toast.success(`${item.product_name} agregado a tu proyecto`);
        return true;
      }
      try {
        sessionStorage.setItem(
          PENDING_KEY,
          JSON.stringify({ ...item, redirect: opts?.redirectAfter }),
        );
      } catch {
        // ignore
      }
      const redirect = opts?.redirectAfter || location.pathname;
      toast.info("Inicia sesión o crea una cuenta para guardar tu proyecto");
      navigate(`/auth?redirect=${encodeURIComponent(redirect)}`);
      return false;
    },
    [user, addItem, navigate, location.pathname],
  );
}
