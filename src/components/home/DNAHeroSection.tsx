import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logotipo-t4.png";

export function DNAHeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-background">
      <iframe
        src="/dna-demo.html"
        className="absolute inset-0 w-full h-full border-0"
        title="DNA Animation"
        loading="eager"
      />

      <div className="relative z-10 container-width px-4 md:px-8 py-20 pointer-events-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
          <div className="hidden md:block" />

          <div className="text-center md:text-left pointer-events-auto">
            <div className="mb-6 animate-fade-in">
              <img src={logo} alt="T4" className="h-32 md:h-40 w-auto mx-auto md:mx-0" />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm mb-6 animate-fade-in bg-primary/10 border border-primary/20">
              <span className="w-2 h-2 rounded-full animate-pulse-soft bg-secondary" />
              <span className="text-sm font-medium text-primary">15° Aniversario</span>
            </div>

            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight animate-fade-in mb-6"
              style={{ color: "#799458", animationDelay: "0.1s" }}
            >
              Soluciones en <span className="text-primary">biología molecular</span> desarrolladas por{" "}
              <span className="text-primary">científicos, para cientificos.</span>
            </h1>
            <p
              className="text-lg md:text-xl font-medium animate-fade-in mb-6 text-primary/90"
              style={{ animationDelay: "0.15s" }}
            >
              Accede a nuestra gama completa de oligonucleótidos, sondas StarQ™, enzimas GIGAscript™, kits Sentinel™ y servicios especializados.
            </p>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight animate-fade-in mb-3"
              style={{ color: "#799458", animationDelay: "0.2s" }}
            >
              Somos una empresa de <span className="text-primary">clase mundial</span> con corazón de{" "}
              <span className="text-primary">startup</span>
            </h2>
            <p
              className="text-lg md:text-xl mb-10 animate-fade-in text-primary/80"
              style={{ animationDelay: "0.25s" }}
            >
              La primera y más completa plataforma 360° en Biología Molecular, hecha en México. En T4 encontrará todo lo que necesita para hacer Biología Molecular de frontera: oligonucleótidos y primers de síntesis rápida, sondas de hidrólisis, genes y controles sintéticos, enzimas de alto desempeño, ARN, reactivos esenciales, sistemas de extracción y purificación, kits de detección molecular y mucho mas— todo desarrollado en México, certificado internacionalmente y respaldado por un equipo de científicos listos para asesorarlo como colegas.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center md:justify-start justify-center gap-4 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <Link to="/carrito">
                <Button size="lg" className="font-semibold px-8 bg-accent text-accent-foreground hover:bg-accent/90">
                  Arma tu Proyecto
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/productos">
                <Button size="lg" className="font-semibold px-8 bg-primary text-primary-foreground hover:bg-primary/90">
                  Explora el catálogo completo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <div className="w-6 h-10 rounded-full flex items-start justify-center p-1 border-2 border-primary/30">
          <div className="w-1 h-2 rounded-full animate-pulse bg-primary/50" />
        </div>
      </div>
    </section>
  );
}
