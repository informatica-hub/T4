// src/components/support/SupportWidget.tsx
import { useState, useEffect  } from "react";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSupportConversation } from "@/hooks/useSupportConversation";
import { useUnreadCount } from "@/hooks/useUnreadCount";
import { ChatWindow } from "./ChatWindow";



interface SupportWidgetProps {
  initialOpen?: boolean;   // ← nueva prop
}


export function SupportWidget({ initialOpen = false }: SupportWidgetProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(initialOpen);
  const { conversation, loading, createNewConversation } =
    useSupportConversation(open);
  const { unreadCount } = useUnreadCount(conversation?.id ?? null, open);

  
  // ✅ Si cambia `initialOpen` a true (por navegación), abrir el chat
  useEffect(() => {
    if (initialOpen) {
      setOpen(true);
    }
  }, [initialOpen]);

  // No renderizar si no hay sesión
  if (!user) return null;

  // Solo bloquear si el chat está abierto y aún está cargando la conversación
  if (open && loading) {
    return (
      <div className="fixed bottom-48 right-14 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg">
        <span className="animate-spin">⏳</span>
      </div>
    );
  }

  const handleStartNew = async () => {
    await createNewConversation();
  };

  return (
    <>
      {/* Burbuja flotante */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-48 right-14 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
          aria-label="Abrir chat de soporte"
        >
          <MessageSquare className="h-6 w-6" />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}

          <span className="absolute right-full mr-3 px-3 py-2 bg-foreground text-background text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat Online
          </span>

          <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-25" />
        </button>
      )}

      {/* Ventana de chat — solo si ya hay conversación cargada */}
      {open && conversation && (
        <ChatWindow
          key={conversation.id}
          conversationId={conversation.id}
          currentUserId={user.id}
          currentUserRole="customer"
          variant="floating"
          onClose={() => setOpen(false)}
          disabled={conversation.status === "closed"}
          onStartNewConversation={handleStartNew}
        />
      )}
    </>
  );
}