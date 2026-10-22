import type { TimeOfDay } from '../lib/time-of-day';
import { SKY } from '../lib/time-of-day';

import css from '../styles/race-svg.module.css';
import cars from '../svg-card.module.css';

interface TintProps {
  phase: TimeOfDay;
}

/**
 * Velo del color de la franja del día sobre toda la escena (se multiplica con lo de abajo).
 * Va después de la pista y los autos, pero antes del marcador y los textos, que conservan su color.
 */
export const Tint = ({ phase }: TintProps) => {
  const { tint, tintOpacity } = SKY[phase];

  if (!tintOpacity) return null;

  return (
    <rect
      width={777.6}
      height={500}
      fill={tint}
      opacity={tintOpacity}
      style={{ mixBlendMode: 'multiply', pointerEvents: 'none' }}
    />
  );
};

interface HeadlightsProps {
  uid: string;
  move1: number;
  move2: number;
}

// Origen de cada haz: la punta del auto, en las mismas coordenadas del dibujo
const NOSE_PLAYER = { x: 312, y: 372 };
const NOSE_MACHINE = { x: 291, y: 257 };

/**
 * Faros de los dos autos, solo de noche. Se dibujan con la mezcla `screen` para que iluminen la pista
 * en vez de taparla, y se desplazan igual que cada auto.
 */
export const Headlights = ({ uid, move1, move2 }: HeadlightsProps) => {
  const gradient = `${uid}-beam`;

  return (
    <g style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}>
      <defs>
        <linearGradient id={gradient} x1={0} y1={0} x2={1} y2={0}>
          <stop offset={0} stopColor="#fff6c4" stopOpacity={0.9} />
          <stop offset={1} stopColor="#fff6c4" stopOpacity={0} />
        </linearGradient>
      </defs>
      {[
        { nose: NOSE_PLAYER, move: move1 },
        { nose: NOSE_MACHINE, move: move2 }
      ].map(({ nose, move }) => (
        <g key={nose.y} className={cars['car-transition']} transform={`translate(${move + nose.x} ${nose.y})`}>
          <polygon className={css.beam} points="0,-3 230,-24 230,40 0,5" fill={`url(#${gradient})`} />
          <circle r={4} fill="#fffbe0" />
        </g>
      ))}
    </g>
  );
};
