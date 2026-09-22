import { Dna, Clock, Shield, Beaker, CheckCircle, ArrowRight } from "lucide-react";
import labOligosImg from "@/assets/lab-genomica-oligos.jpg";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NucleotideBackground } from "@/components/ui/NucleotideBackground";
import { Seo } from "@/components/seo/Seo";
import { productLd } from "@/components/seo/structuredData";

const escalas = [
  { escala: "25 nM", aplicacion: "PCR rutinario, secuenciación" },
  { escala: "50 nM", aplicacion: "Clonación, mutagénesis" },
  { escala: "100 nM", aplicacion: "Aplicaciones sensibles, qPCR" },
  { escala: "200 nM", aplicacion: "Proyectos de alto volumen" },
  { escala: "1000 nM", aplicacion: "Producción a gran escala" },
];

const purificaciones = [
  { tipo: "Desalado", descripcion: "Estándar para PCR y secuenciación rutinaria" },
  { tipo: "Cartucho", descripcion: "Mayor pureza para aplicaciones sensibles" },
  { tipo: "HPLC", descripcion: "Recomendado para oligos modificados y sondas" },
  { tipo: "PAGE", descripcion: "Máxima pureza para aplicaciones críticas" },
];

const Oligonucleotidos = () => {
  return (
    <div className="min-h-screen">
      <Seo title="Síntesis de oligonucleótidos en México | T4" description="Primers y oligos personalizados sintetizados en México: escalas 25 nM–1 µmol, purificaciones desalado, HPLC, PAGE. Entrega rápida." keywords="síntesis de oligonucleótidos México, primers personalizados México" type="product" jsonLd={productLd({ name: "Oligonucleótidos personalizados T4", description: "Síntesis de primers y oligonucleótidos personalizados en escalas 25 nM, 50 nM, 100 nM, 200 nM y 1000 nM con purificaciones desalado, cartucho, HPLC y PAGE. Entrega desde 3 días con garantía de resíntesis de un año.", image: "https://t4oligo.com/wp-content/uploads/cajas2.png", category: "Oligonucleótidos", url: "/productos/oligonucleotidos" })} />
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-muted/40">
        <NucleotideBackground />
        <div className="container-width px-4 md:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4">
                Síntesis Personalizada
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Oligos en tu laboratorio desde 3 días. Nadie más puede decir lo mismo.
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Oligonucleótidos desalados y purificados, con la mayor velocidad de entrega del mercado, calidad garantizada y resíntesis sin costo por hasta un año. Sin excusas. Sin esperas innecesarias.
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
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src={labOligosImg} 
                alt="Laboratorio de genómica con insumos y equipo para síntesis de oligonucleótidos"
                width={1024}
                height={1024}
                className="max-w-full rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container-width px-4 md:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <Clock className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold text-foreground mb-1">Desde 3 días</h3>
                <p className="text-sm text-muted-foreground">Tiempo de entrega</p>
              </CardContent>
            </Card>
            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <Shield className="h-10 w-10 text-secondary mx-auto mb-3" />
                <h3 className="font-bold text-foreground mb-1">1 año garantía</h3>
                <p className="text-sm text-muted-foreground">Resíntesis incluida</p>
              </CardContent>
            </Card>
            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <Beaker className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold text-foreground mb-1">HPLC + MS</h3>
                <p className="text-sm text-muted-foreground">Control de calidad</p>
              </CardContent>
            </Card>
            <Card className="p-6 text-center">
              <CardContent className="p-0">
                <Dna className="h-10 w-10 text-secondary mx-auto mb-3" />
                <h3 className="font-bold text-foreground mb-1">Modificaciones</h3>
                <p className="text-sm text-muted-foreground">Amplio catálogo</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tabs Info */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container-width px-4 md:px-8">
          <Tabs defaultValue="producto" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="producto">Información del Producto</TabsTrigger>
              <TabsTrigger value="tecnica">Información Técnica</TabsTrigger>
              <TabsTrigger value="calidad">Desempeño y Calidad</TabsTrigger>
            </TabsList>

            <TabsContent value="producto" className="space-y-6">
              <Card className="p-8">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    ¿Requiere oligonucleótidos con degeneraciones o purificaciones mayores?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    No hay problema, T4 puede sintetizar sus primers en escalas de 
                    25nM, 50 nM, 100 nM, 200 nM y 1000 nM, incluyendo degeneraciones y 
                    purificaciones especiales.
                  </p>

                  <h4 className="text-lg font-semibold text-foreground mb-4">Escalas Disponibles</h4>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {escalas.map((e, i) => (
                      <div key={i} className="p-4 bg-muted/50 rounded-lg">
                        <span className="font-bold text-primary">{e.escala}</span>
                        <p className="text-sm text-muted-foreground mt-1">{e.aplicacion}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                    <p className="text-muted-foreground">
                      Si requiere mayor información sobre el tipo de purificación que mejor 
                      le conviene, solicite asesoría a{" "}
                      <a href="mailto:ventas@t4oligo.com" className="text-primary hover:underline">
                        ventas@t4oligo.com
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tecnica" className="space-y-6">
              <Card className="p-8">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Resuspensión y almacenamiento de sus oligos
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Para resuspender o reconstruir sus oligos y sondas agregar el volumen 
                    de agua o buffer que indica el certificado de síntesis y seguir los 
                    siguientes pasos:
                  </p>
                  <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                    <li>Centrifugar el tubo para asegurarse que el pellet se encuentra en el fondo del tubo</li>
                    <li>Agregar el volumen apropiado indicado en el certificado de síntesis</li>
                    <li>Esperar unos minutos para que se hidrate el pellet y sea más fácil resuspenderlo</li>
                    <li>Agitar en vórtex por unos segundos</li>
                    <li>Centrifugar brevemente antes de usar</li>
                  </ol>

                  <div className="mt-6 p-4 bg-secondary/10 rounded-lg">
                    <p className="font-medium text-foreground mb-2">Almacenamiento recomendado:</p>
                    <p className="text-muted-foreground">
                      Guardar a -20°C los oligos que no se vayan a utilizar de inmediato. 
                      Para uso frecuente, mantener alícuotas a 4°C.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calidad" className="space-y-6">
              <Card className="p-8">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Control de Calidad
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    La calidad de nuestros oligonucleótidos es controlada por procesos de 
                    control estrictos tales como análisis por HPLC y espectrometría de masas.
                  </p>

                  <h4 className="text-lg font-semibold text-foreground mb-4">Tipos de Purificación</h4>
                  <div className="space-y-4">
                    {purificaciones.map((p, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold text-foreground">{p.tipo}</span>
                          <p className="text-sm text-muted-foreground">{p.descripcion}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Product Image */}
      <section className="py-16 md:py-24">
        <div className="container-width px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://t4oligo.com/wp-content/uploads/WhatsApp-Image-2024-01-03-at-18.01.54-6.png" 
                alt="Productos T4"
                className="rounded-2xl shadow-xl w-full"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Calidad que se ve en cada detalle
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Cada pedido incluye un certificado de análisis completo con información 
                detallada sobre su oligonucleótido, incluyendo secuencia, rendimiento, 
                y análisis de pureza.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Etiquetas con código QR para acceso rápido al certificado
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Empaque seguro
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Seguimiento de envío en tiempo real
                </li>
              </ul>
              <Link to="/contacto">
                <Button variant="outline" size="lg">
                  Solicitar Muestra
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Oligonucleotidos;
