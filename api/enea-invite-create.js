import { createClient } from '@supabase/supabase-js';

const env = (key) => (process.env[key] || '').replace(/^﻿/, '').trim();

// Caracteres sin ambigüedad (sin 0/O, 1/l/I)
const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function generateCode(length = 8) {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return code;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const token = req.headers['x-admin-token'];
  if (token !== env('ADMIN_PASSWORD')) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const supabase = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'));
  const { client_name } = req.body || {};

  // Generar código único (con reintentos si ya existe)
  let code = '';
  for (let attempt = 0; attempt < 10; attempt++) {
    code = generateCode(8);
    const { data: existing } = await supabase
      .from('enea_completo_invites')
      .select('id')
      .eq('code', code)
      .maybeSingle();
    if (!existing) break;
  }

  const { data, error } = await supabase
    .from('enea_completo_invites')
    .insert({
      code,
      client_name: (client_name || '').trim() || null,
    })
    .select('id, code, client_name, created_at')
    .single();

  if (error) {
    console.error('Supabase invite create error:', error);
    return res.status(500).json({ error: 'No se pudo crear el código' });
  }

  return res.status(200).json({ success: true, ...data });
}
