import React, { useRef, useState } from 'react';
import { ENEATIPOS_DETALLE, calcularAla } from '../data/eneatipos-detalle';
import EnneagramCircle from './EnneagramCircle';
import { Sparkles, Heart, Shield, TrendingUp, AlertTriangle, Target, Download, Loader2 } from 'lucide-react';

interface Props {
  name: string;
  dominantType: number;
  totals: Record<number, number>;
}

const ResultadoEneatipo: React.FC<Props> = ({ name, dominantType, totals }) => {
  const tipo = ENEATIPOS_DETALLE[dominantType];
  const ala = calcularAla(dominantType, totals);
  const tipoAla = ENEATIPOS_DETALLE[ala.wing];
  const printRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  if (!tipo) {
    return (
      <div className="text-center text-gray-500 py-10">No se pudo calcular tu eneatipo.</div>
    );
  }

  const ranked = [1,2,3,4,5,6,7,8,9]
    .map(t => ({ type: t, total: Number(totals[t]) || 0 }))
    .sort((a, b) => b.total - a.total);

  const maxScore = Math.max(...ranked.map(r => r.total), 1);

  // ── Generar PDF a partir del contenido visible ─────────────────────
  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setDownloading(true);
    try {
      const [{ default: html2canvas }, jsPDFModule] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      const jsPDF = jsPDFModule.default || jsPDFModule.jsPDF;

      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        backgroundColor: '#F9F7F2',
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const safeName = (name || 'eneatipo').replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
      pdf.save(`enea-test-${safeName}.pdf`);
    } catch (e) {
      console.error('Error generando PDF:', e);
      alert('No se pudo generar el PDF. Probá de nuevo.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-beige">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">

        {/* Barra de acciones (no entra en el PDF) */}
        <div className="flex items-center justify-end mb-6">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-2 bg-brand-dark hover:bg-gray-800 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors disabled:opacity-60"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Descargar PDF
              </>
            )}
          </button>
        </div>

        {/* CONTENIDO IMPRIMIBLE */}
        <div ref={printRef} className="space-y-6">

          {/* ── Saludo ──────────────────────────────────────────────────── */}
          <div className="text-center">
            <p className="text-gray-500 text-sm mb-1">¡Listo, {name}!</p>
            <p className="text-brand-gold text-xs font-bold tracking-widest uppercase">Tu resultado</p>
          </div>

          {/* ── Círculo del Eneagrama ───────────────────────────────── */}
          <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8">
            <p className="text-center text-gray-400 text-xs font-semibold tracking-widest uppercase mb-4">
              Tu posición en el eneagrama
            </p>
            <EnneagramCircle dominant={dominantType} wing={ala.wing} />
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-full" style={{ background: tipo.color }} />
                <span>Eneatipo dominante: <span className="font-bold text-brand-dark">{tipo.num}</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-full border-2" style={{ borderColor: tipoAla?.color || '#C5A059' }} />
                <span>Ala: <span className="font-bold text-brand-dark">{ala.wing}</span></span>
              </div>
            </div>
          </div>

          {/* ── Hero del eneatipo ─────────────────────────────────────── */}
          <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: tipo.color }} />
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

            <div className="inline-flex items-center gap-2 bg-brand-beige rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-brand-gold" />
              <span className="text-sm font-semibold text-brand-dark">
                Con ala en {ala.wing} ({tipoAla?.nombre})
              </span>
              <span className="text-xs text-gray-500 font-mono">{ala.label}</span>
            </div>

            <div className="text-xs text-gray-500 italic max-w-md mx-auto">
              <span className="font-semibold text-gray-700">Tríada {tipo.triada}:</span> {tipo.triadaDescripcion}
            </div>
          </div>

          {/* ── Distribución de todos los tipos ─────────────────────────── */}
          <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8">
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
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
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
                          className="h-2 rounded-full"
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

          {/* ── Motivación / Miedo / Deseo ──────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

          {/* ── Fortalezas y desafíos ────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

          {/* ── Líneas de crecimiento y estrés ────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
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

          {/* ── Continuum de salud ───────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6">
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
            className="rounded-3xl p-6 sm:p-8 text-center text-white"
            style={{ background: `linear-gradient(135deg, ${tipo.color} 0%, ${tipo.color}DD 100%)` }}
          >
            <Sparkles className="w-6 h-6 mx-auto mb-3 opacity-80" />
            <p className="text-xs font-bold tracking-widest uppercase opacity-80 mb-2">Tu consejo de oro</p>
            <p className="font-heading font-medium text-lg sm:text-xl leading-snug">
              "{tipo.consejo}"
            </p>
          </div>

          {/* ── Mensaje de cierre — sin CTA, profesional ─────────────── */}
          <div className="bg-brand-dark rounded-3xl p-6 sm:p-8 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-brand-gold/15 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-brand-gold" />
            </div>
            <h3 className="font-heading font-bold text-white text-lg sm:text-xl mb-2">
              Cecilia recibió tu resultado
            </h3>
            <p className="text-gray-300 text-sm max-w-md mx-auto">
              Va a estar revisando tus respuestas con atención. Lo van a ver juntas en tu próxima sesión.
            </p>
          </div>

          {/* ── Cita ─────────────────────────────────────────────────── */}
          <div className="text-center pt-4">
            <p className="text-xs sm:text-sm text-gray-400 italic">
              "Conviértete en el que fuiste, antes que eras con el recuerdo y la sabiduría de aquel en el que te convertiste."
            </p>
            <p className="text-xs text-gray-400 mt-1">— Proverbio Sufí</p>
            <p className="text-xs text-gray-300 mt-3">@CeciliaBSanchez · Eneascoaching</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResultadoEneatipo;
