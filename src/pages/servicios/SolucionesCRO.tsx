import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Crosshair, PenTool, Timer, CheckCircle } from "lucide-react";
import heroImg from "@/assets/hero-soluciones-cro.jpg";
import { Seo } from "@/components/seo/Seo";

const etapas = [
  {
    icon: Crosshair,
    step: "01",
    title: "Selección de Objetivos",
    description:
      "Identificamos los blancos moleculares relevantes para su proyecto. Analizamos la bibliografía, bases de datos genómicas y requerimientos regulatorios para definir los objetivos de detección.",
  },
  {
    icon: PenTool,
    step: "02",
    title: "Diseño de Primers y Sondas",
    description:
      "Diseñamos oligonucleótidos optimizados con herramientas bioinformáticas avanzadas, evaluando especificidad, sensibilidad y compatibilidad con plataformas de detección.",
  },
  {
    icon: Timer,
    step: "03",
    title: "Estudios de Estabilidad",
    description:
      "Evaluamos la robustez y estabilidad de los ensayos bajo diferentes condiciones experimentales para garantizar reproducibilidad y desempeño consistente.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Verificación del Ensayo",
    description:
      "Validamos el ensayo completo con muestras reales y controles, generando la documentación técnica necesaria para su implementación o registro regulatorio.",
  },
];

export default function SolucionesCRO() {
  return (
    <div className="min-h-screen bg-background">
      <Seo title="Soluciones CRO en biología molecular | T4 México" description="T4 como CRO mexicano: desarrollo, validación y producción de oligos, sondas y ensayos para industria y academia." />
      {/* Hero */}
      <section className="relative h-[400px] md:h-[480px] overflow-hidden -mt-16 md:-mt-20">
        <img src={heroImg} alt="Laboratorio CRO de investigación" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220,60%,25%,0.78)] to-[hsl(175,50%,35%,0.72)] backdrop-blur-sm" />
        <div className="relative z-10 h-full flex items-center justify-center pt-16 md:pt-20">
          <div className="container-width px-4 md:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 text-white text-sm font-medium mb-6">
                Servicios
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
                Soluciones CRO
              </h1>
              <p className="text-xl text-white/90 font-semibold mb-4">
                Diseño y Validación de Ensayos a Medida
              </p>
              <p className="text-lg text-white/80 leading-relaxed mb-8">
                Como Organización de Investigación por Contrato (CRO), T4 ofrece soluciones de laboratorio
                de extremo a extremo. Desde la selección de blancos moleculares hasta la verificación final
                del ensayo, lo acompañamos en cada etapa del desarrollo.
              </p>
              <Link to="/contacto">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  Solicitar propuesta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Concepto a Validación */}
      <section className="relative py-16 bg-muted/30">
        <div className="container-width px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Desde el concepto genético hasta la validación final
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Transformamos necesidades biológicas en herramientas de diagnóstico molecular funcionales.
              Nuestro enfoque integra diseño bioinformático, síntesis de oligonucleótidos,
              optimización experimental y validación analítica en un flujo de trabajo continuo y trazable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {etapas.map((e) => (
              <Card key={e.step} className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <e.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-primary/60 uppercase tracking-wider">
                        Etapa {e.step}
                      </span>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{e.title}</h3>
                      <p className="text-sm text-muted-foreground">{e.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 bg-primary/5">
        <div className="container-width px-4 md:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            ¿Tiene una idea que necesita validación científica?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Hable con su Colega Científico T4 y llevemos su proyecto del concepto a la realidad.
          </p>
          <Link to="/contacto">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Contactar a un Colega Científico
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
