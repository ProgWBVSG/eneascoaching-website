import React, { useEffect, useState } from 'react';
import { Download, Loader2, X, CheckCircle2 } from 'lucide-react';

// E-books gratuitos. Cada tarjeta abre una ventana (pop up) que pide nombre, email y teléfono opcional:
// se guarda en Admin → E-books y se suma a MailerLite. Después se descarga el PDF.
// Para sumar otro e-book, se agrega una entrada en EBOOKS. Links directos: /#ebook (sección), /#ikigai (abre el pop up).
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
  {
    id: 'cuatro-acuerdos',
    titulo: 'Los cuatro acuerdos: cuaderno de reflexión y práctica',
    detalle: 'Inspirado en los cuatro acuerdos de don Miguel Ruiz.',
    portada: '/ebooks/cuatro-acuerdos-portada.webp',
    pdf: '/ebooks/Los-cuatro-acuerdos-cuaderno-de-reflexion-y-practica.pdf',
  },
];
type Ebook = typeof EBOOKS[number];

const bajar = (url: string) => {
  const a = document.createElement('a');
  a.href = url; a.download = url.split('/').pop() || 'ebook.pdf'; a.rel = 'noopener';
  document.body.appendChild(a); a.click(); a.remove();
};

const Ventana: React.FC<{ e: Ebook; cerrar: () => void }> = ({ e, cerrar }) => {
  const [f, setF] = useState({ name: '', email: '', phone: '' });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [listo, setListo] = useState(false);

  // Esc cierra, y el fondo no se mueve mientras está abierta
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => { if (ev.key === 'Escape') cerrar(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [cerrar]);

  const descargar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (f.name.trim().length < 2) { setError('Escribí tu nombre'); return; }
    if (!/\S+@\S+\.\S+/.test(f.email)) { setError('Poné un email válido'); return; }
    setEnviando(true); setError('');
    const post = (extra: object) => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(extra) });
    // Guardar en la base del Admin y sumar a MailerLite; si algo falla, el e-book se descarga igual
    await Promise.allSettled([
      fetch('/api/cursos?action=ebook-submit', post({ ebook: e.id, name: f.name, email: f.email, phone: f.phone })),
      fetch('/api/subscribe', post({ email: f.email, name: f.name })),
    ]);
    try { localStorage.setItem(`ebook_${e.id}`, '1'); localStorage.setItem(UNLOCK_KEY, '1'); localStorage.setItem(EMAIL_KEY, f.email.trim()); } catch { /* sin almacenamiento */ }
    setEnviando(false);
    bajar(e.pdf); setListo(true);
  };

  const campo = 'w-full rounded border border-gray-300 px-4 py-3 text-base text-brand-dark bg-white focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold';
  return (
    <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4" onMouseDown={ev => { if (ev.target === ev.currentTarget) cerrar(); }}>
      <div role="dialog" aria-modal="true" aria-label={e.titulo} className="relative w-full sm:max-w-md max-h-[92vh] overflow-y-auto bg-white text-brand-dark rounded-t-2xl sm:rounded-lg shadow-2xl px-6 pt-8 pb-7 text-center">
        <button onClick={cerrar} aria-label="Cerrar" className="absolute top-3 right-3 p-2 text-gray-400 hover:text-brand-dark"><X size={22} /></button>
        <img src={e.portada} alt="" className="h-36 w-auto mx-auto object-contain drop-shadow-lg" />
        <h4 className="mt-4 font-heading font-bold text-xl leading-snug">{e.titulo}</h4>

        {listo ? (
          <div className="mt-5 flex flex-col items-center gap-3">
            <CheckCircle2 size={40} className="text-brand-gold" />
            <p className="font-semibold">¡Listo! Tu e-book se está descargando.</p>
            <p className="text-sm text-gray-500">Si no arrancó, <a href={e.pdf} download className="text-brand-gold underline font-semibold">tocá acá</a>.</p>
            <button onClick={cerrar} className="mt-2 text-sm text-gray-500 underline">Cerrar</button>
          </div>
        ) : (
          <form onSubmit={descargar} noValidate className="mt-5 flex flex-col gap-3 text-left">
            <p className="text-sm text-gray-600 text-center">Dejanos tus datos y descargalo gratis.</p>
            <input className={campo} value={f.name} onChange={ev => setF(p => ({ ...p, name: ev.target.value }))} placeholder="Tu nombre" autoComplete="name" maxLength={120} autoFocus />
            <input className={campo} type="email" value={f.email} onChange={ev => setF(p => ({ ...p, email: ev.target.value }))} placeholder="Tu email" autoComplete="email" maxLength={160} />
            <input className={campo} value={f.phone} onChange={ev => setF(p => ({ ...p, phone: ev.target.value }))} placeholder="WhatsApp (opcional)" inputMode="tel" autoComplete="tel" maxLength={40} />
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <button type="submit" disabled={enviando} className="inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-[#a68a3c] disabled:opacity-60 text-white font-bold tracking-wide py-3.5 px-6 rounded transition-colors">
              {enviando ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />} DESCARGAR GRATIS
            </button>
            <p className="text-xs text-gray-500 text-center">Tus datos son solo para enviarte el e-book y contenido de valor de vez en cuando. No hacemos spam ni compartimos tus datos, y podés darte de baja cuando quieras.</p>
          </form>
        )}
      </div>
    </div>
  );
};

const EbookGratis: React.FC = () => {
  const [abierto, setAbierto] = useState<string | null>(null);
  const e = EBOOKS.find(x => x.id === abierto) || null;

  const pedir = (b: Ebook) => { if (registrado(b.id)) bajar(b.pdf); else setAbierto(b.id); };

  // /#ikigai o /#cuatro-acuerdos abren directo la ventana de ese e-book
  useEffect(() => {
    const revisar = () => {
      const id = window.location.hash.replace('#', '');
      const b = EBOOKS.find(x => x.id === id);
      if (b && !registrado(b.id)) setAbierto(b.id);
    };
    revisar();
    window.addEventListener('hashchange', revisar);
    return () => window.removeEventListener('hashchange', revisar);
  }, []);

  return (
    <div id="ebook" className="mt-14 pt-12 border-t border-white/10 scroll-mt-24">
      <h3 className="font-heading font-bold text-2xl md:text-3xl mb-8">E-books gratuitos</h3>
      <div className="flex flex-wrap justify-center items-start gap-x-16 gap-y-14">
        {EBOOKS.map(b => (
          <div key={b.id} id={b.id} className="w-full sm:w-[320px] flex flex-col items-center text-center scroll-mt-24">
            <button onClick={() => pedir(b)} aria-label={`Descargar ${b.titulo}`} className="transition-transform duration-300 hover:-translate-y-1 focus:outline-none">
              <img src={b.portada} alt={`Portada del e-book ${b.titulo}`} loading="lazy" className="h-64 sm:h-72 w-auto object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.55)]" />
            </button>
            <h4 className="mt-6 font-heading font-bold text-xl sm:text-2xl text-white max-w-xs">{b.titulo}</h4>
            <p className="mt-2 text-gray-300 text-sm">{b.detalle}</p>
            <button onClick={() => pedir(b)} className="mt-5 inline-flex items-center justify-center gap-2 bg-brand-gold hover:bg-[#a68a3c] text-white font-bold tracking-wide py-3 px-8 rounded transition-colors">
              <Download size={18} /> DESCARGAR GRATIS
            </button>
          </div>
        ))}
      </div>
      {e && <Ventana e={e} cerrar={() => setAbierto(null)} />}
    </div>
  );
};

export default EbookGratis;
