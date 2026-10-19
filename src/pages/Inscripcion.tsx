import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, GraduationCap, CheckCircle2, CalendarDays } from 'lucide-react';
import { cohortesAbiertas, FORMAS_PAGO, MEDIOS_PAGO, ORIGENES } from '../data/inscripcion';

const WA_NUMERO = '5493515632496';

const Inscripcion: React.FC = () => {
  const abiertas = useMemo(() => cohortesAbiertas(), []);
  const pedida = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('cohorte') : null;
  const [cohorteId, setCohorteId] = useState(() => (abiertas.find(c => c.id === pedida) || abiertas[0])?.id || '');
  const cohorte = abiertas.find(c => c.id === cohorteId) || null;
  const diaTxt = cohorte ? cohorte.dia.charAt(0).toLowerCase() + cohorte.dia.slice(1) : '';

  const [f, setF] = useState({
    nombre: '', email: '', telefono: '', pais: 'Argentina', profesion: '',
    origen: '', forma_pago: '', medio_pago: '', comentario: '',
  });
  const [acepta, setAcepta] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [listo, setListo] = useState<{ ok: boolean } | null>(null);
  // Al confirmar, la pantalla se acorta: volver arriba para que no quede mostrando el pie de página
  useEffect(() => { if (listo) window.scrollTo({ top: 0, behavior: 'auto' }); }, [listo]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF(prev => ({ ...prev, [k]: e.target.value }));

  const mensajeWa = () => {
    let m = `Hola Cecilia, soy ${f.nombre.trim()}. Me inscribí a la Diplomatura que inicia el ${diaTxt} y quiero reservar mi lugar con la seña.`;
    if (f.forma_pago) m += ` Forma de pago: ${f.forma_pago.toLowerCase()}.`;
    if (f.medio_pago) m += ` Medio: ${f.medio_pago}.`;
    m += ` Mi mail es ${f.email.trim()}.`;
    return m;
  };
  const linkWa = `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(mensajeWa())}`;

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cohorte) { setError('Elegí la fecha de inicio.'); return; }
    if (!f.nombre.trim() || !f.email.trim() || !f.telefono.trim() || !f.forma_pago || !f.medio_pago) {
      setError('Completá los campos obligatorios.'); return;
    }
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) { setError('Revisá el email.'); return; }
    if (!acepta) { setError('Para continuar, aceptá los términos y condiciones.'); return; }
    setEnviando(true); setError('');
    try {
      const res = await fetch('/api/cursos?action=inscripcion-submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, cohorte: cohorte.dia, acepta_terminos: true }),
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

  if (listo && cohorte) {
    return (
      <div className="pt-20 min-h-screen bg-brand-beige">
        <div className="max-w-xl mx-auto px-6 py-16 text-center flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-brand-gold/15 flex items-center justify-center"><CheckCircle2 size={34} className="text-brand-gold" /></div>
          <h1 className="text-3xl font-heading font-bold text-brand-dark">{listo.ok ? '¡Recibimos tu inscripción!' : 'Un último paso'}</h1>
          <p className="text-lg text-gray-700">
            Para reservar tu lugar en la cohorte que inicia el <strong>{diaTxt}</strong>, enviale un mensaje a Cecilia. Te pasa los datos para abonar la seña y el saldo.
          </p>
          {!listo.ok && <p className="text-sm text-red-600">No pudimos guardar tus datos en el sistema, pero con el mensaje de WhatsApp tu inscripción llega igual.</p>}
          <a href={linkWa} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-8 rounded text-lg transition-colors">
            Reservar mi lugar por WhatsApp
          </a>
          <p className="text-sm text-gray-500">Tu lugar queda reservado cuando se acredita la seña (no reembolsable).</p>
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
          <p className="font-semibold text-brand-gold">6 meses · grupal · online y en vivo</p>
        </div>

        <ol className="mt-8 grid grid-cols-3 gap-2 sm:gap-3 text-center text-xs sm:text-sm leading-snug">
          {['Elegís la fecha y completás tus datos', 'Reservás tu lugar con una seña', 'Recibís la bienvenida y el acceso al campus'].map((t, i) => (
            <li key={t} className="bg-white border border-brand-gold/20 rounded-sm px-2 py-3 sm:px-3 sm:py-4">
              <span className="block w-7 h-7 mx-auto mb-2 rounded-full bg-brand-gold text-white font-bold leading-7">{i + 1}</span>
              {t}
            </li>
          ))}
        </ol>

        {abiertas.length === 0 ? (
          <div className="mt-8 bg-white rounded-sm border border-brand-gold/20 p-8 text-center">
            <p className="text-gray-700 mb-4">Por el momento no hay fechas abiertas. Escribinos y te avisamos cuando abra la próxima.</p>
            <a href={`https://wa.me/${WA_NUMERO}?text=${encodeURIComponent('Hola Cecilia, quiero que me avises cuando abra la próxima Diplomatura')}`} target="_blank" rel="noopener noreferrer" className="inline-block bg-brand-gold text-white font-bold py-3 px-6 rounded">Avisarme</a>
          </div>
        ) : (
          <form onSubmit={enviar} className="mt-8 bg-white rounded-sm shadow-sm border border-brand-gold/20 p-5 sm:p-8 flex flex-col gap-5">
            <fieldset>
              <legend className={`${label} text-center w-full`}>Elegí cuándo empezar *</legend>
              <div className={`grid grid-cols-1 ${abiertas.length > 1 ? 'sm:grid-cols-2' : ''} ${abiertas.length > 2 ? 'lg:grid-cols-3' : ''} gap-3 mt-2`}>
                {abiertas.map(c => (
                  <label key={c.id} className={`cursor-pointer rounded border-2 px-4 py-4 text-center transition-colors ${cohorteId === c.id ? 'border-brand-gold bg-brand-gold/10' : 'border-gray-200 hover:border-brand-gold/50'}`}>
                    <input type="radio" name="cohorte" value={c.id} checked={cohorteId === c.id} onChange={() => setCohorteId(c.id)} className="sr-only" />
                    <CalendarDays size={20} className="mx-auto mb-1 text-brand-gold" />
                    <span className="block font-bold text-brand-dark text-sm">{c.dia}</span>
                    <span className="block text-xs text-gray-500 mt-1">Graduación: {c.graduacion}</span>
                  </label>
                ))}
              </div>
            </fieldset>
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
                <label className={label}>¿Cómo preferís pagar el saldo? *</label>
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
            <div className="bg-brand-beige border border-brand-gold/30 rounded px-4 py-3 text-sm text-gray-700 text-center">
              Tu lugar se reserva con una <strong>seña no reembolsable</strong>, que se descuenta del valor total de la Diplomatura.
            </div>
            <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={acepta} onChange={e => setAcepta(e.target.checked)} className="mt-1 w-4 h-4 accent-[#c5a059] shrink-0" />
              <span>Leí y acepto los <a href="/terminos" target="_blank" rel="noopener noreferrer" className="text-brand-gold font-semibold underline">términos y condiciones y la política de privacidad</a>, incluida la seña no reembolsable.</span>
            </label>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <button type="submit" disabled={enviando} className="bg-brand-gold hover:bg-[#a68a3c] disabled:opacity-60 text-white font-bold py-4 rounded text-lg transition-colors flex items-center justify-center gap-2">
              {enviando && <Loader2 size={18} className="animate-spin" />} Inscribirme
            </button>
            <p className="text-xs text-gray-500 text-center">Todavía no se cobra nada: en el siguiente paso coordinás la seña con Cecilia por WhatsApp.</p>
          </form>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿Tenés dudas antes de inscribirte? <a href="/agendar" className="text-brand-gold font-semibold underline">Agendá una reunión informativa gratuita</a>
        </p>
      </div>
    </div>
  );
};

export default Inscripcion;
