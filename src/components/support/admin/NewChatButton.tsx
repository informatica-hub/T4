import { useMemo, useState } from "react";
import { MessageSquarePlus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAdminUserList } from "@/hooks/useAdminUserList";
import { createConversationWithUser } from "@/lib/support/createConversationWithUser";
import { toast } from "sonner";

interface NewChatButtonProps {
  onConversationSelected: (conversationId: string) => void;
  /** Ocúltalo si el chat ya está abierto en móvil, por ejemplo */
  hidden?: boolean;
}

export function NewChatButton({
  onConversationSelected,
  hidden = false,
}: NewChatButtonProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);

  const { users, loading, error } = useAdminUserList(open);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      return (
        u.email?.toLowerCase().includes(q) ||
        u.full_name?.toLowerCase().includes(q) ||
        u.company?.toLowerCase().includes(q)
      );
    });
  }, [users, query]);

  const handleSelect = async (userId: string) => {
    if (creating) return;
    setCreating(true);
    try {
      const convId = await createConversationWithUser(userId);
      onConversationSelected(convId);
      setOpen(false);
      setQuery("");
    } catch (e: any) {
      console.error("Error creando conversación:", e);
        toast.error("No se pudo abrir el chat", {
        description: e?.message ?? "Intenta de nuevo.",
        });
    } finally {
      setCreating(false);
    }
  };

  if (hidden) return null;

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
        size="icon"
        aria-label="Nuevo chat"
      >
        <MessageSquarePlus className="h-6 w-6" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo chat</DialogTitle>
          </DialogHeader>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Buscar por correo, nombre o empresa..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 pr-9"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <ScrollArea className="h-80 rounded-md border">
            {loading && (
              <p className="p-4 text-sm text-muted-foreground">
                Cargando usuarios…
              </p>
            )}

            {!loading && error && (
              <p className="p-4 text-sm text-destructive">
                Error: {error}
              </p>
            )}

            {!loading && !error && filtered.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground">
                Sin resultados
              </p>
            )}

            <ul className="divide-y">
              {filtered.map((u) => (
                <li key={u.user_id}>
                  <button
                    type="button"
                    disabled={creating}
                    onClick={() => handleSelect(u.user_id)}
                    className="w-full px-4 py-3 text-left transition-colors hover:bg-accent disabled:opacity-50"
                  >
                    <p className="text-sm font-medium">
                      {u.full_name || "Sin nombre"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {u.email}
                    </p>
                    {u.company && (
                      <p className="text-xs text-muted-foreground">
                        {u.company}
                      </p>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}