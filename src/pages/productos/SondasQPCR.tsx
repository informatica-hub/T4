import { Lightbulb, Microscope, CheckCircle, ArrowRight, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Seo } from "@/components/seo/Seo";
import { productLd } from "@/components/seo/structuredData";
import sondasQpcrImg from "@/assets/sondas-qpcr.jpg";

const fluoroforos = [
  { nombre: "FAM", color: "bg-blue-500", aplicacion: "Detección general" },
  { nombre: "HEX", color: "bg-green-500", aplicacion: "Multiplex" },
  { nombre: "TAMRA", color: "bg-yellow-500", aplicacion: "Multiplex" },
  { nombre: "ROX", color: "bg-red-500", aplicacion: "Normalización" },
  { nombre: "Cy5", color: "bg-purple-500", aplicacion: "Multiplex avanzado" },
  { nombre: "Texas Red", color: "bg-rose-500", aplicacion: "Multiplex" },
];

const SondasQPCR = () => {
  return (
    <div className="min-h-screen">
      <Seo title="Sondas qPCR en México: TaqMan, FAM, HEX | T4" description="Sondas qPCR hidrólisis y dual-labeled con fluoróforos FAM, HEX, ROX, Cy5 y quenchers BHQ. Síntesis y QC en México." keywords="sondas qPCR México, sondas TaqMan México, FAM HEX BHQ" type="product" jsonLd={productLd({ name: "Sondas qPCR T4", description: "Sondas para PCR tiempo real doblemente marcadas con fluoróforos FAM, HEX, TAMRA, ROX, Cy5 y Texas Red, combinadas con quenchers BHQ-1, BHQ-2, DABCYL y T-BHQ1. Compatibles con Applied Biosystems, Bio-Rad, Roche y otros equipos.", image: "https://t4oligo.com/wp-content/uploads/sondas3.png", category: "Sondas qPCR", url: "/productos/sondas-qpcr" })} />
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container-width px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <img 
                src={sondasQpcrImg} 
                alt="Sondas qPCR fluorescentes con marcaje FAM, HEX, ROX y Cy5"
                width={1024}
                height={1024}
                className="max-w-full rounded-2xl"
              />
            </div>
            <div>
              <span className="inline-block px-4 py-2 bg-secondary/20 text-secondary rounded-full text-sm font-medium mb-4">
                PCR Tiempo Real
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Sondas para qPCR
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                Si bien el costo por reacción de SYBR Green es equiparable al costo utilizando 
                sondas fluorescentes sintetizadas por T4, el utilizar sondas fluorescentes 
                te ofrece un abanico de posibilidades.
              </p>
              <h2 className="text-base md:text-lg font-semibold text-primary mb-8">
                Para solicitar tu cotización: crea tu proyecto, descarga el formato, llénalo con tus datos completos, secuencias y súbelo.
              </h2>
              <div className="flex flex-wrap gap-4">
                <Link to="/carrito">
                  <Button size="lg" className="gap-2">
                    Arma tu Proyecto <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/soporte">
                  <Button size="lg" variant="outline">
                    Asesoría de Diseño
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24">
        <div className="container-width px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ventajas de las Sondas Fluorescentes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Maximiza tus resultados con la tecnología de sondas más avanzada
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <Zap className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-foreground mb-2">Multiplex</h3>
                <p className="text-sm text-muted-foreground">
                  Varios ensayos en una sola reacción
                </p>
              </CardContent>
            </Card>
            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <Microscope className="h-10 w-10 text-secondary mx-auto mb-4" />
                <h3 className="font-bold text-foreground mb-2">Mayor Especificidad</h3>
                <p className="text-sm text-muted-foreground">
                  Resultados más precisos y confiables
                </p>
              </CardContent>
            </Card>
            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <Lightbulb className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-bold text-foreground mb-2">Discriminación Alélica</h3>
                <p className="text-sm text-muted-foreground">
                  Detección de variantes genéticas
                </p>
              </CardContent>
            </Card>
            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <CheckCircle className="h-10 w-10 text-secondary mx-auto mb-4" />
                <h3 className="font-bold text-foreground mb-2">Cuantificación</h3>
                <p className="text-sm text-muted-foreground">
                  Relativa o absoluta con precisión
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Info */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container-width px-4 md:px-8">
          <Tabs defaultValue="tecnica" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="tecnica">Información Técnica</TabsTrigger>
              <TabsTrigger value="fluoroforos">Fluoróforos y Quenchers</TabsTrigger>
              <TabsTrigger value="equipos">Fluoróforos vs. Equipo</TabsTrigger>
            </TabsList>

            <TabsContent value="tecnica">
              <Card className="p-8">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Sondas Doblemente Marcadas
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Las sondas doblemente marcadas son en esencia, secuencias nucleotídicas 
                    lineales que incorporan un fluoróforo y un aceptor o "quencher" unidos de 
                    manera covalente en los extremos 5' y 3' de un oligonucleótido, generalmente 
                    de 20 a 30 bases de longitud.
                  </p>

                  <div className="bg-primary/5 p-6 rounded-lg mb-6">
                    <h4 className="font-semibold text-foreground mb-3">Importante:</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        Sondas mayores a 30 bases pueden tener menor eficiencia en el quenching
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        Para sondas largas, considere colocar el quencher internamente
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        Sondas menores a 20 bases pueden requerir diseño MGB
                      </li>
                    </ul>
                  </div>

                  <p className="text-muted-foreground">
                    T4 cuenta con alternativas privadas y accesibles con resultados 
                    similares o superiores a las sondas comerciales.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fluoroforos">
              <Card className="p-8">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold text-foreground mb-6">
                    Fluoróforos Disponibles
                  </h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fluoroforos.map((f, i) => (
                      <div key={i} className="p-4 bg-muted/50 rounded-lg flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full ${f.color}`} />
                        <div>
                          <span className="font-bold text-foreground">{f.nombre}</span>
                          <p className="text-xs text-muted-foreground">{f.aplicacion}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <h4 className="font-semibold text-foreground mb-4">Quenchers Disponibles</h4>
                    <div className="flex flex-wrap gap-3">
                      <span className="px-4 py-2 bg-gray-800 text-white rounded-full text-sm">BHQ-1</span>
                      <span className="px-4 py-2 bg-gray-800 text-white rounded-full text-sm">BHQ-2</span>
                      <span className="px-4 py-2 bg-gray-800 text-white rounded-full text-sm">TAMRA</span>
                      <span className="px-4 py-2 bg-gray-800 text-white rounded-full text-sm">DABCYL</span>
                      <span className="px-4 py-2 bg-gray-800 text-white rounded-full text-sm">T-BHQ1</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="equipos">
              <Card className="p-8">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Compatibilidad con Equipos
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Nuestras sondas son compatibles con los principales equipos de PCR 
                    tiempo real del mercado. Contáctenos para confirmar la combinación 
                    óptima de fluoróforo/quencher para su equipo específico.
                  </p>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Applied Biosystems</h4>
                      <p className="text-sm text-muted-foreground">7500, QuantStudio, ViiA 7</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Bio-Rad</h4>
                      <p className="text-sm text-muted-foreground">CFX96, CFX Connect</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Roche</h4>
                      <p className="text-sm text-muted-foreground">LightCycler 480, 96</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold text-foreground mb-2">Otros</h4>
                      <p className="text-sm text-muted-foreground">Agilent, QIAGEN, Cepheid</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container-width px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              ¿Está listo para llevar a la realidad su diseño?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              No importa si su diseño de sondas y oligos para PCR tiempo real ha sido 
              previamente reportado o es de novo, T4 le ofrece toda la asesoría 
              científica para reducir riesgos al ordenar la síntesis y aumentar la 
              eficiencia de sus experimentos.
            </p>
            <p className="text-xl font-medium text-primary mb-8">
              ¡Convertir sus horas de diseño en realidad nunca fue más fácil!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/carrito">
                <Button size="lg" className="gap-2">
                  Arma tu Proyecto <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/soporte">
                <Button size="lg" variant="outline">
                  Ver Soporte Técnico
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SondasQPCR;
