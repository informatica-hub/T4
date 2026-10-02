import { supabase } from "@/integrations/supabase/client";

/**
 * Devuelve el id de una conversación abierta/asignada con el cliente,
 * o crea una nueva asignada al admin actual.
 */
export async function createConversationWithUser(
  targetUserId: string
): Promise<string> {
  // 1. ¿Ya hay una conversación activa con ese cliente?
  const { data: existing, error: existingError } = await supabase
    .from("conversations")
    .select("id")
    .eq("customer_id", targetUserId)
    .in("status", ["open", "assigned"])
    .order("last_message_at", { ascending: false, nullsFirst: false })
    .limit(1)
    .maybeSingle();

  if (existingError) {
    console.error("Error buscando conversación existente:", existingError);
  }

  if (existing?.id) return existing.id;

  // 2. Crear nueva conversación asignada al admin actual
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No hay sesión de admin activa");

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      customer_id: targetUserId,
      assigned_agent_id: user.id,
      status: "assigned",
      last_message_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}