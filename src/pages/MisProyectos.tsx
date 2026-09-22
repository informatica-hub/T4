import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FolderKanban, Download, Loader2, Plus, FileText, Paperclip, FileSpreadsheet, Trash2, Upload,
} from "lucide-react";
import { NucleotideBackground } from "@/components/ui/NucleotideBackground";
import { Seo } from "@/components/seo/Seo";
import { downloadCombinedPedidoPdf, type PedidoPdfData } from "@/lib/pedidoPdf";
import { toast } from "sonner";


interface ProjectRequest {
  id: string;
  institution: string;
  laboratory: string;
  email: string;
  notes: string | null;
  trigger_product_name: string | null;
  products: any;
  status: string;
  created_at: string;
  has_update: boolean | null; 
}

interface Attachment {
  id: string;
  project_request_id: string;
  user_id: string;
  file_path: string;
  file_name: string;
  size_bytes: number | null;
  kind?: "user_excel" | "payment_proof" | "admin_quote";
  created_at: string;
}

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  pending: { label: "Pendiente", variant: "secondary" },
  nuevo: { label: "Pendiente", variant: "secondary" },
  en_proceso: { label: "En proceso", variant: "default" },
  cotizado: { label: "Cotizado", variant: "default" },
  cerrado: { label: "Cerrado", variant: "outline" },
};

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXT = [".xlsx", ".xls"];

const MAX_PAYMENT_SIZE = 10 * 1024 * 1024; // 5 MB
const ALLOWED_PAYMENT_EXT = [".pdf", ".png", ".jpg", ".jpeg" ];

export default function MisProyectos() {
  const { user, profile } = useAuth();
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [attachments, setAttachments] = useState<Record<string, Attachment[]>>({});
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});
  const [uploadingPaymentId, setUploadingPaymentId] = useState<string | null>(null);
  const paymentFileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const [reqRes, attRes] = await Promise.all([
        supabase
          .from("project_requests")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        (supabase as any)
          .from("project_attachments")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);
      if (reqRes.error) {
        toast.error("No pudimos cargar tus proyectos");
      } else {
        setRequests((reqRes.data as any[]) || []);
      }
      if (!attRes.error) {
        const grouped: Record<string, Attachment[]> = {};
        ((attRes.data as Attachment[]) || []).forEach((a) => {
          (grouped[a.project_request_id] ||= []).push(a);
        });
        setAttachments(grouped);
      }
      setLoading(false);
    })();
  }, [user]);

  const handleDownload = async (req: ProjectRequest) => {
    setDownloading(req.id);
    try {
      const data: PedidoPdfData = {
        institution: req.institution,
        laboratory: req.laboratory,
        email: req.email,
        notes: req.notes,
        trigger_product_name: req.trigger_product_name,
        products: Array.isArray(req.products) ? req.products : [],
        created_at: req.created_at,
      };
      const safeInst = req.institution.replace(/[^a-z0-9]+/gi, "_").slice(0, 40);
      const filename = `Proyecto_T4_${safeInst || "solicitud"}_${req.id.slice(0, 8)}.pdf`;
      await downloadCombinedPedidoPdf(data, filename);
    } catch (e) {
      console.error(e);
      toast.error("No se pudo generar el PDF");
    } finally {
      setDownloading(null);
    }
  };


  const handleUpload = async (req: ProjectRequest, file: File) => {
    if (!user) return;
    const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      toast.error("Solo se permiten archivos Excel (.xlsx, .xls)");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("El archivo excede 10 MB");
      return;
    }
    const existing = (attachments[req.id] || []).filter((a) => a.kind !== "admin_quote");
    if (existing.length > 0) {
      if (!confirm("Ya hay un Excel adjunto. ¿Reemplazarlo?")) return;
    }
    setUploadingId(req.id);
    try {
      // Replace: remove existing first
      if (existing.length > 0) {
        await supabase.storage
          .from("project-attachments")
          .remove(existing.map((a) => a.file_path));
        await (supabase as any)
          .from("project_attachments")
          .delete()
          .in("id", existing.map((a) => a.id));
      }
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
      const path = `${user.id}/${req.id}/${Date.now()}_${safeName}`;
      const { error: upErr } = await supabase.storage
        .from("project-attachments")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;
      
      const { data: row, error: insErr } = await (supabase as any)
        .from("project_attachments")
        .insert({
          project_request_id: req.id,
          user_id: user.id,
          file_path: path,
          file_name: file.name,
          mime_type: file.type || null,
          size_bytes: file.size,
          kind: "user_excel",
        })
        .select()
        .single();
      if (insErr) throw insErr;

      //edge function actualizar solicitud
       if (existing.length > 0) {
        const { error: fnErr } = await supabase.functions.invoke("notify-file-updated", {
          body: {
            type: "archivo_reemplazado",
            project_request_id: req.id,
            user_id: user.id,
            previous_attachment_ids: existing.map((a) => a.id),
            previous_file_paths: existing.map((a) => a.file_path),
            new_attachment: {
              id: row.id,
              file_path: row.file_path,
              file_name: row.file_name,
              mime_type: row.mime_type,
              size_bytes: row.size_bytes,
            },
            project_name: (req as any).name ?? null,
            user_email: user.email ?? null,
            user_name: (user.user_metadata?.full_name as string) ?? null,
            client: {
              name: (req as any).client_name ?? (req as any).contact_name ?? null,
              institution: (req as any).institution ?? null,
              laboratory: (req as any).laboratory ?? null,
              email: (req as any).email ?? (req as any).contact_email ?? null,
            },
          },
        });

        if (fnErr) {
          console.error("Error invocando notify-file-updated:", fnErr);
        } else if (req.status === "cotizado") {
          setRequests((prev) =>
            prev.map((r) =>
              r.id === req.id
                ? { ...r, status: "pending", has_update: true }
                : r
            )
          );
        }
      }

      setAttachments((prev) => {
        const others = (prev[req.id] || []).filter((a) => a.kind === "admin_quote");
        return { ...prev, [req.id]: [row as Attachment, ...others] };
      });
      toast.success(existing.length > 0 ? "Excel reemplazado" : "Excel adjuntado al proyecto");
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "No se pudo subir el archivo");
    } finally {
      setUploadingId(null);
    }
  };




 const handleUploadPaymentProof = async (req: ProjectRequest, file: File) => {
  if (!user) return;

 
  const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
  if (!ALLOWED_PAYMENT_EXT.includes(ext)) {
    toast.error("Solo se permiten PDF o imágenes (png, jpg, jpeg, gif)");
    return;
  }
  if (file.size > MAX_PAYMENT_SIZE) {
    toast.error("El archivo excede 5 MB");
    return;
  }

 
  const existing = (attachments[req.id] || []).filter((a) => a.kind === "payment_proof");
  if (existing.length > 0 && !confirm("Ya hay un comprobante de pago. ¿Reemplazarlo?")) return;

  setUploadingPaymentId(req.id);
  try {
    
    if (existing.length > 0) {
      await supabase.storage
        .from("project-attachments")
        .remove(existing.map((a) => a.file_path));
      await supabase
        .from("project_attachments")
        .delete()
        .in("id", existing.map((a) => a.id));
    }


    const { data: registro, error: fetchError } = await supabase
      .from("project_attachments")
      .select("file_name")
      .eq('project_request_id', req.id)  
      .eq('kind', 'admin_quote')         
      .ilike('file_path', `quotes/${req.id}/%`) 
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (fetchError) throw fetchError;


    let baseName = "Sin_Cotizacion";
    if (registro && registro.file_name) {
      baseName = registro.file_name.replace(/\.[^/.]+$/, "");
    }

    const newName = `CDP-${baseName}${ext}`; 
    const safeName = newName.replace(/[^a-zA-Z0-9._-]+/g, "_");
    const path = `${user.id}/${req.id}/payment_${Date.now()}_${safeName}`;
    const { error: upErr } = await supabase.storage
      .from("project-attachments")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (upErr) throw upErr;

  
    const { data: row, error: insErr } = await supabase
      .from("project_attachments")
      .insert({
        project_request_id: req.id,
        user_id: user.id,
        file_path: path,
        file_name: safeName,
        mime_type: file.type || null,
        size_bytes: file.size,
        kind: "payment_proof",
      })
      .select()
      .single();
    if (insErr) throw insErr;

  
    setAttachments((prev) => {
      const others = (prev[req.id] || []).filter((a) => a.kind !== "payment_proof");
      return { ...prev, [req.id]: [row as Attachment, ...others] };
    });
    toast.success(existing.length > 0 ? "Comprobante reemplazado" : "Comprobante de pago subido");
  } catch (e: any) {
    console.error(e);
    toast.error(e?.message || "No se pudo subir el comprobante");
  } finally {
    setUploadingPaymentId(null);
  }
};




  const handleDownloadAttachment = async (att: Attachment) => {
    const { data, error } = await supabase.storage
      .from("project-attachments")
      .createSignedUrl(att.file_path, 300);
    if (error || !data) {
      toast.error("No se pudo generar el enlace");
      return;
    }
    window.open(data.signedUrl, "_blank");
  };

  const handleDeleteAttachment = async (att: Attachment) => {
    if (!confirm(`¿Eliminar "${att.file_name}"?`)) return;
    const { error: stErr } = await supabase.storage
      .from("project-attachments")
      .remove([att.file_path]);
    if (stErr) {
      toast.error("No se pudo eliminar el archivo");
      return;
    }
    const { error: dbErr } = await (supabase as any)
      .from("project_attachments")
      .delete()
      .eq("id", att.id);
    if (dbErr) {
      toast.error("Archivo eliminado, pero falló borrar el registro");
      return;
    }
    setAttachments((prev) => ({
      ...prev,
      [att.project_request_id]: (prev[att.project_request_id] || []).filter((a) => a.id !== att.id),
    }));
    toast.success("Adjunto eliminado");
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 py-[10px]">
      <Seo title="Mis Proyectos | T4" description="Historial de tus proyectos y cotizaciones T4." noindex />
      <section className="relative bg-muted/30 pb-8">
        <NucleotideBackground />
        <div className="container-width px-4 md:px-8 relative z-10">
          <div className="flex items-center gap-3">
            <FolderKanban className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Mis Proyectos</h1>
              <p className="text-muted-foreground">
                {profile?.full_name ? `Hola, ${profile.full_name}. ` : ""}
                Aquí encontrarás el historial de tus solicitudes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-width px-4 md:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Aún no tienes proyectos</h2>
            <p className="text-muted-foreground mb-6">
              Explora el catálogo y comienza a armar tu primer proyecto.
            </p>
            <Link to="/productos">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Explorar productos
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl">
            {requests.map((req) => {
              const status = STATUS_LABELS[req.status] || { label: req.status, variant: "outline" as const };
              const productsArr = Array.isArray(req.products) ? req.products : [];
              const created = new Date(req.created_at).toLocaleDateString("es-MX", {
                year: "numeric", month: "long", day: "numeric",
              });
             const projAtts = attachments[req.id] || [];
             console.log(`🔍 Proyecto ${req.id} - Attachments:`, projAtts);
             const excelAtts = projAtts.filter((a) => a.kind === "user_excel");
             const paymentAtts = projAtts.filter((a) => a.kind === "payment_proof");
             const quoteAtts = projAtts.filter((a) => a.kind === "admin_quote");
             console.log(`🔍 Proyecto ${req.id} - quoteAtts:`, quoteAtts);
              return (
                <Card key={req.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <CardTitle className="text-base">
                          {req.trigger_product_name || `Proyecto del ${created}`}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          {req.institution} · {req.laboratory} · {created}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={status.variant}>{status.label}</Badge>
                        <Badge variant="outline">{productsArr.length} producto{productsArr.length !== 1 ? "s" : ""}</Badge>
                        {projAtts.length > 0 && (
                          <Badge variant="outline" className="gap-1">
                            <Paperclip className="h-3 w-3" />
                            {projAtts.length}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="detail" className="border-0">
                        <AccordionTrigger className="py-2 text-sm">Ver detalle</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            <ul className="space-y-1 text-sm">
                              {productsArr.map((p: any, i: number) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-muted-foreground">{i + 1}.</span>
                                  <div className="min-w-0">
                                    <p className="font-medium">{p.product_name}</p>
                                    {p.catalog_number && (
                                      <p className="text-xs text-muted-foreground font-mono">
                                        Cat. {p.catalog_number}
                                        {p.category ? ` · ${p.category}` : ""}
                                      </p>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                            {req.notes && (
                              <>
                                <Separator />
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                                    Notas
                                  </p>
                                  <p className="text-sm whitespace-pre-wrap">{req.notes}</p>
                                </div>
                              </>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    {excelAtts.length > 0 && (
                      <div className="mt-3 space-y-1.5 border-t pt-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Excel adjunto
                        </p>
                        {excelAtts.map((a) => (
                          <div key={a.id} className="flex items-center gap-2 text-sm">
                            <FileSpreadsheet className="h-4 w-4 text-emerald-600 shrink-0" />
                            <button
                              onClick={() => handleDownloadAttachment(a)}
                              className="flex-1 truncate text-left hover:underline"
                            >
                              {a.file_name}
                            </button>
                            <span className="text-xs text-muted-foreground">
                              {a.size_bytes ? `${Math.round(a.size_bytes / 1024)} KB` : ""}
                            </span>
                            
                          </div>
                        ))}
                      </div>
                    )}

                    


                    {req.status !== 'pending' && req.status !== 'nuevo' && (
  <div className="mt-3 space-y-1.5 border-t pt-3">
    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
      Cotización y documentos del equipo T4
    </p>
    {quoteAtts.length === 0 ? (
      <p className="text-xs text-muted-foreground italic">
        Aún no se ha subido la cotización. Te avisaremos cuando esté lista.
      </p>
    ) : (
      quoteAtts.map((a) => (
        <div key={a.id} className="flex items-center gap-2 text-sm">
          <FileText className="h-4 w-4 text-primary shrink-0" />
          <button
            onClick={() => handleDownloadAttachment(a)}
            className="flex-1 truncate text-left hover:underline"
          >
            {a.file_name}
          </button>
          <span className="text-xs text-muted-foreground">
            {a.size_bytes ? `${Math.round(a.size_bytes / 1024)} KB` : ""}
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={() => handleDownloadAttachment(a)}
            title="Descargar"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))
    )}
  </div>
)}

{paymentAtts.length > 0 && (
  <div className="mt-3 space-y-1.5 border-t pt-3">
    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
      Comprobante de pago
    </p>
    {paymentAtts.map((a) => (
      <div key={a.id} className="flex items-center gap-2 text-sm">
        <FileText className="h-4 w-4 text-blue-600 shrink-0" />
        <button
          onClick={() => handleDownloadAttachment(a)}
          className="flex-1 truncate text-left hover:underline"
        >
          {a.file_name}
        </button>
        <span className="text-xs text-muted-foreground">
          {a.size_bytes ? `${Math.round(a.size_bytes / 1024)} KB` : ""}
        </span>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={() => handleDeleteAttachment(a)}
          title="Eliminar"
        >
          <Trash2 className="h-3.5 w-3.5 text-destructive" />
        </Button>
      </div>
    ))}
  </div>
)}

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(req)}
                        disabled={downloading === req.id}
                      >
                        {downloading === req.id ? (
                          <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generando…</>
                        ) : (
                          <><Download className="h-4 w-4 mr-2" />Ver solicitud activa</>
                        )}
                      </Button>

                      <input
                        ref={(el) => (fileInputs.current[req.id] = el)}
                        type="file"
                        accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleUpload(req, f);
                          e.target.value = "";
                        }}
                      />
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => fileInputs.current[req.id]?.click()}
                        disabled={uploadingId === req.id}
                      >
                        {uploadingId === req.id ? (
                          <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Subiendo…</>
                        ) : (
                          <><Paperclip className="h-4 w-4 mr-2" />Actualizar Solicitud de Síntesis</>
                        )}
                      </Button>

                      <input
  ref={(el) => (paymentFileInputs.current[req.id] = el)}
  type="file"
  accept=".pdf,.png,.jpg,.jpeg,.gif,application/pdf,image/*"
  className="hidden"
  onChange={(e) => {
    const f = e.target.files?.[0];
    if (f) handleUploadPaymentProof(req, f);
    e.target.value = "";
  }}
/>
<Button
  size="sm"
  variant="outline"
  onClick={() => paymentFileInputs.current[req.id]?.click()}
  disabled={uploadingPaymentId === req.id}
>
  {uploadingPaymentId === req.id ? (
    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Subiendo…</>
  ) : (
    <><Upload className="h-4 w-4 mr-2" />Subir comprobante de pago</>
  )}
</Button>



                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
