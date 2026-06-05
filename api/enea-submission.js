import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const token = req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'ID requerido' });

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('enea_submissions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ error: 'No encontrado' });
    return res.status(200).json(data);
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('enea_submissions')
      .delete()
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  return res.status(405).end();
}
