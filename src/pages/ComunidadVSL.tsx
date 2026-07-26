import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass, Sparkles, TrendingUp, Play, Check, X, MessageCircle, Video,
  FileText, GraduationCap, Star, ShieldCheck, ChevronDown, Heart, ArrowLeft,
} from 'lucide-react';

// ⚠️ VSL DE PRUEBA — copy y precio de ejemplo para ver el estilo.
// Se reemplaza con el diseño/contenido real cuando esté listo.

const WA = 'https://wa.me/5493515632496?text=Hola!%20Quiero%20sumarme%20a%20Descubr%C3%AD%20tu%20Norte%20%F0%9F%A7%AD';

const CTA: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <a href={WA} target="_blank" rel="noreferrer"
    className={`inline-flex items-center justify-center gap-2 gold-gradient text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all ${className}`}>
    {children || 'Quiero sumarme'} <Heart className="w-4 h-4" />
  </a>
);

const ComunidadVSL: React.FC = () => {
  return (
    <div className="bg-brand-beige text-brand-text">
      {/* Barra mínima */}
      <div className="w-full py-4 px-4 relative flex items-center justify-center">
        <Link to="/" className="absolute left-4 flex items-center gap-1.5 text-brand-dark hover:text-brand-gold transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Volver</span>
        </Link>
        <Link to="/" className="font-heading font-bold tracking-widest text-brand-dark text-sm">ENEASCOACHING</Link>
      </div>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 pt-4 pb-12 text-center">
        <p className="text-brand-gold text-xs sm:text-sm font-bold tracking-[0.2em] uppercase mb-4">Comunidad de mujeres · Descubrí tu Norte</p>
        <h1 className="font-heading font-bold text-3xl sm:text-5xl leading-tight text-brand-dark mb-5">
          Sé <span className="text-brand-gold">viajera sin prisa</span> de tu propia vida
        </h1>
        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mb-8">
          Una comunidad de mujeres que, con el eneagrama como herramienta, vuelven a elegirse: para <strong>conocerse</strong>, <strong>rediseñarse</strong> y <strong>avanzar</strong> — acompañadas, nunca solas.
        </p>

        {/* Video VSL */}
        <div className="rounded-3xl overflow-hidden bg-brand-dark shadow-xl aspect-video mb-8 relative group cursor-pointer">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/70">
            <div className="w-16 h-16 rounded-full bg-brand-gold/90 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Play className="w-7 h-7 text-white ml-1" fill="white" />
            </div>
            <p className="text-sm">Tu video de bienvenida va acá</p>
          </div>
        </div>

        <CTA className="text-lg px-10 py-4" />
        <p className="text-xs text-gray-400 mt-3">Sumate hoy · Cancelás cuando quieras</p>
      </section>

      {/* ── PROBLEMA (agitación) ─────────────────────────────────────── */}
      <section className="bg-white py-14">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark text-center mb-8">¿Te suena algo de esto?</h2>
          <ul className="space-y-4">
            {[
              'Diste todo por todos — hijos, pareja, trabajo — y un día te preguntaste: "¿y yo dónde quedé?"',
              'Sentís que perdiste el rumbo, como si vivieras en automático.',
              'Sabés que hay algo más para vos, pero no sabés por dónde empezar.',
              'Empezás mil cosas para cambiar… y sola te cuesta sostenerlas.',
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-3 bg-brand-beige rounded-2xl p-4">
                <span className="w-6 h-6 rounded-full bg-red-100 text-red-400 flex items-center justify-center shrink-0 mt-0.5"><X className="w-4 h-4" /></span>
                <span className="text-gray-700 text-sm sm:text-base">{t}</span>
              </li>
            ))}
          </ul>
          <p className="text-center text-brand-dark font-heading font-semibold text-lg mt-8">
            No te falta capacidad. Te falta <span className="text-brand-gold">volver a vos</span> — y una comunidad que te sostenga.
          </p>
        </div>
      </section>

      {/* ── LA PROPUESTA / 3 PILARES ─────────────────────────────────── */}
      <section className="py-14">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-brand-gold text-sm font-bold tracking-widest uppercase mb-2">El camino</p>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark text-center mb-3">Toda transformación real sigue 3 pasos</h2>
          <p className="text-center text-gray-600 max-w-xl mx-auto mb-10">Y en Descubrí tu Norte los recorrés acompañada, con el eneagrama como mapa.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: Compass, color: '#C5A059', t: 'Conocerte', d: 'Descubrí quién sos de verdad con tu eneatipo. El punto de partida de todo cambio.' },
              { icon: Sparkles, color: '#8B6BB8', t: 'Rediseñarte', d: 'Soltá lo que ya no te sirve y elegí cómo querés vivir esta etapa.' },
              { icon: TrendingUp, color: '#5DA8A0', t: 'Avanzar', d: 'Sostené el cambio con una comunidad que te acompaña y te impulsa.' },
            ].map((p, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-sm text-center">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: `${p.color}1a` }}>
                  <p.icon className="w-7 h-7" style={{ color: p.color }} />
                </div>
                <p className="text-xs font-bold mb-1" style={{ color: p.color }}>PILAR {i + 1}</p>
                <h3 className="font-heading font-bold text-xl text-brand-dark mb-2">{p.t}</h3>
                <p className="text-sm text-gray-600">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUÉ INCLUYE ──────────────────────────────────────────────── */}
      <section className="bg-brand-dark text-white py-14">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-center mb-10">Todo esto, adentro de la comunidad</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: MessageCircle, t: 'Grupo privado de WhatsApp', d: 'Contenido de valor 3 veces por semana, directo a tu celu.' },
              { icon: Video, t: 'El Encuentro del mes', d: 'Un Zoom en vivo mensual con Cecilia y la comunidad.' },
              { icon: GraduationCap, t: 'Cursos grabados', d: 'Formaciones que hacés a tu ritmo, cuando quieras.' },
              { icon: FileText, t: 'Ebooks y PDFs', d: 'Material para descargar, imprimir y trabajar.' },
              { icon: Star, t: 'Tests del eneagrama', d: 'Arrancás conociendo tu eneatipo desde el día uno.' },
              { icon: Sparkles, t: 'Actividades y retos', d: 'Ejercicios y desafíos para que el cambio suceda de verdad.' },
            ].map((x, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/5 rounded-2xl p-4 border border-white/10">
                <span className="w-10 h-10 rounded-xl bg-brand-gold/20 flex items-center justify-center shrink-0"><x.icon className="w-5 h-5 text-brand-gold" /></span>
                <div><p className="font-semibold">{x.t}</p><p className="text-sm text-gray-300">{x.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARA QUIÉN ───────────────────────────────────────────────── */}
      <section className="py-14">
        <div className="max-w-3xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h3 className="font-heading font-bold text-lg text-brand-dark mb-4 flex items-center gap-2"><Check className="w-5 h-5 text-emerald-500" /> Es para vos si…</h3>
            <ul className="space-y-2.5 text-sm text-gray-600">
              {['Querés reconectar con quién sos en esta etapa', 'Buscás crecer pero no querés hacerlo sola', 'Te interesa el eneagrama como herramienta de autoconocimiento', 'Estás lista para pasar a la acción'].map((t, i) => (
                <li key={i} className="flex items-start gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> {t}</li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h3 className="font-heading font-bold text-lg text-brand-dark mb-4 flex items-center gap-2"><X className="w-5 h-5 text-red-400" /> No es para vos si…</h3>
            <ul className="space-y-2.5 text-sm text-gray-600">
              {['Buscás una fórmula mágica sin compromiso', 'No estás dispuesta a mirarte hacia adentro', 'Querés resultados sin poner nada de tu parte'].map((t, i) => (
                <li key={i} className="flex items-start gap-2"><X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" /> {t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── OFERTA / PRECIO ──────────────────────────────────────────── */}
      <section className="pb-14">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center border-2 border-brand-gold/30">
            <p className="text-brand-gold text-sm font-bold tracking-widest uppercase mb-2">Membresía mensual</p>
            <div className="flex items-baseline justify-center gap-1 mb-1">
              <span className="font-heading font-bold text-5xl text-brand-dark">$5</span>
              <span className="text-gray-500">USD / mes</span>
            </div>
            <p className="text-xs text-gray-400 mb-6">(o su equivalente en pesos) · Sin permanencia</p>
            <CTA className="w-full py-4 text-lg" />
            <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Cancelás cuando quieras, sin vueltas
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIOS (placeholder) ────────────────────────────────── */}
      <section className="bg-white py-14">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark text-center mb-8">Lo que dicen quienes ya dieron el paso</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { n: 'María', t: 'Sentía que me había perdido a mí misma. Acá volví a encontrarme.' },
              { n: 'Laura', t: 'El eneagrama me abrió los ojos. Y la comunidad me sostiene cada semana.' },
            ].map((x, i) => (
              <div key={i} className="bg-brand-beige rounded-2xl p-5">
                <div className="flex gap-0.5 mb-2">{[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-brand-gold text-brand-gold" />)}</div>
                <p className="text-gray-700 text-sm italic mb-2">"{x.t}"</p>
                <p className="text-xs font-semibold text-brand-dark">— {x.n}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">(Testimonios de ejemplo — se reemplazan por reales)</p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="py-14">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark text-center mb-8">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {[
              { q: '¿Necesito saber de eneagrama?', a: 'Para nada. Arrancás con un test que te muestra tu eneatipo y de ahí te guiamos paso a paso.' },
              { q: '¿Cómo se paga?', a: 'Una membresía mensual simple. Cancelás cuando quieras, sin permanencia ni letra chica.' },
              { q: '¿Cuánto tiempo me lleva?', a: 'Lo hacés a tu ritmo. El contenido queda disponible y los encuentros son una vez al mes.' },
              { q: '¿Y si no es para mí?', a: 'No pasa nada: cancelás cuando quieras. Queremos que estés porque te suma, no por obligación.' },
            ].map((f, i) => (
              <details key={i} className="bg-white rounded-2xl p-5 group">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-brand-dark list-none">
                  {f.q} <ChevronDown className="w-5 h-5 text-brand-gold group-open:rotate-180 transition-transform" />
                </summary>
                <p className="text-sm text-gray-600 mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────── */}
      <section className="bg-brand-dark text-white py-16 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <Compass className="w-12 h-12 text-brand-gold mx-auto mb-5" />
          <h2 className="font-heading font-bold text-2xl sm:text-4xl mb-4">Es hora de encontrar tu norte</h2>
          <p className="text-gray-300 mb-8">La mujer que querés ser te está esperando del otro lado de la decisión. Sumate a la comunidad y empezá hoy.</p>
          <CTA className="text-lg px-10 py-4" />
        </div>
        <p className="text-xs text-gray-500 mt-10">Descubrí tu Norte · @CeciliaBSanchez · Eneascoaching</p>
      </section>
    </div>
  );
};

export default ComunidadVSL;
