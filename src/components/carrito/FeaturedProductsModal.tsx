import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, Check, Loader2 } from "lucide-react";
import { FeaturedProduct } from "@/types/campaign";
import { useProject } from "@/contexts/ProjectContext";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featured: FeaturedProduct[];
  submitting: boolean;
  onSendAnyway: () => void;
}

export function FeaturedProductsModal({
  open, onOpenChange, featured, submitting, onSendAnyway,
}: Props) {
  const { addItem, hasItem } = useProject();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Productos recomendados para tu proyecto</DialogTitle>
          <DialogDescription>
            Estos productos suelen combinarse con lo que ya elegiste. Puedes
            agregarlos antes de enviar tu solicitud.
          </DialogDescription>
        </DialogHeader>

        <div className="relative pl-6 mt-2">
          <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
          <div className="space-y-4">
            {featured.map((f) => {
              const inCart = hasItem(f.product_id);
              const p = f.product;
              const displayName = f.custom_title ?? p?.name ?? "Producto";
              return (
                <div key={f.id} className="relative">
                  <div className="absolute -left-[18px] top-4 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                  <div className="rounded-lg border p-3 flex items-center gap-3">
                    <div className="h-14 w-14 rounded-md bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {p?.image_url ? (
                        <img src={p.image_url} alt={displayName} className="h-full w-full object-cover" />
                      ) : (
                        <Package className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-sm truncate">{displayName}</h4>
                        {f.badge && (
                          <Badge variant="secondary" className="text-[10px]">{f.badge}</Badge>
                        )}
                      </div>
                      {p?.catalog_number && (
                        <p className="text-xs text-muted-foreground">Cat. {p.catalog_number}</p>
                      )}
                      {f.custom_description && (
                        <p className="text-xs text-muted-foreground mt-1">{f.custom_description}</p>
                      )}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant={inCart ? "outline" : "default"}
                      disabled={inCart || !p}
                      onClick={() => {
                        if (!p) return;
                        addItem({
                          product_id: p.id,
                          product_name: p.name,
                        } as any);
                      }}
                    >
                      {inCart ? (
                        <><Check className="h-4 w-4 mr-1" />Agregado</>
                      ) : (
                        <><Plus className="h-4 w-4 mr-1" />Agregar</>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)} disabled={submitting}>
            Seguir editando
          </Button>
          <Button className="w-full sm:w-auto"
            onClick={onSendAnyway} disabled={submitting}>
            {submitting ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Enviando...</>
            ) : "Continuar con el envío"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}