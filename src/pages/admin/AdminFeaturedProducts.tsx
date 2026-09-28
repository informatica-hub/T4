import { useEffect, useMemo, useState } from "react";
import { useCatalogProducts } from "@/hooks/useCatalogProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  getFeaturedProducts, createFeaturedProduct, deleteFeaturedProduct,
} from "@/pages/servicios/campaigns";
import { FeaturedProduct } from "@/types/campaign";

export default function AdminFeaturedProducts() {
  const { data: products } = useCatalogProducts();
  const [featured, setFeatured] = useState<FeaturedProduct[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    product_id: "",
    badge: "",
    custom_title: "",
    custom_description: "",
    sort_order: 0,
  });

  const load = () => getFeaturedProducts().then(setFeatured).catch(() => {});
  useEffect(() => { load(); }, []);

  const selectedProduct = useMemo(
    () => products?.find((p) => p.id === form.product_id),
    [products, form.product_id]
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.product_id) {
      toast.error("Selecciona un producto");
      return;
    }
    try {
      await createFeaturedProduct({
        product_id: form.product_id,
        badge: form.badge || undefined,
        custom_title: form.custom_title || undefined,
        custom_description: form.custom_description || undefined,
        sort_order: form.sort_order,
      });
      toast.success("Producto destacado agregado");
      setForm({ product_id: "", badge: "", custom_title: "", custom_description: "", sort_order: 0 });
      load();
    } catch {
      toast.error("Error al agregar");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Quitar este producto destacado?")) return;
    await deleteFeaturedProduct(id);
    load();
  };

  return (
    <div className="space-y-6 mt-4">
      <Card>
        <CardHeader><CardTitle>Agregar producto destacado</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <Label>Producto *</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal"
                  >
                    {selectedProduct
                      ? `${selectedProduct.name}${
                          selectedProduct.catalog_number
                            ? ` · ${selectedProduct.catalog_number}`
                            : ""
                        }`
                      : "Buscar producto..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[--radix-popover-trigger-width] p-0"
                  align="start"
                >
                  <Command
                    filter={(value, search) => {
                      // Búsqueda personalizada: nombre + catálogo
                      const product = products?.find((p) => p.id === value);
                      if (!product) return 0;
                      const q = search.toLowerCase();
                      const name = product.name?.toLowerCase() ?? "";
                      const cat = product.catalog_number?.toLowerCase() ?? "";
                      return name.includes(q) || cat.includes(q) ? 1 : 0;
                    }}
                  >
                    <CommandInput placeholder="Buscar por nombre o catálogo..." />
                    <CommandList>
                      <CommandEmpty>Sin resultados.</CommandEmpty>
                      <CommandGroup>
                        {products?.map((p) => (
                          <CommandItem
                            key={p.id}
                            value={p.id}
                            onSelect={(value) => {
                              setForm((f) => ({
                                ...f,
                                product_id: value === f.product_id ? "" : value,
                              }));
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                form.product_id === p.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span>{p.name}</span>
                              {p.catalog_number && (
                                <span className="text-xs text-muted-foreground">
                                  Cat. {p.catalog_number}
                                </span>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Badge</Label>
                <Input
                  value={form.badge}
                  onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                  placeholder="-20%"
                />
              </div>
              <div className="space-y-2">
                <Label>Orden</Label>
                <Input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Título personalizado (opcional)</Label>
              <Input
                value={form.custom_title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, custom_title: e.target.value }))
                }
                placeholder="Si lo dejas vacío usa el del catálogo"
              />
            </div>

            <div className="space-y-2">
              <Label>Descripción (opcional)</Label>
              <Input
                value={form.custom_description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, custom_description: e.target.value }))
                }
              />
            </div>

            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="font-semibold">Destacados actuales</h3>
        {featured.map((f) => {
          const p = products?.find((pp) => pp.id === f.product_id);
          return (
            <div
              key={f.id}
              className="flex items-center justify-between border rounded-md p-3"
            >
              <div>
                <p className="font-medium text-sm">{p?.name ?? f.product_id}</p>
                {f.badge && (
                  <span className="text-xs text-muted-foreground">{f.badge}</span>
                )}
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(f.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}