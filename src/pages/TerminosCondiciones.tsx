/*import { Seo } from "@/components/seo/Seo";
const H = ({ children }: { children: React.ReactNode }) => (
  <mark className="bg-yellow-300 text-inherit px-1 rounded">{children}</mark>
);

 export default function TerminosCondiciones() {
  return (
    <div className="container-width section-padding">
      <Seo title="Términos y condiciones | T4 México" description="Términos y condiciones de uso del portal y servicios de T4 México." />
      <div className="max-w-4xl mx-auto prose prose-sm sm:prose lg:prose-lg text-foreground">
        <h1 className="text-primary">Términos y Condiciones de Uso</h1>
        <p className="text-muted-foreground text-sm">
          Última actualización: <H>DD de mes de AAAA</H>
        </p>

        <p>
          Los presentes Términos y Condiciones regulan el acceso y uso del sitio web{" "}
          <H>www.t4oligo.com</H> (en adelante, el "Sitio"), operado por{" "}
          <H>Nombre o Razón Social de la Empresa, S.A. de C.V.</H> (en adelante, "T4"), con
          domicilio en <H>Calle, Número, Colonia, Alcaldía/Municipio, C.P., Ciudad, Estado,
          México</H>, en cumplimiento con la legislación vigente de los Estados Unidos Mexicanos,
          incluyendo la Ley Federal de Protección al Consumidor, el Código de Comercio y la NOM-151-SCFI-2002.
        </p>

        <h2>1. Aceptación de los Términos</h2>
        <p>
          Al acceder y utilizar el Sitio, usted acepta de manera expresa quedar vinculado por los
          presentes Términos y Condiciones. Si no está de acuerdo con alguno de ellos, deberá
          abstenerse de utilizar el Sitio y sus servicios.
        </p>

        <h2>2. Descripción de los Servicios</h2>
        <p>
          T4 ofrece a través del Sitio los siguientes servicios:
        </p>
        <ul>
          <li>Síntesis de oligonucleótidos personalizados.</li>
          <li>Venta de reactivos y productos para investigación científica.</li>
          <li>Servicios de soporte técnico y asesoría científica.</li>
          <li>Generación de cotizaciones y procesamiento de pedidos.</li>
          <li>Emisión de certificados de calidad y análisis.</li>
        </ul>

        <h2>3. Registro de Usuario</h2>
        <p>
          Para acceder a determinados servicios, el usuario deberá crear una cuenta proporcionando
          información veraz, completa y actualizada. El usuario es responsable de mantener la
          confidencialidad de sus credenciales de acceso y de todas las actividades que se realicen
          bajo su cuenta.
        </p>

        <h2>4. Proceso de Compra y Cotización</h2>
        <ol>
          <li>
            <strong>Cotización:</strong> El usuario podrá solicitar cotizaciones a través del Sitio.
            Las cotizaciones tendrán una vigencia de <H>XX días naturales</H>.
          </li>
          <li>
            <strong>Confirmación:</strong> La compra se formaliza una vez que T4 confirme la
            disponibilidad del producto y el pago haya sido verificado.
          </li>
          <li>
            <strong>Precios:</strong> Los precios publicados están expresados en{" "}
            <H>pesos mexicanos / dólares americanos</H> y <H>incluyen / no incluyen</H> IVA, salvo
            que se indique lo contrario.
          </li>
          <li>
            <strong>Facturación:</strong> T4 emitirá comprobantes fiscales digitales por
            internet (CFDI) conforme a las disposiciones fiscales vigentes.
          </li>
        </ol>

        <h2>5. Formas de Pago</h2>
        <p>T4 acepta las siguientes formas de pago:</p>
        <ul>
          <li>Transferencia bancaria o depósito.</li>
          <li>Pago con tarjeta de crédito o débito (cuando aplique).</li>
          <li>Órdenes de compra institucionales (sujetas a aprobación crediticia).</li>
        </ul>
        <p>
          <strong>Datos bancarios:</strong>
          <br />
          Banco: <H>Nombre del Banco</H>
          <br />
          Titular: <H>Nombre o Razón Social</H>
          <br />
          CLABE: <H>XXXXXXXXXXXXXXXXXXXX</H>
          <br />
          Cuenta: <H>XXXXXXXXXX</H>
        </p>

        <h2>6. Envío y Entrega</h2>
        <p>
          Los tiempos de entrega varían según el tipo de producto y servicio solicitado. T4
          hará su mejor esfuerzo para cumplir con los tiempos estimados, sin embargo, no se
          responsabiliza por retrasos causados por el servicio de paquetería, aduanas o causas de
          fuerza mayor.
        </p>
        <ul>
          <li>
            <strong>Oligonucleótidos estándar:</strong> <H>X a X días hábiles</H> a partir de la
            confirmación de pago.
          </li>
          <li>
            <strong>Productos especializados:</strong> según disponibilidad y especificaciones.
          </li>
        </ul>

        <h2>7. Política de Cancelaciones y Devoluciones</h2>
        <p>
          Debido a la naturaleza personalizada de los productos de síntesis de oligonucleótidos:
        </p>
        <ul>
          <li>
            Los pedidos personalizados <strong>no son susceptibles de devolución ni reembolso</strong>{" "}
            una vez que la síntesis haya iniciado.
          </li>
          <li>
            Los productos de catálogo podrán ser devueltos dentro de los <H>XX días naturales</H>{" "}
            posteriores a su recepción, siempre que se encuentren en su empaque original y sin
            abrir, conforme a los artículos 92 y 92 Bis de la Ley Federal de Protección al
            Consumidor.
          </li>
          <li>
            En caso de producto defectuoso o error en la síntesis atribuible a T4, se
            realizará la re-síntesis sin costo adicional o el reembolso correspondiente.
          </li>
        </ul>

        <h2>8. Propiedad Intelectual</h2>
        <p>
          Todo el contenido del Sitio, incluyendo pero sin limitarse a textos, gráficos, logotipos,
          imágenes, software, diseños y marcas, es propiedad de T4 o de sus licenciantes y
          está protegido por las leyes de propiedad intelectual aplicables en México y tratados
          internacionales. Queda estrictamente prohibida su reproducción, distribución o uso no
          autorizado.
        </p>

        <h2>9. Responsabilidad del Usuario</h2>
        <p>El usuario se compromete a:</p>
        <ul>
          <li>Utilizar el Sitio y los productos adquiridos exclusivamente para fines lícitos y de investigación.</li>
          <li>No utilizar los productos para fines que contravengan la legislación vigente.</li>
          <li>Proporcionar información veraz y actualizada al momento del registro y compra.</li>
          <li>No intentar acceder a áreas restringidas del Sitio sin autorización.</li>
        </ul>

        <h2>10. Exclusión de Garantías y Limitación de Responsabilidad</h2>
        <p>
          Los productos ofrecidos por T4 son{" "}
          <strong>exclusivamente para uso en investigación (RUO)</strong> y no están destinados para
          uso diagnóstico, terapéutico ni consumo humano, salvo que se especifique expresamente lo
          contrario. T4 no será responsable por el uso indebido de sus productos.
        </p>

        <h2>11. Confidencialidad</h2>
        <p>
          T4 se compromete a mantener la confidencialidad de las secuencias y especificaciones
          proporcionadas por el usuario para la síntesis de oligonucleótidos. Esta obligación
          subsistirá aún después de terminada la relación comercial.
        </p>

        <h2>12. Protección de Datos Personales</h2>
        <p>
          El tratamiento de datos personales se rige por nuestro{" "}
          <a href="/aviso-privacidad" className="text-primary underline">Aviso de Privacidad</a>,
          elaborado conforme a la Ley Federal de Protección de Datos Personales en Posesión de los
          Particulares (LFPDPPP).
        </p>

        <h2>13. Modificaciones</h2>
        <p>
          T4 se reserva el derecho de modificar los presentes Términos y Condiciones en
          cualquier momento. Las modificaciones entrarán en vigor desde su publicación en el Sitio.
          El uso continuado del Sitio después de dichas modificaciones constituye la aceptación de
          los nuevos términos.
        </p>

        <h2>14. Legislación Aplicable y Jurisdicción</h2>
        <p>
          Los presentes Términos y Condiciones se regirán e interpretarán conforme a las leyes de
          los Estados Unidos Mexicanos. Para la resolución de cualquier controversia derivada de los
          presentes Términos, las partes se someten a la jurisdicción de los tribunales competentes
          de <H>Ciudad de México / Ciudad y Estado correspondiente</H>, renunciando expresamente a
          cualquier otro fuero que pudiera corresponderles por razón de su domicilio presente o
          futuro.
        </p>

        <h2>15. Contacto</h2>
        <p>
          Para cualquier duda, aclaración o reclamación relacionada con los presentes Términos y
          Condiciones, puede contactarnos a través de:
        </p>
        <p>
          <strong>Correo electrónico:</strong> <H>contacto@t4oligo.com</H>
          <br />
          <strong>Teléfono:</strong> <H>+52 (XX) XXXX XXXX</H>
          <br />
          <strong>Domicilio:</strong>{" "}
          <H>Calle, Número, Colonia, Alcaldía/Municipio, C.P., Ciudad, Estado, México</H>
        </p>

        <hr />
        <p className="text-sm text-muted-foreground">
          En caso de controversia, el consumidor podrá acudir a la Procuraduría Federal del
          Consumidor (PROFECO).{" "}
          <a href="https://www.gob.mx/profeco" target="_blank" rel="noopener noreferrer" className="text-primary underline">
            www.gob.mx/profeco
          </a>
        </p>
      </div>
    </div>
  );
}*/
