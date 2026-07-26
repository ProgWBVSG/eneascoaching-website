import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Video, Star, FileText, Wrench, BookOpen, ArrowRight, Loader2, Lock, Mail, Sparkles, X,
} from 'lucide-react';

const UNLOCK_KEY = 'recursos_unlocked';

interface Recurso {
  id: string; title: string; description: string | null; kind: string;
  url: string | null; category: string | null;
}

const KIND_META: Record<string, { icon: React.ElementType; label: string }> = {
  video: { icon: Video, label: 'Video' },
  test: { icon: Star, label: 'Test' },
  pdf: { icon: FileText, label: 'PDF' },
  herramienta: { icon: Wrench, label: 'Herramienta' },
  guia: { icon: BookOpen, label: 'Guía' },
};

const Recursos: React.FC = () => {
  const [unlocked, setUnlocked] = useState(() => localStorage.getItem(UNLOCK_KEY) === '1');
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState<Recurso | null>(null); // recurso que el usuario quiso abrir

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/cursos?action=recursos-get');
        setRecursos(await res.json());
      } catch { /* noop */ } finally { setLoading(false); }
    })();
  }, []);

  const grouped = useMemo(() => {
    const map: Record<string, Recurso[]> = {};
    recursos.forEach(r => { const c = r.category || 'General'; (map[c] ||= []).push(r); });
    return map;
  }, [recursos]);

  const openResource = (r: Recurso) => {
    if (unlocked) {
      const url = r.url || '#';
      if (url.startsWith('#')) window.location.hash = url.slice(1);
      else window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    setPending(r); // pide el email antes de abrir
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Poné un email válido'); return; }
    setSending(true); setError('');
    try {
      await fetch('/api/subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      localStorage.setItem(UNLOCK_KEY, '1');
      setUnlocked(true);
      if (pending) {
        const url = pending.url || '#';
        setPending(null);
        if (url.startsWith('#')) window.location.hash = url.slice(1);
        else window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch { setError('No se pudo. Probá de nuevo.'); }
    finally { setSending(false); }
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      {/* Barra mínima */}
      <div className="w-full py-5 text-center border-b border-white/10">
        <Link to="/" className="font-heading font-bold tracking-widest text-white text-sm">ENEASCOACHING</Link>
      </div>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-4 pt-12 pb-8 text-center">
        <p className="text-brand-gold text-xs font-bold tracking-[0.2em] uppercase mb-3">Recursos gratuitos de eneagrama</p>
        <h1 className="font-heading font-bold text-3xl sm:text-5xl leading-tight mb-4">
          Todo lo que necesitás para <span className="text-brand-gold">conocerte</span>, en un solo lugar
        </h1>
        <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
          Tests, guías, videos y herramientas de Cecilia B. Sánchez — coach eneagramista con +600 personas mentoreadas. Gratis, actualizándose siempre.
        </p>
      </section>

      {/* Recursos — visibles y navegables libremente */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="text-center py-20"><Loader2 className="w-8 h-8 text-brand-gold animate-spin mx-auto" /></div>
        ) : recursos.length === 0 ? (
          <p className="text-center text-gray-500 py-16">Pronto vas a encontrar recursos acá 🌱</p>
        ) : (
          <div className="space-y-10">
            {(Object.entries(grouped) as [string, Recurso[]][]).map(([cat, list]) => (
              <div key={cat}>
                <h2 className="font-heading font-bold text-xl text-brand-gold mb-4">{cat}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {list.map(r => {
                    const meta = KIND_META[r.kind] || KIND_META.guia;
                    return (
                      <button key={r.id} onClick={() => openResource(r)} type="button"
                        className="text-left bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-brand-gold/50 hover:bg-white/10 transition-all group">
                        <div className="flex items-center justify-between mb-3">
                          <span className="w-11 h-11 rounded-xl bg-brand-gold/15 flex items-center justify-center"><meta.icon className="w-5 h-5 text-brand-gold" /></span>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">{meta.label}</span>
                        </div>
                        <p className="font-semibold text-white mb-1 leading-snug">{r.title}</p>
                        {r.description && <p className="text-sm text-gray-400 line-clamp-2">{r.description}</p>}
                        <div className="flex items-center gap-1 text-brand-gold text-sm font-medium mt-3 group-hover:gap-2 transition-all">
                          {unlocked ? <>Abrir <ArrowRight className="w-4 h-4" /></> : <><Lock className="w-3.5 h-3.5" /> Abrir</>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Popup de email — aparece al tocar un recurso */}
      {pending && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPending(null)} />
          <div className="relative bg-brand-dark border border-white/10 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-8">
            <button onClick={() => setPending(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            <div className="w-12 h-12 rounded-2xl bg-brand-gold/20 flex items-center justify-center mx-auto mb-4"><Lock className="w-6 h-6 text-brand-gold" /></div>
            <p className="text-center font-heading font-bold text-xl mb-1">Dejá tu email y accedé</p>
            <p className="text-center text-gray-400 text-sm mb-5">
              Para abrir <span className="text-white font-medium">"{pending.title}"</span> y todo el resto. Sin costo, y te avisamos cuando sumamos algo nuevo.
            </p>
            <form onSubmit={submit}>
              <div className="relative mb-3">
                <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input type="email" value={email} autoFocus onChange={e => { setEmail(e.target.value); setError(''); }} placeholder="tu@email.com"
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold" />
              </div>
              {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
              <button type="submit" disabled={sending}
                className="w-full gold-gradient text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">
                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Desbloquear y abrir <Sparkles className="w-5 h-5" /></>}
              </button>
            </form>
            <p className="text-center text-xs text-gray-500 mt-3">No spam. Solo contenido de valor.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recursos;
