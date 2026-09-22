import { MapPin, Mail, Phone, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { NucleotideBackground } from "@/components/ui/NucleotideBackground";
import { Seo } from "@/components/seo/Seo";

const Contacto = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    institucion: "",
    telefono: "",
    mensaje: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase.functions.invoke("send-project-notification", {
        body: {
          type: "contacto",
          nombre: formData.nombre,
          email: formData.email,
          institucion: formData.institucion || null,
          telefono: formData.telefono || null,
          mensaje: formData.mensaje,
        },
      });
      if (error) throw error;

      toast({
        title: "Mensaje enviado",
        description: "Nos pondremos en contacto contigo pronto.",
      });

      setFormData({ nombre: "", email: "", institucion: "", telefono: "", mensaje: "" });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error al enviar",
        description: "No pudimos enviar tu mensaje. Inténtalo más tarde o escríbenos directamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Seo title="Contacto | T4 México — Oligos, sondas y secuenciación" description="Contáctanos para cotización, soporte técnico o asesoría científica en síntesis de oligonucleótidos y sondas qPCR en México." />
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-muted/40">
        <NucleotideBackground />
        <div className="container-width px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Contacto
            </h1>
            <p className="text-xl text-muted-foreground">
              Estamos aquí para ayudarte con todas tus necesidades de síntesis de oligonucleótidos
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-16 md:py-24">
        <div className="container-width px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">
                Información de Contacto
              </h2>

              <div className="space-y-6">
                <Card className="p-6">
                  <CardContent className="p-0 flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Ubicación</h3>
                      <p className="text-muted-foreground">
                        Euquerio Guerrero #278 Fracc. Tabachines<br />
                        C.P 36615 Irapuato, Guanajuato, México
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardContent className="p-0 flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <a 
                        href="mailto:ventas@t4oligo.com" 
                        className="text-primary hover:underline"
                      >
                        ventas@t4mexico.com
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardContent className="p-0 flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Teléfono</h3>
                      <p className="text-muted-foreground">(462) 624 03 64</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6 bg-[#25D366]/10 border-[#25D366]/30">
                  <CardContent className="p-0 flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-[#25D366]/20 shrink-0">
                      <MessageCircle className="h-6 w-6 text-[#25D366]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">WhatsApp</h3>
                      <a 
                        href="https://wa.me/524623073642" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#25D366] hover:underline"
                      >
                        (462) 307 36 42
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">
                        Respuesta inmediata en horario laboral
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Important Notes */}
              <div className="mt-8 p-6 bg-muted/50 rounded-xl">
                <h3 className="font-semibold text-foreground mb-3">Avisos Importantes</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Para oligos con RNA, favor de contactar con ventas@t4oligo.com</li>
                  <li>• Oligos con más de 5 bases degeneradas requieren mínimo 50 nanomoles</li>
                  <li>• Oligos mayores a 40 bases requieren purificación adicional</li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">
                Envíanos un Mensaje
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-foreground mb-2">
                      Nombre *
                    </label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="institucion" className="block text-sm font-medium text-foreground mb-2">
                      Institución
                    </label>
                    <Input
                      id="institucion"
                      name="institucion"
                      value={formData.institucion}
                      onChange={handleChange}
                      placeholder="Universidad o empresa"
                    />
                  </div>
                  <div>
                    <label htmlFor="telefono" className="block text-sm font-medium text-foreground mb-2">
                      Teléfono
                    </label>
                    <Input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="(123) 456 7890"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="mensaje" className="block text-sm font-medium text-foreground mb-2">
                    Mensaje *
                  </label>
                  <Textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    placeholder="¿En qué podemos ayudarte?"
                    rows={6}
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Enviar Mensaje
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="py-8">
        <div className="container-width px-4 md:px-8">
          <div className="rounded-2xl overflow-hidden shadow-lg h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.7562831936!2d-101.35!3d20.68!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDQwJzQ4LjAiTiAxMDHCsDIxJzAwLjAiVw!5e0!3m2!1ses!2smx!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación T4"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contacto;
