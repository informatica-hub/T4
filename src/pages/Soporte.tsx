import { HeadphonesIcon, ExternalLink, Calculator, Dna, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { NucleotideBackground } from "@/components/ui/NucleotideBackground";
import { Seo } from "@/components/seo/Seo";

const herramientas = [
  {
    titulo: "Stanford – Síntesis química del ADN",
    descripcion: "Aprende sobre el ciclo de síntesis química del ADN",
    url: "https://med.stanford.edu/sgtc/resources/chemical_DNA_synthesis.html",
    categoria: "Educación",
  },
  {
    titulo: "NCBI – Primer-BLAST",
    descripcion: "Diseña y analiza primers para PCR",
    url: "https://www.ncbi.nlm.nih.gov/tools/primer-blast/",
    categoria: "Diseño de Primers",
  },
  {
    titulo: "OligoCalc – Northwestern University",
    descripcion: "Calculadora de propiedades de oligonucleótidos",
    url: "http://biotools.nubic.northwestern.edu/OligoCalc.html",
    categoria: "Calculadora Tm",
  },
  {
    titulo: "Thermo Fisher – Tm Calculator",
    descripcion: "Calcula la temperatura de fusión de tus oligos",
    url: "https://www.thermofisher.com/mx/es/home/brands/thermo-scientific/molecular-biology/molecular-biology-learning-center/molecular-biology-resource-library/thermo-scientific-web-tools/tm-calculator.html",
    categoria: "Calculadora Tm",
  },
  {
    titulo: "Primer3",
    descripcion: "Herramienta avanzada para diseño de primers y cálculo de Tm",
    url: "https://primer3.ut.ee/",
    categoria: "Diseño de Primers",
  },
];

const Soporte = () => {
  return (
    <div className="min-h-screen">
      <Seo title="Soporte técnico | T4 México" description="Soporte técnico especializado en oligonucleótidos, sondas qPCR, primers y secuenciación para clientes en México." />
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-muted/40">
        <NucleotideBackground />
        <div className="container-width px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <HeadphonesIcon className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Soporte Científico
            </h1>
            <p className="text-xl text-muted-foreground">
              Recursos y herramientas para optimizar tu trabajo con oligonucleótidos
            </p>
          </div>
        </div>
      </section>

      {/* Herramientas */}
      <section className="py-16 md:py-24">
        <div className="container-width px-4 md:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Calculator className="h-8 w-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Herramientas Útiles
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Calcula la Tm de tus oligos y diseña primers con estas herramientas recomendadas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {herramientas.map((herramienta, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="p-0">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full mb-4">
                    {herramienta.categoria}
                  </span>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {herramienta.titulo}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {herramienta.descripcion}
                  </p>
                  <a
                    href={herramienta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
                  >
                    Visitar <ExternalLink className="h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Imagen laboratorio */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container-width px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://t4oligo.com/wp-content/uploads/t4ins.jpg" 
                alt="Instalaciones T4"
                className="rounded-2xl shadow-xl w-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Dna className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">
                  Ciclo de Síntesis Química del ADN
                </h2>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                La síntesis química de oligonucleótidos es un proceso complejo que 
                requiere precisión y control de calidad en cada paso. En T4, 
                utilizamos tecnología de última generación para garantizar la más 
                alta calidad en cada síntesis.
              </p>
              <a
                href="https://med.stanford.edu/sgtc/resources/chemical_DNA_synthesis.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="gap-2">
                  Aprender más <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Link */}
      <section className="py-16 md:py-24">
        <div className="container-width px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">
                Preguntas Frecuentes
              </h2>
            </div>
            <p className="text-lg text-muted-foreground mb-8">
              Encuentra respuestas sobre resuspensión, purificación, almacenamiento 
              y más en nuestra sección de FAQ
            </p>
            <Link to="/faq">
              <Button size="lg">
                Ver Preguntas Frecuentes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container-width px-4 md:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              ¿Necesitas ayuda personalizada?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Nuestro equipo de científicos especializados está listo para asesorarte
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:soporte@t4oligo.com">
                <Button size="lg" className="w-full sm:w-auto">
                  soporte@t4oligo.com
                </Button>
              </a>
              <a
                href="https://wa.me/4623073642"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full sm:w-auto bg-[#25D366] text-white border-[#25D366] hover:bg-[#25D366]/90"
                >
                  WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Soporte;
