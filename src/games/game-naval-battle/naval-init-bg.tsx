import css from './game-naval-battle.module.css';

const W = 800;
const H = 720;

const GRID = 60;
const LETTERS = 'ABCDEFGHIJKLM';

/** Ola: curva que se repite a lo ancho, con el nivel `y` y la altura `amp`. */
const wave = (y: number, amp: number, length: number) => {
  let d = `M0 ${y}`;

  for (let x = 0; x < W + length; x += length) {
    d += ` q${length / 4} ${-amp} ${length / 2} 0 t${length / 2} 0`;
  }

  return `${d} V${H} H0 Z`;
};

/** Casco de un barco de silueta con su torreta, centrado en `x` sobre la línea de flotación `y`. */
const ship = (x: number, y: number, s: number) =>
  `M${x - 46 * s} ${y} l${10 * s} ${14 * s} h${72 * s} l${16 * s} ${-18 * s} Z M${x - 14 * s} ${y} v${-16 * s} h${28 * s} v${16 * s} Z M${x - 4 * s} ${y - 16 * s} v${-14 * s} h${8 * s} v${14 * s} Z`;

const RINGS = [40, 80, 120, 160];

/** Fondo de la pantalla de inicio de la batalla naval: carta de navegación con radar, olas y barcos. */
export const NavalInitBg: React.FC = () => (
  <svg
    className={css['init-bg']}
    viewBox={`0 0 ${W} ${H}`}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="naval-bg-sea" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0" stopColor="#0f3a5f" />
        <stop offset="1" stopColor="#061a2b" />
      </linearGradient>
    </defs>

    <rect width={W} height={H} fill="url(#naval-bg-sea)" />

    {/* Cuadrícula de coordenadas */}
    {Array.from({ length: Math.ceil(W / GRID) + 1 }, (_, i) => (
      <line key={`v${i}`} x1={i * GRID} x2={i * GRID} y1="0" y2={H} stroke="#5cc8f0" strokeWidth="1" opacity="0.13" />
    ))}
    {Array.from({ length: Math.ceil(H / GRID) + 1 }, (_, i) => (
      <line key={`h${i}`} x1="0" x2={W} y1={i * GRID} y2={i * GRID} stroke="#5cc8f0" strokeWidth="1" opacity="0.13" />
    ))}
    {Array.from({ length: 12 }, (_, i) => (
      <text
        key={i}
        x={i * GRID + GRID / 2}
        y="26"
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fill="#9fdcf5"
        opacity="0.55"
        fontFamily="sans-serif"
      >
        {LETTERS[i]}
      </text>
    ))}
    {Array.from({ length: 10 }, (_, i) => (
      <text
        key={i}
        x="14"
        y={i * GRID + GRID / 2 + 90}
        fontSize="16"
        fontWeight="700"
        fill="#9fdcf5"
        opacity="0.55"
        fontFamily="sans-serif"
      >
        {i + 1}
      </text>
    ))}

    {/* Radar en la esquina superior */}
    <g transform="translate(660 150)">
      {RINGS.map((r) => (
        <circle key={r} r={r} fill="none" stroke="#5cc8f0" strokeWidth="2" opacity="0.28" />
      ))}
      <line x1="-170" x2="170" stroke="#5cc8f0" strokeWidth="1.5" opacity="0.25" />
      <line y1="-170" y2="170" stroke="#5cc8f0" strokeWidth="1.5" opacity="0.25" />
      <path d="M0 0 L150 -80 A170 170 0 0 0 100 -137 Z" fill="#5cc8f0" opacity="0.2" />
      <line x1="0" y1="0" x2="150" y2="-80" stroke="#8fe3ff" strokeWidth="3" opacity="0.7" />
      <circle cx="70" cy="40" r="6" fill="#ff6b6b" opacity="0.85" />
      <circle cx="-60" cy="-70" r="5" fill="#ff6b6b" opacity="0.6" />
    </g>

    {/* Ruta punteada hasta el objetivo */}
    <path
      d="M70 420 C180 300 260 460 360 380"
      fill="none"
      stroke="#ffc933"
      strokeWidth="3"
      strokeDasharray="4 10"
      strokeLinecap="round"
      opacity="0.6"
    />
    <g transform="translate(360 380)" opacity="0.85">
      <line x1="-10" y1="-10" x2="10" y2="10" stroke="#ff6b6b" strokeWidth="5" strokeLinecap="round" />
      <line x1="10" y1="-10" x2="-10" y2="10" stroke="#ff6b6b" strokeWidth="5" strokeLinecap="round" />
    </g>

    {/* Mar: tres capas de olas con barcos */}
    <path d={wave(560, 18, 120)} fill="#0b4a72" opacity="0.7" />
    <path d={ship(160, 566, 1)} fill="#06202f" opacity="0.9" />
    <path d={wave(610, 22, 150)} fill="#0a3b5e" opacity="0.85" />
    <path d={ship(600, 614, 1.25)} fill="#041722" opacity="0.95" />
    <path d={wave(662, 16, 100)} fill="#072a45" />
  </svg>
);
