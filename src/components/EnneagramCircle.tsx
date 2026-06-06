import React from 'react';
import { ENEATIPOS_DETALLE } from '../data/eneatipos-detalle';

interface Props {
  dominant: number;
  wing: number;
  size?: number;
}

// Diagrama clásico del Eneagrama con los 9 puntos sobre un círculo y
// las líneas internas (triángulo 9-3-6 y hexagrama 1-4-2-8-5-7).
const EnneagramCircle: React.FC<Props> = ({ dominant, wing, size = 360 }) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 36;

  // Posiciones: 9 al norte, resto en sentido horario cada 40°
  const positions = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => {
    const pos = n === 9 ? 0 : n;
    const angleDeg = -90 + pos * 40;
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      n,
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  });

  const getPos = (n: number) => positions.find(p => p.n === n)!;

  const triangleLines: [number, number][] = [[9, 3], [3, 6], [6, 9]];
  const hexagramLines: [number, number][] = [
    [1, 4], [4, 2], [2, 8], [8, 5], [5, 7], [7, 1],
  ];

  const dominantColor = ENEATIPOS_DETALLE[dominant]?.color || '#C5A059';
  const wingColor = ENEATIPOS_DETALLE[wing]?.color || '#C5A059';

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[320px] mx-auto" xmlns="http://www.w3.org/2000/svg">
      {/* Círculo exterior */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E5E0D5" strokeWidth="2" />

      {/* Líneas internas */}
      {[...triangleLines, ...hexagramLines].map(([a, b], i) => {
        const pa = getPos(a);
        const pb = getPos(b);
        const isDomLine = a === dominant || b === dominant;
        return (
          <line
            key={`l-${i}`}
            x1={pa.x} y1={pa.y}
            x2={pb.x} y2={pb.y}
            stroke={isDomLine ? dominantColor : '#E5E0D5'}
            strokeWidth={isDomLine ? 2 : 1.2}
            strokeOpacity={isDomLine ? 0.5 : 1}
          />
        );
      })}

      {/* Puntos del eneagrama */}
      {positions.map(p => {
        const isDom = p.n === dominant;
        const isWing = p.n === wing;
        const detalle = ENEATIPOS_DETALLE[p.n];
        const color = detalle?.color || '#C5A059';

        if (isDom) {
          return (
            <g key={p.n}>
              {/* Aura exterior */}
              <circle cx={p.x} cy={p.y} r="28" fill={color} fillOpacity="0.15" />
              <circle cx={p.x} cy={p.y} r="22" fill={color} fillOpacity="0.25" />
              {/* Punto principal */}
              <circle cx={p.x} cy={p.y} r="18" fill={color} stroke="white" strokeWidth="3" />
              <text
                x={p.x}
                y={p.y + 6}
                textAnchor="middle"
                fontSize="18"
                fontWeight="700"
                fill="white"
                fontFamily="Montserrat, sans-serif"
              >
                {p.n}
              </text>
            </g>
          );
        }
        if (isWing) {
          return (
            <g key={p.n}>
              <circle cx={p.x} cy={p.y} r="15" fill="white" stroke={wingColor} strokeWidth="2.5" />
              <text
                x={p.x}
                y={p.y + 5}
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                fill={wingColor}
                fontFamily="Montserrat, sans-serif"
              >
                {p.n}
              </text>
            </g>
          );
        }
        return (
          <g key={p.n}>
            <circle cx={p.x} cy={p.y} r="13" fill="white" stroke="#D5D2CC" strokeWidth="1.5" />
            <text
              x={p.x}
              y={p.y + 4}
              textAnchor="middle"
              fontSize="12"
              fontWeight="600"
              fill="#9B9690"
              fontFamily="Montserrat, sans-serif"
            >
              {p.n}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default EnneagramCircle;
