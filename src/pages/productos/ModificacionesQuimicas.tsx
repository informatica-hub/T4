import { NucleotideBackground } from "@/components/ui/NucleotideBackground";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Seo } from "@/components/seo/Seo";

const modifications = [
  // Amino
  { category: "Amino", name: "Amino C3", position: "Extremo 5'" },
  { category: "Amino", name: "Amino C6", position: "Extremo 5' / Interna" },
  { category: "Amino", name: "Amino C6 dT", position: "Extremo 5' / Interna / Extremo 3'" },
  { category: "Amino", name: "Amino C7", position: "Extremo 3'" },
  { category: "Amino", name: "Amino C12", position: "Extremo 5' / Interna / Extremo 3'" },
  { category: "Amino", name: "Amino Uni-Link™", position: "Extremo 5'" },
  { category: "Amino", name: "AOP-Amino Uni-Link™", position: "Extremo 5'" },
  // Agentes de marcaje no radiactivos
  { category: "Agentes de marcaje no radiactivos", name: "Azul de Metileno", position: "Extremo 5'" },
  { category: "Agentes de marcaje no radiactivos", name: "Biotina", position: "Extremo 5' / Extremo 3'" },
  { category: "Agentes de marcaje no radiactivos", name: "Biotina dT", position: "Extremo 5' / Interna / Extremo 3'" },
  { category: "Agentes de marcaje no radiactivos", name: "Biotina-TEG", position: "Extremo 5' / Interna / Extremo 3'" },
  { category: "Agentes de marcaje no radiactivos", name: "Biotina (dual)", position: "Extremo 5'" },
  { category: "Agentes de marcaje no radiactivos", name: "Biotina PC", position: "Extremo 5'" },
  { category: "Agentes de marcaje no radiactivos", name: "Destiobiotina-TEG", position: "Extremo 5'" },
  { category: "Agentes de marcaje no radiactivos", name: "Digoxigenina", position: "Extremo 5'" },
  // Bases especiales
  { category: "Bases especiales", name: "2'-O-metilación (2'-O-Me)", position: "Interna" },
  { category: "Bases especiales", name: "Ácidos Nucleicos Bloqueados (LNA)", position: "Interna" },
  { category: "Bases especiales", name: "Inosina (I)", position: "Interna" },
  // Fluoróforos
  { category: "Fluoróforos", name: "CAL Fluor® Gold 540", position: "Extremo 5'" },
  { category: "Fluoróforos", name: "CAL Fluor® Orange 560", position: "Extremo 5'" },
  { category: "Fluoróforos", name: "CAL Fluor® Red 610", position: "Extremo 5'" },
  { category: "Fluoróforos", name: "Cy3®", position: "Extremo 5' / Extremo 3'" },
  { category: "Fluoróforos", name: "Cy5®", position: "Extremo 5'" },
  { category: "Fluoróforos", name: "Cy5.5®", position: "Extremo 5'" },
  { category: "Fluoróforos", name: "Cy7®", position: "Extremo 5'" },
  { category: "Fluoróforos", name: "FAM", position: "Extremo 5' / Extremo 3'" },
  { category: "Fluoróforos", name: "FAM dT", position: "Interna" },
  { category: "Fluoróforos", name: "HEX", position: "Interna" },
  { category: "Fluoróforos", name: "HEX dT", position: "Interna" },
  { category: "Fluoróforos", name: "JOE™", position: "Interna" },
  { category: "Fluoróforos", name: "MIKE™", position: "Extremo 5'" },
  { category: "Fluoróforos", name: "ROX™", position: "Extremo 5'" },
  { category: "Fluoróforos", name: "TAMRA™", position: "Extremo 5'" },
  { category: "Fluoróforos", name: "TET™", position: "Extremo 5'" },
  { category: "Fluoróforos", name: "Texas Red™", position: "Extremo 5'" },
  { category: "Fluoróforos", name: "Texas Red™ X", position: "Extremo 5'" },
  { category: "Fluoróforos", name: "Quasar™ 570", position: "Extremo 5' / Extremo 3'" },
  { category: "Fluoróforos", name: "Quasar™ 670", position: "Extremo 5'" },
  { category: "Fluoróforos", name: "Quasar™ 705", position: "Extremo 5'" },
  // Fosforilación
  { category: "Fosforilación", name: "Fosfato", position: "Extremo 5' / Extremo 3'" },
  // Modificaciones con mercaptanos
  { category: "Modificaciones con mercaptanos", name: "Tiol C3 S-S", position: "Extremo 3'" },
  { category: "Modificaciones con mercaptanos", name: "Tiol C6 S-S", position: "Extremo 5' / Extremo 3'" },
  { category: "Modificaciones con mercaptanos", name: "Tiol C6 S-S dT", position: "Interna" },
  { category: "Modificaciones con mercaptanos", name: "Ditiol Serinol", position: "Extremo 5' / Interna / Extremo 3'" },
  // Colesterol
  { category: "Colesterol", name: "Colesterol", position: "Extremo 3'" },
  { category: "Colesterol", name: "Colesterol-TEG", position: "Extremo 3'" },
  // Metacrilato
  { category: "Metacrilato", name: "Acrilato", position: "Extremo 5'" },
  // Reacciones click
  { category: "Modificaciones relacionadas con reacciones click", name: "Hexinil", position: "Extremo 5'" },
  { category: "Modificaciones relacionadas con reacciones click", name: "DBCO (Difenilciclooctino)", position: "Extremo 5'" },
  // Spacers y estabilizadores
  { category: "Spacers y estabilizadores", name: "Spacer 18", position: "Extremo 5' / Interna / Extremo 3'" },
  { category: "Spacers y estabilizadores", name: "Spacer 9", position: "Extremo 5' / Interna / Extremo 3'" },
  { category: "Spacers y estabilizadores", name: "Spacer C6", position: "Extremo 5' / Interna / Extremo 3'" },
  { category: "Spacers y estabilizadores", name: "Spacer C3", position: "Extremo 5' / Interna / Extremo 3'" },
  { category: "Spacers y estabilizadores", name: "dSpacer", position: "Extremo 5' / Interna / Extremo 3'" },
  { category: "Spacers y estabilizadores", name: "Spacer 9 PC", position: "Extremo 5' / Interna / Extremo 3'" },
  // 4BOND
  { category: "4BOND™ (MGB®)", name: "4BOND™", position: "Extremo 3'" },
  // Tiosustitución
  { category: "Tiosustitución", name: "Enlace Fosforotioato (*)", position: "Interna" },
  // Quenchers
  { category: "Quenchers", name: "BHQ1™ (Black Hole Quencher™)", position: "Extremo 5' / Extremo 3'" },
  { category: "Quenchers", name: "BHQ1™ dT", position: "Interna" },
  { category: "Quenchers", name: "BHQ2™", position: "Extremo 3'" },
  { category: "Quenchers", name: "BHQ2™ dT", position: "Interna" },
  { category: "Quenchers", name: "BHQ3™", position: "Extremo 3'" },
  { category: "Quenchers", name: "BBQ® 650 (BlackBerry® Quencher)", position: "Extremo 5' / Extremo 3'" },
  { category: "Quenchers", name: "BBQ® 650 dT", position: "Interna" },
  { category: "Quenchers", name: "DABCYL", position: "Extremo 3'" },
  { category: "Quenchers", name: "DABCYL dT", position: "Interna" },
];

// Group by category for rendering with row spans
function groupByCategory(items: typeof modifications) {
  const groups: { category: string; items: typeof modifications }[] = [];
  let current = "";
  for (const item of items) {
    if (item.category !== current) {
      current = item.category;
      groups.push({ category: current, items: [] });
    }
    groups[groups.length - 1].items.push(item);
  }
  return groups;
}

export default function ModificacionesQuimicas() {
  const groups = groupByCategory(modifications);

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Modificaciones químicas para oligos | T4 México" description="Catálogo de modificaciones 5', 3' e internas: fluoróforos, quenchers, biotina, fosforotioato y más, sintetizadas en México." />
      <section className="relative bg-muted/40 pt-20 pb-12 md:pt-24 md:pb-16">
        <NucleotideBackground className="opacity-20" />
        <div className="container-width px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Productos
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Modificaciones Químicas en Oligonucleótidos
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Porque no todos los experimentos son iguales, contamos con más de 100 modificaciones disponibles a elegir. 
              Si no encuentra la que busca, contacte a su Colega Científico T4.
            </p>
          </div>

          <div className="max-w-5xl mx-auto bg-card rounded-lg border border-border/50 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/5">
                  <TableHead className="font-bold text-foreground w-[30%]">Categoría</TableHead>
                  <TableHead className="font-bold text-foreground w-[40%]">Modificación</TableHead>
                  <TableHead className="font-bold text-foreground w-[30%]">Posición Disponible</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map((group) =>
                  group.items.map((item, idx) => (
                    <TableRow key={`${item.category}-${item.name}`} className="hover:bg-muted/30">
                      {idx === 0 && (
                        <TableCell
                          rowSpan={group.items.length}
                          className="font-medium text-foreground align-top border-r border-border/30 bg-muted/20"
                        >
                          {group.category}
                        </TableCell>
                      )}
                      <TableCell className="text-foreground">{item.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{item.position}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="max-w-4xl mx-auto text-center mt-12">
            <p className="text-muted-foreground mb-6">
              ¿No encuentra la modificación que necesita? Nuestro equipo puede ayudarle.
            </p>
            <Link to="/contacto">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Contactar a un Colega Científico
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
