import React, { useEffect, useState } from 'react';
import { Loader2, GraduationCap, CheckCircle2 } from 'lucide-react';
import { COHORTE_DIPLOMATURA, FORMAS_PAGO, MEDIOS_PAGO, ORIGENES } from '../data/inscripcion';

const WA_NUMERO = '5493515632496';

const Inscripcion: React.FC = () => {
  const [f, setF] = useState({
    nombre: '', email: '', telefono: '', pais: 'Argentina', profesion: '',
    origen: '', forma_pago: '', medio_pago: '', comentario: '',
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [listo, setListo] = useState<{ ok: boolean } | null>(null);
  // Al confirmar, la pantalla se acorta: volver arriba para que no quede mostrando el pie de página
  useEffect(() => { if (listo) window.scrollTo({ top: 0, behavior: 'auto' }); }, [listo]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF(prev => ({ ...prev, [k]: e.target.value }));

  const mensajeWa = () => {
    let m = `Hola Cecilia, soy ${f.nombre.trim()}. Me inscribí a la Diplomatura que inicia el ${COHORTE_DIPLOMATURA} y quiero coordinar el pago.`;
    if (f.forma_pago) m += ` Forma de pago: ${f.forma_pago.toLowerCase()}.`;
    if (f.medio_pago) m += ` Medio: ${f.medio_pago}.`;
    m += ` Mi mail es ${f.email.trim()}.`;
    return m;
  };
  const linkWa = `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(mensajeWa())}`;

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.nombre.trim() || !f.email.trim() || !f.telefono.trim() || !f.forma_pago || !f.medio_pago) {
      setError('Completá los campos obligatorios.'); return;
    }
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) { setError('Revisá el email.'); return; }
    setEnviando(true); setError('');
    try {
      const res = await fetch('/api/cursos?action=inscripcion-submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, cohorte: COHORTE_DIPLOMATURA }),
      });
      if (!res.ok) throw new Error();
      setListo({ ok: true });
    } catch {
      // Si no se pudo guardar, la inscripción igual llega por WhatsApp
      setListo({ ok: false });
    } finally { setEnviando(false); }
  };

  const input = 'w-full border border-gray-300 rounded px-4 py-3 text-base focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold bg-white';
  const label = 'block text-sm font-semibold text-brand-dark mb-1.5';

  if (listo) {
    return (
      <div className="pt-20 min-h-screen bg-brand-beige">
        <div className="max-w-xl mx-auto px-6 py-16 text-center flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-brand-gold/15 flex items-center justify-center"><CheckCircle2 size={34} className="text-brand-gold" /></div>
          <h1 className="text-3xl font-heading font-bold text-brand-dark">{listo.ok ? '¡Recibimos tu inscripción!' : 'Un último paso'}</h1>
          <p className="text-lg text-gray-700">
            Para confirmar tu lugar en la cohorte del <strong>{COHORTE_DIPLOMATURA}</strong>, enviale un mensaje a Cecilia. Te pasa los datos de pago y te da la bienvenida.
          </p>
          {!listo.ok && <p className="text-sm text-red-600">No pudimos guardar tus datos en el sistema, pero con el mensaje de WhatsApp tu inscripción llega igual.</p>}
          <a href={linkWa} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-8 rounded text-lg transition-colors">
            Coordinar el pago por WhatsApp
          </a>
          <p className="text-sm text-gray-500">Tu lugar queda confirmado cuando se acredita el pago.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-brand-beige">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-brand-gold/15 flex items-center justify-center mb-4"><GraduationCap size={28} className="text-brand-gold" /></div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-dark mb-3">Inscripción a la Diplomatura</h1>
          <p className="text-gray-600 mb-1">Diplomatura en Eneagrama, Liderazgo y Vínculos Conscientes</p>
          <p className="font-semibold text-brand-gold">Inicia el {COHORTE_DIPLOMATURA} · 6 meses · grupal y online</p>
        </div>

        <ol className="mt-8 grid grid-cols-3 gap-2 sm:gap-3 text-center text-xs sm:text-sm leading-snug">
          {['Completás tus datos', 'Coordinás el pago por WhatsApp', 'Recibís la bienvenida y el acceso al campus'].map((t, i) => (
            <li key={t} className="bg-white border border-brand-gold/20 rounded-sm px-2 py-3 sm:px-3 sm:py-4">
              <span className="block w-7 h-7 mx-auto mb-2 rounded-full bg-brand-gold text-white font-bold leading-7">{i + 1}</span>
              {t}
            </li>
          ))}
        </ol>

        <form onSubmit={enviar} className="mt-8 bg-white rounded-sm shadow-sm border border-brand-gold/20 p-5 sm:p-8 flex flex-col gap-5">
          <div>
            <label className={label}>Nombre y apellido *</label>
            <input className={input} value={f.nombre} onChange={set('nombre')} required maxLength={120} autoComplete="name" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={label}>Email *</label>
              <input className={input} type="email" value={f.email} onChange={set('email')} required maxLength={160} autoComplete="email" />
            </div>
            <div>
              <label className={label}>WhatsApp con código de país *</label>
              <input className={input} value={f.telefono} onChange={set('telefono')} required maxLength={40} inputMode="tel" placeholder="+54 9 351 ..." autoComplete="tel" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={label}>País</label>
              <input className={input} value={f.pais} onChange={set('pais')} maxLength={80} autoComplete="country-name" />
            </div>
            <div>
              <label className={label}>¿A qué te dedicás?</label>
              <input className={input} value={f.profesion} onChange={set('profesion')} maxLength={160} placeholder="Psicóloga, coach, RRHH..." />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={label}>¿Cómo preferís pagar? *</label>
              <select className={input} value={f.forma_pago} onChange={set('forma_pago')} required>
                <option value="">Elegí una opción</option>
                {FORMAS_PAGO.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className={label}>Medio de pago *</label>
              <select className={input} value={f.medio_pago} onChange={set('medio_pago')} required>
                <option value="">Elegí una opción</option>
                {MEDIOS_PAGO.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={label}>¿Cómo conociste a Cecilia?</label>
            <select className={input} value={f.origen} onChange={set('origen')}>
              <option value="">Elegí una opción</option>
              {ORIGENES.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>¿Querés contarnos algo más?</label>
            <textarea className={`${input} min-h-[90px]`} value={f.comentario} onChange={set('comentario')} maxLength={1000} />
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <button type="submit" disabled={enviando} className="bg-brand-gold hover:bg-[#a68a3c] disabled:opacity-60 text-white font-bold py-4 rounded text-lg transition-colors flex items-center justify-center gap-2">
            {enviando && <Loader2 size={18} className="animate-spin" />} Inscribirme
          </button>
          <p className="text-xs text-gray-500 text-center">Todavía no se cobra nada: en el siguiente paso coordinás el pago con Cecilia por WhatsApp.</p>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿Tenés dudas antes de inscribirte? <a href="/agendar" className="text-brand-gold font-semibold underline">Agendá una reunión informativa gratuita</a>
        </p>
      </div>
    </div>
  );
};

export default Inscripcion;
