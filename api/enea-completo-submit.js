import { createClient } from '@supabase/supabase-js';

const env = (key) => (process.env[key] || '').replace(/^﻿/, '').trim();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const supabase = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'));

  const { name, email, responses, totals } = req.body;
  if (!name?.trim())     return res.status(400).json({ error: 'El nombre es requerido' });
  if (!Array.isArray(responses)) return res.status(400).json({ error: 'Respuestas inválidas' });
  if (!totals || typeof totals !== 'object') return res.status(400).json({ error: 'Totales inválidos' });

  // Determinar tipo dominante
  let dominantType = 1;
  let max = -1;
  for (let i = 1; i <= 9; i++) {
    const val = Number(totals[i]) || 0;
    if (val > max) { max = val; dominantType = i; }
  }

  const { data, error } = await supabase
    .from('enea_completo_submissions')
    .insert({
      name: name.trim(),
      email: (email || '').trim() || null,
      responses,
      type1_total: Number(totals[1]) || 0,
      type2_total: Number(totals[2]) || 0,
      type3_total: Number(totals[3]) || 0,
      type4_total: Number(totals[4]) || 0,
      type5_total: Number(totals[5]) || 0,
      type6_total: Number(totals[6]) || 0,
      type7_total: Number(totals[7]) || 0,
      type8_total: Number(totals[8]) || 0,
      type9_total: Number(totals[9]) || 0,
      dominant_type: dominantType,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: 'Error al guardar la respuesta' });
  }

  return res.status(200).json({ success: true, id: data.id });
}
