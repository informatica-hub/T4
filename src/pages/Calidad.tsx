import { Shield, Award, CheckCircle, FileCheck, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NucleotideBackground } from "@/components/ui/NucleotideBackground";
import { Seo } from "@/components/seo/Seo";

const procesosPHVA = [
  {
    title: "Planear",
    description: "Establecer objetivos y procesos necesarios",
    icon: "P",
    color: "bg-blue-500",
  },
  {
    title: "Hacer",
    description: "Implementar los procesos planificados",
    icon: "H",
    color: "bg-green-500",
  },
  {
    title: "Verificar",
    description: "Monitorear y medir procesos y resultados",
    icon: "V",
    color: "bg-yellow-500",
  },
  {
    title: "Actuar",
    description: "Tomar acciones para mejorar continuamente",
    icon: "A",
    color: "bg-red-500",
  },
];

const Calidad = () => {
  return (
    <div className="min-h-screen">
      <Seo title="Calidad ISO 9001:2015 | T4 México" description="Procesos certificados ISO 9001:2015 para síntesis de oligonucleótidos, sondas qPCR y RNA en México. Control de calidad por lote." />
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-muted/40">
        <NucleotideBackground />
        <div className="container-width px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Shield className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Calidad y Certificaciones
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              En <strong className="text-primary">T4 OLIGO</strong> estamos comprometidos CONTIGO 
              y la importancia de tu trabajo, por lo que GARANTIZAMOS la más ALTA CALIDAD 
              en nuestros productos y servicios.
            </p>
          </div>
        </div>
      </section>

      {/* ISO Certification */}
      <section className="py-16 md:py-24">
        <div className="container-width px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Award className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">
                  Certificación ISO 9001:2015
                </h2>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Contamos con un <strong>SISTEMA de GESTIÓN de CALIDAD CERTIFICADO</strong> bajo 
                la norma <strong className="text-primary">ISO 9001:2015</strong> que respalda 
                nuestros procesos y su MEJORA CONTINUA enfocado en el ciclo PHVA.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Somos una empresa en constante búsqueda por la EXCELENCIA y contamos 
                además con los distintivos de calidad <strong>HECHO EN MÉXICO®</strong>.
              </p>
              <Link to="/certificado">
                <Button size="lg" className="gap-2">
                  <FileCheck className="h-5 w-5" />
                  Descarga tu Certificado
                </Button>
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <img 
                  src="https://t4oligo.com/wp-content/uploads/iso-logo.png" 
                  alt="ISO 9001:2015"
                  className="max-w-xs md:max-w-sm"
                />
                <div className="absolute -bottom-4 -right-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Certificados</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ciclo PHVA */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container-width px-4 md:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <RefreshCw className="h-8 w-8 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Ciclo de Mejora Continua PHVA
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nuestro sistema de gestión de calidad se basa en el ciclo Planear-Hacer-Verificar-Actuar
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {procesosPHVA.map((proceso, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow group">
                <CardContent className="p-0">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${proceso.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <span className="text-2xl font-bold text-white">{proceso.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{proceso.title}</h3>
                  <p className="text-muted-foreground text-sm">{proceso.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Procesos de Control */}
      <section className="py-16 md:py-24">
        <div className="container-width px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Control de Calidad
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cada oligonucleótido pasa por rigurosos controles de calidad
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 border-t-4 border-t-primary">
              <CardContent className="p-0">
                <CheckCircle className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Análisis HPLC</h3>
                <p className="text-muted-foreground">
                  Cromatografía líquida de alta resolución para verificar la pureza de cada síntesis.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 border-t-4 border-t-secondary">
              <CardContent className="p-0">
                <CheckCircle className="h-10 w-10 text-secondary mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Espectrometría de Masas</h3>
                <p className="text-muted-foreground">
                  Confirmación del peso molecular exacto de cada oligonucleótido.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 border-t-4 border-t-primary">
              <CardContent className="p-0">
                <CheckCircle className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Certificado de Análisis</h3>
                <p className="text-muted-foreground">
                  Documentación completa con todos los resultados de control de calidad.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Hecho en México */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container-width px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              🇲🇽 Hecho en México
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Con orgullo producimos en México oligonucleótidos de clase mundial, 
              con entrega en todo el país y Latinoamérica.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-6 py-3 bg-primary/10 rounded-full">
                <span className="text-primary font-medium">Garantía de Resíntesis</span>
              </div>
              <div className="px-6 py-3 bg-secondary/10 rounded-full">
                <span className="text-secondary font-medium">Soporte en Español</span>
              </div>
              <div className="px-6 py-3 bg-primary/10 rounded-full">
                <span className="text-primary font-medium">Precios en MXN</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Calidad;
