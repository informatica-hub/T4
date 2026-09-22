import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCategories, useSubcategories, CatalogCategory, CatalogSubcategory } from "@/hooks/useCatalogProducts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pencil, Check, X, Upload, ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";

export function CategoryManager() {
  const { data: categories, isLoading } = useCategories();
  const { data: allSubcategories } = useSubcategories();
  const queryClient = useQueryClient();
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<CatalogCategory>>({});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [newSubName, setNewSubName] = useState("");
  const [editSubId, setEditSubId] = useState<string | null>(null);
  const [editSubData, setEditSubData] = useState<Partial<CatalogSubcategory>>({});
  const [newCatName, setNewCatName] = useState("");
  const [newCatColor, setNewCatColor] = useState("#888888");
  const [newCatOrder, setNewCatOrder] = useState<number | "">("");
  const [creating, setCreating] = useState(false);

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const createCategory = async () => {
    if (!newCatName.trim()) {
      toast.error("El nombre es requerido");
      return;
    }
    setCreating(true);
    const baseSlug = slugify(newCatName) || `cat-${Date.now()}`;
    const existing = new Set((categories || []).map((c) => c.slug));
    let slug = baseSlug;
    let i = 2;
    while (existing.has(slug)) slug = `${baseSlug}-${i++}`;
    const sort_order = newCatOrder === "" ? (categories?.length ?? 0) : Number(newCatOrder);
    const { error } = await (supabase as any)
      .from("product_categories")
      .insert({ name: newCatName.trim(), slug, color: newCatColor, sort_order });
    setCreating(false);
    if (error) {
      toast.error("Error al crear categoría");
    } else {
      toast.success("Categoría creada");
      setNewCatName("");
      setNewCatColor("#888888");
      setNewCatOrder("");
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
    }
  };

  const startEdit = (cat: CatalogCategory) => {
    setEditId(cat.id);
    setEditData({ name: cat.name, color: cat.color, sort_order: cat.sort_order });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>, catId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `categories/${catId}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("catalog-images").upload(path, file, { upsert: true });
    if (uploadError) {
      toast.error("Error al subir icono");
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("catalog-images").getPublicUrl(path);
    const { error } = await (supabase as any)
      .from("product_categories")
      .update({ icon_url: data.publicUrl })
      .eq("id", catId);
    setUploading(false);
    if (error) {
      toast.error("Error al actualizar icono");
    } else {
      toast.success("Icono actualizado");
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
    }
  };

  const saveEdit = async () => {
    if (!editId) return;
    const { error } = await (supabase as any)
      .from("product_categories")
      .update(editData)
      .eq("id", editId);

    if (error) {
      toast.error("Error al actualizar categoría");
    } else {
      toast.success("Categoría actualizada");
      queryClient.invalidateQueries({ queryKey: ["product-categories"] });
      cancelEdit();
    }
  };

  const toggleExpand = (catId: string) => {
    setExpandedCat(expandedCat === catId ? null : catId);
    setNewSubName("");
    setEditSubId(null);
  };

  const subsForCat = (catId: string) =>
    (allSubcategories || []).filter((s) => s.category_id === catId).sort((a, b) => a.sort_order - b.sort_order);

  const addSubcategory = async (catId: string) => {
    if (!newSubName.trim()) return;
    const nextOrder = subsForCat(catId).length;
    const { error } = await (supabase as any)
      .from("product_subcategories")
      .insert({ category_id: catId, name: newSubName.trim(), sort_order: nextOrder });
    if (error) {
      toast.error("Error al crear subcategoría");
    } else {
      toast.success("Subcategoría creada");
      setNewSubName("");
      queryClient.invalidateQueries({ queryKey: ["product-subcategories"] });
    }
  };

  const deleteSubcategory = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar subcategoría "${name}"?`)) return;
    const { error } = await (supabase as any).from("product_subcategories").delete().eq("id", id);
    if (error) {
      toast.error("Error al eliminar");
    } else {
      toast.success("Subcategoría eliminada");
      queryClient.invalidateQueries({ queryKey: ["product-subcategories"] });
    }
  };

  const startEditSub = (sub: CatalogSubcategory) => {
    setEditSubId(sub.id);
    setEditSubData({ name: sub.name, sort_order: sub.sort_order });
  };

  const saveEditSub = async () => {
    if (!editSubId) return;
    const { error } = await (supabase as any)
      .from("product_subcategories")
      .update(editSubData)
      .eq("id", editSubId);
    if (error) {
      toast.error("Error al actualizar subcategoría");
    } else {
      toast.success("Subcategoría actualizada");
      queryClient.invalidateQueries({ queryKey: ["product-subcategories"] });
      setEditSubId(null);
      setEditSubData({});
    }
  };

  if (isLoading) return <div className="py-8 text-center text-muted-foreground">Cargando...</div>;

  return (
    <div className="space-y-4">
      <div className="border rounded-lg p-4 bg-muted/20">
        <p className="text-sm font-medium mb-3">Nueva categoría</p>
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-muted-foreground">Nombre</label>
            <Input
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="Ej. Reactivos"
              className="h-9"
              onKeyDown={(e) => e.key === "Enter" && createCategory()}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Color</label>
            <Input
              type="color"
              value={newCatColor}
              onChange={(e) => setNewCatColor(e.target.value)}
              className="w-14 h-9 p-1"
            />
          </div>
          <div className="w-24">
            <label className="text-xs text-muted-foreground">Orden</label>
            <Input
              type="number"
              value={newCatOrder}
              onChange={(e) => setNewCatOrder(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="auto"
              className="h-9"
            />
          </div>
          <Button onClick={createCategory} disabled={creating} className="h-9 gap-1">
            <Plus className="h-4 w-4" /> Agregar categoría
          </Button>
        </div>
      </div>
      <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead className="w-12">Orden</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead className="w-24">Color</TableHead>
            <TableHead className="w-48">Icono</TableHead>
            <TableHead className="w-24">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(categories || []).map((cat) => {
            const subs = subsForCat(cat.id);
            const isExpanded = expandedCat === cat.id;
            return (
              <>
                <TableRow key={cat.id}>
                  <TableCell>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toggleExpand(cat.id)}>
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {editId === cat.id ? (
                      <Input
                        type="number"
                        value={editData.sort_order ?? ""}
                        onChange={(e) => setEditData({ ...editData, sort_order: Number(e.target.value) })}
                        className="w-16 h-8"
                      />
                    ) : (
                      cat.sort_order
                    )}
                  </TableCell>
                  <TableCell>
                    {editId === cat.id ? (
                      <Input
                        value={editData.name ?? ""}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="h-8"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                        {cat.name}
                        <span className="text-xs text-muted-foreground">({subs.length} sub)</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editId === cat.id ? (
                      <Input
                        type="color"
                        value={editData.color ?? "#888888"}
                        onChange={(e) => setEditData({ ...editData, color: e.target.value })}
                        className="w-12 h-8 p-0 border-0"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded border" style={{ backgroundColor: cat.color }} />
                        <span className="text-xs font-mono text-muted-foreground">{cat.color}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {cat.icon_url ? (
                        <img src={cat.icon_url} alt={cat.name} className="w-8 h-8 rounded object-cover" />
                      ) : (
                        <span className="text-xs text-muted-foreground">Sin icono</span>
                      )}
                      {editId === cat.id && (
                        <>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            disabled={uploading}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-3 w-3" />
                          </Button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleIconUpload(e, cat.id)}
                          />
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {editId === cat.id ? (
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={saveEdit} className="h-8 w-8">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={cancelEdit} className="h-8 w-8">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button size="icon" variant="ghost" onClick={() => startEdit(cat)} className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
                {isExpanded && (
                  <TableRow key={`${cat.id}-subs`}>
                    <TableCell colSpan={6} className="bg-muted/30 p-4">
                      <div className="space-y-2 pl-6">
                        <p className="text-sm font-medium text-muted-foreground">Subcategorías de {cat.name}</p>
                        {subs.map((sub) => (
                          <div key={sub.id} className="flex items-center gap-2">
                            {editSubId === sub.id ? (
                              <>
                                <Input
                                  type="number"
                                  value={editSubData.sort_order ?? 0}
                                  onChange={(e) => setEditSubData({ ...editSubData, sort_order: Number(e.target.value) })}
                                  className="w-16 h-8"
                                />
                                <Input
                                  value={editSubData.name ?? ""}
                                  onChange={(e) => setEditSubData({ ...editSubData, name: e.target.value })}
                                  className="h-8 max-w-xs"
                                />
                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={saveEditSub}>
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditSubId(null)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <span className="text-xs text-muted-foreground w-6 text-right">{sub.sort_order}</span>
                                <span className="text-sm">{sub.name}</span>
                                <Button size="icon" variant="ghost" className="h-7 w-7 ml-auto" onClick={() => startEditSub(sub)}>
                                  <Pencil className="h-3 w-3" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => deleteSubcategory(sub.id, sub.name)}>
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        ))}
                        <div className="flex items-center gap-2 pt-1">
                          <Input
                            placeholder="Nueva subcategoría…"
                            value={newSubName}
                            onChange={(e) => setNewSubName(e.target.value)}
                            className="h-8 max-w-xs"
                            onKeyDown={(e) => e.key === "Enter" && addSubcategory(cat.id)}
                          />
                          <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => addSubcategory(cat.id)}>
                            <Plus className="h-3 w-3" /> Agregar
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
