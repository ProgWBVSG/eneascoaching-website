import { createClient } from '@supabase/supabase-js';

const env = (key) => (process.env[key] || '').replace(/^﻿/, '').trim();

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { code } = req.query;
  if (!code) return res.status(400).json({ valid: false, error: 'Código requerido' });

  const supabase = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'));

  const { data, error } = await supabase
    .from('enea_completo_invites')
    .select('id, code, client_name, used, submission_id')
    .eq('code', String(code).toUpperCase())
    .maybeSingle();

  if (error || !data) {
    return res.status(404).json({ valid: false, error: 'Link inválido o expirado' });
  }

  if (data.used) {
    return res.status(403).json({ valid: false, error: 'Este link ya fue utilizado' });
  }

  return res.status(200).json({ valid: true, client_name: data.client_name });
}
