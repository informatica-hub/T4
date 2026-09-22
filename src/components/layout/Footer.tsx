import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, Facebook, Instagram } from "lucide-react";
import logo from "@/assets/logotipo-t4.png";
import isoLogo from "@/assets/iso-9001.png";
import hechoEnMexico from "@/assets/hecho-en-mexico.png";

const footerLinks = {
  productos: [
  { title: "ListOligo", href: "/productos/listoligo" },
  { title: "Oligonucleótidos", href: "/productos/oligonucleotidos" },
  { title: "Sondas qPCR", href: "/productos/sondas-qpcr" },
  { title: "Síntesis RNA", href: "/productos/sintesis-rna" }],

  empresa: [
  { title: "Nosotros", href: "/nosotros" },
  { title: "Calidad", href: "/calidad" },
  { title: "Vinculación", href: "/vinculacion" },
  { title: "Soporte Científico", href: "/soporte" }],

  recursos: [
  { title: "FAQ", href: "/faq" },
  { title: "Certificados", href: "/certificado" },
  { title: "Contacto", href: "/contacto" },
  { title: "Aviso de Privacidad", href: "/aviso-privacidad" }]

};

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-width section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <img
                src={logo}
                alt="T4"
                className="h-12 w-auto brightness-0 invert" />

            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-6 max-w-sm">
             Empresa mexicana con más de 15 años liderando la síntesis de oligonucleótidos. Rigor científico de clase mundial, con vocación de innovación.
            </p>
            

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/share/1Ci7Ck1H4g/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                aria-label="Facebook">

                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/somos_t4?igsh=NWh6ZjZ2cmY3ang2"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                aria-label="Instagram">

                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://x.com/somos_t4?s=21&t=SiUOjAbcPgu56ApRRG2tCw"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                aria-label="X (Twitter)">

                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a
                href="https://www.tiktok.com/@t4oligo?_r=1&_t=ZS-95oiuqbhoea"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                aria-label="TikTok">

                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.73a8.19 8.19 0 004.76 1.52V6.8a4.84 4.84 0 01-1-.11z" /></svg>
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-4">Productos</h4>
            <ul className="space-y-2">
              {footerLinks.productos.map((link) =>
              <li key={link.title}>
                  <Link
                  to={link.href}
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">

                    {link.title}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link) =>
              <li key={link.title}>
                  <Link
                  to={link.href}
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">

                    {link.title}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:+524626240364"
                  className="flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">

                  <Phone className="h-4 w-4 flex-shrink-0" />
                  462 624 0364
                </a>
              </li>
              <li>
                <a
                  href="mailto:ventas@t4mexico.com"
                  className="flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">

                  <Mail className="h-4 w-4 flex-shrink-0" />
                  ventas@t4mexico.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-primary-foreground/80">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Euquerio Guerrero #278, Tabachines, C.P. 36615 Irapuato, Gto.</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>Lun - Vie 09:00 - 18:00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Certifications Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 flex items-center justify-center gap-8 mb-8 bg-muted">
          <img src={isoLogo} alt="ISO 9001:2015" className="h-14 w-auto" />
          <img src={hechoEnMexico} alt="Hecho en México" className="h-16 w-auto" />
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-primary-foreground/70">
              © {new Date().getFullYear()} T4. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <Link
                to="/aviso-privacidad"
                className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Aviso de Privacidad
              </Link>
              <Link
                to="/terminos-condiciones"
                className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Términos y Condiciones
              </Link>
              <Link
                to="/auth"
                className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Intranet
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>);

}