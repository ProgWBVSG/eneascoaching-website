import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  GraduationCap, Video, FileText, Gamepad2, Check, ShieldCheck, Loader2,
  CreditCard, MessageCircle, AlertCircle,
} from 'lucide-react';

const WHATSAPP = '5493515632496';

interface SaleInfo {
  curso: { id: string; title: string; description: string | null; cover_image_url: string | null; price: number; for_sale: boolean };
  modulos_count: number;
  lecciones_count: number;
  recursos_count: number;
}

const Comprar: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [info, setInfo] = useState<SaleInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/cursos?action=sale-info&curso_id=${encodeURIComponent(id || '')}`);
        const data = await res.json();
        if (!mounted) return;
        if (!res.ok || !data.curso) { setError('Curso no encontrado.'); return; }
        setInfo(data);
      } catch { if (mounted) setError('No se pudo cargar el curso.'); }
      finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [id]);

  const handleBuy = async () => {
    setPaying(true); setError(null);
    try {
      const res = await fetch('/api/cursos?action=pay-create', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ curso_id: id }),
      });
      const data = await res.json();
      if (!res.ok || !data.init_point) throw new Error(data.error || 'No se pudo iniciar el pago');
      window.location.href = data.init_point; // checkout seguro de MercadoPago
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'No se pudo iniciar el pago');
      setPaying(false);
    }
  };

  const waLink = info
    ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola! Quiero comprar el curso "${info.curso.title}" 🙌`)}`
    : `https://wa.me/${WHATSAPP}`;

  if (loading) {
    return <div className="min-h-screen bg-brand-beige flex items-center justify-center"><Loader2 className="w-8 h-8 text-brand-gold animate-spin" /></div>;
  }
  if (error && !info) {
    return (
      <div className="min-h-screen bg-brand-beige flex items-center justify-center p-6 text-center">
        <div><AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" /><p className="text-gray-600">{error}</p></div>
      </div>
    );
  }
  if (!info) return null;

  const { curso, lecciones_count, recursos_count } = info;
  const fmtPrice = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(curso.price || 0);

  const incluye = [
    { icon: Video, text: `${lecciones_count} ${lecciones_count === 1 ? 'clase' : 'clases'} en video`, show: lecciones_count > 0 },
    { icon: FileText, text: `${recursos_count} ${recursos_count === 1 ? 'material descargable' : 'materiales descargables'} (ebooks, guías)`, show: recursos_count > 0 },
    { icon: Gamepad2, text: 'Mini-juegos y ejercicios interactivos', show: true },
    { icon: GraduationCap, text: 'Acceso de por vida, a tu ritmo', show: true },
  ].filter(i => i.show);

  return (
    <div className="min-h-screen bg-brand-beige">
      <header className="bg-brand-dark text-white px-4 sm:px-6 py-3 text-center">
        <p className="text-brand-gold text-xs font-bold tracking-widest uppercase">Eneascoaching</p>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Portada */}
        <div className="rounded-3xl overflow-hidden bg-white shadow-sm mb-6">
          <div className="h-40 sm:h-52 bg-gradient-to-br from-brand-gold/30 to-brand-dark/20 flex items-center justify-center">
            {curso.cover_image_url
              ? <img src={curso.cover_image_url} alt={curso.title} className="w-full h-full object-cover" />
              : <GraduationCap className="w-16 h-16 text-brand-gold/50" />}
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-brand-gold text-xs font-bold tracking-widest uppercase mb-2">Mini curso</p>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark mb-3">{curso.title}</h1>
            {curso.description && <p className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">{curso.description}</p>}
          </div>
        </div>

        {/* Qué incluye */}
        <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 mb-6">
          <h2 className="font-heading font-bold text-lg text-brand-dark mb-4">Qué incluye</h2>
          <ul className="space-y-3">
            {incluye.map((i, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center shrink-0">
                  <i.icon className="w-4 h-4 text-brand-gold" />
                </span>
                <span className="text-sm sm:text-base text-gray-700 pt-1.5">{i.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Precio + compra */}
        {curso.for_sale && curso.price > 0 ? (
          <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8">
            <div className="text-center mb-5">
              <p className="text-gray-500 text-sm">Precio</p>
              <p className="font-heading font-bold text-4xl sm:text-5xl text-brand-dark">{fmtPrice}</p>
              <p className="text-xs text-gray-400 mt-1">Pago único · Acceso inmediato</p>
            </div>

            <button onClick={handleBuy} disabled={paying}
              className="w-full flex items-center justify-center gap-2 bg-brand-gold hover:bg-amber-600 active:bg-amber-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-60 min-h-[56px] text-base">
              {paying ? <><Loader2 className="w-5 h-5 animate-spin" /> Redirigiendo a MercadoPago...</> : <><CreditCard className="w-5 h-5" /> Comprar con tarjeta / MercadoPago</>}
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-gray-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Pago 100% seguro procesado por MercadoPago
            </div>

            {error && <p className="text-red-500 text-sm text-center mt-3">{error}</p>}

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">o</span></div>
            </div>

            <a href={waLink} target="_blank" rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 text-brand-dark font-semibold py-3.5 rounded-xl hover:bg-gray-50 transition-colors">
              <MessageCircle className="w-5 h-5 text-green-500" /> Consultar por WhatsApp
            </a>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 text-center">
            <p className="text-gray-600 mb-4">Para sumarte a este curso, escribinos y te contamos cómo.</p>
            <a href={waLink} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-6 rounded-xl transition-colors">
              <MessageCircle className="w-5 h-5" /> Escribir por WhatsApp
            </a>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-8">@CeciliaBSanchez · Eneascoaching</p>
      </div>
    </div>
  );
};

export default Comprar;
