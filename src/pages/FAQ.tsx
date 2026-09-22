import { HelpCircle, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { NucleotideBackground } from "@/components/ui/NucleotideBackground";
import { Seo } from "@/components/seo/Seo";
import { faqLd } from "@/components/seo/structuredData";

const faqs = [
  {
    question: "¿Cómo debo resuspender mis oligos?",
    answer: `**Solventes recomendados:**
Los oligos pueden ser resuspendidos en agua estéril libre de nucleasas o preferentemente en buffer TE (10 mM Tri-HCl, 0.1 mM EDTA, pH 8.0) si se requiere guardar la solución de oligo por largos periodos de tiempo.

**Concentración:**
Para preparar una solución Stock a una concentración de 100µM: multiplica por 10 el número total de nanomoles entregado (lo encontrarás en la etiqueta y certificado de análisis de tu oligo/sonda). El número resultante será el volumen en microlitros de solvente a utilizar para resuspenderlo.

**Ejemplo:**
Rendimiento final: 23.2 nanomoles
Volumen de solvente necesario para preparar solución Stock: (23.2)X(10)= 232 µl

**Resuspensión:**
1. Centrífuga brevemente tus viales para asegurar que el pellet del oligo se vaya al fondo.
2. Utiliza el solvente o solución recomendados.
3. Permite que el oligo se hidrate por varios minutos a temperatura ambiente, después, vortexea.`,
  },
  {
    question: "¿Cómo debo almacenar mis oligos?",
    answer: `Los oligos liofilizados pueden guardarse a -20°C o a temperatura ambiente y son estables por largos periodos de tiempo antes de ser manipulados por primera vez. 

Es importante resuspender los oligos en buffer TE o agua libre de nucleasas para garantizar la integridad física y evitar la degradación. 

Los oligos resuspendidos deben ser alicuotados y almacenados a 4°C o a -20°C. Evita procesos de congelar y descongelar la solución de oligos para prevenir degradación. 

Cuando se trata de sondas, protegerlos de la luz es indispensable para evitar fotoblanqueo (photobleaching).`,
  },
  {
    question: "¿Es lo mismo escala que rendimiento?",
    answer: `A menudo hay confusión en torno a los significados de "escala de síntesis" y "rendimiento de síntesis". 

**Escala:** Se refiere a la cantidad de material inicial utilizado para sintetizar el oligonucleótido.

**Rendimiento:** Se refiere a la cantidad de oligo recuperado después de todas las etapas de síntesis y purificación.

Ninguna reacción química ni proceso físico es 100% eficiente, así que la cantidad entregable final del oligonucleótido nunca es igual a la cantidad de partida para la síntesis. 

Factores como el tamaño del oligo, modificaciones, eficiencia de acoplamiento, composición nucleotídica, y procesos de purificación adicionales afectan aún más la cantidad de producto final (rendimiento).`,
  },
  {
    question: "¿En qué casos es aceptable usar oligos desalados estándar?",
    answer: `T4 recomienda utilizar oligos desalados estándar en:
- Amplificaciones rutinarias por PCR
- qPCR
- Procesos de secuenciación de ADN

Sin embargo, si sus oligos son mayores de 40 bases en longitud, nosotros le recomendamos realizar una purificación adicional con el propósito de mejorar significativamente la eficiencia de sus oligos.`,
  },
  {
    question: "¿Por qué debo considerar purificar mis oligos?",
    answer: `T4 recomienda purificar cualquier oligo que sea utilizado para aplicaciones sensibles como PCR tiempo real o secuenciación de ADN, ya que como resultado del proceso de purificación se remueven oligos incompletos que se generan normalmente durante el proceso de síntesis.

Un proceso de purificación mejora significativamente la eficiencia de los oligos, sobre todo respecto a la especificidad de reconocimiento de su secuencia blanco.`,
  },
  {
    question: "¿Puedo purificar mi oligo sintetizado a una escala de 25 nanomoles?",
    answer: `No, debido a la pérdida de rendimiento durante la purificación, las escalas mínimas permitidas son:

- **Cartucho:** 50 nanomoles mínimo
- **PAGE o HPLC:** 100 nanomoles mínimo`,
  },
  {
    question: "¿En qué casos se recomienda purificación por cartucho vs HPLC?",
    answer: `**Purificación por Cartucho:**
- Oligos cortos y largos que no posean modificaciones
- Oligos degenerados de corta longitud (de 10 a 65 bases)
- Utilizados para clonación, retardos y mutagénesis

**Purificación por HPLC:**
- Oligos marcados fluorescentemente (debido a su hidrofobicidad)
- Ayuda a remover subproductos de la síntesis
- Ofrecemos purificaciones HPLC en fase reversa (RP-HPLC) para oligos con marcas fluorescentes y/o modificaciones hidrofóbicas

Si tiene alguna duda, contáctenos en soporte@t4oligo.com`,
  },
  {
    question: "¿Cuál es el porcentaje de pureza que se obtiene en cada proceso de purificación?",
    answer: `- **HPLC:** Garantiza una pureza del 85%
- **PAGE (electroforesis):** Garantiza el 90%
- **Cartucho:** Garantiza aproximadamente el 90%`,
  },
  {
    question: "¿Puedo purificar un oligo que contiene bases degeneradas?",
    answer: `Un oligo degenerado es una colección de primers que varían en una o varias bases llamadas degeneradas. Por ejemplo, un oligo con una degeneración "N" significa que en esa posición puede haber cualquiera de los 4 nucleótidos (ATGC), idealmente en una proporción de 25% cada uno.

La decisión de purificar un oligo degenerado depende de las necesidades de su investigación:
- Un proceso de purificación eliminará subproductos pero también modificará el radio equimolar de los oligos
- Se justifica más en oligos muy largos o modificados cerca del extremo 3´
- Fuera de estos casos, podría ser un gasto innecesario

Si tiene dudas, contáctenos en ventas@t4oligo.com para asesoría personalizada.`,
  },
  {
    question: "¿Sus sondas son mayores a 30 o menores a 20 bases?",
    answer: `**Sondas mayores a 30 bases:**
Probablemente no tendrán tanta eficiencia en el «quenching». Para tales casos sugerimos considere colocar el «quencher» internamente.

**Sondas menores a 20 bases:**
Si utiliza secuencias previamente reportadas y son menores a 20 bases, podrían estar diseñados como sondas Minor Groove Binder y probablemente no podrán adherirse a la temperatura adecuada de 70°C.

T4 cuenta con alternativas privadas y accesibles con resultados similares o superiores a las sondas MGB™.`,
  },
  {
    question: "¿Qué aditivos puedo usar para mejorar la amplificación en mis reacciones de PCR?",
    answer: `Varios aditivos pueden mejorar el rendimiento, especificidad y consistencia del PCR:

- **DMSO (2-10%):** Reduce estructura secundaria, útil para plantillas ricas en GC
- **Betaína (1.0-1.7 M):** Monohidrato de betaína
- **Formamida (1-5%):** Sin efecto en Taq polimerasa hasta 10%
- **Detergentes no iónicos (0.1-1%):** Triton X-100, Tween 20 o NP-40 estabilizan Taq
- **TMAC (15-100 mM):** Elimina cebador no específico
- **7-deaza-2'desoxiguanosina:** Para plantillas con estructuras secundarias estables
- **BSA:** Útil para ADN antiguo o plantillas con inhibidores de PCR

El efecto de estos aditivos debe probarse empíricamente para cada combinación de molde y cebadores.`,
  },
];

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Seo title="Preguntas frecuentes sobre oligos y sondas | T4 México" description="Resolvemos dudas sobre resuspensión, almacenamiento, escalas, purificación y entrega de oligonucleótidos y sondas qPCR en México." jsonLd={faqLd(faqs.map((f) => ({ q: f.question, a: f.answer })))} />
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-muted/40">
        <NucleotideBackground />
        <div className="container-width px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <HelpCircle className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Preguntas Frecuentes
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Encuentra respuestas a las preguntas más comunes sobre nuestros productos y servicios
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar preguntas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 md:py-24">
        <div className="container-width px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground">
                  No se encontraron resultados para "{searchTerm}"
                </p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border rounded-xl px-6 bg-card"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-6">
                      <span className="text-lg font-medium text-foreground pr-4">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container-width px-4 md:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              ¿No encontraste lo que buscabas?
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Nuestro equipo de soporte científico está listo para ayudarte
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:soporte@t4oligo.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                soporte@t4oligo.com
              </a>
              <a
                href="https://wa.me/4623073642"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#25D366] text-white rounded-lg font-medium hover:bg-[#25D366]/90 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
