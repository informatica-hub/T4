import { NucleotideBackground } from "@/components/ui/NucleotideBackground";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Atom, FlaskConical, CheckCircle, Building2 } from "lucide-react";
import { Seo } from "@/components/seo/Seo";

const institutions = [
  "Cinvestav", "INDRE", "Instituto Nacional de Enfermedades Respiratorias", "SENASICA",
  "UNAM", "Universidad de Guadalajara", "Tecnológico de Monterrey",
  "Instituto de Biotecnología", "GenLab", "La Salle", "Hospital Juárez de México",
  "IMSS", "Universidad de Guanajuato",
];

export default function Innovaciones() {
  return (
    <div className="min-h-screen bg-background">
      <Seo title="Innovaciones en síntesis de oligos | T4 México" description="Novedades, tecnologías y nuevos productos T4 para investigación y diagnóstico molecular en México." />
      {/* Hero */}
      <section className="relative bg-muted/40 pt-20 pb-12 md:pt-24 md:pb-16">
        <NucleotideBackground className="opacity-20" />
        <div className="container-width px-4 md:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Innovaciones
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              El ADN de nuestra Tecnología
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              En T4 no solo aplicamos la tecnología existente; la reinventamos. Nuestra división de Investigación 
              y Desarrollo trabaja constantemente en la creación de herramientas moleculares únicas que resuelven 
              las limitaciones de los ensayos tradicionales.
            </p>
          </div>
        </div>
      </section>

      {/* Innovations */}
      <section className="relative py-16 bg-muted/30">
        <div className="container-width px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Atom className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Fluoróforo MIKE™</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Desarrollado como el homólogo de alta fidelidad para VIC® con un espectro de absorción 
                  y emisión en la región amarillo-verde. MIKE™ ofrece una eficiencia cuántica superior, 
                  siendo totalmente compatible con instrumentos calibrados para VIC®, JOE® y Yakima Yellow®.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <FlaskConical className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Molécula 4BOND™</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  4BOND™ es nuestra molécula propietaria de estabilización química, actuando como un 
                  homólogo de alto desempeño a la tecnología Minor Groove Binder (MGB), que se integra 
                  en nuestras sondas StarQ Polaris™.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">Metodología StarQ™</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  La calidad de una sonda no se mide solo por su secuencia, sino por su comportamiento 
                  dinámico. Hemos desarrollado una metodología de validación única para nuestra línea StarQ™ 
                  que garantiza desempeño reproducible.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-10">
            <p className="text-muted-foreground mb-4">
              ¿Quiere saber cómo nuestras patentes pueden potenciar su investigación?
            </p>
            <Link to="/contacto">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Hable con su Colega Científico T4
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 15 Años */}
      <section className="relative py-20">
        <div className="container-width px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-6">
              15 Años de Ciencia Aplicada, Compromiso y Evolución
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Nuestra historia es el respaldo de su futuro.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div>
                <h3 className="font-bold text-foreground mb-2">Ciencia Aplicada que Transforma</h3>
                <p className="text-sm text-muted-foreground">
                  Durante 15 años, hemos transformado el conocimiento científico en soluciones tangibles. 
                  Desde el desarrollo de fluoróforos propios como MIKE™ hasta la creación de la línea Sentinel™.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">Evolución Constante</h3>
                <p className="text-sm text-muted-foreground">
                  De ser proveedores de insumos, nos hemos convertido en integradores tecnológicos y centros 
                  de servicios especializados (CRO). Nuestra evolución refleja nuestra capacidad de adaptación.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">El Camino hacia el Futuro</h3>
                <p className="text-sm text-muted-foreground">
                  Los próximos años de T4 estarán marcados por la expansión de nuestras fronteras tecnológicas 
                  y el fortalecimiento de nuestra comunidad científica.
                </p>
              </div>
            </div>

            <blockquote className="border-l-4 border-primary pl-6 py-4 bg-muted/30 rounded-r-lg mb-16">
              <p className="text-foreground italic">
                "Quince años no son el final del camino, sino la base sólida sobre la cual seguiremos 
                construyendo la biotecnología del mañana. Gracias por permitirnos ser el motor molecular 
                de su laboratorio. Sigamos evolucionando juntos."
              </p>
            </blockquote>

            {/* Instituciones */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground mb-8">Instituciones Colaboradoras</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {institutions.map((inst) => (
                  <span
                    key={inst}
                    className="px-4 py-2 bg-muted rounded-full text-sm text-muted-foreground border border-border/50"
                  >
                    {inst}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
