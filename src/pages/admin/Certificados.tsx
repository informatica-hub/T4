import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { Plus, Upload, Trash2, FileText, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Seo } from "@/components/seo/Seo";

export default function AdminCertificados() {
  const queryClient = useQueryClient();
  const [orderNumber, setOrderNumber] = useState("");
  const [productName, setProductName] = useState("");
  const [productId, setProductId] = useState("");
  const [certificateType, setCertificateType] = useState("quality");
  const [lotNumber, setLotNumber] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: certificates = [], isLoading } = useQuery({
    queryKey: ["admin-certificates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!orderNumber || !productName || !productId) {
        throw new Error("Completa los campos obligatorios");
      }

      setUploading(true);
      let filePath: string | null = null;

      // Upload file if provided
      if (file) {
        const ext = file.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("certificates")
          .upload(fileName, file);
        if (uploadError) throw uploadError;
        filePath = fileName;
      }

      // We need to get the current user for user_id and find/create an order
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");

      // Find existing order or use a placeholder order_id
      const { data: order } = await supabase
        .from("orders")
        .select("id")
        .eq("order_number", orderNumber)
        .maybeSingle();

      const orderId = order?.id || crypto.randomUUID();

      // If no order exists, we create a minimal one
      if (!order) {
        const { error: orderError } = await supabase.from("orders").insert({
          id: orderId,
          order_number: orderNumber,
          user_id: user.id,
          total_amount: 0,
          items: [],
          status: "completed",
        });
        if (orderError) throw orderError;
      }

      const { error } = await supabase.from("certificates").insert({
        order_id: orderId,
        user_id: user.id,
        product_id: productId,
        product_name: productName,
        certificate_type: certificateType,
        lot_number: lotNumber || null,
        file_path: filePath,
        status: "no_descargado",
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Certificado registrado correctamente");
      queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
      setOrderNumber("");
      setProductName("");
      setProductId("");
      setCertificateType("quality");
      setLotNumber("");
      setFile(null);
      setUploading(false);
    },
    onError: (err: any) => {
      toast.error(err.message || "Error al registrar certificado");
      setUploading(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Find cert to delete its file too
      const cert = certificates.find((c) => c.id === id);
      if (cert?.file_path) {
        await supabase.storage.from("certificates").remove([cert.file_path]);
      }
      const { error } = await supabase.from("certificates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Certificado eliminado");
      queryClient.invalidateQueries({ queryKey: ["admin-certificates"] });
    },
    onError: () => toast.error("Error al eliminar"),
  });

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 py-[10px]">
      <Seo title="Admin · Certificados | T4" description="Gestión de certificados." noindex />
      <div className="container-width px-4 md:px-8">
        <h1 className="text-3xl font-bold mb-2">Registro de Certificados</h1>
        <p className="text-muted-foreground mb-8">
          Alta y gestión de certificados de análisis, calidad y síntesis.
        </p>

        {/* Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" /> Nuevo Certificado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orderNumber"># Orden *</Label>
                <Input
                  id="orderNumber"
                  placeholder="ORD-2025-001"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productName">Nombre del Producto *</Label>
                <Input
                  id="productName"
                  placeholder="Oligo 25-mer custom"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productId">ID Producto *</Label>
                <Input
                  id="productId"
                  placeholder="PROD-001"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Certificado</Label>
                <Select value={certificateType} onValueChange={setCertificateType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quality">Calidad</SelectItem>
                    <SelectItem value="analysis">Análisis</SelectItem>
                    <SelectItem value="synthesis">Síntesis</SelectItem>
                    <SelectItem value="lot">Lote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lotNumber"># Lote</Label>
                <Input
                  id="lotNumber"
                  placeholder="LOT-2025-A"
                  value={lotNumber}
                  onChange={(e) => setLotNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="certFile">Archivo (PDF)</Label>
                <Input
                  id="certFile"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
            <Button
              className="mt-6"
              onClick={() => createMutation.mutate()}
              disabled={uploading || createMutation.isPending}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? "Subiendo..." : "Registrar Certificado"}
            </Button>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" /> Certificados Registrados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : certificates.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No hay certificados registrados.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead># Orden</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fecha Alta</TableHead>
                    <TableHead>Fecha Descarga</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Archivo</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificates.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell className="font-mono text-xs max-w-[120px] truncate">
                        {cert.id.slice(0, 8)}…
                      </TableCell>
                      <TableCell>
                        {cert.order_id?.slice(0, 8) ?? "—"}
                      </TableCell>
                      <TableCell>{cert.product_name}</TableCell>
                      <TableCell className="capitalize">{cert.certificate_type}</TableCell>
                      <TableCell>
                        {new Date(cert.created_at).toLocaleDateString("es-MX")}
                      </TableCell>
                      <TableCell>
                        {cert.downloaded_at
                          ? new Date(cert.downloaded_at).toLocaleDateString("es-MX")
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={cert.status === "descargado" ? "default" : "secondary"}
                        >
                          {cert.status === "descargado" ? "Descargado" : "No descargado"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {cert.file_path ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={async () => {
                              const { data } = await supabase.storage
                                .from("certificates")
                                .createSignedUrl(cert.file_path!, 60);
                              if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => deleteMutation.mutate(cert.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
