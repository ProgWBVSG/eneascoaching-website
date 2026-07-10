import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Compass, Sparkles, TrendingUp, MessageCircle, Video, FileText, GraduationCap,
  ExternalLink, PlayCircle, Newspaper, ArrowRight, Loader2, Lock, AlertCircle, Star,
} from 'lucide-react';

interface Item {
  id: string; pillar: string; kind: string; title: string; description: string | null;
  url: string | null; curso_code: string | null;
}
interface Config {
  welcome_title?: string | null; welcome_text?: string | null;
  whatsapp_url?: string | null; zoom_url?: string | null; zoom_text?: string | null;
  onboarding_url?: string | null; onboarding_text?: string | null;
}

const PILARES = [
  { key: 'conocerte', label: 'Conocerte', sub: 'Descubrí quién sos', icon: Compass, color: '#C5A059' },
  { key: 'rediseniarte', label: 'Rediseñarte', sub: 'Transformá lo que descubriste', icon: Sparkles, color: '#8B6BB8' },
  { key: 'avanzar', label: 'Avanzar', sub: 'Crecé acompañada', icon: TrendingUp, color: '#5DA8A0' },
];

const KIND_ICON: Record<string, React.ElementType> = {
  curso: PlayCircle, pdf: FileText, test: Star, novedad: Newspaper, link: ExternalLink,
};

const Comunidad: React.FC = () => {
  const { code: rawCode } = useParams<{ code: string }>();
  const code = (rawCode || '').toUpperCase();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [memberName, setMemberName] = useState<string | null>(null);
  const [config, setConfig] = useState<Config>({});
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!code) { setError('Link inválido'); setLoading(false); return; }
      try {
        const res = await fetch(`/api/cursos?action=com-get&code=${encodeURIComponent(code)}`);
        const data = await res.json();
        if (!mounted) return;
        if (!res.ok) { setError(data.error || 'Link inválido o expirado'); return; }
        setMemberName(data.member_name || null);
        setConfig(data.config || {});
        setItems(data.items || []);
      } catch { if (mounted) setError('No se pudo cargar la comunidad.'); }
      finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [code]);

  const itemsByPillar = useMemo(() => {
    const map: Record<string, Item[]> = { conocerte: [], rediseniarte: [], avanzar: [] };
    items.forEach(i => { if (map[i.pillar]) map[i.pillar].push(i); });
    return map;
  }, [items]);

  const itemHref = (i: Item) => i.kind === 'curso' && i.curso_code ? `#/curso/${i.curso_code}` : (i.url || '#');
  const itemExternal = (i: Item) => !(i.kind === 'curso' && i.curso_code);

  if (loading) {
    return <div className="min-h-screen bg-brand-beige flex items-center justify-center"><Loader2 className="w-8 h-8 text-brand-gold animate-spin" /></div>;
  }
  if (error) {
    return (
      <div className="min-h-screen bg-brand-beige flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6"><AlertCircle className="w-10 h-10 text-red-400" /></div>
          <h1 className="font-heading font-bold text-2xl text-brand-dark mb-3">Acceso no disponible</h1>
          <p className="text-gray-600 text-sm mb-6">{error}</p>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-left">
            <p className="text-sm text-gray-600 flex items-start gap-2"><Lock className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" /><span>Este espacio es solo para miembros de <span className="font-semibold text-brand-dark">Descubrí tu Norte</span>.</span></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-beige">
      {/* Header */}
      <header className="bg-brand-dark text-white px-4 sm:px-6 py-4 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-brand-gold text-xs font-bold tracking-widest uppercase">Comunidad</p>
            <h1 className="font-heading font-bold text-lg sm:text-xl">Descubrí tu Norte</h1>
          </div>
          {memberName && <p className="text-sm text-gray-300 truncate ml-3">Hola, <span className="text-brand-gold font-semibold">{memberName.split(' ')[0]}</span> 👋</p>}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {/* Bienvenida */}
        <div className="text-center mb-6">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark mb-2">
            {config.welcome_title || 'Bienvenida a tu espacio'}
          </h2>
          {config.welcome_text && <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto whitespace-pre-line">{config.welcome_text}</p>}
        </div>

        {/* Onboarding destacado */}
        {config.onboarding_url && (
          <a href={config.onboarding_url} target={config.onboarding_url.startsWith('#') ? undefined : '_blank'} rel="noopener noreferrer"
            className="block bg-gradient-to-br from-brand-gold to-amber-500 text-white rounded-3xl p-6 sm:p-7 mb-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0"><Compass className="w-6 h-6" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider opacity-80">Empezá acá</p>
                <p className="font-heading font-bold text-lg">{config.onboarding_text || 'Hacé tu test del eneagrama'}</p>
              </div>
              <ArrowRight className="w-6 h-6 shrink-0" />
            </div>
          </a>
        )}

        {/* Accesos rápidos: WhatsApp + Zoom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {config.whatsapp_url && (
            <a href={config.whatsapp_url} target="_blank" rel="noopener noreferrer"
              className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-3 hover:border-green-300 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center shrink-0"><MessageCircle className="w-5 h-5 text-green-500" /></div>
              <div className="min-w-0"><p className="font-semibold text-brand-dark text-sm">Grupo de WhatsApp</p><p className="text-xs text-gray-400">Entrá a la comunidad</p></div>
            </a>
          )}
          {config.zoom_url && (
            <a href={config.zoom_url} target="_blank" rel="noopener noreferrer"
              className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-3 hover:border-brand-gold transition-colors">
              <div className="w-11 h-11 rounded-xl bg-brand-gold/10 flex items-center justify-center shrink-0"><Video className="w-5 h-5 text-brand-gold" /></div>
              <div className="min-w-0"><p className="font-semibold text-brand-dark text-sm">El Encuentro del mes</p><p className="text-xs text-gray-400">{config.zoom_text || 'Zoom en vivo'}</p></div>
            </a>
          )}
        </div>

        {/* Los 3 pilares */}
        <div className="space-y-8">
          {PILARES.map((p, idx) => {
            const list = itemsByPillar[p.key] || [];
            return (
              <section key={p.key}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${p.color}1a` }}>
                    <p.icon className="w-5 h-5" style={{ color: p.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color: p.color }}>PILAR {idx + 1}</span>
                    </div>
                    <h3 className="font-heading font-bold text-xl text-brand-dark leading-tight">{p.label}</h3>
                    <p className="text-xs text-gray-400">{p.sub}</p>
                  </div>
                </div>

                {list.length === 0 ? (
                  <div className="bg-white/60 rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-400">
                    Pronto vas a encontrar contenido acá 🌱
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {list.map(i => {
                      const Icon = KIND_ICON[i.kind] || ExternalLink;
                      return (
                        <a key={i.id} href={itemHref(i)} target={itemExternal(i) ? '_blank' : undefined} rel="noopener noreferrer"
                          className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3 hover:shadow-sm hover:border-brand-gold/40 transition-all group">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${p.color}14` }}>
                            <Icon className="w-5 h-5" style={{ color: p.color }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-brand-dark text-sm leading-snug">{i.title}</p>
                            {i.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{i.description}</p>}
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-gold shrink-0 mt-1" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <p className="text-center text-xs text-gray-400 mt-10">Descubrí tu Norte · Eneascoaching</p>
      </div>
    </div>
  );
};

export default Comunidad;
