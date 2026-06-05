import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const token = req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('enea_submissions')
      .select(`id, name, dominant_type,
        type1_total, type2_total, type3_total,
        type4_total, type5_total, type6_total,
        type7_total, type8_total, type9_total,
        created_at`)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  return res.status(405).end();
}
