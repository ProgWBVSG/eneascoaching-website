import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Video, Star, FileText, Wrench, BookOpen, ArrowRight, Loader2, Lock, Mail, Sparkles, Check,
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
    } catch { setError('No se pudo. Probá de nuevo.'); }
    finally { setSending(false); }
  };

  const href = (r: Recurso) => r.url || '#';
  const external = (r: Recurso) => !!r.url && !r.url.startsWith('#');

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

      {/* Gate de email */}
      {!unlocked && (
        <section className="max-w-md mx-auto px-4 pb-12">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold/20 flex items-center justify-center mx-auto mb-4"><Lock className="w-6 h-6 text-brand-gold" /></div>
            <p className="text-center font-heading font-bold text-xl mb-1">Dejá tu email y accedé a todo</p>
            <p className="text-center text-gray-400 text-sm mb-5">Sin costo. Y cada vez que sumamos algo nuevo, te llega a tu correo.</p>
            <form onSubmit={submit}>
              <div className="relative mb-3">
                <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} placeholder="tu@email.com"
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold" />
              </div>
              {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
              <button type="submit" disabled={sending}
                className="w-full gold-gradient text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60">
                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Desbloquear recursos <Sparkles className="w-5 h-5" /></>}
              </button>
            </form>
            <p className="text-center text-xs text-gray-500 mt-3">No spam. Solo contenido de valor.</p>
          </div>
        </section>
      )}

      {/* Recursos */}
      <section className={`max-w-5xl mx-auto px-4 pb-20 ${!unlocked ? 'relative' : ''}`}>
        {unlocked && (
          <div className="flex items-center justify-center gap-2 mb-8 text-sm text-emerald-400">
            <Check className="w-4 h-4" /> Acceso desbloqueado — disfrutá
          </div>
        )}

        {loading ? (
          <div className="text-center py-20"><Loader2 className="w-8 h-8 text-brand-gold animate-spin mx-auto" /></div>
        ) : recursos.length === 0 ? (
          <p className="text-center text-gray-500 py-16">Pronto vas a encontrar recursos acá 🌱</p>
        ) : (
          <div className={`space-y-10 ${!unlocked ? 'blur-md pointer-events-none select-none max-h-[600px] overflow-hidden' : ''}`}>
            {(Object.entries(grouped) as [string, Recurso[]][]).map(([cat, list]) => (
              <div key={cat}>
                <h2 className="font-heading font-bold text-xl text-brand-gold mb-4">{cat}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {list.map(r => {
                    const meta = KIND_META[r.kind] || KIND_META.guia;
                    return (
                      <a key={r.id} href={href(r)} target={external(r) ? '_blank' : undefined} rel="noopener noreferrer"
                        className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-brand-gold/50 hover:bg-white/10 transition-all group">
                        <div className="flex items-center justify-between mb-3">
                          <span className="w-11 h-11 rounded-xl bg-brand-gold/15 flex items-center justify-center"><meta.icon className="w-5 h-5 text-brand-gold" /></span>
                          <span className="text-xs text-gray-500 uppercase tracking-wide">{meta.label}</span>
                        </div>
                        <p className="font-semibold text-white mb-1 leading-snug">{r.title}</p>
                        {r.description && <p className="text-sm text-gray-400 line-clamp-2">{r.description}</p>}
                        <div className="flex items-center gap-1 text-brand-gold text-sm font-medium mt-3 group-hover:gap-2 transition-all">Abrir <ArrowRight className="w-4 h-4" /></div>
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Overlay cuando está bloqueado */}
        {!unlocked && recursos.length > 0 && (
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-brand-dark to-transparent" />
        )}
      </section>
    </div>
  );
};

export default Recursos;
