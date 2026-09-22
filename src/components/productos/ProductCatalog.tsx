// src/components/productos/ProductCatalog.tsx
import { useProductFilter } from "@/hooks/useProductFilter";
import { ProductGrid } from "./ProductGrid";
import { ProductFilters } from "./ProductFilters";

export function ProductCatalog() {
  const {
    productos,
    allProducts,
    categories,
    subcategories,
    filters,
    toggleFilter,
    clearFilters,
    hasActiveFilters,
    totalResults,
    isLoading,
  } = useProductFilter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header con filtros mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <ProductFilters 
              filters={filters}
              onToggleFilter={toggleFilter}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
              totalResults={totalResults}
              categories={categories}
              subcategories={subcategories}
            />
          </div>
        </div>

        {/* Contenido principal con filtros y grid */}
        <div className="flex gap-8">
          <ProductFilters 
            filters={filters}
            onToggleFilter={toggleFilter}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            totalResults={totalResults}
            categories={categories}
            subcategories={subcategories}
          />

          <div className="flex-1">
            <ProductGrid 
              productos={productos}  
              allProducts={allProducts}
            />
          </div>
        </div>
      </div>
    </div>
  );
}