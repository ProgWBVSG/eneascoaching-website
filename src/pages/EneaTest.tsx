import React, { useState } from 'react';
import { ENEATIPOS } from '../data/eneatipos';
import { ChevronRight, ChevronLeft, CheckCircle, Send, User } from 'lucide-react';

type Answers = Record<string, string[]>;

const TOTAL_STEPS = ENEATIPOS.length + 1; // 1 name step + 9 eneatipos

const EneaTest: React.FC = () => {
  const [step, setStep] = useState(0); // 0 = name, 1-9 = eneatipos, 10 = done
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [nameError, setNameError] = useState('');

  const currentEneatipo = step >= 1 && step <= 9 ? ENEATIPOS[step - 1] : null;
  const currentKey = currentEneatipo ? `type${currentEneatipo.num}` : '';
  const selectedWords = currentKey ? (answers[currentKey] || []) : [];

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
    if (step < ENEATIPOS.length) {
      setStep(s => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
    else setStep(0);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, answers }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al enviar');
      }
      setSubmitted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al enviar. Intentá de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const progress = step === 0 ? 0 : Math.round((step / TOTAL_STEPS) * 100);

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-beige flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-brand-gold" />
          </div>
          <h1 className="font-heading font-bold text-3xl text-brand-dark mb-3">
            ¡Gracias, {name}!
          </h1>
          <p className="text-gray-600 mb-6">
            Tu test ha sido enviado correctamente. Cecilia revisará tus respuestas y se pondrá en contacto con vos pronto.
          </p>
          <p className="text-sm text-gray-400 italic">
            "Conviértete en el que fuiste, antes que eras con el recuerdo y la sabiduría de aquel en el que te convertiste."
          </p>
          <p className="text-xs text-gray-400 mt-1">— Proverbio Sufí</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-beige">
      {/* Header */}
      <div className="bg-brand-dark text-white py-4 px-6 flex items-center justify-between">
        <div>
          <p className="text-brand-gold text-xs font-bold tracking-widest uppercase">Eneascoaching</p>
          <h1 className="font-heading font-bold text-lg tracking-wide">ENEA-TEST JURÍDICO</h1>
        </div>
        {step > 0 && (
          <div className="text-right">
            <p className="text-xs text-gray-400">Paso {step} de {ENEATIPOS.length}</p>
            <p className="text-brand-gold font-bold text-sm">{name}</p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {step > 0 && (
        <div className="h-1 bg-gray-200">
          <div
            className="h-1 bg-brand-gold transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* STEP 0: Name */}
        {step === 0 && (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-brand-gold" />
              </div>
              <h2 className="font-heading font-bold text-3xl text-brand-dark mb-3">
                Bienvenida al ENEA-TEST
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Este test te ayudará a identificar tu eneátipo. Leé cada palabra y tildá las que más te representen.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8 max-w-sm mx-auto">
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
              {nameError && (
                <p className="text-red-500 text-sm mt-2">{nameError}</p>
              )}
              <button
                onClick={handleNameNext}
                className="w-full mt-4 bg-brand-gold hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Comenzar el test
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-8 max-w-sm mx-auto">
              @CeciliaBSanchez · Eneascoaching
            </p>
          </div>
        )}

        {/* STEPS 1-9: Eneatipos */}
        {currentEneatipo && (
          <div>
            {/* Type header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-dark text-brand-gold font-heading font-bold text-2xl mb-3">
                {currentEneatipo.num}
              </div>
              <h2 className="font-heading font-bold text-2xl text-brand-dark tracking-wider">
                {currentEneatipo.title}
              </h2>
              <p className="text-brand-gold font-semibold tracking-widest text-sm mt-1 uppercase">
                {currentEneatipo.subtitle}
              </p>
              <p className="text-gray-500 text-xs mt-2">
                {currentEneatipo.archetypes.join(' · ')}
              </p>
            </div>

            {/* Instruction */}
            <p className="text-center text-gray-500 text-sm mb-6 italic">
              Tildá las palabras con las que te identificás:
            </p>

            {/* Word chips */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {currentEneatipo.words.map(word => {
                const selected = selectedWords.includes(word);
                return (
                  <button
                    key={word}
                    onClick={() => toggleWord(word)}
                    className={`px-5 py-2.5 rounded-full border-2 font-medium text-sm transition-all duration-200 cursor-pointer
                      ${selected
                        ? 'bg-brand-gold border-brand-gold text-white shadow-md scale-105'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-brand-gold hover:text-brand-gold'
                      }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>

            {/* Total counter */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="bg-white rounded-xl px-6 py-3 shadow-sm flex items-center gap-3">
                <span className="text-gray-500 text-sm">Total seleccionados:</span>
                <span className="font-heading font-bold text-2xl text-brand-gold">
                  {selectedWords.length}
                </span>
                <span className="text-gray-400 text-sm">/ {currentEneatipo.words.length}</span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
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

              {step < ENEATIPOS.length ? (
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-gold hover:bg-amber-600 text-white font-bold transition-colors"
                >
                  Siguiente
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-dark hover:bg-gray-800 text-white font-bold transition-colors disabled:opacity-60"
                >
                  {submitting ? 'Enviando...' : 'Enviar test'}
                  <Send className="w-5 h-5" />
                </button>
              )}
            </div>

            {error && (
              <p className="text-center text-red-500 text-sm mt-4">{error}</p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-6 text-xs text-gray-400">
        @CeciliaBSanchez · ENEA-TEST Jurídico
      </div>
    </div>
  );
};

export default EneaTest;
