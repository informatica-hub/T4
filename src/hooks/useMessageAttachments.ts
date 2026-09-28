// src/hooks/useMessageAttachments.ts
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Attachment {
  id: string;
  message_id: string;
  file_path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
  signedUrl?: string;
}

export function useMessageAttachments(messageIds: string[]) {
  const [attachments, setAttachments] = useState<Record<string, Attachment[]>>({});
  const [loading, setLoading] = useState(false);

  // Dependencia estable: string con todos los IDs ordenados
  const idsKey = [...messageIds].sort().join(",");

  useEffect(() => {
    if (!idsKey) {
      setAttachments({});
      return;
    }

    const ids = idsKey.split(",");

    const fetchAttachments = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("message_attachments")
        .select("*")
        .in("message_id", ids);

      if (error) {
        console.error("Error cargando adjuntos:", error);
        setLoading(false);
        return;
      }

      // Generar URLs firmadas (bucket es privado)
      const withUrls: Attachment[] = await Promise.all(
        (data || []).map(async (att) => {
          const { data: signed } = await supabase.storage
            .from("chat-attachments")
            .createSignedUrl(att.file_path, 3600); // 1 hora

          return { ...att, signedUrl: signed?.signedUrl };
        })
      );

      // Agrupar por message_id
      const grouped: Record<string, Attachment[]> = {};
      withUrls.forEach((att) => {
        if (!grouped[att.message_id]) grouped[att.message_id] = [];
        grouped[att.message_id].push(att);
      });

      setAttachments(grouped);
      setLoading(false);
    };

    fetchAttachments();
  }, [idsKey]);

  return { attachments, loading };
}