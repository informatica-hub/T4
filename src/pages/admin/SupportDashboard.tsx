// src/pages/admin/SupportDashboard.tsx
import { useState, useEffect } from "react";
import {
  MessageSquare,
  User as UserIcon,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSupportConversations } from "@/hooks/useSupportConversations";
import { useSupportStatus } from "@/hooks/useSupportStatus";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatWindow } from "@/components/support/ChatWindow";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { CLOSED_VISIBLE_DAYS } from "@/lib/support/constants";
import { NewChatButton } from "@/components/support/admin/NewChatButton";

export default function SupportDashboard() {
  const { user } = useAuth();
  const { conversations, loading, closeConversation, refresh } =
    useSupportConversations();
  const { status: statusOverride, setStatus } = useSupportStatus();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showClosed, setShowClosed] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const isMobile = useIsMobile();

  const selected = conversations.find((c) => c.id === selectedId);

  // ✅ CLASIFICACIÓN: activas con mensajes, vacías, cerradas
  // 👇 NUEVO: las que el usuario contestó suben al tope
  const activeWithMessages = conversations
    .filter((c) => c.status !== "closed" && !!c.last_message)
    .sort((a, b) => {
      const aNeedsAttention = a.last_message_role === "customer" ? 1 : 0;
      const bNeedsAttention = b.last_message_role === "customer" ? 1 : 0;
      if (aNeedsAttention !== bNeedsAttention) {
        return bNeedsAttention - aNeedsAttention;
      }
      return (
        new Date(b.last_message_at).getTime() -
        new Date(a.last_message_at).getTime()
      );
    });

  const emptyConversations = conversations.filter(
    (c) => c.status !== "closed" && !c.last_message
  );
  const closedConversations = conversations.filter(
    (c) => c.status === "closed"
  );

  // Pedir permiso de notificaciones al montar
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  // 👇 NUEVO: helper para el badge con 3 estados
  const getConversationBadge = (conv: (typeof conversations)[number]) => {
      // 🟡 Nueva respuesta: el último mensaje es del cliente Y ya hubo respuesta previa
      if (conv.last_message_role === "customer" && conv.last_agent_name) {
        return {
          label: "Nueva respuesta",
          className:
            "border-amber-500/60 text-amber-700 dark:text-amber-400 bg-amber-500/10",
        };
      }

      // 🟢 Nueva conversación: nadie del equipo ha respondido nunca
      if (!conv.last_agent_name) {
        return {
          label: "Nueva conversación",
          className:
            "border-emerald-500/60 text-emerald-700 dark:text-emerald-400 bg-emerald-500/10",
        };
      }

      // 🔵 En curso: el equipo respondió y el cliente no ha vuelto a escribir
      return {
        label: "En curso",
        className:
          "border-blue-500/60 text-blue-700 dark:text-blue-400 bg-blue-500/10",
      };
    };
      const handleClose = async (convId: string, customerName: string) => {
        if (!user) return;

        const { error } = await closeConversation(convId, user.id);

        if (error) {
          toast.error("Error al cerrar", { description: error });
        } else {
          toast.success("Conversación cerrada", {
            description: `Chat con ${customerName} finalizado.`,
          });
          if (selectedId === convId) setSelectedId(null);
        }
      };

  const handleStatusChange = async (newStatus: string) => {
    const value = newStatus === "auto" ? null : (newStatus as "online" | "away");
    const { error } = await setStatus(value);
    if (error) {
      toast.error("Error al cambiar estado", { description: error });
    } else {
      toast.success("Estado actualizado", {
        description:
          newStatus === "auto"
            ? "El estado se ajusta automáticamente al horario"
            : newStatus === "online"
            ? "Los clientes ven 'Estamos en línea'"
            : "Los clientes ven 'Regresamos en un momento'",
      });
    }
  };

  // Al seleccionar desde el modal de nuevo chat
  const handleNewConversationSelected = async (id: string) => {
    await refresh?.();
    setSelectedId(id);
  };

  if (!user) return null;

  return (
    <div className="flex h-[calc(100dvh-6rem)] max-h-[calc(100dvh-6rem)] overflow-hidden">
      {/* Sidebar: lista de conversaciones */}
      <aside
        className={cn(
          "w-full md:w-[32rem] md:max-w-[32rem] min-w-0 md:border-r bg-muted/30 flex-col shrink-0",
          selectedId ? "hidden md:flex" : "flex"
        )}
      >
        <div className="p-4 border-b shrink-0 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Soporte
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {activeWithMessages.length} activa{activeWithMessages.length !== 1 ? "s" : ""}
                {emptyConversations.length > 0 &&
                  ` · ${emptyConversations.length} vacía${emptyConversations.length !== 1 ? "s" : ""}`}
                {closedConversations.length > 0 &&
                  ` · ${closedConversations.length} cerrada${closedConversations.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          {/* Selector de estado */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              Estado visible al cliente:
            </span>
            <Select
              value={statusOverride ?? "auto"}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[220px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">🔄 Automático (según horario)</SelectItem>
                <SelectItem value="online">🟢 En línea</SelectItem>
                <SelectItem value="away">🟡 Regresamos en un momento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Lista de conversaciones */}
        <div className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden">
          {loading ? (
            <div className="p-4 text-sm text-muted-foreground">Cargando...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground text-center">
              No hay conversaciones
            </div>
          ) : (
            <div className="p-2 space-y-1 min-w-0">
              {/* ========================
                  CONVERSACIONES ACTIVAS (con mensajes)
              ======================== */}
              {activeWithMessages.map((conv) => {
                const badge = getConversationBadge(conv);
                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedId(conv.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedId(conv.id);
                      }
                    }}
                    className={cn(
                      "w-full min-w-0 flex items-start gap-2 p-3 rounded-lg text-left transition-colors cursor-pointer group",
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
                      <div className="flex items-center justify-between gap-2 min-w-0">
                        <p className="font-medium text-sm truncate block">
                          {conv.customer_name}
                        </p>
                        <Badge
                          variant={badge.variant}
                          className={cn(
                            "text-[10px] px-1.5 py-0 shrink-0",
                            badge.className
                          )}
                        >
                          {badge.label}
                        </Badge>
                      </div>

                      {conv.last_message && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5 block">
                          {conv.last_message}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-0.5 min-w-0">
                        <p className="text-[10px] text-muted-foreground truncate">
                          {new Date(conv.last_message_at).toLocaleString("es-MX", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        {conv.last_agent_name && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0 h-4 gap-1 text-muted-foreground shrink-0"
                          >
                            <UserIcon className="h-2.5 w-2.5" />
                            {conv.last_agent_name.split(" ")[0]}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Botón de cerrar */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="shrink-0 self-start p-1.5 rounded-md bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
                          title="Cerrar conversación"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                              <AlertTriangle className="h-5 w-5 text-destructive" />
                            </div>
                            <AlertDialogTitle className="text-left">
                              ¿Cerrar la conversación?
                            </AlertDialogTitle>
                          </div>
                          <AlertDialogDescription className="text-left space-y-2">
                            <p>
                              Estás a punto de cerrar la conversación con{" "}
                              <strong>{conv.customer_name}</strong>.
                            </p>
                            <p className="text-xs text-muted-foreground">
                              El cliente ya no podrá escribir en este chat. Si
                              necesita ayuda nuevamente, tendrá que iniciar una
                              conversación nueva.
                            </p>
                            <p className="text-xs text-destructive font-medium">
                              Esta acción no se puede deshacer.
                            </p>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleClose(conv.id, conv.customer_name)
                            }
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Sí, cerrar conversación
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                );
              })}

              {/* ========================
                  CONVERSACIONES VACÍAS (con toggle)
              ======================== */}
              {emptyConversations.length > 0 && (
                <>
                  <button
                    onClick={() => setShowEmpty((v) => !v)}
                    className="w-full min-w-0 flex items-center gap-2 px-3 py-2 mt-3 rounded-md hover:bg-muted/50 transition-colors group"
                    type="button"
                  >
                    <div className="flex-1 h-px bg-border" />
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider font-medium shrink-0">
                      {showEmpty ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                      Vacías ({emptyConversations.length})
                    </div>
                    <div className="flex-1 h-px bg-border" />
                  </button>

                  {showEmpty &&
                    emptyConversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => setSelectedId(conv.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedId(conv.id);
                          }
                        }}
                        className={cn(
                          "w-full min-w-0 flex items-start gap-2 p-3 rounded-lg text-left transition-colors cursor-pointer opacity-70 hover:opacity-90",
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
                          <div className="flex items-center justify-between gap-2 min-w-0">
                            <p className="font-medium text-sm truncate text-muted-foreground block">
                              {conv.customer_name}
                            </p>
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 shrink-0"
                            >
                              Sin mensajes
                            </Badge>
                          </div>

                          <p className="text-xs text-muted-foreground truncate mt-0.5 italic block">
                            (El cliente no ha escrito)
                          </p>

                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {new Date(conv.last_message_at).toLocaleString(
                              "es-MX",
                              {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>

                        {/* Botón de cerrar */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="shrink-0 self-start p-1.5 rounded-md bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
                              title="Cerrar conversación"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                                  <AlertTriangle className="h-5 w-5 text-destructive" />
                                </div>
                                <AlertDialogTitle className="text-left">
                                  ¿Cerrar la conversación?
                                </AlertDialogTitle>
                              </div>
                              <AlertDialogDescription className="text-left space-y-2">
                                <p>
                                  Estás a punto de cerrar la conversación con{" "}
                                  <strong>{conv.customer_name}</strong>.
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  El cliente ya no podrá escribir en este chat.
                                  Si necesita ayuda nuevamente, tendrá que
                                  iniciar una conversación nueva.
                                </p>
                                <p className="text-xs text-destructive font-medium">
                                  Esta acción no se puede deshacer.
                                </p>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleClose(conv.id, conv.customer_name)
                                }
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                Sí, cerrar conversación
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ))}
                </>
              )}

              {/* ========================
                  SEPARADOR + CERRADAS (con toggle)
              ======================== */}
              {closedConversations.length > 0 && (
                <>
                  <button
                    onClick={() => setShowClosed((v) => !v)}
                    className="w-full min-w-0 flex items-center gap-2 px-3 py-2 mt-3 rounded-md hover:bg-muted/50 transition-colors group"
                    type="button"
                  >
                    <div className="flex-1 h-px bg-border" />
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider font-medium shrink-0">
                      {showClosed ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                      Cerradas ({closedConversations.length})
                    </div>
                    <div className="flex-1 h-px bg-border" />
                  </button>

                  {showClosed && (
                    <p className="px-3 pt-1 pb-2 text-[10px] text-muted-foreground/70 italic">
                      Mostrando últimos {CLOSED_VISIBLE_DAYS} días
                    </p>
                  )}

                  {showClosed &&
                    closedConversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => setSelectedId(conv.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedId(conv.id);
                          }
                        }}
                        className={cn(
                          "w-full min-w-0 flex items-start gap-2 p-3 rounded-lg text-left transition-colors cursor-pointer opacity-60 hover:opacity-80",
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
                          <div className="flex items-center justify-between gap-2 min-w-0">
                            <p className="font-medium text-sm truncate text-muted-foreground block">
                              {conv.customer_name}
                            </p>
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 shrink-0"
                            >
                              Cerrada
                            </Badge>
                          </div>

                          {conv.last_message && (
                            <p className="text-xs text-muted-foreground truncate mt-0.5 block">
                              {conv.last_message}
                            </p>
                          )}

                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {new Date(conv.last_message_at).toLocaleString(
                              "es-MX",
                              {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                </>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Main: chat */}
      <main
        className={cn(
          "flex-1 flex-col min-w-0 overflow-hidden",
          selectedId ? "flex" : "hidden md:flex"
        )}
      >
        {selected ? (
          <ChatWindow
            key={selected.id}
            conversationId={selected.id}
            currentUserId={user.id}
            currentUserRole="agent"
            variant="inline"
            headerTitle={selected.customer_name}
            headerSubtitle={selected.customer_email || "Cliente"}
            disabled={selected.status === "closed"}
            onClose={() => setSelectedId(null)}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <UserIcon className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm">Selecciona una conversación para comenzar</p>
          </div>
        )}
      </main>

      <NewChatButton
        hidden={!!selectedId}
        onConversationSelected={handleNewConversationSelected}
      />
    </div>
  );
}