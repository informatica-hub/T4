import { Package, Clock, CheckCircle, Truck, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { NucleotideBackground } from "@/components/ui/NucleotideBackground";
import { Seo } from "@/components/seo/Seo";

const ListOligo = () => {
  return (
    <div className="min-h-screen">
      <Seo title="ListOligo: catálogo interactivo de oligos | T4 México" description="Explora ListOligo: catálogo de oligonucleótidos, sondas y modificaciones T4 con filtros por aplicación." />
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-muted/40">
        <NucleotideBackground />
        <div className="container-width px-4 md:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-secondary/20 text-secondary rounded-full text-sm font-medium mb-4">
                Entrega Inmediata
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                ListOligo
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Oligos presintetizados listos para envío inmediato. 
                La forma más rápida de obtener tus oligonucleótidos.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/carrito">
                  <Button size="lg" className="gap-2">
                    Arma tu Proyecto <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/contacto">
                  <Button size="lg" variant="outline">
                    Consultar Disponibilidad
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://t4oligo.com/wp-content/uploads/ListOLigos.png" 
                alt="ListOligo"
                className="max-w-full rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24">
        <div className="container-width px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center border-t-4 border-t-primary">
              <CardContent className="p-0">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Envío Inmediato
                </h3>
                <p className="text-muted-foreground">
                  Oligos ya sintetizados y listos para enviar el mismo día
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center border-t-4 border-t-secondary">
              <CardContent className="p-0">
                <CheckCircle className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Calidad Garantizada
                </h3>
                <p className="text-muted-foreground">
                  Misma calidad que nuestros oligos de síntesis personalizada
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center border-t-4 border-t-primary">
              <CardContent className="p-0">
                <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Distribución Nacional
                </h3>
                <p className="text-muted-foreground">
                  Envíos a todo México con seguimiento incluido
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container-width px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Package className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-6">
              ¿Qué es ListOligo?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              ListOligo es nuestra línea de oligonucleótidos presintetizados que mantenemos 
              en inventario para las secuencias más solicitadas. Esto permite tiempos de 
              entrega significativamente más cortos comparados con la síntesis personalizada.
            </p>
            <p className="text-lg text-muted-foreground">
              Ideal para investigadores que necesitan oligos de uso común de forma urgente.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container-width px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              ¿Necesitas una secuencia específica?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Si no encuentras tu secuencia en ListOligo, podemos sintetizarla para ti 
              en tan solo 3 días.
            </p>
            <Link to="/productos/oligonucleotidos">
              <Button size="lg" variant="outline" className="gap-2">
                Ver Síntesis Personalizada <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ListOligo;
