import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const productosData = [
  {
    id: "oligos-personalizados",
    nombre: "Oligonucleótidos Personalizados",
    categoria: "Oligonucleótidos",
    marca: "T4",
    aplicaciones: ["PCR", "Secuenciación", "Clonación", "Mutagénesis", "Hibridación"],
    escalas: ["25nM", "50nM", "100nM", "200nM", "1µM"],
    purificaciones: ["High Pure", "Cartucho", "HPLC", "PAGE"],
    modificaciones: "+100 modificaciones químicas (Amino, Biotina, Fluoróforos, Quenchers, 4BOND™, etc.)",
    tiempoEntrega: "3-5 días",
    sku: "OE-002",
  },
  {
    id: "primeready-universales",
    nombre: "PrimeReady™ Universales",
    categoria: "Oligonucleótidos",
    marca: "T4",
    aplicaciones: ["PCR", "Secuenciación", "Clonación"],
    tiempoEntrega: "Inmediato",
    sku: "PR-UNI-001",
    diferenciador: "Presintetizados, purificación HPLC, entrega inmediata",
  },
  {
    id: "primeready-med",
    nombre: "PrimeReady™ Med",
    categoria: "Oligonucleótidos",
    marca: "T4",
    aplicaciones: ["Diagnóstico", "Vigilancia Epidemiológica"],
    tiempoEntrega: "Inmediato",
    sku: "PR-MED-000",
    diferenciador: "Certificado de prueba de funcionalidad, RUO",
  },
  {
    id: "primeready-control",
    nombre: "PrimeReady™ Control",
    categoria: "Oligonucleótidos",
    marca: "T4",
    aplicaciones: ["qPCR", "Control de Calidad"],
    tiempoEntrega: "3-5 días",
    sku: "PR-CTL-500",
    diferenciador: "Controles sintéticos sin patógenos vivos, RUO",
  },
  {
    id: "starq-plus",
    nombre: "StarQ™ Plus",
    categoria: "Sondas StarQ™",
    marca: "T4",
    aplicaciones: ["qPCR", "Diagnóstico", "Expresión Génica", "Detección de Patógenos"],
    tiempoEntrega: "5-7 días",
    sku: "SQ-PLS-000",
    diferenciador: "Sincronización de Fluorescencia Dinámica, purificación dual HPLC",
  },
  {
    id: "starq-prime",
    nombre: "StarQ™ Prime",
    categoria: "Sondas StarQ™",
    marca: "T4",
    aplicaciones: ["qPCR", "Detección de Patógenos"],
    tiempoEntrega: "5-7 días",
    diferenciador: "Proximidad cuántica FRET, doble candado molecular",
  },
  {
    id: "starq-polaris",
    nombre: "StarQ™ Polaris",
    categoria: "Sondas StarQ™",
    marca: "T4",
    aplicaciones: ["qPCR", "SNPs", "Genotipificación"],
    tiempoEntrega: "7-10 días",
    diferenciador: "Tecnología 4BOND™, hiper-estabilización, detección de SNPs",
  },
  {
    id: "t4bricks",
    nombre: "T4Bricks™",
    categoria: "Genes Sintéticos",
    marca: "T4",
    aplicaciones: ["Clonación", "Biología Sintética", "Ensamblaje"],
    tiempoEntrega: "7-10 días",
    diferenciador: "dsDNA hasta 3 kb, listos para Gibson o Golden Gate",
  },
  {
    id: "t4gene",
    nombre: "T4Gene™",
    categoria: "Genes Sintéticos",
    marca: "T4",
    aplicaciones: ["Expresión Génica", "Biología Sintética", "Clonación"],
    tiempoEntrega: "10-15 días",
    diferenciador: "+150 plásmidos, optimización de codones, verificación Sanger/Nanopore",
  },
  {
    id: "gigascript-hs",
    nombre: "GIGAscript™ Hot Start",
    categoria: "Enzimas GIGAscript™",
    marca: "T4",
    aplicaciones: ["PCR", "qPCR"],
    tiempoEntrega: "3-5 días",
    sku: "GS-HS-000",
    diferenciador: "Activación por aptámeros, cero amplificación inespecífica",
  },
  {
    id: "gigascript-rt",
    nombre: "GIGAscript™ RT",
    categoria: "Enzimas GIGAscript™",
    marca: "T4",
    aplicaciones: ["RT-PCR", "Expresión Génica"],
    tiempoEntrega: "3-5 días",
    sku: "GS-RT-000",
    diferenciador: "Transcriptasa reversa termoestable, sensibilidad extrema",
  },
  {
    id: "gigamaster-onestep",
    nombre: "GIGAmaster™ One-Step",
    categoria: "Enzimas GIGAscript™",
    marca: "T4",
    aplicaciones: ["RT-PCR", "qPCR", "Diagnóstico"],
    tiempoEntrega: "3-5 días",
    sku: "GS-OS-000",
    diferenciador: "All-in-one RT + Taq, buffer universal",
  },
  {
    id: "nextpure",
    nombre: "NextPure™",
    categoria: "Extracción NextPure™",
    marca: "T4",
    aplicaciones: ["Extracción ADN", "Extracción RNA", "Purificación"],
    variantes: ["NextPure™ (clínico/ambiental)", "NextPure™ Vet (pecuario)", "NextPure™ Plant (vegetal)", "NextPure™ High Plant (alto volumen)"],
    tiempoEntrega: "3-5 días",
    diferenciador: "Perlas magnéticas, sin columnas, eco-friendly, ultra-rápido",
  },
  {
    id: "sentinel",
    nombre: "Sentinel™",
    categoria: "Kits Sentinel™",
    marca: "T4",
    variantes: [
      "Sentinel™ Agro: Fusarium, Phytophthora, Cercospora y más",
      "Sentinel™ Food: E. coli, Salmonella, Listeria, Hepatitis, OGMs",
      "Sentinel™ Vet: Influenza H5N1, Newcastle, WSSV, Dengue, Zika",
    ],
    aplicaciones: ["Fitopatología", "Inocuidad Alimentaria", "Sanidad Animal", "qPCR"],
    tiempoEntrega: "5-7 días",
    diferenciador: "Integra GIGAscript™ + StarQ™ + PrimeReady™ Control, arquitectura abierta, RUO",
  },
  {
    id: "reactivos-esenciales",
    nombre: "Reactivos Esenciales",
    categoria: "Reactivos",
    marca: "T4",
    aplicaciones: ["PCR", "Electroforesis", "General"],
    incluye: "dNTPs, Ladders, colorantes, agarosa, agua grado BioMol, consumibles, equipamiento",
    tiempoEntrega: "3-5 días",
  },
  {
    id: "marcas-aliadas",
    nombre: "Marcas Aliadas",
    categoria: "Distribuciones",
    partners: ["LGC Biosearch Technologies® (PCR moderna, alto rendimiento)", "Genes2Life® (detección de patógenos AI-powered)"],
    tiempoEntrega: "5-10 días",
  },
  {
    id: "secuenciacion",
    nombre: "Secuenciación Genética",
    categoria: "Servicios",
    marca: "T4",
    servicios: ["Sanger (verificación, plásmidos, mutaciones)", "NGS (metagenómica, RNA-seq, vigilancia genómica)"],
    tiempoEntrega: "5-30 días según complejidad",
  },
  {
    id: "servicios-especializados",
    nombre: "Servicios Especializados",
    categoria: "Servicios",
    marca: "T4",
    servicios: ["Identificación de rasgos productivos por qPCR", "Detección certificada de patógenos", "Análisis de OGMs", "Metagenómica (NGS)", "Gestión integral de muestras (Prep & Qubit)"],
    tiempoEntrega: "Variable",
  },
  {
    id: "soluciones-cro",
    nombre: "Soluciones CRO",
    categoria: "Servicios",
    marca: "T4",
    etapas: ["Selección de objetivos bioinformáticos", "Diseño de primers y sondas", "Estudios de estabilidad", "Verificación (LoD, R², eficiencia, reproducibilidad)"],
    tiempoEntrega: "Variable",
  },
  {
    id: "innovaciones",
    nombre: "Innovaciones T4",
    categoria: "I+D",
    marca: "T4",
    tecnologias: ["Fluoróforo MIKE™ (homólogo VIC®)", "Molécula 4BOND™ (estabilización, homólogo MGB)", "Metodología de Validación StarQ™"],
  },
];

const systemPrompt = `Eres el asistente virtual de T4, una empresa mexicana fundada en 2011 especializada en desarrollo, manufactura y distribución de reactivos y soluciones 360° en Biología Molecular. Tu rol es ayudar a investigadores y profesionales de laboratorio a encontrar los productos ideales para sus proyectos.

REGLA DE MARCA (ABSOLUTA): La empresa se llama EXCLUSIVAMENTE "T4". NUNCA escribas "T4 Oligo", "T4Oligo", "t4oligo" ni ninguna variante. Si el usuario escribe cualquiera de esas variantes, responde usando ÚNICAMENTE "T4". Los dominios técnicos (t4oligo.com, ventas@t4oligo.com) se preservan SOLO cuando das un dato de contacto literal.

IDENTIDAD DE MARCA:
"Es Biología Molecular desarrollada por y para Científicos."
- ISO 9001:2015, Hecho en México, Miembro de la OTS
- Producen en pesos y venden en pesos
- 15+ años de experiencia
- Compatibilidad con todas las plataformas de Biología Molecular
- Un solo proveedor, una sola factura

CATÁLOGO COMPLETO:
${JSON.stringify(productosData, null, 2)}

INSTRUCCIONES:
1. Identifica la aplicación del usuario (PCR, qPCR, detección de patógenos, secuenciación, clonación, etc.) y recomienda productos específicos del catálogo T4.
2. Para qPCR → recomienda sondas StarQ™ (Plus, Prime o Polaris según complejidad).
3. Para detección de patógenos → recomienda kits Sentinel™ según sector (Agro, Food, Vet).
4. Para extracción → recomienda NextPure™ según matriz (clínica, animal, vegetal).
5. Para PCR → recomienda enzimas GIGAscript™.
6. Para genes sintéticos → T4Bricks™ (fragmentos) o T4Gene™ (genes completos).
7. Para proyectos complejos → sugiere Soluciones CRO.
8. Menciona siempre el tiempo de entrega estimado.
9. Para contacto especializado, refiere al "Colega Científico T4".
10. Todos los productos Sentinel™ y PrimeReady™ Med/Control son RUO.

FORMATO:
- Markdown con listas y negritas
- Conciso pero informativo
- SIEMPRE en español
- Amigable y profesional`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("product-assistant error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
