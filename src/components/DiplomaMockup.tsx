import React from 'react';

// Réplica del diploma de la Diplomatura, en perspectiva, con la medalla apoyada encima.
// Cuando estén las fotos reales (medalla, lapicera, agenda) se reemplazan los elementos dibujados.

const serif = { fontFamily: "'Cormorant Garamond', Georgia, serif" };

const Eneagrama: React.FC<{ className?: string; stroke?: string }> = ({ className, stroke = 'currentColor' }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" stroke={stroke} strokeWidth="3">
    <circle cx="100" cy="100" r="94" />
    <polygon points="100,6 181.4,147 18.6,147" />
    <polygon points="160.4,28 132.1,188.3 192.5,83.7 39.6,28 67.9,188.3 7.5,83.7" />
  </svg>
);

const DiplomaMockup: React.FC = () => (
  <div className="relative w-full max-w-[560px] mx-auto py-6" style={{ perspective: '1400px' }}>
    {/* Diploma */}
    <div
      className="relative w-full aspect-[1.414] rounded-[3px] transition-transform duration-700 ease-out hover:[transform:rotateX(4deg)_rotateY(-6deg)_rotateZ(-1deg)]"
      style={{
        transform: 'rotateX(14deg) rotateY(-16deg) rotateZ(-5deg)',
        transformStyle: 'preserve-3d',
        background:
          'radial-gradient(circle at 30% 20%, #fffdf8 0%, #f6f1e7 55%, #ece4d3 100%)',
        boxShadow: '0 40px 60px -20px rgba(0,0,0,0.65), 0 18px 24px -12px rgba(0,0,0,0.45)',
      }}
    >
      {/* Marco dorado */}
      <div className="absolute inset-[4%] border-2 border-[#b8902f]" />
      {/* Eneagrama en la esquina */}
      <div className="absolute -top-[2%] -right-[2%] w-[24%] aspect-square rounded-full border-[6px] border-[#c9a24a]/80 bg-[#f6f1e7] overflow-hidden">
        <Eneagrama className="w-full h-full p-[12%] text-[#3a3a3a]" />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[10%]">
        <p className="text-[#2b2b2b] leading-none" style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(12px, 3.2vw, 20px)' }}>Cecilia B Sánchez</p>
        <p className="mt-[1.5%] text-[#1f1f1f] font-medium tracking-[0.35em]" style={{ fontSize: 'clamp(9px, 2.4vw, 15px)' }}>ENEASCOACHING</p>
        <p className="mt-[4%] text-[#b8902f] tracking-[0.3em]" style={{ ...serif, fontSize: 'clamp(6px, 1.5vw, 10px)' }}>ESTE CERTIFICADO RECONOCE QUE</p>
        <p className="mt-[2%] text-[#7a5a2e] font-heading font-bold leading-none" style={{ fontSize: 'clamp(16px, 4.6vw, 30px)' }}>TU NOMBRE AQUÍ</p>
        <div className="mt-[1.5%] h-px w-[70%] bg-[#7a1f4a]/60" />
        <p className="mt-[2.5%] text-[#b8902f] tracking-[0.3em]" style={{ ...serif, fontSize: 'clamp(6px, 1.5vw, 10px)' }}>HA COMPLETADO EXITOSAMENTE LA</p>
        <p className="mt-[2%] text-[#7a5a2e] leading-tight" style={{ fontSize: 'clamp(9px, 2.5vw, 16px)' }}>DIPLOMATURA DE ENEAGRAMA<br />LIDERAZGO Y VÍNCULOS CONSCIENTES</p>
        <p className="mt-[5%] text-[#7a1f4a] tracking-wider" style={{ ...serif, fontSize: 'clamp(7px, 1.7vw, 11px)' }}>CECILIA BEATRIZ SÁNCHEZ</p>
      </div>
    </div>

    {/* Medalla apoyada sobre el diploma */}
    <div
      className="absolute bottom-0 left-[2%] w-[24%] aspect-square rounded-full flex items-center justify-center"
      style={{
        background: 'radial-gradient(circle at 32% 28%, #fff1c2 0%, #e2b75a 32%, #b8862a 65%, #8a6118 100%)',
        boxShadow: '0 14px 22px -6px rgba(0,0,0,0.6), inset 0 0 0 4px rgba(255,240,200,0.35)',
        transform: 'rotate(-12deg)',
      }}
    >
      <Eneagrama className="w-[68%] h-[68%]" stroke="#6b4a12" />
    </div>
  </div>
);

export default DiplomaMockup;
