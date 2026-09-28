import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCategories,
  useSubcategories,
} from "@/hooks/useCatalogProducts";

type CtaType = "none" | "products" | "category" | "subcategory" | "custom";

interface Props {
  value: string;
  onChange: (url: string) => void;
  ctaText: string;
  onCtaTextChange: (text: string) => void;
}

export function CtaLinkBuilder({
  value,
  onChange,
  ctaText,
  onCtaTextChange,
}: Props) {
  const { data: categories = [] } = useCategories();
  const { data: subcategories = [] } = useSubcategories();

  const [type, setType] = useState<CtaType>(() => {
    if (!value) return "none";
    if (value === "/productos") return "products";
    if (value.startsWith("/productos?categoria=")) return "category";
    if (value.startsWith("/productos?subcategoria=")) return "subcategory";
    return "custom";
  });

  const [categorySlug, setCategorySlug] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [customUrl, setCustomUrl] = useState(value);

  // Precargar cuando el admin edita una campaña existente
  useEffect(() => {
    if (value.startsWith("/productos?categoria=")) {
      setCategorySlug(value.replace("/productos?categoria=", ""));
    }
    if (value.startsWith("/productos?subcategoria=")) {
      setSubcategoryId(value.replace("/productos?subcategoria=", ""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Subcategorías de la categoría seleccionada
  const availableSubcategories = useMemo(() => {
    if (!categorySlug) return subcategories;
    const cat = categories.find((c) => c.slug === categorySlug);
    if (!cat) return subcategories;
    return subcategories.filter((s) => s.category_id === cat.id);
  }, [categorySlug, categories, subcategories]);

  const buildUrl = () => {
    switch (type) {
      case "none":
        return "";
      case "products":
        return "/productos";
      case "category":
        return categorySlug ? `/productos?categoria=${categorySlug}` : "";
      case "subcategory":
        return subcategoryId ? `/productos?subcategoria=${subcategoryId}` : "";
      case "custom":
        return customUrl;
    }
  };

  useEffect(() => {
    onChange(buildUrl());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, categorySlug, subcategoryId, customUrl]);

  return (
    <div className="space-y-3 rounded-md border p-3 bg-muted/30">
      <div>
        <Label className="text-xs">¿A dónde lleva el botón?</Label>
        <select
          className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm mt-1"
          value={type}
          onChange={(e) => setType(e.target.value as CtaType)}
        >
          <option value="none">Sin botón</option>
          <option value="products">Todos los productos</option>
          <option value="category">Productos de una categoría</option>
          
          <option value="custom">URL personalizada</option>
        </select>
      </div>

      {type === "category" && (
        <div>
          <Label className="text-xs">Categoría</Label>
          <select
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm mt-1"
            value={categorySlug}
            onChange={(e) => {
              setCategorySlug(e.target.value);
              setSubcategoryId("");
            }}
          >
            <option value="">Selecciona una categoría...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {type === "subcategory" && (
        <>
          <div>
            <Label className="text-xs">Categoría (para filtrar opciones)</Label>
            <select
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm mt-1"
              value={categorySlug}
              onChange={(e) => {
                setCategorySlug(e.target.value);
                setSubcategoryId("");
              }}
            >
              <option value="">Todas las categorías</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-xs">Subcategoría</Label>
            <select
              className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm mt-1"
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
            >
              <option value="">Selecciona una subcategoría...</option>
              {availableSubcategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {type === "custom" && (
        <div>
          <Label className="text-xs">URL personalizada</Label>
          <Input
            className="mt-1"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="/productos o https://..."
          />
        </div>
      )}

      {type !== "none" && (
        <>
          <div>
            <Label className="text-xs">Texto del botón</Label>
            <Input
              className="mt-1"
              value={ctaText}
              onChange={(e) => onCtaTextChange(e.target.value)}
              placeholder="Ver productos"
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            URL resultante: <code>{buildUrl() || "—"}</code>
          </p>
        </>
      )}
    </div>
  );
}