import { createClient } from '@supabase/supabase-js';

// Elimina BOM/espacios de las env vars (problema de encoding en Windows)
const env = (key) => (process.env[key] || '').replace(/^﻿/, '').trim();
const sb = () => createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'));

const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const genCode = (n = 8) => Array.from({ length: n }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');

function isAdmin(req) {
  return req.headers['x-admin-token'] === env('ADMIN_PASSWORD');
}

// ── MercadoPago ──────────────────────────────────────────────────────
const MP_TOKEN = () => env('MP_ACCESS_TOKEN');
const SITE = () => env('SITE_URL') || 'https://eneascoaching.vercel.app';

async function mpGetPayment(paymentId) {
  try {
    const r = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${MP_TOKEN()}` },
    });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

// Confirma una venta: genera el código de acceso al curso y actualiza la venta.
async function finalizeSale(supabase, sale, payment) {
  if (sale.status === 'approved' && sale.access_code) return sale.access_code;
  let code = '';
  for (let i = 0; i < 10; i++) {
    code = genCode(8);
    const { data: ex } = await supabase.from('curso_accesos').select('id').eq('code', code).maybeSingle();
    if (!ex) break;
  }
  const buyerName = payment?.payer?.first_name
    ? `${payment.payer.first_name} ${payment.payer.last_name || ''}`.trim()
    : 'Compra online';
  await supabase.from('curso_accesos').insert({ code, curso_id: sale.curso_id, client_name: buyerName, is_general: false });
  await supabase.from('curso_ventas').update({
    status: 'approved', access_code: code,
    mp_payment_id: String(payment?.id || ''),
    buyer_name: buyerName,
    buyer_email: payment?.payer?.email || null,
  }).eq('id', sale.id);
  return code;
}

export default async function handler(req, res) {
  const supabase = sb();
  const action = req.query.action;

  try {
    // ─── CLIENTE (sin token) ──────────────────────────────────────────
    if (action === 'get') {
      const code = String(req.query.code || '').toUpperCase();
      if (!code) return res.status(400).json({ error: 'Código requerido' });

      const { data: acceso } = await supabase
        .from('curso_accesos')
        .select('id, code, client_name, curso_id, is_general')
        .eq('code', code)
        .maybeSingle();
      if (!acceso) return res.status(404).json({ error: 'Link inválido o expirado' });

      const { data: curso } = await supabase
        .from('cursos').select('*').eq('id', acceso.curso_id).maybeSingle();
      if (!curso) return res.status(404).json({ error: 'Curso no encontrado' });

      const { data: modulos } = await supabase
        .from('curso_modulos').select('*').eq('curso_id', curso.id).order('position');
      const moduloIds = (modulos || []).map(m => m.id);

      let lecciones = [];
      let recursos = [];
      if (moduloIds.length) {
        const { data: lecc } = await supabase
          .from('curso_lecciones').select('*').in('modulo_id', moduloIds).order('position');
        lecciones = lecc || [];
        const leccIds = lecciones.map(l => l.id);
        if (leccIds.length) {
          const { data: recs } = await supabase
            .from('curso_recursos').select('*').in('leccion_id', leccIds).order('position');
          recursos = recs || [];
        }
      }

      const { data: progreso } = await supabase
        .from('curso_progreso').select('leccion_id').eq('code', code).eq('completed', true);

      // Armar árbol
      const tree = (modulos || []).map(m => ({
        ...m,
        lecciones: lecciones.filter(l => l.modulo_id === m.id).map(l => ({
          ...l,
          recursos: recursos.filter(r => r.leccion_id === l.id),
        })),
      }));

      return res.status(200).json({
        client_name: acceso.client_name,
        is_general: !!acceso.is_general,
        curso,
        modulos: tree,
        completadas: (progreso || []).map(p => p.leccion_id),
      });
    }

    // Feedback de la clienta al terminar (sin token)
    if (action === 'feedback' && req.method === 'POST') {
      const { code, rating, comment, client_name } = req.body || {};
      if (!code) return res.status(400).json({ error: 'Código requerido' });
      const upperCode = String(code).toUpperCase();
      const { data: acceso } = await supabase
        .from('curso_accesos').select('id, curso_id').eq('code', upperCode).maybeSingle();
      if (!acceso) return res.status(403).json({ error: 'No autorizado' });

      const { error } = await supabase.from('curso_feedback').insert({
        curso_id: acceso.curso_id,
        code: upperCode,
        client_name: (client_name || '').trim() || null,
        rating: rating != null ? Number(rating) : null,
        comment: (comment || '').trim() || null,
      });
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true });
    }

    if (action === 'progress' && req.method === 'POST') {
      const { code, leccion_id, completed } = req.body || {};
      if (!code || !leccion_id) return res.status(400).json({ error: 'Datos inválidos' });
      const upperCode = String(code).toUpperCase();

      const { data: acceso } = await supabase
        .from('curso_accesos').select('id').eq('code', upperCode).maybeSingle();
      if (!acceso) return res.status(403).json({ error: 'No autorizado' });

      const { error } = await supabase
        .from('curso_progreso')
        .upsert({ code: upperCode, leccion_id, completed: !!completed, completed_at: new Date().toISOString() },
          { onConflict: 'code,leccion_id' });
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ success: true });
    }

    // Info pública de un curso a la venta (para la página de compra)
    if (action === 'sale-info' && req.method === 'GET') {
      const { data: curso } = await supabase.from('cursos')
        .select('id, title, description, cover_image_url, price, for_sale').eq('id', req.query.curso_id).maybeSingle();
      if (!curso) return res.status(404).json({ error: 'No encontrado' });
      const { data: modulos } = await supabase.from('curso_modulos').select('id').eq('curso_id', curso.id);
      const moduloIds = (modulos || []).map(m => m.id);
      let leccCount = 0, recCount = 0;
      if (moduloIds.length) {
        const { data: lecc } = await supabase.from('curso_lecciones').select('id').in('modulo_id', moduloIds);
        leccCount = (lecc || []).length;
        const leccIds = (lecc || []).map(l => l.id);
        if (leccIds.length) {
          const { count } = await supabase.from('curso_recursos').select('id', { count: 'exact', head: true }).in('leccion_id', leccIds);
          recCount = count || 0;
        }
      }
      return res.status(200).json({ curso, modulos_count: moduloIds.length, lecciones_count: leccCount, recursos_count: recCount });
    }

    // Crear pago (Checkout Pro de MercadoPago)
    if (action === 'pay-create' && req.method === 'POST') {
      const { curso_id } = req.body || {};
      const { data: curso } = await supabase.from('cursos').select('id, title, price, for_sale').eq('id', curso_id).maybeSingle();
      if (!curso || !curso.for_sale || !curso.price) return res.status(400).json({ error: 'Curso no disponible para la venta' });
      if (!MP_TOKEN()) return res.status(500).json({ error: 'Los pagos no están configurados todavía' });

      const { data: sale, error: se } = await supabase.from('curso_ventas')
        .insert({ curso_id: curso.id, amount: curso.price, status: 'pending' }).select('id').single();
      if (se) return res.status(500).json({ error: 'No se pudo iniciar la compra' });

      const pref = {
        items: [{ title: curso.title, quantity: 1, unit_price: Number(curso.price), currency_id: 'ARS' }],
        external_reference: sale.id,
        back_urls: {
          success: `${SITE()}/#/compra-exito/${sale.id}`,
          pending: `${SITE()}/#/compra-exito/${sale.id}`,
          failure: `${SITE()}/#/comprar/${curso.id}`,
        },
        auto_return: 'approved',
        notification_url: `${SITE()}/api/cursos?action=pay-webhook`,
      };
      const r = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: { Authorization: `Bearer ${MP_TOKEN()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(pref),
      });
      const data = await r.json();
      if (!r.ok) { console.error('MP pref error:', data); return res.status(500).json({ error: 'No se pudo crear el pago' }); }
      await supabase.from('curso_ventas').update({ mp_preference_id: data.id }).eq('id', sale.id);
      return res.status(200).json({ init_point: data.init_point });
    }

    // Webhook de MercadoPago (avisa cuando se paga)
    if (action === 'pay-webhook') {
      const paymentId = (req.body && req.body.data && req.body.data.id) || req.query['data.id'] || req.query.id;
      const topic = (req.body && req.body.type) || req.query.type || req.query.topic;
      if ((topic && topic !== 'payment') || !paymentId) return res.status(200).json({ ok: true });
      const payment = await mpGetPayment(paymentId);
      if (payment && payment.status === 'approved' && payment.external_reference) {
        const { data: sale } = await supabase.from('curso_ventas').select('*').eq('id', payment.external_reference).maybeSingle();
        if (sale) await finalizeSale(supabase, sale, payment);
      }
      return res.status(200).json({ ok: true });
    }

    // Estado del pago (la página de éxito consulta acá)
    if (action === 'pay-status' && req.method === 'GET') {
      const ref = req.query.ref;
      const paymentId = req.query.payment_id;
      if (!ref) return res.status(400).json({ error: 'ref requerido' });
      const { data: sale } = await supabase.from('curso_ventas').select('*').eq('id', ref).maybeSingle();
      if (!sale) return res.status(404).json({ status: 'not_found' });
      if (sale.status !== 'approved' && paymentId) {
        const payment = await mpGetPayment(paymentId);
        if (payment && payment.status === 'approved' && payment.external_reference === sale.id) {
          const code = await finalizeSale(supabase, sale, payment);
          return res.status(200).json({ status: 'approved', code, curso_id: sale.curso_id });
        }
      }
      if (sale.status === 'approved') return res.status(200).json({ status: 'approved', code: sale.access_code, curso_id: sale.curso_id });
      return res.status(200).json({ status: 'pending' });
    }

    // Dashboard de la comunidad (miembro con código)
    if (action === 'com-get' && req.method === 'GET') {
      const code = String(req.query.code || '').toUpperCase();
      if (!code) return res.status(400).json({ error: 'Código requerido' });
      const { data: acc } = await supabase.from('comunidad_accesos').select('member_name').eq('code', code).maybeSingle();
      if (!acc) return res.status(404).json({ error: 'Link inválido o expirado' });
      const { data: config } = await supabase.from('comunidad_config').select('*').eq('key', 'main').maybeSingle();
      const { data: items } = await supabase.from('comunidad_items').select('*').eq('published', true).order('position');
      return res.status(200).json({ member_name: acc.member_name, config: config || {}, items: items || [] });
    }

    // ─── ADMIN (requiere token) ───────────────────────────────────────
    if (!isAdmin(req)) return res.status(401).json({ error: 'No autorizado' });

    // Cursos
    if (action === 'courses') {
      if (req.method === 'GET') {
        const { data } = await supabase.from('cursos').select('*').order('position');
        return res.status(200).json(data || []);
      }
      if (req.method === 'POST') {
        const { id, title, description, cover_image_url, published, position, price, for_sale } = req.body || {};
        if (!title?.trim()) return res.status(400).json({ error: 'Título requerido' });
        const row = {
          title: title.trim(), description: description || null, cover_image_url: cover_image_url || null,
          published: published !== false, position: position || 0,
          price: price != null ? Math.round(Number(price)) : 0,
          for_sale: !!for_sale,
        };
        const q = id ? supabase.from('cursos').update(row).eq('id', id).select().single()
                     : supabase.from('cursos').insert(row).select().single();
        const { data, error } = await q;
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
      }
      if (req.method === 'DELETE') {
        await supabase.from('cursos').delete().eq('id', req.query.id);
        return res.status(200).json({ success: true });
      }
    }

    // Árbol completo de un curso (para editar)
    if (action === 'course-full' && req.method === 'GET') {
      const id = req.query.id;
      const { data: curso } = await supabase.from('cursos').select('*').eq('id', id).maybeSingle();
      if (!curso) return res.status(404).json({ error: 'No encontrado' });
      const { data: modulos } = await supabase.from('curso_modulos').select('*').eq('curso_id', id).order('position');
      const moduloIds = (modulos || []).map(m => m.id);
      let lecciones = [], recursos = [];
      if (moduloIds.length) {
        const { data: lecc } = await supabase.from('curso_lecciones').select('*').in('modulo_id', moduloIds).order('position');
        lecciones = lecc || [];
        const leccIds = lecciones.map(l => l.id);
        if (leccIds.length) {
          const { data: recs } = await supabase.from('curso_recursos').select('*').in('leccion_id', leccIds).order('position');
          recursos = recs || [];
        }
      }
      const tree = (modulos || []).map(m => ({
        ...m,
        lecciones: lecciones.filter(l => l.modulo_id === m.id).map(l => ({
          ...l, recursos: recursos.filter(r => r.leccion_id === l.id),
        })),
      }));
      return res.status(200).json({ curso, modulos: tree });
    }

    // Módulos
    if (action === 'modules') {
      if (req.method === 'POST') {
        const { id, curso_id, title, position } = req.body || {};
        if (!title?.trim()) return res.status(400).json({ error: 'Título requerido' });
        const row = { curso_id, title: title.trim(), position: position || 0 };
        const q = id ? supabase.from('curso_modulos').update({ title: row.title, position: row.position }).eq('id', id).select().single()
                     : supabase.from('curso_modulos').insert(row).select().single();
        const { data, error } = await q;
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
      }
      if (req.method === 'DELETE') {
        await supabase.from('curso_modulos').delete().eq('id', req.query.id);
        return res.status(200).json({ success: true });
      }
    }

    // Lecciones
    if (action === 'lessons') {
      if (req.method === 'POST') {
        const { id, modulo_id, title, description, video_url, position } = req.body || {};
        if (!title?.trim()) return res.status(400).json({ error: 'Título requerido' });
        const row = { modulo_id, title: title.trim(), description: description || null, video_url: video_url || null, position: position || 0 };
        const q = id ? supabase.from('curso_lecciones').update({ title: row.title, description: row.description, video_url: row.video_url, position: row.position }).eq('id', id).select().single()
                     : supabase.from('curso_lecciones').insert(row).select().single();
        const { data, error } = await q;
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
      }
      if (req.method === 'DELETE') {
        await supabase.from('curso_lecciones').delete().eq('id', req.query.id);
        return res.status(200).json({ success: true });
      }
    }

    // Recursos (descargables)
    if (action === 'resources') {
      if (req.method === 'POST') {
        const { leccion_id, name, url, position } = req.body || {};
        if (!name?.trim() || !url?.trim()) return res.status(400).json({ error: 'Nombre y link requeridos' });
        const { data, error } = await supabase.from('curso_recursos')
          .insert({ leccion_id, name: name.trim(), url: url.trim(), position: position || 0 }).select().single();
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
      }
      if (req.method === 'DELETE') {
        await supabase.from('curso_recursos').delete().eq('id', req.query.id);
        return res.status(200).json({ success: true });
      }
    }

    // Accesos (códigos por clienta)
    if (action === 'invites') {
      if (req.method === 'GET') {
        const { data } = await supabase.from('curso_accesos').select('*').eq('curso_id', req.query.curso_id).order('created_at', { ascending: false });
        return res.status(200).json(data || []);
      }
      if (req.method === 'POST') {
        const { curso_id, client_name, is_general } = req.body || {};
        let code = '';
        for (let i = 0; i < 10; i++) {
          code = genCode(8);
          const { data: ex } = await supabase.from('curso_accesos').select('id').eq('code', code).maybeSingle();
          if (!ex) break;
        }
        const { data, error } = await supabase.from('curso_accesos')
          .insert({
            code, curso_id,
            client_name: is_general ? 'Link general' : ((client_name || '').trim() || null),
            is_general: !!is_general,
          }).select().single();
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
      }
      if (req.method === 'DELETE') {
        await supabase.from('curso_accesos').delete().eq('id', req.query.id);
        return res.status(200).json({ success: true });
      }
    }

    // Feedback recibido de un curso (admin lee)
    if (action === 'feedbacks' && req.method === 'GET') {
      const { data, error } = await supabase.from('curso_feedback')
        .select('*').eq('curso_id', req.query.curso_id).order('created_at', { ascending: false });
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data || []);
    }

    // TODO el feedback de todos los cursos (admin, panel principal)
    if (action === 'all-feedbacks' && req.method === 'GET') {
      const { data, error } = await supabase.from('curso_feedback')
        .select('*, cursos(title)').order('created_at', { ascending: false });
      if (error) return res.status(500).json({ error: error.message });
      const flat = (data || []).map(f => ({ ...f, curso_title: f.cursos?.title || null, cursos: undefined }));
      return res.status(200).json(flat);
    }

    // ── Comunidad: configuración (admin) ──
    if (action === 'com-config') {
      if (req.method === 'GET') {
        const { data } = await supabase.from('comunidad_config').select('*').eq('key', 'main').maybeSingle();
        return res.status(200).json(data || {});
      }
      if (req.method === 'POST') {
        const b = req.body || {};
        const row = {
          key: 'main',
          welcome_title: b.welcome_title || null, welcome_text: b.welcome_text || null,
          whatsapp_url: b.whatsapp_url || null, zoom_url: b.zoom_url || null, zoom_text: b.zoom_text || null,
          onboarding_url: b.onboarding_url || null, onboarding_text: b.onboarding_text || null,
          updated_at: new Date().toISOString(),
        };
        const { error } = await supabase.from('comunidad_config').upsert(row, { onConflict: 'key' });
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ success: true });
      }
    }

    // ── Comunidad: items del dashboard (admin) ──
    if (action === 'com-items') {
      if (req.method === 'GET') {
        const { data } = await supabase.from('comunidad_items').select('*').order('position');
        return res.status(200).json(data || []);
      }
      if (req.method === 'POST') {
        const b = req.body || {};
        if (!b.title?.trim() || !b.pillar) return res.status(400).json({ error: 'Título y pilar requeridos' });
        const row = {
          pillar: b.pillar, kind: b.kind || 'link', title: b.title.trim(), description: b.description || null,
          url: b.url || null, curso_code: b.curso_code || null, position: b.position || 0, published: b.published !== false,
        };
        const q = b.id ? supabase.from('comunidad_items').update(row).eq('id', b.id).select().single()
                       : supabase.from('comunidad_items').insert(row).select().single();
        const { data, error } = await q;
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
      }
      if (req.method === 'DELETE') {
        await supabase.from('comunidad_items').delete().eq('id', req.query.id);
        return res.status(200).json({ success: true });
      }
    }

    // ── Comunidad: accesos de miembros (admin) ──
    if (action === 'com-invites') {
      if (req.method === 'GET') {
        const { data } = await supabase.from('comunidad_accesos').select('*').order('created_at', { ascending: false });
        return res.status(200).json(data || []);
      }
      if (req.method === 'POST') {
        const b = req.body || {};
        let code = '';
        for (let i = 0; i < 10; i++) {
          code = genCode(8);
          const { data: ex } = await supabase.from('comunidad_accesos').select('id').eq('code', code).maybeSingle();
          if (!ex) break;
        }
        const { data, error } = await supabase.from('comunidad_accesos')
          .insert({ code, member_name: b.is_general ? 'Link general' : ((b.member_name || '').trim() || null), is_general: !!b.is_general })
          .select().single();
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
      }
      if (req.method === 'DELETE') {
        await supabase.from('comunidad_accesos').delete().eq('id', req.query.id);
        return res.status(200).json({ success: true });
      }
    }

    return res.status(400).json({ error: 'Acción inválida' });
  } catch (e) {
    console.error('cursos API error:', e);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}
