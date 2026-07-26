import React, { useState, useEffect, useCallback } from 'react';
import { Lock, LogOut, Plus, Trash2, Pencil, X, Library } from 'lucide-react';

const STORAGE_KEY = 'enea_admin_token';
const inputCls = 'w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold text-brand-dark';
const KINDS = [['video', 'Video'], ['test', 'Test'], ['pdf', 'PDF'], ['herramienta', 'Herramienta'], ['guia', 'Guía']] as const;

interface Recurso { id: string; title: string; description: string | null; kind: string; url: string | null; category: string | null; published: boolean; }

const api = (action: string, token: string, opts: RequestInit = {}) =>
  fetch(`/api/cursos?action=${action}`, { ...opts, headers: { 'Content-Type': 'application/json', 'x-admin-token': token, ...(opts.headers || {}) } });

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
  <div className="mb-4"><label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>{children}{hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}</div>
);

const RecursosAdmin: React.FC = () => {
  const [token, setToken] = useState(() => sessionStorage.getItem(STORAGE_KEY) || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [items, setItems] = useState<Recurso[]>([]);
  const [modal, setModal] = useState<Partial<Recurso> | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    const res = await api('recursos-admin', token, { method: 'GET' });
    if (res.status === 401) { sessionStorage.removeItem(STORAGE_KEY); setToken(''); return; }
    setItems(await res.json());
  }, [token]);
  useEffect(() => { load(); }, [load]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoginError('');
    try {
      const res = await fetch('/api/enea-login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      const data = await res.json();
      if (!res.ok) { setLoginError(data.error || 'Error'); return; }
      sessionStorage.setItem(STORAGE_KEY, data.token); setToken(data.token);
    } catch { setLoginError('No se pudo conectar'); }
  };

  const save = async () => {
    if (!modal?.title?.trim()) return;
    await api('recursos-admin', token, { method: 'POST', body: JSON.stringify(modal) });
    setModal(null); load();
  };
  const del = async (id: string) => { await api(`recursos-admin&id=${id}`, token, { method: 'DELETE' }); load(); };

  if (!token) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-4"><Library className="w-7 h-7 text-brand-gold" /></div>
            <h1 className="font-heading font-bold text-2xl text-white mb-1">Recursos</h1>
            <p className="text-gray-400 text-sm">Hub de recursos · Gestión</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-brand-dark text-white px-4 sm:px-6 py-4 flex items-center justify-between">
        <div><p className="text-brand-gold text-xs font-bold tracking-widest uppercase">Eneascoaching</p><h1 className="font-heading font-bold text-lg">Hub de Recursos</h1></div>
        <button onClick={() => { sessionStorage.removeItem(STORAGE_KEY); setToken(''); }} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm"><LogOut className="w-4 h-4" /><span className="hidden sm:inline">Salir</span></button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-xl text-brand-dark">Recursos ({items.length})</h2>
          <button onClick={() => setModal({ kind: 'guia', title: '' })} className="flex items-center gap-2 bg-brand-gold hover:bg-amber-600 text-white font-bold py-2.5 px-5 rounded-xl"><Plus className="w-5 h-5" /> Nuevo recurso</button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16"><Library className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-400">Sin recursos todavía. Cargá el primero.</p></div>
        ) : (
          <div className="space-y-2">
            {items.map(r => (
              <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-brand-dark truncate">{r.title} <span className="text-xs text-gray-400 font-normal">· {KINDS.find(k => k[0] === r.kind)?.[1]}{r.category ? ` · ${r.category}` : ''}</span></p>
                  {r.url && <p className="text-xs text-gray-400 truncate">{r.url}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setModal(r)} className="p-1.5 text-gray-400 hover:text-brand-gold"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => del(r.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white">
              <h3 className="font-heading font-bold text-brand-dark text-lg">{modal.id ? 'Editar recurso' : 'Nuevo recurso'}</h3>
              <button onClick={() => setModal(null)} className="p-1.5 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5">
              <Field label="Título"><input autoFocus className={inputCls} value={modal.title || ''} onChange={e => setModal({ ...modal, title: e.target.value })} placeholder="Ej: Test rápido de eneatipo" /></Field>
              <Field label="Descripción"><input className={inputCls} value={modal.description || ''} onChange={e => setModal({ ...modal, description: e.target.value })} /></Field>
              <Field label="Tipo">
                <div className="flex flex-wrap gap-2">
                  {KINDS.map(([k, l]) => (
                    <button key={k} onClick={() => setModal({ ...modal, kind: k })} className={`py-1.5 px-3 rounded-lg border-2 text-xs font-medium ${modal.kind === k ? 'border-brand-gold bg-brand-gold/10 text-brand-gold' : 'border-gray-200 text-gray-600'}`}>{l}</button>
                  ))}
                </div>
              </Field>
              <Field label="Categoría" hint="Agrupa los recursos (ej: Tests, Videos, Guías)"><input className={inputCls} value={modal.category || ''} onChange={e => setModal({ ...modal, category: e.target.value })} placeholder="Ej: Autoconocimiento" /></Field>
              <Field label="Link" hint="YouTube, Drive, PDF, o una ruta interna (#/enea-test-juridico)"><input className={inputCls} value={modal.url || ''} onChange={e => setModal({ ...modal, url: e.target.value })} placeholder="https://..." /></Field>
              <button onClick={save} disabled={!modal.title?.trim()} className="w-full bg-brand-gold hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl disabled:opacity-50">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecursosAdmin;
