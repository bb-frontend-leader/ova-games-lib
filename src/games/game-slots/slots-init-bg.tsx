import css from './game-slots.module.css';

const W = 800;
const H = 720;

/** Festones de la cenefa superior. */
const SCALLOPS = Array.from({ length: 10 }, (_, i) => i * 80 + 40);

/** Bombillas de la cenefa. */
const BULBS = Array.from({ length: 20 }, (_, i) => 20 + i * 40);

/** Monedas que caen: [x, y, radio]. */
const COINS: [number, number, number][] = [
  [250, 150, 20],
  [330, 250, 14],
  [470, 190, 16],
  [560, 300, 22],
  [290, 560, 18],
  [520, 600, 14],
  [420, 660, 20]
];

/** Pliegues del telón: curvas verticales que se estrechan hacia abajo. */
const FOLDS = [28, 58, 88, 118];

const curtain = (mirror: boolean) => {
  const x = (v: number) => (mirror ? W - v : v);

  return `M${x(0)} 0 H${x(180)} C${x(160)} 220 ${x(100)} 430 ${x(120)} ${H} H${x(0)} Z`;
};

const fold = (v: number, mirror: boolean) => {
  const x = (n: number) => (mirror ? W - n : n);

  return `M${x(v)} 60 C${x(v + 20)} 260 ${x(v - 10)} 460 ${x(v + 4)} ${H}`;
};

/** Fondo de la pantalla de inicio de las tragamonedas: casino con telones de terciopelo, cenefa de bombillas y monedas. */
export const SlotsInitBg: React.FC = () => (
  <svg
    className={css['init-bg']}
    viewBox={`0 0 ${W} ${H}`}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="slots-bg-wall" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0" stopColor="#5a0f2c" />
        <stop offset="1" stopColor="#1e0510" />
      </linearGradient>
      <linearGradient id="slots-bg-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffe27a" />
        <stop offset="1" stopColor="#c98a1a" />
      </linearGradient>
    </defs>

    <rect width={W} height={H} fill="url(#slots-bg-wall)" />

    {/* Rombos del papel pintado */}
    {Array.from({ length: 6 }, (_, r) =>
      Array.from({ length: 6 }, (_, c) => (
        <path
          key={`${r}-${c}`}
          d={`M${200 + c * 80} ${110 + r * 90 - 14} l12 14 l-12 14 l-12 -14 Z`}
          fill="#ffd23f"
          opacity="0.07"
        />
      ))
    )}

    {/* Telones a los lados */}
    {[false, true].map((mirror) => (
      <g key={String(mirror)}>
        <path d={curtain(mirror)} fill="#7d1537" />
        {FOLDS.map((v) => (
          <path
            key={v}
            d={fold(v, mirror)}
            fill="none"
            stroke="#3d0719"
            strokeWidth="14"
            opacity="0.45"
            strokeLinecap="round"
          />
        ))}
        {/* Alzapaños dorado */}
        <ellipse cx={mirror ? W - 120 : 120} cy="440" rx="40" ry="14" fill="url(#slots-bg-gold)" />
        <path d={`M${mirror ? W - 120 : 120} 454 v50`} stroke="#ffd23f" strokeWidth="6" strokeLinecap="round" />
        <circle cx={mirror ? W - 120 : 120} cy="512" r="10" fill="url(#slots-bg-gold)" />
      </g>
    ))}

    {/* Cenefa superior */}
    <rect width={W} height="30" fill="#8c1a40" />
    {SCALLOPS.map((x) => (
      <path key={x} d={`M${x - 40} 30 a40 18 0 0 0 80 0 Z`} fill="#8c1a40" stroke="#ffd23f" strokeWidth="3" />
    ))}
    {BULBS.map((x, i) => (
      <circle key={x} cx={x} cy="14" r="5" fill="#ffd23f" opacity={i % 2 ? 0.5 : 1} />
    ))}

    {/* Monedas */}
    {COINS.map(([x, y, r]) => (
      <g key={`${x}-${y}`} opacity="0.85">
        <circle cx={x} cy={y} r={r} fill="url(#slots-bg-gold)" stroke="#a86a00" strokeWidth="2" />
        <circle cx={x} cy={y} r={r * 0.62} fill="none" stroke="#a86a00" strokeWidth="2" opacity="0.7" />
      </g>
    ))}

    {/* Símbolos de la suerte, muy tenues */}
    <text x="236" y="470" fontSize="120" fontWeight="900" fill="#ffd23f" opacity="0.1" fontFamily="sans-serif">
      7
    </text>
    <text x="476" y="470" fontSize="120" fontWeight="900" fill="#ff5a78" opacity="0.1" fontFamily="sans-serif">
      7
    </text>
  </svg>
);
