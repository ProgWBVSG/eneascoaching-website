import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  CalendarDays, Check, Clock, MapPin, Mic, Loader2, Copy, MessageCircle, DollarSign,
  ClipboardList, Landmark, PlayCircle, Users, GraduationCap, X, ArrowLeft, ArrowRight,
} from 'lucide-react';
import { tallerPorId, inscripcionAbierta, pesos, fechasTexto, rangoHora } from '../data/talleres';
import { trackEvent } from '../lib/metaPixel';
import { toEmbedUrl } from '../lib/videoEmbed';

const WHATSAPP = '5493515632496';
const btnPrimary = 'inline-flex items-center justify-center text-center bg-brand-gold hover:bg-[#a68a3c] text-white font-bold py-4 px-8 rounded transition-colors';

const DOLOR_FORM = [
  'Me enredo o me quedo en blanco',
  'Me pongo nervioso/a al hablar frente a otros',
  'Me cuesta decir lo que pienso o poner límites',
  'No logro que me entiendan en el trabajo',
  'Otro',
];
const EQUIPO = [
  'Sí, soy dueño/a o socio/a de un negocio',
  'Sí, tengo personas a cargo',
  'No lidero un equipo',
];

const Taller: React.FC<{ id?: string }> = ({ id: idProp }) => {
  const params = useParams<{ id: string }>();
  const taller = tallerPorId(idProp || params.id);

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [dolor, setDolor] = useState('');
  const [equipo, setEquipo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listo, setListo] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const [paso, setPaso] = useState(0);

  useEffect(() => {
    if (!abierto) return;
    const onKey = (ev: KeyboardEvent) => { if (ev.key === 'Escape') setAbierto(false); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [abierto]);

  useEffect(() => {
    if (taller) trackEvent('ViewContent', { content_name: `Taller ${taller.titulo}`, content_category: 'Taller', value: taller.precio, currency: 'ARS' });
  }, [taller]);

  if (!taller) {
    return (
      <div className="pt-32 pb-24 px-6 text-center">
        <h1 className="text-2xl font-heading font-bold text-brand-dark mb-4">No encontramos este taller</h1>
        <a href="/talleres" className="text-brand-gold font-semibold underline">Ver los talleres</a>
      </div>
    );
  }

  const abierta = inscripcionAbierta(taller);
  const fechas = fechasTexto(taller);
  const video = toEmbedUrl(taller.videoUrl);
  const irAlFormulario = () => {
    if (listo) { document.getElementById('inscripcion')?.scrollIntoView({ behavior: 'smooth' }); return; }
    setPaso(0); setError(null); setAbierto(true);
  };
  const primerNombre = nombre.trim().split(' ')[0];
  const linkComprobante = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    `Hola Cecilia, soy ${nombre.trim()}. Me inscribí al taller "${taller.titulo}" (${fechas}) y te mando el comprobante de la transferencia de ${pesos(taller.precio)} al alias ${taller.alias}.`,
  )}`;
  const linkDolares = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    `Hola Cecilia, soy ${nombre.trim()}. Me inscribí al taller "${taller.titulo}" (${fechas}) y quiero pagar en dólares (USD ${taller.precioUSD}). ¿Cómo hago?`,
  )}`;

  const copiarAlias = async () => {
    try { await navigator.clipboard.writeText(taller.alias); setCopiado(true); setTimeout(() => setCopiado(false), 2000); }
    catch { prompt('Copiá el alias:', taller.alias); }
  };

  const validarPaso = (n: number): string | null => {
    if (n === 0) {
      if (nombre.trim().length < 2) return 'Escribí tu nombre y apellido.';
      if (telefono.replace(/\D/g, '').length < 8) return 'Escribí tu WhatsApp con código de área.';
      if (!/^\S+@\S+\.\S+$/.test(email.trim())) return 'Revisá tu email.';
    }
    if (n === 1 && !dolor) return 'Elegí una opción para seguir.';
    if (n === 2 && !equipo) return 'Elegí una opción para reservar.';
    return null;
  };
  const seguir = (e?: React.FormEvent) => {
    e?.preventDefault();
    const msg = validarPaso(paso);
    if (msg) { setError(msg); return; }
    setError(null);
    if (paso < 2) setPaso(paso + 1); else enviar();
  };

  const enviar = async () => {
    for (const n of [0, 1, 2]) { const msg = validarPaso(n); if (msg) { setPaso(n); setError(msg); return; } }
    setEnviando(true); setError(null);
    try {
      const answers = [
        { key: 'dolor', q: '¿Qué es lo que más te cuesta hoy al comunicar?', a: dolor },
        { key: 'equipo', q: '¿Liderás un equipo de trabajo?', a: equipo },
      ];
      const res = await fetch('/api/cursos?action=taller-inscripcion', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ survey: taller.survey, titulo: taller.titulo, role: equipo, answers, name: nombre, phone: telefono, email }),
      });
      if (!res.ok) throw new Error();
      trackEvent('Lead', { content_name: `Taller ${taller.titulo}`, value: taller.precio, currency: 'ARS' });
      setListo(true);
      setAbierto(false);
      setTimeout(() => document.getElementById('inscripcion')?.scrollIntoView({ behavior: 'smooth' }), 150);
    } catch {
      setError('No pudimos guardar tu inscripción. Probá de nuevo o escribinos por WhatsApp.');
    } finally { setEnviando(false); }
  };

  const [pagandoMP, setPagandoMP] = useState(false);
  const [errorMP, setErrorMP] = useState<string | null>(null);
  const pagarMP = async () => {
    setPagandoMP(true); setErrorMP(null);
    trackEvent('InitiateCheckout', { content_name: `Taller ${taller.titulo}`, value: taller.precio, currency: 'ARS' });
    try {
      const res = await fetch('/api/cursos?action=taller-pay-create', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo: taller.titulo, email }),
      });
      const data = await res.json();
      if (!res.ok || !data.init_point) throw new Error(data.error || 'No se pudo iniciar el pago');
      window.location.href = data.init_point;
    } catch {
      setErrorMP('No pudimos abrir el pago. Probá de nuevo o transferí con los datos de abajo.');
      setPagandoMP(false);
    }
  };

  const pagar = (moneda: 'ARS' | 'USD') => () => {
    trackEvent('InitiateCheckout', { content_name: `Taller ${taller.titulo}`, value: moneda === 'ARS' ? taller.precio : taller.precioUSD, currency: moneda });
  };

  return (
    <div className="pt-20 pb-24 md:pb-0">
      {/* 1 · Hero con video */}
      <section className="bg-brand-dark text-white py-14 md:py-20 px-6 relative overflow-hidden">
        <Mic className="absolute right-[-40px] top-10 w-72 h-72 md:w-96 md:h-96 text-brand-gold opacity-[0.06] pointer-events-none" strokeWidth={1} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-wide mb-4">{taller.titulo}</h1>
          <p className="text-xl md:text-2xl text-brand-gold font-light mb-6">{taller.subtitulo}</p>
          <p className="text-2xl md:text-3xl font-heading leading-snug mb-8">{taller.frase}</p>

          {/* Video de venta: solo aparece cuando se carga videoUrl en talleres.ts */}
          {video && (
            <div className="relative w-full max-w-2xl mx-auto rounded-sm shadow-[0_0_40px_rgba(197,160,89,0.3)] border-2 border-brand-gold/30 overflow-hidden bg-black aspect-video mb-8">
              <iframe src={video} title={`Taller ${taller.titulo}`} loading="lazy" className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          )}

          <p className="text-gray-300 mb-5">{taller.formato}</p>
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {taller.encuentros.map(e => (
              <span key={e.fecha} className="inline-flex items-center gap-2 border border-brand-gold/50 text-white text-sm font-medium px-4 py-2 rounded-full">
                <CalendarDays size={16} className="text-brand-gold" /> {e.dia}{e.hora ? ` · ${rangoHora(e)} h` : ''}
              </span>
            ))}
          </div>
          {abierta ? (
            <button onClick={irAlFormulario} className={`${btnPrimary} text-lg`}>Quiero mi lugar</button>
          ) : (
            <p className="text-brand-gold font-semibold">La inscripción a este taller ya cerró.</p>
          )}
        </div>
      </section>

      {/* 2 · ¿Te pasa esto? */}
      <section className="py-16 md:py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-dark mb-10">¿Te pasa esto?</h2>
          <div className="flex md:grid md:grid-cols-2 gap-4 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-3 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {taller.dolores.map(d => (
              <div key={d} className="bg-brand-beige rounded-sm p-6 border-l-4 border-brand-gold shrink-0 w-[82%] md:w-auto snap-center flex items-center">
                <p className="text-gray-700 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 · Reencuadre */}
      <section className="py-16 md:py-20 px-6 bg-brand-dark text-white">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-2xl md:text-3xl font-heading italic leading-relaxed mb-6">“{taller.cita}”</p>
          <p className="text-brand-gold text-lg">No es falta de capacidad. Es una habilidad, y se entrena.</p>
        </div>
      </section>

      {/* 4 · Qué aprenderás */}
      <section className="py-16 md:py-20 px-6 bg-brand-beige">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-dark mb-10">¿Qué aprenderás?</h2>
          <div className="flex md:grid md:grid-cols-2 gap-4 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-3 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {taller.aprenderas.map(a => (
              <div key={a} className="bg-white rounded-sm p-6 shadow-sm border border-brand-gold/20 flex flex-col items-center gap-3 shrink-0 w-[82%] md:w-auto snap-center">
                <div className="bg-brand-gold/10 p-2 rounded-full"><Check size={18} className="text-brand-gold" /></div>
                <p className="text-gray-700 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 · Cómo funciona */}
      <section className="py-16 md:py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-brand-dark mb-10">Cómo funciona</h2>
          <div className="flex md:grid md:grid-cols-3 gap-6 mb-12 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 pb-3 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[
              { icon: ClipboardList, t: 'Reservás tu lugar', d: 'Completás el formulario en esta página.' },
              { icon: Landmark, t: 'Transferís y mandás el comprobante', d: `Al alias ${taller.alias}, y nos mandás el comprobante por WhatsApp.` },
              { icon: GraduationCap, t: 'Entrás a tu aula', d: 'Te llega tu acceso con el calendario de los encuentros, las clases grabadas y el e-book.' },
            ].map(({ icon: Icon, t, d }, i) => (
              <div key={t} className="flex flex-col items-center gap-3 shrink-0 w-[78%] md:w-auto snap-center">
                <div className="w-14 h-14 rounded-full bg-brand-gold/10 flex items-center justify-center"><Icon className="w-7 h-7 text-brand-gold" /></div>
                <p className="text-sm font-bold text-brand-gold">Paso {i + 1}</p>
                <p className="font-heading font-bold text-brand-dark text-lg">{t}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
          <ul className="space-y-3 text-brand-dark inline-block text-left">
            {taller.encuentros.map(e => (
              <li key={e.fecha} className="flex items-center gap-3">
                <CalendarDays size={18} className="text-brand-gold shrink-0" /> {e.dia}{e.hora ? ` · ${rangoHora(e)} h (hora de Argentina)` : ''}
              </li>
            ))}
            {taller.modalidad && <li className="flex items-center gap-3"><MapPin size={18} className="text-brand-gold shrink-0" /> {taller.modalidad}</li>}
            <li className="flex items-center gap-3"><PlayCircle size={18} className="text-brand-gold shrink-0" /> Clases grabadas y e-book en tu aula</li>
            {!taller.encuentros[0].hora && <li className="flex items-center gap-3"><Clock size={18} className="text-brand-gold shrink-0" /> Horario a confirmar</li>}
          </ul>
        </div>
      </section>

      {/* 6 · Quién te acompaña */}
      <section className="py-16 md:py-20 px-6 bg-brand-beige">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <img src="/fotosCecilia/foto_cecilia_home.jpg" alt="Cecilia B. Sánchez"
            className="w-full max-w-sm mx-auto rounded-sm shadow-lg object-cover aspect-[4/5]" loading="lazy" />
          <div className="text-center">
            <h2 className="text-3xl font-heading font-bold text-brand-dark mb-4">Cecilia B. Sánchez</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Abogada, coach ejecutiva internacional y especialista en eneagrama. Hace años acompaña a personas y equipos a comunicarse con claridad: más de mil personas acompañadas.
            </p>
            <p className="text-gray-600 leading-relaxed">En este taller no vas a escuchar teoría: vas a practicar con tus propias situaciones.</p>
          </div>
        </div>
      </section>

      {/* 7 · Inversión */}
      <section className="py-16 md:py-20 px-6 bg-brand-dark text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8">Inversión total</h2>
          <div className="flex items-baseline justify-center gap-5 mb-3">
            {taller.precioAntes && <span className="text-2xl text-gray-400 line-through">{pesos(taller.precioAntes)}</span>}
            <span className="text-5xl font-heading font-bold text-brand-gold">{pesos(taller.precio)}</span>
          </div>
          <p className="text-gray-300 mb-8">o USD {taller.precioUSD} si pagás desde afuera de Argentina</p>
          <p className="font-semibold mb-4">Incluye:</p>
          <ul className="space-y-3 mb-10 inline-block text-left">
            {taller.incluye.map(i => (
              <li key={i} className="flex items-start gap-3"><Check size={18} className="text-brand-gold shrink-0 mt-1" /> <span>{i}</span></li>
            ))}
          </ul>
          {taller.cupos && <p className="text-brand-gold font-semibold mb-6">Cupos limitados: {taller.cupos} lugares.</p>}
          {abierta && <div><button onClick={irAlFormulario} className={`${btnPrimary} text-lg`}>Reservar mi lugar</button></div>}
        </div>
      </section>

      {/* 8 · Inscripción y pago */}
      {abierta && (
        <section id="inscripcion" className="py-16 md:py-20 px-6 bg-brand-beige scroll-mt-20">
          <div className="max-w-xl mx-auto">
            {!listo ? (
              <div className="bg-white rounded-sm shadow-sm border border-brand-gold/20 p-6 md:p-10 text-center">
                <h2 className="text-3xl font-heading font-bold text-brand-dark mb-2">Reservá tu lugar</h2>
                <p className="text-gray-600 mb-6">Son 3 pasos cortos. Después te mostramos cómo pagar.</p>
                <button onClick={irAlFormulario} className={`${btnPrimary} w-full sm:w-auto text-lg`}>Quiero mi lugar</button>
              </div>
            ) : (
              <div className="bg-white rounded-sm shadow-sm border border-brand-gold/20 p-6 md:p-10 text-center">
                <h2 className="text-3xl font-heading font-bold text-brand-dark mb-3">¡Tu lugar está reservado{primerNombre ? `, ${primerNombre}` : ''}!</h2>
                <p className="text-gray-600 mb-8">Para confirmarlo, pagá {pesos(taller.precio)} con tarjeta o Mercado Pago, o por transferencia.</p>

                <button onClick={pagarMP} disabled={pagandoMP} className={`${btnPrimary} w-full gap-2 mb-2 disabled:opacity-60`}>
                  {pagandoMP ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Landmark size={20} /> Pagar {pesos(taller.precio)} con tarjeta o Mercado Pago</>}
                </button>
                {errorMP && <p className="text-red-600 text-sm mb-2">{errorMP}</p>}
                <p className="text-sm text-gray-500 mb-8">Tarjeta de crédito o débito de cualquier banco. Acceso inmediato a tu aula.</p>

                <p className="text-sm font-semibold text-brand-dark mb-3">¿Preferís transferir? Mandanos el comprobante por WhatsApp:</p>

                <div className="bg-brand-beige rounded p-6 mb-6">
                  <p className="text-sm text-gray-500 mb-1">Alias</p>
                  <p className="text-3xl font-heading font-bold text-brand-dark mb-4 break-all">{taller.alias}</p>
                  <button onClick={copiarAlias} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold hover:text-[#a68a3c]">
                    <Copy size={16} /> {copiado ? '¡Copiado!' : 'Copiar alias'}
                  </button>
                  <p className="text-sm text-gray-600 mt-4">Monto: <strong>{pesos(taller.precio)}</strong></p>
                  <div className="mt-5 pt-4 border-t border-brand-gold/30 text-xs text-gray-500 leading-relaxed">
                    <p>{taller.cuenta.tipo} · N.º {taller.cuenta.numero}</p>
                    <p>CBU {taller.cuenta.cbu}</p>
                    <p>Titular: {taller.cuenta.titular}</p>
                  </div>
                </div>

                <a href={linkComprobante} onClick={pagar('ARS')} data-no-lead target="_blank" rel="noopener noreferrer" className={`${btnPrimary} w-full gap-2 mb-3`}>
                  <MessageCircle size={20} /> Enviar comprobante por WhatsApp
                </a>
                <a href={linkDolares} onClick={pagar('USD')} data-no-lead target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full border-2 border-brand-gold text-brand-dark hover:bg-brand-gold hover:text-white font-bold py-3 px-8 rounded transition-colors">
                  <DollarSign size={18} /> Pago desde afuera (USD {taller.precioUSD})
                </a>
                <p className="text-sm text-gray-500 mt-6">Apenas confirmemos tu pago, te llega por mail y por WhatsApp el acceso a tu aula del taller.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 9 · Procesos más profundos (prioridad a las ofertas principales) */}
      <section className="py-16 md:py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold text-brand-dark mb-3">¿Buscás un proceso más profundo?</h2>
          <p className="text-gray-600 mb-10">El taller es un primer paso. Si querés ir más allá, estos son los programas de Cecilia.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a href="/mentorias/lideres" className="block bg-brand-beige rounded-sm p-8 border border-brand-gold/20 hover:border-brand-gold transition-colors">
              <Users className="w-8 h-8 text-brand-gold mx-auto mb-3" />
              <p className="font-heading font-bold text-xl text-brand-dark mb-2">Mentoría para Líderes de Equipo</p>
              <p className="text-gray-600 text-sm">Acompañamiento 1 a 1 para liderar reuniones que terminan en decisiones.</p>
            </a>
            <a href="/diplomatura" className="block bg-brand-beige rounded-sm p-8 border border-brand-gold/20 hover:border-brand-gold transition-colors">
              <GraduationCap className="w-8 h-8 text-brand-gold mx-auto mb-3" />
              <p className="font-heading font-bold text-xl text-brand-dark mb-2">Diplomatura en Eneagrama</p>
              <p className="text-gray-600 text-sm">Formate como coach eneagramista certificada en 6 meses.</p>
            </a>
          </div>
        </div>
      </section>

      {/* 10 · Preguntas frecuentes */}
      <section className="py-16 md:py-20 px-6 bg-brand-beige">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold text-brand-dark mb-10">Preguntas frecuentes</h2>
          <div className="space-y-8">
            <div>
              <p className="font-semibold text-brand-dark mb-2">¿Necesito experiencia previa?</p>
              <p className="text-gray-600">No. El taller es práctico y está pensado para cualquier persona que quiera comunicarse mejor, en su trabajo y en su vida cotidiana.</p>
            </div>
            <div>
              <p className="font-semibold text-brand-dark mb-2">¿Cómo pago?</p>
              <p className="text-gray-600">Por transferencia de {pesos(taller.precio)} al alias {taller.alias}, y nos mandás el comprobante por WhatsApp. Si estás fuera de Argentina, son USD {taller.precioUSD}: escribinos y te pasamos cómo pagar.</p>
            </div>
            <div>
              <p className="font-semibold text-brand-dark mb-2">¿Cuándo recibo el acceso?</p>
              <p className="text-gray-600">Apenas confirmamos tu pago te llega el link de tu aula, con el calendario de los encuentros, las clases grabadas y el e-book.</p>
            </div>
            <div>
              <p className="font-semibold text-brand-dark mb-2">¿Tengo otra duda?</p>
              <p className="text-gray-600">Escribinos por <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola Cecilia, tengo una consulta sobre el taller "${taller.titulo}"`)}`} target="_blank" rel="noopener noreferrer" className="text-brand-gold font-semibold underline">WhatsApp</a> y te respondemos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pop up de reserva, por bloques */}
      {abierto && (
        <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4" onMouseDown={ev => { if (ev.target === ev.currentTarget) setAbierto(false); }}>
          <form onSubmit={seguir} noValidate role="dialog" aria-modal="true" aria-label={`Reservá tu lugar en ${taller.titulo}`}
            className="relative w-full sm:max-w-md max-h-[92vh] overflow-y-auto bg-white text-brand-dark rounded-t-2xl sm:rounded-lg shadow-2xl px-6 pt-8 pb-6">
            <button type="button" onClick={() => setAbierto(false)} aria-label="Cerrar" className="absolute top-3 right-3 p-2 text-gray-400 hover:text-brand-dark"><X size={22} /></button>
            <div className="flex items-center gap-2 mb-2 pr-8" aria-hidden>
              {[0, 1, 2].map(n => <span key={n} className={`h-1.5 flex-1 rounded-full ${n <= paso ? 'bg-brand-gold' : 'bg-gray-200'}`} />)}
            </div>
            <p className="text-xs text-gray-500 text-center mb-5">Paso {paso + 1} de 3</p>

            {paso === 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-heading font-bold text-center">Reservá tu lugar</h2>
                <p className="text-gray-600 text-center text-sm">Dejanos tus datos y en el siguiente paso te mostramos cómo pagar.</p>
                <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre y apellido" autoComplete="name" autoFocus
                  className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-brand-gold" />
                <input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="WhatsApp (con código de área)" type="tel" autoComplete="tel"
                  className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-brand-gold" />
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email (ahí te llega tu acceso)" type="email" autoComplete="email"
                  className="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-brand-gold" />
              </div>
            )}

            {paso === 1 && (
              <fieldset>
                <legend className="text-xl font-heading font-bold text-center w-full mb-4">¿Qué es lo que más te cuesta hoy al comunicar?</legend>
                <div className="space-y-2">
                  {DOLOR_FORM.map(o => (
                    <label key={o} className={`flex items-center gap-3 border-2 rounded px-4 py-3 cursor-pointer ${dolor === o ? 'border-brand-gold bg-brand-gold/5 font-semibold' : 'border-gray-200'}`}>
                      <input type="radio" name="dolor" checked={dolor === o} onChange={() => setDolor(o)} className="accent-[#c5a059]" /> {o}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {paso === 2 && (
              <fieldset>
                <legend className="text-xl font-heading font-bold text-center w-full mb-4">¿Liderás un equipo de trabajo?</legend>
                <div className="space-y-2">
                  {EQUIPO.map(o => (
                    <label key={o} className={`flex items-center gap-3 border-2 rounded px-4 py-3 cursor-pointer ${equipo === o ? 'border-brand-gold bg-brand-gold/5 font-semibold' : 'border-gray-200'}`}>
                      <input type="radio" name="equipo" checked={equipo === o} onChange={() => setEquipo(o)} className="accent-[#c5a059]" /> {o}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {error && <p className="text-red-600 text-sm text-center mt-4">{error}</p>}

            <div className="mt-6 flex items-center gap-3">
              {paso > 0 && (
                <button type="button" onClick={() => { setError(null); setPaso(paso - 1); }} className="inline-flex items-center gap-1 text-gray-600 hover:text-brand-dark font-semibold px-3 py-3 border border-gray-300 rounded">
                  <ArrowLeft size={18} /> Anterior
                </button>
              )}
              <button type="submit" disabled={enviando} className={`${btnPrimary} flex-1 py-3 disabled:opacity-60 gap-2`}>
                {enviando ? <Loader2 className="w-5 h-5 animate-spin" /> : paso < 2 ? <>Seguir <ArrowRight size={18} /></> : 'Reservar mi lugar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Botón fijo en celular */}
      {abierta && !listo && (
        <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-brand-dark/95 py-3 pl-3 pr-24">
          <button onClick={irAlFormulario} className={`${btnPrimary} w-full py-3`}>Quiero mi lugar</button>
        </div>
      )}
    </div>
  );
};

export default Taller;
