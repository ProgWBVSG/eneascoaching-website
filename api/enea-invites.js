import { createClient } from '@supabase/supabase-js';

const env = (key) => (process.env[key] || '').replace(/^﻿/, '').trim();

export default async function handler(req, res) {
  const token = req.headers['x-admin-token'];
  if (token !== env('ADMIN_PASSWORD')) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const supabase = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'));

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('enea_completo_invites')
      .select('id, code, client_name, used, submission_id, created_at')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'ID requerido' });
    const { error } = await supabase
      .from('enea_completo_invites')
      .delete()
      .eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  return res.status(405).end();
}
