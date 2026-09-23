// src/pages/admin/SupportDashboard.tsx
import { useState } from "react";
import { MessageSquare, User as UserIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSupportConversations } from "@/hooks/useSupportConversations";
import { ChatWindow } from "@/components/support/ChatWindow";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function SupportDashboard() {
  const { user } = useAuth();
  const { conversations, loading } = useSupportConversations();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = conversations.find((c) => c.id === selectedId);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  if (!user) return null;

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar: lista de conversaciones */}
      <aside className="w-80 border-r bg-muted/30 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Soporte
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {conversations.length} conversación{conversations.length !== 1 && "es"} activa{conversations.length !== 1 && "s"}
          </p>
        </div>

        <ScrollArea className="flex-1">
          {loading ? (
            <div className="p-4 text-sm text-muted-foreground">Cargando...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No hay conversaciones activas
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors",
                    selectedId === conv.id
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-muted"
                  )}
                >
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="text-xs">
                      {getInitials(conv.customer_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm truncate">
                        {conv.customer_name}
                      </p>
                      <Badge
                        variant={conv.status === "open" ? "default" : "secondary"}
                        className="text-[10px] px-1.5 py-0 shrink-0"
                      >
                        {conv.status === "open" ? "Nuevo" : "En curso"}
                      </Badge>
                    </div>
                    {conv.last_message && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {conv.last_message}
                      </p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {new Date(conv.last_message_at).toLocaleString("es-MX", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </aside>

      {/* Main: chat */}
      <main className="flex-1 flex flex-col">
        {selected ? (
          <ChatWindow
            key={selected.id}
            conversationId={selected.id}
            currentUserId={user.id}
            currentUserRole="agent"
            variant="inline"
            headerTitle={selected.customer_name}
            headerSubtitle={`Cliente · ${selected.status}`}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <UserIcon className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm">Selecciona una conversación para comenzar</p>
          </div>
        )}
      </main>
    </div>
  );
}