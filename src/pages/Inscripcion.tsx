import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, CheckCircle2, CalendarDays, ArrowLeft, ArrowRight } from 'lucide-react';
import { cohortesAbiertas, PREGUNTAS_POSTULACION, type Pregunta } from '../data/inscripcion';

const WA_NUMERO = '5493515632496';

// Solicitud de lugar en la Diplomatura, de a una pregunta por pantalla.
// Pasos: fecha → nombre → preguntas de data/inscripcion.ts → contacto y términos.
type Paso = { tipo: 'fecha' } | { tipo: 'nombre' } | { tipo: 'pregunta'; q: Pregunta } | { tipo: 'contacto' };

const Inscripcion: React.FC = () => {
  const abiertas = useMemo(() => cohortesAbiertas(), []);
  const pedida = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('cohorte') : null;
  const [cohorteId, setCohorteId] = useState(() => (abiertas.find(c => c.id === pedida) || abiertas[0])?.id || '');
  const cohorte = abiertas.find(c => c.id === cohorteId) || null;
  const diaTxt = cohorte ? cohorte.dia.charAt(0).toLowerCase() + cohorte.dia.slice(1) : '';

  const pasos: Paso[] = useMemo(() => [
    { tipo: 'fecha' }, { tipo: 'nombre' },
    ...PREGUNTAS_POSTULACION.map(q => ({ tipo: 'pregunta' as const, q })),
    { tipo: 'contacto' },
  ], []);
  const [i, setI] = useState(0);
  const paso = pasos[i];

  const [datos, setDatos] = useState({ nombre: '', email: '', telefono: '', pais: 'Argentina' });
  const [resp, setResp] = useState<Record<string, string>>({});
  const [acepta, setAcepta] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [listo, setListo] = useState<{ ok: boolean } | null>(null);
  const tarjeta = useRef<HTMLDivElement>(null);

  // Al cambiar de paso o terminar, que la pregunta quede a la vista
  useEffect(() => { if (listo) window.scrollTo({ top: 0, behavior: 'auto' }); }, [listo]);
  useEffect(() => {
    const el = tarjeta.current;
    if (el && el.getBoundingClientRect().top < 80) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setError('');
  }, [i]);

  const primerNombre = datos.nombre.trim().split(' ')[0];
  const labelDe = (id: string) => {
    const p = PREGUNTAS_POSTULACION.find(q => q.id === id);
    const v = resp[id] || '';
    return p?.opciones?.find(o => o.valor === v)?.label || v;
  };

  const validar = (): string => {
    if (!paso) return '';
    if (paso.tipo === 'fecha' && !cohorte) return 'Elegí una fecha de inicio.';
    if (paso.tipo === 'nombre' && datos.nombre.trim().length < 2) return 'Escribí tu nombre y apellido.';
    if (paso.tipo === 'pregunta' && paso.q.requerida && !(resp[paso.q.id] || '').trim()) return 'Elegí o escribí una respuesta para seguir.';
    if (paso.tipo === 'contacto') {
      if (!/^\S+@\S+\.\S+$/.test(datos.email.trim())) return 'Revisá el email.';
      if (datos.telefono.replace(/\D/g, '').length < 8) return 'Escribí tu WhatsApp con código de país.';
      if (!acepta) return 'Para enviar, aceptá los términos y condiciones.';
    }
    return '';
  };
  const siguiente = () => {
    const e = validar();
    if (e) { setError(e); return; }
    if (i < pasos.length - 1) setI(i + 1); else enviar();
  };
  // Las respuestas de opción avanzan solas
  const elegir = (id: string, v: string) => {
    setResp(p => ({ ...p, [id]: v }));
    setTimeout(() => setI(n => Math.min(n + 1, pasos.length - 1)), 280);
  };

  const profesion = labelDe('profesion');
  const linkAgenda = `/agendar?nombre=${encodeURIComponent(datos.nombre.trim())}&trabajo=${encodeURIComponent(profesion)}`;
  const linkWa = `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(
    `Hola Cecilia, soy ${datos.nombre.trim()}. Envié mi solicitud para la Diplomatura que inicia el ${diaTxt}. Me dedico a: ${profesion}. Opción de inversión: ${labelDe('inversion')}. Mi mail es ${datos.email.trim()}.`,
  )}`;

  const enviar = async () => {
    if (!cohorte) return;
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
      // Si no se pudo guardar, la solicitud igual llega por WhatsApp
      setListo({ ok: false });
    } finally { setEnviando(false); }
  };

  const input = 'w-full border border-gray-300 rounded px-4 py-3 text-base focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold bg-white';
  const label = 'block text-sm font-semibold text-brand-dark mb-1.5 text-left';
  const titulo = 'text-xl sm:text-2xl font-heading font-bold text-brand-dark text-center leading-snug';
  const opcion = (sel: boolean) => `flex items-center gap-3 cursor-pointer rounded border-2 px-4 py-3.5 text-left text-sm sm:text-base transition-colors ${sel ? 'border-brand-gold bg-brand-gold/10 text-brand-dark font-semibold' : 'border-gray-200 text-gray-700 hover:border-brand-gold/60'}`;

  if (listo && cohorte) {
    return (
      <div className="pt-20 min-h-screen bg-brand-beige">
        <div className="max-w-xl mx-auto px-6 py-16 text-center flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-brand-gold/15 flex items-center justify-center"><CheckCircle2 size={34} className="text-brand-gold" /></div>
          <h1 className="text-3xl font-heading font-bold text-brand-dark">{listo.ok ? `¡Gracias, ${primerNombre}!` : 'Un último paso'}</h1>
          <p className="text-lg text-gray-700">
            Recibimos tu solicitud. El siguiente paso es una llamada de 20 minutos con Cecilia para conocerte, resolver tus dudas y definir la mejor forma de empezar el <strong>{diaTxt}</strong>.
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

  const progreso = Math.round((i / pasos.length) * 100);

  return (
    <div className="pt-20 min-h-screen bg-brand-beige">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-dark mb-2">Tu lugar en la Diplomatura</h1>
          <p className="text-gray-600 text-sm sm:text-base">Diplomatura en Eneagrama, Liderazgo y Vínculos Conscientes · 6 meses · grupal, online y en vivo</p>
        </div>

        {abiertas.length === 0 ? (
          <div className="mt-8 bg-white rounded-sm border border-brand-gold/20 p-8 text-center">
            <p className="text-gray-700 mb-4">Por el momento no hay fechas abiertas. Escribinos y te avisamos cuando abra la próxima.</p>
            <a href={`https://wa.me/${WA_NUMERO}?text=${encodeURIComponent('Hola Cecilia, quiero que me avises cuando abra la próxima Diplomatura')}`} target="_blank" rel="noopener noreferrer" className="inline-block bg-brand-gold text-white font-bold py-3 px-6 rounded">Avisarme</a>
          </div>
        ) : (
          <div ref={tarjeta} className="mt-8 scroll-mt-24">
            {/* Progreso */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>Paso {i + 1} de {pasos.length}</span>
              <span>Menos de 2 minutos</span>
            </div>
            <div className="h-1.5 bg-white rounded-full overflow-hidden mb-6">
              <div className="h-full bg-brand-gold transition-all duration-500" style={{ width: `${Math.max(progreso, 4)}%` }} />
            </div>

            <form
              onSubmit={e => { e.preventDefault(); siguiente(); }}
              noValidate
              className="bg-white rounded-sm shadow-sm border border-brand-gold/20 p-5 sm:p-8 min-h-[340px] flex flex-col"
            >
              <div key={i} className="flex-1 flex flex-col gap-4 animate-[fadeIn_.25s_ease-out]">
                {paso.tipo === 'fecha' && (
                  <>
                    <h2 className={titulo}>¿Cuándo te gustaría empezar?</h2>
                    <div className="flex flex-col gap-3">
                      {abiertas.map(c => (
                        <label key={c.id} className={opcion(cohorteId === c.id)}>
                          <input type="radio" name="cohorte" checked={cohorteId === c.id} onChange={() => { setCohorteId(c.id); setTimeout(() => setI(1), 280); }} className="sr-only" />
                          <CalendarDays size={22} className="text-brand-gold shrink-0" />
                          <span className="flex-1">
                            <span className="block font-bold text-brand-dark">{c.dia}</span>
                            <span className="block text-xs text-gray-500 font-normal">Graduación: {c.graduacion}{c.sena ? ' · reserva con seña' : ' · últimos lugares'}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </>
                )}

                {paso.tipo === 'nombre' && (
                  <>
                    <h2 className={titulo}>¿Cómo te llamás?</h2>
                    <input className={input} value={datos.nombre} onChange={e => setDatos(d => ({ ...d, nombre: e.target.value }))} placeholder="Nombre y apellido" maxLength={120} autoComplete="name" autoFocus />
                  </>
                )}

                {paso.tipo === 'pregunta' && (
                  <>
                    <h2 className={titulo}>
                      {paso.q.id === PREGUNTAS_POSTULACION[0].id && primerNombre ? `Un gusto, ${primerNombre}. ` : ''}{paso.q.label}
                    </h2>
                    {paso.q.ayuda && <p className="text-sm text-gray-500 text-center -mt-2">{paso.q.ayuda}</p>}
                    {paso.q.tipo === 'texto' ? (
                      <>
                        <textarea className={`${input} min-h-[120px]`} value={resp[paso.q.id] || ''} onChange={e => setResp(p => ({ ...p, [paso.q.id]: e.target.value }))} maxLength={paso.q.max || 1000} autoFocus />
                        {paso.q.max && <p className="text-xs text-gray-400 text-right -mt-2">{(resp[paso.q.id] || '').length} / {paso.q.max}</p>}
                      </>
                    ) : (
                      <div className="flex flex-col gap-2.5">
                        {paso.q.opciones!.map(o => (
                          <label key={o.valor} className={opcion(resp[paso.q.id] === o.valor)}>
                            <input type="radio" name={paso.q.id} checked={resp[paso.q.id] === o.valor} onChange={() => elegir(paso.q.id, o.valor)} className="w-4 h-4 accent-[#c5a059] shrink-0" />
                            {o.label}
                          </label>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {paso.tipo === 'contacto' && (
                  <>
                    <h2 className={titulo}>Último paso: ¿dónde te contactamos?</h2>
                    <div>
                      <label className={label}>Email</label>
                      <input className={input} type="email" value={datos.email} onChange={e => setDatos(d => ({ ...d, email: e.target.value }))} maxLength={160} autoComplete="email" autoFocus />
                    </div>
                    <div>
                      <label className={label}>WhatsApp con código de país</label>
                      <input className={input} value={datos.telefono} onChange={e => setDatos(d => ({ ...d, telefono: e.target.value }))} maxLength={40} inputMode="tel" placeholder="+54 9 351 ..." autoComplete="tel" />
                    </div>
                    <div>
                      <label className={label}>País de residencia</label>
                      <input className={input} value={datos.pais} onChange={e => setDatos(d => ({ ...d, pais: e.target.value }))} maxLength={80} autoComplete="country-name" />
                    </div>
                    <p className="bg-brand-beige border border-brand-gold/30 rounded px-4 py-3 text-sm text-gray-700 text-center">
                      {cohorte?.sena
                        ? <>Para esta fecha, el lugar se reserva con una <strong>seña no reembolsable</strong>, que se descuenta del valor total.</>
                        : <>Para esta fecha, el lugar se reserva con el <strong>primer pago</strong>. Los cupos son limitados.</>}
                    </p>
                    <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer text-left">
                      <input type="checkbox" checked={acepta} onChange={e => setAcepta(e.target.checked)} className="mt-1 w-4 h-4 accent-[#c5a059] shrink-0" />
                      <span>Leí y acepto los <a href="/terminos" target="_blank" rel="noopener noreferrer" className="text-brand-gold font-semibold underline">términos y condiciones y la política de privacidad</a>.</span>
                    </label>
                  </>
                )}
              </div>

              {error && <p className="text-sm text-red-600 text-center mt-4">{error}</p>}

              <div className="mt-6 flex items-center gap-3">
                {i > 0 && (
                  <button type="button" onClick={() => setI(i - 1)} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-dark px-2 py-3">
                    <ArrowLeft size={16} /> Atrás
                  </button>
                )}
                <button type="submit" disabled={enviando} className="ml-auto flex-1 sm:flex-none bg-brand-gold hover:bg-[#a68a3c] disabled:opacity-60 text-white font-bold py-3.5 px-8 rounded transition-colors inline-flex items-center justify-center gap-2">
                  {enviando && <Loader2 size={18} className="animate-spin" />}
                  {paso.tipo === 'contacto' ? 'Quiero mi lugar' : <>Siguiente <ArrowRight size={18} /></>}
                </button>
              </div>
              {paso.tipo === 'contacto' && <p className="text-xs text-gray-500 text-center mt-3">Enviar la solicitud no genera ningún cobro.</p>}
            </form>
          </div>
        )}

        <p className="text-center text-sm text-gray-600 mt-6">
          ¿Tenés dudas antes de empezar? <a href="/agendar" className="text-brand-gold font-semibold underline">Agendá una reunión informativa gratuita</a>
        </p>
      </div>
      <style>{'@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}'}</style>
    </div>
  );
};

export default Inscripcion;
