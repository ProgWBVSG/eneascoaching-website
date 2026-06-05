import { createClient } from '@supabase/supabase-js';

// Elimina BOM y espacios de variables de entorno (problema de encoding en Windows)
const env = (key) => (process.env[key] || '').replace(/^﻿/, '').trim();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const supabase = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'));

  const { name, answers } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'El nombre es requerido' });
  if (!answers)       return res.status(400).json({ error: 'Las respuestas son requeridas' });

  const totals = {};
  for (let i = 1; i <= 9; i++) {
    totals[i] = (answers[`type${i}`] || []).length;
  }
  const dominantType = Object.entries(totals).reduce((a, b) => b[1] > a[1] ? b : a)[0];

  const { data, error } = await supabase
    .from('enea_submissions')
    .insert({
      name: name.trim(),
      type1_selected: answers.type1 || [],
      type2_selected: answers.type2 || [],
      type3_selected: answers.type3 || [],
      type4_selected: answers.type4 || [],
      type5_selected: answers.type5 || [],
      type6_selected: answers.type6 || [],
      type7_selected: answers.type7 || [],
      type8_selected: answers.type8 || [],
      type9_selected: answers.type9 || [],
      type1_total: totals[1], type2_total: totals[2], type3_total: totals[3],
      type4_total: totals[4], type5_total: totals[5], type6_total: totals[6],
      type7_total: totals[7], type8_total: totals[8], type9_total: totals[9],
      dominant_type: parseInt(dominantType),
    })
    .select('id')
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: 'Error al guardar la respuesta' });
  }

  return res.status(200).json({ success: true, id: data.id });
}
