// src/components/support/ChatWindow.tsx
import { useEffect, useRef, useState } from "react";
import { Send, X, MessageSquare, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useChatMessages } from "@/hooks/useChatMessages";
import { supabase } from "@/integrations/supabase/client";
import type { Message } from "@/types";

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
  currentUserRole: "customer" | "agent";
  variant?: "floating" | "inline";
  onClose?: () => void;
  headerTitle?: string;
  headerSubtitle?: string;
}

export function ChatWindow({
  conversationId,
  currentUserId,
  currentUserRole,
  variant = "floating",
  onClose,
  headerTitle = "Soporte T4",
  headerSubtitle = "Normalmente respondemos en minutos",
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [senderNames, setSenderNames] = useState<Record<string, string>>({});
  const { messages, loading, sendMessage } = useChatMessages(conversationId);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Resolver nombres de remitentes
  useEffect(() => {
    if (messages.length === 0) return;

    const uniqueIds = [...new Set(messages.map((m) => m.sender_id))].filter(
      (id) => !senderNames[id]
    );
    if (uniqueIds.length === 0) return;

    supabase
      .from("profiles")
      .select("user_id, full_name, company")
      .in("user_id", uniqueIds)
      .then(({ data }) => {
        if (!data) return;
        const map: Record<string, string> = { ...senderNames };
        data.forEach((p) => {
          map[p.user_id] = p.full_name || p.company || "Usuario";
        });
        setSenderNames(map);
      });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    const { error } = await sendMessage(input, currentUserId, currentUserRole);
    setSending(false);
    if (!error) setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

const containerClass =
  variant === "floating"
    ? [
        "fixed z-[1001] flex flex-col overflow-hidden bg-background rounded-2xl shadow-2xl border",
        // Móvil: casi pantalla completa, deja espacio abajo para los botones flotantes
        "inset-x-2 top-20 bottom-24",
        // Desktop: anclado abajo, altura limitada para no salirse
        "sm:inset-auto sm:bottom-24 sm:right-32 sm:w-[380px]",
        "sm:h-[min(540px,calc(100vh-7rem))]",  // altura máxima dinámica
      ].join(" ")
    : "w-full h-full flex flex-col bg-background";

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-sm leading-tight">{headerTitle}</p>
            <p className="text-xs opacity-80">{headerSubtitle}</p>
          </div>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {loading ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Cargando mensajes...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 text-muted-foreground">
            <MessageSquare className="h-10 w-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">No hay mensajes aún</p>
            <p className="text-xs mt-1">Escribe tu primer mensaje para empezar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isOwn = msg.sender_id === currentUserId;
              const name = senderNames[msg.sender_id] || "Usuario";
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-end gap-2",
                    isOwn ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className="text-[10px]">
                      {getInitials(name)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                      isOwn
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    )}
                  >
                    {!isOwn && (
                      <p className="text-[11px] font-semibold mb-0.5 opacity-70">
                        {name}
                        {msg.sender_role === "agent" && " · Soporte"}
                      </p>
                    )}
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="border-t p-3 flex items-center gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe un mensaje..."
          disabled={sending}
          className="flex-1"
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!input.trim() || sending}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}