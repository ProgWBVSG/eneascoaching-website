import React, { useState } from 'react';
import { subscribeToMailerLite } from '../services/mailerlite';

const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    const response = await subscribeToMailerLite(email, name);

    if (response.success) {
      setStatus('success');
      setMessage('¡Gracias por unirte a nuestra comunidad!');
      setEmail('');
      setName('');
    } else {
      setStatus('error');
      setMessage(response.message || 'Hubo un error al suscribirte. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Tu Nombre (Opcional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
          disabled={status === 'loading' || status === 'success'}
        />
        <input
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-colors"
          disabled={status === 'loading' || status === 'success'}
        />
        
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className={`w-full py-3 px-6 rounded-md font-heading font-bold tracking-wide transition-all duration-300 ${
            status === 'success'
              ? 'bg-green-600 text-white cursor-default'
              : 'bg-brand-gold text-brand-dark hover:bg-white hover:text-brand-dark'
          } disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center`}
        >
          {status === 'loading' ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-brand-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Suscribiendo...
            </span>
          ) : status === 'success' ? (
            '¡Suscrito!'
          ) : (
            'UNIRME AHORA'
          )}
        </button>
      </form>

      {message && (
        <p className={`mt-3 text-sm text-center ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default NewsletterForm;
