import { FileCheck, Download, QrCode, HelpCircle, Play } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Seo } from "@/components/seo/Seo";

const Certificado = () => {
  const { toast } = useToast();
  const [cotizacion, setCotizacion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cotizacion.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un número de cotización",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Buscando certificado...",
      description: `Buscando: ${cotizacion}`,
    });

    setIsLoading(false);
    
    // In a real implementation, this would trigger a download
    toast({
      title: "Certificado no encontrado",
      description: "Verifica el número de cotización e intenta de nuevo, o contacta a ventas@t4oligo.com",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen">
      <Seo title="Certificado | T4" description="Descarga de certificado." noindex />
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container-width px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <FileCheck className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Descarga tu Certificado de Análisis
            </h1>
            <p className="text-xl text-muted-foreground">
              Introduce el número de cotización incluido en la etiqueta de tu caja 
              y haz clic en "Descargar" para obtener tu certificado de análisis.
            </p>
          </div>
        </div>
      </section>

      {/* Download Form */}
      <section className="py-16 md:py-24">
        <div className="container-width px-4 md:px-8">
          <div className="max-w-xl mx-auto">
            <Card className="p-8">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-6">
                  <QrCode className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">
                    Buscar Certificado
                  </h2>
                </div>

                <form onSubmit={handleDownload} className="space-y-6">
                  <div>
                    <label 
                      htmlFor="cotizacion" 
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Número de Cotización
                    </label>
                    <Input
                      id="cotizacion"
                      type="text"
                      value={cotizacion}
                      onChange={(e) => setCotizacion(e.target.value)}
                      placeholder="Ej: COT-00000-MLR"
                      className="text-lg h-12"
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      Encuentra el número en la etiqueta de tu caja de oligos
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Buscando..."
                    ) : (
                      <>
                        <Download className="h-5 w-5" />
                        Descargar Certificado
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <HelpCircle className="h-5 w-5" />
                    <span>¿Dudas? Comunícate con nosotros:</span>
                  </div>
                  <a 
                    href="mailto:ventas@t4oligo.com" 
                    className="text-primary hover:underline mt-2 block"
                  >
                    ventas@t4oligo.com
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tutorial Video */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container-width px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              ¿Cómo resuspender tus oligos?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Mira nuestro video tutorial para aprender la forma correcta de 
              resuspender tus oligonucleótidos
            </p>

            <Card className="overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Play className="h-10 w-10 text-primary ml-1" />
                  </div>
                  <p className="text-muted-foreground">Video tutorial</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* QR Info */}
      <section className="py-16 md:py-24">
        <div className="container-width px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Acceso Rápido con Código QR
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Cada caja de productos T4 incluye un código QR que te 
                  permite acceder directamente a tu certificado de análisis.
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    Escanea el código QR con tu celular
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    Accede directamente al certificado
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    Descarga en formato PDF
                  </li>
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-muted rounded-xl flex items-center justify-center">
                  <QrCode className="h-24 w-24 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Certificado;
