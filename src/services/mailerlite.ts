export const subscribeToMailerLite = async (email: string, name?: string) => {
  try {
    // LLama al endpoint serverless de Vercel en la misma URL
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error al suscribirse');
    }

    return { success: true, message: data.message };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
