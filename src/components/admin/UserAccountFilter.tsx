import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { BalanceCard } from "@/components/wallet/BalanceCard";
import { MovementsTable } from "@/components/wallet/MovementsTable";
import { useUserAccount } from "@/hooks/useUserAccount";

export function UserAccountFilter() {
  const {
    users,
    selectedUserId,
    setSelectedUserId,
    balance,
    movements,
    loadingUsers,
    loadingAccount,
  } = useUserAccount();

  const [open, setOpen] = useState(false);
  const selectedUser = users.find((u) => u.user_id === selectedUserId);

  return (
    <div className="space-y-6">
      {/* Buscador de usuario */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Selecciona un usuario
        </label>

        {loadingUsers ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Cargando usuarios...
          </div>
        ) : (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full md:w-96 justify-between"
              >
                {selectedUser
                  ? `${selectedUser.full_name || selectedUser.user_id}${
                      selectedUser.company ? ` (${selectedUser.company})` : ""
                    }`
                  : "Buscar usuario..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar por nombre o empresa..." />
                <CommandList>
                  <CommandEmpty>No se encontraron usuarios.</CommandEmpty>
                  <CommandGroup>
                    {users.map((u) => (
                      <CommandItem
                        key={u.id}
                        value={`${u.full_name || u.user_id} ${u.company || ""}`}
                        onSelect={() => {
                          setSelectedUserId(u.user_id);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedUserId === u.user_id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {u.full_name || u.user_id}
                        {u.company ? ` (${u.company})` : ""}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Estado vacío */}
      {!selectedUserId && (
        <p className="text-sm text-muted-foreground py-6 text-center">
          Selecciona un usuario para ver su saldo y movimientos.
        </p>
      )}

      {/* Loading cuenta */}
      {selectedUserId && loadingAccount && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Contenido */}
      {selectedUserId && !loadingAccount && (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Usuario:{" "}
              <span className="text-foreground">
                {selectedUser?.full_name || selectedUser?.user_id}
              </span>
            </h3>
            <BalanceCard balance={balance} />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">
              Historial de movimientos
            </h2>
            <MovementsTable movements={movements} />
          </div>
        </div>
      )}
    </div>
  );
}