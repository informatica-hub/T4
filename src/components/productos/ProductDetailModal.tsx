import { useState } from "react";
import { FolderKanban, Clock, Tag, Shield, Hash, Plus, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CatalogProduct } from "@/hooks/useCatalogProducts";
import { useProject } from "@/contexts/ProjectContext";
import { useAddToProject } from "@/hooks/useAddToProject";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';


interface ProductDetailModalProps {
  producto: CatalogProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allProducts?: CatalogProduct[];
}

export function ProductDetailModal({ producto, open, onOpenChange, allProducts = [] }: ProductDetailModalProps) {
  const { setTriggerProduct, hasItem } = useProject();
  const tryAdd = useAddToProject();
  const navigate = useNavigate();

  if (!producto) return null;

  const isT4 = producto.brand === "t4";
  const color = producto.category?.color || "#888888";
  const categoryName = producto.category?.name || "";
  const subcategoryName = producto.subcategoryObj?.name;
  const isService = producto.product_type === "servicio" || producto.product_type === "innovacion";
  const alreadyAdded = hasItem(producto.id);
 const brandLabel = producto.brand === "t4" ? "T4" 
                 : producto.brand === "gen" ? "Genes2Life" 
                 : "Partner";

  // Resolve upselling products
  const upsellingProducts = allProducts.filter((p) =>
    producto.upselling?.includes(p.id)
  );

  const handleAddToProject = () => {
    tryAdd({ product_id: producto.id, product_name: producto.name });
  };

  const handleArmaProyecto = () => {
    setTriggerProduct({
      product_id: producto.id,
      product_name: producto.name,
    });
    const added = tryAdd(
      { product_id: producto.id, product_name: producto.name },
      { redirectAfter: "/carrito", silent: true },
    );
    onOpenChange(false);
    if (added) navigate("/carrito");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                
         <Badge className="text-white" style={{ backgroundColor: color }}>
  {brandLabel}
</Badge>
                {producto.featured && (
                  <Badge variant="outline" className="border-primary text-primary">
                    Destacado
                  </Badge>
                )}
                {producto.ruo && (
                  <Badge variant="outline">
                    <Shield className="h-3 w-3 mr-1" />
                    RUO
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-xl">{producto.name}</DialogTitle>
              {producto.catalog_number && (
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  Cat. {producto.catalog_number}
                </p>
              )}
              {producto.slogan && (
                <p className="text-sm italic mt-1" style={{ color }}>
                  {producto.slogan}
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {producto.image_url && (
            <div className="rounded-lg overflow-hidden border bg-muted/30">
              <img
                src={producto.image_url}
                alt={producto.name}
                className="w-full h-48 object-contain"
              />
            </div>
          )}
          <div className="text-muted-foreground prose prose-sm max-w-none">
  <ReactMarkdown>{producto.long_description || ''}</ReactMarkdown>
</div>

          {producto.differentiator && (
            <div className="rounded-lg p-3 border" style={{ borderColor: color + "40" }}>
              <p className="text-sm font-medium">✦ {producto.differentiator}</p>
            </div>
          )}

          <Separator />

          {/* Technical details */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Características</h4>
            <div className="grid gap-2">
              {producto.catalog_number && (
                <div className="flex items-center gap-3 text-sm">
                  <Hash className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground">No. Catálogo:</span>
                  <span className="font-medium font-mono">{producto.catalog_number}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">Tiempo de entrega:</span>
                <span className="font-medium">{producto.delivery_time}</span>
              </div>
              {categoryName && (
                <div className="flex items-center gap-3 text-sm">
                  <Tag className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground">Categoría:</span>
                  <span className="font-medium">{categoryName}</span>
                </div>
                 )}
                
                {subcategoryName && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground">Subcategoría:</span>
                <span className="font-medium">{subcategoryName}</span>
              </div>
              )}


             
              {producto.sku && (
                <div className="flex items-center gap-3 text-sm">
                  {/*<Tag className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                   <span className="text-muted-foreground">SKU:</span> 
                  <span className="font-medium">{producto.sku}</span> */}
                </div>
              )}
            </div>
          </div>

          {/* Applications */}
          {producto.applications.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Aplicaciones</h4>
              <div className="flex flex-wrap gap-1.5">
                {producto.applications.map((app) => (
                  <Badge key={app} variant="secondary" className="text-xs">{app}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Cross-selling: Completa tu Ensayo */}
          {upsellingProducts.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Completa tu Ensayo</h4>
                <div className="space-y-2">
                  {upsellingProducts.map((up) => {
                    const upAdded = hasItem(up.id);
                    const upColor = up.category?.color || "#888888";
                    return (
                      <div
                        key={up.id}
                        className="flex items-center justify-between gap-2 rounded-lg border p-3 transition-colors hover:bg-muted/30"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <Badge
                              className="text-[10px] text-white px-1.5 py-0"
                              style={{ backgroundColor: upColor }}
                            >
                              {up.category?.name || ""}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium truncate">{up.name}</p>
                          {up.catalog_number && (
                            <p className="text-[10px] text-muted-foreground font-mono">
                              Cat. {up.catalog_number}
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant={upAdded ? "ghost" : "outline"}
                          className="flex-shrink-0"
                          disabled={upAdded}
                          onClick={() => {
                            tryAdd({ product_id: up.id, product_name: up.name });
                          }}
                        >
                          {upAdded ? (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* CTAs */}
          <div className="flex flex-col gap-2">
            {isService ? (
              <Button
                className="w-full gap-2 text-white"
                style={{ backgroundColor: color }}
                onClick={() => {
                  navigate("/contacto");
                  onOpenChange(false);
                }}
              >
                {producto.cta || "Consulta a tu Colega Científico T4"}
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleArmaProyecto}
                  className="w-full gap-2"
                >
                  <FolderKanban className="h-4 w-4" />
                  Arma tu Proyecto
                </Button>
                <Button
                  onClick={handleAddToProject}
                  variant="outline"
                  className="w-full gap-2"
                  disabled={alreadyAdded}
                >
                  {alreadyAdded ? "Ya está en tu proyecto" : "Agregar a mi Proyecto"}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
