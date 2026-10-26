export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { password, email } = req.body;
  if (!password) return res.status(400).json({ error: 'Contraseña requerida' });

  // Mails con permiso de entrar (variable ADMIN_EMAILS, separados por coma). Si no está definida, no se restringe.
  // Los otros paneles (aula, comunidad, recursos) siguen entrando solo con la contraseña, sin mail.
  const permitidos = (process.env.ADMIN_EMAILS || '').replace(/^﻿/, '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
  if (email !== undefined && permitidos.length && !permitidos.includes(String(email).trim().toLowerCase())) {
    return res.status(401).json({ error: 'Ese email no tiene acceso al panel' });
  }

  const adminPw = (process.env.ADMIN_PASSWORD || '').replace(/^﻿/, '').trim();
  if (password === adminPw) {
    // Devolvemos el token como el mismo password hasheado no es necesario
    // ya que es una app privada con usuario único
    return res.status(200).json({ success: true, token: adminPw });
  }

  return res.status(401).json({ error: 'Contraseña incorrecta' });
}
