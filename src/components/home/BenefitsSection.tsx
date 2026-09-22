import { Clock, HeartHandshake, ShieldCheck } from "lucide-react";
import hechoEnMexico from "@/assets/hecho-en-mexico.png";

export function BenefitsSection() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-width">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nuestro Compromiso en <span className="text-primary">T4</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Desde hace 15 años, establecimos 3 pilares fundamentales como soporte a nuestro compromiso
          </p>
        </div>

        {/* Pilares */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card rounded-xl p-8 shadow-lg border border-border/50 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Clock className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Tiempos de Entrega Rápidos</h3>
            <p className="text-muted-foreground">Síntesis de oligos con entrega desde 24 horas, sin comprometer calidad ni su presupuesto.</p>
          </div>

          <div className="bg-card rounded-xl p-8 shadow-lg border border-border/50 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
              <HeartHandshake className="h-7 w-7 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Soporte Científico</h3>
            <p className="text-muted-foreground">Asesoría personalizada con expertos en biología molecular.</p>
          </div>

          <div className="bg-card rounded-xl p-8 shadow-lg border border-border/50 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mb-4">
              <ShieldCheck className="h-7 w-7 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Productos Certificados</h3>
            <p className="text-muted-foreground">El equipo científico de T4 desarrolla y manufactura en México con certificación ISO 9001:2015 en síntesis de ácidos nucleicos y kits de diagnóstico molecular. Estándares internacionales de exportación al servicio de cualquier reto en Biología Molecular.</p>
          </div>
        </div>

        {/* Descripción */}
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-muted-foreground text-lg leading-relaxed text-justify">
            Desarrollamos productos de alta calidad, fabricados en México, con estándares de validación internacionales  y a precios que se adaptan a la realidad de la investigación nacional.
          </p>
        </div>
      </div>
    </section>
  );
}
