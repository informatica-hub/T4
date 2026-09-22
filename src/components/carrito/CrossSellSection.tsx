import { useNavigate } from "react-router-dom";
import { useCatalogProducts, type CatalogProduct } from "@/hooks/useCatalogProducts";
import { useProject } from "@/contexts/ProjectContext";
import { useAddToProject } from "@/hooks/useAddToProject";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, ArrowRight, Sparkles } from "lucide-react";

// Mapa de relaciones entre slugs de categoría para cross-selling inteligente.
// Las claves y valores corresponden a `product_categories.slug`.
const crossSellMap: Record<string, string[]> = {
  oligonucleotidos: ["sondas-starq", "enzimas-gigascript", "extraccion-nextpure", "reactivos-esenciales"],
  "sondas-starq": ["oligonucleotidos", "kits-sentinel", "enzimas-gigascript"],
  "genes-sinteticos": ["oligonucleotidos", "enzimas-gigascript", "secuenciacion"],
  "enzimas-gigascript": ["oligonucleotidos", "extraccion-nextpure", "kits-sentinel"],
  "extraccion-nextpure": ["enzimas-gigascript", "kits-sentinel", "oligonucleotidos"],
  "kits-sentinel": ["extraccion-nextpure", "sondas-starq", "oligonucleotidos"],
  "reactivos-esenciales": ["oligonucleotidos", "enzimas-gigascript", "extraccion-nextpure"],
  "marcas-aliadas": ["oligonucleotidos", "sondas-starq", "genes-sinteticos"],
  secuenciacion: ["genes-sinteticos", "oligonucleotidos", "enzimas-gigascript"],
  "servicios-especializados": ["oligonucleotidos", "genes-sinteticos", "kits-sentinel"],
  "soluciones-cro": ["kits-sentinel", "servicios-especializados", "sondas-starq"],
  innovaciones: ["oligonucleotidos", "sondas-starq", "genes-sinteticos"],
};

function getRecommendations(
  allProducts: CatalogProduct[],
  projectProductIds: string[],
): CatalogProduct[] {
  const projectCategorySlugs = new Set<string>();
  projectProductIds.forEach((pid) => {
    const p = allProducts.find((pr) => pr.id === pid);
    if (p?.category?.slug) projectCategorySlugs.add(p.category.slug);
  });

  const relatedSlugs = new Set<string>();
  projectCategorySlugs.forEach((slug) => {
    (crossSellMap[slug] || []).forEach((rs) => relatedSlugs.add(rs));
  });

  return allProducts
    .filter(
      (p) =>
        !projectProductIds.includes(p.id) &&
        p.category?.slug &&
        relatedSlugs.has(p.category.slug),
    )
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    .slice(0, 4);
}

function getFallbackProducts(
  allProducts: CatalogProduct[],
  projectProductIds: string[],
): CatalogProduct[] {
  return allProducts
    .filter((p) => !projectProductIds.includes(p.id) && p.featured)
    .slice(0, 4);
}

interface MiniProductCardProps {
  producto: CatalogProduct;
}

function MiniProductCard({ producto }: MiniProductCardProps) {
  const navigate = useNavigate();
  const tryAdd = useAddToProject();
  const color = producto.category?.color || "hsl(var(--primary))";
  const categoryLabel = producto.category?.name || "PRODUCTO";

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    tryAdd({
      product_id: producto.id,
      product_name: producto.name,
    });
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-md border-l-4"
      style={{ borderLeftColor: color }}
      onClick={() => navigate("/productos")}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge
            variant="outline"
            className="text-[10px] font-semibold shrink-0"
            style={{ borderColor: color, color }}
          >
            {categoryLabel.toUpperCase()}
          </Badge>
          {producto.ruo && (
            <Badge variant="secondary" className="text-[10px]">RUO</Badge>
          )}
        </div>
        <h4 className="font-semibold text-sm leading-tight mb-1 group-hover:text-primary transition-colors">
          {producto.name}
        </h4>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {producto.description}
        </p>
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={handleAdd}
          >
            <FolderKanban className="h-3 w-3" />
            Agregar
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-primary">
            Ver más <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function CrossSellSection() {
  const { items } = useProject();
  const { data: allProducts } = useCatalogProducts();

  if (items.length === 0) return null;
  if (!allProducts || allProducts.length === 0) return null;

  const projectProductIds = items.map((i) => i.product_id);
  let recommendations = getRecommendations(allProducts, projectProductIds);
  if (recommendations.length === 0) {
    recommendations = getFallbackProducts(allProducts, projectProductIds);
  }
  if (recommendations.length === 0) return null;

  return (
    <section className="container-width px-4 md:px-8 pb-12">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Complementa tu proyecto</h2>
        </div>
        <p className="text-muted-foreground text-sm max-w-2xl">
          Los investigadores que combinan estos productos reportan mayor eficiencia en sus protocolos.
          Agrega lo que necesites para optimizar tu investigación.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.map((p) => (
          <MiniProductCard key={p.id} producto={p} />
        ))}
      </div>
    </section>
  );
}
