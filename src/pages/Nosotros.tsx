import { useState } from "react";
import { Users, Target, Eye, Heart, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { NucleotideBackground } from "@/components/ui/NucleotideBackground";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import mauricioImg from "@/assets/cientificos/mauricio.png";
import robertoImg from "@/assets/cientificos/roberto.png";
import byronImg from "@/assets/cientificos/byron.png";
import rocioImg from "@/assets/cientificos/rocio.png";
import concepcionImg from "@/assets/cientificos/concepcion.png";
import alejandraImg from "@/assets/cientificos/alejandra.png";
import hectorImg from "@/assets/cientificos/hector.png";
import edificioImg from "@/assets/instalaciones/edificio.png";
import lab2Img from "@/assets/instalaciones/lab2.png";
import lab3Img from "@/assets/instalaciones/lab3.png";
import lab4Img from "@/assets/instalaciones/lab4.png";
import sintesisImg from "@/assets/instalaciones/sintesis.png";
import { Seo } from "@/components/seo/Seo";

const cientificos = [
  {
    nombre: "M. en C. Mauricio Díaz Sánchez",
    rol: "Director científico del Instituto Traslacional de Singularidad Genómica, ITRASIG.",
    img: mauricioImg,
  },
  {
    nombre: "Dr. Roberto Javier Mondéjar Canet",
    rol: "Especialista en biología molecular para agricultura.",
    img: robertoImg,
  },
  {
    nombre: "Byron Galindo Ornelas",
    rol: "Especialista en secuenciación.",
    img: byronImg,
  },
  {
    nombre: "Bióloga Rocío Sánchez Sánchez",
    rol: "Equipo científico T4.",
    img: rocioImg,
  },
  {
    nombre: "Dra. María Concepción García Pérez",
    rol: "Equipo científico T4.",
    img: concepcionImg,
  },
  {
    nombre: "Bioquímica Alejandra García Ríos",
    rol: "Equipo científico T4.",
    img: alejandraImg,
  },
  {
    nombre: "Bioquímico Héctor Tenorio Robledo",
    rol: "Responsable soporte científico comercial.",
    img: hectorImg,
  },
];

const instalaciones = [
  { titulo: "Nuestro edificio", img: edificioImg },
  { titulo: "Laboratorio principal", img: lab2Img },
  { titulo: "Sintetizador de oligonucleótidos", img: lab3Img },
  { titulo: "Área de equipos de síntesis", img: lab4Img },
  { titulo: "Sala de síntesis", img: sintesisImg },
];

const valores = [
  "Enfoque al usuario",
  "Innovación",
  "Trabajo en equipo",
  "Respeto",
  "Responsabilidad",
  "Empatía",
  "Compromiso",
];

const Nosotros = () => {
  const [openCientificos, setOpenCientificos] = useState(false);
  const [openInstalaciones, setOpenInstalaciones] = useState(false);
  return (
    <div className="min-h-screen">
      <Seo title="Nosotros | T4 — Biología molecular hecha en México" description="Conoce a T4: 15+ años sintetizando oligonucleótidos y sondas en México con certificación ISO 9001:2015 y equipo científico propio." />
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-muted/40">
        <NucleotideBackground />
        <div className="container-width px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">Nosotros</h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Somos la única empresa en México, productora de oligonucleótidos, ácidos nucleicos, sondas, genes
              sintéticos y todo lo relacionado a la síntesis de ácidos nucleicos.
            </p>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 md:py-24">
        <div className="container-width px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Building2 className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Nuestra Historia</h2>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Estamos localizados en la ciudad de Irapuato, Guanajuato y tenemos distribución a todo el mundo.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Nuestros tiempos de entrega son desde <strong className="text-primary">48 horas</strong>.
              </p>
              <p className="text-lg text-muted-foreground">
                Con más de 15 años de experiencia, nos hemos consolidado como la referencia en producción e innovación
                en ácidos nucleicos en México y Latinoamérica.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://t4oligo.com/wp-content/uploads/adn1-2-1024x576.jpg"
                alt="ADN T4"
                className="rounded-2xl shadow-xl w-full"
              />
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-lg">
                <span className="text-2xl font-bold">
                  <span className="text-2xl font-bold">15+</span>
                </span>
                <span className="text-sm ml-2">años de experiencia</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container-width px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 bg-card/80 backdrop-blur-sm border-primary/20">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    La primera y más completa plataforma 360° en Biología Molecular, hecha en México.
                  </h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Nuestra misión es fortalecer la investigación científica mexicana desde Mexico . Integramos tecnología
                  de vanguardia, calidad certificada internacionalmente y soporte científico real en una sola plataforma
                  de biologia molecular
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 bg-card/80 backdrop-blur-sm border-secondary/20">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-secondary/10">
                    <Eye className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Visión</h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Convertirnos para México y Latinoamérica en la referencia por excelencia en producción e innovación en
                  ácidos nucleicos y sus aplicaciones en diagnóstico molecular en apoyo a la industria, academia y
                  sector público.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 md:py-24">
        <div className="container-width px-4 md:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Heart className="h-8 w-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Nuestros Valores</h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Los principios que guían nuestro trabajo diario
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {valores.map((valor, index) => (
              <div
                key={index}
                className="px-6 py-3 bg-primary/8 rounded-full border border-primary/20 hover:border-primary/40 transition-colors"
              >
                <span className="text-foreground font-medium">{valor}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container-width px-4 md:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="h-8 w-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Nuestro Equipo</h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Somos una empresa creada por científicos y para científicos con presencia y estándares de calidad
              internacionales.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <button
              type="button"
              onClick={() => setOpenCientificos(true)}
              className="text-left"
            >
              <Card className="p-6 text-center hover:shadow-lg hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardContent className="p-0">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center">
                    <Users className="h-12 w-12 text-primary-foreground" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-2">Científicos Expertos</h4>
                  <p className="text-muted-foreground">Especialistas en biología molecular y bioinformática</p>
                  <p className="text-sm text-primary mt-3 font-medium">Conoce al equipo →</p>
                </CardContent>
              </Card>
            </button>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                  <Target className="h-12 w-12 text-secondary-foreground" />
                </div>
                <h4 className="text-xl font-bold text-foreground mb-2">Enfoque al usuario</h4>
                <p className="text-muted-foreground">Asesoría personalizada para cada proyecto</p>
              </CardContent>
            </Card>

            <button
              type="button"
              onClick={() => setOpenInstalaciones(true)}
              className="text-left"
            >
              <Card className="p-6 text-center hover:shadow-lg hover:border-primary/40 transition-all cursor-pointer h-full">
                <CardContent className="p-0">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center">
                    <Building2 className="h-12 w-12 text-primary-foreground" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-2">Instalaciones</h4>
                  <p className="text-muted-foreground">
                    1,000 m² de infraestructura de vanguardia dedicados íntegramente al desarrollo y manufactura de
                    soluciones en Biología Molecular
                  </p>
                  <p className="text-sm text-primary mt-3 font-medium">Conoce nuestras instalaciones →</p>
                </CardContent>
              </Card>
            </button>
          </div>
        </div>
      </section>

      {/* Modal Científicos Expertos */}
      <Dialog open={openCientificos} onOpenChange={setOpenCientificos}>
        <DialogContent className="max-w-4xl overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl md:text-3xl font-bold">
              Soporte Científico Especializado
            </DialogTitle>
            <DialogDescription className="text-base">
              Ciencia que se resuelve entre científicos. Ponemos a su disposición un equipo de
              investigadores especializados listos para asesorarlo en diseño experimental, selección
              de insumos e interpretación de resultados — con la profundidad y la confianza de una
              conversación entre colegas.
            </DialogDescription>
          </DialogHeader>

          <div className="min-w-0 w-full">
            <Carousel opts={{ align: "start", loop: true }} className="w-full px-12">
              <CarouselContent>
                {cientificos.map((c) => (
                  <CarouselItem key={c.nombre} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="border-primary/20 h-full">
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className="w-40 h-40 rounded-full overflow-hidden mb-4 bg-muted ring-2 ring-primary/20">
                          <img
                            src={c.img}
                            alt={c.nombre}
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                          />
                        </div>
                        <h4 className="font-bold text-foreground text-sm mb-1">{c.nombre}</h4>
                        <p className="text-xs text-muted-foreground">{c.rol}</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Instalaciones */}
      <Dialog open={openInstalaciones} onOpenChange={setOpenInstalaciones}>
        <DialogContent className="max-w-4xl overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl md:text-3xl font-bold">
              Conoce nuestras instalaciones
            </DialogTitle>
            <DialogDescription className="text-base">
              1,000 m² de infraestructura de vanguardia dedicados íntegramente al desarrollo y
              manufactura de soluciones en Biología Molecular.
            </DialogDescription>
          </DialogHeader>

          <div className="min-w-0 w-full">
            <Carousel opts={{ align: "start", loop: true }} className="w-full px-12">
              <CarouselContent>
                {instalaciones.map((item) => (
                  <CarouselItem key={item.titulo} className="md:basis-1/2">
                    <Card className="border-primary/20 h-full overflow-hidden">
                      <div className="aspect-video w-full overflow-hidden bg-muted">
                        <img
                          src={item.img}
                          alt={item.titulo}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <CardContent className="p-4 text-center">
                        <h4 className="font-bold text-foreground text-sm">{item.titulo}</h4>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Nosotros;
