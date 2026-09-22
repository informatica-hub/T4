import { useState } from "react";
import { Clock, Tag, Eye, Shield } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CatalogProduct } from "@/hooks/useCatalogProducts";
import { ProductDetailModal } from "./ProductDetailModal";
import ReactMarkdown from 'react-markdown';


interface ProductCardProps {
  producto: CatalogProduct;
  allProducts?: CatalogProduct[];
}

export function ProductCard({ producto, allProducts = [] }: ProductCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const isT4 = producto.brand === "t4";
  const color = producto.category?.color || "#888888";
  const categoryName = producto.category?.name || "";
   const subcategoryName = producto.subcategoryObj?.name;
  

  return (
    <>
      <Card
        className="group h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer overflow-hidden"
        style={{ borderLeftWidth: "4px", borderLeftColor: color }}
        onClick={() => setModalOpen(true)}
      >
        <CardHeader className="pb-3">
           <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge
  className="text-xs text-white"
  style={{ backgroundColor: color }}
>
  {producto.brand === "gen" ? "Genes2Life" : (producto.brand === "t4" ? "T4" : "Partner")}
</Badge>
                {producto.featured && (
                  <Badge variant="outline" className="text-xs border-primary text-primary">
                    Destacado
                  </Badge>
                )}
                {producto.ruo && (
                  <Badge variant="outline" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    RUO
                  </Badge>
                )}
                {producto.delivery_time === "Inmediato" && (
                  <Badge variant="secondary" className="text-xs">
                    Entrega inmediata
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                {producto.name}
              </h3>
              {producto.catalog_number && (
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  Cat. {producto.catalog_number}
                </p>
              )}
              {producto.slogan && (
                <p className="text-xs mt-1 italic" style={{ color }}>
                  {producto.slogan}
                </p>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
         <div className="text-sm text-muted-foreground line-clamp-2 overflow-hidden prose prose-sm max-w-none">
  <ReactMarkdown>{producto.description || ''}</ReactMarkdown>
</div>

          {producto.differentiator && (
            <p className="text-xs font-medium text-foreground/80 line-clamp-1">
              ✦ {producto.differentiator}
            </p>
          )}

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{producto.delivery_time}</span>
            </div>

            {categoryName && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="h-4 w-4" />
                <span>{categoryName}</span>
              </div>
            )}

             {subcategoryName && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="h-3 w-3" />
                <span>{subcategoryName}</span>
              </div>
              )}

          </div>
          

          
        

          <div className="flex flex-wrap gap-1">
            {producto.applications.slice(0, 3).map((app) => (
              <Badge key={app} variant="outline" className="text-xs">
                {app}
              </Badge>
            ))}
            {producto.applications.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{producto.applications.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <Button
            variant="ghost"
            className="w-full group/btn"
            onClick={(e) => {
              e.stopPropagation();
              setModalOpen(true);
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver detalles
          </Button>
        </CardFooter>
      </Card>

      <ProductDetailModal
        producto={producto}
        open={modalOpen}
        onOpenChange={setModalOpen}
        allProducts={allProducts}
      />
    </>
  );
}
