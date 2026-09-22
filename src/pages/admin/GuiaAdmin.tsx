import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NucleotideBackground } from "@/components/ui/NucleotideBackground";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  FolderTree,
  Layers,
  Package,
  AlertTriangle,
  CheckCircle2,
  Image as ImageIcon,
  Tag,
  Search,
  Link as LinkIcon,
  Star,
} from "lucide-react";
import { Seo } from "@/components/seo/Seo";

const productFields: { name: string; required?: boolean; purpose: string; example: string; icon?: any }[] = [
  { name: "Imagen", purpose: "Foto del producto que aparece en la card y modal.", example: "PNG/JPG/WEBP, máx. 5MB. Fondo blanco preferible.", icon: ImageIcon },
  { name: "Nombre", required: true, purpose: "Título principal en card y modal.", example: '"GIGAmaster™ One-Step"' },
  { name: "Categoría", purpose: "Agrupa el producto en filtros públicos.", example: "Selecciona de la lista existente. Si falta, créala primero." },
  { name: "Subcategoría", purpose: "Sub-filtro dentro de la categoría seleccionada.", example: "Aparece solo después de elegir categoría." },
  { name: "Descripción corta", purpose: "Texto breve debajo del nombre en la card.", example: "Una línea, máx. ~120 caracteres." },
  { name: "Descripción larga", purpose: "Texto completo en el modal de detalle.", example: "Párrafo técnico descriptivo." },
  { name: "SKU", purpose: "Código interno de inventario.", example: '"T4-GS-OS-001"' },
  { name: "Nº Catálogo", purpose: "Código público que el usuario puede BUSCAR para encontrar el producto.", example: '"GS-OS-100" — clave para búsqueda', icon: Search },
  { name: "Precio MXN", purpose: "Referencia interna. NO se muestra públicamente (regla de negocio).", example: "Dejar vacío salvo necesidad interna." },
  { name: "Tiempo de entrega", purpose: "Aparece en la card y modal.", example: '"3-5 días hábiles"' },
  { name: "Tipo", purpose: "Producto / Servicio / Innovación. Afecta dónde aparece.", example: '"producto" para catálogo regular.' },
  { name: "Marca", purpose: "T4 (propio) o Partner (distribuido). Se muestra como badge.", example: '"T4" o "Partner"' },
  { name: "Slogan", purpose: "Frase corta de marketing en el modal.", example: '"El one-step más rápido del mercado"' },
  { name: "Aplicaciones", purpose: "Badges en el modal. También filtran búsquedas.", example: '"PCR, qPCR, Diagnóstico" (separadas por coma)', icon: Tag },
  { name: "Tags", purpose: "Palabras clave para búsqueda interna.", example: '"enzima, polimerasa, taq"' },
  { name: "Diferenciador", purpose: "Ventaja competitiva destacada en el modal.", example: '"Tolerante a inhibidores"' },
  { name: "CTA", purpose: "Texto del botón secundario en la card.", example: '"Más información"' },
  { name: "Ruta (href)", purpose: "Link interno OPCIONAL a una página dedicada del producto. NO es la URL pública del catálogo, es solo un destino al que apuntar el botón CTA si existe una landing dedicada.", example: '"/productos/oligonucleotidos" o vacío.', icon: LinkIcon },
  { name: "Productos Relacionados (upselling)", purpose: 'Cross-selling. Aparecen en la sección "Completa tu Ensayo" del modal y en Mi Proyecto.', example: "Busca y agrega otros productos del catálogo." },
  { name: "Destacado", purpose: 'Muestra el producto en la home con badge "Destacado".', example: "Usar con moderación (3-6 productos).", icon: Star },
  { name: "RUO", purpose: '"Research Use Only" — agrega leyenda regulatoria.', example: "Activar para reactivos no-diagnósticos." },
];

const categoryFields = [
  { name: "Nombre", purpose: "Visible al usuario en filtros públicos.", example: '"Reactivos PCR"' },
  { name: "Color", purpose: "Punto de color que identifica la categoría en cards y badges.", example: "Hex consistente con la paleta T4 (#384747, etc.)" },
  { name: "Orden", purpose: "Posición en menús/filtros (menor = primero).", example: "Auto-asigna el siguiente si se deja vacío." },
  { name: "Icono (opcional)", purpose: "Se sube tras crear la categoría, en modo edición.", example: "PNG cuadrado recomendado." },
];

const subcategoryFields = [
  { name: "Nombre", purpose: "Sub-filtro dentro de la categoría.", example: '"Taq polimerasas"' },
  { name: "Orden", purpose: "Posición dentro de la categoría.", example: "Numérico, menor primero." },
];

const sections = [
  { id: "flujo", label: "Flujo recomendado", icon: ArrowRight },
  { id: "categorias", label: "Categorías", icon: FolderTree },
  { id: "subcategorias", label: "Subcategorías", icon: Layers },
  { id: "productos", label: "Productos", icon: Package },
  { id: "errores", label: "Errores comunes", icon: AlertTriangle },
];

export default function GuiaAdmin() {
  return (
    <div className="min-h-screen relative pt-24 pb-12">
      <Seo title="Admin · Guía | T4" description="Guía administrativa." noindex />
      <NucleotideBackground />
      <div className="relative z-10 container-width px-4 md:px-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Guía del administrador</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-3xl">
          Tutorial paso a paso para registrar correctamente categorías, subcategorías y productos en el catálogo.
          Sigue el orden recomendado para evitar productos huérfanos o invisibles en los filtros públicos.
        </p>

        <div className="grid lg:grid-cols-[220px_1fr] gap-8">
          {/* Sidebar índice */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm uppercase text-muted-foreground tracking-wider">Índice</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-center gap-2 text-sm py-2 px-2 rounded-md hover:bg-accent transition-colors"
                  >
                    <s.icon className="h-4 w-4 text-primary shrink-0" />
                    {s.label}
                  </a>
                ))}
                <div className="pt-3 mt-3 border-t">
                  <Link to="/admin/catalogo">
                    <Button variant="outline" size="sm" className="w-full">
                      Ir al catálogo
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Contenido */}
          <div className="space-y-10">
            {/* 1. Flujo */}
            <section id="flujo" className="scroll-mt-24">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRight className="h-5 w-5 text-primary" />
                    1. Flujo recomendado
                  </CardTitle>
                  <CardDescription>
                    Sigue este orden estricto. Si saltas pasos, el producto puede quedar invisible en los filtros públicos.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-3">
                    {[
                      { n: "1", title: "Crear Categoría", desc: "Define agrupación principal." },
                      { n: "2", title: "Crear Subcategorías", desc: "Refina dentro de la categoría." },
                      { n: "3", title: "Crear Producto", desc: "Asigna categoría y subcategoría." },
                      { n: "4", title: "Asignar Relacionados", desc: "Cross-selling con upselling." },
                    ].map((step, i) => (
                      <div key={step.n} className="relative">
                        <div className="rounded-lg border-2 border-primary/20 bg-card p-4 h-full">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-2">
                            {step.n}
                          </div>
                          <h3 className="font-semibold mb-1">{step.title}</h3>
                          <p className="text-sm text-muted-foreground">{step.desc}</p>
                        </div>
                        {i < 3 && (
                          <ArrowRight className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-primary z-10 bg-background rounded-full" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 2. Categorías */}
            <section id="categorias" className="scroll-mt-24">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderTree className="h-5 w-5 text-primary" />
                    2. Cómo registrar una Categoría
                  </CardTitle>
                  <CardDescription>
                    Las categorías son el nivel superior. Aparecen como filtros principales en el catálogo público.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Ve a <span className="font-mono bg-muted px-1.5 py-0.5 rounded">/admin/catalogo</span> → pestaña <strong>Categorías</strong>.</li>
                    <li>Llena el formulario <strong>"Nueva categoría"</strong>.</li>
                    <li>Pulsa <strong>"Agregar categoría"</strong>. Aparecerá inmediatamente en la tabla.</li>
                    <li>(Opcional) Sube un icono desde el modo edición.</li>
                  </ol>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-3 font-semibold">Campo</th>
                          <th className="text-left p-3 font-semibold">Para qué sirve</th>
                          <th className="text-left p-3 font-semibold">Ejemplo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoryFields.map((f) => (
                          <tr key={f.name} className="border-t">
                            <td className="p-3 font-medium">{f.name}</td>
                            <td className="p-3 text-muted-foreground">{f.purpose}</td>
                            <td className="p-3 text-muted-foreground">{f.example}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* 3. Subcategorías */}
            <section id="subcategorias" className="scroll-mt-24">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    3. Cómo registrar Subcategorías
                  </CardTitle>
                  <CardDescription>
                    Las subcategorías refinan los filtros dentro de una categoría. Son opcionales pero recomendadas si tienes &gt;5 productos en una categoría.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>En la pestaña <strong>Categorías</strong>, ubica la fila de la categoría padre.</li>
                    <li>Pulsa la flecha <span className="font-mono bg-muted px-1.5 rounded">▶</span> para expandir.</li>
                    <li>Usa el formulario inline para agregar subcategorías.</li>
                  </ol>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-3 font-semibold">Campo</th>
                          <th className="text-left p-3 font-semibold">Para qué sirve</th>
                          <th className="text-left p-3 font-semibold">Ejemplo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subcategoryFields.map((f) => (
                          <tr key={f.name} className="border-t">
                            <td className="p-3 font-medium">{f.name}</td>
                            <td className="p-3 text-muted-foreground">{f.purpose}</td>
                            <td className="p-3 text-muted-foreground">{f.example}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Regla importante</AlertTitle>
                    <AlertDescription>
                      Una subcategoría solo se puede eliminar si NO tiene productos asignados. Reasigna primero los productos.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </section>

            {/* 4. Productos */}
            <section id="productos" className="scroll-mt-24">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    4. Cómo registrar un Producto
                  </CardTitle>
                  <CardDescription>
                    Cada campo del formulario tiene un propósito específico. Los marcados como obligatorios son indispensables.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Ve a la pestaña <strong>Productos</strong> y pulsa <strong>"Nuevo producto"</strong>.</li>
                    <li>Llena los campos siguiendo la tabla de referencia.</li>
                    <li>Asigna primero <strong>Categoría</strong>, luego aparecerá el selector de <strong>Subcategoría</strong>.</li>
                    <li>Guarda el producto y luego, en modo edición, asigna <strong>Productos Relacionados</strong>.</li>
                  </ol>

                  <Accordion type="single" collapsible defaultValue="campos">
                    <AccordionItem value="campos">
                      <AccordionTrigger>Ver tabla completa de campos ({productFields.length})</AccordionTrigger>
                      <AccordionContent>
                        <div className="border rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-muted">
                              <tr>
                                <th className="text-left p-3 font-semibold w-[22%]">Campo</th>
                                <th className="text-left p-3 font-semibold">Para qué sirve</th>
                                <th className="text-left p-3 font-semibold w-[28%]">Ejemplo / nota</th>
                              </tr>
                            </thead>
                            <tbody>
                              {productFields.map((f) => {
                                const Icon = f.icon;
                                return (
                                  <tr key={f.name} className="border-t align-top">
                                    <td className="p-3 font-medium">
                                      <div className="flex items-center gap-2">
                                        {Icon && <Icon className="h-4 w-4 text-primary shrink-0" />}
                                        <span>{f.name}</span>
                                        {f.required && <Badge variant="destructive" className="text-[10px]">Obligatorio</Badge>}
                                      </div>
                                    </td>
                                    <td className="p-3 text-muted-foreground">{f.purpose}</td>
                                    <td className="p-3 text-muted-foreground">{f.example}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="href">
                      <AccordionTrigger>Aclaración: ¿qué es el campo "Ruta (href)"?</AccordionTrigger>
                      <AccordionContent className="space-y-2 text-sm">
                        <p>
                          La <strong>Ruta (href)</strong> NO es la URL pública del producto en el catálogo (esa la genera el sistema automáticamente).
                          Es un destino opcional al que apunta el botón CTA secundario, útil cuando existe una <strong>página dedicada</strong> del producto.
                        </p>
                        <p>
                          ✅ Correcto: <span className="font-mono bg-muted px-1.5 rounded">/productos/oligonucleotidos</span>
                          <br />
                          ❌ Incorrecto: <span className="font-mono bg-muted px-1.5 rounded">https://otrositio.com/...</span>
                          <br />
                          ✅ Si no existe página dedicada → <strong>déjalo vacío</strong>.
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="catalogo">
                      <AccordionTrigger>Aclaración: ¿por qué es crítico el "Nº Catálogo"?</AccordionTrigger>
                      <AccordionContent className="text-sm space-y-2">
                        <p>
                          Los usuarios suelen buscar productos por su <strong>código de catálogo</strong> (no por nombre).
                          Si lo dejas vacío, el producto será invisible en búsquedas por código y los clientes no podrán referenciarlo en sus pedidos.
                        </p>
                        <p>
                          Asegúrate de que sea <strong>único, estable y publicable</strong> (aparecerá en cards, modal y carrito).
                        </p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="upselling">
                      <AccordionTrigger>Aclaración: "Productos Relacionados" (cross-selling)</AccordionTrigger>
                      <AccordionContent className="text-sm space-y-2">
                        <p>
                          Estos productos aparecen en dos lugares:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>En el modal de detalle, sección <strong>"Completa tu Ensayo"</strong>.</li>
                          <li>En <strong>Mi Proyecto</strong> (carrito), como sugerencias para el usuario.</li>
                        </ul>
                        <p>Recomendado: 2 a 5 productos complementarios reales (no toda la categoría).</p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </section>

            {/* 5. Errores comunes */}
            <section id="errores" className="scroll-mt-24">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    5. Errores comunes a evitar
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { title: "Producto sin categoría", desc: "→ no aparece en filtros públicos. Siempre asigna categoría antes de guardar." },
                    { title: "Olvidar Nº Catálogo", desc: "→ usuarios no encuentran el producto al buscarlo por código." },
                    { title: 'Llenar "Ruta (href)" con URL externa', desc: "→ debe ser ruta interna (/productos/...) o vacío." },
                    { title: "Subir imagen >5MB", desc: "→ falla la carga al storage. Comprime antes de subir." },
                    { title: "Asignar subcategoría de otra categoría", desc: "→ el selector se filtra automáticamente, pero verifica que coincidan." },
                    { title: "Marcar todos como Destacado", desc: "→ pierde sentido en la home. Usa máximo 3-6 productos destacados." },
                  ].map((err) => (
                    <Alert key={err.title} variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>{err.title}</AlertTitle>
                      <AlertDescription>{err.desc}</AlertDescription>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            </section>

            <div className="flex justify-center pt-4">
              <Link to="/admin/catalogo">
                <Button size="lg">
                  Volver al catálogo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
