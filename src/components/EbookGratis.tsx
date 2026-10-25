import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

// E-book gratuito: pide el email (se suma a MailerLite) y descarga el PDF.
// Para sumar otro e-book, se agrega una entrada en EBOOKS.
const UNLOCK_KEY = 'recursos_unlocked';
const EMAIL_KEY = 'recursos_email';
const registrado = (id: string) => { try { return localStorage.getItem(`ebook_${id}`) === '1'; } catch { return false; } };

const EBOOKS = [
  {
    id: 'ikigai',
    titulo: 'Ikigai: un cuaderno para descubrir lo que te mueve',
    detalle: 'Lecturas breves, ejercicios y tu mapa personal.',
    portada: '/ebooks/ikigai-portada.webp',
    pdf: '/ebooks/Ikigai-Un-cuaderno-para-descubrir-lo-que-te-mueve.pdf',
  },
];

const bajar = (url: string) => {
  const a = document.createElement('a');
  a.href = url; a.download = url.split('/').pop() || 'ebook.pdf'; a.rel = 'noopener';
  document.body.appendChild(a); a.click(); a.remove();
};

const EbookCard: React.FC<{ e: typeof EBOOKS[number] }> = ({ e }) => {
  const [f, setF] = useState({ name: '', email: '', phone: '' });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [listo, setListo] = useState(false);
  const yaRegistrado = registrado(e.id);

  const descargar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!yaRegistrado) {
      if (f.name.trim().length < 2) { setError('Escribí tu nombre'); return; }
      if (!/\S+@\S+\.\S+/.test(f.email)) { setError('Poné un email válido'); return; }
      setEnviando(true); setError('');
      const body = (extra: object) => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(extra) });
      // Guardar en la base del Admin y sumar a MailerLite; si algo falla, el e-book se descarga igual
      await Promise.allSettled([
        fetch('/api/cursos?action=ebook-submit', body({ ebook: e.id, name: f.name, email: f.email, phone: f.phone })),
        fetch('/api/subscribe', body({ email: f.email, name: f.name })),
      ]);
      try { localStorage.setItem(`ebook_${e.id}`, '1'); localStorage.setItem(UNLOCK_KEY, '1'); localStorage.setItem(EMAIL_KEY, f.email.trim()); } catch { /* sin almacenamiento */ }
      setEnviando(false);
    }
    bajar(e.pdf); setListo(true);
  };

  const campo = 'w-full rounded px-4 py-3 text-base text-brand-dark bg-white focus:outline-none focus:ring-2 focus:ring-brand-gold';
  return (
    <div id={e.id} className="flex flex-col items-center text-center scroll-mt-24">
      <img src={e.portada} alt={`Portada del e-book ${e.titulo}`} loading="lazy" className="w-48 sm:w-56 h-auto drop-shadow-[0_24px_30px_rgba(0,0,0,0.55)]" />
      <h4 className="mt-6 font-heading font-bold text-xl sm:text-2xl text-white max-w-md">{e.titulo}</h4>
      <p className="mt-2 text-gray-300 text-sm">{e.detalle} E-book gratuito.</p>
      <form onSubmit={descargar} noValidate className="mt-5 w-full max-w-sm flex flex-col gap-3">
        {!yaRegistrado && (
          <>
            <input className={campo} value={f.name} onChange={ev => setF(p => ({ ...p, name: ev.target.value }))} placeholder="Tu nombre" autoComplete="name" maxLength={120} />
            <input className={campo} type="email" value={f.email} onChange={ev => setF(p => ({ ...p, email: ev.target.value }))} placeholder="Tu email" autoComplete="email" maxLength={160} />
            <input className={campo} value={f.phone} onChange={ev => setF(p => ({ ...p, phone: ev.target.value }))} placeholder="WhatsApp (opcional)" inputMode="tel" autoComplete="tel" maxLength={40} />
          </>
        )}
        <button type="submit" disabled={enviando} className="inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-[#a68a3c] disabled:opacity-60 text-white font-bold tracking-wide py-3 px-6 rounded transition-colors">
          {enviando ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />} DESCARGAR GRATIS
        </button>
        {error && <p className="text-sm text-red-300">{error}</p>}
        {listo && <p className="text-sm text-brand-gold">Listo, ya se está descargando. Si no arrancó, <a href={e.pdf} download className="underline">tocá acá</a>.</p>}
        {!yaRegistrado && <p className="text-xs text-gray-400">Tus datos son solo para enviarte el e-book y contenido de valor de vez en cuando. No hacemos spam ni compartimos tus datos, y podés darte de baja cuando quieras.</p>}
      </form>
    </div>
  );
};

const EbookGratis: React.FC = () => (
  <div id="ebook" className="mt-14 pt-12 border-t border-white/10 scroll-mt-24">
    <h3 className="font-heading font-bold text-2xl md:text-3xl mb-8">E-books gratuitos</h3>
    <div className="flex flex-wrap justify-center gap-12">
      {EBOOKS.map(e => <EbookCard key={e.id} e={e} />)}
    </div>
  </div>
);

export default EbookGratis;
