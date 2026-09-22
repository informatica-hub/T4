import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { CatalogCategory, CatalogSubcategory } from "@/hooks/useCatalogProducts";
import { FilterState } from "@/hooks/useProductFilter";
import { aplicaciones, tiemposEntrega, tipos } from "@/lib/productConstants";

interface ProductFiltersProps {
  filters: FilterState;
  onToggleFilter: (type: keyof FilterState, value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  totalResults: number;
  categories?: CatalogCategory[];
  subcategories?: CatalogSubcategory[];
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium hover:text-primary transition-colors">
        {title}
        <ChevronDown className="h-4 w-4 transition-transform duration-200" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 pb-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

function FilterContent({
  filters,
  onToggleFilter,
  onClearFilters,
  hasActiveFilters,
  categories = [],
  subcategories = [],
}: Omit<ProductFiltersProps, "totalResults">) {
  return (
    <div className="space-y-2">
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="w-full justify-start text-muted-foreground hover:text-destructive"
        >
          <X className="h-4 w-4 mr-2" />
          Limpiar filtros
        </Button>
      )}

      <FilterSection title="Tipo">
        <div className="space-y-2">
          {tipos.map((tipo) => (
            <div key={tipo.id} className="flex items-center space-x-2">
              <Checkbox
                id={`tipo-${tipo.id}`}
                checked={filters.tipos.includes(tipo.id)}
                onCheckedChange={() => onToggleFilter("tipos", tipo.id)}
              />
              <Label htmlFor={`tipo-${tipo.id}`} className="text-sm font-normal cursor-pointer">
                {tipo.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator />

      <FilterSection title="Marca">
        <div className="space-y-2">
          {[
            { id: "t4", label: "T4 (Marca propia)" },
            { id: "partner", label: "Marcas aliadas" },
            {id: "gen", label:"Genes2Life"},
          ].map((marca) => (
            <div key={marca.id} className="flex items-center space-x-2">
              <Checkbox
                id={`marca-${marca.id}`}
                checked={filters.marcas.includes(marca.id)}
                onCheckedChange={() => onToggleFilter("marcas", marca.id)}
              />
              <Label htmlFor={`marca-${marca.id}`} className="text-sm font-normal cursor-pointer">
                {marca.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator />

      <FilterSection title="Categoría">
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${cat.slug}`}
                checked={filters.categorias.includes(cat.slug)}
                onCheckedChange={() => onToggleFilter("categorias", cat.slug)}
              />
              <Label htmlFor={`cat-${cat.slug}`} className="text-sm font-normal cursor-pointer flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                {cat.name}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {subcategories.length > 0 && (
        <>
          <Separator />
          <FilterSection title="Subcategoría" defaultOpen={false}>
            <div className="space-y-2">
              {subcategories.map((sub) => (
                <div key={sub.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`sub-${sub.id}`}
                    checked={filters.subcategorias.includes(sub.id)}
                    onCheckedChange={() => onToggleFilter("subcategorias", sub.id)}
                  />
                  <Label htmlFor={`sub-${sub.id}`} className="text-sm font-normal cursor-pointer">
                    {sub.name}
                  </Label>
                </div>
              ))}
            </div>
          </FilterSection>
        </>
      )}

      <Separator />

      <FilterSection title="Aplicación" defaultOpen={false}>
        <div className="space-y-2">
          {aplicaciones.map((app) => (
            <div key={app.id} className="flex items-center space-x-2">
              <Checkbox
                id={`app-${app.id}`}
                checked={filters.aplicaciones.includes(app.id)}
                onCheckedChange={() => onToggleFilter("aplicaciones", app.id)}
              />
              <Label htmlFor={`app-${app.id}`} className="text-sm font-normal cursor-pointer">
                {app.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator />

      <FilterSection title="Tiempo de Entrega" defaultOpen={false}>
        <div className="space-y-2">
          {tiemposEntrega.map((tiempo) => (
            <div key={tiempo.id} className="flex items-center space-x-2">
              <Checkbox
                id={`tiempo-${tiempo.id}`}
                checked={filters.tiempoEntrega === tiempo.id}
                onCheckedChange={() => onToggleFilter("tiempoEntrega", tiempo.id)}
              />
              <Label htmlFor={`tiempo-${tiempo.id}`} className="text-sm font-normal cursor-pointer">
                {tiempo.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}

export function ProductFiltersDesktop(props: ProductFiltersProps) {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filtros</h2>
          <Badge variant="secondary">{props.totalResults} resultados</Badge>
        </div>
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <FilterContent {...props} />
        </ScrollArea>
      </div>
    </aside>
  );
}

export function ProductFiltersMobile(props: ProductFiltersProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="lg:hidden gap-2">
          <Filter className="h-4 w-4" />
          Filtros
          {props.hasActiveFilters && (
            <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
              !
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Filtros
            <Badge variant="secondary">{props.totalResults} resultados</Badge>
          </SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-100px)] mt-4 pr-4">
          <FilterContent {...props} />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

export function ProductFilters(props: ProductFiltersProps) {
  return (
    <>
      <ProductFiltersDesktop {...props} />
      <ProductFiltersMobile {...props} />
    </>
  );
}
