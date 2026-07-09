import React, { useState, useEffect, useCallback } from 'react';
import {
  Lock, LogOut, Plus, Trash2, ChevronLeft, GraduationCap, Video, FileText,
  Copy, Check as CheckIcon, Link as LinkIcon, Pencil, FolderPlus, X, Users, Star, Award,
} from 'lucide-react';

const STORAGE_KEY = 'enea_admin_token';
const inputCls = 'w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold text-brand-dark';

interface Curso { id: string; title: string; description: string | null; cover_image_url: string | null; published: boolean; price?: number; for_sale?: boolean; }
interface Recurso { id: string; name: string; url: string; }
interface Leccion { id: string; title: string; description: string | null; video_url: string | null; recursos: Recurso[]; }
interface Modulo { id: string; title: string; lecciones: Leccion[]; }
interface Acceso { id: string; code: string; client_name: string | null; is_general: boolean; created_at: string; }
interface Feedback { id: string; client_name: string | null; rating: number | null; comment: string | null; created_at: string; }

const api = (action: string, token: string, opts: RequestInit = {}) =>
  fetch(`/api/cursos?action=${action}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', 'x-admin-token': token, ...(opts.headers || {}) },
  });

const buildCourseLink = (code: string) =>
  `${typeof window !== 'undefined' ? window.location.origin : ''}/#/curso/${code}`;

// ── Modal reutilizable ───────────────────────────────────────────────
const Modal: React.FC<{ onClose: () => void; title: string; icon?: React.ReactNode; children: React.ReactNode }> = ({ onClose, title, icon, children }) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto">
      <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <h3 className="font-heading font-bold text-brand-dark flex items-center gap-2 text-lg">{icon}{title}</h3>
        <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  </div>
);

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
    {children}
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
);

const AulaAdmin: React.FC = () => {
  const [token, setToken] = useState(() => sessionStorage.getItem(STORAGE_KEY) || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [newCourse, setNewCourse] = useState<{ title: string; description: string } | null>(null);
  const [confirmDel, setConfirmDel] = useState<Curso | null>(null);

  const fetchCursos = useCallback(async () => {
    if (!token) return;
    const res = await api('courses', token, { method: 'GET' });
    if (res.status === 401) { sessionStorage.removeItem(STORAGE_KEY); setToken(''); return; }
    setCursos(await res.json());
  }, [token]);

  useEffect(() => { if (token && !selected) fetchCursos(); }, [token, selected, fetchCursos]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoginError('');
    try {
      const res = await fetch('/api/enea-login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      const data = await res.json();
      if (!res.ok) { setLoginError(data.error || 'Error'); return; }
      sessionStorage.setItem(STORAGE_KEY, data.token); setToken(data.token);
    } catch { setLoginError('No se pudo conectar'); }
  };

  const saveNewCourse = async () => {
    if (!newCourse?.title.trim()) return;
    await api('courses', token, { method: 'POST', body: JSON.stringify(newCourse) });
    setNewCourse(null); fetchCursos();
  };

  const deleteCurso = async (id: string) => {
    await api(`courses&id=${id}`, token, { method: 'DELETE' });
    setConfirmDel(null); fetchCursos();
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-4"><GraduationCap className="w-7 h-7 text-brand-gold" /></div>
            <h1 className="font-heading font-bold text-2xl text-white mb-1">Gestión de Cursos</h1>
            <p className="text-gray-400 text-sm">Aula · Eneascoaching</p>
          </div>
          <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
            <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
            <input type="password" value={password} autoFocus onChange={e => { setPassword(e.target.value); setLoginError(''); }} placeholder="••••••••"
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold" />
            {loginError && <p className="text-red-400 text-sm mt-2">{loginError}</p>}
            <button type="submit" className="w-full mt-4 bg-brand-gold hover:bg-amber-600 text-white font-bold py-3 rounded-xl">Ingresar</button>
          </form>
        </div>
      </div>
    );
  }

  if (selected) return <CursoEditor cursoId={selected} token={token} onBack={() => setSelected(null)} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand-dark text-white px-4 sm:px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-brand-gold text-xs font-bold tracking-widest uppercase">Eneascoaching</p>
          <h1 className="font-heading font-bold text-lg">Aula · Gestión de Cursos</h1>
        </div>
        <button onClick={() => { sessionStorage.removeItem(STORAGE_KEY); setToken(''); }} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm">
          <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Salir</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-xl text-brand-dark">Tus cursos</h2>
          <button onClick={() => setNewCourse({ title: '', description: '' })} className="flex items-center gap-2 bg-brand-gold hover:bg-amber-600 text-white font-bold py-2.5 px-5 rounded-xl">
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
                  {c.cover_image_url ? <img src={c.cover_image_url} alt={c.title} className="w-full h-full object-cover" /> : <GraduationCap className="w-10 h-10 text-brand-gold/40" />}
                </div>
                <div className="p-4">
                  <h3 className="font-heading font-bold text-brand-dark truncate">{c.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mt-1 min-h-[2rem]">{c.description || 'Sin descripción'}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <button onClick={() => setSelected(c.id)} className="flex-1 bg-brand-dark text-white text-sm font-semibold py-2 rounded-lg hover:bg-gray-800">Administrar</button>
                    <button onClick={() => setConfirmDel(c)} className="p-2 text-gray-400 hover:text-red-500" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {newCourse && (
        <Modal onClose={() => setNewCourse(null)} title="Nuevo curso" icon={<GraduationCap className="w-5 h-5 text-brand-gold" />}>
          <Field label="Nombre del curso">
            <input autoFocus className={inputCls} value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} placeholder="Ej: Taller Síndrome del Impostor" />
          </Field>
          <Field label="Descripción" hint="Aparece en la portada del curso">
            <textarea rows={3} className={inputCls} value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} placeholder="De qué se trata el curso..." />
          </Field>
          <button onClick={saveNewCourse} disabled={!newCourse.title.trim()} className="w-full bg-brand-gold hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl disabled:opacity-50">Crear curso</button>
        </Modal>
      )}

      {confirmDel && (
        <Modal onClose={() => setConfirmDel(null)} title="Eliminar curso" icon={<Trash2 className="w-5 h-5 text-red-400" />}>
          <p className="text-gray-600 mb-6">¿Seguro que querés eliminar <span className="font-semibold text-brand-dark">"{confirmDel.title}"</span> y todo su contenido? Esta acción no se puede deshacer.</p>
          <div className="flex gap-3">
            <button onClick={() => setConfirmDel(null)} className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50">Cancelar</button>
            <button onClick={() => deleteCurso(confirmDel.id)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl">Eliminar</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ═══════════════════ Editor de un curso ═══════════════════
const CursoEditor: React.FC<{ cursoId: string; token: string; onBack: () => void }> = ({ cursoId, token, onBack }) => {
  const [curso, setCurso] = useState<Curso | null>(null);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [accesos, setAccesos] = useState<Acceso[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [tab, setTab] = useState<'contenido' | 'codigos' | 'feedback'>('contenido');
  const [copied, setCopied] = useState<string | null>(null);
  const [copiedBuy, setCopiedBuy] = useState(false);
  const buildBuyLink = (cid: string) => `${typeof window !== 'undefined' ? window.location.origin : ''}/#/comprar/${cid}`;
  const copyBuy = async (cid: string) => {
    try { await navigator.clipboard.writeText(buildBuyLink(cid)); setCopiedBuy(true); setTimeout(() => setCopiedBuy(false), 2000); }
    catch { prompt('Copiá el link de compra:', buildBuyLink(cid)); }
  };

  // modales
  const [modModal, setModModal] = useState<{ id?: string; title: string } | null>(null);
  const [leccModal, setLeccModal] = useState<{ id?: string; modulo_id: string; title: string; video_url: string; description: string } | null>(null);
  const [recModal, setRecModal] = useState<{ leccion_id: string; name: string; url: string } | null>(null);
  const [confirmMsg, setConfirmMsg] = useState<{ text: string; onOk: () => void } | null>(null);

  const load = useCallback(async () => {
    const res = await api(`course-full&id=${cursoId}`, token, { method: 'GET' });
    const data = await res.json(); setCurso(data.curso); setModulos(data.modulos || []);
  }, [cursoId, token]);
  const loadAccesos = useCallback(async () => { setAccesos(await (await api(`invites&curso_id=${cursoId}`, token, { method: 'GET' })).json()); }, [cursoId, token]);
  const loadFeedbacks = useCallback(async () => { setFeedbacks(await (await api(`feedbacks&curso_id=${cursoId}`, token, { method: 'GET' })).json()); }, [cursoId, token]);

  useEffect(() => { load(); loadAccesos(); loadFeedbacks(); }, [load, loadAccesos, loadFeedbacks]);

  const saveCurso = async (patch: Partial<Curso>) => { if (!curso) return; await api('courses', token, { method: 'POST', body: JSON.stringify({ ...curso, ...patch }) }); load(); };

  const saveModulo = async () => {
    if (!modModal?.title.trim()) return;
    await api('modules', token, { method: 'POST', body: JSON.stringify({ id: modModal.id, curso_id: cursoId, title: modModal.title, position: modModal.id ? undefined : modulos.length }) });
    setModModal(null); load();
  };
  const saveLeccion = async () => {
    if (!leccModal?.title.trim()) return;
    await api('lessons', token, { method: 'POST', body: JSON.stringify({ id: leccModal.id, modulo_id: leccModal.modulo_id, title: leccModal.title, video_url: leccModal.video_url, description: leccModal.description }) });
    setLeccModal(null); load();
  };
  const saveRecurso = async () => {
    if (!recModal?.name.trim() || !recModal?.url.trim()) return;
    await api('resources', token, { method: 'POST', body: JSON.stringify(recModal) });
    setRecModal(null); load();
  };

  const addAcceso = async (client_name: string) => { await api('invites', token, { method: 'POST', body: JSON.stringify({ curso_id: cursoId, client_name }) }); loadAccesos(); };
  const addGeneral = async () => { await api('invites', token, { method: 'POST', body: JSON.stringify({ curso_id: cursoId, is_general: true }) }); loadAccesos(); };
  const delAcceso = async (id: string) => { await api(`invites&id=${id}`, token, { method: 'DELETE' }); loadAccesos(); };

  const copyLink = async (code: string) => {
    try { await navigator.clipboard.writeText(buildCourseLink(code)); setCopied(code); setTimeout(() => setCopied(null), 2000); }
    catch { prompt('Copiá el link:', buildCourseLink(code)); }
  };

  if (!curso) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand-dark text-white px-4 sm:px-6 py-4 flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 -ml-1.5 text-gray-300 hover:text-white"><ChevronLeft className="w-5 h-5" /></button>
        <div className="min-w-0"><p className="text-brand-gold text-xs font-bold tracking-widest uppercase">Curso</p><h1 className="font-heading font-bold text-lg truncate">{curso.title}</h1></div>
      </div>

      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 overflow-x-auto">
        <div className="max-w-4xl mx-auto flex gap-1 min-w-fit">
          {([['contenido', 'Contenido'], ['codigos', 'Códigos de acceso'], ['feedback', `Feedback${feedbacks.length ? ` (${feedbacks.length})` : ''}`]] as const).map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap ${tab === k ? 'border-brand-gold text-brand-gold' : 'border-transparent text-gray-500 hover:text-brand-dark'}`}>{label}</button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {tab === 'contenido' && (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
              <Field label="Título"><input defaultValue={curso.title} onBlur={e => e.target.value !== curso.title && saveCurso({ title: e.target.value })} className={inputCls} /></Field>
              <Field label="Descripción"><textarea defaultValue={curso.description || ''} rows={2} onBlur={e => e.target.value !== (curso.description || '') && saveCurso({ description: e.target.value })} className={inputCls} /></Field>
              <Field label="Imagen de portada (link, opcional)"><input defaultValue={curso.cover_image_url || ''} onBlur={e => e.target.value !== (curso.cover_image_url || '') && saveCurso({ cover_image_url: e.target.value })} placeholder="https://..." className={inputCls} /></Field>
            </div>

            {/* Venta */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-heading font-bold text-brand-dark">Vender este curso</h3>
                  <p className="text-sm text-gray-500">Cobrá con tarjeta / MercadoPago</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={!!curso.for_sale} onChange={e => saveCurso({ for_sale: e.target.checked })} />
                  <div className="w-11 h-6 bg-gray-200 peer-checked:bg-brand-gold rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>
              <Field label="Precio (ARS)" hint="Precio en pesos. Ej: 15000">
                <input type="number" defaultValue={curso.price || ''} onBlur={e => Math.round(Number(e.target.value)) !== (curso.price || 0) && saveCurso({ price: Math.round(Number(e.target.value)) })} placeholder="Ej: 15000" className={inputCls} />
              </Field>
              {curso.for_sale && (
                <div className="bg-brand-beige rounded-xl p-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Link de compra (mandáselo a tus clientas)</p>
                    <code className="text-xs text-brand-gold truncate block">{buildBuyLink(curso.id)}</code>
                  </div>
                  <button onClick={() => copyBuy(curso.id)} className={`shrink-0 flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg ${copiedBuy ? 'bg-green-50 text-green-600' : 'bg-brand-gold/10 text-brand-gold hover:bg-brand-gold/20'}`}>
                    {copiedBuy ? <CheckIcon className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}{copiedBuy ? '¡Copiado!' : 'Copiar'}
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-bold text-brand-dark">Contenido del curso</h2>
              <button onClick={() => setModModal({ title: '' })} className="flex items-center gap-1.5 text-sm bg-brand-dark text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-800"><FolderPlus className="w-4 h-4" /> Módulo</button>
            </div>

            {modulos.length === 0 && <p className="text-gray-400 text-sm text-center py-8">Agregá un módulo para empezar a cargar lecciones.</p>}

            <div className="space-y-4">
              {modulos.map((m, mi) => (
                <div key={m.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                    <span className="font-heading font-bold text-brand-dark text-sm">Módulo {mi + 1} · {m.title}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setModModal({ id: m.id, title: m.title })} className="p-1.5 text-gray-400 hover:text-brand-gold"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setConfirmMsg({ text: `¿Eliminar el módulo "${m.title}" y sus lecciones?`, onOk: async () => { await api(`modules&id=${m.id}`, token, { method: 'DELETE' }); setConfirmMsg(null); load(); } })} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
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
                            <button onClick={() => setLeccModal({ id: l.id, modulo_id: m.id, title: l.title, video_url: l.video_url || '', description: l.description || '' })} className="p-1.5 text-gray-400 hover:text-brand-gold"><Pencil className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setConfirmMsg({ text: `¿Eliminar la lección "${l.title}"?`, onOk: async () => { await api(`lessons&id=${l.id}`, token, { method: 'DELETE' }); setConfirmMsg(null); load(); } })} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                        <div className="pl-6 mt-2 space-y-1">
                          {l.recursos.map(r => (
                            <div key={r.id} className="flex items-center justify-between gap-2 text-xs text-gray-500">
                              <span className="flex items-center gap-1.5 truncate"><FileText className="w-3 h-3 shrink-0" /> {r.name}</span>
                              <button onClick={async () => { await api(`resources&id=${r.id}`, token, { method: 'DELETE' }); load(); }} className="text-gray-300 hover:text-red-500 shrink-0"><Trash2 className="w-3 h-3" /></button>
                            </div>
                          ))}
                          <button onClick={() => setRecModal({ leccion_id: l.id, name: '', url: '' })} className="text-xs text-brand-gold hover:underline flex items-center gap-1"><Plus className="w-3 h-3" /> Descargable</button>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => setLeccModal({ modulo_id: m.id, title: '', video_url: '', description: '' })} className="w-full text-sm text-brand-gold hover:bg-brand-gold/5 border border-dashed border-brand-gold/40 rounded-xl py-2.5 flex items-center justify-center gap-1.5"><Plus className="w-4 h-4" /> Agregar lección</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'codigos' && <CodigosCurso accesos={accesos} onAdd={addAcceso} onGeneral={addGeneral} onDelete={delAcceso} onCopy={copyLink} copied={copied} />}
        {tab === 'feedback' && <FeedbackList feedbacks={feedbacks} />}
      </div>

      {/* ── Modales ── */}
      {modModal && (
        <Modal onClose={() => setModModal(null)} title={modModal.id ? 'Editar módulo' : 'Nuevo módulo'} icon={<FolderPlus className="w-5 h-5 text-brand-gold" />}>
          <Field label="Nombre del módulo"><input autoFocus className={inputCls} value={modModal.title} onChange={e => setModModal({ ...modModal, title: e.target.value })} placeholder="Ej: Semana 1 — Fundamentos" /></Field>
          <button onClick={saveModulo} disabled={!modModal.title.trim()} className="w-full bg-brand-gold hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl disabled:opacity-50">Guardar</button>
        </Modal>
      )}
      {leccModal && (
        <Modal onClose={() => setLeccModal(null)} title={leccModal.id ? 'Editar lección' : 'Nueva lección'} icon={<Video className="w-5 h-5 text-brand-gold" />}>
          <Field label="Título de la lección"><input autoFocus className={inputCls} value={leccModal.title} onChange={e => setLeccModal({ ...leccModal, title: e.target.value })} placeholder="Ej: Cómo identificar tu diálogo interno" /></Field>
          <Field label="Link del video" hint="YouTube 'no listado', Vimeo o Google Drive (compartido con enlace)"><input className={inputCls} value={leccModal.video_url} onChange={e => setLeccModal({ ...leccModal, video_url: e.target.value })} placeholder="https://youtu.be/..." /></Field>
          <Field label="Descripción" hint="Se muestra debajo del video"><textarea rows={3} className={inputCls} value={leccModal.description} onChange={e => setLeccModal({ ...leccModal, description: e.target.value })} placeholder="Qué van a ver en esta clase..." /></Field>
          <button onClick={saveLeccion} disabled={!leccModal.title.trim()} className="w-full bg-brand-gold hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl disabled:opacity-50">Guardar lección</button>
        </Modal>
      )}
      {recModal && (
        <Modal onClose={() => setRecModal(null)} title="Nuevo descargable" icon={<FileText className="w-5 h-5 text-brand-gold" />}>
          <Field label="Nombre del archivo"><input autoFocus className={inputCls} value={recModal.name} onChange={e => setRecModal({ ...recModal, name: e.target.value })} placeholder="Ej: Guía de ejercicios (PDF)" /></Field>
          <Field label="Link del archivo" hint="Drive, Supabase o cualquier link de descarga"><input className={inputCls} value={recModal.url} onChange={e => setRecModal({ ...recModal, url: e.target.value })} placeholder="https://..." /></Field>
          <button onClick={saveRecurso} disabled={!recModal.name.trim() || !recModal.url.trim()} className="w-full bg-brand-gold hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl disabled:opacity-50">Agregar</button>
        </Modal>
      )}
      {confirmMsg && (
        <Modal onClose={() => setConfirmMsg(null)} title="Confirmar" icon={<Trash2 className="w-5 h-5 text-red-400" />}>
          <p className="text-gray-600 mb-6">{confirmMsg.text}</p>
          <div className="flex gap-3">
            <button onClick={() => setConfirmMsg(null)} className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50">Cancelar</button>
            <button onClick={confirmMsg.onOk} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl">Eliminar</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── Tab Códigos ──────────────────────────────────────────────────────
const CodigosCurso: React.FC<{
  accesos: Acceso[]; onAdd: (name: string) => void; onGeneral: () => void; onDelete: (id: string) => void; onCopy: (code: string) => void; copied: string | null;
}> = ({ accesos, onAdd, onGeneral, onDelete, onCopy, copied }) => {
  const [name, setName] = useState('');
  const general = accesos.filter(a => a.is_general);
  const individuales = accesos.filter(a => !a.is_general);
  return (
    <div>
      {/* Link general */}
      <div className="bg-brand-dark rounded-2xl p-5 mb-5 text-white">
        <div className="flex items-center gap-2 mb-1"><Users className="w-5 h-5 text-brand-gold" /><h3 className="font-heading font-bold">Link general (para todas)</h3></div>
        <p className="text-sm text-gray-300 mb-4">Un solo link que le podés mandar a todas tus clientas. Cada una ve su propio avance en su celular. Ideal cuando son varias.</p>
        {general.length === 0 ? (
          <button onClick={onGeneral} className="flex items-center gap-2 bg-brand-gold hover:bg-amber-600 text-white font-bold py-2.5 px-5 rounded-xl"><Plus className="w-5 h-5" /> Generar link general</button>
        ) : (
          general.map(a => (
            <div key={a.id} className="flex items-center justify-between gap-3 bg-white/10 rounded-xl p-3">
              <code className="text-brand-gold font-mono text-sm truncate">{a.code}</code>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => onCopy(a.code)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold ${copied === a.code ? 'bg-green-500/20 text-green-300' : 'bg-brand-gold text-white hover:bg-amber-600'}`}>
                  {copied === a.code ? <CheckIcon className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}{copied === a.code ? '¡Copiado!' : 'Copiar link'}
                </button>
                <button onClick={() => onDelete(a.id)} className="p-1.5 text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Individuales */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
        <h3 className="font-heading font-bold text-brand-dark mb-1">Link individual (por clienta)</h3>
        <p className="text-sm text-gray-500 mb-4">Con nombre, para seguir el progreso de cada una por separado.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre de la clienta" className={inputCls + ' flex-1'} />
          <button onClick={() => { onAdd(name); setName(''); }} className="flex items-center justify-center gap-2 bg-brand-gold hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl"><Plus className="w-5 h-5" /> Generar</button>
        </div>
      </div>

      {individuales.length > 0 && (
        <div className="space-y-2">
          {individuales.map(a => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-brand-dark">{a.client_name || <span className="text-gray-400 italic">Sin nombre</span>}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1"><LinkIcon className="w-3 h-3" /> <code className="text-brand-gold font-mono">{a.code}</code></p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => onCopy(a.code)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold ${copied === a.code ? 'bg-green-50 text-green-600' : 'bg-brand-gold/10 text-brand-gold hover:bg-brand-gold/20'}`}>
                  {copied === a.code ? <CheckIcon className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}{copied === a.code ? '¡Copiado!' : 'Copiar'}
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

// ── Tab Feedback ─────────────────────────────────────────────────────
const FeedbackList: React.FC<{ feedbacks: Feedback[] }> = ({ feedbacks }) => {
  if (feedbacks.length === 0) {
    return <div className="text-center py-16"><Award className="w-10 h-10 text-gray-300 mx-auto mb-2" /><p className="text-gray-400">Todavía no hay opiniones.</p><p className="text-gray-300 text-sm mt-1">Aparecen acá cuando una clienta termina el curso.</p></div>;
  }
  const rated = feedbacks.filter(f => f.rating);
  const avg = rated.length ? (rated.reduce((s, f) => s + (f.rating || 0), 0) / rated.length).toFixed(1) : null;
  return (
    <div>
      {avg && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5 flex items-center gap-4">
          <div className="text-center"><p className="font-heading font-bold text-4xl text-brand-gold">{avg}</p><div className="flex gap-0.5 justify-center mt-1">{[1,2,3,4,5].map(n => <Star key={n} className={`w-3.5 h-3.5 ${n <= Math.round(Number(avg)) ? 'fill-brand-gold text-brand-gold' : 'text-gray-200'}`} />)}</div></div>
          <div><p className="text-sm text-gray-500">Promedio de {rated.length} {rated.length === 1 ? 'opinión' : 'opiniones'}</p></div>
        </div>
      )}
      <div className="space-y-3">
        {feedbacks.map(f => (
          <div key={f.id} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="font-semibold text-brand-dark">{f.client_name || 'Anónima'}</p>
              {f.rating && <div className="flex gap-0.5">{[1,2,3,4,5].map(n => <Star key={n} className={`w-4 h-4 ${n <= (f.rating || 0) ? 'fill-brand-gold text-brand-gold' : 'text-gray-200'}`} />)}</div>}
            </div>
            {f.comment && <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{f.comment}</p>}
            <p className="text-xs text-gray-400 mt-2">{new Date(f.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AulaAdmin;
