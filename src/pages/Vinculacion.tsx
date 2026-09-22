import { Handshake, GraduationCap, Building, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { NucleotideBackground } from "@/components/ui/NucleotideBackground";
import { Seo } from "@/components/seo/Seo";

const instituciones = [
  {
    nombre: "CIATEJ A.C.",
    ubicacion: "Guadalajara, Jalisco",
    tipo: "Centro de Investigación",
  },
  {
    nombre: "CINVESTAV Unidad Irapuato",
    ubicacion: "Irapuato, Guanajuato",
    tipo: "Centro de Investigación",
  },
  {
    nombre: "CINVESTAV Unidad Zacatenco",
    ubicacion: "Ciudad de México",
    tipo: "Centro de Investigación",
  },
  {
    nombre: "Universidad de Stanford",
    ubicacion: "California, USA",
    tipo: "Universidad Internacional",
  },
  {
    nombre: "Instituto Karolinska",
    ubicacion: "Suecia",
    tipo: "Instituto de Investigación",
  },
];

const Vinculacion = () => {
  return (
    <div className="min-h-screen">
      <Seo title="Vinculación científica y académica | T4 México" description="Colaboramos con universidades, centros de investigación y empresas en México para impulsar proyectos de biología molecular." />
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-muted/40">
        <NucleotideBackground />
        <div className="container-width px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Handshake className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Vinculación Con Empresa y Academia
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Nuestro constante desarrollo e innovación ha permitido establecer vinculación 
              científica y tecnológica con instituciones nacionales e internacionales de prestigio.
            </p>
          </div>
        </div>
      </section>

      {/* Instituciones */}
      <section className="py-16 md:py-24">
        <div className="container-width px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nuestros Aliados Estratégicos
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Colaboramos con las instituciones más prestigiosas en investigación científica
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {instituciones.map((inst, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                      {inst.tipo.includes("Universidad") ? (
                        <GraduationCap className="h-6 w-6 text-primary" />
                      ) : inst.ubicacion.includes("USA") || inst.ubicacion.includes("Suecia") ? (
                        <Globe className="h-6 w-6 text-primary" />
                      ) : (
                        <Building className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1">{inst.nombre}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{inst.ubicacion}</p>
                      <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs rounded-full">
                        {inst.tipo}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Imagen instituciones */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container-width px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Colaboración Científica de Alto Nivel
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                A través de la red de parques NOVAERA, hemos generado convenios de 
                colaboración que han resultado en más de 12 fondos públicos y privados 
                para el desarrollo de sistemas diagnósticos basados en ADN.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  Desarrollo de nuevas tecnologías de diagnóstico
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  Transferencia tecnológica academia-empresa
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  Proyectos de investigación conjuntos
                </li>
                <li className="flex items-center gap-3 text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  Formación de recursos humanos especializados
                </li>
              </ul>
            </div>
            <div>
              <img 
                src="https://t4oligo.com/wp-content/uploads/2018/11/Captura-de-pantalla-40.png" 
                alt="Instituciones aliadas"
                className="rounded-2xl shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Logros */}
      <section className="py-16 md:py-24">
        <div className="container-width px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8">
              <div className="text-5xl font-bold text-primary mb-2">12+</div>
              <p className="text-lg text-muted-foreground">Fondos públicos y privados obtenidos</p>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold text-secondary mb-2">5</div>
              <p className="text-lg text-muted-foreground">Instituciones de investigación aliadas</p>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold text-primary mb-2">2</div>
              <p className="text-lg text-muted-foreground">Países con colaboraciones internacionales</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Vinculacion;
