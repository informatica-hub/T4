import { Shield, FileText } from "lucide-react";
import { Seo } from "@/components/seo/Seo";

const Aviso = () => {
  return (
    <div className="min-h-screen">
      <Seo title="Aviso legal | T4 México" description="Aviso legal de T4, empresa mexicana de síntesis de oligonucleótidos y sondas qPCR." noindex />
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container-width px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Shield className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Aviso de Privacidad
            </h1>
            <p className="text-xl text-muted-foreground">
              Tu privacidad es importante para nosotros
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container-width px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <div className="flex items-center gap-3 mb-8">
                <FileText className="h-8 w-8 text-primary shrink-0" />
                <h2 className="text-2xl font-bold text-foreground m-0">
                  ADN SINTÉTICO S.A.P.I. de C.V.
                </h2>
              </div>

              <div className="bg-muted/30 p-6 rounded-xl mb-8">
                <p className="text-muted-foreground m-0">
                  <strong>Domicilio:</strong> Ecuador #220 Fracc. Tabachines, C.P. 36615 Irapuato, Guanajuato, México
                </p>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6">
                ADN SINTÉTICO S.A.P.I. de C.V, con domicilio en Ecuador #220 Fracc. Tabachines, 
                C.P. 36615 Irapuato, Guanajuato, México, es responsable de recabar sus datos 
                personales, del uso que se le dé a los mismos y de su protección.
              </p>

              <h3 className="text-xl font-bold text-foreground mt-8 mb-4">
                Uso de su Información Personal
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Su información personal será utilizada para:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Proveer los servicios y productos que ha solicitado</li>
                <li>Informarle sobre nuevos productos, servicios o sobre cambios en los mismos</li>
                <li>Evaluar la calidad del servicio que le brindamos</li>
              </ul>

              <h3 className="text-xl font-bold text-foreground mt-8 mb-4">
                Datos Personales que Recabamos
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Para las finalidades antes mencionadas, requerimos obtener los siguientes datos personales:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Nombre</li>
                <li>Institución en la que labora</li>
                <li>Dirección</li>
                <li>Correo electrónico</li>
                <li>Teléfono</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Los cuales podemos recabarlos de distintas formas: cuando usted nos los proporciona 
                directamente; cuando visita nuestro sitio de Internet o utiliza nuestros servicios en línea.
              </p>

              <h3 className="text-xl font-bold text-foreground mt-8 mb-4">
                Transferencia de Datos
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Asimismo, le informamos que nosotros <strong>no realizamos transferencias</strong> de 
                sus datos personales a terceros.
              </p>

              <h3 className="text-xl font-bold text-foreground mt-8 mb-4">
                Sus Derechos ARCO
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Usted tiene derecho de:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li><strong>Acceder</strong> a sus datos personales</li>
                <li><strong>Rectificar</strong> sus datos personales cuando sean inexactos o incompletos</li>
                <li><strong>Cancelar</strong> sus datos personales</li>
                <li><strong>Oponerse</strong> al tratamiento de los mismos</li>
                <li><strong>Revocar</strong> el consentimiento que para tal fin nos haya otorgado</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A través de los procedimientos que hemos implementado. Para conocer dichos 
                procedimientos, los requisitos y plazos, se puede poner en contacto con nosotros.
              </p>

              <h3 className="text-xl font-bold text-foreground mt-8 mb-4">
                Contacto
              </h3>
              <div className="bg-primary/5 p-6 rounded-xl mb-8">
                <p className="text-muted-foreground m-0">
                  Para ejercer sus derechos ARCO o cualquier duda sobre este aviso de privacidad, 
                  puede contactarnos a través de:
                </p>
                <ul className="list-none mt-4 space-y-2 text-muted-foreground">
                  <li>
                    <strong>Página web:</strong>{" "}
                    <a href="/contacto" className="text-primary hover:underline">
                      www.t4oligo.com/contacto
                    </a>
                  </li>
                  <li>
                    <strong>Teléfono:</strong> (462) 624 03 64
                  </li>
                </ul>
              </div>

              <h3 className="text-xl font-bold text-foreground mt-8 mb-4">
                Modificaciones al Aviso de Privacidad
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Nos reservamos el derecho de efectuar en cualquier momento modificaciones o 
                actualizaciones al presente aviso de privacidad, para la atención de novedades 
                legislativas o jurisprudenciales, políticas internas, nuevos requerimientos para 
                la prestación u ofrecimiento de nuestros servicios o productos y prácticas del mercado.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Aviso;
