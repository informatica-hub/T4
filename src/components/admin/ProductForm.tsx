import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCategories, useCatalogProducts, useSubcategories, CatalogProduct } from "@/hooks/useCatalogProducts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Upload, X as XIcon, Image as ImageIcon, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ReactMarkdown from 'react-markdown';

interface ProductFormProps {
  product?: CatalogProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const emptyProduct = {
  name: "",
  description: "",
  long_description: "",
  slogan: "",
  sku: "",
  catalog_number: "",
  delivery_time: "3-5 días",
  product_type: "producto",
  brand: "t4",
  featured: false,
  ruo: false,
  applications: [] as string[],
  tags: [] as string[],
  differentiator: "",
  cta: "",
  href: "",
  category_id: "",
  subcategory_id: "",
  presentations: "",
  list_price: null as number | null,
  image_url: null as string | null,
  upselling: [] as string[],
};

export function ProductForm({ product, open, onOpenChange }: ProductFormProps) {
  const { data: categories } = useCategories();
  const { data: allProducts } = useCatalogProducts();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyProduct);
  const [appsText, setAppsText] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [upsellingSearch, setUpsellingSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  

  const { data: subcategories } = useSubcategories(form.category_id || undefined);

  const isEdit = product?.id && product.id.length > 0 && product.id !== '';
  

 const applyItalic = (field: 'description' | 'long_description') => {
  const textarea = document.getElementById(field) as HTMLTextAreaElement;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  // Si no hay texto seleccionado, avisamos y salimos
  if (start === end) {
    toast.info('Selecciona la palabra que quieras poner en cursiva');
    return;
  }

  const selectedText = textarea.value.substring(start, end);
  const before = textarea.value.substring(0, start);
  const after = textarea.value.substring(end);

  // Envolvemos con * para Markdown (ej: *E. coli*)
  const newText = before + '*' + selectedText + '*' + after;

  // Actualizamos el estado del formulario
  setForm({ ...form, [field]: newText });

  // Restauramos el foco y mantenemos el texto seleccionado (para que veas el cambio)
  setTimeout(() => {
    textarea.focus();
    textarea.setSelectionRange(start + 1, end + 1);
  }, 10);
};

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        long_description: product.long_description || "",
        slogan: product.slogan || "",
        sku: product.sku || "",
        catalog_number: product.catalog_number || "",
        delivery_time: product.delivery_time || "3-5 días",
        product_type: product.product_type || "producto",
        brand: product.brand || "t4",
        featured: product.featured,
        ruo: product.ruo,
        applications: product.applications || [],
        tags: product.tags || [],
        differentiator: product.differentiator || "",
        cta: product.cta || "",
        href: product.href || "",
        category_id: product.category_id || "",
        subcategory_id: product.subcategory_id || "",
        presentations: product.presentations || "",
        list_price: product.list_price,
        image_url: product.image_url || null,
        upselling: product.upselling || [],
      });
      setAppsText((product.applications || []).join(", "));
      setTagsText((product.tags || []).join(", "));
      setImagePreview(product.image_url || null);
    } else {
      setForm(emptyProduct);
      setAppsText("");
      setTagsText("");
      setImagePreview(null);
    }
    setImageFile(null);
  }, [product, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setForm({ ...form, image_url: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadImage = async (file: File, productId: string): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `products/${productId}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("catalog-images").upload(path, file, { upsert: true });
    if (error) {
      console.error("Upload error:", error);
      return null;
    }
    const { data } = supabase.storage.from("catalog-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleCategoryChange = (v: string) => {
    setForm({ ...form, category_id: v, subcategory_id: "" });
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("El nombre es requerido");
      return;
    }

    setSaving(true);
    const payload: Record<string, any> = {
      ...form,
      applications: appsText.split(",").map((s) => s.trim()).filter(Boolean),
      tags: tagsText.split(",").map((s) => s.trim()).filter(Boolean),
      category_id: form.category_id || null,
      subcategory_id: form.subcategory_id || null,
      list_price: form.list_price || null,
      upselling: form.upselling,
    };

    if (imageFile) delete payload.image_url;

    let error;
    let resultId = product?.id;

    if (isEdit && product) {
      ({ error } = await (supabase as any).from("catalog_products").update(payload).eq("id", product.id));
    } else {
      const res = await (supabase as any).from("catalog_products").insert(payload).select("id").single();
      error = res.error;
      resultId = res.data?.id;
    }

    if (error) {
      setSaving(false);
      toast.error("Error al guardar producto");
      console.error(error);
      return;
    }

    if (imageFile && resultId) {
      const url = await uploadImage(imageFile, resultId);
      if (url) {
        await (supabase as any).from("catalog_products").update({ image_url: url }).eq("id", resultId);
      } else {
        toast.error("Error al subir imagen, producto guardado sin imagen");
      }
    } else if (!imageFile && form.image_url === null && product?.image_url) {
      await (supabase as any).from("catalog_products").update({ image_url: null }).eq("id", resultId);
    }

    setSaving(false);
    toast.success(isEdit ? "Producto actualizado" : "Producto creado");
    queryClient.invalidateQueries({ queryKey: ["catalog-products"] });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Image upload section */}
          <div className="space-y-2">
            <Label>Imagen del producto</Label>
            <div className="flex items-start gap-4">
              {imagePreview ? (
                <div className="relative w-24 h-24 rounded-lg border overflow-hidden bg-muted">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                  >
                    <XIcon className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-lg border border-dashed flex items-center justify-center bg-muted/50">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {imagePreview ? "Cambiar imagen" : "Subir imagen"}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <span className="text-xs text-muted-foreground">PNG, JPG o WEBP. Máx 5MB.</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Categoría</Label>
              <Select value={form.category_id} onValueChange={handleCategoryChange}>
                <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                <SelectContent>
                  {(categories || []).map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Subcategory selector - only show when category is selected */}
          {form.category_id && (
            <div className="space-y-2">
              <Label>Subcategoría</Label>
              <Select
                value={form.subcategory_id}
                onValueChange={(v) => setForm({ ...form, subcategory_id: v === "__none__" ? "" : v })}
              >
                <SelectTrigger><SelectValue placeholder="Sin subcategoría" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">Sin subcategoría</SelectItem>
                  {(subcategories || []).map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          

        <div className="space-y-2">
  <div className="flex items-center justify-between">
    <Label>Descripción corta</Label>
    <Button 
      type="button" 
      variant="ghost" 
      size="sm" 
      onClick={() => applyItalic('description')}
      className="h-7 px-2 text-xs"
    >
      <span className="italic font-serif mr-1">I</span> Cursiva
    </Button>
  </div>
  <Textarea
    id="description"
    value={form.description}
    onChange={(e) => setForm({ ...form, description: e.target.value })}
    rows={2}
    placeholder="Ej: Enzima de alta fidelidad para PCR"
  />
  
  
</div>

{/* DESCRIPCIÓN LARGA */}
<div className="space-y-2">
  <div className="flex items-center justify-between">
    <Label>Descripción larga</Label>
    <Button 
      type="button" 
      variant="ghost" 
      size="sm" 
      onClick={() => applyItalic('long_description')}
      className="h-7 px-2 text-xs"
    >
      <span className="italic font-serif mr-1">I</span> Cursiva
    </Button>
  </div>
  <Textarea
    id="long_description"
    value={form.long_description}
    onChange={(e) => setForm({ ...form, long_description: e.target.value })}
    rows={4}
    placeholder="Descripción detallada del producto..."
  />
  
  
</div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>SKU</Label>
              <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Nº Catálogo</Label>
              <Input value={form.catalog_number} onChange={(e) => setForm({ ...form, catalog_number: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Precio MXN</Label>
              <Input type="number" value={form.list_price ?? ""} onChange={(e) => setForm({ ...form, list_price: e.target.value ? Number(e.target.value) : null })} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Tiempo de entrega</Label>
              <Select value={form.delivery_time} onValueChange={(v) => setForm({ ...form, delivery_time: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inmediato">Inmediato</SelectItem>
                  <SelectItem value="3-5 días">3-5 días</SelectItem>
                  <SelectItem value="5-7 días">5-7 días</SelectItem>
                  <SelectItem value="7-10 días">7-10 días</SelectItem>
                  <SelectItem value="10-15 días">10-15 días</SelectItem>
                  <SelectItem value="15-30 días">15-30 días</SelectItem>
                  <SelectItem value="Variable">Variable</SelectItem>
                  <SelectItem value="Consultar">Consultar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={form.product_type} onValueChange={(v) => setForm({ ...form, product_type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="producto">Producto</SelectItem>
                  <SelectItem value="servicio">Servicio</SelectItem>
                  <SelectItem value="innovacion">Innovación</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Marca</Label>
              <Select value={form.brand} onValueChange={(v) => setForm({ ...form, brand: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="t4">T4</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="gen">Genes2Life</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Slogan</Label>
            <Input value={form.slogan} onChange={(e) => setForm({ ...form, slogan: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label>Aplicaciones (separadas por coma)</Label>
            <Input value={appsText} onChange={(e) => setAppsText(e.target.value)} placeholder="PCR, qPCR, Diagnóstico" />
          </div>

          <div className="space-y-2">
            <Label>Tags (separados por coma)</Label>
            <Input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="enzimas, Taq, polimerasa" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Diferenciador</Label>
              <Input value={form.differentiator} onChange={(e) => setForm({ ...form, differentiator: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>CTA</Label>
              <Input value={form.cta} onChange={(e) => setForm({ ...form, cta: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Ruta (href)</Label>
            <Input value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} placeholder="/contacto" />
          </div>

          {/* Productos Relacionados (upselling) */}
          <div className="space-y-2">
            <Label>Productos Relacionados</Label>
            {form.upselling.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.upselling.map((id) => {
                  const p = allProducts?.find((pr) => pr.id === id);
                  return (
                    <span key={id} className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs">
                      {p?.name || id.slice(0, 8)}
                      <button type="button" onClick={() => setForm({ ...form, upselling: form.upselling.filter((u) => u !== id) })}>
                        <XIcon className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="w-full justify-start text-muted-foreground">
                  <Search className="h-4 w-4 mr-2" />
                  Agregar producto relacionado…
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-2" align="start">
                <Input
                  placeholder="Buscar producto…"
                  value={upsellingSearch}
                  onChange={(e) => setUpsellingSearch(e.target.value)}
                  className="mb-2"
                />
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {(allProducts || [])
                    .filter((p) => p.id !== product?.id && !form.upselling.includes(p.id))
                    .filter((p) => !upsellingSearch || p.name.toLowerCase().includes(upsellingSearch.toLowerCase()))
                    
                    .map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent truncate"
                        onClick={() => {
                          setForm({ ...form, upselling: [...form.upselling, p.id] });
                          setUpsellingSearch("");
                        }}
                      >
                        {p.name}
                      </button>
                    ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
              <Label>Destacado</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.ruo} onCheckedChange={(v) => setForm({ ...form, ruo: v })} />
              <Label>RUO</Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : isEdit ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
