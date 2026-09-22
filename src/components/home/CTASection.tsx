import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="section-padding bg-primary text-primary-foreground relative overflow-hidden">
      <div className="container-width relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">¿Listo para impulsar tu investigación?</h2>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-10">
            Nuestro equipo de científicos está listo para ayudarte a encontrar la mejor solución para tu proyecto.
            Contáctanos hoy mismo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://wa.me/524623073642" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="bg-[#25D366] hover:bg-[#25D366]/90 text-white font-semibold px-8 w-full sm:w-auto"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Escríbenos por WhatsApp
              </Button>
            </a>
            <Link to="/contacto">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 text-green-900 hover:bg-primary-foreground/10 font-semibold px-8 w-full sm:w-auto"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Agendar una Llamada
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 pt-8 border-t border-primary-foreground/20">
            <div className="flex items-center gap-2 text-sm">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Respuesta en menos de 2 hrs
            </div>
            <div className="flex items-center gap-2 text-sm">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Asesoria cientifica a todos nuestros usuarios
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
