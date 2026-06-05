import React from 'react';
import { ENEATIPOS_DETALLE, calcularAla } from '../data/eneatipos-detalle';
import { Sparkles, Heart, Shield, TrendingUp, AlertTriangle, Target, MessageCircle } from 'lucide-react';

interface Props {
  name: string;
  dominantType: number;
  totals: Record<number, number>;
}

const ResultadoEneatipo: React.FC<Props> = ({ name, dominantType, totals }) => {
  const tipo = ENEATIPOS_DETALLE[dominantType];
  const ala = calcularAla(dominantType, totals);
  const tipoAla = ENEATIPOS_DETALLE[ala.wing];

  if (!tipo) {
    return (
      <div className="text-center text-gray-500 py-10">No se pudo calcular tu eneatipo.</div>
    );
  }

  // Ranking de los 9 tipos por score
  const ranked = [1,2,3,4,5,6,7,8,9]
    .map(t => ({ type: t, total: Number(totals[t]) || 0 }))
    .sort((a, b) => b.total - a.total);

  const maxScore = Math.max(...ranked.map(r => r.total), 1);

  return (
    <div className="min-h-screen bg-brand-beige">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">

        {/* ── Saludo personal ────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <p className="text-gray-500 text-sm mb-1">¡Listo, {name}!</p>
          <p className="text-brand-gold text-xs font-bold tracking-widest uppercase">Tu resultado</p>
        </div>

        {/* ── Hero del eneatipo ─────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-10 mb-6 text-center relative overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: tipo.color }}
          />
          <p className="text-gray-400 text-xs font-semibold tracking-widest uppercase mb-2">Eneatipo</p>
          <div
            className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full font-heading font-bold text-5xl sm:text-6xl text-white mb-4 shadow-lg"
            style={{ background: tipo.color }}
          >
            {tipo.num}
          </div>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-brand-dark mb-2">
            {tipo.nombre}
          </h1>
          <p className="text-brand-gold font-semibold tracking-widest text-sm uppercase mb-4">
            {tipo.subtitulo}
          </p>

          {/* Ala */}
          <div className="inline-flex items-center gap-2 bg-brand-beige rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-brand-gold" />
            <span className="text-sm font-semibold text-brand-dark">
              Con ala en {ala.wing} ({tipoAla?.nombre})
            </span>
            <span className="text-xs text-gray-500 font-mono">{ala.label}</span>
          </div>

          {/* Triada */}
          <div className="text-xs text-gray-500 italic max-w-md mx-auto">
            <span className="font-semibold text-gray-700">Tríada {tipo.triada}:</span> {tipo.triadaDescripcion}
          </div>
        </div>

        {/* ── Distribución de todos los tipos ─────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 mb-6">
          <h2 className="font-heading font-bold text-lg text-brand-dark mb-1">
            Tu distribución
          </h2>
          <p className="text-xs text-gray-500 mb-5">
            Cuánto te identificás con cada eneatipo
          </p>
          <div className="space-y-2">
            {ranked.map((r, i) => {
              const t = ENEATIPOS_DETALLE[r.type];
              const isDom = r.type === dominantType;
              const isWing = r.type === ala.wing;
              const pct = (r.total / maxScore) * 100;
              return (
                <div key={r.type} className="flex items-center gap-3">
                  <div className="shrink-0 w-7 sm:w-8 text-center">
                    <span className={`text-sm font-bold ${isDom ? 'text-brand-gold' : 'text-gray-400'}`}>
                      {i + 1}°
                    </span>
                  </div>
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm`}
                    style={{ background: isDom || isWing ? t?.color : '#D5D2CC' }}
                  >
                    {r.type}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <span className={`text-sm truncate ${isDom ? 'font-bold text-brand-dark' : 'text-gray-700'}`}>
                        {t?.nombre}
                        {isDom && <span className="ml-2 text-xs bg-brand-gold text-white px-1.5 py-0.5 rounded">Dominante</span>}
                        {isWing && !isDom && <span className="ml-2 text-xs bg-brand-gold/20 text-brand-gold px-1.5 py-0.5 rounded">Ala</span>}
                      </span>
                      <span className={`text-sm font-bold tabular-nums ${isDom ? 'text-brand-gold' : 'text-gray-500'}`}>
                        {r.total}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-2 rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: isDom || isWing ? t?.color : '#D5D2CC',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Motivación / Miedo / Deseo ────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-brand-gold" />
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Motivación</p>
            </div>
            <p className="text-sm text-brand-dark leading-relaxed">{tipo.motivacion}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Miedo nuclear</p>
            </div>
            <p className="text-sm text-brand-dark leading-relaxed">{tipo.miedo}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-pink-400" />
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Deseo profundo</p>
            </div>
            <p className="text-sm text-brand-dark leading-relaxed">{tipo.deseo}</p>
          </div>
        </div>

        {/* ── Fortalezas y desafíos ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-emerald-500" />
              <h3 className="font-heading font-bold text-brand-dark">Tus fortalezas</h3>
            </div>
            <ul className="space-y-2">
              {tipo.fortalezas.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-emerald-500 mt-0.5">+</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="font-heading font-bold text-brand-dark">Tus desafíos</h3>
            </div>
            <ul className="space-y-2">
              {tipo.desafios.map((d, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-amber-500 mt-0.5">·</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Líneas de crecimiento y estrés ─────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 mb-6">
          <h3 className="font-heading font-bold text-brand-dark mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-gold" />
            Tu camino de crecimiento
          </h3>
          <div className="space-y-4">
            <div className="border-l-4 border-emerald-400 pl-4">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
                Línea de integración → {tipo.lineaCrecimiento}
              </p>
              <p className="text-sm text-gray-700">{tipo.textoCrecimiento}</p>
            </div>
            <div className="border-l-4 border-red-300 pl-4">
              <p className="text-xs font-bold uppercase tracking-wider text-red-500 mb-1">
                Línea de estrés → {tipo.lineaEstres}
              </p>
              <p className="text-sm text-gray-700">{tipo.textoEstres}</p>
            </div>
          </div>
        </div>

        {/* ── Continuum de salud ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 mb-6">
          <h3 className="font-heading font-bold text-brand-dark mb-3">
            Cómo te ves según tu nivel de conciencia
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs">✓</span>
              <p><span className="font-semibold text-brand-dark">En tu mejor versión:</span> <span className="text-gray-700">{tipo.sano}</span></p>
            </div>
            <div className="flex gap-3">
              <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-700 font-bold text-xs">~</span>
              <p><span className="font-semibold text-brand-dark">En tu versión cotidiana:</span> <span className="text-gray-700">{tipo.promedio}</span></p>
            </div>
            <div className="flex gap-3">
              <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700 font-bold text-xs">!</span>
              <p><span className="font-semibold text-brand-dark">Bajo presión extrema:</span> <span className="text-gray-700">{tipo.desafio}</span></p>
            </div>
          </div>
        </div>

        {/* ── Consejo de oro ─────────────────────────────────────────── */}
        <div
          className="rounded-3xl p-6 sm:p-8 mb-6 text-center text-white"
          style={{ background: `linear-gradient(135deg, ${tipo.color} 0%, ${tipo.color}DD 100%)` }}
        >
          <Sparkles className="w-6 h-6 mx-auto mb-3 opacity-80" />
          <p className="text-xs font-bold tracking-widest uppercase opacity-80 mb-2">Tu consejo de oro</p>
          <p className="font-heading font-medium text-lg sm:text-xl leading-snug">
            "{tipo.consejo}"
          </p>
        </div>

        {/* ── CTA: contacto con la coach ─────────────────────────────── */}
        <div className="bg-brand-dark rounded-3xl p-6 sm:p-8 text-center">
          <MessageCircle className="w-8 h-8 text-brand-gold mx-auto mb-3" />
          <h3 className="font-heading font-bold text-white text-xl sm:text-2xl mb-2">
            ¿Querés profundizar en tu eneatipo?
          </h3>
          <p className="text-gray-300 text-sm mb-5 max-w-md mx-auto">
            Cecilia trabaja personalmente con vos para descubrir cómo este conocimiento puede transformar tu vida cotidiana, tus relaciones y tu carrera.
          </p>
          <a
            href="https://wa.me/5491100000000?text=Hola%20Cecilia,%20acabo%20de%20hacer%20el%20test%20y%20me%20gustar%C3%ADa%20saber%20m%C3%A1s%20sobre%20mi%20eneatipo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-gold hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Hablar con Cecilia
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8 italic">
          "Conviértete en el que fuiste, antes que eras con el recuerdo y la sabiduría de aquel en el que te convertiste."
        </p>
        <p className="text-center text-xs text-gray-400 mt-1">— Proverbio Sufí</p>
      </div>
    </div>
  );
};

export default ResultadoEneatipo;
