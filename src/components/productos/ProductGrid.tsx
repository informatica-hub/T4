// ProductGrid.tsx
import { useState, useMemo } from "react";
import { CatalogProduct } from "@/hooks/useCatalogProducts";
import { ProductCard } from "./ProductCard";
import { SearchBar } from "./SearchBar";
import { Package } from "lucide-react";

interface ProductGridProps {
  productos: CatalogProduct[];
  allProducts?: CatalogProduct[];
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
}

export function ProductGrid({ 
  productos, 
  allProducts = [],
  searchTerm: externalSearchTerm,
  onSearchChange: externalOnSearchChange
}: ProductGridProps) {
  const [internalSearchTerm, setInternalSearchTerm] = useState("");
  
  const searchTerm = externalSearchTerm !== undefined ? externalSearchTerm : internalSearchTerm;
  const setSearchTerm = externalOnSearchChange || setInternalSearchTerm;

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) {
      return productos;
    }

    const searchLower = searchTerm.toLowerCase().trim();
    return productos.filter((producto) => {
      // Usar todas las propiedades relevantes para búsqueda
      const searchFields = [
        producto.name,
        producto.description,
        producto.sku,
        producto.brand,
        producto.product_type, // ← así se llama en tu interfaz
        producto.catalog_number,
        producto.slogan,
        producto.subcategory, // subcategoría directa
        producto.category?.name, // categoría del join
        ...(producto.tags || []), // tags como array
        ...(producto.applications || []), // aplicaciones como array
      ];

      return searchFields.some(field => {
        if (!field) return false;
        return field.toString().toLowerCase().includes(searchLower);
      });
    });
  }, [productos, searchTerm]);

  if (filteredProducts.length === 0) {
    return (
      <div className="space-y-6">
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm}
          placeholder="Buscar productos..."
          className="w-full max-w-md"
        />
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            No se encontraron productos
          </h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {searchTerm ? (
              <>
                No hay productos que coincidan con "<strong>{searchTerm}</strong>"
                <br />
                <button 
                  onClick={() => setSearchTerm("")}
                  className="text-primary hover:underline mt-2"
                >
                  Limpiar búsqueda
                </button>
              </>
            ) : (
              "Intenta ajustar los filtros para encontrar lo que necesitas."
            )}
          </p>
        </div>
      </div>
    );
  }

return (
  <div className="min-h-screen">
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 -mx-4 px-4">
      <SearchBar 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm}
        placeholder="Buscar por nombre, categoría, marca..."
        className="w-full max-w-md"
      />
    </div>
     <div className="px-4 pt-4">
    {searchTerm && (
      <p className="text-sm text-muted-foreground">
        {filteredProducts.length} resultado{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
        {searchTerm && ` para "${searchTerm}"`}
      </p>
    )}

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((producto) => (
        <ProductCard key={producto.id} producto={producto} allProducts={allProducts} />
      ))}
    </div>
    </div>
  </div>
);
}