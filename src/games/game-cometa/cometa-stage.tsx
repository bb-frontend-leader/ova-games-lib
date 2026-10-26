import { useId } from 'react';

import { BOW_COLORS } from './lib/constant';
import { HAND, kitePoint, RULER, stringPath, VIEW_H, VIEW_W } from './lib/layout';

import css from './game-cometa.module.css';

interface Props {
  svgRef?: React.Ref<SVGSVGElement>;
  /** Descripción del escenario para lectores de pantalla. */
  label: string;
  /** Altura de la cometa, de 0 (a ras de la colina) a 1 (en la cima). */
  height: number;
  /** Número de preguntas: marca los peldaños de la regla de altura. */
  total: number;
  /** Lazos que lleva la cola. */
  bows: number;
}

/** Cola con un lazo por cada acierto a la primera: onda suave hacia abajo con los lazos sobre ella. */
const Tail: React.FC<{ bows: number }> = ({ bows }) => {
  const steps = Math.max(2, bows + 1);
  const points = Array.from({ length: steps }, (_, i) => ({ x: i % 2 ? 9 : -9, y: 36 + (i + 1) * 26 }));
  let d = 'M0 36';
  let prev = { x: 0, y: 36 };

  points.forEach((p) => {
    d += `Q${(prev.x + p.x) / 2 + (p.x > prev.x ? -10 : 10)} ${(prev.y + p.y) / 2} ${p.x} ${p.y}`;
    prev = p;
  });

  return (
    <g data-tail="">
      <path d={d} fill="none" stroke="#5a3b1c" strokeWidth="2.500" strokeLinecap="round" />
      {points.slice(0, bows).map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y})`} className={css.bow} data-bow="">
          <path
            d="M0 0-11-8v16ZM0 0 11-8v16Z"
            fill={BOW_COLORS[i % BOW_COLORS.length]}
            stroke="#3d2a14"
            strokeWidth="1.500"
            strokeLinejoin="round"
          />
          <circle r="3" fill="#ffffff" stroke="#3d2a14" strokeWidth="1.200" />
        </g>
      ))}
    </g>
  );
};

/**
 * El cielo de agosto: una colina con quien sostiene el carrete, el hilo, la cometa de cuatro colores con su cola de
 * lazos y, a la derecha, la regla de altura con un peldaño por pregunta y la cima arriba.
 */
export const CometaStage: React.FC<Props> = ({ svgRef, label, height, total, bows }) => {
  const uid = useId().replace(/:/g, '');
  const k = kitePoint(height);
  const steps = Math.min(Math.max(total, 1), 12);
  const markY = RULER.y0 + (RULER.y1 - RULER.y0) * height;

  return (
    <svg
      ref={svgRef}
      className={css.stage}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4aa8f2" />
          <stop offset="0.75" stopColor="#bfe6ff" />
          <stop offset="1" stopColor="#e6f6ff" />
        </linearGradient>
        <linearGradient id={`${uid}-hill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7ccf55" />
          <stop offset="1" stopColor="#3f9140" />
        </linearGradient>
      </defs>

      <rect width={VIEW_W} height={VIEW_H} fill={`url(#${uid}-sky)`} />

      {/* Sol */}
      <circle cx="64" cy="62" r="46" fill="#fff3a8" opacity="0.35" />
      <circle cx="64" cy="62" r="28" fill="#ffe14d" />

      {/* Nubes a la deriva */}
      <g className={css.cloud} fill="#ffffff" opacity="0.92">
        <ellipse cx="190" cy="92" rx="44" ry="15" />
        <ellipse cx="168" cy="84" rx="22" ry="14" />
        <ellipse cx="212" cy="82" rx="26" ry="16" />
      </g>
      <g className={css['cloud-slow']} fill="#ffffff" opacity="0.8">
        <ellipse cx="500" cy="146" rx="40" ry="13" />
        <ellipse cx="482" cy="138" rx="20" ry="12" />
        <ellipse cx="520" cy="136" rx="24" ry="14" />
      </g>
      <g className={css.cloud} fill="#ffffff" opacity="0.7">
        <ellipse cx="318" cy="38" rx="34" ry="11" />
        <ellipse cx="304" cy="32" rx="16" ry="10" />
        <ellipse cx="334" cy="31" rx="20" ry="11" />
      </g>

      {/* Regla de altura: un peldaño por pregunta y la cima arriba */}
      <g aria-hidden="true">
        <path
          d={`M${RULER.x} ${RULER.y0}V${RULER.y1}`}
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.85"
        />
        {Array.from({ length: steps + 1 }, (_, i) => {
          const y = RULER.y0 + ((RULER.y1 - RULER.y0) * i) / steps;

          return (
            <path
              key={i}
              d={`M${RULER.x - 9} ${y.toFixed(1)}h18`}
              stroke="#2a6fb0"
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}
        <path
          d={`M${RULER.x} ${RULER.y1 - 4}v-18l20 7-20 7`}
          fill="#ff4d6d"
          stroke="#8a1a33"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <g className={css.marker} style={{ transform: `translateY(${markY.toFixed(1)}px)` }}>
          <path
            d={`M${RULER.x - 14} 0l-16-9v18Z`}
            fill="#ffd23f"
            stroke="#8a6a00"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>
      </g>

      {/* Colinas y quien sostiene el carrete */}
      <path d="M0 400V318Q130 282 270 326T640 330V400Z" fill="#5fb347" />
      <path d="M0 400V344Q150 320 310 352T640 356V400Z" fill={`url(#${uid}-hill)`} />
      <g transform={`translate(${HAND.x - 22} ${HAND.y + 6})`}>
        <ellipse cx="22" cy="46" rx="22" ry="5" fill="#000000" opacity="0.18" />
        <rect x="12" y="20" width="20" height="28" rx="7" fill="#ff7043" />
        <circle cx="22" cy="12" r="11" fill="#e0a97a" />
        <path d="M11 10a11 11 0 0 1 22 0Z" fill="#3b2a1a" />
        <path d="M30 24 40 8" stroke="#e0a97a" strokeWidth="6" strokeLinecap="round" />
        <circle cx="40" cy="6" r="6" fill="#ffd23f" stroke="#8a6a00" strokeWidth="2" />
      </g>

      {/* Hilo y cometa: los mueve el juego (d y transform) y React escribe el valor final */}
      <path
        data-string=""
        d={stringPath(height)}
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.95"
      />
      <g data-kite="" transform={`translate(${k.x.toFixed(1)} ${k.y.toFixed(1)})`}>
        <g className={css.sway}>
          <Tail bows={bows} />
          <path d="M0-38 26-4 0-4Z" fill="#ff4d6d" />
          <path d="M0-38-26-4H0Z" fill="#ffd23f" />
          <path d="M0 36 26-4H0Z" fill="#3a86ff" />
          <path d="M0 36-26-4H0Z" fill="#06d6a0" />
          <path d="M0-38 26-4 0 36-26-4Z" fill="none" stroke="#3d2a14" strokeWidth="2.500" strokeLinejoin="round" />
          <path d="M0-38V36M-26-4H26" stroke="#3d2a14" strokeWidth="2" opacity="0.55" />
        </g>
      </g>
    </svg>
  );
};
