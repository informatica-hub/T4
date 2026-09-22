import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "Dra. María González",
    role: "Investigadora Principal",
    institution: "UNAM - Instituto de Biotecnología",
    quote: "T4 ha sido un socio fundamental para nuestro laboratorio. La calidad de sus oligonucleótidos y la rapidez en la entrega nos han permitido acelerar significativamente nuestros proyectos de investigación.",
    avatar: "MG",
  },
  {
    id: 2,
    name: "Dr. Carlos Ramírez",
    role: "Director de Laboratorio",
    institution: "CINVESTAV",
    quote: "El soporte científico que brinda T4 es excepcional. Nos ayudan a optimizar nuestros diseños y siempre responden de manera rápida y profesional a todas nuestras consultas técnicas.",
    avatar: "CR",
  },
  {
    id: 3,
    name: "Dra. Ana Martínez",
    role: "Líder de Proyecto",
    institution: "Instituto Nacional de Medicina Genómica",
    quote: "Trabajar con T4 nos ha permitido eliminar las complicaciones de importación. Sus precios en pesos mexicanos y la entrega local han simplificado enormemente nuestra logística.",
    avatar: "AM",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="section-padding bg-primary/5">
      <div className="container-width">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Lo que dicen nuestros <span className="text-primary">científicos</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Investigadores de las instituciones más prestigiosas de México y América Latina 
            confían en T4 para sus proyectos más importantes.
          </p>
        </div>

        {/* Desktop: Show all 3 cards */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full bg-card border-border/50">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-secondary mb-4" />
                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.institution}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mobile: Carousel */}
        <div className="lg:hidden">
          <Card className="bg-card border-border/50">
            <CardContent className="p-6">
              <Quote className="h-8 w-8 text-secondary mb-4" />
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonials[currentIndex].quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  {testimonials[currentIndex].avatar}
                </div>
                <div>
                  <div className="font-semibold">{testimonials[currentIndex].name}</div>
                  <div className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</div>
                  <div className="text-xs text-muted-foreground">{testimonials[currentIndex].institution}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button variant="outline" size="icon" onClick={prevTestimonial}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={nextTestimonial}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
