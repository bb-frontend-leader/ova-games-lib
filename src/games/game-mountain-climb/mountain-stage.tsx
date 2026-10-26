import { useId } from 'react';

import { isCamp, nodePoint, trailPath, VIEW_H, VIEW_W } from './lib/layout';

import css from './game-mountain-climb.module.css';

interface Props {
  /** Tramos de la montaña (la cumbre es el tramo `total`). */
  total: number;
  /** Tramo en el que está el escalador. */
  pos: number;
  /** Texto para lectores de pantalla: el dibujo es solo visual. */
  label: string;
  /** El grupo del escalador: quien lo usa lo mueve entre tramos (atributo `transform`). */
  climberRef?: React.Ref<SVGGElement>;
}

/** Copos de nieve: [x, y, radio, retraso (s)]. */
const SNOW: [number, number, number, number][] = [
  [30, 40, 1.6, 0],
  [74, 110, 1.3, 1.2],
  [118, 20, 1.5, 2.1],
  [196, 60, 1.4, 0.6],
  [240, 130, 1.7, 1.8],
  [276, 30, 1.3, 2.7],
  [58, 220, 1.5, 0.9],
  [262, 240, 1.4, 2.4]
];

/** Nubes: [x, y, escala]. */
const CLOUDS: [number, number, number][] = [
  [48, 62, 1],
  [214, 38, 0.8]
];

/** Pinos de la base: [x, alto]. */
const PINES: [number, number][] = [
  [20, 34],
  [44, 26],
  [262, 32],
  [284, 24],
  [238, 22]
];

/**
 * La montaña: cielo, la ladera con su sendero en zigzag, los campamentos, la bandera de la cumbre y el escalador.
 * Solo dibuja; quien lo usa decide en qué tramo está el escalador y lo anima.
 */
export const MountainStage: React.FC<Props> = ({ total, pos, label, climberRef }) => {
  const uid = useId().replace(/:/g, '');
  const sky = `${uid}-sky`;
  const rock = `${uid}-rock`;
  const climber = nodePoint(pos, total);
  const summit = nodePoint(total, total);

  return (
    <svg
      className={css.stage}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4aa8e6" />
          <stop offset="0.6" stopColor="#bfe3f7" />
          <stop offset="1" stopColor="#ffe9c9" />
        </linearGradient>
        <linearGradient id={rock} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7388a6" />
          <stop offset="1" stopColor="#4d607c" />
        </linearGradient>
      </defs>

      <rect width={VIEW_W} height={VIEW_H} fill={`url(#${sky})`} />
      <circle cx="244" cy="82" r="30" fill="#fff6c4" opacity="0.5" />
      <circle cx="244" cy="82" r="16" fill="#fff3b0" />

      {CLOUDS.map(([x, y, s]) => (
        <g key={x} transform={`translate(${x} ${y}) scale(${s})`}>
          <g className={css.cloud}>
            <ellipse cx="0" cy="0" rx="26" ry="8" fill="#ffffff" opacity="0.9" />
            <ellipse cx="-12" cy="-6" rx="14" ry="8" fill="#ffffff" opacity="0.9" />
            <ellipse cx="10" cy="-8" rx="12" ry="8" fill="#ffffff" opacity="0.9" />
          </g>
        </g>
      ))}

      {/* Cordillera lejana */}
      <path d="M-10 360V250L40 206L74 236L112 186L148 232L196 196L240 238L280 210L310 236V360Z" fill="#a9c2dc" />
      <path
        d="M112 186L100 202L110 198L120 206L128 198Z M196 196L186 210L196 206L206 212Z"
        fill="#ffffff"
        opacity="0.8"
      />

      {/* La montaña: ladera, cara en sombra y nieve de la cumbre */}
      <path d="M-10 360L58 214L96 170L122 92L150 34L176 88L198 128L232 190L310 360Z" fill={`url(#${rock})`} />
      <path d="M150 34L176 88L198 128L232 190L310 360L196 360L176 232L164 150Z" fill="#2c3d5a" opacity="0.28" />
      <path d="M150 34L122 92L134 86L141 101L150 88L159 103L167 84L176 88Z" fill="#ffffff" />
      <path d="M96 170L84 196L96 190L106 200L112 188Z" fill="#ffffff" opacity="0.7" />

      {/* Base: nieve y pinos */}
      <path d="M-10 336Q60 322 150 334T310 330V360H-10Z" fill="#eef6fb" />
      {PINES.map(([x, h]) => (
        <g key={x} transform={`translate(${x} 338)`}>
          <rect x="-1.5" y="-4" width="3" height="6" fill="#5b3b24" />
          <path d={`M0 ${-h}L${h * 0.38} -4H${-h * 0.38}Z`} fill="#256b4a" />
          <path d={`M0 ${-h}L${h * 0.16} ${-h * 0.62}H${-h * 0.16}Z`} fill="#ffffff" opacity="0.85" />
        </g>
      ))}

      {/* Sendero: entero, y en dorado lo ya subido */}
      <path
        d={trailPath(0, total, total)}
        fill="none"
        stroke="#fbeec4"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="0.1 5"
      />
      {pos > 0 && (
        <path
          d={trailPath(0, pos, total)}
          fill="none"
          stroke="#ffc933"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {Array.from({ length: total + 1 }, (_, i) => i).map((i) => {
        const { x, y } = nodePoint(i, total);
        const reached = i <= pos;

        if (i === total) return null;

        if (isCamp(i, total)) {
          return (
            <g key={i} transform={`translate(${x} ${y})`} data-camp={reached ? 'reached' : 'ahead'}>
              <path d="M-9 4L0 -10L9 4Z" fill={reached ? '#ffb347' : '#e8e2d0'} stroke="#2b3a52" strokeWidth="1.5" />
              <path d="M-2.500 4L0 -3L2.500 4Z" fill="#2b3a52" />
              <path d="M0 -10V-16" stroke="#2b3a52" strokeWidth="1.2" />
              <path d="M0 -16L6 -14L0 -12Z" fill="#ff5a4d" />
            </g>
          );
        }

        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i === 0 ? 4 : 2.8}
            fill={reached ? '#ffc933' : '#fbeec4'}
            stroke="#2b3a52"
            strokeWidth="1.3"
          />
        );
      })}

      {/* Bandera de la cumbre */}
      <g transform={`translate(${summit.x} ${summit.y})`} data-summit={pos >= total ? 'reached' : 'ahead'}>
        <circle r="3.4" fill={pos >= total ? '#ffc933' : '#fbeec4'} stroke="#2b3a52" strokeWidth="1.3" />
        <path d="M0 0V-24" stroke="#2b3a52" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M0 -24L15 -19L0 -14Z" fill="#ff5a4d" stroke="#2b3a52" strokeWidth="1" strokeLinejoin="round" />
      </g>

      {/* Escalador: los pies están en el origen del grupo */}
      <g ref={climberRef} data-climber="" transform={`translate(${climber.x} ${climber.y})`}>
        <g data-body="">
          <ellipse cx="0" cy="1" rx="6" ry="1.8" fill="#1b2a40" opacity="0.35" />
          <path
            d="M-2.200 -3L-2.600 0.500M2.200 -3L2.600 0.500"
            stroke="#2b3a52"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect x="-6" y="-10" width="3.600" height="7" rx="1.500" fill="#ff9a3d" stroke="#2b3a52" strokeWidth="0.8" />
          <rect
            x="-3"
            y="-11"
            width="6.400"
            height="8.600"
            rx="2.400"
            fill="#e8453c"
            stroke="#2b3a52"
            strokeWidth="0.9"
          />
          <circle cx="0.400" cy="-14.500" r="3.200" fill="#ffd7b0" stroke="#2b3a52" strokeWidth="0.9" />
          <path
            d="M-2.900 -15.200A3.300 3.300 0 0 1 3.700 -15.200Z"
            fill="#ffc933"
            stroke="#2b3a52"
            strokeWidth="0.8"
          />
          <path d="M3 -9L7 -16" stroke="#e8f1f8" strokeWidth="1.300" strokeLinecap="round" />
          <path d="M5.800 -16.500L8.600 -15.300" stroke="#e8f1f8" strokeWidth="1.300" strokeLinecap="round" />
        </g>
      </g>

      {SNOW.map(([x, y, r, delay]) => (
        <circle
          key={`${x}-${y}`}
          className={css.snow}
          cx={x}
          cy={y}
          r={r}
          fill="#ffffff"
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </svg>
  );
};
