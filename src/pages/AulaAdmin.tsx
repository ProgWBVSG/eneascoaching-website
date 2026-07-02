import React, { useState, useEffect, useCallback } from 'react';
import {
  Lock, LogOut, Plus, Trash2, ChevronLeft, GraduationCap, Video, FileText,
  Copy, Check as CheckIcon, Link as LinkIcon, Pencil, FolderPlus,
} from 'lucide-react';

const STORAGE_KEY = 'enea_admin_token';

interface Curso { id: string; title: string; description: string | null; cover_image_url: string | null; published: boolean; }
interface Recurso { id: string; name: string; url: string; }
interface Leccion { id: string; title: string; description: string | null; video_url: string | null; recursos: Recurso[]; }
interface Modulo { id: string; title: string; lecciones: Leccion[]; }
interface Acceso { id: string; code: string; client_name: string | null; created_at: string; }

const api = (action: string, token: string, opts: RequestInit = {}) =>
  fetch(`/api/cursos?action=${action}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', 'x-admin-token': token, ...(opts.headers || {}) },
  });

const buildCourseLink = (code: string) =>
  `${typeof window !== 'undefined' ? window.location.origin : ''}/#/curso/${code}`;

const AulaAdmin: React.FC = () => {
  const [token, setToken] = useState(() => sessionStorage.getItem(STORAGE_KEY) || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const fetchCursos = useCallback(async () => {
    if (!token) return;
    const res = await api('courses', token, { method: 'GET' });
    if (res.status === 401) { sessionStorage.removeItem(STORAGE_KEY); setToken(''); return; }
    setCursos(await res.json());
  }, [token]);

  useEffect(() => { if (token && !selected) fetchCursos(); }, [token, selected, fetchCursos]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/enea-login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) { setLoginError(data.error || 'Error'); return; }
      sessionStorage.setItem(STORAGE_KEY, data.token);
      setToken(data.token);
    } catch { setLoginError('No se pudo conectar'); }
  };

  const createCurso = async () => {
    const title = prompt('Nombre del nuevo curso:');
    if (!title?.trim()) return;
    await api('courses', token, { method: 'POST', body: JSON.stringify({ title }) });
    fetchCursos();
  };

  const deleteCurso = async (id: string) => {
    if (!confirm('¿Eliminar este curso y todo su contenido?')) return;
    await api(`courses&id=${id}`, token, { method: 'DELETE' });
    fetchCursos();
  };

  // ── Login ─────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-7 h-7 text-brand-gold" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-white mb-1">Gestión de Cursos</h1>
            <p className="text-gray-400 text-sm">Aula · Eneascoaching</p>
          </div>
          <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
            <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
            <input type="password" value={password} autoFocus
              onChange={e => { setPassword(e.target.value); setLoginError(''); }}
              placeholder="••••••••"
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold" />
            {loginError && <p className="text-red-400 text-sm mt-2">{loginError}</p>}
            <button type="submit" className="w-full mt-4 bg-brand-gold hover:bg-amber-600 text-white font-bold py-3 rounded-xl">Ingresar</button>
          </form>
        </div>
      </div>
    );
  }

  // ── Editor de un curso ────────────────────────────────────────────
  if (selected) {
    return <CursoEditor cursoId={selected} token={token} onBack={() => setSelected(null)} />;
  }

  // ── Lista de cursos ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand-dark text-white px-4 sm:px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-brand-gold text-xs font-bold tracking-widest uppercase">Eneascoaching</p>
          <h1 className="font-heading font-bold text-lg">Aula · Gestión de Cursos</h1>
        </div>
        <button onClick={() => { sessionStorage.removeItem(STORAGE_KEY); setToken(''); }}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm">
          <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Salir</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-xl text-brand-dark">Tus cursos</h2>
          <button onClick={createCurso} className="flex items-center gap-2 bg-brand-gold hover:bg-amber-600 text-white font-bold py-2.5 px-5 rounded-xl">
            <Plus className="w-5 h-5" /> Nuevo curso
          </button>
        </div>

        {cursos.length === 0 ? (
          <div className="text-center py-20">
            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-lg">Todavía no hay cursos.</p>
            <p className="text-gray-300 text-sm mt-1">Creá el primero con el botón de arriba.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cursos.map(c => (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-28 bg-gradient-to-br from-brand-gold/20 to-brand-dark/10 flex items-center justify-center">
                  {c.cover_image_url
                    ? <img src={c.cover_image_url} alt={c.title} className="w-full h-full object-cover" />
                    : <GraduationCap className="w-10 h-10 text-brand-gold/40" />}
                </div>
                <div className="p-4">
                  <h3 className="font-heading font-bold text-brand-dark truncate">{c.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1 min-h-[2rem]">{c.description || 'Sin descripción'}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <button onClick={() => setSelected(c.id)} className="flex-1 bg-brand-dark text-white text-sm font-semibold py-2 rounded-lg hover:bg-gray-800">
                      Administrar
                    </button>
                    <button onClick={() => deleteCurso(c.id)} className="p-2 text-gray-400 hover:text-red-500" title="Eliminar">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// Editor de un curso: datos + módulos + lecciones + recursos + códigos
// ═══════════════════════════════════════════════════════════════════
const CursoEditor: React.FC<{ cursoId: string; token: string; onBack: () => void }> = ({ cursoId, token, onBack }) => {
  const [curso, setCurso] = useState<Curso | null>(null);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [accesos, setAccesos] = useState<Acceso[]>([]);
  const [tab, setTab] = useState<'contenido' | 'codigos'>('contenido');
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await api(`course-full&id=${cursoId}`, token, { method: 'GET' });
    const data = await res.json();
    setCurso(data.curso);
    setModulos(data.modulos || []);
  }, [cursoId, token]);

  const loadAccesos = useCallback(async () => {
    const res = await api(`invites&curso_id=${cursoId}`, token, { method: 'GET' });
    setAccesos(await res.json());
  }, [cursoId, token]);

  useEffect(() => { load(); loadAccesos(); }, [load, loadAccesos]);

  const saveCurso = async (patch: Partial<Curso>) => {
    if (!curso) return;
    await api('courses', token, { method: 'POST', body: JSON.stringify({ ...curso, ...patch }) });
    load();
  };

  const addModulo = async () => {
    const title = prompt('Nombre del módulo:');
    if (!title?.trim()) return;
    await api('modules', token, { method: 'POST', body: JSON.stringify({ curso_id: cursoId, title, position: modulos.length }) });
    load();
  };
  const delModulo = async (id: string) => {
    if (!confirm('¿Eliminar el módulo y sus lecciones?')) return;
    await api(`modules&id=${id}`, token, { method: 'DELETE' }); load();
  };

  const addLeccion = async (modulo_id: string, pos: number) => {
    const title = prompt('Título de la lección:');
    if (!title?.trim()) return;
    const video_url = prompt('Link del video (YouTube/Vimeo oculto):') || '';
    const description = prompt('Descripción (opcional):') || '';
    await api('lessons', token, { method: 'POST', body: JSON.stringify({ modulo_id, title, video_url, description, position: pos }) });
    load();
  };
  const editLeccion = async (l: Leccion) => {
    const title = prompt('Título:', l.title); if (title === null) return;
    const video_url = prompt('Link del video:', l.video_url || '') ?? '';
    const description = prompt('Descripción:', l.description || '') ?? '';
    await api('lessons', token, { method: 'POST', body: JSON.stringify({ id: l.id, title, video_url, description }) });
    load();
  };
  const delLeccion = async (id: string) => {
    if (!confirm('¿Eliminar esta lección?')) return;
    await api(`lessons&id=${id}`, token, { method: 'DELETE' }); load();
  };

  const addRecurso = async (leccion_id: string) => {
    const name = prompt('Nombre del descargable (ej: Guía PDF):'); if (!name?.trim()) return;
    const url = prompt('Link del archivo (Drive, Supabase, etc.):'); if (!url?.trim()) return;
    await api('resources', token, { method: 'POST', body: JSON.stringify({ leccion_id, name, url }) });
    load();
  };
  const delRecurso = async (id: string) => {
    await api(`resources&id=${id}`, token, { method: 'DELETE' }); load();
  };

  const addAcceso = async (client_name: string) => {
    await api('invites', token, { method: 'POST', body: JSON.stringify({ curso_id: cursoId, client_name }) });
    loadAccesos();
  };
  const delAcceso = async (id: string) => {
    await api(`invites&id=${id}`, token, { method: 'DELETE' }); loadAccesos();
  };

  const copyLink = async (code: string) => {
    try { await navigator.clipboard.writeText(buildCourseLink(code)); setCopied(code); setTimeout(() => setCopied(null), 2000); }
    catch { prompt('Copiá el link:', buildCourseLink(code)); }
  };

  if (!curso) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand-dark text-white px-4 sm:px-6 py-4 flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 -ml-1.5 text-gray-300 hover:text-white"><ChevronLeft className="w-5 h-5" /></button>
        <div className="min-w-0">
          <p className="text-brand-gold text-xs font-bold tracking-widest uppercase">Curso</p>
          <h1 className="font-heading font-bold text-lg truncate">{curso.title}</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex gap-1">
          {(['contenido', 'codigos'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 ${tab === t ? 'border-brand-gold text-brand-gold' : 'border-transparent text-gray-500 hover:text-brand-dark'}`}>
              {t === 'contenido' ? 'Contenido' : 'Códigos de acceso'}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {tab === 'contenido' && (
          <>
            {/* Datos del curso */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Título</label>
              <input defaultValue={curso.title} onBlur={e => e.target.value !== curso.title && saveCurso({ title: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 mb-3 focus:outline-none focus:border-brand-gold font-semibold text-brand-dark" />
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Descripción</label>
              <textarea defaultValue={curso.description || ''} rows={2} onBlur={e => e.target.value !== (curso.description || '') && saveCurso({ description: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 mb-3 focus:outline-none focus:border-brand-gold text-sm" />
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Imagen de portada (link, opcional)</label>
              <input defaultValue={curso.cover_image_url || ''} onBlur={e => e.target.value !== (curso.cover_image_url || '') && saveCurso({ cover_image_url: e.target.value })}
                placeholder="https://..." className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-brand-gold text-sm" />
            </div>

            {/* Módulos y lecciones */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-bold text-brand-dark">Contenido del curso</h2>
              <button onClick={addModulo} className="flex items-center gap-1.5 text-sm bg-brand-dark text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-800">
                <FolderPlus className="w-4 h-4" /> Módulo
              </button>
            </div>

            {modulos.length === 0 && <p className="text-gray-400 text-sm text-center py-8">Agregá un módulo para empezar a cargar lecciones.</p>}

            <div className="space-y-4">
              {modulos.map((m, mi) => (
                <div key={m.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                    <span className="font-heading font-bold text-brand-dark text-sm">Módulo {mi + 1} · {m.title}</span>
                    <button onClick={() => delModulo(m.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="p-4 space-y-2">
                    {m.lecciones.map((l, li) => (
                      <div key={l.id} className="border border-gray-100 rounded-xl p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2 min-w-0">
                            <Video className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-brand-dark">{mi + 1}.{li + 1} {l.title}</p>
                              {l.video_url && <p className="text-xs text-gray-400 truncate">{l.video_url}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => editLeccion(l)} className="p-1.5 text-gray-400 hover:text-brand-gold"><Pencil className="w-3.5 h-3.5" /></button>
                            <button onClick={() => delLeccion(l.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                        {/* Recursos de la lección */}
                        <div className="pl-6 mt-2 space-y-1">
                          {l.recursos.map(r => (
                            <div key={r.id} className="flex items-center justify-between gap-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1.5 truncate"><FileText className="w-3 h-3 shrink-0" /> {r.name}</span>
                              <button onClick={() => delRecurso(r.id)} className="text-gray-300 hover:text-red-500 shrink-0"><Trash2 className="w-3 h-3" /></button>
                            </div>
                          ))}
                          <button onClick={() => addRecurso(l.id)} className="text-xs text-brand-gold hover:underline flex items-center gap-1">
                            <Plus className="w-3 h-3" /> Descargable
                          </button>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => addLeccion(m.id, m.lecciones.length)} className="w-full text-sm text-brand-gold hover:bg-brand-gold/5 border border-dashed border-brand-gold/40 rounded-xl py-2.5 flex items-center justify-center gap-1.5">
                      <Plus className="w-4 h-4" /> Agregar lección
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'codigos' && (
          <CodigosCurso accesos={accesos} onAdd={addAcceso} onDelete={delAcceso} onCopy={copyLink} copied={copied} />
        )}
      </div>
    </div>
  );
};

const CodigosCurso: React.FC<{
  accesos: Acceso[]; onAdd: (name: string) => void; onDelete: (id: string) => void;
  onCopy: (code: string) => void; copied: string | null;
}> = ({ accesos, onAdd, onDelete, onCopy, copied }) => {
  const [name, setName] = useState('');
  return (
    <div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
        <h3 className="font-heading font-bold text-brand-dark mb-1">Generar acceso para una clienta</h3>
        <p className="text-sm text-gray-500 mb-4">Cada link es único. Mandáselo por WhatsApp y solo esa persona entra al curso.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre de la clienta (opcional)"
            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold" />
          <button onClick={() => { onAdd(name); setName(''); }} className="flex items-center justify-center gap-2 bg-brand-gold hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl">
            <Plus className="w-5 h-5" /> Generar link
          </button>
        </div>
      </div>

      {accesos.length === 0 ? (
        <div className="text-center py-12"><Lock className="w-10 h-10 text-gray-300 mx-auto mb-2" /><p className="text-gray-400">Sin accesos generados todavía.</p></div>
      ) : (
        <div className="space-y-2">
          {accesos.map(a => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-brand-dark">{a.client_name || <span className="text-gray-400 italic">Sin nombre</span>}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1"><LinkIcon className="w-3 h-3" /> <code className="text-brand-gold font-mono">{a.code}</code></p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => onCopy(a.code)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold ${copied === a.code ? 'bg-green-50 text-green-600' : 'bg-brand-gold/10 text-brand-gold hover:bg-brand-gold/20'}`}>
                  {copied === a.code ? <CheckIcon className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === a.code ? '¡Copiado!' : 'Copiar link'}
                </button>
                <button onClick={() => onDelete(a.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AulaAdmin;
