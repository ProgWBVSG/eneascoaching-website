import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { EncuestaConfig } from '../data/encuestas';
import { ArrowLeft, ArrowRight, Send, Loader2, Check, MessageCircle, ShieldCheck } from 'lucide-react';

type Respuestas = Record<string, string>;

const PAISES = [
  { dial: '54', label: 'Argentina +54' },
  { dial: '598', label: 'Uruguay +598' },
  { dial: '56', label: 'Chile +56' },
  { dial: '595', label: 'Paraguay +595' },
  { dial: '591', label: 'Bolivia +591' },
  { dial: '51', label: 'Perú +51' },
  { dial: '57', label: 'Colombia +57' },
  { dial: '52', label: 'México +52' },
  { dial: '34', label: 'España +34' },
  { dial: '1', label: 'Estados Unidos +1' },
];

const Encuesta: React.FC<{ config: EncuestaConfig }> = ({ config }) => {
  const total = config.preguntas.length + 1; // + paso de contacto
  const [step, setStep] = useState(-1);      // -1 = portada, 0..n-1 preguntas, n = contacto
  const [respuestas, setRespuestas] = useState<Respuestas>({});
  const [otro, setOtro] = useState('');
  const [name, setName] = useState('');
  const [dial, setDial] = useState('54');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notify, setNotify] = useState<boolean | null>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const preg = step >= 0 && step < config.preguntas.length ? config.preguntas[step] : null;
  const esContacto = step === config.preguntas.length;
  const progreso = step < 0 ? 0 : Math.round(((step + 1) / total) * 100);

  const valorActual = preg ? (respuestas[preg.key] || '') : '';
  const esOtro = preg?.tipo === 'choice' && valorActual === 'Otro';
  const puedeAvanzar = !preg
    ? true
    : !preg.requerida
      ? true
      : esOtro ? otro.trim().length > 0 : valorActual.trim().length > 0;

  const setValor = (v: string) => preg && setRespuestas(r => ({ ...r, [preg.key]: v }));

  const next = () => {
    if (preg && esOtro && otro.trim()) setRespuestas(r => ({ ...r, [preg.key]: `Otro: ${otro.trim()}` }));
    setStep(s => s + 1);
  };
  const back = () => setStep(s => s - 1);

  const emailValido = email.trim() === '' || /\S+@\S+\.\S+/.test(email.trim());
  const puedeEnviar = name.trim().length > 1 && phone.replace(/\D/g, '').length >= 8 && emailValido && notify !== null;

  const submit = async () => {
    if (!puedeEnviar) return;
    setSending(true); setError('');
    try {
      const res = await fetch('/api/cursos?action=encuesta-submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          survey: config.key,
          role: respuestas.rol || null,
          answers: config.preguntas.map(p => ({ key: p.key, q: p.pregunta, a: respuestas[p.key] || '' })),
          name: name.trim(),
          phone: `+${dial}${phone.replace(/\D/g, '')}`,
          email: email.trim() || null,
          notify,
        }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch { setError('No se pudo enviar. Probá de nuevo en un momento.'); }
    finally { setSending(false); }
  };

  const waHref = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(`Hola Cecilia! Soy ${name.trim()}. Acabo de completar tu encuesta y quería contarte algo más.`)}`;

  return (
    <div className="min-h-screen bg-brand-beige flex flex-col">
      <div className="w-full py-4 px-4 relative flex items-center justify-center border-b border-black/5">
        <Link to="/" className="absolute left-4 flex items-center gap-1.5 text-brand-dark hover:text-brand-gold transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Volver</span>
        </Link>
        <span className="font-heading font-bold tracking-widest text-brand-dark text-sm">{config.marca}</span>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-lg">

          {step >= 0 && !done && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                <span>{esContacto ? 'Último paso' : `Pregunta ${step + 1} de ${config.preguntas.length}`}</span>
                <span>{progreso}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full bg-brand-gold rounded-full transition-all duration-500 ease-out" style={{ width: `${progreso}%` }} />
              </div>
            </div>
          )}

          {/* ── PORTADA ─────────────────────────────────────────────── */}
          {step === -1 && (
            <div className="text-center anim-fade-slide-up">
              <p className="text-brand-gold text-xs font-bold tracking-[0.2em] uppercase mb-4">Encuesta · 2 minutos</p>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl text-brand-dark leading-tight mb-4">{config.titulo}</h1>
              <p className="text-gray-600 text-base mb-7 max-w-md mx-auto">{config.intro}</p>
              <button onClick={() => setStep(0)}
                className="tap-feedback w-full sm:w-auto inline-flex items-center justify-center gap-2 gold-gradient text-white font-bold py-4 px-10 rounded-full shadow-lg text-base">
                Empezar <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-xs text-gray-400 mt-4">Tus respuestas son confidenciales.</p>
            </div>
          )}

          {/* ── PREGUNTA ────────────────────────────────────────────── */}
          {preg && !done && (
            <div key={step} className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 anim-fade-slide-up">
              <p className="text-brand-gold text-xs font-bold tracking-wider uppercase mb-2">Pregunta {step + 1}</p>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-brand-dark leading-snug mb-5">{preg.pregunta}</h2>

              {preg.tipo === 'choice' && (
                <div className="space-y-2.5">
                  {preg.opciones!.map(op => {
                    const sel = valorActual === op;
                    return (
                      <button key={op} onClick={() => setValor(op)}
                        className={`tap-feedback w-full text-left rounded-2xl px-5 py-3.5 border-2 touch-manipulation flex items-center justify-between gap-2
                          ${sel ? 'bg-brand-gold border-brand-gold text-white' : 'bg-white border-gray-200 text-brand-dark hover:border-brand-gold/60'}`}>
                        <span className="text-sm sm:text-base">{op}</span>
                        {sel && <Check className="w-5 h-5 shrink-0" />}
                      </button>
                    );
                  })}
                  {esOtro && (
                    <input autoFocus value={otro} onChange={e => setOtro(e.target.value)} placeholder="Contame a qué te dedicás..."
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-gold text-brand-dark mt-1" />
                  )}
                </div>
              )}

              {preg.tipo === 'cards' && (
                <div className="space-y-3">
                  {preg.cards!.map(c => {
                    const sel = valorActual === c.label;
                    return (
                      <button key={c.label} onClick={() => setValor(c.label)}
                        className={`tap-feedback w-full text-left rounded-2xl px-5 py-4 border-2 touch-manipulation
                          ${sel ? 'bg-brand-gold border-brand-gold' : 'bg-white border-gray-200 hover:border-brand-gold/60'}`}>
                        <span className="flex items-start justify-between gap-2">
                          <span className={`font-heading font-bold text-base sm:text-lg ${sel ? 'text-white' : 'text-brand-dark'}`}>{c.label}</span>
                          {sel && <Check className="w-5 h-5 text-white shrink-0 mt-0.5" />}
                        </span>
                        <span className={`block text-xs sm:text-sm mt-1.5 leading-relaxed ${sel ? 'text-white/90' : 'text-gray-500'}`}>{c.sublabel}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {preg.tipo === 'text' && (
                <textarea autoFocus value={valorActual} onChange={e => setValor(e.target.value)} rows={5} placeholder={preg.placeholder}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-gold text-brand-dark text-sm sm:text-base resize-none" />
              )}

              {preg.tipo === 'short' && (
                <input autoFocus value={valorActual} onChange={e => setValor(e.target.value)} placeholder={preg.placeholder}
                  onKeyDown={e => e.key === 'Enter' && puedeAvanzar && next()}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-gold text-brand-dark" />
              )}

              <div className="flex items-center justify-between mt-6">
                <button onClick={back} className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm">
                  <ArrowLeft className="w-4 h-4" /> Atrás
                </button>
                <button onClick={next} disabled={!puedeAvanzar}
                  className="tap-feedback flex items-center gap-2 gold-gradient text-white font-bold py-3 px-6 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed">
                  Siguiente <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── CONTACTO ────────────────────────────────────────────── */}
          {esContacto && !done && (
            <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 anim-fade-slide-up">
              <p className="text-brand-gold text-xs font-bold tracking-wider uppercase mb-2">Último paso</p>
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-brand-dark mb-5">Tus datos de contacto</h2>

              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre completo"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-gold text-brand-dark mb-4" />

              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tu número de WhatsApp</label>
              <div className="flex gap-2 mb-4">
                <select value={dial} onChange={e => setDial(e.target.value)}
                  className="border-2 border-gray-200 rounded-xl pl-3 pr-1 py-3.5 text-gray-600 text-sm bg-gray-50 shrink-0 focus:outline-none focus:border-brand-gold max-w-[110px]">
                  {PAISES.map(p => <option key={p.dial} value={p.dial}>+{p.dial}</option>)}
                </select>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="9 351 123 4567" inputMode="tel"
                  className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-gold text-brand-dark" />
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-1.5">Tu email (opcional)</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" type="email"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-gold text-brand-dark" />
              {!emailValido && <p className="text-red-500 text-xs mt-1.5">Ese email no parece válido</p>}
              <p className="flex items-start gap-1.5 text-xs text-gray-400 mt-2 mb-5">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                No lo vamos a usar para mandarte spam. Tus datos están seguros y son solo para responderte.
              </p>

              <p className="text-sm text-gray-700 mb-3">{config.preguntaAviso}</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button onClick={() => setNotify(true)}
                  className={`tap-feedback py-3.5 rounded-xl font-bold border-2 ${notify === true ? 'gold-gradient text-white border-transparent' : 'bg-white border-gray-200 text-brand-dark'}`}>
                  ¡Sí, avisame!
                </button>
                <button onClick={() => setNotify(false)}
                  className={`tap-feedback py-3.5 rounded-xl font-medium border-2 ${notify === false ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white border-gray-200 text-gray-600'}`}>
                  No, gracias
                </button>
              </div>

              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

              <div className="flex items-center justify-between">
                <button onClick={back} className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm">
                  <ArrowLeft className="w-4 h-4" /> Atrás
                </button>
                <button onClick={submit} disabled={!puedeEnviar || sending}
                  className="tap-feedback flex items-center gap-2 gold-gradient text-white font-bold py-3 px-6 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed">
                  {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Enviar <Send className="w-4 h-4" /></>}
                </button>
              </div>
            </div>
          )}

          {/* ── GRACIAS ─────────────────────────────────────────────── */}
          {done && (
            <div className="text-center anim-fade-scale-in">
              <div className="w-16 h-16 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-5">
                <Check className="w-8 h-8 text-brand-gold" />
              </div>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark mb-3">Gracias, {name.trim().split(' ')[0]}</h2>
              <p className="text-gray-600 text-base mb-7 max-w-md mx-auto">{config.gracias}</p>
              {notify && <p className="text-sm text-gray-500 mb-6">Te aviso por WhatsApp apenas esté listo.</p>}
              <a href={waHref} target="_blank" rel="noopener noreferrer"
                className="tap-feedback inline-flex items-center gap-2 text-brand-dark font-medium text-sm hover:text-brand-gold">
                <MessageCircle className="w-4 h-4" /> ¿Querés contarme algo más? Escribime
              </a>
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 pb-5">Tus respuestas son confidenciales · Tiempo estimado: 2 min</p>
    </div>
  );
};

export default Encuesta;
