import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { NucleotideBackground } from "@/components/ui/NucleotideBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown, ChevronUp, Download, FileSpreadsheet, FileText,
  FolderKanban, Loader2, Upload, Trash2, Check
} from "lucide-react";
import { toast } from "sonner";
import { downloadCombinedPedidoPdf } from "@/lib/pedidoPdf";
import { Seo } from "@/components/seo/Seo";

interface Attachment {
  id: string;
  project_request_id: string;
  user_id: string;
  file_path: string;
  file_name: string;
  size_bytes: number | null;
  mime_type: string | null;
  kind: "user_excel" | "payment_proof"| "admin_quote";
  created_at: string;
}

interface ProjectRow {
  id: string;
  user_id: string | null;
  institution: string;
  laboratory: string;
  email: string;
  notes: string | null;
  products: any;
  trigger_product_name: string | null;
  status: string;
  created_at: string;
  has_update: boolean | null;
  attachments: Attachment[];
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pendiente" },
  { value: "en_proceso", label: "En proceso" },
  { value: "cotizado", label: "Cotizado" },
  { value: "cerrado", label: "Cerrado" },
];

const statusColor: Record<string, string> = {
  pending: "bg-blue-100 text-blue-800 border-blue-200",
  en_proceso: "bg-amber-100 text-amber-800 border-amber-200",
  cotizado: "bg-violet-100 text-violet-800 border-violet-200",
  cerrado: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const MAX_QUOTE_SIZE = 20 * 1024 * 1024; // 20 MB

export default function AdminProyectos() {
  const { user } = useAuth();
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const load = async () => {
    setLoading(true);
    const [reqRes, attRes] = await Promise.all([
      supabase.from("project_requests").select("*").order("created_at", { ascending: false }),
      (supabase as any).from("project_attachments").select("*").order("created_at", { ascending: false }),
    ]);
    if (reqRes.error) {
      toast.error("No se pudieron cargar los proyectos");
      setLoading(false);
      return;
    }
    const atts = (attRes.data as Attachment[]) || [];
    const merged: ProjectRow[] = ((reqRes.data as any[]) || []).map((r) => ({
      ...r,
      attachments: atts.filter((a) => a.project_request_id === r.id),
    }));
    setRows(merged);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !r.institution.toLowerCase().includes(q) &&
          !r.laboratory.toLowerCase().includes(q) &&
          !r.email.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [rows, search, statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("project_requests").update({ status }).eq("id", id);
    if (error) {
      toast.error("No se pudo actualizar el estado");
      return;
    }
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    toast.success("Estado actualizado");
  };

  const markAsReviewed = async (id: string) => {
  const { error } = await supabase
    .from("project_requests")
    .update({ has_update: false } as any)
    .eq("id", id);
  if (error) {
    toast.error("No se pudo marcar como revisado");
    return;
  }
  setRows((prev) =>
    prev.map((r) => (r.id === id ? { ...r, has_update: false } : r))
  );
  toast.success("Marcado como revisado");
};

  const downloadAttachment = async (att: Attachment) => {
    const { data, error } = await supabase.storage
      .from("project-attachments")
      .createSignedUrl(att.file_path, 300);
    if (error || !data) {
      toast.error("No se pudo generar el enlace de descarga");
      return;
    }
    window.open(data.signedUrl, "_blank");
  };

  const deleteAttachment = async (att: Attachment) => {
    if (!confirm(`¿Eliminar "${att.file_name}"?`)) return;
    const { error: stErr } = await supabase.storage
      .from("project-attachments")
      .remove([att.file_path]);
    if (stErr) {
      toast.error("No se pudo eliminar el archivo del almacenamiento");
      return;
    }
    const { error: dbErr } = await (supabase as any)
      .from("project_attachments")
      .delete()
      .eq("id", att.id);
    if (dbErr) {
      toast.error("Archivo eliminado pero falló borrar el registro");
      return;
    }
    setRows((prev) =>
      prev.map((r) =>
        r.id === att.project_request_id
          ? { ...r, attachments: r.attachments.filter((a) => a.id !== att.id) }
          : r,
      ),
    );
    toast.success("Documento eliminado");
  };

  const uploadQuotes = async (row: ProjectRow, files: FileList) => {
    if (!user || files.length === 0) return;
    setUploadingId(row.id);
    try {
      const inserted: Attachment[] = [];
      for (const file of Array.from(files)) {
        if (file.size > MAX_QUOTE_SIZE) {
          toast.error(`"${file.name}" excede 20 MB`);
          continue;
        }
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
        const path = `quotes/${row.id}/${Date.now()}_${safeName}`;
        const { error: upErr } = await supabase.storage
          .from("project-attachments")
          .upload(path, file, { contentType: file.type, upsert: false });
        if (upErr) {
          toast.error(`No se pudo subir "${file.name}": ${upErr.message}`);
          continue;
        }
        const { data: rowIns, error: insErr } = await (supabase as any)
          .from("project_attachments")
          .insert({
            project_request_id: row.id,
            user_id: user.id,
            file_path: path,
            file_name: file.name,
            mime_type: file.type || null,
            size_bytes: file.size,
            kind: "admin_quote",
          })
          .select()
          .single();
        if (insErr) {
          toast.error(`No se registró "${file.name}": ${insErr.message}`);
          await supabase.storage.from("project-attachments").remove([path]);
          continue;
        }
        inserted.push(rowIns as Attachment);
      }
      if (inserted.length > 0) {
        setRows((prev) =>
          prev.map((r) =>
            r.id === row.id ? { ...r, attachments: [...r.attachments, ...inserted] } : r,
          ),
        );
        toast.success(`${inserted.length} documento(s) subido(s)`);
      }
    } finally {
      setUploadingId(null);
    }
  };

  const downloadPdf = async (r: ProjectRow) => {
    try {
      const safe = r.institution.replace(/[^a-z0-9]+/gi, "_").slice(0, 40);
      await downloadCombinedPedidoPdf(
        {
          institution: r.institution,
          laboratory: r.laboratory,
          email: r.email,
          notes: r.notes,
          trigger_product_name: r.trigger_product_name,
          products: Array.isArray(r.products) ? r.products : [],
          created_at: r.created_at,
        },
        `Proyecto_T4_${safe || r.id.slice(0, 8)}.pdf`,
      );
    } catch {
      toast.error("No se pudo generar el PDF");
    }
  };

  return (
    <div className="min-h-screen relative py-24 px-4">
      <Seo title="Admin · Proyectos | T4" description="Vista unificada de proyectos." noindex />
      <NucleotideBackground />
      <div className="relative z-10 max-w-[1600px] mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Proyectos de clientes</h1>
          <p className="text-muted-foreground mt-1">
            Vista unificada de todas las solicitudes con adjuntos Excel y cotizaciones.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-primary" />
              {filtered.length} proyecto{filtered.length === 1 ? "" : "s"}
            </CardTitle>
            <div className="flex flex-col md:flex-row gap-3 pt-3">
              <Input
                placeholder="Buscar por institución, laboratorio o correo…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="md:max-w-md"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="md:w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                No hay proyectos que coincidan con los filtros.
              </p>
            ) : (
              <Table className="min-w-[1280px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Institución</TableHead>
                    <TableHead>Laboratorio</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead className="text-center">Prod.</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Excel</TableHead>
                    <TableHead>Cotización</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                    <TableHead>Comprobante</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => {
                    const productsArr = Array.isArray(r.products) ? r.products : [];
                    const quoteAtts = r.attachments.filter((a) => a.kind === "admin_quote");
                    const userExcelAtts = r.attachments.filter((a) => a.kind === "user_excel");
                    const paymentAtts = r.attachments.filter((a) => a.kind === "payment_proof");

                    const isOpen = openId === r.id;
                    return (
                      <>
                        <TableRow key={r.id}>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => setOpenId(isOpen ? null : r.id)}
                            >
                              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          </TableCell>
                          <TableCell className="text-sm whitespace-nowrap">
                            <div>{new Date(r.created_at).toLocaleDateString("es-MX")}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(r.created_at).toLocaleTimeString("es-MX", {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">  <div className="flex items-center gap-2">
                                <span>{r.institution}</span>
                                {r.has_update && (
                                  <span
                                    title="El cliente actualizó su solicitud"
                                    className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold shadow-md animate-pulse shrink-0"> 1 
                                  </span>
                                  
                                )}
                              </div>
                          </TableCell>
                          <TableCell className="text-sm">{r.laboratory}</TableCell>
                          <TableCell className="text-sm">{r.email}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary">{productsArr.length}</Badge>
                          </TableCell>
                          <TableCell>
                            <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v)}>
                              <SelectTrigger className={`h-8 w-[140px] border ${statusColor[r.status] || ""}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {STATUS_OPTIONS.map((s) => (
                                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                         <TableCell>
  {userExcelAtts.length === 0 ? (
    <span className="text-xs text-muted-foreground">—</span>
  ) : (
    <div className="flex flex-col gap-1">
      {userExcelAtts.map((a) => (
        <Button
          key={a.id}
          variant="ghost"
          size="sm"
          className="h-7 justify-start px-2 text-xs"
          onClick={() => downloadAttachment(a)}
          title={a.file_name}
        >
          <FileSpreadsheet className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
          <span className="truncate max-w-[140px]">{a.file_name}</span>
        </Button>
      ))}
    </div>
  )}
</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1 min-w-[160px]">
                              {quoteAtts.map((a) => (
                                <div key={a.id} className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 justify-start px-2 text-xs flex-1"
                                    onClick={() => downloadAttachment(a)}
                                    title={a.file_name}
                                  >
                                    <FileText className="h-3.5 w-3.5 mr-1.5 text-primary" />
                                    <span className="truncate max-w-[120px]">{a.file_name}</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => deleteAttachment(a)}
                                    title="Eliminar"
                                  >
                                    <Trash2 className="h-3 w-3 text-destructive" />
                                  </Button>
                                </div>
                              ))}
                              <input
                                ref={(el) => (fileInputs.current[r.id] = el)}
                                type="file"
                                multiple
                                accept=".pdf,.xlsx,.xls,.docx,.doc,.png,.jpg,.jpeg"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    uploadQuotes(r, e.target.files);
                                  }
                                  e.target.value = "";
                                }}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                                disabled={uploadingId === r.id}
                                onClick={() => fileInputs.current[r.id]?.click()}
                              >
                                {uploadingId === r.id ? (
                                  <><Loader2 className="h-3 w-3 mr-1 animate-spin" />Subiendo…</>
                                ) : (
                                  <><Upload className="h-3 w-3 mr-1" />Subir archivos</>
                                )}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
  <div className="flex items-center justify-end gap-2">
    <Button variant="outline" size="sm" onClick={() => downloadPdf(r)}>
      <Download className="h-4 w-4 mr-1" />
      PDF
    </Button>
    {r.has_update && (
      <Button
        variant="default"
        size="sm"
        onClick={() => markAsReviewed(r.id)}
        title="Marcar la actualización como revisada"
        className="bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        Revisado
      </Button>
    )}
  </div>
</TableCell>
                          <TableCell>
  {paymentAtts.length === 0 ? (
    <span className="text-xs text-muted-foreground">—</span>
  ) : (
    <div className="flex flex-col gap-1">
      {paymentAtts.map((a) => (
        <div key={a.id} className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 justify-start px-2 text-xs flex-1"
            onClick={() => downloadAttachment(a)}
            title={a.file_name}
          >
            <FileText className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
            <span className="truncate max-w-[140px]">{a.file_name}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => deleteAttachment(a)}
            title="Eliminar"
          >
            <Trash2 className="h-3 w-3 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  )}
</TableCell>
                        </TableRow>
                        {isOpen && (
                          <TableRow key={`${r.id}-detail`} className="bg-muted/30">
                            <TableCell colSpan={10}>
                              <div className="p-4 space-y-4">
                                {r.trigger_product_name && (
                                  <div>
                                    <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground">
                                      Producto principal
                                    </p>
                                    <p className="text-sm">{r.trigger_product_name}</p>
                                  </div>
                                )}
                                {r.notes && (
                                  <div>
                                    <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground">
                                      Notas
                                    </p>
                                    <p className="text-sm whitespace-pre-wrap">{r.notes}</p>
                                  </div>
                                )}
                                <div>
                                  <p className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-2">
                                    Productos elegidos ({productsArr.length})
                                  </p>
                                  <ul className="space-y-1">
                                    {productsArr.map((prod: any, i: number) => (
                                      <li key={i} className="text-sm flex items-center gap-2">
                                        <span className="text-muted-foreground">{i + 1}.</span>
                                        <span className="font-medium">{prod.product_name}</span>
                                        {prod.catalog_number && (
                                          <span className="text-xs text-muted-foreground font-mono">
                                            ({prod.catalog_number})
                                          </span>
                                        )}
                                        {prod.category && (
                                          <Badge variant="outline" className="text-[10px]">
                                            {prod.category}
                                          </Badge>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
