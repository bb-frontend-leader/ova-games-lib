import css from './game-treasure-map.module.css';

/** Una ola: un arco corto que se repite sobre el mar. */
const Wave: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <path
    d="M0 0q6-6 12 0t12 0"
    transform={`translate(${x} ${y}) scale(${scale})`}
    fill="none"
    stroke="#ffffff"
    strokeWidth="1.600"
    strokeLinecap="round"
    opacity="0.35"
  />
);

const WAVES: [number, number, number][] = [
  [30, 330, 1],
  [260, 300, 1.2],
  [150, 380, 0.9],
  [330, 420, 1],
  [40, 470, 1.2],
  [210, 500, 1],
  [320, 560, 0.9],
  [90, 580, 1]
];

/**
 * Fondo de la pantalla de inicio: un mar al amanecer con una isla lejana y un pergamino enrollado en una esquina.
 * Es decorativo (aria-hidden) y se recorta con `slice` para cubrir cualquier proporción.
 */
export const TreasureInitBg: React.FC = () => (
  <svg
    className={css['init-bg']}
    viewBox="0 0 400 600"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="treasure-bg-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1c3b6b" />
        <stop offset="0.38" stopColor="#f08a5d" />
        <stop offset="0.4" stopColor="#ffd9a0" />
      </linearGradient>
      <linearGradient id="treasure-bg-sea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1e7fa8" />
        <stop offset="1" stopColor="#0a3a5c" />
      </linearGradient>
    </defs>

    <rect width="400" height="600" fill="url(#treasure-bg-sky)" />
    <circle cx="300" cy="215" r="46" fill="#fff3b0" opacity="0.85" />
    <circle cx="300" cy="215" r="70" fill="#fff3b0" opacity="0.22" />
    <rect y="240" width="400" height="360" fill="url(#treasure-bg-sea)" />
    <rect y="240" width="400" height="4" fill="#ffffff" opacity="0.4" />

    {/* Isla lejana con palmera */}
    <ellipse cx="90" cy="244" rx="64" ry="12" fill="#124a3a" />
    <path d="M50 244q40-34 80 0Z" fill="#1d6a4e" />
    <path d="M92 238Q96 214 88 196" fill="none" stroke="#0e2f25" strokeWidth="3" strokeLinecap="round" />
    <path
      d="M88 196q-14-4-20 4M88 196q14-6 22 0M88 196q-6-10-14-10M88 196q8-10 18-8"
      fill="none"
      stroke="#0e2f25"
      strokeWidth="3"
      strokeLinecap="round"
    />

    {WAVES.map(([x, y, s]) => (
      <Wave key={`${x}-${y}`} x={x} y={y} scale={s} />
    ))}

    {/* Velero pequeño en el horizonte */}
    <g transform="translate(250 252) scale(0.7)">
      <path d="M36 4v38" stroke="#2a170c" strokeWidth="2.400" strokeLinecap="round" />
      <path d="M38 8c14 4 20 14 22 26H38Z" fill="#fff8e6" />
      <path d="M34 12c-10 5-16 13-18 22h18Z" fill="#fff0cc" />
      <path d="M6 36h60l-9 12H15Z" fill="#5e2f12" />
    </g>
  </svg>
);
