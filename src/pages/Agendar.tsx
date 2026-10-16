import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2, CalendarCheck, Clock, Globe } from 'lucide-react';
import {
  AGENDA_DIAS, AGENDA_DIAS_ADELANTE, AGENDA_HORAS_ANTICIPACION, AGENDA_MINUTOS, HORARIOS_DEL_DIA,
  ZONAS, ZONA_ARGENTINA, instante, fmtHora, fmtDia, hoyArgentina,
} from '../data/agenda';
import { trackEvent } from '../lib/metaPixel';

const WA_NUMERO = '5493515632496';
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DIAS_SEMANA = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const pad = (n: number) => String(n).padStart(2, '0');
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const Agendar: React.FC = () => {
  const detectada = useMemo(() => {
    try {
      const z = Intl.DateTimeFormat().resolvedOptions().timeZone || ZONA_ARGENTINA;
      // Los navegadores informan Buenos_Aires, Cordoba, etc.: es la misma hora
      return z === 'America/Buenos_Aires' || z.startsWith('America/Argentina/') ? ZONA_ARGENTINA : z;
    } catch { return ZONA_ARGENTINA; }
  }, []);
  const zonas = useMemo(
    () => (ZONAS.some(z => z.tz === detectada) ? ZONAS : [{ tz: detectada, label: `Mi zona (${detectada.replace(/_/g, ' ')})` }, ...ZONAS]),
    [detectada],
  );
  const [tz, setTz] = useState(detectada);
  const [ocupados, setOcupados] = useState<Set<string>>(new Set());
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(false);

  const hoy = hoyArgentina();
  const [anio, setAnio] = useState(() => Number(hoy.slice(0, 4)));
  const [mes, setMes] = useState(() => Number(hoy.slice(5, 7)) - 1);
  const [fecha, setFecha] = useState<string | null>(null);
  const [hora, setHora] = useState<string | null>(null);

  const [nombre, setNombre] = useState('');
  const [trabajo, setTrabajo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [reservada, setReservada] = useState<{ ok: boolean } | null>(null);

  const cargar = async () => {
    setCargando(true); setErrorCarga(false);
    try {
      const res = await fetch('/api/cursos?action=agenda-slots');
      if (!res.ok) throw new Error();
      const d = await res.json();
      setOcupados(new Set(d.ocupados || []));
    } catch { setErrorCarga(true); } finally { setCargando(false); }
  };
  useEffect(() => { cargar(); }, []);

  const limite = useMemo(() => Date.now() + AGENDA_HORAS_ANTICIPACION * 3600e3, []);
  const maximo = useMemo(() => Date.now() + AGENDA_DIAS_ADELANTE * 86400e3, []);

  const libresDelDia = (f: string) =>
    HORARIOS_DEL_DIA.filter(h => {
      const t = instante(f, h).getTime();
      return t >= limite && t <= maximo && !ocupados.has(`${f}|${h}`);
    });

  const celdas = useMemo(() => {
    const primero = new Date(Date.UTC(anio, mes, 1));
    const offset = (primero.getUTCDay() + 6) % 7; // semana empieza en lunes
    const dias = new Date(Date.UTC(anio, mes + 1, 0)).getUTCDate();
    const out: (string | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= dias; d++) out.push(`${anio}-${pad(mes + 1)}-${pad(d)}`);
    return out;
  }, [anio, mes]);

  const disponible = (f: string) => {
    if (!AGENDA_DIAS.includes(new Date(`${f}T12:00:00Z`).getUTCDay())) return false;
    return libresDelDia(f).length > 0;
  };

  const cambiarMes = (delta: number) => {
    const d = new Date(Date.UTC(anio, mes + delta, 1));
    setAnio(d.getUTCFullYear()); setMes(d.getUTCMonth());
  };

  const horarios = fecha ? libresDelDia(fecha) : [];
  const instanteElegido = fecha && hora ? instante(fecha, hora) : null;
  const distintaZona = tz !== ZONA_ARGENTINA;

  const mensajeWa = () => {
    if (!fecha || !hora || !instanteElegido) return '';
    const dia = fmtDia(instanteElegido, ZONA_ARGENTINA);
    let m = `Hola, soy ${nombre.trim()}, trabajo en ${trabajo.trim()}, y quiero agendar una reunión informativa para el ${dia} a las ${hora} (hora de Argentina).`;
    if (distintaZona) m += ` En mi zona horaria (${zonas.find(z => z.tz === tz)?.label || tz.replace(/_/g, ' ')}) sería el ${fmtDia(instanteElegido, tz)} a las ${fmtHora(instanteElegido, tz)}.`;
    return m;
  };
  const linkWa = `https://wa.me/${WA_NUMERO}?text=${encodeURIComponent(mensajeWa())}`;

  const reservar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fecha || !hora || !nombre.trim() || !trabajo.trim()) { setError('Completá tu nombre y a qué te dedicás.'); return; }
    setEnviando(true); setError('');
    try {
      const res = await fetch('/api/cursos?action=agenda-book', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, trabajo, telefono, zona_horaria: tz, fecha, hora }),
      });
      if (res.status === 409) { setError('Ese horario acaba de ser reservado. Elegí otro, por favor.'); setHora(null); cargar(); return; }
      if (!res.ok) throw new Error();
      trackEvent('Schedule', { content_name: 'Reunión informativa Diplomatura' });
      setReservada({ ok: true });
    } catch {
      // Si no se pudo guardar, igual puede mandar el mensaje por WhatsApp
      setReservada({ ok: false });
    } finally { setEnviando(false); }
  };

  const input = 'w-full border border-gray-300 rounded px-4 py-3 text-base focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold bg-white';

  if (reservada && instanteElegido) {
    return (
      <div className="pt-20 min-h-screen bg-brand-beige">
        <div className="max-w-xl mx-auto px-6 py-16 text-center flex flex-col items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-brand-gold/15 flex items-center justify-center"><CalendarCheck size={32} className="text-brand-gold" /></div>
          <h1 className="text-3xl font-heading font-bold text-brand-dark">Un último paso</h1>
          <p className="text-lg text-gray-700">
            {reservada.ok ? 'Reservamos tu lugar para el' : 'Elegiste el'}{' '}
            <strong>{fmtDia(instanteElegido, ZONA_ARGENTINA)} a las {hora}</strong> (hora de Argentina).
          </p>
          {distintaZona && (
            <p className="text-gray-600">En tu zona horaria: {fmtDia(instanteElegido, tz)} a las {fmtHora(instanteElegido, tz)}.</p>
          )}
          {!reservada.ok && <p className="text-sm text-red-600">No pudimos guardar la reserva en el sistema, pero podés enviarla igual por WhatsApp.</p>}
          <p className="text-gray-600">Tocá el botón para enviarle el mensaje a Cecilia por WhatsApp. Ella te confirma el horario.</p>
          <a href={linkWa} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-8 rounded text-lg transition-colors">
            Enviar por WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-brand-beige">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-brand-dark mb-3">Agendá tu reunión informativa gratuita</h1>
        <p className="text-gray-600 mb-2">Una videollamada de {AGENDA_MINUTOS} minutos, sin compromiso, para contarte cómo es la formación y resolver tus dudas.</p>

        <div className="mt-6 inline-flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 max-w-full">
          <Globe size={16} className="text-brand-gold shrink-0" />
          <select value={tz} onChange={e => { setTz(e.target.value); }} className="bg-transparent focus:outline-none max-w-[16rem] sm:max-w-none">
            {zonas.map(z => <option key={z.tz} value={z.tz}>{z.label}{z.tz === ZONA_ARGENTINA ? ' (horario base)' : ''}</option>)}
          </select>
        </div>

        <div className="mt-8 bg-white rounded-sm shadow-sm border border-brand-gold/20 p-4 sm:p-8">
          {cargando ? (
            <div className="py-16 flex justify-center"><Loader2 className="animate-spin text-brand-gold" /></div>
          ) : errorCarga ? (
            <div className="py-10">
              <p className="text-gray-700 mb-4">No pudimos cargar los horarios disponibles.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={cargar} className="bg-brand-gold text-white font-bold py-3 px-6 rounded">Reintentar</button>
                <a href={`https://wa.me/${WA_NUMERO}?text=${encodeURIComponent('Hola Cecilia, quiero agendar una reunión informativa sobre la Diplomatura')}`} target="_blank" rel="noopener noreferrer" className="border-2 border-brand-gold text-brand-dark font-bold py-3 px-6 rounded">Escribir por WhatsApp</a>
              </div>
            </div>
          ) : (
            <>
              {/* Calendario */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => cambiarMes(-1)} aria-label="Mes anterior" className="p-2 rounded hover:bg-gray-100"><ChevronLeft /></button>
                <h2 className="font-heading font-bold text-lg">{MESES[mes]} {anio}</h2>
                <button onClick={() => cambiarMes(1)} aria-label="Mes siguiente" className="p-2 rounded hover:bg-gray-100"><ChevronRight /></button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-xs font-semibold text-gray-400 mb-1">
                {DIAS_SEMANA.map((d, i) => <div key={i}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {celdas.map((f, i) => {
                  if (!f) return <div key={i} />;
                  const ok = disponible(f);
                  const sel = f === fecha;
                  return (
                    <button
                      key={f}
                      disabled={!ok}
                      onClick={() => { setFecha(f); setHora(null); setError(''); }}
                      className={`aspect-square rounded text-sm font-medium transition-colors ${
                        sel ? 'bg-brand-gold text-white' : ok ? 'bg-brand-beige hover:bg-brand-gold/30 text-brand-dark' : 'text-gray-300 cursor-not-allowed'
                      }`}
                    >
                      {Number(f.slice(8))}
                    </button>
                  );
                })}
              </div>

              {/* Horarios */}
              {fecha && (
                <div className="mt-8 border-t border-gray-100 pt-6">
                  <h3 className="font-heading font-bold mb-1 flex items-center justify-center gap-2"><Clock size={18} className="text-brand-gold" /> {cap(fmtDia(instante(fecha, '12:00'), ZONA_ARGENTINA))}</h3>
                  <p className="text-xs text-gray-500 mb-4">Horarios en {zonas.find(z => z.tz === tz)?.label || tz}</p>
                  {horarios.length === 0 ? (
                    <p className="text-gray-500 text-sm">No quedan horarios este día.</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {horarios.map(h => {
                        const d = instante(fecha, h);
                        const otroDia = fmtDia(d, tz) !== fmtDia(instante(fecha, '12:00'), tz) && distintaZona;
                        return (
                          <button
                            key={h}
                            onClick={() => { setHora(h); setError(''); }}
                            className={`py-2.5 rounded border text-sm font-semibold transition-colors ${
                              hora === h ? 'bg-brand-gold border-brand-gold text-white' : 'border-brand-gold/50 text-brand-dark hover:bg-brand-gold/15'
                            }`}
                          >
                            {fmtHora(d, tz)}{otroDia && <span className="block text-[10px] font-normal opacity-70">{fmtDia(d, tz).split(' ')[0]}</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Datos */}
              {fecha && hora && instanteElegido && (
                <form onSubmit={reservar} className="mt-8 border-t border-gray-100 pt-6 text-left flex flex-col gap-4">
                  <p className="text-center font-semibold text-brand-dark">
                    {cap(fmtDia(instanteElegido, tz))} · {fmtHora(instanteElegido, tz)} hs
                    {distintaZona && <span className="block text-sm font-normal text-gray-500">en Argentina: {fmtDia(instanteElegido, ZONA_ARGENTINA)}, {hora} hs</span>}
                  </p>
                  <input className={input} placeholder="Tu nombre" value={nombre} onChange={e => setNombre(e.target.value)} required maxLength={120} />
                  <input className={input} placeholder="¿A qué te dedicás? (por ejemplo: psicóloga, coach, RRHH)" value={trabajo} onChange={e => setTrabajo(e.target.value)} required maxLength={160} />
                  <input className={input} placeholder="Tu WhatsApp con código de país (opcional)" value={telefono} onChange={e => setTelefono(e.target.value)} inputMode="tel" maxLength={40} />
                  {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                  <button type="submit" disabled={enviando} className="bg-brand-gold hover:bg-[#a68a3c] disabled:opacity-60 text-white font-bold py-4 rounded text-lg transition-colors flex items-center justify-center gap-2">
                    {enviando && <Loader2 size={18} className="animate-spin" />} Reservar mi lugar
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Agendar;
