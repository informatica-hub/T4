import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProject } from "@/contexts/ProjectContext";
import { useCatalogProducts } from "@/hooks/useCatalogProducts";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FolderKanban,
  Trash2,
  ArrowRight,
  Package,
  Loader2,
  Send,
  CheckCircle2,
  Plus,
  Clock,
  Download,
  Paperclip,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { NucleotideBackground } from "@/components/ui/NucleotideBackground";
import { ProductDetailModal } from "@/components/productos/ProductDetailModal";
import { CatalogProduct } from "@/hooks/useCatalogProducts";
import { downloadCombinedPedidoPdf, type PedidoPdfData } from "@/lib/pedidoPdf";
import { Seo } from "@/components/seo/Seo";
import { useAuth } from "@/contexts/AuthContext";

export default function Carrito() {
  const { items, triggerProduct, itemCount, removeItem, clearProject, addItem, hasItem } = useProject();
  const { data: allProducts } = useCatalogProducts();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastPedido, setLastPedido] = useState<{ data: PedidoPdfData; filename: string } | null>(null);
  const [redownloading, setRedownloading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    institution: "",
    laboratory: "",
    email: "",
    notes: "",
  });

  // Prefill email from profile/user
  useEffect(() => {
    if (user?.email && !form.email) {
      setForm((f) => ({ ...f, email: user.email! }));
    }
    if (profile?.company && !form.institution) {
      setForm((f) => ({ ...f, institution: profile.company! }));
    }
  }, [user, profile]);

  // Get related products based on upselling field of items in project
  const relatedProducts = (() => {
    if (!allProducts) return [];
    const itemIds = new Set(items.map((i) => i.product_id));
    const relatedIds = new Set<string>();

    items.forEach((item) => {
      const product = allProducts.find((p) => p.id === item.product_id);
      if (product?.upselling) {
        product.upselling.forEach((id) => {
          if (!itemIds.has(id)) relatedIds.add(id);
        });
      }
    });

    return allProducts.filter((p) => relatedIds.has(p.id));
  })();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Agrega al menos un producto a tu proyecto");
      return;
    }

    setSubmitting(true);
    try {
      const productsPayload = items.map((i) => {
        const p = allProducts?.find((ap) => ap.id === i.product_id);
        return {
          product_id: i.product_id,
          product_name: i.product_name,
          catalog_number: p?.catalog_number || null,
          category: p?.category?.name || null,
        };
      });

      const { data: insertedRequest, error } = await supabase
        .from("project_requests")
        .insert({
          user_id: user!.id,
          institution: form.institution,
          laboratory: form.laboratory,
          email: form.email,
          notes: form.notes || null,
          products: productsPayload,
          trigger_product_name: triggerProduct?.product_name || null,
        } as any)
        .select("id")
        .single();

      if (error) throw error;

      // Upload optional Excel attachment
      let attachmentUploaded = false;
      if (excelFile && insertedRequest?.id) {
        try {
          const safeName = excelFile.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
          const path = `${user!.id}/${insertedRequest.id}/${Date.now()}_${safeName}`;
          const { error: upErr } = await supabase.storage
            .from("project-attachments")
            .upload(path, excelFile, { upsert: false, contentType: excelFile.type });
          if (upErr) throw upErr;
          const { error: attErr } = await supabase.from("project_attachments").insert({
            project_request_id: insertedRequest.id,
            user_id: user!.id,
            file_path: path,
            file_name: excelFile.name,
            mime_type: excelFile.type || null,
            size_bytes: excelFile.size,
          } as any);
          if (attErr) throw attErr;
          attachmentUploaded = true;
        } catch (attachErr) {
          console.error("Error subiendo Excel:", attachErr);
          toast.error("La solicitud se guardó, pero falló la carga del Excel. Reinténtalo desde Mis Proyectos.");
        }
      }

      // Fire-and-forget email notification (no bloquea el flujo)
      supabase.functions
        .invoke("send-project-notification", {
          body: {
            type: "pedido",
            institution: form.institution,
            laboratory: form.laboratory,
            email: form.email,
            notes: form.notes || null,
            trigger_product_name: triggerProduct?.product_name || null,
            products: productsPayload,
          },
        })
        .catch((e) => console.warn("Email notification failed:", e));

      // Build single combined PDF (project summary + institutional catalog)
      const pdfData: PedidoPdfData = {
        institution: form.institution,
        laboratory: form.laboratory,
        email: form.email,
        notes: form.notes || null,
        trigger_product_name: triggerProduct?.product_name || null,
        products: productsPayload,
      };
      const safeInst = form.institution.replace(/[^a-z0-9]+/gi, "_").slice(0, 40);
      const filename = `Proyecto_T4_${safeInst || "solicitud"}.pdf`;

      try {
        await downloadCombinedPedidoPdf(pdfData, filename);
      } catch (pdfErr) {
        console.error("Error generando PDF combinado:", pdfErr);
        toast.error("La solicitud se guardó, pero falló la descarga del PDF. Usa el botón para reintentar.");
      }

      setLastPedido({ data: pdfData, filename });
      setSubmitted(true);
      setExcelFile(null);
      clearProject();
      toast.success(
        attachmentUploaded
          ? "¡Solicitud registrada con tu Excel adjunto! Descargamos tu PDF."
          : "¡Solicitud registrada! Descargamos tu PDF con el pedido y el catálogo."
      );
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Error al registrar la solicitud. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 py-[10px]">
      <Seo title="Arma tu Proyecto | T4" description="Arma tu proyecto y solicita cotización personalizada de oligos y sondas T4." noindex />
        <div className="container-width px-4 md:px-8">
          <div className="text-center py-16 max-w-md mx-auto">
            <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">¡Solicitud Registrada!</h1>
            <p className="text-muted-foreground mb-6">
              Hemos guardado tu proyecto y descargamos en tu equipo un{" "}
              <strong>PDF único</strong> que contiene el resumen de tus
              productos elegidos y el <strong>catálogo T4 OLIGO</strong>{" "}
              completo. Un Colega Científico te contactará pronto.
            </p>
            <div className="flex flex-col gap-3 items-center">
              {lastPedido && (
                <Button
                  variant="outline"
                  disabled={redownloading}
                  onClick={async () => {
                    setRedownloading(true);
                    try {
                      await downloadCombinedPedidoPdf(lastPedido.data, lastPedido.filename);
                    } catch {
                      toast.error("No se pudo generar el PDF, intenta de nuevo.");
                    } finally {
                      setRedownloading(false);
                    }
                  }}
                >
                  {redownloading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generando PDF...</>
                  ) : (
                    "Descargar PDF de nuevo"
                  )}
                </Button>
              )}
              <Button onClick={() => navigate("/productos")}>
                Explorar más productos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 py-[10px]">
      {/* Hero: Arma tu proyecto */}
      <section className="relative bg-muted/40 pb-8 md:pb-12 pt-20 md:pt-24">
        <NucleotideBackground />
        <div className="container-width px-4 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
              Diseña tus experimentos con precisión — oligos y sondas a tu medida
            </h1>
            <p className="text-xs text-gray-500 mb-6">
              Explora nuestro catálogo y encuentra las opciones que mejor se adaptan a tu proyecto: primers, sondas TaqMan, oligos personalizados y más, con las especificaciones que necesitas para obtener resultados confiables.
            </p>
            <h2 className="text-sm md:text-base font-semibold text-primary mb-3">
              Cuando estés listo para hacer tu solicitud, de oligos o sondas el proceso es muy sencillo:
            </h2>
            <ol className="list-decimal list-inside space-y-1 text-sm text-foreground mb-4 marker:font-semibold marker:text-primary">
              <li>Descarga el formato de solicitud</li>
              <li>Completa el formato con tus secuencias, especificaciones técnicas y datos de contacto.</li>
              <li>Súbelo a tu proyecto</li>
            </ol>
            <p className="text-xs text-gray-500 mb-6">
              ¿Tienes dudas sobre qué producto elegir o cómo llenar el formato? Estamos para ayudarte
            </p>
            <a href="/FORMATO_DE_SOLICITUD.xlsx" download>
              <Button size="lg" className="gap-2">
                <Download className="h-5 w-5" />
                Descargar formato de solicitud
              </Button>
            </a>
          </div>
        </div>
      </section>


      {/* Header */}
      <section className="relative bg-muted/30 pb-8 pt-8">
        <NucleotideBackground />
        <div className="container-width px-4 md:px-8 relative z-10">
          <div className="flex items-center gap-3">
            <FolderKanban className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Mi Proyecto</h1>
              <p className="text-muted-foreground">
                {itemCount === 0
                  ? "Aún no has seleccionado productos"
                  : `${itemCount} producto${itemCount > 1 ? "s" : ""} seleccionado${itemCount > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container-width px-4 md:px-8 py-8">
        {items.length === 0 && !showForm ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Tu proyecto está vacío</h2>
            <p className="text-muted-foreground mb-6">
              Explora nuestro catálogo y selecciona los productos que necesitas
            </p>
            <Button onClick={() => navigate("/productos")}>
              Ver Productos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items list */}
            <div className="lg:col-span-2 space-y-6">
              {/* Trigger product header */}
              {triggerProduct && (
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                    Producto principal
                  </p>
                  <p className="font-medium">{triggerProduct.product_name}</p>
                </div>
              )}

              {/* Selected products */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Productos seleccionados</h3>
                {items.map((item) => {
                  const product = allProducts?.find((p) => p.id === item.product_id);
                  const color = product?.category?.color || "#888888";
                  return (
                    <Card
                      key={item.product_id}
                      className="overflow-hidden cursor-pointer hover:shadow-md transition-all"
                      style={{ borderLeftWidth: "4px", borderLeftColor: color }}
                      onClick={() => product && setSelectedProduct(product)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              {product?.category && (
                                <Badge
                                  className="text-[10px] text-white px-1.5 py-0"
                                  style={{ backgroundColor: color }}
                                >
                                  {product.category.name}
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-[10px]">
                                {product?.brand === "t4" ? "T4" : "Partner"}
                              </Badge>
                            </div>
                            <p className="font-medium">{item.product_name}</p>
                            {product?.catalog_number && (
                              <p className="text-xs text-muted-foreground font-mono">
                                Cat. {product.catalog_number}
                              </p>
                            )}
                            {product?.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                {product.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 mt-2 flex-wrap">
                              {product?.delivery_time && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {product.delivery_time}
                                </span>
                              )}
                              {product?.applications && product.applications.length > 0 && (
                                <div className="flex gap-1">
                                  {product.applications.slice(0, 2).map((app) => (
                                    <Badge key={app} variant="secondary" className="text-[10px]">
                                      {app}
                                    </Badge>
                                  ))}
                                  {product.applications.length > 2 && (
                                    <Badge variant="secondary" className="text-[10px]">
                                      +{product.applications.length - 2}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeItem(item.product_id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Related products */}
              {relatedProducts.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Productos relacionados</h3>
                  <p className="text-sm text-muted-foreground">
                    Selecciona los productos que necesitas para complementar tu proyecto
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {relatedProducts.map((product) => {
                      const added = hasItem(product.id);
                      return (
                        <Card
                          key={product.id}
                          className={`cursor-pointer transition-all ${added ? "border-primary bg-primary/5" : "hover:border-primary/30"}`}
                          onClick={() => {
                            if (!added) {
                              addItem({ product_id: product.id, product_name: product.name });
                              toast.success(`${product.name} agregado`);
                            }
                          }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="font-medium text-sm truncate">{product.name}</p>
                                {product.description && (
                                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                    {product.description}
                                  </p>
                                )}
                                {product.category && (
                                  <Badge
                                    variant="outline"
                                    className="mt-2 text-[10px]"
                                    style={{ borderColor: product.category.color, color: product.category.color }}
                                  >
                                    {product.category.name}
                                  </Badge>
                                )}
                              </div>
                              {added ? (
                                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                              ) : (
                                <Plus className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Clear project */}
              {items.length > 0 && (
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={clearProject}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpiar proyecto
                </Button>
              )}
            </div>

            {/* Sidebar: Request form */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Enviar Solicitud
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Completa tus datos y un Colega Científico T4 te contactará con una cotización personalizada.
                  </p>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="institution">Institución *</Label>
                      <Input
                        id="institution"
                        required
                        value={form.institution}
                        onChange={(e) => setForm((f) => ({ ...f, institution: e.target.value }))}
                        placeholder="Universidad, centro de investigación..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="laboratory">Laboratorio *</Label>
                      <Input
                        id="laboratory"
                        required
                        value={form.laboratory}
                        onChange={(e) => setForm((f) => ({ ...f, laboratory: e.target.value }))}
                        placeholder="Nombre del laboratorio"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="tu@institucion.edu.mx"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notas adicionales</Label>
                      <Textarea
                        id="notes"
                        value={form.notes}
                        onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                        placeholder="Productos que no encuentras, especificaciones, cantidades..."
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="excel">Adjuntar formato en Excel (opcional)</Label>
                      {excelFile ? (
                        <div className="flex items-center justify-between gap-2 rounded-md border border-input bg-muted/40 px-3 py-2 text-sm">
                          <span className="flex items-center gap-2 min-w-0">
                            <Paperclip className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="truncate">{excelFile.name}</span>
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 flex-shrink-0"
                            onClick={() => setExcelFile(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Input
                          id="excel"
                          type="file"
                          accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            if (!/\.(xlsx|xls)$/i.test(f.name)) {
                              toast.error("Solo se permiten archivos .xlsx o .xls");
                              e.target.value = "";
                              return;
                            }
                            if (f.size > 10 * 1024 * 1024) {
                              toast.error("El archivo supera los 10 MB");
                              e.target.value = "";
                              return;
                            }
                            setExcelFile(f);
                          }}
                        />
                      )}
                      <p className="text-xs text-muted-foreground">
                        Puedes adjuntar el formato de solicitud que descargaste arriba (máx 10 MB).
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={submitting || items.length === 0}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Solicitud
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate("/productos")}
                    >
                      Agregar más productos
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>
          </div>
        )}
      </section>

      <ProductDetailModal
        producto={selectedProduct}
        open={!!selectedProduct}
        onOpenChange={(open) => !open && setSelectedProduct(null)}
        allProducts={allProducts || []}
      />
    </div>
  );
}
