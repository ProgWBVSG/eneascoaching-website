import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, ChevronRight, ArrowLeft } from 'lucide-react';

interface FAQ {
    question: string;
    answer: string;
}

const BRAND_GOLD = '#C5A059';
const BRAND_DARK = '#1A1A1A';
const BRAND_BEIGE = '#F9F7F2';

const faqs: FAQ[] = [
    {
        question: '¿Qué es el Eneagrama?',
        answer:
            'El Eneagrama es un sistema milenario que describe 9 tipos de personalidad. Es una herramienta de autoconocimiento profundo que te permite entender tus patrones automáticos de pensamiento, emoción y comportamiento para poder transformarlos conscientemente.',
    },
    {
        question: '¿Qué es el método Eneascoaching?',
        answer:
            'Es la integración de Coaching Ontológico y Eneagrama, creada por Cecilia B. Sánchez. Aplicado con éxito a más de 1800 personas, te ayuda a descubrir tu esencia, transformar tus patrones y vivir la vida que realmente deseas.',
    },
    {
        question: '¿Qué mentorías ofrecen?',
        answer:
            'Ofrecemos 3 opciones:\n\n• Mentoría Grupal: 8 encuentros online (USD 55)\n• Mentoría Premium 1:1: 12 sesiones personalizadas (USD 850)\n• Diplomatura en Eneagrama: Formación certificada 6 meses (USD 1.500)',
    },
    {
        question: '¿La mentoría grupal es online?',
        answer:
            'Sí, la Mentoría Grupal de Liberación Personal es 100% online. Son 8 encuentros donde trabajaremos con Eneagrama y Coaching Ontológico para que aprendas a elegir en presencia y soltar patrones que ya no te sirven.',
    },
    {
        question: '¿Cómo agendo una reunión gratuita?',
        answer:
            'Podés agendar tu reunión gratuita de 15 minutos desde la página de Mentoría Premium, haciendo clic en "Agendar reunión gratuita de 15 minutos". También podés escribirnos por WhatsApp usando el botón verde de abajo.',
    },
    {
        question: '¿Quién es Cecilia?',
        answer:
            'Cecilia B. Sánchez es Coach Ontológica, Eneagramista y Abogada Eneatípica. Ha acompañado a más de 1800 personas en su proceso de transformación personal a través del método #Eneascoaching.',
    },
    {
        question: '¿Qué incluye la Diplomatura?',
        answer:
            'La Diplomatura en Eneagrama, Liderazgo y Vincularidad Sana es una formación certificada de 6 meses, 100% online, con 3 niveles progresivos. Incluye certificación privada ENEASCOACHING® y te prepara para facilitar y transformar vidas.',
    },
    {
        question: '¿Tienen contenido gratuito?',
        answer:
            'Sí, en la sección "Contenido Gratuito" encontrarás videos del canal de YouTube CeciliaEneasCoaching con material valioso sobre Eneagrama y desarrollo personal. ¡Es un gran punto de partida!',
    },
];

const FloatingAIAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ type: 'question' | 'answer'; text: string }[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [pulsing, setPulsing] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Stop pulse after 5 seconds
    useEffect(() => {
        const t = setTimeout(() => setPulsing(false), 5000);
        return () => clearTimeout(t);
    }, []);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!isOpen) return;
            if (panelRef.current && panelRef.current.contains(e.target as Node)) return;
            const btn = document.getElementById('ai-float-btn');
            if (btn && btn.contains(e.target as Node)) return;
            setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleSelectFAQ = (faq: FAQ) => {
        setMessages((prev) => [...prev, { type: 'question', text: faq.question }]);
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages((prev) => [...prev, { type: 'answer', text: faq.answer }]);
        }, 800 + Math.random() * 500);
    };

    const handleReset = () => setMessages([]);

    const showSuggestions = messages.length === 0;

    return (
        <>
            {/* ── Style tag for keyframe animations ── */}
            <style>{`
        @keyframes ai-ping {
          0%   { transform: scale(1); opacity: 0.4; }
          70%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes ai-dot-bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40%           { transform: translateY(-6px); }
        }
        .ai-ping-ring {
          animation: ai-ping 1.4s cubic-bezier(0.4,0,0.6,1) infinite;
        }
        .ai-dot { animation: ai-dot-bounce 1.2s ease-in-out infinite; }
        .ai-dot:nth-child(2) { animation-delay: 0.15s; }
        .ai-dot:nth-child(3) { animation-delay: 0.30s; }

        @keyframes ai-panel-in {
          from { opacity: 0; transform: scale(0.85) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .ai-panel-enter { animation: ai-panel-in 0.22s ease-out forwards; }
      `}</style>

            {/* ── Floating Button ── */}
            <div
                style={{
                    position: 'fixed',
                    bottom: '7rem',      /* 112px — well-separated above WhatsApp */
                    right: '1.5rem',    /* same column as WhatsApp */
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {/* Pulse ring */}
                {pulsing && !isOpen && (
                    <span
                        className="ai-ping-ring"
                        style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '50%',
                            border: `2px solid ${BRAND_GOLD}`,
                            pointerEvents: 'none',
                        }}
                    />
                )}

                <button
                    id="ai-float-btn"
                    onClick={() => setIsOpen((o) => !o)}
                    title="Asistente de preguntas frecuentes"
                    style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isOpen
                            ? BRAND_DARK
                            : `linear-gradient(135deg, ${BRAND_GOLD} 0%, #e5c55a 50%, ${BRAND_GOLD} 100%)`,
                        boxShadow: isOpen
                            ? '0 4px 16px rgba(0,0,0,0.3)'
                            : `0 4px 20px rgba(197,160,89,0.55)`,
                        transition: 'all 0.25s ease',
                        transform: isOpen ? 'scale(0.9)' : 'scale(1)',
                        color: '#fff',
                    }}
                    onMouseEnter={(e) => {
                        if (!isOpen) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = isOpen ? 'scale(0.9)' : 'scale(1)';
                    }}
                >
                    {isOpen ? <X size={22} /> : <Sparkles size={22} />}
                </button>
            </div>

            {/* ── Chat Panel ── */}
            {isOpen && (
                <div
                    ref={panelRef}
                    className="ai-panel-enter"
                    style={{
                        position: 'fixed',
                        bottom: 'calc(7rem + 56px + 12px)', /* above the button */
                        right: '1.5rem',
                        zIndex: 9998,
                        width: 'min(360px, calc(100vw - 2rem))',
                        height: 'min(480px, calc(100dvh - 14rem))',
                        background: '#ffffff',
                        borderRadius: '20px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
                        border: '1px solid #e5e7eb',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            background: BRAND_DARK,
                            padding: '14px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            flexShrink: 0,
                        }}
                    >
                        <div
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: `rgba(197,160,89,0.2)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            <Sparkles size={18} color={BRAND_GOLD} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ color: '#fff', fontWeight: 700, fontSize: '14px', margin: 0, fontFamily: 'Montserrat, sans-serif' }}>
                                Asistente ENEAS
                            </p>
                            <p style={{ color: '#9ca3af', fontSize: '11px', margin: 0 }}>Preguntas frecuentes</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px', lineHeight: 0 }}
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Body */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '14px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                        }}
                    >
                        {showSuggestions ? (
                            <>
                                {/* Welcome bubble */}
                                <div
                                    style={{
                                        background: BRAND_BEIGE,
                                        border: `1px solid rgba(197,160,89,0.25)`,
                                        borderRadius: '14px',
                                        padding: '12px 14px',
                                        fontSize: '13px',
                                        color: BRAND_DARK,
                                        lineHeight: 1.5,
                                        marginBottom: '4px',
                                    }}
                                >
                                    ¡Hola! 👋 Soy el asistente de <strong>Eneascoaching</strong>. Tocá una pregunta para que te ayude:
                                </div>

                                {/* FAQ chips */}
                                {faqs.map((faq, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSelectFAQ(faq)}
                                        style={{
                                            width: '100%',
                                            textAlign: 'left',
                                            padding: '10px 14px',
                                            borderRadius: '12px',
                                            background: '#fff',
                                            border: '1px solid #e5e7eb',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            fontSize: '13px',
                                            color: '#374151',
                                            fontWeight: 500,
                                            transition: 'all 0.15s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            const el = e.currentTarget as HTMLButtonElement;
                                            el.style.borderColor = BRAND_GOLD;
                                            el.style.background = BRAND_BEIGE;
                                            el.style.color = BRAND_DARK;
                                        }}
                                        onMouseLeave={(e) => {
                                            const el = e.currentTarget as HTMLButtonElement;
                                            el.style.borderColor = '#e5e7eb';
                                            el.style.background = '#fff';
                                            el.style.color = '#374151';
                                        }}
                                    >
                                        <span style={{ flex: 1 }}>{faq.question}</span>
                                        <ChevronRight size={14} style={{ color: BRAND_GOLD, flexShrink: 0 }} />
                                    </button>
                                ))}
                            </>
                        ) : (
                            <>
                                {/* Back link */}
                                <button
                                    onClick={handleReset}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: BRAND_GOLD,
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        padding: '2px 0',
                                        marginBottom: '4px',
                                    }}
                                >
                                    <ArrowLeft size={13} /> Ver todas las preguntas
                                </button>

                                {/* Messages */}
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            display: 'flex',
                                            justifyContent: msg.type === 'question' ? 'flex-end' : 'flex-start',
                                        }}
                                    >
                                        <div
                                            style={{
                                                maxWidth: '85%',
                                                padding: '10px 14px',
                                                borderRadius: msg.type === 'question'
                                                    ? '18px 18px 4px 18px'
                                                    : '18px 18px 18px 4px',
                                                background: msg.type === 'question' ? BRAND_GOLD : '#f3f4f6',
                                                color: msg.type === 'question' ? '#fff' : '#1f2937',
                                                fontSize: '13px',
                                                lineHeight: 1.55,
                                                whiteSpace: 'pre-line',
                                                border: msg.type === 'answer' ? '1px solid #e5e7eb' : 'none',
                                            }}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}

                                {/* Typing indicator */}
                                {isTyping && (
                                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                        <div
                                            style={{
                                                background: '#f3f4f6',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '18px 18px 18px 4px',
                                                padding: '10px 16px',
                                                display: 'flex',
                                                gap: '5px',
                                                alignItems: 'center',
                                            }}
                                        >
                                            {[0, 1, 2].map((i) => (
                                                <span
                                                    key={i}
                                                    className="ai-dot"
                                                    style={{
                                                        width: '7px',
                                                        height: '7px',
                                                        borderRadius: '50%',
                                                        background: '#9ca3af',
                                                        display: 'inline-block',
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            borderTop: '1px solid #f3f4f6',
                            padding: '10px 14px',
                            background: '#fafafa',
                            flexShrink: 0,
                            textAlign: 'center',
                            fontSize: '11px',
                            color: '#9ca3af',
                        }}
                    >
                        ¿Necesitás asistencia personalizada?{' '}
                        <a
                            href="https://wa.me/5493515632496"
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: BRAND_GOLD, fontWeight: 600, textDecoration: 'none' }}
                        >
                            Escribinos por WhatsApp
                        </a>
                    </div>
                </div>
            )}
        </>
    );
};

export default FloatingAIAssistant;
