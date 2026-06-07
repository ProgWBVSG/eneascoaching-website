import { createClient } from '@supabase/supabase-js';

const env = (key) => (process.env[key] || '').replace(/^﻿/, '').trim();

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { code } = req.query;
  if (!code) return res.status(400).json({ valid: false, error: 'Código requerido' });

  const supabase = createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'));

  const { data: invite, error } = await supabase
    .from('enea_completo_invites')
    .select('id, code, client_name, used, submission_id')
    .eq('code', String(code).toUpperCase())
    .maybeSingle();

  if (error || !invite) {
    return res.status(404).json({ valid: false, error: 'Link inválido o expirado' });
  }

  // Si ya fue usado → devolver el resultado guardado (modo solo-lectura)
  if (invite.used) {
    if (!invite.submission_id) {
      return res.status(200).json({
        valid: true,
        status: 'completed',
        client_name: invite.client_name,
        result: null,
        error: 'No se encontró el resultado.',
      });
    }

    const { data: sub, error: subError } = await supabase
      .from('enea_completo_submissions')
      .select(`name, dominant_type,
        type1_total, type2_total, type3_total,
        type4_total, type5_total, type6_total,
        type7_total, type8_total, type9_total,
        created_at`)
      .eq('id', invite.submission_id)
      .maybeSingle();

    if (subError || !sub) {
      return res.status(200).json({
        valid: true,
        status: 'completed',
        client_name: invite.client_name,
        result: null,
      });
    }

    return res.status(200).json({
      valid: true,
      status: 'completed',
      client_name: invite.client_name,
      result: {
        name: sub.name,
        dominant_type: sub.dominant_type,
        totals: {
          1: sub.type1_total, 2: sub.type2_total, 3: sub.type3_total,
          4: sub.type4_total, 5: sub.type5_total, 6: sub.type6_total,
          7: sub.type7_total, 8: sub.type8_total, 9: sub.type9_total,
        },
        created_at: sub.created_at,
      },
    });
  }

  // Pendiente de completar → modo edición
  return res.status(200).json({
    valid: true,
    status: 'available',
    client_name: invite.client_name,
  });
}
