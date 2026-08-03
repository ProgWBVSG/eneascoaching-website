import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AFIRMACIONES_LIDERAZGO, PREGUNTA_REFLEXION, ESCALA_LIKERT, getBanda } from '../data/liderazgoLikert';
import {
  ArrowLeft, ArrowRight, Sparkles, Mail, Loader2, MessageCircle,
  Send, Check, Users, Target,
} from 'lucide-react';

type Step = 'intro' | 'quiz' | 'reflexion' | 'capture' | 'calculating' | 'result';

const CALC_MESSAGES = [
  'Sumando tus respuestas...',
  'Ubicando tu resultado...',
  'Preparando tu devolución...',
];

const TestLiderazgo: React.FC = () => {
  const [step, setStep] = useState<Step>('intro');
  const [qIndex, setQIndex] = useState(0);
  const [ratings, setRatings] = useState<number[]>([]);
  const [selectedVal, setSelectedVal] = useState<number | null>(null);
  const [reflexion, setReflexion] = useState('');
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

  const score = useMemo(() => ratings.reduce((a, b) => a + b, 0), [ratings]);
  const banda = useMemo(() => ratings.length === AFIRMACIONES_LIDERAZGO.length ? getBanda(score) : null, [ratings, score]);

  const pickValue = (val: number) => {
    if (selectedVal !== null) return;
    setSelectedVal(val);
    advanceTimeout.current = setTimeout(() => {
      setRatings(r => [...r, val]);
      setSelectedVal(null);
      if (qIndex < AFIRMACIONES_LIDERAZGO.length - 1) setQIndex(qIndex + 1);
      else setStep('reflexion');
    }, 220);
  };

  const goBack = () => {
    if (qIndex === 0) { setStep('intro'); return; }
    setRatings(r => r.slice(0, -1));
    setQIndex(qIndex - 1);
  };

  const submitAndReveal = async () => {
    setStep('calculating');
    const minDelay = new Promise(r => setTimeout(r, 1500));
    const save = fetch('/api/cursos?action=liderazgo-submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, contact, style: String(score), answers: { ratings, reflexion } }),
    }).catch(() => { /* si falla el guardado, igual mostramos el resultado */ });
    await Promise.all([save, minDelay]);
    setStep('result');
  };

  const waHref = banda
    ? `https://wa.me/5493515632496?text=${encodeURIComponent(`Hola Cecilia! Hice el test "Cómo liderás" y saqué ${score}/100 (${banda.titulo}). Quiero profundizar en esto`)}`
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
          {AFIRMACIONES_LIDERAZGO.map((_, i) => (
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
              <p className="text-brand-gold text-xs font-bold tracking-[0.2em] uppercase mb-4">Test gratuito · 4 minutos</p>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl text-brand-dark leading-tight mb-4">
                ¿Cómo <span className="text-brand-gold">liderás</span>?
              </h1>
              <p className="text-gray-600 text-base mb-6 max-w-md mx-auto">
                20 afirmaciones para explorar tu estilo de liderazgo desde la mirada del Eneagrama. Respondé con honestidad, no hay respuestas correctas.
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

          {/* ── QUIZ (escala 1-5) ────────────────────────────────────── */}
          {step === 'quiz' && (
            <div key={qIndex} className="anim-fade-slide-up">
              <p className="text-center text-xs text-gray-400 mb-2">Afirmación {qIndex + 1} de {AFIRMACIONES_LIDERAZGO.length}</p>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-brand-dark text-center mb-7 leading-snug">
                {AFIRMACIONES_LIDERAZGO[qIndex]}
              </h2>
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {ESCALA_LIKERT.map(op => {
                  const isSelected = selectedVal === op.valor;
                  const isDimmed = selectedVal !== null && !isSelected;
                  return (
                    <button key={op.valor} onClick={() => pickValue(op.valor)}
                      className={`tap-feedback flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 py-4 px-1 touch-manipulation min-h-[76px]
                        ${isSelected ? 'bg-brand-gold border-brand-gold shadow-md' : 'bg-white border-gray-200 hover:border-brand-gold/60 hover:bg-brand-gold/5'}
                        ${isDimmed ? 'opacity-40' : 'opacity-100'}`}>
                      <span className={`font-heading font-bold text-lg ${isSelected ? 'text-white' : 'text-brand-dark'}`}>{op.valor}</span>
                      <span className={`text-[10px] sm:text-xs text-center leading-tight ${isSelected ? 'text-white' : 'text-gray-500'}`}>{op.label}</span>
                    </button>
                  );
                })}
              </div>
              <button onClick={goBack} className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm mt-6 mx-auto">
                <ArrowLeft className="w-4 h-4" /> Anterior
              </button>
            </div>
          )}

          {/* ── REFLEXIÓN FINAL ──────────────────────────────────────── */}
          {step === 'reflexion' && (
            <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 anim-fade-scale-in">
              <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 flex items-center justify-center mx-auto mb-4">
                <Target className="w-7 h-7 text-brand-gold" />
              </div>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-brand-dark text-center mb-2 leading-snug">
                Una última pregunta, la más poderosa
              </h2>
              <p className="text-gray-600 text-sm text-center mb-6">{PREGUNTA_REFLEXION}</p>
              <textarea value={reflexion} onChange={e => setReflexion(e.target.value)} rows={4} placeholder="Escribí lo que se te ocurra... (opcional)"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-gold text-brand-dark text-sm resize-none" />
              <button onClick={() => setStep('capture')}
                className="tap-feedback w-full mt-5 flex items-center justify-center gap-2 gold-gradient text-white font-bold py-4 rounded-xl shadow-md min-h-[56px] text-base">
                Continuar <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* ── CAPTURE ──────────────────────────────────────────────── */}
          {step === 'capture' && (
            <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 text-center anim-fade-scale-in">
              <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-brand-gold anim-soft-pulse" />
              </div>
              <h2 className="font-heading font-bold text-2xl text-brand-dark mb-2">Tu resultado está listo</h2>
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
          {step === 'result' && banda && (
            <div className="anim-fade-slide-up">
              <p className="text-center text-gray-500 text-sm mb-6">Tu resultado</p>

              <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 mb-4 relative overflow-hidden anim-pop-in text-center">
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: banda.color }} />
                <div className="w-20 h-20 rounded-full mx-auto mb-4 flex flex-col items-center justify-center" style={{ background: `${banda.color}1a` }}>
                  <span className="font-heading font-bold text-2xl" style={{ color: banda.color }}>{score}</span>
                  <span className="text-[10px] text-gray-500 -mt-0.5">/ 100</span>
                </div>
                <h1 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark mb-3">{banda.titulo}</h1>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{banda.descripcion}</p>
              </div>

              {reflexion.trim() && (
                <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 mb-4 anim-fade-slide-up" style={{ animationDelay: '80ms' }}>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Tu reflexión</p>
                  <p className="text-sm text-gray-500 italic mb-2">{PREGUNTA_REFLEXION}</p>
                  <p className="text-sm text-brand-dark leading-relaxed">{reflexion}</p>
                </div>
              )}

              <div className="bg-brand-dark rounded-3xl p-6 sm:p-7 text-white text-center mb-4 anim-fade-slide-up" style={{ animationDelay: '140ms' }}>
                <p className="font-heading font-bold text-lg mb-3">Este número no te define, te orienta</p>
                <p className="text-gray-300 text-sm mb-5">
                  El Eneagrama te muestra por qué liderás como liderás, no solo qué te falta. Ahí está la diferencia entre corregir un hábito y transformar tu forma de liderar de raíz.
                </p>
                <a href={waHref} target="_blank" rel="noopener noreferrer"
                  className="tap-feedback inline-flex items-center justify-center gap-2 gold-gradient text-white font-bold py-3.5 px-8 rounded-full shadow-md">
                  <MessageCircle className="w-5 h-5" /> Quiero profundizar en esto
                </a>
              </div>

              <Link to="/recursos" className="tap-feedback block bg-white rounded-2xl p-5 border border-gray-100 hover:border-brand-gold/40 anim-fade-slide-up" style={{ animationDelay: '200ms' }}>
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
