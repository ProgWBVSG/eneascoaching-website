import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  PREGUNTAS_COMUNICACION, PERFILES_COMUNICACION, calcularComunicacion,
} from '../data/testComunicacion';
import {
  ArrowLeft, ArrowRight, Sparkles, Mail, Loader2, MessageCircle,
  Send, Check, Users, TrendingUp, AlertTriangle, Eye, Zap,
} from 'lucide-react';

type Step = 'intro' | 'quiz' | 'capture' | 'calculating' | 'result';

const CALC_MESSAGES = [
  'Cruzando tus respuestas...',
  'Ubicando tu estilo dominante...',
  'Preparando tu perfil completo...',
];

const TestComunicacion: React.FC = () => {
  const [step, setStep] = useState<Step>('intro');
  const [qIndex, setQIndex] = useState(0);
  const [respuestas, setRespuestas] = useState<number[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [contact, setContact] = useState(() => {
    try { return localStorage.getItem('recursos_email') || ''; } catch { return ''; }
  });
  const [calcMsgIdx, setCalcMsgIdx] = useState(0);
  const advanceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (advanceTimeout.current) clearTimeout(advanceTimeout.current); }, []);

  useEffect(() => {
    if (step !== 'calculating') return;
    setCalcMsgIdx(0);
    const interval = setInterval(() => setCalcMsgIdx(i => Math.min(i + 1, CALC_MESSAGES.length - 1)), 650);
    return () => clearInterval(interval);
  }, [step]);

  const resultado = useMemo(
    () => respuestas.length === PREGUNTAS_COMUNICACION.length ? calcularComunicacion(respuestas) : null,
    [respuestas],
  );

  const pick = (optIdx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(optIdx);
    advanceTimeout.current = setTimeout(() => {
      setRespuestas(r => [...r, optIdx]);
      setSelectedIdx(null);
      if (qIndex < PREGUNTAS_COMUNICACION.length - 1) setQIndex(qIndex + 1);
      else setStep('capture');
    }, 240);
  };

  const goBack = () => {
    if (qIndex === 0) { setStep('intro'); return; }
    setRespuestas(r => r.slice(0, -1));
    setQIndex(qIndex - 1);
  };

  const submitAndReveal = async () => {
    setStep('calculating');
    const minDelay = new Promise(r => setTimeout(r, 1500));

    const save = fetch('/api/cursos?action=comunicacion-submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, contact,
        style: resultado?.dominante.estilo || null,
        answers: respuestas,
      }),
    }).catch(() => { /* si falla el guardado, igual mostramos el resultado */ });

    const newsletter = contact.includes('@')
      ? fetch('/api/subscribe', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: contact.trim(), name: name.trim() }),
        }).catch(() => { /* no bloquea el resultado */ })
      : Promise.resolve();

    await Promise.all([save, newsletter, minDelay]);
    setStep('result');
  };

  const waHref = useMemo(() => {
    if (!resultado) return 'https://wa.me/5493515632496';
    const quien = name.trim() ? `Soy ${name.trim()}.` : '';
    const msg = [
      `Hola Cecilia! ${quien}`.trim(),
      `Hice el test de estilos de comunicación y me dio "${resultado.dominante.nombre}".`,
      'Quiero entender cómo sacarle más provecho a mi estilo en las reuniones de mi equipo.',
    ].join(' ');
    return `https://wa.me/5493515632496?text=${encodeURIComponent(msg)}`;
  }, [resultado, name]);

  const preg = PREGUNTAS_COMUNICACION[qIndex];

  return (
    <div className="min-h-screen bg-brand-beige flex flex-col">
      <div className="w-full py-4 px-4 relative flex items-center justify-center border-b border-black/5">
        <Link to="/" className="absolute left-4 flex items-center gap-1.5 text-brand-dark hover:text-brand-gold transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Volver</span>
        </Link>
        <span className="font-heading font-bold tracking-widest text-brand-dark text-sm">ENEASCOACHING</span>
      </div>

      {step === 'quiz' && (
        <div className="w-full px-4 pt-3 pb-1 flex gap-1 max-w-lg mx-auto">
          {PREGUNTAS_COMUNICACION.map((_, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
              <div className="h-full bg-brand-gold rounded-full transition-all duration-500 ease-out"
                style={{ width: i <= qIndex ? '100%' : '0%', opacity: i <= qIndex ? 1 : 0.4 }} />
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-lg">

          {/* ── INTRO ─────────────────────────────────────────────────── */}
          {step === 'intro' && (
            <div className="text-center anim-fade-slide-up">
              <p className="text-brand-gold text-xs font-bold tracking-[0.2em] uppercase mb-4">Test gratuito · 3 minutos</p>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl text-brand-dark leading-tight mb-4">
                ¿Cuál es tu <span className="text-brand-gold">estilo de comunicación?</span>
              </h1>
              <p className="text-gray-600 text-base mb-5 max-w-md mx-auto">
                Todos tenemos una forma predominante de comunicar. La tuya explica por qué con algunas personas te entendés en dos frases y con otras tenés que repetir todo tres veces.
              </p>
              <div className="bg-white rounded-2xl p-4 mb-6 text-left max-w-md mx-auto">
                <p className="text-sm text-gray-600">
                  No hay estilos mejores ni peores. Respondé pensando en cómo actuás habitualmente en tus reuniones, no en cómo te gustaría actuar.
                </p>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 mb-7">
                <Users className="w-3.5 h-3.5 text-brand-gold" /> Del método de Cecilia B. Sánchez · +600 personas mentoreadas
              </div>
              <button onClick={() => setStep('quiz')}
                className="tap-feedback w-full sm:w-auto inline-flex items-center justify-center gap-2 gold-gradient text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-shadow text-base">
                Descubrir mi estilo <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-xs text-gray-400 mt-4">Son 9 preguntas. Al final vas a ver tu perfil completo.</p>
            </div>
          )}

          {/* ── QUIZ ──────────────────────────────────────────────────── */}
          {step === 'quiz' && preg && (
            <div key={qIndex} className="anim-fade-slide-up">
              <p className="text-center text-xs text-gray-400 mb-2">Pregunta {qIndex + 1} de {PREGUNTAS_COMUNICACION.length}</p>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-brand-dark text-center mb-7 leading-snug">
                {preg.pregunta}
              </h2>
              <div className="space-y-2.5">
                {preg.opciones.map((op, i) => {
                  const isSelected = selectedIdx === i;
                  const isDimmed = selectedIdx !== null && !isSelected;
                  return (
                    <button key={i} onClick={() => pick(i)}
                      style={{ animationDelay: `${i * 45}ms` }}
                      className={`anim-fade-slide-up tap-feedback w-full text-left rounded-2xl px-5 py-4 border-2 touch-manipulation
                        ${isSelected ? 'bg-brand-gold border-brand-gold shadow-md' : 'bg-white border-gray-200 hover:border-brand-gold/60 hover:bg-brand-gold/5'}
                        ${isDimmed ? 'opacity-40' : 'opacity-100'}`}>
                      <span className="flex items-center justify-between gap-2">
                        <span className={`text-sm sm:text-base ${isSelected ? 'text-white font-medium' : 'text-brand-dark'}`}>{op.label}</span>
                        {isSelected && <Check className="w-5 h-5 text-white shrink-0 anim-pop-in" />}
                      </span>
                    </button>
                  );
                })}
              </div>
              <button onClick={goBack} className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm mt-6 mx-auto">
                <ArrowLeft className="w-4 h-4" /> Anterior
              </button>
            </div>
          )}

          {/* ── CAPTURE ──────────────────────────────────────────────── */}
          {step === 'capture' && (
            <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 text-center anim-fade-scale-in">
              <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-brand-gold anim-soft-pulse" />
              </div>
              <h2 className="font-heading font-bold text-2xl text-brand-dark mb-2">Tu perfil está listo</h2>
              <p className="text-gray-600 text-sm mb-6">
                Dejanos tu nombre y tu mail y te enviamos el perfil completo, junto con material sobre comunicación y liderazgo que Cecilia comparte cada tanto.
              </p>

              <div className="space-y-3 text-left mb-2">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-gold text-brand-dark" />
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input value={contact} onChange={e => setContact(e.target.value)} placeholder="tu@email.com o tu WhatsApp"
                    className="w-full border-2 border-gray-200 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-brand-gold text-brand-dark" />
                </div>
              </div>

              <button onClick={submitAndReveal}
                className="tap-feedback w-full mt-4 flex items-center justify-center gap-2 gold-gradient text-white font-bold py-4 rounded-xl shadow-md min-h-[56px] text-base">
                Ver mi estilo <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={submitAndReveal} className="text-xs text-gray-400 hover:text-gray-600 mt-3">
                Prefiero solo ver mi resultado, sin dejar datos
              </button>
            </div>
          )}

          {/* ── CALCULANDO ───────────────────────────────────────────── */}
          {step === 'calculating' && (
            <div className="text-center anim-fade-scale-in">
              <div className="w-20 h-20 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-9 h-9 text-brand-gold animate-spin" />
              </div>
              <p key={calcMsgIdx} className="font-heading font-semibold text-brand-dark text-lg anim-fade-slide-up">
                {CALC_MESSAGES[calcMsgIdx]}
              </p>
            </div>
          )}

          {/* ── RESULTADO ────────────────────────────────────────────── */}
          {step === 'result' && resultado && (
            <div className="anim-fade-slide-up">
              <p className="text-center text-gray-500 text-sm mb-6">
                {name.trim() ? `${name.trim()}, tu estilo es` : 'Tu estilo de comunicación'}
              </p>

              {/* Perfil dominante */}
              <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 mb-4 relative overflow-hidden anim-pop-in">
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: resultado.dominante.color }} />
                <div className="text-center mb-5">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: `${resultado.dominante.color}1a` }}>
                    <MessageCircle className="w-8 h-8" style={{ color: resultado.dominante.color }} />
                  </div>
                  <h1 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark mb-2">{resultado.dominante.nombre}</h1>
                  <p className="font-medium text-base" style={{ color: resultado.dominante.color }}>{resultado.dominante.tagline}</p>
                </div>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{resultado.dominante.descripcion}</p>
              </div>

              {/* Distribución de los 4 estilos */}
              <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 mb-4 anim-fade-slide-up" style={{ animationDelay: '60ms' }}>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Tu mezcla de registros</p>
                <div className="space-y-3">
                  {resultado.top.map(({ estilo, pct }) => {
                    const perfil = PERFILES_COMUNICACION[estilo];
                    const esDominante = estilo === resultado.dominante.estilo;
                    return (
                      <div key={estilo}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm ${esDominante ? 'font-semibold text-brand-dark' : 'text-gray-500'}`}>
                            {perfil.nombre.replace('Estilo ', '')}
                          </span>
                          <span className="text-xs font-semibold text-gray-400">{pct}%</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${pct}%`, background: perfil.color, opacity: esDominante ? 1 : 0.45 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                {resultado.secundario && (
                  <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-100">
                    Tu segundo registro es <span className="font-semibold" style={{ color: resultado.secundario.color }}>{resultado.secundario.nombre}</span>. Nadie comunica de una sola manera, y esa combinación es lo que te hace difícil de encasillar.
                  </p>
                )}
              </div>

              {/* Fortalezas */}
              <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 mb-4 anim-fade-slide-up" style={{ animationDelay: '120ms' }}>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-heading font-bold text-brand-dark">Lo que este estilo te da</h3>
                </div>
                <ul className="space-y-2.5">
                  {resultado.dominante.fortalezas.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bajo presión */}
              <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 mb-4 anim-fade-slide-up" style={{ animationDelay: '170ms' }}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h3 className="font-heading font-bold text-brand-dark">El riesgo de tu estilo</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{resultado.dominante.riesgo}</p>
              </div>

              {/* Cómo te leen */}
              <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 mb-4 anim-fade-slide-up" style={{ animationDelay: '220ms' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-5 h-5 text-brand-gold" />
                  <h3 className="font-heading font-bold text-brand-dark">La diferencia entre lo que decís y lo que llega</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{resultado.dominante.comoTeLeen}</p>
              </div>

              {/* Choque con el estilo opuesto */}
              <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 mb-4 anim-fade-slide-up" style={{ animationDelay: '270ms' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5" style={{ color: PERFILES_COMUNICACION[resultado.dominante.chocaCon].color }} />
                  <h3 className="font-heading font-bold text-brand-dark">Con quién más te cuesta entenderte</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{resultado.dominante.ajusteChoque}</p>
              </div>

              {/* Ajustes */}
              <div className="rounded-2xl p-5 sm:p-6 mb-4 text-white anim-fade-slide-up" style={{ background: resultado.dominante.color, animationDelay: '370ms' }}>
                <h3 className="font-heading font-bold mb-3">Tres ajustes para tu próxima reunión</h3>
                <ul className="space-y-3">
                  {resultado.dominante.ajustes.map((a, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA principal a WhatsApp */}
              <div className="bg-brand-dark rounded-3xl p-6 sm:p-7 text-white text-center mb-4 anim-fade-slide-up" style={{ animationDelay: '420ms' }}>
                <p className="font-heading font-bold text-xl mb-3">Tu estilo ya lo tenés. Falta usarlo a favor.</p>
                <p className="text-gray-300 text-sm mb-5">
                  Este test te muestra cómo comunicás. Lo que no te puede mostrar es qué hacer cuando tenés enfrente a la persona con la que siempre chocás, o cuando la reunión se te va de las manos y volvés al piloto automático. Eso se trabaja sobre tus reuniones reales.
                </p>
                <p className="text-gray-300 text-sm mb-6">
                  Escribile a Cecilia y contale qué te dio el test. En una charla de 10 minutos van a ver qué está pasando en tus reuniones y si tiene sentido trabajarlo juntas.
                </p>
                <a href={waHref} target="_blank" rel="noopener noreferrer"
                  className="tap-feedback inline-flex items-center justify-center gap-2 gold-gradient text-white font-bold py-4 px-8 rounded-full shadow-md text-base">
                  <MessageCircle className="w-5 h-5" /> Hablar con Cecilia por WhatsApp
                </a>
                <p className="text-gray-400 text-xs mt-4">Se abre el chat con el mensaje ya escrito. Solo tenés que enviarlo.</p>
              </div>

              {/* Recursos */}
              <Link to="/recursos" className="tap-feedback block bg-white rounded-2xl p-5 border border-gray-100 hover:border-brand-gold/40 anim-fade-slide-up" style={{ animationDelay: '470ms' }}>
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-xl bg-brand-gold/10 flex items-center justify-center shrink-0"><Send className="w-5 h-5 text-brand-gold" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-brand-dark text-sm">Material gratuito de Cecilia</p>
                    <p className="text-xs text-gray-500">Tests, guías y contenidos sobre comunicación y liderazgo</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
                </div>
              </Link>

              {contact.includes('@') && (
                <p className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 mt-4">
                  <Check className="w-3.5 h-3.5" /> Te sumamos al material que comparte Cecilia
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestComunicacion;
