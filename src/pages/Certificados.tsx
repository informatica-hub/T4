import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Download,
  Loader2,
  FileCheck,
  Award,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import heroImage from "@/assets/lab-certificates-hero.jpg";
import isoLogo from "@/assets/iso-9001.png";
import { Seo } from "@/components/seo/Seo";

export default function Certificados() {
  const [searchId, setSearchId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const trimmed = searchId.trim();
    if (!trimmed) {
      toast.error("Introduce un ID de certificado");
      return;
    }

    setLoading(true);
    try {
      const { data: rows, error } = await (supabase as any).rpc(
        "get_certificate_by_id",
        { _cert_id: trimmed }
      );

      if (error) throw error;

      const data = Array.isArray(rows) ? rows[0] : rows;

      if (!data) {
        toast.error("No se encontró un certificado con ese ID");
        return;
      }

      if (!data.file_path) {
        toast.info("El certificado aún no tiene archivo disponible");
        return;
      }

      // Download file from storage
      const { data: fileData, error: fileError } = await supabase.storage
        .from("certificates")
        .download(data.file_path);

      if (fileError) throw fileError;

      // Mark as downloaded
      await supabase.rpc("mark_certificate_downloaded", { _cert_id: data.id });

      // Trigger browser download
      const url = URL.createObjectURL(fileData);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificado-${data.lot_number || data.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Certificado descargado exitosamente");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al buscar el certificado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Certificados de análisis | T4 México" description="Descarga el certificado de análisis (CoA) de tus oligonucleótidos y sondas T4." />
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[480px] overflow-hidden -mt-16 md:-mt-20">
        <img
          src={heroImage}
          alt="Documentación de laboratorio"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220,60%,25%,0.75)] to-[hsl(175,50%,35%,0.70)] backdrop-blur-sm" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <FileCheck className="h-14 w-14 text-white/90 mb-4" />
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
            Certificados de Análisis
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-2xl">
            Consulta y descarga los certificados técnicos de calidad, análisis y síntesis de tus productos T4.
          </p>
        </div>
      </section>

      {/* ISO Quality Section */}
      <section className="container-width px-4 md:px-8 py-12">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-8 flex flex-col md:flex-row items-center gap-8">
            <img
              src={isoLogo}
              alt="ISO 9001:2015"
              className="h-28 w-auto flex-shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <h2 className="text-xl md:text-2xl font-bold">Calidad Certificada ISO 9001:2015</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Todos nuestros productos y servicios están respaldados por un sistema de gestión de calidad
                certificado bajo la norma ISO 9001:2015. Cada certificado de análisis incluye especificaciones
                completas, análisis de pureza y trazabilidad de lote para garantizar la excelencia en tu investigación.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Certificate Search Section */}

      <section className="w-full px-0 pb-16">



      {/*
        <div className="max-w-2xl mx-auto text-center">


        
          <Award className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Busca tu Certificado</h2>
          <p className="text-muted-foreground mb-8">
            Introduce el ID de tu certificado para descargarlo directamente.
          </p>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Introduce el ID del certificado..."
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-11 h-12 text-base"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="h-12 px-6 bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Descargar
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            El ID del certificado se encuentra en la documentación entregada con tu pedido.
          </p>
        </div>
    
    */}



  {/* Iframe */}
<div className="w-full h-[60vh] rounded-lg overflow-hidden">
  <iframe
    src="https://certificadost4.t4oligo.com/frontend/plantilla_x.html"
    allowFullScreen
    sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-downloads"  // ← AGREGAR ESTO
    className="w-full h-full border-0 rounded-lg"
  />
</div>

      </section>
    </div>
  );
}
