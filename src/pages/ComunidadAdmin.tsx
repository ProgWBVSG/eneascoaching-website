import React, { useState, useEffect, useCallback } from 'react';
import {
  Lock, LogOut, Plus, Trash2, X, Compass, Sparkles, TrendingUp, Users,
  Copy, Check as CheckIcon, Link as LinkIcon, Pencil, Settings,
} from 'lucide-react';

const STORAGE_KEY = 'enea_admin_token';
const inputCls = 'w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold text-brand-dark';

const PILARES = [
  { key: 'conocerte', label: 'Conocerte', icon: Compass, color: '#C5A059' },
  { key: 'rediseniarte', label: 'Rediseñarte', icon: Sparkles, color: '#8B6BB8' },
  { key: 'avanzar', label: 'Avanzar', icon: TrendingUp, color: '#5DA8A0' },
];
const KINDS = [
  { key: 'curso', label: 'Curso' }, { key: 'pdf', label: 'PDF / Ebook' },
  { key: 'test', label: 'Test' }, { key: 'novedad', label: 'Novedad' }, { key: 'link', label: 'Link' },
];

interface Item { id: string; pillar: string; kind: string; title: string; description: string | null; url: string | null; curso_code: string | null; }
interface Config { welcome_title?: string; welcome_text?: string; whatsapp_url?: string; zoom_url?: string; zoom_text?: string; onboarding_url?: string; onboarding_text?: string; }
interface Acceso { id: string; code: string; member_name: string | null; is_general: boolean; }

const api = (action: string, token: string, opts: RequestInit = {}) =>
  fetch(`/api/cursos?action=${action}`, { ...opts, headers: { 'Content-Type': 'application/json', 'x-admin-token': token, ...(opts.headers || {}) } });

const Modal: React.FC<{ onClose: () => void; title: string; children: React.ReactNode }> = ({ onClose, title, children }) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
        <h3 className="font-heading font-bold text-brand-dark text-lg">{title}</h3>
        <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);

const ComunidadAdmin: React.FC = () => {
  const [token, setToken] = useState(() => sessionStorage.getItem(STORAGE_KEY) || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState<'contenido' | 'config' | 'miembros'>('contenido');
  const [config, setConfig] = useState<Config>({});
  const [items, setItems] = useState<Item[]>([]);
  const [accesos, setAccesos] = useState<Acceso[]>([]);
  const [itemModal, setItemModal] = useState<Partial<Item> | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [memberName, setMemberName] = useState('');

  const loadAll = useCallback(async () => {
    if (!token) return;
    const [c, i, a] = await Promise.all([
      api('com-config', token, { method: 'GET' }),
      api('com-items', token, { method: 'GET' }),
      api('com-invites', token, { method: 'GET' }),
    ]);
    if (c.status === 401) { sessionStorage.removeItem(STORAGE_KEY); setToken(''); return; }
    setConfig(await c.json()); setItems(await i.json()); setAccesos(await a.json());
  }, [token]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoginError('');
    try {
      const res = await fetch('/api/enea-login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      const data = await res.json();
      if (!res.ok) { setLoginError(data.error || 'Error'); return; }
      sessionStorage.setItem(STORAGE_KEY, data.token); setToken(data.token);
    } catch { setLoginError('No se pudo conectar'); }
  };

  const saveConfig = async (patch: Partial<Config>) => {
    const next = { ...config, ...patch }; setConfig(next);
    await api('com-config', token, { method: 'POST', body: JSON.stringify(next) });
  };
  const saveItem = async () => {
    if (!itemModal?.title?.trim() || !itemModal.pillar) return;
    await api('com-items', token, { method: 'POST', body: JSON.stringify(itemModal) });
    setItemModal(null); loadAll();
  };
  const delItem = async (id: string) => { await api(`com-items&id=${id}`, token, { method: 'DELETE' }); loadAll(); };

  const addAcceso = async (is_general: boolean) => {
    await api('com-invites', token, { method: 'POST', body: JSON.stringify({ member_name: memberName, is_general }) });
    setMemberName(''); loadAll();
  };
  const delAcceso = async (id: string) => { await api(`com-invites&id=${id}`, token, { method: 'DELETE' }); loadAll(); };

  const copyLink = async (code: string, path: string) => {
    const link = `${window.location.origin}/#/${path}/${code}`;
    try { await navigator.clipboard.writeText(link); setCopied(code); setTimeout(() => setCopied(null), 2000); }
    catch { prompt('Copiá el link:', link); }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-4"><Users className="w-7 h-7 text-brand-gold" /></div>
            <h1 className="font-heading font-bold text-2xl text-white mb-1">Comunidad</h1>
            <p className="text-gray-400 text-sm">Descubrí tu Norte · Gestión</p>
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
        <div><p className="text-brand-gold text-xs font-bold tracking-widest uppercase">Descubrí tu Norte</p><h1 className="font-heading font-bold text-lg">Gestión de la Comunidad</h1></div>
        <button onClick={() => { sessionStorage.removeItem(STORAGE_KEY); setToken(''); }} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm"><LogOut className="w-4 h-4" /><span className="hidden sm:inline">Salir</span></button>
      </div>

      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 overflow-x-auto">
        <div className="max-w-4xl mx-auto flex gap-1 min-w-fit">
          {([['contenido', 'Contenido'], ['config', 'Bienvenida y accesos'], ['miembros', 'Miembros']] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap ${tab === k ? 'border-brand-gold text-brand-gold' : 'border-transparent text-gray-500 hover:text-brand-dark'}`}>{l}</button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* CONTENIDO: items por pilar */}
        {tab === 'contenido' && (
          <div className="space-y-6">
            {PILARES.map((p, idx) => (
              <div key={p.key}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${p.color}1a` }}><p.icon className="w-4 h-4" style={{ color: p.color }} /></div>
                    <div><span className="text-xs font-bold" style={{ color: p.color }}>PILAR {idx + 1}</span><h3 className="font-heading font-bold text-brand-dark leading-tight">{p.label}</h3></div>
                  </div>
                  <button onClick={() => setItemModal({ pillar: p.key, kind: 'link', title: '' })} className="flex items-center gap-1.5 text-sm bg-brand-dark text-white font-semibold py-2 px-3 rounded-lg hover:bg-gray-800"><Plus className="w-4 h-4" /> Item</button>
                </div>
                <div className="space-y-2">
                  {items.filter(i => i.pillar === p.key).length === 0 && <p className="text-gray-400 text-sm text-center py-4 bg-white rounded-xl border border-dashed border-gray-200">Sin contenido en este pilar</p>}
                  {items.filter(i => i.pillar === p.key).map(i => (
                    <div key={i.id} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-brand-dark truncate">{i.title} <span className="text-xs text-gray-400 font-normal">· {KINDS.find(k => k.key === i.kind)?.label}</span></p>
                        {(i.url || i.curso_code) && <p className="text-xs text-gray-400 truncate">{i.curso_code ? `curso: ${i.curso_code}` : i.url}</p>}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => setItemModal(i)} className="p-1.5 text-gray-400 hover:text-brand-gold"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => delItem(i.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CONFIG: bienvenida, whatsapp, zoom, onboarding */}
        {tab === 'config' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <div className="flex items-center gap-2 mb-2"><Settings className="w-5 h-5 text-brand-gold" /><h3 className="font-heading font-bold text-brand-dark">Bienvenida y accesos</h3></div>
            <Field label="Título de bienvenida"><input defaultValue={config.welcome_title || ''} onBlur={e => saveConfig({ welcome_title: e.target.value })} className={inputCls} placeholder="Bienvenida a tu espacio" /></Field>
            <Field label="Texto de bienvenida"><textarea defaultValue={config.welcome_text || ''} rows={3} onBlur={e => saveConfig({ welcome_text: e.target.value })} className={inputCls} /></Field>
            <Field label="Link del grupo de WhatsApp"><input defaultValue={config.whatsapp_url || ''} onBlur={e => saveConfig({ whatsapp_url: e.target.value })} className={inputCls} placeholder="https://chat.whatsapp.com/..." /></Field>
            <Field label="Link del Zoom del mes"><input defaultValue={config.zoom_url || ''} onBlur={e => saveConfig({ zoom_url: e.target.value })} className={inputCls} placeholder="https://zoom.us/..." /></Field>
            <Field label="Info del Zoom (fecha/hora)"><input defaultValue={config.zoom_text || ''} onBlur={e => saveConfig({ zoom_text: e.target.value })} className={inputCls} placeholder="Ej: Jueves 3 de julio, 19hs" /></Field>
            <Field label="Link del onboarding (ej: test del eneagrama)"><input defaultValue={config.onboarding_url || ''} onBlur={e => saveConfig({ onboarding_url: e.target.value })} className={inputCls} placeholder="#/enea-test-juridico o https://..." /></Field>
            <Field label="Texto del onboarding"><input defaultValue={config.onboarding_text || ''} onBlur={e => saveConfig({ onboarding_text: e.target.value })} className={inputCls} placeholder="Hacé tu test del eneagrama" /></Field>
            <p className="text-xs text-gray-400">Los cambios se guardan solos al salir de cada campo.</p>
          </div>
        )}

        {/* MIEMBROS: códigos de acceso */}
        {tab === 'miembros' && (
          <div>
            <div className="bg-brand-dark rounded-2xl p-5 mb-5 text-white">
              <div className="flex items-center gap-2 mb-1"><Users className="w-5 h-5 text-brand-gold" /><h3 className="font-heading font-bold">Link general de la comunidad</h3></div>
              <p className="text-sm text-gray-300 mb-4">Un link para todas las miembros. Al pagar la membresía, se los mandás.</p>
              {accesos.filter(a => a.is_general).length === 0
                ? <button onClick={() => addAcceso(true)} className="flex items-center gap-2 bg-brand-gold hover:bg-amber-600 text-white font-bold py-2.5 px-5 rounded-xl"><Plus className="w-5 h-5" /> Generar link general</button>
                : accesos.filter(a => a.is_general).map(a => (
                  <div key={a.id} className="flex items-center justify-between gap-3 bg-white/10 rounded-xl p-3">
                    <code className="text-brand-gold font-mono text-sm truncate">{a.code}</code>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => copyLink(a.code, 'comunidad')} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold ${copied === a.code ? 'bg-green-500/20 text-green-300' : 'bg-brand-gold text-white hover:bg-amber-600'}`}>{copied === a.code ? <CheckIcon className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}{copied === a.code ? '¡Copiado!' : 'Copiar link'}</button>
                      <button onClick={() => delAcceso(a.id)} className="p-1.5 text-gray-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
              <h3 className="font-heading font-bold text-brand-dark mb-1">Link individual (por miembro)</h3>
              <p className="text-sm text-gray-500 mb-4">Con nombre, para dar acceso a una persona puntual.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input value={memberName} onChange={e => setMemberName(e.target.value)} placeholder="Nombre de la miembro" className={inputCls + ' flex-1'} />
                <button onClick={() => addAcceso(false)} className="flex items-center justify-center gap-2 bg-brand-gold hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl"><Plus className="w-5 h-5" /> Generar</button>
              </div>
            </div>

            <div className="space-y-2">
              {accesos.filter(a => !a.is_general).map(a => (
                <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0"><p className="font-semibold text-brand-dark">{a.member_name || <span className="text-gray-400 italic">Sin nombre</span>}</p><p className="text-xs text-gray-400 flex items-center gap-1"><LinkIcon className="w-3 h-3" /> <code className="text-brand-gold font-mono">{a.code}</code></p></div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => copyLink(a.code, 'comunidad')} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold ${copied === a.code ? 'bg-green-50 text-green-600' : 'bg-brand-gold/10 text-brand-gold hover:bg-brand-gold/20'}`}>{copied === a.code ? <CheckIcon className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}{copied === a.code ? '¡Copiado!' : 'Copiar'}</button>
                    <button onClick={() => delAcceso(a.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal item */}
      {itemModal && (
        <Modal onClose={() => setItemModal(null)} title={itemModal.id ? 'Editar item' : 'Nuevo item'}>
          <Field label="Pilar">
            <div className="grid grid-cols-3 gap-2">
              {PILARES.map(p => (
                <button key={p.key} onClick={() => setItemModal({ ...itemModal, pillar: p.key })} className={`py-2 px-2 rounded-xl border-2 text-xs font-semibold ${itemModal.pillar === p.key ? 'border-brand-gold bg-brand-gold/10 text-brand-gold' : 'border-gray-200 text-gray-600'}`}>{p.label}</button>
              ))}
            </div>
          </Field>
          <Field label="Tipo">
            <div className="flex flex-wrap gap-2">
              {KINDS.map(k => (
                <button key={k.key} onClick={() => setItemModal({ ...itemModal, kind: k.key })} className={`py-1.5 px-3 rounded-lg border-2 text-xs font-medium ${itemModal.kind === k.key ? 'border-brand-gold bg-brand-gold/10 text-brand-gold' : 'border-gray-200 text-gray-600'}`}>{k.label}</button>
              ))}
            </div>
          </Field>
          <Field label="Título"><input autoFocus className={inputCls} value={itemModal.title || ''} onChange={e => setItemModal({ ...itemModal, title: e.target.value })} placeholder="Ej: Clase 1 — Tu eneatipo" /></Field>
          <Field label="Descripción (opcional)"><input className={inputCls} value={itemModal.description || ''} onChange={e => setItemModal({ ...itemModal, description: e.target.value })} /></Field>
          {itemModal.kind === 'curso'
            ? <Field label="Código del curso" hint="El código de acceso del curso (del Aula)"><input className={inputCls} value={itemModal.curso_code || ''} onChange={e => setItemModal({ ...itemModal, curso_code: e.target.value })} placeholder="Ej: K7H4M2QR" /></Field>
            : <Field label="Link" hint="Drive, PDF, test (#/enea-test-juridico), etc."><input className={inputCls} value={itemModal.url || ''} onChange={e => setItemModal({ ...itemModal, url: e.target.value })} placeholder="https://..." /></Field>}
          <button onClick={saveItem} disabled={!itemModal.title?.trim() || !itemModal.pillar} className="w-full bg-brand-gold hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl disabled:opacity-50">Guardar</button>
        </Modal>
      )}
    </div>
  );
};

const Field: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
  <div className="mb-4"><label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>{children}{hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}</div>
);

export default ComunidadAdmin;
