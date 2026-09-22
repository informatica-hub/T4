const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM = 'T4 <uracilo@t4mexico.com>'
const INTERNAL_RECIPIENTS = ['proyectos@t4oligo.com', 'vinculacion@t4oligo.com']
const BRAND = '#384747'
const BG = '#FAF5F2'

interface PedidoProduct {
  product_name: string
  catalog_number?: string | null
  category?: string | null
}

interface PedidoPayload {
  type: 'pedido'
  institution: string
  laboratory: string
  email: string
  notes?: string | null
  trigger_product_name?: string | null
  products: PedidoProduct[]
}

interface ContactoPayload {
  type: 'contacto'
  nombre: string
  email: string
  institucion?: string | null
  telefono?: string | null
  mensaje: string
}

type Payload = PedidoPayload | ContactoPayload

const escape = (s: string) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))

const shell = (title: string, body: string) => `
<!doctype html><html><body style="margin:0;padding:0;background:${BG};font-family:Arial,Helvetica,sans-serif;color:#1a1a1a">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;padding:0">
    <div style="background:${BRAND};color:#ffffff;padding:20px 28px"><h1 style="margin:0;font-size:20px;font-weight:600">${escape(title)}</h1><p style="margin:4px 0 0;font-size:12px;opacity:.85">T4 — Síntesis de oligonucleótidos</p></div>
    <div style="padding:24px 28px;font-size:14px;line-height:1.55">${body}</div>
    <div style="padding:16px 28px;background:${BG};color:#666;font-size:11px;border-top:1px solid #eee">Este mensaje fue generado automáticamente desde t4mexico.com</div>
  </div></body></html>`

const row = (k: string, v: string) =>
  `<tr><td style="padding:6px 12px 6px 0;color:#666;vertical-align:top;white-space:nowrap"><strong>${escape(k)}</strong></td><td style="padding:6px 0;vertical-align:top">${v}</td></tr>`

function pedidoInternal(p: PedidoPayload) {
  const items = p.products
    .map(
      (x, i) =>
        `<li style="margin:0 0 6px"><strong>${i + 1}.</strong> ${escape(x.product_name)}${x.catalog_number ? ` <span style="color:#666;font-family:monospace">(${escape(x.catalog_number)})</span>` : ''}${x.category ? ` <span style="color:#888;font-size:12px">— ${escape(x.category)}</span>` : ''}</li>`,
    )
    .join('')
  return shell(
    'Nueva solicitud · Arma tu Proyecto',
    `<table style="width:100%;border-collapse:collapse;margin-bottom:18px">
      ${row('Institución', escape(p.institution))}
      ${row('Laboratorio', escape(p.laboratory))}
      ${row('Contacto', `<a href="mailto:${escape(p.email)}" style="color:${BRAND}">${escape(p.email)}</a>`)}
      ${p.trigger_product_name ? row('Producto principal', escape(p.trigger_product_name)) : ''}
    </table>
    <h3 style="margin:18px 0 8px;color:${BRAND};font-size:14px">Productos solicitados (${p.products.length})</h3>
    <ul style="padding-left:18px;margin:0">${items}</ul>
    ${p.notes ? `<h3 style="margin:18px 0 8px;color:${BRAND};font-size:14px">Notas</h3><p style="white-space:pre-wrap;margin:0">${escape(p.notes)}</p>` : ''}`,
  )
}

function pedidoAck(p: PedidoPayload) {
  return shell(
    'Recibimos tu solicitud',
    `<p>Hola,</p><p>Confirmamos la recepción de tu solicitud para <strong>${escape(p.institution)}</strong>. Un especialista de T4 se pondrá en contacto contigo a la brevedad.</p>
     <p style="margin:16px 0 6px"><strong>Resumen:</strong></p>
     <ul style="padding-left:18px;margin:0">${p.products.map((x) => `<li>${escape(x.product_name)}${x.catalog_number ? ` <span style="color:#666;font-family:monospace">(${escape(x.catalog_number)})</span>` : ''}</li>`).join('')}</ul>
     <p style="margin-top:18px">Si necesitas agregar información, responde directamente a este correo.</p>
     <p style="margin-top:20px;color:${BRAND}"><strong>Equipo T4</strong></p>`,
  )
}

function contactoInternal(c: ContactoPayload) {
  return shell(
    'Nuevo mensaje · Formulario de Contacto',
    `<table style="width:100%;border-collapse:collapse;margin-bottom:18px">
      ${row('Nombre', escape(c.nombre))}
      ${row('Correo', `<a href="mailto:${escape(c.email)}" style="color:${BRAND}">${escape(c.email)}</a>`)}
      ${c.institucion ? row('Institución', escape(c.institucion)) : ''}
      ${c.telefono ? row('Teléfono', escape(c.telefono)) : ''}
    </table>
    <h3 style="margin:18px 0 8px;color:${BRAND};font-size:14px">Mensaje</h3>
    <p style="white-space:pre-wrap;margin:0;padding:12px;background:${BG};border-radius:6px">${escape(c.mensaje)}</p>`,
  )
}

function contactoAck(c: ContactoPayload) {
  return shell(
    'Recibimos tu mensaje',
    `<p>Hola ${escape(c.nombre)},</p><p>Gracias por escribirnos. Hemos recibido tu mensaje y nuestro equipo te responderá a la brevedad.</p>
     <p style="margin:16px 0 6px"><strong>Tu mensaje:</strong></p>
     <p style="white-space:pre-wrap;margin:0;padding:12px;background:${BG};border-radius:6px">${escape(c.mensaje)}</p>
     <p style="margin-top:20px;color:${BRAND}"><strong>Equipo T4</strong></p>`,
  )
}

async function sendEmail(args: { to: string[]; subject: string; html: string; reply_to?: string }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM,
      to: args.to,
      subject: args.subject,
      html: args.html,
      ...(args.reply_to ? { reply_to: args.reply_to } : {}),
    }),
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {


    console.log(
  'RESEND_API_KEY:',
  RESEND_API_KEY ? 'CONFIGURADA' : 'NO CONFIGURADA'
)


    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = (await req.json()) as Payload
    if (!body || (body.type !== 'pedido' && body.type !== 'contacto')) {
      return new Response(JSON.stringify({ error: 'Invalid payload: type must be "pedido" or "contacto"' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const results: Record<string, unknown> = {}

    if (body.type === 'pedido') {
      if (!body.institution || !body.email || !Array.isArray(body.products)) {
        return new Response(JSON.stringify({ error: 'Missing required pedido fields' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      results.internal = await sendEmail({
        to: INTERNAL_RECIPIENTS,
        subject: `Nueva solicitud T4 — ${body.institution}`,
        html: pedidoInternal(body),
        reply_to: body.email,
      })
      results.ack = await sendEmail({
        to: [body.email],
        subject: 'Recibimos tu solicitud — T4',
        html: pedidoAck(body),
      })
    } else {
      if (!body.nombre || !body.email || !body.mensaje) {
        return new Response(JSON.stringify({ error: 'Missing required contacto fields' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      results.internal = await sendEmail({
        to: INTERNAL_RECIPIENTS,
        subject: `Nuevo contacto T4 — ${body.nombre}`,
        html: contactoInternal(body),
        reply_to: body.email,
      })
      results.ack = await sendEmail({
        to: [body.email],
        subject: 'Recibimos tu mensaje — T4',
        html: contactoAck(body),
      })
    }

    return new Response(JSON.stringify({ ok: true, results }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('send-project-notification error:', err)
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
