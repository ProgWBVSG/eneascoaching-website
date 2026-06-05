import React, { useState, useMemo, useRef } from 'react';
import { AFIRMACIONES } from '../data/afirmaciones';
import { getSigno, calcularEdad } from '../data/zodiaco';
import { ChevronRight, ChevronLeft, CheckCircle, Send, User, Check, Sparkles } from 'lucide-react';

const PER_PAGE = 30;
const TOTAL_PAGES = Math.ceil(AFIRMACIONES.length / PER_PAGE);

const ESTADOS_CIVIL = ['Soltera/o', 'Casada/o', 'En pareja', 'De novia/o', 'Viuda/o', 'Divorciada/o'];

const EneaTestCompleto: React.FC = () => {
  const [step, setStep] = useState(0); // 0 = datos personales, 1..TOTAL_PAGES = afirmaciones
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Datos personales
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [sexo, setSexo] = useState('');
  const [estadoCivil, setEstadoCivil] = useState('');
  const [profesion, setProfesion] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Refs para auto-jump entre inputs de fecha
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  // Marcaje de afirmaciones
  const [marked, setMarked] = useState<Set<number>>(new Set());

  const totalMarked = marked.size;
  const totalAfirm = AFIRMACIONES.length;
  const overallProgress = Math.round((step / TOTAL_PAGES) * 100);

  // Cálculo automático del signo y edad
  const diaN = parseInt(day) || 0;
  const mesN = parseInt(month) || 0;
  const anioN = parseInt(year) || 0;
  const signo = useMemo(() => getSigno(diaN, mesN), [diaN, mesN]);
  const edad = useMemo(() => calcularEdad(diaN, mesN, anioN), [diaN, mesN, anioN]);

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

  // ─── Validación de datos personales ────────────────────────────────
  const validatePersonalData = (): boolean => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Ingresá tu nombre.';
    if (!day || !month || !year) e.fecha = 'Completá tu fecha de nacimiento.';
    else {
      if (diaN < 1 || diaN > 31) e.fecha = 'Día inválido.';
      else if (mesN < 1 || mesN > 12) e.fecha = 'Mes inválido.';
      else if (anioN < 1900 || anioN > new Date().getFullYear()) e.fecha = 'Año inválido.';
      else if (edad === null) e.fecha = 'Fecha inválida.';
    }
    if (!sexo) e.sexo = 'Seleccioná una opción.';
    if (!estadoCivil) e.estadoCivil = 'Seleccioná una opción.';
    if (!profesion.trim()) e.profesion = 'Ingresá tu ocupación o profesión.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleStart = () => {
    if (!validatePersonalData()) return;
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

  // ─── Handlers para inputs de fecha con auto-jump ──────────────────
  const onDayChange = (v: string) => {
    const clean = v.replace(/\D/g, '').slice(0, 2);
    setDay(clean);
    if (clean.length === 2) monthRef.current?.focus();
  };
  const onMonthChange = (v: string) => {
    const clean = v.replace(/\D/g, '').slice(0, 2);
    setMonth(clean);
    if (clean.length === 2) yearRef.current?.focus();
  };
  const onYearChange = (v: string) => {
    const clean = v.replace(/\D/g, '').slice(0, 4);
    setYear(clean);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const totals: Record<number, number> = {};
      for (let i = 1; i <= 9; i++) totals[i] = 0;
      const responses: number[] = [];
      for (const a of AFIRMACIONES) {
        if (marked.has(a.num)) {
          totals[a.type]++;
          responses.push(a.num);
        }
      }

      const dobISO = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

      const res = await fetch('/api/enea-completo-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          date_of_birth: dobISO,
          age: edad,
          gender: sexo,
          marital_status: estadoCivil,
          profession: profesion,
          zodiac_sign: signo ? signo.nombre : null,
          responses,
          totals,
        }),
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

  // ─── Pantalla de éxito ──────────────────────────────────────────────
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

      {/* ── Header sticky ───────────────────────────────────────────────── */}
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

      {/* ── Barra de progreso ──────────────────────────────────────────── */}
      <div className="h-1 bg-gray-200 shrink-0 sticky top-[60px] sm:top-[72px] z-10">
        <div className="h-1 bg-brand-gold transition-all duration-500" style={{ width: `${overallProgress}%` }} />
      </div>

      {/* ── Contenido ──────────────────────────────────────────────────── */}
      <div className="flex-1">
        <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-10">

          {/* STEP 0: Datos personales */}
          {step === 0 && (
            <div>
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-4">
                  <User className="w-7 h-7 sm:w-8 sm:h-8 text-brand-gold" />
                </div>
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark mb-2">
                  Bienvenida al Test Completo
                </h2>
                <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
                  Completá tus datos para empezar. Luego encontrarás {totalAfirm} afirmaciones — marcá las que te describan.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-8 space-y-5">

                {/* Nombre */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
                    placeholder="Nombre y apellido"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-brand-dark focus:outline-none focus:border-brand-gold transition-colors"
                    autoFocus
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-gray-400 font-normal">(opcional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-brand-dark focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>

                {/* Fecha de nacimiento + signo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha de nacimiento *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={day}
                      onChange={e => { onDayChange(e.target.value); setErrors(p => ({ ...p, fecha: '' })); }}
                      placeholder="DD"
                      maxLength={2}
                      className="w-16 sm:w-20 text-center border-2 border-gray-200 rounded-xl px-2 py-3 text-brand-dark focus:outline-none focus:border-brand-gold transition-colors font-medium"
                    />
                    <span className="text-gray-400 font-bold">/</span>
                    <input
                      ref={monthRef}
                      type="text"
                      inputMode="numeric"
                      value={month}
                      onChange={e => { onMonthChange(e.target.value); setErrors(p => ({ ...p, fecha: '' })); }}
                      placeholder="MM"
                      maxLength={2}
                      className="w-16 sm:w-20 text-center border-2 border-gray-200 rounded-xl px-2 py-3 text-brand-dark focus:outline-none focus:border-brand-gold transition-colors font-medium"
                    />
                    <span className="text-gray-400 font-bold">/</span>
                    <input
                      ref={yearRef}
                      type="text"
                      inputMode="numeric"
                      value={year}
                      onChange={e => { onYearChange(e.target.value); setErrors(p => ({ ...p, fecha: '' })); }}
                      placeholder="AAAA"
                      maxLength={4}
                      className="w-24 sm:w-28 text-center border-2 border-gray-200 rounded-xl px-2 py-3 text-brand-dark focus:outline-none focus:border-brand-gold transition-colors font-medium"
                    />

                    {/* Signo automático al lado */}
                    {signo && (
                      <div className="flex items-center gap-1.5 ml-1 sm:ml-3 px-2 sm:px-3 py-2 bg-brand-gold/10 rounded-xl border border-brand-gold/20">
                        <span className="text-xl sm:text-2xl leading-none">{signo.simbolo}</span>
                        <span className="text-xs sm:text-sm font-semibold text-brand-gold">{signo.nombre}</span>
                      </div>
                    )}
                  </div>

                  {edad !== null && (
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-brand-gold" />
                      {edad} años
                    </p>
                  )}
                  {errors.fecha && <p className="text-red-500 text-xs mt-1.5">{errors.fecha}</p>}
                </div>

                {/* Sexo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sexo *</label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {['Femenino', 'Masculino'].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => { setSexo(opt); setErrors(p => ({ ...p, sexo: '' })); }}
                        className={`py-3 px-4 rounded-xl border-2 font-medium text-sm transition-all min-h-[48px]
                          ${sexo === opt
                            ? 'bg-brand-gold border-brand-gold text-white'
                            : 'bg-white border-gray-200 text-gray-700 active:bg-gray-50'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {errors.sexo && <p className="text-red-500 text-xs mt-1.5">{errors.sexo}</p>}
                </div>

                {/* Estado civil */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Estado civil *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {ESTADOS_CIVIL.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => { setEstadoCivil(opt); setErrors(p => ({ ...p, estadoCivil: '' })); }}
                        className={`py-2.5 px-3 rounded-xl border-2 font-medium text-xs sm:text-sm transition-all min-h-[44px]
                          ${estadoCivil === opt
                            ? 'bg-brand-gold border-brand-gold text-white'
                            : 'bg-white border-gray-200 text-gray-700 active:bg-gray-50'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {errors.estadoCivil && <p className="text-red-500 text-xs mt-1.5">{errors.estadoCivil}</p>}
                </div>

                {/* Profesión */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ocupación o profesión *
                  </label>
                  <input
                    type="text"
                    value={profesion}
                    onChange={e => { setProfesion(e.target.value); setErrors(p => ({ ...p, profesion: '' })); }}
                    placeholder="Ej: Abogada, estudiante, médica..."
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-brand-dark focus:outline-none focus:border-brand-gold transition-colors"
                  />
                  {errors.profesion && <p className="text-red-500 text-xs mt-1.5">{errors.profesion}</p>}
                </div>

                {/* Consignas */}
                <div className="bg-brand-beige rounded-xl p-4 text-xs sm:text-sm text-gray-600">
                  <p className="font-semibold text-brand-dark mb-1">Antes de empezar:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Respondé pensando en cómo realmente sos, no cómo te gustaría ser.</li>
                    <li>Completalo de una sola vez, sin detenerte mucho en cada afirmación.</li>
                    <li>Si dudás, dejá sin marcar.</li>
                  </ul>
                </div>

                <button
                  onClick={handleStart}
                  className="w-full bg-brand-gold hover:bg-amber-600 active:bg-amber-700 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-base"
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
                          : 'bg-white border-gray-200 active:bg-gray-50'}`}
                    >
                      <div
                        className={`shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center mt-0.5 transition-colors
                          ${isMarked ? 'bg-brand-gold border-brand-gold' : 'bg-white border-gray-300'}`}
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
                  <span className="text-sm font-medium text-gray-500">{step} / {TOTAL_PAGES}</span>
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
                  <span className="text-sm text-gray-500">Página {step} de {TOTAL_PAGES}</span>
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
