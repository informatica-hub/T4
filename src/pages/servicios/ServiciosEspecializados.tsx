import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Microscope, Target, Shield, Bug, Leaf, TestTubes } from "lucide-react";
import heroImg from "@/assets/hero-servicios-especializados.jpg";
import { Seo } from "@/components/seo/Seo";

const servicios = [
  {
    icon: Target,
    title: "Marcadores qPCR",
    description:
      "Desarrollo y validación de marcadores moleculares por qPCR para detección específica y cuantificación de objetivos biológicos con alta sensibilidad.",
  },
  {
    icon: Bug,
    title: "Detección de Patógenos",
    description:
      "Identificación molecular de agentes patógenos en muestras clínicas, ambientales y alimentarias mediante técnicas de PCR y secuenciación.",
  },
  {
    icon: Leaf,
    title: "Análisis de OGM",
    description:
      "Detección y cuantificación de organismos genéticamente modificados en materias primas y productos terminados, cumpliendo con normativas nacionales e internacionales.",
  },
  {
    icon: Microscope,
    title: "Metagenómica",
    description:
      "Análisis de comunidades microbianas complejas mediante secuenciación masiva para caracterizar la diversidad y funcionalidad de ecosistemas biológicos.",
  },
  {
    icon: TestTubes,
    title: "Preparación de Muestras",
    description:
      "Servicio integral de recepción, procesamiento y preparación de muestras biológicas para asegurar la calidad y trazabilidad de los análisis moleculares.",
  },
];

export default function ServiciosEspecializados() {
  return (
    <div className="min-h-screen bg-background">
      <Seo title="Servicios especializados de biología molecular | T4 México" description="Servicios a medida en biología molecular: diseño, síntesis, validación y soporte científico para tu proyecto en México." />
      {/* Hero */}
      <section className="relative h-[400px] md:h-[480px] overflow-hidden -mt-16 md:-mt-20">
        <img src={heroImg} alt="Laboratorio de servicios especializados" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220,60%,25%,0.78)] to-[hsl(175,50%,35%,0.72)] backdrop-blur-sm" />
        <div className="relative z-10 h-full flex items-center justify-center pt-16 md:pt-20">
          <div className="container-width px-4 md:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 text-white text-sm font-medium mb-6">
                Servicios
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
                Servicios Especializados
              </h1>
              <p className="text-xl text-white/90 font-semibold mb-4">
                Resultados con validez científica y rigor analítico
              </p>
              <p className="text-lg text-white/80 leading-relaxed mb-8">
                Ofrecemos servicios de análisis molecular diseñados para investigación, producción y control
                de calidad. Nuestro equipo científico trabaja con metodologías validadas y estándares
                internacionales para entregar resultados confiables.
              </p>
              <Link to="/contacto">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  Contactar a un Colega Científico
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Grid */}
      <section className="relative py-16 bg-muted/30">
        <div className="container-width px-4 md:px-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-10">
            Nuestros Servicios
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicios.map((s) => (
              <Card key={s.title} className="border-border/50">
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <s.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
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
            ¿Necesita implementar un análisis específico o validar un protocolo?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Hable con su Colega Científico T4 y encuentre la solución adecuada para su laboratorio.
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
