import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Campaign } from "@/types/campaign";
import { getCampaigns, createCampaign, deleteCampaign } from "@/pages/servicios/campaigns";
import { CtaLinkBuilder } from "@/components/admin/CtaLinkBuilder";

export default function AdminCampaignsImages() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    cta_text: "",
    cta_link: "",
    sort_order: 0,
  });

  const load = () => getCampaigns().then(setCampaigns).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Selecciona una imagen");
      return;
    }
    setUploading(true);
    try {
      await createCampaign(
        {
          title: form.title,
          description: form.description || undefined,
          cta_text: form.cta_text || undefined,
          cta_link: form.cta_link || undefined,
          sort_order: form.sort_order,
        },
        file
      );
      toast.success("Campaña creada");
      setForm({ title: "", description: "", cta_text: "", cta_link: "", sort_order: 0 });
      setFile(null);
      load();
    } catch (err) {
      console.error(err);
      toast.error("Error al crear la campaña");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (c: Campaign) => {
    if (!confirm(`¿Eliminar "${c.title}"?`)) return;
    try {
      await deleteCampaign(c.id, c.image_url);
      toast.success("Campaña eliminada");
      load();
    } catch {
      toast.error("Error al eliminar");
    }
  };

  return (
    <div className="space-y-6 mt-4">
      <Card>
        <CardHeader><CardTitle>Nueva campaña</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input required value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea rows={3} value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <CtaLinkBuilder
  value={form.cta_link}
  onChange={(url) => setForm((f) => ({ ...f, cta_link: url }))}
  ctaText={form.cta_text}
  onCtaTextChange={(text) => setForm((f) => ({ ...f, cta_text: text }))}
/>
            <div className="space-y-2">
              <Label>Orden</Label>
              <Input type="number" value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) }))} />
            </div>
            <div className="space-y-2">
              <Label>Imagen *</Label>
              <Input type="file" accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>
            <Button type="submit" disabled={uploading}>
              {uploading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Subiendo...</>
              ) : (
                <><Upload className="h-4 w-4 mr-2" />Crear campaña</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {campaigns.map((c) => (
          <Card key={c.id}>
            <img src={c.image_url} alt={c.title}
              className="w-full h-40 object-cover rounded-t-lg" />
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold">{c.title}</h3>
              <p className="text-sm text-muted-foreground">{c.description}</p>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(c)}>
                <Trash2 className="h-4 w-4 mr-1" /> Eliminar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}