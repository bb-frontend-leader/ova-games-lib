import css from './game-cometa.module.css';

/** Cometas lejanas del fondo: posición, escala, rotación y color. */
const KITES: [number, number, number, number, string][] = [
  [64, 120, 0.9, -14, '#ff4d6d'],
  [338, 96, 0.7, 12, '#ffd23f'],
  [356, 262, 0.55, -8, '#3a86ff'],
  [46, 304, 0.6, 10, '#06d6a0']
];

/**
 * Fondo de la pantalla de inicio: un cielo de atardecer en agosto con cometas de colores a lo lejos y una colina.
 * Es decorativo (aria-hidden) y se recorta con `slice` para cubrir cualquier proporción.
 */
export const CometaInitBg: React.FC = () => (
  <svg
    className={css['init-bg']}
    viewBox="0 0 400 600"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="cometa-bg-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1f4f9a" />
        <stop offset="0.5" stopColor="#6f7fd8" />
        <stop offset="0.8" stopColor="#ff9e7a" />
        <stop offset="1" stopColor="#ffd08a" />
      </linearGradient>
    </defs>

    <rect width="400" height="600" fill="url(#cometa-bg-sky)" />
    <circle cx="330" cy="470" r="46" fill="#fff0b3" opacity="0.8" />

    {/* Nubes */}
    <g fill="#ffffff" opacity="0.35">
      <ellipse cx="120" cy="210" rx="70" ry="16" />
      <ellipse cx="300" cy="360" rx="60" ry="14" />
      <ellipse cx="90" cy="430" rx="56" ry="12" />
    </g>

    {/* Cometas lejanas */}
    {KITES.map(([x, y, s, rot, color]) => (
      <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
        <path d="M0-30 20-3 0 28-20-3Z" fill={color} stroke="#2b1d12" strokeWidth="2" strokeLinejoin="round" />
        <path d="M0-30V28M-20-3H20" stroke="#2b1d12" strokeWidth="1.500" opacity="0.5" />
        <path d="M0 28q8 10 0 20t0 20t0 20" fill="none" stroke="#2b1d12" strokeWidth="2" strokeLinecap="round" />
      </g>
    ))}

    {/* Colinas */}
    <path d="M0 600V520Q120 480 240 520T400 510V600Z" fill="#2f7a3a" />
    <path d="M0 600V560Q140 530 270 565T400 556V600Z" fill="#1f5d2e" />
  </svg>
);
