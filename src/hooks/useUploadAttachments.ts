// src/hooks/useUploadAttachments.ts
import { supabase } from "@/integrations/supabase/client";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function uploadAttachments(
  messageId: string,
  files: File[],
  userId: string
): Promise<{ error: string | null }> {
  for (const file of files) {
    // 1. Validar tamaño
    if (file.size > MAX_SIZE) {
      console.error(`Archivo demasiado grande: ${file.name}`);
      return { error: `${file.name} excede el límite de 10 MB` };
    }

    // 2. Generar path único: {user_id}/{uuid}.{ext}
    const ext = file.name.split(".").pop() || "bin";
    const uuid = crypto.randomUUID();
    const path = `${userId}/${uuid}.${ext}`;

    // 3. Subir a Storage
    const { error: uploadError } = await supabase.storage
      .from("chat-attachments")
      .upload(path, file, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error subiendo archivo:", uploadError);
      return { error: `Error subiendo ${file.name}: ${uploadError.message}` };
    }

    // 4. Registrar en la tabla
    const { error: dbError } = await supabase
      .from("message_attachments")
      .insert({
        message_id: messageId,
        file_path: path,
        file_name: file.name,
        mime_type: file.type || "application/octet-stream",
        size_bytes: file.size,
      });

    if (dbError) {
      console.error("Error registrando adjunto:", dbError);
      return { error: dbError.message };
    }
  }

  return { error: null };
}