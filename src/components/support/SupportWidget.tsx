// src/components/support/SupportWidget.tsx
import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSupportConversation } from "@/hooks/useSupportConversation";
import { ChatWindow } from "./ChatWindow";
import { Badge } from "@/components/ui/badge";

export function SupportWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { conversation, loading } = useSupportConversation();

  // No renderizar si no hay sesión
  if (!user) return null;

  // No mostrar burbuja si la conversación está cargando
  if (loading || !conversation) {
    return null;
  }

  return (
    <>
      {/* Burbuja flotante */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-72 right-14 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
          aria-label="Abrir chat de soporte"
        >
          <MessageSquare className="h-6 w-6" />
          <span className="absolute right-full mr-3 px-3 py-2 bg-foreground text-background text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat Online
          </span>
          <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-25" />
        </button>
      )}

      {/* Ventana de chat */}
      {open && (
        <ChatWindow
          conversationId={conversation.id}
          currentUserId={user.id}
          currentUserRole="customer"
          variant="floating"
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}