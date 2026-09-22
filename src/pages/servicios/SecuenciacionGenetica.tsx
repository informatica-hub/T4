import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Dna, FlaskConical, BarChart3, ShieldCheck, Users, FileSearch } from "lucide-react";
import heroImg from "@/assets/hero-secuenciacion.jpg";
import { Seo } from "@/components/seo/Seo";

export default function SecuenciacionGenetica() {
  return (
    <div className="min-h-screen bg-background">
      <Seo title="Secuenciación Sanger en México | T4" description="Servicio de secuenciación Sanger y análisis genético en México con asesoría científica y resultados rápidos." keywords="secuenciación Sanger México, secuenciación genética México" />
      {/* Hero */}
      <section className="relative h-[400px] md:h-[480px] overflow-hidden -mt-16 md:-mt-20">
        <img src={heroImg} alt="Laboratorio de secuenciación genética" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220,60%,25%,0.78)] to-[hsl(175,50%,35%,0.72)] backdrop-blur-sm" />
        <div className="relative z-10 h-full flex items-center justify-center pt-16 md:pt-20">
          <div className="container-width px-4 md:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 text-white text-sm font-medium mb-6">
                Servicios
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
                Secuenciación Genética
              </h1>
              <p className="text-xl text-white/90 font-semibold mb-4">
                Lectura precisa del código biológico
              </p>
              <p className="text-lg text-white/80 leading-relaxed mb-8">
                En T4 ofrecemos servicios de secuenciación adaptados a diferentes necesidades experimentales.
                Ya sea que necesite confirmar una mutación puntual o analizar un transcriptoma completo,
                contamos con la infraestructura y el equipo científico para acompañarlo en cada paso.
              </p>
              <Link to="/contacto">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  Solicitar información
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sanger & NGS */}
      <section className="relative py-16 bg-muted/30">
        <div className="container-width px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Dna className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Secuenciación Sanger</h3>
                <p className="text-muted-foreground mb-4">
                  Método de referencia para la confirmación de secuencias con alta precisión y confiabilidad.
                  Ideal para validaciones puntuales y control de calidad.
                </p>
                <h4 className="font-medium text-foreground mb-2">Aplicaciones:</h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Confirmación de mutaciones puntuales
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Verificación de plásmidos y constructos
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Control de calidad en constructos génicos
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <FlaskConical className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Secuenciación NGS</h3>
                <p className="text-muted-foreground mb-4">
                  Análisis masivo de secuencias para proyectos que requieren alto rendimiento y cobertura genómica completa.
                </p>
                <h4 className="font-medium text-foreground mb-2">Aplicaciones:</h4>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Genómica y secuenciación de genomas completos
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    RNA-seq y análisis de expresión génica
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Vigilancia genómica y epidemiología molecular
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    Estudios de diversidad genética
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ¿Por qué secuenciar con T4? */}
      <section className="relative py-16">
        <div className="container-width px-4 md:px-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-10">
            ¿Por qué secuenciar con T4?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border/50">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Asesoría Científica</h3>
                <p className="text-sm text-muted-foreground">
                  Nuestros colegas científicos lo acompañan desde el diseño experimental hasta la interpretación de resultados.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Control de Calidad Riguroso</h3>
                <p className="text-sm text-muted-foreground">
                  Cada corrida de secuenciación pasa por controles internos que garantizan la confiabilidad de los datos generados.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="pt-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <FileSearch className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Interpretación de Datos</h3>
                <p className="text-sm text-muted-foreground">
                  Entregamos resultados con análisis bioinformático y reportes claros para facilitar la toma de decisiones.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 bg-primary/5">
        <div className="container-width px-4 md:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            ¿Tiene un proyecto de secuenciación en puerta?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Hable con su Colega Científico T4 y diseñemos juntos la mejor estrategia.
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
