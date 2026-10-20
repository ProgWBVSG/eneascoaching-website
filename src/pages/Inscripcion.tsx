import React, { useEffect, useMemo, useState } from 'react';
import { Loader2, GraduationCap, CheckCircle2, CalendarDays } from 'lucide-react';
import { cohortesAbiertas, PREGUNTAS_POSTULACION } from '../data/inscripcion';

const WA_NUMERO = '5493515632496';

const Inscripcion: React.FC = () => {
  const abiertas = useMemo(() => cohortesAbiertas(), []);
  const pedida = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('cohorte') : null;
  const [cohorteId, setCohorteId] = useState(() => (abiertas.find(c => c.id === pedida) || abiertas[0])?.id || '');
  const cohorte = abiertas.find(c => c.id === cohorteId) || null;
  const diaTxt = cohorte ? cohorte.dia.charAt(0).toLowerCase() + cohorte.dia.slice(1) : '';

  const [datos, setDatos] = useState({ nombre: '', email: '', telefono: '', pais: 'Argentina' });
  const [resp, setResp] = useState<Record<string, string>>({});
  const [acepta, setAcepta] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [listo, setListo] = useState<{ ok: boolean } | null>(null);
  // Al confirmar, la pantalla se acorta: volver arriba para que no quede mostrando el pie de página
  useEffect(() => { if (listo) window.scrollTo({ top: 0, behavior: 'auto' }); }, [listo]);

  const setDato = (k: keyof typeof datos) => (e: React.ChangeEvent<HTMLInputElement>) => setDatos(p => ({ ...p, [k]: e.target.value }));
  const setResp1 = (id: string, v: string) => setResp(p => ({ ...p, [id]: v }));
  const labelDe = (id: string) => {
    const p = PREGUNTAS_POSTULACION.find(q => q.id === id);
    const v = resp[id] || '';
    return p?.opciones?.find(o => o.valor === v)?.label || v;
  };

  const profesion = labelDe('profesion');
  const linkAgenda = `/agendar?nombre=${encodeURIComponent(datos.nombre.trim())}&trabajo=${encodeURIComponent(profesion)}`;
  const linkWa = `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(
    `Hola Cecilia, soy ${datos.nombre.trim()}. Me postulé a la Diplomatura que inicia el ${diaTxt}. Me dedico a: ${profesion}. Opción de inversión: ${labelDe('inversion')}. Mi mail es ${datos.email.trim()}.`,
  )}`;

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cohorte) { setError('Elegí la fecha de inicio.'); return; }
    if (!datos.nombre.trim() || !datos.email.trim() || !datos.telefono.trim()) { setError('Completá tus datos de contacto.'); return; }
    if (!/^\S+@\S+\.\S+$/.test(datos.email.trim())) { setError('Revisá el email.'); return; }
    const falta = PREGUNTAS_POSTULACION.find(q => q.requerida && !(resp[q.id] || '').trim());
    if (falta) { setError(`Falta responder: ${falta.label}`); document.getElementById(`q-${falta.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    if (!acepta) { setError('Para continuar, aceptá los términos y condiciones.'); return; }
    setEnviando(true); setError('');
    try {
      const respuestas = PREGUNTAS_POSTULACION.filter(q => (resp[q.id] || '').trim()).map(q => ({
        id: q.id, pregunta: q.label, valor: resp[q.id], respuesta: labelDe(q.id),
      }));
      const res = await fetch('/api/cursos?action=inscripcion-submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...datos, cohorte: cohorte.dia, respuestas, acepta_terminos: true }),
      });
      if (!res.ok) throw new Error();
      setListo({ ok: true });
    } catch {
      // Si no se pudo guardar, la postulación igual llega por WhatsApp
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
          <h1 className="text-3xl font-heading font-bold text-brand-dark">{listo.ok ? '¡Recibimos tu postulación!' : 'Un último paso'}</h1>
          <p className="text-lg text-gray-700">
            El siguiente paso es una llamada de 20 minutos con Cecilia para conocerte, resolver tus dudas y definir la mejor forma de empezar el <strong>{diaTxt}</strong>.
          </p>
          {!listo.ok && <p className="text-sm text-red-600">No pudimos guardar tus respuestas en el sistema. Enviáselas a Cecilia por WhatsApp con el botón de abajo.</p>}
          {listo.ok ? (
            <>
              <a href={linkAgenda} className="w-full sm:w-auto inline-flex items-center justify-center bg-brand-gold hover:bg-[#a68a3c] text-white font-bold py-4 px-8 rounded text-lg transition-colors">
                Elegir el horario de mi llamada
              </a>
              <a href={linkWa} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-dark underline underline-offset-4 hover:text-brand-gold">o prefiero hablar por WhatsApp</a>
            </>
          ) : (
            <a href={linkWa} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-8 rounded text-lg transition-colors">
              Enviar por WhatsApp
            </a>
          )}
          <p className="text-sm text-gray-500">
            {cohorte.sena ? 'Tu lugar queda reservado cuando se acredita la seña (no reembolsable).' : 'Tu lugar queda reservado cuando se acredita el primer pago.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-brand-beige">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-brand-gold/15 flex items-center justify-center mb-4"><GraduationCap size={28} className="text-brand-gold" /></div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-dark mb-3">Postulación a la Diplomatura</h1>
          <p className="text-gray-600 mb-1">Diplomatura en Eneagrama, Liderazgo y Vínculos Conscientes</p>
          <p className="font-semibold text-brand-gold">6 meses · grupal · online y en vivo</p>
          <p className="text-sm text-gray-600 mt-3 max-w-lg">Contanos un poco de vos. Te lleva 2 minutos y nos ayuda a que la llamada con Cecilia sea útil desde el primer minuto.</p>
        </div>

        <ol className="mt-8 grid grid-cols-3 gap-2 sm:gap-3 text-center text-xs sm:text-sm leading-snug">
          {['Completás la postulación', 'Tenés una llamada de 20 minutos con Cecilia', 'Reservás tu lugar y recibís la bienvenida'].map((t, i) => (
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
          <form onSubmit={enviar} noValidate className="mt-8 bg-white rounded-sm shadow-sm border border-brand-gold/20 p-5 sm:p-8 flex flex-col gap-6">
            <fieldset>
              <legend className={`${label} text-center w-full`}>¿Cuándo querés empezar? *</legend>
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
              <input className={input} value={datos.nombre} onChange={setDato('nombre')} maxLength={120} autoComplete="name" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={label}>Email *</label>
                <input className={input} type="email" value={datos.email} onChange={setDato('email')} maxLength={160} autoComplete="email" />
              </div>
              <div>
                <label className={label}>WhatsApp con código de país *</label>
                <input className={input} value={datos.telefono} onChange={setDato('telefono')} maxLength={40} inputMode="tel" placeholder="+54 9 351 ..." autoComplete="tel" />
              </div>
            </div>
            <div>
              <label className={label}>País de residencia</label>
              <input className={input} value={datos.pais} onChange={setDato('pais')} maxLength={80} autoComplete="country-name" />
            </div>

            {PREGUNTAS_POSTULACION.map(q => (
              <div key={q.id} id={`q-${q.id}`}>
                <p className={label}>{q.label}{q.requerida ? ' *' : ''}</p>
                {q.ayuda && <p className="text-xs text-gray-500 -mt-1 mb-2">{q.ayuda}</p>}
                {q.tipo === 'texto' ? (
                  <>
                    <textarea className={`${input} min-h-[90px]`} value={resp[q.id] || ''} onChange={e => setResp1(q.id, e.target.value)} maxLength={q.max || 1000} />
                    {q.max && <p className="text-xs text-gray-400 text-right mt-1">{(resp[q.id] || '').length} / {q.max}</p>}
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    {q.opciones!.map(o => (
                      <label key={o.valor} className={`flex items-center gap-3 cursor-pointer rounded border px-4 py-3 text-sm transition-colors ${resp[q.id] === o.valor ? 'border-brand-gold bg-brand-gold/10 text-brand-dark font-medium' : 'border-gray-200 text-gray-700 hover:border-brand-gold/50'}`}>
                        <input type="radio" name={q.id} value={o.valor} checked={resp[q.id] === o.valor} onChange={() => setResp1(q.id, o.valor)} className="w-4 h-4 accent-[#c5a059] shrink-0" />
                        {o.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="bg-brand-beige border border-brand-gold/30 rounded px-4 py-3 text-sm text-gray-700 text-center">
              {cohorte?.sena
                ? <>Para esta fecha, el lugar se reserva con una <strong>seña no reembolsable</strong>, que se descuenta del valor total.</>
                : <>Para esta fecha, el lugar se reserva con el <strong>primer pago</strong>. Los cupos son limitados.</>}
            </div>
            <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={acepta} onChange={e => setAcepta(e.target.checked)} className="mt-1 w-4 h-4 accent-[#c5a059] shrink-0" />
              <span>Leí y acepto los <a href="/terminos" target="_blank" rel="noopener noreferrer" className="text-brand-gold font-semibold underline">términos y condiciones y la política de privacidad</a>.</span>
            </label>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <button type="submit" disabled={enviando} className="bg-brand-gold hover:bg-[#a68a3c] disabled:opacity-60 text-white font-bold py-4 rounded text-lg transition-colors flex items-center justify-center gap-2">
              {enviando && <Loader2 size={18} className="animate-spin" />} Enviar postulación
            </button>
            <p className="text-xs text-gray-500 text-center">Enviar la postulación no genera ningún cobro.</p>
          </form>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿Tenés dudas antes de postularte? <a href="/agendar" className="text-brand-gold font-semibold underline">Agendá una reunión informativa gratuita</a>
        </p>
      </div>
    </div>
  );
};

export default Inscripcion;
