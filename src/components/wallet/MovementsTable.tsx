import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export interface Movement {
  id: number;
  tipo: string;
  monto: number;
  descripcion: string | null;
  created_at: string | null;
}

export interface MovementsTableProps {
  movements: Movement[];
}

export function MovementsTable({ movements }: MovementsTableProps) {
  if (movements.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay movimientos registrados.
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-card text-card-foreground shadow-sm border-2 border-sage/20">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead>Concepto</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.map((mov) => (
            <TableRow key={mov.id}>
              <TableCell className="whitespace-nowrap">
                {mov.created_at
                  ? new Date(mov.created_at).toLocaleDateString("es-MX")
                  : "Sin fecha"}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    mov.tipo === "Cargo"
                      ? "border-red-300 text-red-700"
                      : "border-green-300 text-green-700"
                  }
                >
                  {mov.tipo}
                </Badge>
              </TableCell>
              <TableCell
                className={`text-right font-mono ${
                  mov.tipo === "Cargo" ? "text-red-600" : "text-green-600"
                }`}
              >
                {mov.tipo === "Cargo" ? "-" : "+"}${Math.abs(mov.monto).toFixed(2)}
              </TableCell>
              <TableCell>{mov.descripcion || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}