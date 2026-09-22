import { Dna, Settings, Beaker, ArrowRight, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { NucleotideBackground } from "@/components/ui/NucleotideBackground";
import { Seo } from "@/components/seo/Seo";

const escalas = [
  "100 nM",
  "200 nM",
  "500 nM",
  "1 µmol",
  "Mayor escala disponible",
];

const purificaciones = [
  "Desalado",
  "Cartucho",
  "HPLC",
  "PAGE",
];

const SintesisRNA = () => {
  return (
    <div className="min-h-screen">
      <Seo title="Síntesis de RNA en México | T4" description="Síntesis química de oligos de RNA, 2'-OMe y modificados, con QC por HPLC y MS. Producción en México." keywords="síntesis RNA México, oligos RNA modificados" type="product" />
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-muted/40">
        <NucleotideBackground />
        <div className="container-width px-4 md:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4">
                Síntesis Especializada
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Síntesis RNA
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                T4 ofrece síntesis de RNA desde escalas de 100 nM con o sin 
                modificaciones, así como diversas opciones de purificación para 
                adaptarse a tus necesidades.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="mailto:ventas@t4oligo.com">
                  <Button size="lg" className="gap-2">
                    <Mail className="h-5 w-5" />
                    Contactar Especialista
                  </Button>
                </a>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://t4oligo.com/wp-content/uploads/oligos2.png" 
                alt="Síntesis RNA"
                className="max-w-full rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container-width px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center border-t-4 border-t-primary">
              <CardContent className="p-0">
                <Dna className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Con o Sin Modificaciones
                </h3>
                <p className="text-muted-foreground">
                  Amplio catálogo de modificaciones químicas disponibles
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center border-t-4 border-t-secondary">
              <CardContent className="p-0">
                <Settings className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Escalas Flexibles
                </h3>
                <p className="text-muted-foreground">
                  Desde 100 nM hasta escalas mayores según tu proyecto
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center border-t-4 border-t-primary">
              <CardContent className="p-0">
                <Beaker className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Purificaciones Especiales
                </h3>
                <p className="text-muted-foreground">
                  Opciones de purificación adaptadas a cada aplicación
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Scales and Purifications */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container-width px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="p-8">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Escalas Disponibles
                </h3>
                <div className="space-y-3">
                  {escalas.map((escala, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="text-foreground">{escala}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="p-8">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Opciones de Purificación
                </h3>
                <div className="space-y-3">
                  {purificaciones.map((purificacion, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="h-2 w-2 rounded-full bg-secondary" />
                      <span className="text-foreground">{purificacion}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ADN Image */}
      <section className="py-16 md:py-24">
        <div className="container-width px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Asesoría Especializada
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Si deseas armar tu proyecto o conocer más sobre la gama de productos de RNA 
                que ofertamos, contáctanos para asignar un especialista que de 
                manera personalizada te dará la asesoría necesaria.
              </p>
              <div className="bg-primary/5 p-6 rounded-xl mb-6">
                <p className="text-muted-foreground mb-2">
                  <strong className="text-foreground">Nota importante:</strong>
                </p>
                <p className="text-muted-foreground">
                  Para oligos con RNA, favor de contactar directamente con nuestro 
                  equipo de ventas para una cotización personalizada.
                </p>
              </div>
              <a href="mailto:ventas@t4oligo.com">
                <Button size="lg" className="gap-2">
                  <Mail className="h-5 w-5" />
                  ventas@t4oligo.com
                </Button>
              </a>
            </div>
            <div>
              <img 
                src="https://t4oligo.com/wp-content/uploads/adn2.png" 
                alt="ADN T4"
                className="rounded-2xl shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container-width px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              ¿Listo para iniciar tu proyecto con RNA?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Nuestro equipo de expertos está listo para ayudarte a diseñar 
              la mejor estrategia para tu investigación.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:ventas@t4oligo.com">
                <Button size="lg" className="gap-2">
                  Arma tu Proyecto <ArrowRight className="h-5 w-5" />
                </Button>
              </a>
              <Link to="/faq">
                <Button size="lg" variant="outline">
                  Ver Preguntas Frecuentes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SintesisRNA;
