export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { password } = req.body;
  if (!password) return res.status(400).json({ error: 'Contraseña requerida' });

  if (password === process.env.ADMIN_PASSWORD) {
    // Devolvemos el token como el mismo password hasheado no es necesario
    // ya que es una app privada con usuario único
    return res.status(200).json({ success: true, token: process.env.ADMIN_PASSWORD });
  }

  return res.status(401).json({ error: 'Contraseña incorrecta' });
}
