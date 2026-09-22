// Constantes de UI de productos. Los datos reales viven en la tabla
// `catalog_products` y se consumen vía `useCatalogProducts`. Aquí solo
// quedan listas estáticas usadas por filtros y un mapa de logo por categoría.

import logoOligos from "@/assets/logo-oligos.jpg";
import logoPrimers from "@/assets/logo-primers.jpg";
import logoGenes from "@/assets/logo-genes.jpg";
import logoKdm from "@/assets/logo-kdm.jpg";
import logoReactivos from "@/assets/logo-reactivos.jpg";
import logoSoluciones from "@/assets/logo-soluciones.jpg";

const categoryLogoMap: Record<string, string> = {
  "oligonucleotidos": logoOligos,
  "sondas-starq": logoPrimers,
  "genes-sinteticos": logoGenes,
  "kits-sentinel": logoKdm,
  "reactivos-esenciales": logoReactivos,
  "enzimas-gigascript": logoReactivos,
  "extraccion-nextpure": logoReactivos,
  "marcas-aliadas": logoReactivos,
  "secuenciacion": logoReactivos,
  "servicios-especializados": logoSoluciones,
  "soluciones-cro": logoSoluciones,
  "innovaciones": logoSoluciones,
};

export function getCategoryLogo(categoria: string): string {
  return categoryLogoMap[categoria] || logoReactivos;
}

export const tipos = [
  { id: "producto", label: "Productos" },
  { id: "servicio", label: "Soluciones / Servicios" },
  { id: "innovacion", label: "Innovaciones" },
] as const;

export const aplicaciones = [
  { id: "PCR", label: "PCR" },
  { id: "qPCR", label: "qPCR / Tiempo Real" },
  { id: "RT-PCR", label: "RT-PCR" },
  { id: "Secuenciación", label: "Secuenciación" },
  { id: "NGS", label: "NGS" },
  { id: "Clonación", label: "Clonación" },
  { id: "Diagnóstico", label: "Diagnóstico" },
  { id: "Fitopatología", label: "Fitopatología" },
  { id: "Inocuidad Alimentaria", label: "Inocuidad Alimentaria" },
  { id: "Sanidad Animal", label: "Sanidad Animal" },
  { id: "Biología Sintética", label: "Biología Sintética" },
  { id: "Expresión Génica", label: "Expresión Génica" },
  { id: "Metagenómica", label: "Metagenómica" },
] as const;

export const tiemposEntrega = [
  { id: "Inmediato", label: "Inmediato" },
  { id: "3-5 días", label: "3-5 días" },
  { id: "5-7 días", label: "5-7 días" },
  { id: "7-10 días", label: "7-10 días" },
  { id: "10-15 días", label: "10-15 días" },
  { id: "Variable", label: "Variable / Consultar" },
] as const;
