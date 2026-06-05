import { createClient } from '@supabase/supabase-js';

const env = (key) => (process.env[key] || '').replace(/^﻿/, '').trim();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const supabase = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'));

  const {
    code,
    name, email,
    date_of_birth, age, gender, marital_status, profession, zodiac_sign,
    responses, totals,
  } = req.body;

  if (!code)                     return res.status(400).json({ error: 'Código de acceso requerido' });
  if (!name?.trim())             return res.status(400).json({ error: 'El nombre es requerido' });
  if (!Array.isArray(responses)) return res.status(400).json({ error: 'Respuestas inválidas' });
  if (!totals || typeof totals !== 'object') return res.status(400).json({ error: 'Totales inválidos' });

  // Validar código de invitación
  const upperCode = String(code).toUpperCase();
  const { data: invite } = await supabase
    .from('enea_completo_invites')
    .select('id, used')
    .eq('code', upperCode)
    .maybeSingle();

  if (!invite)      return res.status(403).json({ error: 'Link inválido' });
  if (invite.used)  return res.status(403).json({ error: 'Este link ya fue utilizado' });

  // Calcular tipo dominante
  let dominantType = 1;
  let max = -1;
  for (let i = 1; i <= 9; i++) {
    const val = Number(totals[i]) || 0;
    if (val > max) { max = val; dominantType = i; }
  }

  // Insertar submission
  const { data: submission, error: insertError } = await supabase
    .from('enea_completo_submissions')
    .insert({
      name: name.trim(),
      email: (email || '').trim() || null,
      date_of_birth: date_of_birth || null,
      age: age != null ? Number(age) : null,
      gender: gender || null,
      marital_status: marital_status || null,
      profession: (profession || '').trim() || null,
      zodiac_sign: zodiac_sign || null,
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

  if (insertError) {
    console.error('Supabase insert error:', insertError);
    return res.status(500).json({ error: 'Error al guardar la respuesta' });
  }

  // Marcar el código como usado
  await supabase
    .from('enea_completo_invites')
    .update({ used: true, submission_id: submission.id })
    .eq('id', invite.id);

  return res.status(200).json({ success: true, id: submission.id });
}
