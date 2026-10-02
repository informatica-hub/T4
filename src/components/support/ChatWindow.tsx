// src/components/support/ChatWindow.tsx
import { useEffect, useMemo, useRef, useState, Fragment } from "react";
import {
  Send,
  X,
  MessageSquare,
  Paperclip,
  FileText,
  X as XIcon,
  Image as ImageIcon,
  File as FileIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { useMessageAttachments } from "@/hooks/useMessageAttachments";
import { uploadAttachments } from "@/hooks/useUploadAttachments";
import { supabase } from "@/integrations/supabase/client";
import { useSupportStatus } from "@/hooks/useSupportStatus";
import { formatMessageTimestamp } from '@/lib/formatTime';

interface ChatWindowProps {
  conversationId: string;
  currentUserId: string;
  currentUserRole: "customer" | "agent";
  variant?: "floating" | "inline";
  onClose?: () => void;
  headerTitle?: string;
  headerSubtitle?: string;
  disabled?: boolean;
  onStartNewConversation?: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// ==========================================
// Función auxiliar: verifica si estamos en horario de atención
// Lunes a Viernes, 9:00 a.m. — 6:00 p.m. (hora local del navegador)
// ==========================================
const isBusinessHours = (): boolean => {
  const now = new Date();
  const day = now.getDay();     // 0 = domingo, 1 = lunes, ..., 6 = sábado
  const hour = now.getHours();  // 0-23

  const isWeekday = day >= 1 && day <= 5;
  const isWithinHours = hour >= 9 && hour < 18;

  return isWeekday && isWithinHours;
};

export function ChatWindow({
  conversationId,
  currentUserId,
  currentUserRole,
  variant = "floating",
  onClose,
  headerTitle = "Soporte T4",
  headerSubtitle = "Normalmente respondemos en minutos",
  disabled = false,
  onStartNewConversation,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [senderNames, setSenderNames] = useState<Record<string, string>>({});
  const [inHours, setInHours] = useState<boolean>(() => isBusinessHours());

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastTypingRef = useRef<number>(0);

  const { messages, loading, sendMessage } = useChatMessages(conversationId);
  const { typingUsers, broadcastTyping } = useTypingIndicator(
    conversationId,
    currentUserId
  );

  const messageIds = messages.map((m) => m.id);
  const { attachments } = useMessageAttachments(messageIds);

  const currentUserName =
    currentUserRole === "agent" ? "Soporte T4" : "Cliente";

  const { status: statusOverride } = useSupportStatus();

  // ==========================================
  // SEPARADORES DE FECHA
  // Precalcula qué mensajes deben llevar separador de día.
  // Solo se muestran si la conversación abarca más de un día.
  // ==========================================
  const multipleDays = useMemo(() => {
    if (messages.length === 0) return false;
    const first = new Date(messages[0].created_at).toDateString();
    const last = new Date(
      messages[messages.length - 1].created_at
    ).toDateString();
    return first !== last;
  }, [messages]);

  const messagesWithSeparators = useMemo(() => {
    let lastDate = "";
    return messages.map((msg) => {
      const msgDate = new Date(msg.created_at).toDateString();
      const showDateSeparator = msgDate !== lastDate;
      lastDate = msgDate;
      return { msg, showDateSeparator };
    });
  }, [messages]);

  // ==========================================
  // AUTO-SCROLL al último mensaje
  // ==========================================
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typingUsers]);

  // ==========================================
  // ACTUALIZAR "inHours" cada minuto
  // ==========================================
  useEffect(() => {
    const interval = setInterval(() => {
      setInHours(isBusinessHours());
    }, 60 * 1000); // 60,000 ms = 1 minuto

    return () => clearInterval(interval);
  }, []);

  // ==========================================
  // RESOLVER NOMBRES de los remitentes
  // ==========================================
useEffect(() => {
  if (messages.length === 0) return;

  const uniqueIds = [...new Set(messages.map((m) => m.sender_id))].filter(
    (id) => !senderNames[id] || senderNames[id] === "Usuario"
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
}, [messages, senderNames]);

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleInputChange = (value: string) => {
    setInput(value);
    const now = Date.now();
    if (now - lastTypingRef.current > 2000) {
      lastTypingRef.current = now;
      broadcastTyping(currentUserName);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid: File[] = [];
    const invalid: File[] = [];

    files.forEach((f) => {
      if (f.size <= MAX_FILE_SIZE) valid.push(f);
      else invalid.push(f);
    });

    if (invalid.length > 0) {
      alert(
        `Los siguientes archivos exceden 10 MB y no se agregaron:\n${invalid
          .map((f) => f.name)
          .join("\n")}`
      );
    }

    setSelectedFiles((prev) => [...prev, ...valid]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSend = async () => {
    if (
      (!input.trim() && selectedFiles.length === 0) ||
      sending ||
      uploading ||
      disabled
    ) {
      return;
    }

    setSending(true);

    const content = input.trim() || "(Archivos adjuntos)";
    const { error, messageId } = await sendMessage(
      content,
      currentUserId,
      currentUserRole
    );

    if (error || !messageId) {
      console.error("Error enviando mensaje:", error);
      setSending(false);
      return;
    }

    if (selectedFiles.length > 0) {
      setUploading(true);
      const { error: uploadError } = await uploadAttachments(
        messageId,
        selectedFiles,
        currentUserId
      );
      setUploading(false);

      if (uploadError) {
        console.error("Error subiendo adjuntos:", uploadError);
      }
    }


          // ✅ NUEVO: notificar al cliente por email si es el primer mensaje del agente
          //    en una conversación donde el cliente aún no ha escrito.
          //    Fire-and-forget: no bloquea el reset del input ni la UI.
          if (currentUserRole === "agent") {
            supabase.functions
              .invoke("notify-customer-new-message", {
                body: { conversationId, messageId },
              })
              .then(({ error: fnError }) => {
                if (fnError) console.warn("[notify-customer] fallo:", fnError);
              })
              .catch((e) => console.warn("[notify-customer] excepción:", e));
          }



    setInput("");
    setSelectedFiles([]);
    setSending(false);
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

  // ==========================================
  // ESTILOS DEL CONTENEDOR
  // ==========================================
  const containerClass =
    variant === "floating"
      ? [
          "fixed z-[1001] flex flex-col overflow-hidden bg-background rounded-2xl shadow-2xl border",
          "inset-x-2 top-20 bottom-24",
          "sm:inset-auto sm:bottom-24 sm:right-28 sm:w-[380px]",
          "sm:h-[min(540px,calc(100vh-7rem))]",
        ].join(" ")
      : "w-full h-full flex flex-col bg-background overflow-hidden";

  return (
    <div className={containerClass}>
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground shrink-0">
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

      {/* LEYENDA DE HORARIO — solo para clientes y si la conversación está activa */}
          {currentUserRole === "customer" && !disabled && (
            <div className="px-4 py-2.5 bg-muted/50 border-b text-[11px] text-muted-foreground text-center leading-relaxed shrink-0">
              {/* Estado: Fuera de horario (automático, prioridad máxima) */}
              {!inHours ? (
                <>
                  <div className="font-medium text-foreground/80 mb-0.5">
                    ⚫ Fuera de horario
                  </div>
                  <div>Lunes a viernes · 9:00–18:00 h.</div>
                  <div className="mt-0.5 text-[10px]">
                    Tu mensaje queda guardado. Te responderemos lo antes posible.
                  </div>
                </>
              ) : statusOverride === "away" ? (
                /* Estado: Regresamos en un momento (override manual) */
                <>
                  <div className="font-medium text-foreground/80 mb-0.5 flex items-center justify-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                    Regresamos en un momento
                  </div>
                  <div>Lunes a viernes · 9:00–18:00 h.</div>
                  <div className="mt-0.5 text-[10px]">
                    Tu mensaje queda guardado. Te responderemos lo antes posible.
                  </div>
                </>
              ) : (
                /* Estado: En línea (automático o forzado) */
                <>
                  <div className="font-medium text-foreground/80 mb-0.5 flex items-center justify-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Estamos en línea
                  </div>
                  <div>Lunes a viernes · 9:00–18:00 h.</div>
                </>
              )}
            </div>
          )}

      {/* MENSAJES */}
      <ScrollArea className="flex-1 min-h-0 p-4" ref={scrollRef}>
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
            {messagesWithSeparators.map(({ msg, showDateSeparator }) => {
              // Orientación por ROL, no por usuario:
              // - Vista agente → mensajes de agentes a la derecha
              // - Vista cliente → mensajes del cliente a la derecha
              const isOwn = msg.sender_role === currentUserRole;
              const name = senderNames[msg.sender_id] || "Usuario";
              const msgAttachments = attachments[msg.id] || [];

              return (
                <Fragment key={msg.id}>
                  {/* SEPARADOR DE FECHA — solo si la conversación abarca más de un día */}
                  {showDateSeparator && multipleDays && (
                    <div className="flex justify-center my-3">
                      <span className="text-[11px] bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full capitalize">
                        {new Date(msg.created_at).toLocaleDateString("es-MX", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </span>
                    </div>
                  )}

                  <div
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
                      {/* Nombre: se muestra cuando el mensaje viene del "otro lado",
                          o cuando es de un agente (para distinguir qué admin respondió). */}
                      {(!isOwn || msg.sender_role === "agent") && (
                        <p className="text-[11px] font-semibold mb-0.5 opacity-70">
                          {name.split(" ")[0]}
                          {msg.sender_role === "agent" && " · Soporte"}
                        </p>
                      )}
                      <p className="whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>

                      {/* ADJUNTOS */}
                      {msgAttachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {msgAttachments.map((att) => {
                            const isImage = att.mime_type.startsWith("image/");
                            const canDownload = !!att.signedUrl;

                            // Sin URL firmada → bloque deshabilitado, sin link roto
                            if (!canDownload) {
                              return (
                                <div
                                  key={att.id}
                                  className={cn(
                                    "flex items-center gap-2 rounded-lg p-2 text-xs opacity-50 cursor-not-allowed",
                                    isOwn
                                      ? "bg-primary-foreground/10"
                                      : "bg-background/50"
                                  )}
                                  title="Archivo no disponible"
                                >
                                  {isImage ? (
                                    <ImageIcon className="h-4 w-4 shrink-0" />
                                  ) : (
                                    <FileIcon className="h-4 w-4 shrink-0" />
                                  )}
                                  <span className="truncate flex-1">
                                    {att.file_name}
                                  </span>
                                  <span className="text-[10px] opacity-70 shrink-0">
                                    No disponible
                                  </span>
                                </div>
                              );
                            }

                            return (
                              <a
                                key={att.id}
                                href={att.signedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                  "flex items-center gap-2 rounded-lg p-2 text-xs transition-colors",
                                  isOwn
                                    ? "bg-primary-foreground/10 hover:bg-primary-foreground/20"
                                    : "bg-background/50 hover:bg-background/80"
                                )}
                              >
                                {isImage ? (
                                  <ImageIcon className="h-4 w-4 shrink-0" />
                                ) : (
                                  <FileIcon className="h-4 w-4 shrink-0" />
                                )}
                                <span className="truncate flex-1">
                                  {att.file_name}
                                </span>
                                <span className="text-[10px] opacity-70 shrink-0">
                                  {formatFileSize(att.size_bytes)}
                                </span>
                              </a>
                            );
                          })}
                        </div>
                      )}

                      {/* HORA DEL MENSAJE */}
                      <span
                        className={cn(
                          "block text-[10px] mt-1 text-right tabular-nums",
                          isOwn
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        )}
                        title={new Date(msg.created_at).toLocaleString("es-MX")}
                      >
                        {formatMessageTimestamp(msg.created_at)}
                      </span>
                    </div>
                  </div>
                </Fragment>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* INDICADOR "ESCRIBIENDO..." */}
      {!disabled && typingUsers.length > 0 && (
        <div className="px-4 py-1 text-xs text-muted-foreground italic border-t shrink-0">
          {typingUsers.length === 1
            ? `${typingUsers[0].userName} está escribiendo...`
            : `${typingUsers.length} personas están escribiendo...`}
        </div>
      )}

      {/* INDICADOR DE SUBIDA */}
      {uploading && (
        <div className="px-4 py-1 text-xs text-muted-foreground italic border-t shrink-0">
          Subiendo archivos...
        </div>
      )}

      {/* AVISO CONVERSACIÓN CERRADA */}
      {disabled && (
        <div className="px-4 py-3 text-xs text-center text-muted-foreground bg-muted/50 border-t shrink-0 space-y-2">
          <p>
            Esta conversación fue cerrada
            {currentUserRole === "customer" &&
              ". Inicia una nueva para seguir hablando."}
          </p>
          {currentUserRole === "customer" && onStartNewConversation && (
            <Button
              size="sm"
              onClick={onStartNewConversation}
              className="w-full"
            >
              Iniciar nueva conversación
            </Button>
          )}
        </div>
      )}

      {/* PREVIEW DE ARCHIVOS SELECCIONADOS */}
      {selectedFiles.length > 0 && (
        <div className="border-t px-3 py-2 space-y-1 shrink-0 bg-muted/30">
          {selectedFiles.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xs bg-background rounded px-2 py-1"
            >
              <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate flex-1">{file.name}</span>
              <span className="text-muted-foreground text-[10px] shrink-0">
                {formatFileSize(file.size)}
              </span>
              <button
                onClick={() => handleRemoveFile(i)}
                className="p-0.5 hover:bg-muted rounded shrink-0"
                type="button"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* INPUT */}
      <div className="border-t p-3 flex items-center gap-2 shrink-0">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          className="hidden"
          accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.zip"
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={sending || uploading || disabled}
          className="shrink-0"
          title="Adjuntar archivo"
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        <Input
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled ? "Conversación cerrada" : "Escribe un mensaje..."
          }
          disabled={sending || disabled}
          className="flex-1"
          autoComplete="off"
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={
            (!input.trim() && selectedFiles.length === 0) ||
            sending ||
            uploading ||
            disabled
          }
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}