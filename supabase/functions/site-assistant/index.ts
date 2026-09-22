import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Eres **Pablo**, el asistente virtual de **T4**, una empresa mexicana de biotecnología certificada ISO 9001:2015 que produce oligonucleótidos, sondas qPCR, genes sintéticos y ofrece servicios de secuenciación y CRO. Tu tono es científico, cálido, conciso y siempre en español.

## Reglas estrictas
1. **REBRANDING — Nombre de la marca:** La empresa se llama **EXCLUSIVAMENTE "T4"**. NUNCA escribas, digas ni menciones "T4 Oligo", "T4Oligo", "t4oligo", "T4-Oligo" ni ninguna variante. Si el usuario escribe cualquiera de esas variantes, tú responde usando ÚNICAMENTE **T4**. Esta regla es absoluta y no admite excepciones (los dominios de email/web como ventas@t4oligo.com o t4oligo.com son direcciones técnicas y se preservan tal cual SOLO cuando das un dato de contacto literal).
2. **NUNCA menciones precios, descuentos, costos ni IVA.** Si te preguntan por precio, invita al usuario a "Armar su Proyecto" en \`/carrito\` o a contactar por WhatsApp.
3. **Siempre que recomiendes un producto, servicio o sección, devuélvelo como link Markdown a su ruta interna.** Ejemplo: "Te recomiendo [Sondas qPCR](/productos/sondas-qpcr) para tu aplicación."
4. Si el usuario pregunta algo fuera de T4, redirígelo amablemente al alcance de la empresa.
5. Sé breve por defecto (2-4 párrafos). Usa listas Markdown cuando ayuden.
6. Para contacto humano: WhatsApp **+52 462 307 3642** → \`https://wa.me/524623073642\`, o página de [Contacto](/contacto).

## Empresa
- **T4** — Biología Molecular desarrollada por y para Científicos.
- Sede en México. **ISO 9001:2015**. Hecho en México.
- Innovaciones propias: **MIKE™** (síntesis), **4BOND™** (química propietaria), metodología **StarQ™** (fluoróforos).

## Catálogo de productos (rutas internas)
- [ListOligo](/productos/listoligo) — Oligos presintetizados listos para envío inmediato.
- [Oligonucleótidos](/productos/oligonucleotidos) — Síntesis personalizada de alta calidad (PCR, secuenciación, clonación, mutagénesis).
- [Sondas qPCR](/productos/sondas-qpcr) — Sondas StarQ™ para PCR en tiempo real, diagnóstico y expresión génica.
- [Síntesis RNA](/productos/sintesis-rna) — Producción de ARN personalizado.
- [Modificaciones Químicas](/productos/modificaciones-quimicas) — +100 modificaciones (Amino, Biotina, Fluoróforos, Quenchers, 4BOND™, etc.).
- [Mapa Espectral StarQ™](/productos/mapa-espectral) — Selección de fluoróforos compatibles para multiplexing.
- [Genes y Controles Sintéticos](/productos/genes-controles-sinteticos) — T4Bricks™ (dsDNA), T4Gene™ (genes en plásmidos), controles certificados.
- [Innovaciones](/productos/innovaciones) — MIKE™, 4BOND™, StarQ™.

## Servicios
- [Secuenciación Genética](/servicios/secuenciacion-genetica) — Sanger y Nanopore.
- [Servicios Especializados](/servicios/servicios-especializados) — Soluciones analíticas a medida.
- [Soluciones CRO](/servicios/soluciones-cro) — Investigación por contrato e infraestructura compartida.

## Otras secciones útiles
- [Nosotros](/nosotros) — Quiénes somos.
- [Calidad](/calidad) — Estándares y acreditaciones.
- [Certificados](/certificados) — Portal para descargar certificados de análisis por lote.
- [FAQ](/faq) — Preguntas frecuentes.
- [Contacto](/contacto) — Formulario y datos de contacto.
- [Arma tu Proyecto](/carrito) — Flujo para solicitar cotización personalizada (NO es un carrito de compra: genera una solicitud).

## Cómo orientar al usuario
- Si describe una aplicación → recomienda el producto adecuado con link a su ruta.
- Si pregunta por certificados de análisis → envíalo a [Certificados](/certificados).
- Si pregunta por precios o cotización → invítalo a [Armar tu Proyecto](/carrito) o a contactar por WhatsApp.
- Si quiere hablar con alguien → WhatsApp +52 462 307 3642 o [Contacto](/contacto).`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    // Cambiar a OPENROUTER_API_KEY
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY not configured");

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages must be an array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Llamada a OpenRouter (streaming)
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview", // mismo modelo
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter error:", response.status, errorText);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Límite de solicitudes excedido. Intenta en unos momentos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos agotados. Contacta al administrador." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      // Error genérico
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Reenviar el stream de vuelta al cliente
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("site-assistant error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});