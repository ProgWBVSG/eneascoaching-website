import React, { useState, useMemo } from 'react';
import { AFIRMACIONES } from '../data/afirmaciones';
import { ChevronRight, ChevronLeft, CheckCircle, Send, User, Check } from 'lucide-react';

const PER_PAGE = 30;
const TOTAL_PAGES = Math.ceil(AFIRMACIONES.length / PER_PAGE);

const EneaTestCompleto: React.FC = () => {
  // step: 0 = datos personales, 1..TOTAL_PAGES = páginas de afirmaciones
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const totalMarked = marked.size;
  const totalAfirm = AFIRMACIONES.length;
  const overallProgress = Math.round((step / TOTAL_PAGES) * 100);

  const pageAfirmaciones = useMemo(() => {
    if (step < 1 || step > TOTAL_PAGES) return [];
    const start = (step - 1) * PER_PAGE;
    return AFIRMACIONES.slice(start, start + PER_PAGE);
  }, [step]);

  const toggle = (num: number) => {
    setMarked(prev => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  };

  const handleStart = () => {
    if (!name.trim()) {
      setNameError('Por favor ingresá tu nombre para continuar.');
      return;
    }
    setNameError('');
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (step < TOTAL_PAGES) {
      setStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(s => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setStep(0);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      // Calcular totales por tipo
      const totals: Record<number, number> = {};
      for (let i = 1; i <= 9; i++) totals[i] = 0;
      const responses: number[] = [];
      for (const a of AFIRMACIONES) {
        if (marked.has(a.num)) {
          totals[a.type]++;
          responses.push(a.num);
        }
      }

      const res = await fetch('/api/enea-completo-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, responses, totals }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al enviar');
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al enviar. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Pantalla de éxito ──────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-beige flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <div className="w-20 h-20 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-brand-gold" />
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark mb-3">
            ¡Gracias, {name}!
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mb-6">
            Tu test fue enviado correctamente. Cecilia revisará tus respuestas y se pondrá en contacto con vos pronto.
          </p>
          <p className="text-xs sm:text-sm text-gray-400 italic px-4">
            "Conviértete en el que fuiste, antes que eras con el recuerdo y la sabiduría de aquel en el que te convertiste."
          </p>
          <p className="text-xs text-gray-400 mt-2">— Proverbio Sufí</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-beige flex flex-col">

      {/* ── Header sticky ─────────────────────────────────────────────────── */}
      <div className="bg-brand-dark text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shrink-0 sticky top-0 z-10">
        <div className="min-w-0">
          <p className="text-brand-gold text-xs font-bold tracking-widest uppercase">Eneascoaching</p>
          <h1 className="font-heading font-bold text-base sm:text-lg tracking-wide leading-tight truncate">
            ENEA-TEST COMPLETO
          </h1>
        </div>
        {step > 0 && (
          <div className="text-right ml-3">
            <p className="text-xs text-gray-400">Página {step} / {TOTAL_PAGES}</p>
            <p className="text-brand-gold font-bold text-sm">{totalMarked} marcadas</p>
          </div>
        )}
      </div>

      {/* ── Barra de progreso ────────────────────────────────────────────── */}
      <div className="h-1 bg-gray-200 shrink-0 sticky top-[60px] sm:top-[72px] z-10">
        <div
          className="h-1 bg-brand-gold transition-all duration-500"
          style={{ width: `${overallProgress}%` }}
        />
      </div>

      {/* ── Contenido ───────────────────────────────────────────────────── */}
      <div className="flex-1">
        <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-10">

          {/* STEP 0: Datos personales */}
          {step === 0 && (
            <div className="text-center">
              <div className="mb-6 sm:mb-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-4">
                  <User className="w-7 h-7 sm:w-8 sm:h-8 text-brand-gold" />
                </div>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark mb-2 sm:mb-3">
                  Bienvenida al Test Completo
                </h2>
                <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
                  Encontrarás {totalAfirm} afirmaciones. Marca con un toque las que te describan tal como sos hoy. Si dudás, déjala sin marcar.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 max-w-md mx-auto text-left">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tu nombre *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setNameError(''); }}
                  placeholder="Nombre y apellido"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-brand-dark focus:outline-none focus:border-brand-gold transition-colors"
                  autoFocus
                />

                <label className="block text-sm font-semibold text-gray-700 mb-2 mt-4">
                  Tu email <span className="text-gray-400 font-normal">(opcional)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-brand-dark focus:outline-none focus:border-brand-gold transition-colors"
                />

                {nameError && <p className="text-red-500 text-sm mt-2">{nameError}</p>}

                <div className="bg-brand-beige rounded-xl p-4 mt-5 text-xs sm:text-sm text-gray-600">
                  <p className="font-semibold text-brand-dark mb-1">Antes de empezar:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Respondé pensando en cómo realmente sos, no cómo te gustaría ser.</li>
                    <li>Completalo de una sola vez, sin detenerte mucho en cada afirmación.</li>
                    <li>Si dudás, dejá sin marcar.</li>
                  </ul>
                </div>

                <button
                  onClick={handleStart}
                  className="w-full mt-5 bg-brand-gold hover:bg-amber-600 active:bg-amber-700 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-base"
                >
                  Comenzar el test
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEPS 1..N: Afirmaciones */}
          {step >= 1 && (
            <div>
              <p className="text-center text-gray-500 text-sm mb-5 italic">
                Marcá las afirmaciones con las que te identificas:
              </p>

              <div className="space-y-2 sm:space-y-3 mb-6">
                {pageAfirmaciones.map(a => {
                  const isMarked = marked.has(a.num);
                  return (
                    <button
                      key={a.num}
                      onClick={() => toggle(a.num)}
                      className={`w-full text-left flex items-start gap-3 p-3 sm:p-4 rounded-xl border-2 transition-all duration-150 touch-manipulation
                        ${isMarked
                          ? 'bg-brand-gold/10 border-brand-gold'
                          : 'bg-white border-gray-200 active:bg-gray-50'
                        }`}
                    >
                      <div
                        className={`shrink-0 w-6 h-6 sm:w-6 sm:h-6 rounded-md border-2 flex items-center justify-center mt-0.5 transition-colors
                          ${isMarked
                            ? 'bg-brand-gold border-brand-gold'
                            : 'bg-white border-gray-300'
                          }`}
                      >
                        {isMarked && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                      </div>
                      <span className={`text-sm sm:text-base leading-snug ${isMarked ? 'text-brand-dark font-medium' : 'text-gray-700'}`}>
                        {a.text}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Navegación */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sticky bottom-0 bg-brand-beige pt-3 pb-2 -mx-4 px-4 border-t border-gray-200 sm:border-0 sm:static">
                <div className="flex items-center justify-between sm:hidden">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1.5 px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 active:bg-gray-50 font-medium min-h-[48px] bg-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Anterior
                  </button>
                  <span className="text-sm font-medium text-gray-500">
                    {step} / {TOTAL_PAGES}
                  </span>
                </div>

                {step < TOTAL_PAGES ? (
                  <button
                    onClick={handleNext}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 py-4 sm:py-3 px-8 rounded-xl bg-brand-gold hover:bg-amber-600 active:bg-amber-700 text-white font-bold transition-colors min-h-[56px] sm:min-h-0 text-base"
                  >
                    Continuar
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={submitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 py-4 sm:py-3 px-8 rounded-xl bg-brand-dark hover:bg-gray-800 active:bg-gray-900 text-white font-bold transition-colors disabled:opacity-60 min-h-[56px] sm:min-h-0 text-base"
                  >
                    {submitting ? 'Enviando...' : 'Enviar mi test'}
                    <Send className="w-5 h-5" />
                  </button>
                )}

                <div className="hidden sm:flex items-center gap-3">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-white transition-colors font-medium"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Anterior
                  </button>
                  <span className="text-sm text-gray-500">
                    Página {step} de {TOTAL_PAGES}
                  </span>
                </div>
              </div>

              {error && <p className="text-center text-red-500 text-sm mt-4">{error}</p>}
            </div>
          )}
        </div>
      </div>

      <div className="text-center py-4 text-xs text-gray-400 shrink-0">
        @CeciliaBSanchez · ENEA-TEST Completo
      </div>
    </div>
  );
};

export default EneaTestCompleto;
