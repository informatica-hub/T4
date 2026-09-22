import { useState, useMemo, useCallback, useEffect} from "react";
import { useSearchParams } from "react-router-dom";
import { useCatalogProducts, CatalogProduct, useCategories, useSubcategories } from "@/hooks/useCatalogProducts";

export interface FilterState {
  marcas: string[];
  categorias: string[];
  subcategorias: string[];
  aplicaciones: string[];
  tipos: string[];
  tiempoEntrega: string;
}

const defaultFilters: FilterState = {
  marcas: [],
  categorias: [],
  subcategorias: [],
  aplicaciones: [],
  tipos: [],
  tiempoEntrega: "",
};

export function useProductFilter() {
  const { data: allProducts = [], isLoading } = useCatalogProducts();
  const { data: categories = [] } = useCategories();
  const { data: subcategories = [] } = useSubcategories();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  // Subcategories relevant to currently selected categories
  const availableSubcategories = useMemo(() => {
    if (filters.categorias.length === 0) return subcategories;
    const selectedCatIds = categories
      .filter((c) => filters.categorias.includes(c.slug))
      .map((c) => c.id);
    return subcategories.filter((s) => selectedCatIds.includes(s.category_id));
  }, [filters.categorias, categories, subcategories]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === "" ||
        p.name.toLowerCase().includes(query) ||
        (p.catalog_number || "").toLowerCase().includes(query) ||
        (p.description || "").toLowerCase().includes(query) ||
        (p.long_description || "").toLowerCase().includes(query) ||
        p.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        p.applications.some((app) => app.toLowerCase().includes(query)) ||
        (p.slogan || "").toLowerCase().includes(query) ||
        (p.differentiator || "").toLowerCase().includes(query);

      const matchesMarca =
        filters.marcas.length === 0 || filters.marcas.includes(p.brand);

      const matchesCategoria =
        filters.categorias.length === 0 ||
        (p.category && filters.categorias.includes(p.category.slug));

      const matchesSubcategoria =
        filters.subcategorias.length === 0 ||
        (p.subcategory_id && filters.subcategorias.includes(p.subcategory_id));

      const matchesAplicacion =
        filters.aplicaciones.length === 0 ||
        p.applications.some((app) => filters.aplicaciones.includes(app));

      const matchesTipo =
        filters.tipos.length === 0 || filters.tipos.includes(p.product_type);

      const matchesTiempo =
        filters.tiempoEntrega === "" ||
        p.delivery_time === filters.tiempoEntrega;

      return matchesSearch && matchesMarca && matchesCategoria && matchesSubcategoria && matchesAplicacion && matchesTipo && matchesTiempo;
    });
  }, [filters, searchQuery, allProducts]);

  const toggleFilter = useCallback(
    (type: keyof FilterState, value: string) => {
      setFilters((prev) => {
        if (type === "tiempoEntrega") {
          return { ...prev, tiempoEntrega: prev.tiempoEntrega === value ? "" : value };
        }
        const currentValues = prev[type] as string[];
        const newValues = currentValues.includes(value)
          ? currentValues.filter((v) => v !== value)
          : [...currentValues, value];
        const next = { ...prev, [type]: newValues };
        // Clear subcategory filter when category changes
        if (type === "categorias") {
          next.subcategorias = [];
        }
        return next;
      });
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
    setSearchQuery("");
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery !== "" ||
      filters.marcas.length > 0 ||
      filters.categorias.length > 0 ||
      filters.subcategorias.length > 0 ||
      filters.aplicaciones.length > 0 ||
      filters.tipos.length > 0 ||
      filters.tiempoEntrega !== ""
    );
  }, [filters, searchQuery]);

  useEffect(() => {
  const categoria = searchParams.get("categoria");

  if (categoria) {
    setFilters((prev) => ({
      ...prev,
      categorias: [categoria],
    }));
  }
}, [searchParams]);
  

  return {
    productos: filteredProducts,
    allProducts,
    categories,
    subcategories: availableSubcategories,
    filters,
    searchQuery,
    setSearchQuery,
    toggleFilter,
    clearFilters,
    hasActiveFilters,
    totalResults: filteredProducts.length,
    isLoading,
  };
}
