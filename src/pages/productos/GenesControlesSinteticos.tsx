import { NucleotideBackground } from "@/components/ui/NucleotideBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Dna, Target, ShieldCheck } from "lucide-react";
import { Seo } from "@/components/seo/Seo";

export default function GenesControlesSinteticos() {
  return (
    <div className="min-h-screen bg-background">
      <Seo title="Genes y controles sintéticos | T4 México" description="Genes sintéticos y controles positivos/negativos a medida para PCR, qPCR y biología molecular en México." type="product" />
      <section className="relative bg-muted/40 pt-20 pb-12 md:pt-24 md:pb-16">
        <NucleotideBackground className="opacity-20" />
        <div className="container-width px-4 md:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Productos
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Genes y Controles Sintéticos
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Genes sintéticos y controles de referencia diseñados y manufacturados en México bajo 
              estándares internacionales. Soluciones confiables para validación de ensayos y desarrollo de proyectos.
            </p>
            <Link to="/contacto">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Solicitar cotización
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative py-16 bg-muted/30">
        <div className="container-width px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border/50">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Dna className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Genes Sintéticos</h3>
                <p className="text-sm text-muted-foreground">
                  Síntesis de genes completos con optimización de codones y verificación por secuenciación.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Controles Positivos</h3>
                <p className="text-sm text-muted-foreground">
                  Controles de referencia certificados para validar la sensibilidad y especificidad de sus ensayos.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Línea Sentinel™</h3>
                <p className="text-sm text-muted-foreground">
                  Controles sintéticos de la línea Sentinel™ para detección de patógenos con trazabilidad completa.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
