import { useProductFilter } from "@/hooks/useProductFilter";
import { ProductGrid, ProductFiltersDesktop, ProductFiltersMobile } from "@/components/productos";
import { NucleotideBackground } from "@/components/ui/NucleotideBackground";
import { Seo } from "@/components/seo/Seo";

export default function Productos() {
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

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Productos: Oligos, sondas qPCR y RNA | T4 México" description="Catálogo de oligonucleótidos, sondas qPCR, RNA, modificaciones químicas y genes sintéticos producidos en México por T4." keywords="oligonucleótidos México, sondas qPCR México, primers personalizados, síntesis RNA México" />
      {/* Header */}
      <section className="relative bg-muted/40 pt-20 pb-4 md:pt-24 md:pb-12">
        <NucleotideBackground />
        <div className="container-width px-4 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-3xl font-semibold text-foreground mt-4 mb-2">
              Arma tu proyecto. Nosotros lo producimos.
            </h1>
            <p className="text-xs text-gray-500 mt-2">
              Agrega productos y servicios en un solo proyecto y recibe tu cotización. · ISO 9001:2015 · Hecho en México
            </p>
            <h2 className="text-sm md:text-base font-semibold text-primary mt-1 mb-2">
              Oligos y sondas: Descarga el formato, llénalo con tus secuencias y súbelo a tu proyecto.
            </h2>
          </div>
        </div>
      </section>

      {/* Mobile filters bar */}
      <section className="sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-sm border-b lg:hidden">
        <div className="container-width px-4 py-3">
          <ProductFiltersMobile
            filters={filters}
            onToggleFilter={toggleFilter}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            totalResults={totalResults}
            categories={categories}
            subcategories={subcategories}
          />
        </div>
      </section>

      {/* Main Content */}
      <section className="container-width px-4 md:px-8 py-8">
        <div className="flex gap-8">
          <ProductFiltersDesktop
            filters={filters}
            onToggleFilter={toggleFilter}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            totalResults={totalResults}
            categories={categories}
            subcategories={subcategories}
          />
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : (
              <ProductGrid productos={productos} allProducts={allProducts} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
