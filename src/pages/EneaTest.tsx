import React, { useState } from 'react';
import { ENEATIPOS } from '../data/eneatipos';
import { ChevronRight, ChevronLeft, CheckCircle, Send, User } from 'lucide-react';

type Answers = Record<string, string[]>;

const EneaTest: React.FC = () => {
  const [step, setStep] = useState(0); // 0 = name, 1-9 = eneatipos
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');

  const currentEneatipo = step >= 1 && step <= 9 ? ENEATIPOS[step - 1] : null;
  const currentKey = currentEneatipo ? `type${currentEneatipo.num}` : '';
  const selectedWords = currentKey ? (answers[currentKey] || []) : [];
  const progress = step === 0 ? 0 : Math.round((step / 9) * 100);

  const toggleWord = (word: string) => {
    setAnswers(prev => {
      const current = prev[currentKey] || [];
      const updated = current.includes(word)
        ? current.filter(w => w !== word)
        : [...current, word];
      return { ...prev, [currentKey]: updated };
    });
  };

  const handleNameNext = () => {
    if (!name.trim()) {
      setNameError('Por favor ingresá tu nombre para continuar.');
      return;
    }
    setNameError('');
    setStep(1);
  };

  const handleNext = () => {
    if (step < 9) setStep(s => s + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
    else setStep(0);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/enea-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al enviar');
      setSubmitted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al enviar. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Pantalla de éxito ───────────────────────────────────────────────────
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

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-brand-dark text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shrink-0">
        <div>
          <p className="text-brand-gold text-xs font-bold tracking-widest uppercase">Eneascoaching</p>
          <h1 className="font-heading font-bold text-base sm:text-lg tracking-wide leading-tight">
            ENEA-TEST JURÍDICO
          </h1>
        </div>
        {step > 0 && (
          <div className="text-right ml-3">
            <p className="text-xs text-gray-400">{step} / 9</p>
            <p className="text-brand-gold font-bold text-sm truncate max-w-[120px]">{name}</p>
          </div>
        )}
      </div>

      {/* ── Barra de progreso ────────────────────────────────────────────── */}
      <div className="h-1 bg-gray-200 shrink-0">
        <div
          className="h-1 bg-brand-gold transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Contenido ───────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full max-w-xl mx-auto px-4 py-6 sm:py-10">

          {/* STEP 0: Nombre */}
          {step === 0 && (
            <div className="text-center">
              <div className="mb-6 sm:mb-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-4">
                  <User className="w-7 h-7 sm:w-8 sm:h-8 text-brand-gold" />
                </div>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark mb-2 sm:mb-3">
                  Bienvenida al ENEA-TEST
                </h2>
                <p className="text-gray-600 text-sm sm:text-base max-w-sm mx-auto">
                  Test simple: leé cada palabra y marcá las que sientas que te describen.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 max-w-sm mx-auto">
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-left">
                  Tu nombre
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setNameError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleNameNext()}
                  placeholder="Escribí tu nombre..."
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-brand-dark focus:outline-none focus:border-brand-gold transition-colors text-center text-lg font-medium"
                  autoFocus
                />
                {nameError && <p className="text-red-500 text-sm mt-2">{nameError}</p>}
                <button
                  onClick={handleNameNext}
                  className="w-full mt-4 bg-brand-gold hover:bg-amber-600 active:bg-amber-700 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-base"
                >
                  Comenzar el test
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-6">
                @CeciliaBSanchez · Eneascoaching
              </p>
            </div>
          )}

          {/* STEPS 1-9: Eneatipos */}
          {currentEneatipo && (
            <div>
              {/* Encabezado del tipo */}
              <div className="text-center mb-5 sm:mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-brand-dark text-brand-gold font-heading font-bold text-xl sm:text-2xl mb-2 sm:mb-3">
                  {currentEneatipo.num}
                </div>
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-brand-dark tracking-wider">
                  {currentEneatipo.title}
                </h2>
                <p className="text-brand-gold font-semibold tracking-widest text-xs sm:text-sm mt-1 uppercase">
                  {currentEneatipo.subtitle}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {currentEneatipo.archetypes.join(' · ')}
                </p>
              </div>

              {/* Instrucción */}
              <p className="text-center text-gray-500 text-sm mb-4 sm:mb-6 italic">
                Marca las palabras con las que te identificas:
              </p>

              {/* Chips de palabras — más grandes en mobile */}
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mb-5 sm:mb-8">
                {currentEneatipo.words.map(word => {
                  const selected = selectedWords.includes(word);
                  return (
                    <button
                      key={word}
                      onClick={() => toggleWord(word)}
                      className={`px-4 sm:px-5 py-3 sm:py-2.5 rounded-full border-2 font-medium text-sm sm:text-sm transition-all duration-150 cursor-pointer min-h-[48px] sm:min-h-0 touch-manipulation
                        ${selected
                          ? 'bg-brand-gold border-brand-gold text-white shadow-md scale-105'
                          : 'bg-white border-gray-200 text-gray-700 active:bg-gray-50'
                        }`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>

              {/* Contador */}
              <div className="flex justify-center mb-5 sm:mb-8">
                <div className="bg-white rounded-xl px-5 py-3 shadow-sm flex items-center gap-3">
                  <span className="text-gray-500 text-sm">Seleccionadas:</span>
                  <span className="font-heading font-bold text-2xl text-brand-gold">
                    {selectedWords.length}
                  </span>
                  <span className="text-gray-400 text-sm">/ {currentEneatipo.words.length}</span>
                </div>
              </div>

              {/* Navegación — apilada en mobile */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                {/* Fila superior mobile: Anterior + dots + número */}
                <div className="flex items-center justify-between sm:hidden">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1.5 px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-600 active:bg-gray-50 font-medium min-h-[48px]"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Anterior
                  </button>

                  {/* Dots compactos en mobile */}
                  <div className="flex gap-1">
                    {ENEATIPOS.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i + 1 < step ? 'bg-brand-gold w-3' :
                          i + 1 === step ? 'bg-brand-gold w-5' :
                          'bg-gray-200 w-3'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Botón siguiente — ancho completo en mobile */}
                {step < 9 ? (
                  <button
                    onClick={handleNext}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 py-4 sm:py-3 px-8 rounded-xl bg-brand-gold hover:bg-amber-600 active:bg-amber-700 text-white font-bold transition-colors min-h-[56px] sm:min-h-0 text-base"
                  >
                    Siguiente
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

                {/* Fila inferior desktop: Anterior + dots */}
                <div className="hidden sm:flex items-center gap-4">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-white transition-colors font-medium"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Anterior
                  </button>
                  <div className="flex gap-1.5">
                    {ENEATIPOS.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i + 1 < step ? 'bg-brand-gold w-4' :
                          i + 1 === step ? 'bg-brand-gold w-6' :
                          'bg-gray-200 w-4'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-center text-red-500 text-sm mt-4">{error}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <div className="text-center py-4 text-xs text-gray-400 shrink-0">
        @CeciliaBSanchez · ENEA-TEST Jurídico
      </div>
    </div>
  );
};

export default EneaTest;
