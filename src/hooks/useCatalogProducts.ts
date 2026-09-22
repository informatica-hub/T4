import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CatalogCategory {
  id: string;
  slug: string;
  name: string;
  color: string;
  icon_url: string | null;
  sort_order: number;
}

export interface CatalogSubcategory {
  id: string;
  category_id: string;
  name: string;
  sort_order: number;
}

export interface CatalogProduct {
  id: string;
  category_id: string | null;
  subcategory_id: string | null;
  subcategory: string | null;
  catalog_number: string | null;
  name: string;
  description: string | null;
  long_description: string | null;
  slogan: string | null;
  presentations: string | null;
  sku: string | null;
  list_price: number | null;
  delivery_time: string | null;
  applications: string[];
  upselling: string[];
  product_type: string;
  brand: string;
  featured: boolean;
  ruo: boolean;
  tags: string[];
  differentiator: string | null;
  cta: string | null;
  href: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  category?: CatalogCategory;
  subcategoryObj?: CatalogSubcategory;
}

export function useCategories() {
  return useQuery({
    queryKey: ["product-categories"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("product_categories")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as CatalogCategory[];
    },
  });
}

export function useSubcategories(categoryId?: string) {
  return useQuery({
    queryKey: ["product-subcategories", categoryId || "all"],
    queryFn: async () => {
      let query = (supabase as any)
        .from("product_subcategories")
        .select("*")
        .order("sort_order");
      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as CatalogSubcategory[];
    },
  });
}

export function useCatalogProducts() {
  const { data: categories } = useCategories();
  const { data: subcategories } = useSubcategories();

  return useQuery({
    queryKey: ["catalog-products", categories, subcategories],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("catalog_products")
        .select("*")
        .order("name");
      if (error) throw error;

      const catMap = new Map(
        (categories || []).map((c: CatalogCategory) => [c.id, c])
      );
      const subMap = new Map(
        (subcategories || []).map((s: CatalogSubcategory) => [s.id, s])
      );

      return (data as CatalogProduct[]).map((p) => ({
        ...p,
        applications: p.applications || [],
        upselling: p.upselling || [],
        tags: p.tags || [],
        category: catMap.get(p.category_id || "") || undefined,
        subcategoryObj: subMap.get(p.subcategory_id || "") || undefined,
      }));
    },
    enabled: !!categories && !!subcategories,
  });
}
