import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { NucleotideBackground } from "@/components/ui/NucleotideBackground";
import { Seo } from "@/components/seo/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ChevronsUpDown, Check ,Globe, Users } from "lucide-react";
import { MovementsTable } from "@/components/wallet/MovementsTable";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { UserAccountFilter } from "@/components/admin/UserAccountFilter";


// Definimos el tipo Profile con los campos REALES de tu tabla
interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  company: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

// Definimos el tipo Movement (igual que en useWallet)
interface Movement {
  id: number;
  user_id: string;
  tipo: string;
  monto: number;
  descripcion: string | null;
  created_at: string | null;
  created_by: string | null;
}

export default function AdminWallet() {
  const { user } = useAuth();
  const { isAdmin, loading: adminLoading } = useIsAdmin();

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [users, setUsers] = useState<Profile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [tipo, setTipo] = useState<"Apertura" | "Aumento" | "Cargo">("Cargo");
  const [monto, setMonto] = useState<number>();
  const [descripcion, setDescripcion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [allMovements, setAllMovements] = useState<Movement[]>([]);
  const [loadingMovements, setLoadingMovements] = useState(false);
  const selectedUser = users.find((u) => u.id === selectedUserId);
  const [view, setView] = useState<"global" | "user">("global");

  useEffect(() => {
    if (!isAdmin) return;

    const loadData = async () => {
      // 1. Cargar usuarios (todos los campos de profiles)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, company, user_id')
        .order('full_name', { ascending: true });

      if (profilesError) {
        console.error("Error cargando usuarios:", profilesError);
        toast.error( "Error", { description: "No se pudieron cargar los usuarios." });
      } else {
        // Cast seguro: primero a unknown, luego a Profile[]
        setUsers((profiles as unknown as Profile[]) || []);
      }

      // 2. Cargar todos los movimientos
      await fetchAllMovements();
    };

    loadData();
  }, [isAdmin]);

  const fetchAllMovements = async () => {
    setLoadingMovements(true);
    const { data, error } = await supabase
      .from('movimientos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error cargando movimientos:", error);
      toast.error("Error", { description: "No se pudieron cargar los movimientos." });
    } else {
      // Cast seguro: primero a unknown, luego a Movement[]
      setAllMovements((data as unknown as Movement[]) || []);
    }
    setLoadingMovements(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error("Error", {description: "Selecciona un usuario." });
      return;
    }
    if (monto <= 0) {
      toast.error("Error", {description: "El monto debe ser mayor a cero." });
      return;
    }

    setSubmitting(true);
    const montoFinal = tipo === "Cargo" ? -Math.abs(monto) : Math.abs(monto);

    const { error } = await supabase
      .from('movimientos')
      .insert({
        user_id: selectedUserId,
        tipo,
        monto: montoFinal,
        descripcion: descripcion || null,
      });

    if (error) {
      console.error("Error insertando movimiento:", error);
      toast.error("Error", { description: "No se pudo agregar el movimiento: " + error.message,
      });
    } else {
      toast.success("Éxito", {description: "Movimiento agregado correctamente." });
      setMonto(0);
      setDescripcion("");
      await fetchAllMovements();
    }
    setSubmitting(false);
  };

  if (adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">Acceso denegado. No eres administrador.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative py-24 px-4">
      <Seo title="Admin · Monedero | T4" description="Gestiona los saldos de los usuarios." />
      <NucleotideBackground />
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Administración de Monedero</h1>
          <p className="text-muted-foreground mt-1">
            Agrega movimientos a cualquier usuario y consulta el historial global.
          </p>
        </div>

        <Card className="border-2 border-sage/20">
          <CardHeader>
            <CardTitle>Agregar movimiento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
  <Label htmlFor="user">Usuario</Label>
  <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between"
      >
        {selectedUserId
          ? users.find((u) => u.user_id === selectedUserId)?.full_name || "Selecciona un usuario"
          : "Selecciona un usuario..."}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-full p-0">
      <Command>
        <CommandInput placeholder="Buscar usuario..." />
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
                    selectedUserId === u.user_id? "opacity-100" : "opacity-0"
                  )}
                />
                {u.full_name || u.id} {u.company ? `(${u.company})` : ""}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</div>
<div className="space-y-2">
  <Label htmlFor="tipo">Tipo</Label>
  <div className="flex gap-2">
    {[ "Aumento", "Cargo" , "Apertura"].map((opcion) => (
      <Button
        key={opcion}
        type="button"
        variant={tipo === opcion ? "default" : "outline"}
        className="flex-1"
        onClick={() => setTipo(opcion as "Apertura" | "Aumento" | "Cargo")}
      >
        {opcion}
      </Button>
    ))}
  </div>
</div>

              <div className="space-y-2">
                <Label htmlFor="monto">Monto</Label>
                <Input
                  id="monto"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={monto}
                  onChange={(e) => setMonto(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Concepto</Label>
                <Input
                  id="descripcion"
                  type="text"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                 
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" disabled={submitting} className="space-y-2">
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Agregar movimiento
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card>
  <CardHeader className="flex flex-row items-center justify-between space-y-0">
    <CardTitle>Movimientos</CardTitle>

    <div className="flex gap-2">
      <Button
        type="button"
        size="sm"
        variant={view === "global" ? "default" : "outline"}
        onClick={() => setView("global")}
      >
        <Globe className="h-4 w-4 mr-2" />
        Globales
      </Button>
      <Button
        type="button"
        size="sm"
        variant={view === "user" ? "default" : "outline"}
        onClick={() => setView("user")}
      >
        <Users className="h-4 w-4 mr-2" />
        Por usuario
      </Button>
    </div>
  </CardHeader>

  <CardContent>
    {view === "global" ? (
      loadingMovements ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <MovementsTable movements={allMovements} />
      )
    ) : (
      <UserAccountFilter />
    )}
  </CardContent>
</Card>
        
      </div>
    </div>
  );
}