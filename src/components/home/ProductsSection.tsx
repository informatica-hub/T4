import { Link } from "react-router-dom";
import circuloT4 from "@/assets/circulo_T4.png";
import { ArrowRight, FlaskConical, Microscope, Dna, Beaker, TestTubes, Shield, Pipette, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const products = [
  {
    icon: FlaskConical,
    title: "Oligonucleótidos",
    description: "Primers personalizados y PrimeReady™ con +100 modificaciones químicas disponibles.",
    href: "/productos",
    highlight: "Desde 3 días",
    color: "#5B6FC0",
  },
  {
    icon: Microscope,
    title: "Sondas de Hidrólisis",
    description: "Tecnología patentada StarQ™ de Sincronización de Fluorescencia Dinámica para qPCR.",
    href: "/productos",
    highlight: "Patentado",
    color: "#8B2332",
  },
  {
    icon: Dna,
    title: "Genes Sintéticos",
    description: "T4Bricks™ y T4Gene™: del diseño bioinformático a la realidad biológica.",
    href: "/productos",
    highlight: "Hasta 3 kb",
    color: "#7A8B2D",
  },
  {
    icon: Beaker,
    title: "Enzimas",
    description: "GIGAscript™ y GIGAmaster™: Taq con aptámeros, cero amplificación inespecífica.",
    href: "/productos",
    highlight: "Hot Start",
    color: "#5A5A5A",
  },
  {
    icon: TestTubes,
    title: "Extracción y Purificación",
    description: "NextPure™: extracción magnética sin columnas para matrices clínicas, animales y vegetales.",
    href: "/productos",
    highlight: "Eco-friendly",
    color: "#6B7B6B",
  },
  {
    icon: Shield,
    title: "Kits de Detección",
    description: "Sentinel™: detección temprana de patógenos en agricultura, alimentos y sanidad animal.",
    href: "/productos",
    highlight: "RUO",
    color: "#9B8B2F",
  },
  {
    icon: Pipette,
    title: "Primers",
    description: "Reactivos esenciales, consumibles, equipamiento y distribuciones de marcas aliadas.",
    href: "/productos",
    highlight: "Soporte integral",
    color: "#4A90D9",
  },
  {
    icon: Lightbulb,
    title: "Innovaciones",
    description: "Fluoróforo MIKE™, molécula 4BOND™ y metodología de validación propietaria.",
    href: "/productos",
    highlight: "I+D T4",
    color: "#C5D92D",
  },
];

export function ProductsSection() {
  return (
    <section className="section-padding">
      <div className="container-width">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nuestros <span className="text-primary">Productos</span>
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Soluciones de biología molecular desarrolladas por y para científicos.
              Un solo proveedor, una sola factura.
            </p>
          </div>
          <Link to="/productos">
            <Button variant="outline" className="whitespace-nowrap">
              Ver catálogo completo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="flex justify-center my-10">
          <img
            src={circuloT4}
            alt="Líneas de producto T4"
            className="max-w-full md:max-w-2xl w-auto"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.title} to={product.href} className="group">
              <Card className="h-full transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 border-border/50"
                style={{ borderTopWidth: "3px", borderTopColor: product.color }}
              >
                <CardContent className="p-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
                    style={{ backgroundColor: product.color + "18" }}
                  >
                    <product.icon className="h-6 w-6" style={{ color: product.color }} />
                  </div>

                  <div
                    className="inline-block px-2 py-1 rounded-full text-xs font-medium mb-3 text-white"
                    style={{ backgroundColor: product.color }}
                  >
                    {product.highlight}
                  </div>

                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {product.description}
                  </p>

                  <div className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Conocer más <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
