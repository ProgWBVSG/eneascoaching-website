import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { toEmbedUrl, isDirectVideo } from '../lib/videoEmbed';
import {
  CheckCircle, Circle, Download, ChevronRight, ChevronLeft, Lock,
  AlertCircle, Menu, X, PlayCircle, FileText,
} from 'lucide-react';

interface Recurso { id: string; name: string; url: string; }
interface Leccion { id: string; title: string; description: string | null; video_url: string | null; recursos: Recurso[]; }
interface Modulo { id: string; title: string; lecciones: Leccion[]; }
interface Curso { id: string; title: string; description: string | null; cover_image_url: string | null; }

const Curso: React.FC = () => {
  const { code: rawCode } = useParams<{ code: string }>();
  const code = (rawCode || '').toUpperCase();

  const [loading, setLoading] = useState(true);
  const [accessError, setAccessError] = useState<string | null>(null);
  const [clientName, setClientName] = useState<string | null>(null);
  const [curso, setCurso] = useState<Curso | null>(null);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [completadas, setCompletadas] = useState<Set<string>>(new Set());
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Lista plana de lecciones (para navegación anterior/siguiente + progreso)
  const flat = useMemo(() => modulos.flatMap(m => m.lecciones), [modulos]);
  const currentLesson = useMemo(() => flat.find(l => l.id === currentId) || null, [flat, currentId]);
  const currentIndex = useMemo(() => flat.findIndex(l => l.id === currentId), [flat, currentId]);
  const progress = flat.length ? Math.round((completadas.size / flat.length) * 100) : 0;

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!code) { setAccessError('Link inválido'); setLoading(false); return; }
      try {
        const res = await fetch(`/api/cursos?action=get&code=${encodeURIComponent(code)}`);
        const data = await res.json();
        if (!mounted) return;
        if (!res.ok) { setAccessError(data.error || 'Link inválido o expirado'); return; }
        setClientName(data.client_name || null);
        setCurso(data.curso);
        setModulos(data.modulos || []);
        setCompletadas(new Set(data.completadas || []));
        const first = (data.modulos || []).flatMap((m: Modulo) => m.lecciones)[0];
        if (first) setCurrentId(first.id);
      } catch {
        if (mounted) setAccessError('No se pudo cargar el curso. Probá de nuevo.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [code]);

  const goTo = useCallback((id: string) => {
    setCurrentId(id);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toggleComplete = useCallback(async () => {
    if (!currentLesson) return;
    const isDone = completadas.has(currentLesson.id);
    const next = new Set(completadas);
    if (isDone) next.delete(currentLesson.id); else next.add(currentLesson.id);
    setCompletadas(next);
    try {
      await fetch('/api/cursos?action=progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, leccion_id: currentLesson.id, completed: !isDone }),
      });
    } catch { /* el estado local ya se actualizó */ }
    // Al completar, avanzar a la siguiente
    if (!isDone && currentIndex < flat.length - 1) {
      setTimeout(() => goTo(flat[currentIndex + 1].id), 400);
    }
  }, [currentLesson, completadas, code, currentIndex, flat, goTo]);

  // ── Estados de carga / error ──────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-beige flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-brand-gold/30 border-t-brand-gold animate-spin" />
          <p className="text-gray-500 text-sm">Cargando tu curso...</p>
        </div>
      </div>
    );
  }

  if (accessError || !curso) {
    return (
      <div className="min-h-screen bg-brand-beige flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="font-heading font-bold text-2xl text-brand-dark mb-3">Acceso no disponible</h1>
          <p className="text-gray-600 text-sm mb-6">{accessError || 'No se encontró el curso.'}</p>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-left">
            <p className="text-sm text-gray-600 flex items-start gap-2">
              <Lock className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
              <span>Este contenido es privado. Pedile tu link personal a <span className="font-semibold text-brand-dark">Cecilia</span>.</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isCurrentDone = currentLesson ? completadas.has(currentLesson.id) : false;
  const embed = toEmbedUrl(currentLesson?.video_url);

  return (
    <div className="min-h-screen bg-brand-beige flex flex-col">
      {/* Header */}
      <header className="bg-brand-dark text-white px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3 min-w-0">
          <button className="lg:hidden p-1.5 -ml-1.5" onClick={() => setSidebarOpen(true)} aria-label="Menú">
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <p className="text-brand-gold text-xs font-bold tracking-widest uppercase">Eneascoaching</p>
            <h1 className="font-heading font-bold text-sm sm:text-base truncate">{curso.title}</h1>
          </div>
        </div>
        <div className="text-right ml-3 shrink-0">
          <p className="text-brand-gold font-bold text-sm">{progress}%</p>
          {clientName && <p className="text-xs text-gray-400 truncate max-w-[120px]">{clientName}</p>}
        </div>
      </header>

      {/* Barra de progreso global */}
      <div className="h-1 bg-gray-200 sticky top-[52px] sm:top-[56px] z-30">
        <div className="h-1 bg-brand-gold transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex-1 flex">
        {/* ── Sidebar (temario) ─────────────────────────────────────── */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-white border-r border-gray-200 overflow-y-auto
          transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="lg:hidden flex justify-between items-center p-4 border-b border-gray-100">
            <span className="font-heading font-bold text-brand-dark">Contenido</span>
            <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
          </div>
          <div className="p-4">
            <p className="text-xs text-gray-400 mb-3">
              {completadas.size} de {flat.length} lecciones completadas
            </p>
            {modulos.map((m, mi) => (
              <div key={m.id} className="mb-5">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-gold mb-2">
                  Módulo {mi + 1} · {m.title}
                </p>
                <div className="space-y-1">
                  {m.lecciones.map((l, li) => {
                    const done = completadas.has(l.id);
                    const active = l.id === currentId;
                    return (
                      <button
                        key={l.id}
                        onClick={() => goTo(l.id)}
                        className={`w-full text-left flex items-start gap-2.5 px-3 py-2.5 rounded-lg transition-colors
                          ${active ? 'bg-brand-gold/10 border border-brand-gold/30' : 'hover:bg-gray-50 border border-transparent'}`}
                      >
                        {done
                          ? <CheckCircle className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                          : <Circle className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />}
                        <span className={`text-sm leading-snug ${active ? 'font-semibold text-brand-dark' : done ? 'text-gray-400' : 'text-gray-700'}`}>
                          <span className="text-gray-400">{mi + 1}.{li + 1}</span> {l.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Contenido de la lección ───────────────────────────────── */}
        <main className="flex-1 min-w-0">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {!currentLesson ? (
              <div className="text-center py-20 text-gray-400">Este curso todavía no tiene lecciones.</div>
            ) : (
              <>
                {/* Video */}
                <div className="rounded-2xl overflow-hidden bg-brand-dark shadow-sm mb-5 aspect-video">
                  {embed && !isDirectVideo(currentLesson.video_url) ? (
                    <iframe
                      src={embed}
                      title={currentLesson.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : isDirectVideo(currentLesson.video_url) ? (
                    <video src={currentLesson.video_url!} controls className="w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <PlayCircle className="w-12 h-12 mb-2" />
                      <p className="text-sm">Video no disponible aún</p>
                    </div>
                  )}
                </div>

                {/* Título + descripción */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h2 className="font-heading font-bold text-xl sm:text-2xl text-brand-dark">{currentLesson.title}</h2>
                </div>
                {currentLesson.description && (
                  <div className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-6">
                    {currentLesson.description}
                  </div>
                )}

                {/* Descargables */}
                {currentLesson.recursos.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
                    <h3 className="font-heading font-bold text-sm text-brand-dark mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-brand-gold" /> Material descargable
                    </h3>
                    <div className="space-y-2">
                      {currentLesson.recursos.map(r => (
                        <a
                          key={r.id}
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-200 hover:border-brand-gold hover:bg-brand-gold/5 transition-colors group"
                        >
                          <span className="text-sm text-brand-dark font-medium truncate">{r.name}</span>
                          <Download className="w-4 h-4 text-gray-400 group-hover:text-brand-gold shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Marcar como completada */}
                <button
                  onClick={toggleComplete}
                  className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-colors mb-4
                    ${isCurrentDone
                      ? 'bg-brand-gold/10 text-brand-gold border-2 border-brand-gold/30'
                      : 'bg-brand-gold hover:bg-amber-600 text-white'}`}
                >
                  {isCurrentDone ? <><CheckCircle className="w-5 h-5" /> Completada</> : <><Circle className="w-5 h-5" /> Marcar como completada</>}
                </button>

                {/* Navegación anterior / siguiente */}
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => currentIndex > 0 && goTo(flat[currentIndex - 1].id)}
                    disabled={currentIndex <= 0}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-white font-medium text-sm"
                  >
                    <ChevronLeft className="w-4 h-4" /> Anterior
                  </button>
                  <span className="text-xs text-gray-400">{currentIndex + 1} / {flat.length}</span>
                  <button
                    onClick={() => currentIndex < flat.length - 1 && goTo(flat[currentIndex + 1].id)}
                    disabled={currentIndex >= flat.length - 1}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-dark text-white disabled:opacity-40 hover:bg-gray-800 font-medium text-sm"
                  >
                    Siguiente <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Curso;
