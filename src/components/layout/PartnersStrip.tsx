import { LogoMarquee, type MarqueeLogo } from "./LogoMarquee";
import sanfer from "@/assets/partners/sanfer.png";
import incmnsz from "@/assets/partners/incmnsz.png";
import cigb from "@/assets/partners/cigb.png";
import colpos from "@/assets/partners/colpos.png";
import uaa from "@/assets/partners/uaa.png";
import unacar from "@/assets/partners/unacar.png";
import unach from "@/assets/partners/unach.png";
import asm from "@/assets/partners/asm.png";
import inecol from "@/assets/partners/inecol.png";
import iica from "@/assets/partners/iica.png";
import imss from "@/assets/partners/imss.png";
import cenam from "@/assets/partners/cenam.png";
import genlab from "@/assets/partners/genlab.png";
import ibtUnam from "@/assets/partners/ibt-unam.png";
import driscolls from "@/assets/partners/driscolls.png";
import sigma from "@/assets/partners/sigma.png";
import iner from "@/assets/partners/iner.png";
import incan from "@/assets/partners/incan.png";
import uam from "@/assets/partners/uam.png";
import colpos2 from "@/assets/partners/colpos2.png";
import uam2 from "@/assets/partners/uam2.png";
import peking from "@/assets/partners/peking.png";
import univex from "@/assets/partners/univex.png";
import stanford from "@/assets/partners/stanford.png";
import unison from "@/assets/partners/unison.png";
import hjm from "@/assets/partners/hjm.png";
import ipn from "@/assets/partners/ipn.png";
import uaaan from "@/assets/partners/uaaan.png";

const row1: MarqueeLogo[] = [
  { src: sanfer, alt: "Sanfer Salud Animal" },
  { src: incmnsz, alt: "Instituto Nacional de Ciencias Médicas y Nutrición Salvador Zubirán" },
  { src: cigb, alt: "Centro de Ingeniería Genética y Biotecnología" },
  { src: colpos, alt: "Colegio de Postgraduados" },
  { src: uaa, alt: "Universidad Autónoma de Aguascalientes" },
  { src: unacar, alt: "Universidad Autónoma del Carmen" },
  { src: unach, alt: "Universidad Autónoma de Chiapas" },
  { src: asm, alt: "American Society for Microbiology" },
  { src: inecol, alt: "Instituto de Ecología INECOL" },
  { src: iica, alt: "Instituto Interamericano de Cooperación para la Agricultura" },
];

const row2: MarqueeLogo[] = [
  { src: colpos2, alt: "Colegio de Postgraduados" },
  { src: imss, alt: "Instituto Mexicano del Seguro Social" },
  { src: cenam, alt: "Centro Nacional de Metrología" },
  { src: genlab, alt: "GenLab del Perú" },
  { src: ibtUnam, alt: "Instituto de Biotecnología UNAM" },
  { src: driscolls, alt: "Driscoll's" },
  { src: sigma, alt: "Sigma Alimentos" },
  { src: iner, alt: "Instituto Nacional de Enfermedades Respiratorias" },
  { src: incan, alt: "Instituto Nacional de Cancerología" },
  { src: uam, alt: "Universidad Autónoma Metropolitana" },
];

const row3: MarqueeLogo[] = [
  { src: uam2, alt: "Universidad Autónoma Metropolitana" },
  { src: peking, alt: "Peking University" },
  { src: univex, alt: "Univex Agrociencia" },
  { src: stanford, alt: "Stanford University" },
  { src: unison, alt: "Universidad de Sonora" },
  { src: hjm, alt: "Hospital Juárez de México" },
  { src: ipn, alt: "Instituto Politécnico Nacional" },
  { src: uaaan, alt: "Universidad Autónoma Agraria Antonio Narro" },
];

export function PartnersStrip() {
  return (
    <section
      aria-label="Instituciones y aliados"
      className="border-t border-border/60"
      style={{ backgroundColor: "#FAF5F2" }}
    >
      <div className="container-width px-4 md:px-8 py-10 md:py-14">
        <p className="text-center text-xs md:text-sm uppercase tracking-[0.2em] text-muted-foreground mb-8">
          Confían en nosotros
        </p>

        <div className="space-y-6">
          <LogoMarquee logos={row1} direction="left" speed={50} />
          <LogoMarquee logos={row2} direction="right" speed={50} />
          <LogoMarquee logos={row3} direction="left" speed={50} />
        </div>
      </div>
    </section>
  );
}
