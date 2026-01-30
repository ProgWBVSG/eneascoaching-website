import React from 'react';

const LoadingScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-brand-beige z-50 flex flex-col items-center justify-center transition-opacity duration-500">
            <div className="relative">
                {/* Outer Ring */}
                <div className="w-24 h-24 border-4 border-brand-gold/30 rounded-full animate-pulse"></div>
                {/* Spinning Inner Ring */}
                <div className="absolute inset-0 w-24 h-24 border-4 border-t-brand-gold border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>

                {/* Center Logo/Icon Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-14 h-14 text-brand-gold animate-pulse" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="50" cy="50" r="40" className="opacity-50" />
                        <path d="M50 10 L85 69 L15 69 Z" />
                        <path d="M76 19 L64 85 L89 43 L24 19 L36 85 L11 43 Z" />
                    </svg>
                </div>
            </div>

            <div className="mt-8 text-center">
                <h2 className="font-heading font-bold text-brand-dark text-xl tracking-widest">ENEASCOACHING</h2>
                <p className="font-sans text-brand-gold text-sm uppercase tracking-[0.3em] mt-2 animate-pulse">Cargando...</p>
            </div>
        </div>
    );
};

export default LoadingScreen;
