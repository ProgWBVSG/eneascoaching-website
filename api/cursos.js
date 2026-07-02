import { createClient } from '@supabase/supabase-js';

// Elimina BOM/espacios de las env vars (problema de encoding en Windows)
const env = (key) => (process.env[key] || '').replace(/^﻿/, '').trim();
const sb = () => createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'));

const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const genCode = (n = 8) => Array.from({ length: n }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');

function isAdmin(req) {
  return req.headers['x-admin-token'] === env('ADMIN_PASSWORD');
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
        .select('id, code, client_name, curso_id')
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
        curso,
        modulos: tree,
        completadas: (progreso || []).map(p => p.leccion_id),
      });
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

    // ─── ADMIN (requiere token) ───────────────────────────────────────
    if (!isAdmin(req)) return res.status(401).json({ error: 'No autorizado' });

    // Cursos
    if (action === 'courses') {
      if (req.method === 'GET') {
        const { data } = await supabase.from('cursos').select('*').order('position');
        return res.status(200).json(data || []);
      }
      if (req.method === 'POST') {
        const { id, title, description, cover_image_url, published, position } = req.body || {};
        if (!title?.trim()) return res.status(400).json({ error: 'Título requerido' });
        const row = { title: title.trim(), description: description || null, cover_image_url: cover_image_url || null, published: published !== false, position: position || 0 };
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
        const { curso_id, client_name } = req.body || {};
        let code = '';
        for (let i = 0; i < 10; i++) {
          code = genCode(8);
          const { data: ex } = await supabase.from('curso_accesos').select('id').eq('code', code).maybeSingle();
          if (!ex) break;
        }
        const { data, error } = await supabase.from('curso_accesos')
          .insert({ code, curso_id, client_name: (client_name || '').trim() || null }).select().single();
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
      }
      if (req.method === 'DELETE') {
        await supabase.from('curso_accesos').delete().eq('id', req.query.id);
        return res.status(200).json({ success: true });
      }
    }

    return res.status(400).json({ error: 'Acción inválida' });
  } catch (e) {
    console.error('cursos API error:', e);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}
