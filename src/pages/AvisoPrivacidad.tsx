import { Seo } from "@/components/seo/Seo";
const H = ({ children }: { children: React.ReactNode }) => (
  <mark className="bg-yellow-300 text-inherit px-1 rounded">{children}</mark>
);

export default function AvisoPrivacidad() {
  return (
    <div className="container-width section-padding">
      <Seo title="Aviso de privacidad | T4 México" description="Aviso de privacidad y manejo de datos personales de T4 conforme a la legislación mexicana." />
      <div className="max-w-4xl mx-auto prose prose-sm sm:prose lg:prose-lg text-foreground">
        <h1 className="text-primary">Aviso de Privacidad Integral</h1>
        <p className="text-muted-foreground text-sm">
          Última actualización: <H>DD de mes de AAAA</H>
        </p>

        <p>
          En cumplimiento con lo dispuesto por la Ley Federal de Protección de Datos Personales en
          Posesión de los Particulares (LFPDPPP), su Reglamento y los Lineamientos del Aviso de
          Privacidad publicados en el Diario Oficial de la Federación, <H>Nombre o Razón Social de la
          Empresa, S.A. de C.V.</H> (en lo sucesivo "<strong>T4</strong>"), con domicilio en{" "}
          <H>Calle, Número, Colonia, Alcaldía/Municipio, C.P., Ciudad, Estado, México</H>, es
          responsable del tratamiento de sus datos personales y pone a su disposición el presente
          Aviso de Privacidad.
        </p>

        <h2>I. Identidad y domicilio del Responsable</h2>
        <p>
          <strong>Responsable:</strong> <H>Nombre o Razón Social de la Empresa, S.A. de C.V.</H>
          <br />
          <strong>RFC:</strong> <H>XXX-XXXXXX-XXX</H>
          <br />
          <strong>Domicilio:</strong>{" "}
          <H>Calle, Número, Colonia, Alcaldía/Municipio, C.P., Ciudad, Estado, México</H>
          <br />
          <strong>Teléfono:</strong> <H>+52 (XX) XXXX XXXX</H>
          <br />
          <strong>Correo electrónico para asuntos de privacidad:</strong>{" "}
          <H>privacidad@t4oligo.com</H>
          <br />
          <strong>Representante legal:</strong> <H>Nombre completo del representante legal</H>
        </p>

        <h2>II. Datos personales que se recaban</h2>
        <p>T4 podrá recabar los siguientes datos personales:</p>
        <ul>
          <li>
            <strong>Datos de identificación:</strong> nombre completo, fecha de nacimiento,
            nacionalidad, CURP, RFC.
          </li>
          <li>
            <strong>Datos de contacto:</strong> domicilio, correo electrónico, número telefónico
            fijo y/o celular.
          </li>
          <li>
            <strong>Datos laborales y académicos:</strong> institución, cargo, área de
            investigación.
          </li>
          <li>
            <strong>Datos fiscales:</strong> RFC, régimen fiscal, domicilio fiscal, constancia de
            situación fiscal (para facturación).
          </li>
          <li>
            <strong>Datos de navegación:</strong> dirección IP, tipo de navegador, páginas
            visitadas, cookies y tecnologías de rastreo.
          </li>
        </ul>

        <h2>III. Datos personales sensibles</h2>
        <p>
          T4 <strong>no recaba datos personales sensibles</strong>. En caso de que en el
          futuro fuera necesario, se solicitará su consentimiento expreso y por escrito.
        </p>

        <h2>IV. Finalidades del tratamiento</h2>
        <h3>Finalidades primarias (necesarias):</h3>
        <ol>
          <li>Proveer los productos y servicios de síntesis de oligonucleótidos solicitados.</li>
          <li>Procesar cotizaciones, pedidos, facturación y cobranza.</li>
          <li>Dar seguimiento a solicitudes de soporte técnico y científico.</li>
          <li>Emisión de certificados de calidad y análisis.</li>
          <li>Cumplir con obligaciones legales, fiscales y regulatorias.</li>
          <li>Gestionar su cuenta de usuario en nuestra plataforma.</li>
        </ol>
        <h3>Finalidades secundarias (no necesarias):</h3>
        <ol>
          <li>Enviar comunicaciones comerciales, promociones y boletines científicos.</li>
          <li>Realizar encuestas de satisfacción y estudios de mercado.</li>
          <li>Invitarle a eventos, webinars y actividades de vinculación científica.</li>
        </ol>
        <p>
          Si usted no desea que sus datos personales sean tratados para las finalidades secundarias,
          puede comunicarlo al correo <H>privacidad@t4oligo.com</H>.
        </p>

        <h2>V. Transferencia de datos personales</h2>
        <p>
          T4 podrá transferir sus datos personales a terceros nacionales o extranjeros en los
          siguientes supuestos, sin requerir su consentimiento conforme al artículo 37 de la
          LFPDPPP:
        </p>
        <ul>
          <li>A autoridades competentes cuando sea requerido por ley.</li>
          <li>A empresas de paquetería y mensajería para la entrega de productos.</li>
          <li>A instituciones financieras para el procesamiento de pagos.</li>
        </ul>

        <h2>VI. Mecanismos y medios para ejercer los derechos ARCO</h2>
        <p>
          Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse (derechos ARCO) al
          tratamiento de sus datos personales. Para ejercer cualquiera de estos derechos, deberá
          presentar una solicitud por escrito dirigida a:
        </p>
        <p>
          <strong>Departamento de Protección de Datos Personales</strong>
          <br />
          Correo: <H>privacidad@t4oligo.com</H>
          <br />
          Domicilio: <H>Calle, Número, Colonia, Alcaldía/Municipio, C.P., Ciudad, Estado, México</H>
        </p>
        <p>La solicitud deberá contener:</p>
        <ol>
          <li>Nombre completo del titular y medio para comunicar la respuesta.</li>
          <li>Documentos que acrediten su identidad (copia de identificación oficial vigente).</li>
          <li>Descripción clara y precisa de los datos personales respecto de los cuales busca ejercer alguno de los derechos ARCO.</li>
          <li>Cualquier otro elemento o documento que facilite la localización de los datos.</li>
        </ol>
        <p>
          T4 responderá a su solicitud en un plazo máximo de 20 días hábiles contados a
          partir de la fecha de recepción.
        </p>

        <h2>VII. Revocación del consentimiento</h2>
        <p>
          Usted puede revocar su consentimiento para el tratamiento de sus datos personales
          enviando una solicitud al correo <H>privacidad@t4oligo.com</H> con el asunto
          "Revocación de consentimiento".
        </p>

        <h2>VIII. Uso de cookies y tecnologías de rastreo</h2>
        <p>
          Nuestro sitio web utiliza cookies y tecnologías similares para mejorar su experiencia de
          navegación, analizar el tráfico del sitio y personalizar el contenido. Usted puede
          deshabilitar el uso de cookies a través de la configuración de su navegador.
        </p>

        <h2>IX. Limitación de uso y divulgación</h2>
        <p>
          Si desea limitar el uso o divulgación de sus datos personales, podrá enviar su solicitud
          al correo <H>privacidad@t4oligo.com</H> o inscribirse en el Registro Público para Evitar
          Publicidad (REPEP) de la PROFECO.
        </p>

        <h2>X. Modificaciones al Aviso de Privacidad</h2>
        <p>
          T4 se reserva el derecho de efectuar modificaciones al presente Aviso de
          Privacidad. Cualquier cambio será notificado a través de nuestro sitio web{" "}
          <H>www.t4oligo.com</H>.
        </p>

        <h2>XI. Autoridad</h2>
        <p>
          Si usted considera que su derecho a la protección de datos personales ha sido vulnerado,
          tiene derecho a acudir al Instituto Nacional de Transparencia, Acceso a la Información y
          Protección de Datos Personales (INAI).{" "}
          <a href="https://home.inai.org.mx" target="_blank" rel="noopener noreferrer" className="text-primary underline">
            www.inai.org.mx
          </a>
        </p>

        <h2>XII. Consentimiento</h2>
        <p>
          Al proporcionar sus datos personales a T4, ya sea de manera directa, personal o a
          través de nuestro sitio web, usted manifiesta su consentimiento para que sean tratados
          conforme a los términos del presente Aviso de Privacidad.
        </p>
      </div>
    </div>
  );
}
