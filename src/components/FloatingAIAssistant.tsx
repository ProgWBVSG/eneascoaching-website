import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, ChevronRight, ArrowLeft } from 'lucide-react';

interface FAQ {
    question: string;
    answer: string;
}

const faqs: FAQ[] = [
    {
        question: '¿Qué es el Eneagrama?',
        answer:
            'El Eneagrama es un sistema milenario que describe 9 tipos de personalidad. Es una herramienta poderosa de autoconocimiento profundo que te permite entender tus patrones automáticos de pensamiento, emoción y comportamiento, para poder transformarlos conscientemente.',
    },
    {
        question: '¿Qué es el método Eneascoaching?',
        answer:
            'Es la integración de Coaching Ontológico y Eneagrama, creada por Cecilia B. Sánchez. Este método ha sido aplicado con éxito a más de 1800 personas y te ayuda a descubrir tu esencia, transformar tus patrones y vivir la vida que realmente deseas.',
    },
    {
        question: '¿Qué mentorías ofrecen?',
        answer:
            'Ofrecemos 3 opciones:\n\n• Mentoría Grupal: 8 encuentros online de Liberación Personal (USD 55).\n• Mentoría Premium 1:1: 12 sesiones personalizadas, online o presencial (USD 850).\n• Diplomatura en Eneagrama: Formación certificada de 6 meses (USD 1,500).',
    },
    {
        question: '¿La mentoría grupal es online?',
        answer:
            'Sí, la Mentoría Grupal de Liberación Personal es 100% online. Son 8 encuentros donde trabajaremos con Eneagrama y Coaching Ontológico para que aprendas a elegir en presencia y soltar patrones que ya no te sirven.',
    },
    {
        question: '¿Cómo agendo una reunión gratuita?',
        answer:
            'Podés agendar tu reunión gratuita de 15 minutos desde la página de Mentoría Premium, haciendo clic en "Agendar reunión gratuita". También podés escribirnos directamente por WhatsApp al botón verde que está abajo a la derecha.',
    },
    {
        question: '¿Quién es Cecilia?',
        answer:
            'Cecilia B. Sánchez es Coach Ontológica, Eneagramista y Abogada Eneatípica. Ha acompañado a más de 1800 personas en su proceso de transformación personal a través del método #Eneascoaching, integrando la profundidad del Eneagrama con el poder del Coaching.',
    },
    {
        question: '¿Qué incluye la Diplomatura?',
        answer:
            'La Diplomatura en Eneagrama de la Personalidad, Liderazgo y Vincularidad Sana es una formación certificada de 6 meses, 100% online, con 3 niveles progresivos. Incluye certificación privada ENEASCOACHING® y te prepara para facilitar y transformar vidas.',
    },
    {
        question: '¿Tienen contenido gratuito?',
        answer:
            'Sí, en la sección "Contenido Gratuito" de nuestra web encontrarás videos del canal de YouTube CeciliaEneasCoaching con material valioso sobre Eneagrama y desarrollo personal. ¡Es un gran punto de partida para conocer el método!',
    },
];

const FloatingAIAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ type: 'question' | 'answer'; text: string }[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when new messages appear
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (isOpen && panelRef.current && !panelRef.current.contains(e.target as Node)) {
                const btn = document.getElementById('ai-assistant-btn');
                if (btn && !btn.contains(e.target as Node)) {
                    setIsOpen(false);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleSelectFAQ = (faq: FAQ) => {
        setMessages((prev) => [...prev, { type: 'question', text: faq.question }]);
        setIsTyping(true);

        // Simulated typing delay
        setTimeout(() => {
            setIsTyping(false);
            setMessages((prev) => [...prev, { type: 'answer', text: faq.answer }]);
        }, 800 + Math.random() * 600);
    };

    const handleReset = () => {
        setMessages([]);
    };

    const showSuggestions = messages.length === 0;

    return (
        <>
            {/* Floating Button */}
            <button
                id="ai-assistant-btn"
                onClick={() => setIsOpen((o) => !o)}
                className={`
          fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full shadow-xl
          flex items-center justify-center
          transition-all duration-300 ease-in-out
          ${isOpen
                        ? 'bg-brand-dark text-white scale-90'
                        : 'bg-gradient-to-br from-brand-gold to-yellow-600 text-white hover:scale-110 hover:shadow-2xl'
                    }
        `}
                aria-label="Asistente de preguntas frecuentes"
                style={{ filter: isOpen ? 'none' : 'drop-shadow(0 0 8px rgba(197,160,89,0.5))' }}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                {/* Pulse ring when closed */}
                {!isOpen && (
                    <span className="absolute inset-0 rounded-full border-2 border-brand-gold animate-ping opacity-30" />
                )}
            </button>

            {/* Chat Panel */}
            <div
                ref={panelRef}
                className={`
          fixed z-50 bg-white rounded-2xl shadow-2xl border border-gray-200
          flex flex-col overflow-hidden
          transition-all duration-300 ease-in-out origin-bottom-right
          ${isOpen
                        ? 'opacity-100 scale-100 pointer-events-auto'
                        : 'opacity-0 scale-75 pointer-events-none'
                    }
        `}
                style={{
                    /* Desktop: fixed size, positioned above the button */
                    bottom: 'calc(6rem + 4.5rem)',
                    right: '1.5rem',
                    width: 'min(360px, calc(100vw - 2rem))',
                    height: 'min(480px, calc(100dvh - 12rem))',
                }}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-brand-dark to-gray-900 text-white px-5 py-4 flex items-center gap-3 flex-shrink-0">
                    <div className="w-9 h-9 rounded-full bg-brand-gold/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-brand-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-bold text-sm leading-tight">Asistente ENEAS</h3>
                        <p className="text-[11px] text-gray-400 leading-tight">Preguntas frecuentes</p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                        aria-label="Cerrar asistente"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: 'thin' }}>
                    {showSuggestions ? (
                        <>
                            {/* Welcome */}
                            <div className="bg-brand-beige border border-brand-gold/20 rounded-xl px-4 py-3 mb-2">
                                <p className="text-sm text-brand-dark font-medium leading-snug">
                                    ¡Hola! 👋 Soy el asistente de <strong>Eneascoaching</strong>. Tocá una pregunta para que te ayude:
                                </p>
                            </div>

                            {/* FAQ Chips */}
                            <div className="space-y-2">
                                {faqs.map((faq, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSelectFAQ(faq)}
                                        className="
                      w-full text-left px-4 py-3 rounded-xl text-sm
                      bg-white border border-gray-200
                      hover:border-brand-gold hover:bg-brand-beige
                      hover:shadow-sm
                      transition-all duration-200
                      flex items-center gap-2 group
                    "
                                    >
                                        <span className="flex-1 text-gray-700 group-hover:text-brand-dark font-medium">
                                            {faq.question}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-gold flex-shrink-0 transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Back button */}
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-1 text-xs text-brand-gold hover:text-brand-dark transition-colors mb-1"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Ver todas las preguntas
                            </button>

                            {/* Messages */}
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.type === 'question' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`
                      max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line
                      ${msg.type === 'question'
                                                ? 'bg-brand-gold text-white rounded-br-md'
                                                : 'bg-gray-100 text-gray-800 rounded-bl-md border border-gray-200'
                                            }
                    `}
                                        style={{ animationFillMode: 'backwards' }}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}

                            {/* Typing indicator */}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 border-t border-gray-100 px-4 py-2.5 bg-gray-50/80">
                    <p className="text-[10px] text-gray-400 text-center leading-tight">
                        ¿Necesitás asistencia personalizada?{' '}
                        <a
                            href="https://wa.me/5493515632496"
                            target="_blank"
                            rel="noreferrer"
                            className="text-brand-gold hover:underline font-medium"
                        >
                            Escribinos por WhatsApp
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
};

export default FloatingAIAssistant;
