import React, { useState, useEffect, useCallback } from 'react';
import { ENEATIPOS } from '../data/eneatipos';
import { AFIRMACIONES } from '../data/afirmaciones';
import { Lock, LogOut, RefreshCw, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

type TestKind = 'juridico' | 'completo';

interface Submission {
  id: number;
  name: string;
  email?: string | null;
  dominant_type: number;
  type1_total: number;
  type2_total: number;
  type3_total: number;
  type4_total: number;
  type5_total: number;
  type6_total: number;
  type7_total: number;
  type8_total: number;
  type9_total: number;
  created_at: string;
}

interface JuridicoDetail extends Submission {
  type1_selected: string[]; type2_selected: string[]; type3_selected: string[];
  type4_selected: string[]; type5_selected: string[]; type6_selected: string[];
  type7_selected: string[]; type8_selected: string[]; type9_selected: string[];
}

interface CompletoDetail extends Submission {
  responses: number[];
  date_of_birth?: string | null;
  age?: number | null;
  gender?: string | null;
  marital_status?: string | null;
  profession?: string | null;
  zodiac_sign?: string | null;
}

const SIGNO_SIMBOLOS: Record<string, string> = {
  'Aries': '♈', 'Tauro': '♉', 'Géminis': '♊', 'Cáncer': '♋',
  'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Escorpio': '♏',
  'Sagitario': '♐', 'Capricornio': '♑', 'Acuario': '♒', 'Piscis': '♓',
};

function formatDateAR(iso?: string | null): string {
  if (!iso) return '—';
  const [y, m, d] = iso.split('T')[0].split('-');
  return `${d}/${m}/${y}`;
}

const STORAGE_KEY = 'enea_admin_token';

const ENDPOINTS: Record<TestKind, { list: string; detail: (id: number) => string }> = {
  juridico: {
    list: '/api/enea-submissions',
    detail: (id) => `/api/enea-submission?id=${id}`,
  },
  completo: {
    list: '/api/enea-completo-submissions',
    detail: (id) => `/api/enea-completo-submission?id=${id}`,
  },
};

const Admin: React.FC = () => {
  const [token, setToken] = useState(() => sessionStorage.getItem(STORAGE_KEY) || '');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState<TestKind>('juridico');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<JuridicoDetail | CompletoDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchSubmissions = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setSelectedId(null);
    setDetail(null);
    try {
      const res = await fetch(ENDPOINTS[tab].list, { headers: { 'x-admin-token': token } });
      if (res.status === 401) {
        sessionStorage.removeItem(STORAGE_KEY);
        setToken('');
        return;
      }
      const data = await res.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, [token, tab]);

  useEffect(() => { if (token) fetchSubmissions(); }, [token, fetchSubmissions]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/enea-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) { setLoginError(data.error || 'Error al iniciar sesión'); return; }
      sessionStorage.setItem(STORAGE_KEY, data.token);
      setToken(data.token);
    } catch {
      setLoginError('No se pudo conectar al servidor');
    }
  };

  const handleSelectRow = async (id: number) => {
    if (selectedId === id) { setSelectedId(null); setDetail(null); return; }
    setSelectedId(id); setDetail(null); setLoadingDetail(true);
    try {
      const res = await fetch(ENDPOINTS[tab].detail(id), { headers: { 'x-admin-token': token } });
      const data = await res.json();
      setDetail(data);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleDelete = async (id: number) => {
    await fetch(ENDPOINTS[tab].detail(id), { method: 'DELETE', headers: { 'x-admin-token': token } });
    setDeleteConfirm(null);
    if (selectedId === id) { setSelectedId(null); setDetail(null); }
    fetchSubmissions();
  };

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setToken(''); setSubmissions([]); setDetail(null); setSelectedId(null);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const getTypeTotals = (sub: Submission) =>
    [sub.type1_total, sub.type2_total, sub.type3_total,
     sub.type4_total, sub.type5_total, sub.type6_total,
     sub.type7_total, sub.type8_total, sub.type9_total];

  const getMaxTotal = (sub: Submission) => Math.max(...getTypeTotals(sub), 1);

  // ── Login ────────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7 text-brand-gold" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-white mb-1">Panel de Control</h1>
            <p className="text-gray-400 text-sm">ENEA-TEST · Eneascoaching</p>
          </div>
          <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
            <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setLoginError(''); }}
              placeholder="••••••••"
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-gold"
              autoFocus
            />
            {loginError && <p className="text-red-400 text-sm mt-2">{loginError}</p>}
            <button type="submit" className="w-full mt-4 bg-brand-gold hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-colors">
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Panel ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-brand-dark text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-brand-gold text-xs font-bold tracking-widest uppercase">Eneascoaching</p>
          <h1 className="font-heading font-bold text-base sm:text-lg truncate">Panel de Control</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-gray-400 text-sm hidden sm:block">
            {submissions.length} {submissions.length === 1 ? 'respuesta' : 'respuestas'}
          </span>
          <button onClick={fetchSubmissions} className="p-2 text-gray-400 hover:text-white" title="Actualizar">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex gap-1">
          <button
            onClick={() => setTab('juridico')}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
              tab === 'juridico'
                ? 'border-brand-gold text-brand-gold'
                : 'border-transparent text-gray-500 hover:text-brand-dark'
            }`}
          >
            Test Jurídico
          </button>
          <button
            onClick={() => setTab('completo')}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
              tab === 'completo'
                ? 'border-brand-gold text-brand-gold'
                : 'border-transparent text-gray-500 hover:text-brand-dark'
            }`}
          >
            Test Completo
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
        {loading && <div className="text-center py-20 text-gray-400">Cargando...</div>}

        {!loading && submissions.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Aún no hay respuestas registradas.</p>
            <p className="text-gray-300 text-sm mt-1">Compartí el link del test para recibir respuestas.</p>
          </div>
        )}

        {!loading && submissions.length > 0 && (
          <div className="space-y-3">
            {submissions.map(sub => {
              const totals = getTypeTotals(sub);
              const max = getMaxTotal(sub);
              const isOpen = selectedId === sub.id;
              const subtitle = ENEATIPOS[sub.dominant_type - 1]?.subtitle;

              return (
                <div key={sub.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                  {/* Row header */}
                  <button onClick={() => handleSelectRow(sub.id)} className="w-full text-left px-4 sm:px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold font-heading font-bold text-sm shrink-0">
                          E{sub.dominant_type}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-brand-dark truncate">{sub.name}</p>
                          {sub.email && <p className="text-xs text-gray-500 truncate">{sub.email}</p>}
                          <p className="text-xs text-gray-400">{formatDate(sub.created_at)}</p>
                        </div>
                      </div>

                      <div className="hidden sm:flex items-end gap-0.5 h-6">
                        {totals.map((t, i) => (
                          <div
                            key={i}
                            className={`w-3 rounded-sm ${i + 1 === sub.dominant_type ? 'bg-brand-gold' : 'bg-gray-200'}`}
                            style={{ height: `${Math.max(4, (t / max) * 24)}px` }}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-medium text-brand-gold bg-brand-gold/10 px-2 py-1 rounded-full hidden sm:inline">
                          Tipo {sub.dominant_type}{subtitle ? ` · ${subtitle}` : ''}
                        </span>
                        {isOpen
                          ? <ChevronUp className="w-4 h-4 text-gray-400" />
                          : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </div>
                    </div>
                  </button>

                  {/* Detail */}
                  {isOpen && (
                    <div className="border-t border-gray-100 px-4 sm:px-6 py-5">
                      {loadingDetail && !detail && (
                        <div className="text-center py-8 text-gray-400 text-sm">Cargando detalle...</div>
                      )}

                      {detail && detail.id === sub.id && tab === 'juridico' && (
                        <JuridicoDetailView detail={detail as JuridicoDetail} />
                      )}
                      {detail && detail.id === sub.id && tab === 'completo' && (
                        <CompletoDetailView detail={detail as CompletoDetail} />
                      )}

                      <div className="flex justify-end pt-4">
                        {deleteConfirm === sub.id ? (
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">¿Eliminar esta respuesta?</span>
                            <button onClick={() => handleDelete(sub.id)} className="text-sm text-red-500 hover:text-red-700 font-medium">
                              Sí, eliminar
                            </button>
                            <button onClick={() => setDeleteConfirm(null)} className="text-sm text-gray-400 hover:text-gray-600">
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirm(sub.id)} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                            Eliminar
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Detalle Test Jurídico (palabras seleccionadas) ─────────────────────
const JuridicoDetailView: React.FC<{ detail: JuridicoDetail }> = ({ detail }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {ENEATIPOS.map(tipo => {
      const key = `type${tipo.num}_selected` as keyof JuridicoDetail;
      const selected = (detail[key] as string[]) || [];
      const totalKey = `type${tipo.num}_total` as keyof JuridicoDetail;
      const total = (detail[totalKey] as number) || 0;
      const isDominant = tipo.num === detail.dominant_type;
      return (
        <div key={tipo.num} className={`rounded-xl p-4 ${isDominant ? 'bg-brand-gold/10 border-2 border-brand-gold' : 'bg-gray-50 border border-gray-100'}`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className={`font-heading font-bold text-sm ${isDominant ? 'text-brand-gold' : 'text-brand-dark'}`}>{tipo.title}</p>
              <p className="text-xs text-gray-500">{tipo.subtitle}</p>
            </div>
            <span className={`font-bold text-lg ${isDominant ? 'text-brand-gold' : 'text-gray-400'}`}>{total}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tipo.words.map(word => (
              <span key={word} className={`text-xs px-2 py-1 rounded-full ${
                selected.includes(word)
                  ? (isDominant ? 'bg-brand-gold text-white font-medium' : 'bg-brand-dark text-white font-medium')
                  : 'bg-white text-gray-400 border border-gray-200'
              }`}>
                {word}
              </span>
            ))}
          </div>
        </div>
      );
    })}
  </div>
);

// ── Detalle Test Completo (datos personales + afirmaciones agrupadas) ──
const CompletoDetailView: React.FC<{ detail: CompletoDetail }> = ({ detail }) => {
  const markedSet = new Set(detail.responses || []);
  const simbolo = detail.zodiac_sign ? SIGNO_SIMBOLOS[detail.zodiac_sign] : null;

  return (
    <div className="space-y-4">

      {/* Datos personales */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
        {detail.email && (
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Email</p>
            <p className="text-brand-dark truncate" title={detail.email}>{detail.email}</p>
          </div>
        )}
        {detail.date_of_birth && (
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Nacimiento</p>
            <p className="text-brand-dark">
              {formatDateAR(detail.date_of_birth)}
              {detail.age != null && <span className="text-gray-500"> · {detail.age} años</span>}
            </p>
          </div>
        )}
        {detail.zodiac_sign && (
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Signo</p>
            <p className="text-brand-dark flex items-center gap-1.5">
              {simbolo && <span className="text-lg">{simbolo}</span>}
              {detail.zodiac_sign}
            </p>
          </div>
        )}
        {detail.gender && (
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Sexo</p>
            <p className="text-brand-dark">{detail.gender}</p>
          </div>
        )}
        {detail.marital_status && (
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Estado civil</p>
            <p className="text-brand-dark">{detail.marital_status}</p>
          </div>
        )}
        {detail.profession && (
          <div>
            <p className="text-xs text-gray-400 uppercase font-semibold">Profesión</p>
            <p className="text-brand-dark">{detail.profession}</p>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600">
        Total marcadas: <span className="font-bold text-brand-dark">{detail.responses?.length || 0}</span> de {AFIRMACIONES.length}
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[1,2,3,4,5,6,7,8,9].map(typeNum => {
          const tipo = ENEATIPOS[typeNum - 1];
          const totalKey = `type${typeNum}_total` as keyof CompletoDetail;
          const total = (detail[totalKey] as number) || 0;
          const isDominant = typeNum === detail.dominant_type;
          const afirmsForType = AFIRMACIONES.filter(a => a.type === typeNum && markedSet.has(a.num));
          return (
            <div key={typeNum} className={`rounded-xl p-4 ${isDominant ? 'bg-brand-gold/10 border-2 border-brand-gold' : 'bg-gray-50 border border-gray-100'}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className={`font-heading font-bold text-sm ${isDominant ? 'text-brand-gold' : 'text-brand-dark'}`}>
                    {tipo?.title || `Tipo ${typeNum}`}
                  </p>
                  <p className="text-xs text-gray-500">{tipo?.subtitle}</p>
                </div>
                <span className={`font-bold text-lg ${isDominant ? 'text-brand-gold' : 'text-gray-400'}`}>
                  {total} / 30
                </span>
              </div>
              {afirmsForType.length > 0 ? (
                <ul className="space-y-1.5">
                  {afirmsForType.map(a => (
                    <li key={a.num} className="text-xs text-gray-700 flex gap-2">
                      <span className="text-gray-400 shrink-0">#{a.num}</span>
                      <span>{a.text}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400 italic">Sin afirmaciones marcadas para este tipo.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Admin;
