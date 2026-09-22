import { NucleotideBackground } from "@/components/ui/NucleotideBackground";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Seo } from "@/components/seo/Seo";

const fluorophores = [
  { name: "FAM", abs: 495, em: 520, purification: "", quencher: "" },
  { name: "FAM dT", abs: 495, em: 520, purification: "", quencher: "" },
  { name: "TET™", abs: 521, em: 536, purification: "", quencher: "" },
  { name: "CAL Fluor® Gold 540", abs: 522, em: 544, purification: "", quencher: "BHQ1™" },
  { name: "JOE™", abs: 529, em: 555, purification: "", quencher: "BBQ®" },
  { name: "MIKE™", abs: 530, em: 550, purification: "", quencher: "" },
  { name: "HEX", abs: 535, em: 556, purification: "", quencher: "" },
  { name: "HEX dT", abs: 535, em: 556, purification: "", quencher: "" },
  { name: "CAL Fluor® Orange 560", abs: 538, em: 559, purification: "", quencher: "" },
  { name: "Quasar™ 570", abs: 548, em: 566, purification: "", quencher: "" },
  { name: "Cy3®", abs: 549, em: 566, purification: "Dual HPLC", quencher: "" },
  { name: "TAMRA™", abs: 557, em: 583, purification: "", quencher: "" },
  { name: "ROX™", abs: 586, em: 610, purification: "", quencher: "BHQ2™" },
  { name: "CAL Fluor® Red 610", abs: 590, em: 610, purification: "", quencher: "" },
  { name: "Texas Red™", abs: 597, em: 616, purification: "", quencher: "" },
  { name: "Texas Red™ X", abs: 597, em: 616, purification: "", quencher: "" },
  { name: "Cy5®", abs: 646, em: 669, purification: "", quencher: "" },
  { name: "Quasar™ 670", abs: 647, em: 670, purification: "", quencher: "" },
  { name: "Quasar™ 705", abs: 690, em: 705, purification: "", quencher: "BHQ2™ / BHQ3™" },
  { name: "Cy5.5®", abs: 694, em: 711, purification: "", quencher: "" },
  { name: "Cy7®", abs: 756, em: 779, purification: "", quencher: "" },
];


export default function MapaEspectral() {
  return (
    <div className="min-h-screen bg-background">
      <Seo title="Mapa espectral de fluoróforos y quenchers | T4 México" description="Mapa espectral interactivo de fluoróforos y quenchers compatibles con sondas qPCR T4." />
      {/* Hero */}
      <section className="relative bg-muted/40 pt-20 pb-12 md:pt-24 md:pb-16">
        <NucleotideBackground className="opacity-20" />
        <div className="container-width px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Sondas StarQ™
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Mapa Espectral de Fluoróforos
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Seleccione el fluoróforo ideal para su ensayo con nuestro mapa espectral completo.
              Cada fluoróforo ha sido validado con la metodología StarQ™.
            </p>
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="py-12 md:py-16">
        <div className="container-width px-4 md:px-8">
          <div className="max-w-5xl mx-auto flex">
            {/* Vertical spectral gradient bar */}
            <div
              className="w-16 rounded-l-lg flex-shrink-0"
              style={{
                background: "linear-gradient(180deg, #62a4b6, #4eae87, #e9d947, #faa01a, #fb651f, #ef4e1a, #ed2916, #a40a07, #331531)"
              }}
            />
            <div className="flex-1 bg-card rounded-r-lg border border-l-0 border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-primary/5">
                    <TableHead className="font-bold text-foreground">Fluoróforo</TableHead>
                    <TableHead className="font-bold text-foreground text-center">ABS (nm)</TableHead>
                    <TableHead className="font-bold text-foreground text-center">EM (nm)</TableHead>
                    <TableHead className="font-bold text-foreground text-center">Purificación</TableHead>
                    <TableHead className="font-bold text-foreground text-center">Quencher</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fluorophores.map((f) => (
                    <TableRow key={f.name} className="hover:bg-muted/30">
                      <TableCell className="font-medium text-foreground">{f.name}</TableCell>
                      <TableCell className="text-center text-muted-foreground">{f.abs}</TableCell>
                      <TableCell className="text-center text-muted-foreground">{f.em}</TableCell>
                      <TableCell className="text-center text-muted-foreground">{f.purification || "—"}</TableCell>
                      <TableCell className="text-center text-muted-foreground">{f.quencher || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="max-w-4xl mx-auto text-center mt-12">
            <Link to="/contacto">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Consultar compatibilidad con su equipo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
