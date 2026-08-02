import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PREGUNTAS_LIDERAZGO } from '../data/testLiderazgoPreguntas';
import { ESTILOS_LIDERAZGO } from '../data/estilosLiderazgo';
import { ENEATIPOS_DETALLE } from '../data/eneatipos-detalle';
import {
  ArrowLeft, ArrowRight, Sparkles, Mail, Loader2, MessageCircle,
  Compass, Send, Check, Users, TrendingUp, AlertTriangle, Target,
} from 'lucide-react';

type Step = 'intro' | 'quiz' | 'capture' | 'calculating' | 'result';

const CALC_MESSAGES = [
  'Analizando tus respuestas...',
  'Identificando tu estilo dominante...',
  'Preparando tus puntos de mejora...',
];

const TestLiderazgo: React.FC = () => {
  const [step, setStep] = useState<Step>('intro');
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [calcMsgIdx, setCalcMsgIdx] = useState(0);
  const advanceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (advanceTimeout.current) clearTimeout(advanceTimeout.current); }, []);

  useEffect(() => {
    if (step !== 'calculating') return;
    setCalcMsgIdx(0);
    const interval = setInterval(() => setCalcMsgIdx(i => Math.min(i + 1, CALC_MESSAGES.length - 1)), 650);
    return () => clearInterval(interval);
  }, [step]);

  // Estilo dominante y secundario (el secundario le da riqueza al resultado)
  const { resultKey, secondKey } = useMemo(() => {
    if (answers.length === 0) return { resultKey: null, secondKey: null };
    const counts: Record<string, number> = {};
    answers.forEach(a => { counts[a] = (counts[a] || 0) + 1; });
    const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return {
      resultKey: ranked[0]?.[0] ?? null,
      secondKey: ranked[1] && ranked[1][1] >= 2 ? ranked[1][0] : null,
    };
  }, [answers]);

  const estilo = resultKey ? ESTILOS_LIDERAZGO[resultKey] : null;
  const segundo = secondKey ? ESTILOS_LIDERAZGO[secondKey] : null;

  const pickAnswer = (estiloKey: string, optIdx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(optIdx);
    advanceTimeout.current = setTimeout(() => {
      setAnswers([...answers, estiloKey]);
      setSelectedIdx(null);
      if (qIndex < PREGUNTAS_LIDERAZGO.length - 1) setQIndex(qIndex + 1);
      else setStep('capture');
    }, 260);
  };

  const goBack = () => {
    if (qIndex === 0) { setStep('intro'); return; }
    setAnswers(answers.slice(0, -1));
    setQIndex(qIndex - 1);
  };

  const submitAndReveal = async () => {
    setStep('calculating');
    const minDelay = new Promise(r => setTimeout(r, 1500));
    const save = fetch('/api/cursos?action=liderazgo-submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, contact, style: resultKey, answers }),
    }).catch(() => { /* si falla el guardado, igual mostramos el resultado */ });
    await Promise.all([save, minDelay]);
    setStep('result');
  };

  const waHref = estilo
    ? `https://wa.me/5493515632496?text=${encodeURIComponent(`Hola Cecilia! Hice el test de liderazgo y me dio "${estilo.nombre}". Quiero profundizar en esto`)}`
    : 'https://wa.me/5493515632496';

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
          {PREGUNTAS_LIDERAZGO.map((_, i) => (
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
              <p className="text-brand-gold text-xs font-bold tracking-[0.2em] uppercase mb-4">Test gratuito · 2 minutos</p>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl text-brand-dark leading-tight mb-4">
                ¿Qué tipo de líder <span className="text-brand-gold">sos realmente?</span>
              </h1>
              <p className="text-gray-600 text-base mb-6 max-w-md mx-auto">
                10 situaciones concretas para descubrir tu estilo de liderazgo, tus fortalezas y qué te está frenando a vos y a tu equipo.
              </p>
              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 mb-7">
                <Users className="w-3.5 h-3.5 text-brand-gold" /> Del método de Cecilia B. Sánchez · +600 personas mentoreadas
              </div>
              <button onClick={() => setStep('quiz')}
                className="tap-feedback w-full sm:w-auto inline-flex items-center justify-center gap-2 gold-gradient text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-shadow text-base">
                Empezar el test <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-xs text-gray-400 mt-4">Es gratis. Al final vas a ver tu resultado completo.</p>
            </div>
          )}

          {/* ── QUIZ ──────────────────────────────────────────────────── */}
          {step === 'quiz' && (
            <div key={qIndex} className="anim-fade-slide-up">
              <p className="text-center text-xs text-gray-400 mb-2">Situación {qIndex + 1} de {PREGUNTAS_LIDERAZGO.length}</p>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-brand-dark text-center mb-7 leading-snug">
                {PREGUNTAS_LIDERAZGO[qIndex].pregunta}
              </h2>
              <div className="space-y-2.5">
                {PREGUNTAS_LIDERAZGO[qIndex].opciones.map((op, i) => {
                  const isSelected = selectedIdx === i;
                  const isDimmed = selectedIdx !== null && !isSelected;
                  return (
                    <button key={i} onClick={() => pickAnswer(op.estilo, i)}
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
              <p className="text-gray-600 text-sm mb-6">Dejanos tu mail o WhatsApp y te enviamos el análisis completo, junto con recursos de liderazgo que compartimos cada tanto.</p>

              <div className="space-y-3 text-left mb-2">
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input value={contact} onChange={e => setContact(e.target.value)} placeholder="tu@email.com o tu WhatsApp"
                    className="w-full border-2 border-gray-200 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-brand-gold text-brand-dark" />
                </div>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre (opcional)"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-gold text-brand-dark" />
              </div>

              <button onClick={submitAndReveal}
                className="tap-feedback w-full mt-4 flex items-center justify-center gap-2 gold-gradient text-white font-bold py-4 rounded-xl shadow-md min-h-[56px] text-base">
                Ver mi resultado <ArrowRight className="w-5 h-5" />
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
          {step === 'result' && estilo && (
            <div className="anim-fade-slide-up">
              <p className="text-center text-gray-500 text-sm mb-6">Tu estilo de liderazgo</p>

              {/* Resumen principal */}
              <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 mb-4 relative overflow-hidden anim-pop-in">
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: estilo.color }} />
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: `${estilo.color}1a` }}>
                    <Compass className="w-8 h-8" style={{ color: estilo.color }} />
                  </div>
                  <h1 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark mb-2">{estilo.nombre}</h1>
                  <p className="font-medium text-base mb-5" style={{ color: estilo.color }}>{estilo.tagline}</p>
                </div>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{estilo.description}</p>
                {segundo && (
                  <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-100">
                    También aparece fuerte en vos <span className="font-semibold" style={{ color: segundo.color }}>{segundo.nombre.replace('El líder ', 'el perfil ')}</span>. Esa mezcla es parte de lo que te hace única liderando.
                  </p>
                )}
              </div>

              {/* Fortalezas */}
              <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 mb-4 anim-fade-slide-up" style={{ animationDelay: '80ms' }}>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-heading font-bold text-brand-dark">Tus fortalezas</h3>
                </div>
                <ul className="space-y-2.5">
                  {estilo.fortalezas.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Costo oculto */}
              <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 mb-4 anim-fade-slide-up" style={{ animationDelay: '140ms' }}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h3 className="font-heading font-bold text-brand-dark">Lo que este estilo te está costando</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{estilo.costoOculto}</p>
              </div>

              {/* Puntos de mejora */}
              <div className="rounded-2xl p-5 sm:p-6 mb-4 text-white anim-fade-slide-up" style={{ background: estilo.color, animationDelay: '200ms' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5" />
                  <h3 className="font-heading font-bold">Tus puntos de mejora</h3>
                </div>
                <ul className="space-y-3">
                  {estilo.mejoras.map((m, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                      {m}
                    </li>
                  ))}
                </ul>
                <p className="text-sm mt-4 pt-4 border-t border-white/20 opacity-95">{estilo.siguiente}</p>
              </div>

              {/* Puente al eneagrama */}
              <div className="bg-brand-dark rounded-3xl p-6 sm:p-7 text-white text-center mb-4 anim-fade-slide-up" style={{ animationDelay: '260ms' }}>
                <p className="font-heading font-bold text-lg mb-3">Tu forma de liderar no es casualidad</p>
                <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
                  {estilo.eneatipos.map(n => {
                    const t = ENEATIPOS_DETALLE[n];
                    if (!t) return null;
                    return (
                      <div key={n} className="flex items-center gap-2 bg-white/10 rounded-full pl-1.5 pr-4 py-1.5">
                        <span className="w-7 h-7 rounded-full flex items-center justify-center font-heading font-bold text-xs text-white shrink-0" style={{ background: t.color }}>{n}</span>
                        <span className="text-xs font-medium">{t.nombre}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-gray-300 text-sm mb-5">{estilo.eneagramInsight}</p>
                <p className="text-gray-400 text-xs mb-4">Si querés profundizar en tu estilo y trabajarlo con acompañamiento, escribile a Cecilia.</p>
                <a href={waHref} target="_blank" rel="noopener noreferrer"
                  className="tap-feedback inline-flex items-center justify-center gap-2 gold-gradient text-white font-bold py-3.5 px-8 rounded-full shadow-md">
                  <MessageCircle className="w-5 h-5" /> Quiero profundizar en esto
                </a>
              </div>

              {/* Recursos */}
              <Link to="/recursos" className="tap-feedback block bg-white rounded-2xl p-5 border border-gray-100 hover:border-brand-gold/40 anim-fade-slide-up" style={{ animationDelay: '320ms' }}>
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-xl bg-brand-gold/10 flex items-center justify-center shrink-0"><Send className="w-5 h-5 text-brand-gold" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-brand-dark text-sm">Más contenido gratuito de Cecilia</p>
                    <p className="text-xs text-gray-500">Tests, guías y videos sobre liderazgo y autoconocimiento</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
                </div>
              </Link>

              {contact && (
                <p className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 mt-4">
                  <Check className="w-3.5 h-3.5" /> Te lo enviamos también a tus datos
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestLiderazgo;
