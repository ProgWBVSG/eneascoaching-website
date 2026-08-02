import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { LIDERAZGO_TIPOS } from '../data/liderazgoTipos';
import {
  ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Sparkles, Mail, Loader2, MessageCircle,
  Send, Check, Users, TrendingUp, AlertTriangle, Target,
} from 'lucide-react';

type Step = 'intro' | 'quiz' | 'capture' | 'calculating' | 'result';
type Answers = Record<string, string[]>;

const CALC_MESSAGES = [
  'Analizando tus palabras...',
  'Identificando tu estilo dominante...',
  'Preparando tus puntos de mejora...',
];

const TestLiderazgo: React.FC = () => {
  const [step, setStep] = useState<Step>('intro');
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [calcMsgIdx, setCalcMsgIdx] = useState(0);

  React.useEffect(() => {
    if (step !== 'calculating') return;
    setCalcMsgIdx(0);
    const interval = setInterval(() => setCalcMsgIdx(i => Math.min(i + 1, CALC_MESSAGES.length - 1)), 650);
    return () => clearInterval(interval);
  }, [step]);

  const currentTipo = LIDERAZGO_TIPOS[qIndex];
  const currentKey = String(currentTipo?.num ?? '');
  const selectedWords = currentKey ? (answers[currentKey] || []) : [];

  const toggleWord = (word: string) => {
    setAnswers(prev => {
      const current = prev[currentKey] || [];
      const updated = current.includes(word) ? current.filter(w => w !== word) : [...current, word];
      return { ...prev, [currentKey]: updated };
    });
  };

  // Tipo dominante y secundario: el que suma más palabras tildadas
  const { dominante, secundario } = useMemo(() => {
    const counts = Object.entries(answers)
      .map(([num, words]) => ({ num: Number(num), count: (words as string[]).length }))
      .filter(e => e.count > 0)
      .sort((a, b) => b.count - a.count);
    if (counts.length === 0) return { dominante: null, secundario: null };
    const domTipo = LIDERAZGO_TIPOS.find(t => t.num === counts[0].num) || null;
    const segTipo = counts[1] && counts[1].count >= 3 ? LIDERAZGO_TIPOS.find(t => t.num === counts[1].num) || null : null;
    return { dominante: domTipo, secundario: segTipo };
  }, [answers]);

  const goNext = () => {
    if (qIndex < LIDERAZGO_TIPOS.length - 1) setQIndex(qIndex + 1);
    else setStep('capture');
  };

  const goBack = () => {
    if (qIndex === 0) setStep('intro');
    else setQIndex(qIndex - 1);
  };

  const submitAndReveal = async () => {
    setStep('calculating');
    const minDelay = new Promise(r => setTimeout(r, 1500));
    const save = fetch('/api/cursos?action=liderazgo-submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, contact, style: dominante ? String(dominante.num) : null, answers }),
    }).catch(() => { /* si falla el guardado, igual mostramos el resultado */ });
    await Promise.all([save, minDelay]);
    setStep('result');
  };

  const waHref = dominante
    ? `https://wa.me/5493515632496?text=${encodeURIComponent(`Hola Cecilia! Hice el test de liderazgo y me dio "${dominante.archetype}". Quiero profundizar en esto`)}`
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
          {LIDERAZGO_TIPOS.map((_, i) => (
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
                ¿Qué tipo de líder <span className="text-brand-gold">sos realmente?</span>
              </h1>
              <p className="text-gray-600 text-base mb-6 max-w-md mx-auto">
                9 grupos de palabras. Tildá las que te representan cuando lideras y descubrí tu estilo, tus fortalezas y qué te está frenando a vos y a tu equipo.
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

          {/* ── QUIZ (tildar palabras) ───────────────────────────────── */}
          {step === 'quiz' && currentTipo && (
            <div key={qIndex} className="anim-fade-slide-up">
              <p className="text-center text-xs text-gray-400 mb-2">Grupo {qIndex + 1} de {LIDERAZGO_TIPOS.length}</p>
              <p className="text-center text-gray-500 text-sm mb-5 italic">Tildá las palabras con las que te identificás cuando lideras:</p>

              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-6">
                {currentTipo.words.map(word => {
                  const selected = selectedWords.includes(word);
                  return (
                    <button key={word} onClick={() => toggleWord(word)}
                      className={`px-4 sm:px-5 py-3 sm:py-2.5 rounded-full border-2 font-medium text-sm transition-all duration-150 min-h-[48px] sm:min-h-0 touch-manipulation
                        ${selected ? 'text-white shadow-md scale-105 border-transparent' : 'bg-white border-gray-200 text-gray-700 active:bg-gray-50'}`}
                      style={selected ? { background: currentTipo.color } : undefined}>
                      {word}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-center mb-6">
                <div className="bg-white rounded-xl px-5 py-3 shadow-sm flex items-center gap-3">
                  <span className="text-gray-500 text-sm">Seleccionadas:</span>
                  <span className="font-heading font-bold text-2xl" style={{ color: currentTipo.color }}>{selectedWords.length}</span>
                  <span className="text-gray-400 text-sm">/ {currentTipo.words.length}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button onClick={goBack} className="flex items-center gap-1.5 px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-medium min-h-[48px]">
                  <ChevronLeft className="w-5 h-5" /> Anterior
                </button>
                <button onClick={goNext} className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-3.5 px-8 rounded-xl gold-gradient text-white font-bold min-h-[48px]">
                  {qIndex < LIDERAZGO_TIPOS.length - 1 ? 'Siguiente' : 'Ver mi resultado'} <ChevronRight className="w-5 h-5" />
                </button>
              </div>
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
          {step === 'result' && dominante && (
            <div className="anim-fade-slide-up">
              <p className="text-center text-gray-500 text-sm mb-6">Tu estilo de liderazgo</p>

              <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 mb-4 relative overflow-hidden anim-pop-in">
                <div className="absolute top-0 left-0 right-0 h-1" style={{ background: dominante.color }} />
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center font-heading font-bold text-2xl text-white" style={{ background: dominante.color }}>
                    {dominante.num}
                  </div>
                  <h1 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark mb-2">{dominante.archetype}</h1>
                  <p className="font-medium text-base mb-1" style={{ color: dominante.color }}>{dominante.category}</p>
                </div>
                {secundario && (
                  <p className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-100 text-center">
                    También aparece fuerte en vos <span className="font-semibold" style={{ color: secundario.color }}>{secundario.archetype}</span>. Esa mezcla es parte de lo que te hace única liderando.
                  </p>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 mb-4 anim-fade-slide-up" style={{ animationDelay: '80ms' }}>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-heading font-bold text-brand-dark">Tu fortaleza como líder</h3>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{dominante.fortaleza}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 mb-4 anim-fade-slide-up" style={{ animationDelay: '140ms' }}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h3 className="font-heading font-bold text-brand-dark">Tu punto ciego</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{dominante.puntoCiego}</p>
              </div>

              <div className="rounded-2xl p-5 sm:p-6 mb-4 text-white anim-fade-slide-up" style={{ background: dominante.color, animationDelay: '200ms' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5" />
                  <h3 className="font-heading font-bold">Tus puntos de mejora</h3>
                </div>
                <ul className="space-y-3">
                  {dominante.mejora.map((m, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-brand-dark rounded-3xl p-6 sm:p-7 text-white text-center mb-4 anim-fade-slide-up" style={{ animationDelay: '260ms' }}>
                <p className="font-heading font-bold text-lg mb-3">Este es tu patrón cuando lideras</p>
                <p className="text-gray-300 text-sm mb-5">
                  En el Eneagrama completo vas a entender también por qué actuás así, no solo cómo. Es la diferencia entre manejar tu estilo y transformarlo de raíz.
                </p>
                <a href={waHref} target="_blank" rel="noopener noreferrer"
                  className="tap-feedback inline-flex items-center justify-center gap-2 gold-gradient text-white font-bold py-3.5 px-8 rounded-full shadow-md">
                  <MessageCircle className="w-5 h-5" /> Quiero profundizar en esto
                </a>
              </div>

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
