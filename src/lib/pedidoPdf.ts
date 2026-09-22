import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PDFDocument } from "pdf-lib";

export interface PedidoPdfProduct {
  product_id: string;
  product_name: string;
  catalog_number?: string | null;
  category?: string | null;
}

export interface PedidoPdfData {
  institution: string;
  laboratory: string;
  email: string;
  notes?: string | null;
  trigger_product_name?: string | null;
  products: PedidoPdfProduct[];
  created_at?: string;
}

const BRAND = { r: 56, g: 71, b: 71 }; // #384747

export function generatePedidoPdf(data: PedidoPdfData): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;

  // Header band
  doc.setFillColor(BRAND.r, BRAND.g, BRAND.b);
  doc.rect(0, 0, pageWidth, 70, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("T4", margin, 32);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Resumen de solicitud de proyecto", margin, 52);

  // Date
  const date = data.created_at
    ? new Date(data.created_at)
    : new Date();
  const dateStr = date.toLocaleString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.setFontSize(9);
  doc.text(dateStr, pageWidth - margin, 52, { align: "right" });

  // Requester block
  doc.setTextColor(40, 40, 40);
  let y = 100;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Datos del solicitante", margin, y);
  y += 16;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const fields: [string, string][] = [
    ["Institución", data.institution],
    ["Laboratorio", data.laboratory],
    ["Correo electrónico", data.email],
  ];
  fields.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(value || "—", margin + 120, y);
    y += 14;
  });

  if (data.trigger_product_name) {
    doc.setFont("helvetica", "bold");
    doc.text("Producto principal:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(data.trigger_product_name, margin + 120, y);
    y += 14;
  }

  if (data.notes) {
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Notas adicionales:", margin, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    const notes = doc.splitTextToSize(data.notes, pageWidth - margin * 2);
    doc.text(notes, margin, y);
    y += notes.length * 12;
  }

  y += 10;

  // Products table
  autoTable(doc, {
    startY: y,
    head: [["#", "Producto", "Cat.", "Categoría"]],
    body: data.products.map((p, i) => [
      String(i + 1),
      p.product_name,
      p.catalog_number || "—",
      p.category || "—",
    ]),
    styles: { fontSize: 9, cellPadding: 6 },
    headStyles: {
      fillColor: [BRAND.r, BRAND.g, BRAND.b],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [250, 245, 242] },
    margin: { left: margin, right: margin },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      `T4 OLIGO · Solicitud generada desde el portal · Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 20,
      { align: "center" }
    );
  }

  return doc;
}

export function downloadCatalogPdf() {
  const a = document.createElement("a");
  a.href = "/documents/Catalogo_de_Productos_y_Soluciones_T4.pdf";
  a.download = "Catalogo_T4_OLIGO.pdf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

const CATALOG_URL = "/documents/Catalogo_de_Productos_y_Soluciones_T4.pdf";

/**
 * Genera el PDF resumen del pedido y lo concatena con el catálogo institucional
 * en un solo archivo, evitando bloqueos del navegador por descargas múltiples.
 */
export async function generateCombinedPedidoPdf(
  data: PedidoPdfData
): Promise<Uint8Array> {
  const summaryDoc = generatePedidoPdf(data);
  const summaryBytes = summaryDoc.output("arraybuffer");

  const merged = await PDFDocument.create();

  // Add summary pages
  const summaryPdf = await PDFDocument.load(summaryBytes);
  const summaryPages = await merged.copyPages(
    summaryPdf,
    summaryPdf.getPageIndices()
  );
  summaryPages.forEach((p) => merged.addPage(p));

  // Try to fetch and append catalog
  try {
    const res = await fetch(CATALOG_URL);
    if (res.ok) {
      const catalogBytes = await res.arrayBuffer();
      const catalogPdf = await PDFDocument.load(catalogBytes);
      const catalogPages = await merged.copyPages(
        catalogPdf,
        catalogPdf.getPageIndices()
      );
      catalogPages.forEach((p) => merged.addPage(p));
    }
  } catch (err) {
    console.warn("No se pudo adjuntar el catálogo institucional:", err);
  }

  return await merged.save();
}

export async function downloadCombinedPedidoPdf(
  data: PedidoPdfData,
  filename: string
) {
  const bytes = await generateCombinedPedidoPdf(data);
  const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
