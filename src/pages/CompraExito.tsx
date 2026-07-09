import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Loader2, ArrowRight, MessageCircle, Copy, Check } from 'lucide-react';

const WHATSAPP = '5493515632496';

const CompraExito: React.FC = () => {
  const { ref } = useParams<{ ref: string }>();
  const [status, setStatus] = useState<'checking' | 'approved' | 'pending'>('checking');
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const tries = useRef(0);

  useEffect(() => {
    let mounted = true;
    // MercadoPago agrega ?payment_id=... al volver; lo usamos para confirmar más rápido
    const params = new URLSearchParams(window.location.hash.split('?')[1] || window.location.search);
    const paymentId = params.get('payment_id') || params.get('collection_id') || '';

    const poll = async () => {
      try {
        const url = `/api/cursos?action=pay-status&ref=${encodeURIComponent(ref || '')}${paymentId ? `&payment_id=${paymentId}` : ''}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!mounted) return;
        if (data.status === 'approved' && data.code) { setCode(data.code); setStatus('approved'); return; }
        tries.current += 1;
        if (tries.current >= 12) { setStatus('pending'); return; } // ~30s
        setTimeout(poll, 2500);
      } catch {
        tries.current += 1;
        if (tries.current >= 12) { if (mounted) setStatus('pending'); return; }
        setTimeout(poll, 2500);
      }
    };
    poll();
    return () => { mounted = false; };
  }, [ref]);

  const cursoLink = code ? `${window.location.origin}/#/curso/${code}` : '';
  const copy = async () => {
    try { await navigator.clipboard.writeText(cursoLink); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* noop */ }
  };

  return (
    <div className="min-h-screen bg-brand-beige flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        {status === 'checking' && (
          <>
            <Loader2 className="w-12 h-12 text-brand-gold animate-spin mx-auto mb-5" />
            <h1 className="font-heading font-bold text-2xl text-brand-dark mb-2">Confirmando tu pago...</h1>
            <p className="text-gray-500 text-sm">Un segundo, estamos activando tu acceso. No cierres esta página.</p>
          </>
        )}

        {status === 'approved' && (
          <>
            <div className="w-20 h-20 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-brand-gold" />
            </div>
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-brand-dark mb-2">¡Listo, ya es tuyo! 🎉</h1>
            <p className="text-gray-600 text-sm sm:text-base mb-6">Tu compra se confirmó. Entrá al curso cuando quieras con este acceso.</p>

            <a href={`#/curso/${code}`}
              className="w-full flex items-center justify-center gap-2 bg-brand-gold hover:bg-amber-600 text-white font-bold py-4 rounded-xl transition-colors min-h-[56px] text-base mb-3">
              Entrar al curso <ArrowRight className="w-5 h-5" />
            </a>

            <div className="bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-between gap-2">
              <code className="text-xs text-gray-500 truncate">{cursoLink}</code>
              <button onClick={copy} className={`shrink-0 flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg ${copied ? 'bg-green-50 text-green-600' : 'bg-brand-gold/10 text-brand-gold'}`}>
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}{copied ? '¡Copiado!' : 'Copiar'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3">💡 Guardá este link — es tu acceso al curso.</p>
          </>
        )}

        {status === 'pending' && (
          <>
            <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-amber-400" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-brand-dark mb-2">Estamos procesando tu pago</h1>
            <p className="text-gray-600 text-sm mb-6">A veces MercadoPago tarda unos minutos. Apenas se confirme, tu acceso queda listo. Si ya pagaste y no lo ves, escribinos y lo resolvemos al toque.</p>
            <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola! Ya pagué un curso y quiero mi acceso 🙌')}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-6 rounded-xl">
              <MessageCircle className="w-5 h-5" /> Escribir por WhatsApp
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default CompraExito;
