// supabase/functions/notify-customer-new-message/index.ts
//
// Notifica por email al cliente cuando un agente envía el primer
// mensaje en una conversación donde el cliente aún no ha escrito.
//
// Reglas:
//   - Solo se ejecuta si el caller es admin (JWT + user_roles.role = 'admin').
//   - Solo envía si la conversación no tiene notified_customer_at.
//   - Solo envía si NO existe ningún mensaje previo con sender_role = 'customer'.
//   - Si Resend falla, libera el flag para permitir reintento.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

// FROM unificado con el resto de transaccionales de T4
const FROM = 'T4 Soporte <no-reply@t4mexico.com>'

// reply_to a un buzón real: si el cliente responde al correo, llega a ventas.
// Cambia esto si prefieres soporte@t4mexico.com
const REPLY_TO = 'ventas@t4oligo.com'

const BRAND = '#384747'
const BG = '#FAF5F2'
const SITE_URL = 'https://t4mexico.com'
const CHAT_URL = `${SITE_URL}/?chat=open`

const admin = SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  : null

// ==========================================
// Helpers de HTML
// ==========================================
const escape = (s: string) =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!)
  )

const shell = (title: string, body: string) => `
<!doctype html><html><body style="margin:0;padding:0;background:${BG};font-family:Arial,Helvetica,sans-serif;color:#1a1a1a">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;padding:0; border-radius:12px;overflow:hidden">
    <div style="background:${BRAND};color:#ffffff;padding:20px 28px">
      <h1 style="margin:0;font-size:20px;font-weight:600">${escape(title)}</h1>
    </div>
    <div style="padding:24px 28px;font-size:14px;line-height:1.55">${body}</div>
    <div style="padding:16px 28px;background:${BG};color:#666;font-size:11px;border-top:1px solid #eee">
      Este mensaje fue generado automáticamente desde t4mexico.com
    </div>
  </div></body></html>`

const button = (url: string, label: string) => `
  <a href="${escape(url)}"
     style="display:inline-block;background:${BRAND};color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:600;font-size:14px;margin:8px 0">
    ${escape(label)}
  </a>`

function supportStartedEmail(clienteNombre: string, preview: string) {
  return shell(
    'Un miembro del equipo quiere contactarte',
    `<p>Hola, ${escape(clienteNombre)}</p>
     <p>Un miembro del equipo de soporte de T4 te escribió por el chat. Puedes responder directamente desde el widget de soporte.</p>
     <p style="margin:16px 0 8px"><strong>Vista previa del mensaje:</strong></p>
     <p style="white-space:pre-wrap;margin:0;padding:12px;background:${BG};border-radius:8px">${escape(preview)}</p>
     <p style="margin-top:24px">${button(CHAT_URL, '💬 Abrir chat de soporte')}</p>
     <p style="margin-top:16px;font-size:12px;color:#888">
       Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
       <a href="${escape(CHAT_URL)}" style="color:#888">${escape(CHAT_URL)}</a>
     </p>
     <p style="margin-top:20px;color:${BRAND}"><strong>Equipo T4 — Soporte</strong></p>`
  )
}

async function sendEmail(args: { to: string; subject: string; html: string }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM,
      to: [args.to],
      subject: args.subject,
      html: args.html,
      reply_to: REPLY_TO,
    }),
  })
  const data = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, data }
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

// ==========================================
// Handler
// ==========================================
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  if (!RESEND_API_KEY || !admin) {
    return json({ error: 'Server not configured' }, 500)
  }

  try {
    // 1. Validar JWT
    const authHeader = req.headers.get('Authorization') ||
                       req.headers.get('authorization') || ''
    if (!authHeader.toLowerCase().startsWith('bearer ')) {
      return json({ error: 'Unauthorized: missing bearer token' }, 401)
    }
    const jwt = authHeader.slice(7).trim()

    const { data: userData, error: userErr } = await admin.auth.getUser(jwt)
    if (userErr || !userData?.user) {
      return json({ error: 'Unauthorized: invalid token' }, 401)
    }
    const callerId = userData.user.id

    // 2. Validar rol admin
    const { data: roleRow } = await admin
      .from('user_roles')
      .select('role')
      .eq('user_id', callerId)
      .eq('role', 'admin')
      .maybeSingle()

    if (!roleRow) {
      return json({ error: 'Forbidden: admin role required' }, 403)
    }

    // 3. Input
    const body = await req.json().catch(() => null)
    const conversationId = body?.conversationId as string | undefined
    const messageId = body?.messageId as string | undefined

    if (!conversationId || !messageId) {
      return json({ error: 'Bad request: conversationId and messageId required' }, 400)
    }

    // 4. Verificar que el mensaje es de un agente y pertenece a la conversación
    const { data: msg, error: msgErr } = await admin
      .from('messages')
      .select('id, conversation_id, sender_role, content')
      .eq('id', messageId)
      .eq('conversation_id', conversationId)
      .maybeSingle()

    if (msgErr || !msg) {
      return json({ error: 'Message not found' }, 404)
    }
    if (msg.sender_role !== 'agent') {
      return json({ skipped: 'not_an_agent_message' })
    }

    // 5. ¿Hay algún mensaje previo del cliente? Si sí, no notificamos.
    const { count: customerMsgCount, error: countErr } = await admin
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('conversation_id', conversationId)
      .eq('sender_role', 'customer')

    if (countErr) {
      console.error('Error contando mensajes del cliente:', countErr)
      return json({ error: 'Internal error checking prior messages' }, 500)
    }
    if ((customerMsgCount ?? 0) > 0) {
      return json({ skipped: 'customer_already_wrote' })
    }

    // 6. Lock atómico: marca la conversación como notificada SOLO si aún no lo está.
    //    Si otro proceso ya la marcó, el UPDATE no devuelve fila.
    const { data: lockedRows, error: lockErr } = await admin
      .from('conversations')
      .update({ notified_customer_at: new Date().toISOString() })
      .eq('id', conversationId)
      .is('notified_customer_at', null)
      .select('customer_id')

    if (lockErr) {
      console.error('Error en lock atómico:', lockErr)
      return json({ error: 'Internal error locking conversation' }, 500)
    }
    if (!lockedRows || lockedRows.length === 0) {
      return json({ skipped: 'already_notified' })
    }

    const customerId = lockedRows[0].customer_id as string

    // 7. Obtener email del cliente
    const { data: authUser, error: authErr } = await admin.auth.admin.getUserById(customerId)
    if (authErr || !authUser?.user?.email) {
      await releaseLock(conversationId)
      return json({ skipped: 'no_customer_email' })
    }
    const customerEmail = authUser.user.email

    // 8. Obtener nombre del cliente (profiles)
    const { data: profile } = await admin
      .from('profiles')
      .select('full_name, company')
      .eq('user_id', customerId)
      .maybeSingle()

    const clienteNombre = profile?.full_name || profile?.company || 'cliente'

    // 9. Preview del mensaje (140 chars, escapado)
    const rawContent = (msg.content || '').replace(/\s+/g, ' ').trim()
    const preview =
      rawContent.length > 140
        ? rawContent.slice(0, 140).trimEnd() + '…'
        : rawContent || '(Mensaje con archivos adjuntos)'

    // 10. Enviar con Resend
    const result = await sendEmail({
      to: customerEmail,
      subject: 'Un miembro del equipo de soporte quiere contactarte — T4',
      html: supportStartedEmail(clienteNombre, preview),
    })

    if (!result.ok) {
      console.error('Resend error:', result.status, result.data)
      await releaseLock(conversationId)
      return json({ error: 'Email delivery failed', details: result.data }, 500)
    }

    return json({ sent: true, to: customerEmail })
  } catch (err) {
    console.error('notify-customer-new-message error:', err)
    return json({ error: (err as Error).message }, 500)
  }
})

// Libera el lock si Resend falla, para permitir reintento posterior.
async function releaseLock(conversationId: string) {
  if (!admin) return
  const { error } = await admin
    .from('conversations')
    .update({ notified_customer_at: null })
    .eq('id', conversationId)
  if (error) console.error('Error liberando lock:', error)
}