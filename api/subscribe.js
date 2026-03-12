export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'El email es requerido' });
  }

  try {
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.MAILERLITE_TOKEN}`
      },
      body: JSON.stringify({
        email: email,
        fields: {
          name: name || ''
        },
        groups: ['181752997184800327'] // ID del grupo "Clientes Web"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error de MailerLite:', data);
      return res.status(400).json({ message: 'Hubo un error al suscribirte.', error: data });
    }

    return res.status(200).json({ message: 'Suscripción exitosa', data });

  } catch (error) {
    console.error('Error en la API Serverless:', error);
    return res.status(500).json({ message: 'Error interno del servidor', error: String(error) });
  }
}
