import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCatalogProducts, CatalogProduct } from "@/hooks/useCatalogProducts";
import { ProductForm } from "./ProductForm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { Copy } from "lucide-react";

export function CatalogManager() {
  const { data: products, isLoading } = useCatalogProducts();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<CatalogProduct | null>(null);

   const handleDuplicate = (p: CatalogProduct) => {
    
    const { id, created_at, updated_at, ...rest } = p; 
    const duplicated = {
      ...rest,
      id: '',
      name: `${p.name}`,
      // Si SKU existe, añadimos un sufijo para evitar duplicados (opcional)
      sku: p.sku ? `${p.sku}` : undefined,
    };
    setEditProduct(duplicated as CatalogProduct); 
    setFormOpen(true);
  };

  const filtered = (products || []).filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return;
    const { error } = await (supabase as any).from("catalog_products").delete().eq("id", id);
    if (error) {
      toast.error("Error al eliminar");
    } else {
      toast.success("Producto eliminado");
      queryClient.invalidateQueries({ queryKey: ["catalog-products"] });
    }
  };

  const openNew = () => {
    setEditProduct(null);
    setFormOpen(true);
  };

  const openEdit = (p: CatalogProduct) => {
    setEditProduct(p);
    setFormOpen(true);
  };


  if (isLoading) return <div className="py-8 text-center text-muted-foreground">Cargando...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" /> Nuevo Producto
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Subcategoría</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Entrega</TableHead>
              <TableHead className="w-24">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div>
                    <span className="font-medium">{p.name}</span>
                    {p.sku && <span className="text-xs text-muted-foreground ml-2">{p.sku}</span>}
                    {p.featured && <Badge variant="outline" className="ml-2 text-xs">Destacado</Badge>}
                  </div>
                </TableCell>
                <TableCell>
                  {p.category && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.category.color }} />
                      <span className="text-sm">{p.category.name}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-sm">{p.subcategoryObj?.name || "—"}</TableCell>
                <TableCell className="capitalize text-sm">{p.product_type}</TableCell>
          <TableCell className="text-sm">
  {p.brand === "t4" ? "T4" : p.brand === "gen" ? "Genes2Life" : "Partner"}
</TableCell>
 <TableCell className="text-sm">{p.delivery_time}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(p)}>
                      <Pencil className="h-4 w-4" />
                      </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDuplicate(p)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(p.id, p.name)}>
                      <Trash2 className="h-4 w-4" />

                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} producto(s)</p>

      <ProductForm product={editProduct} open={formOpen} onOpenChange={setFormOpen} />
    </div>
  );
}
