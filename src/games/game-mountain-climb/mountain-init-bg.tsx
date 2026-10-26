import css from './game-mountain-climb.module.css';

const W = 800;
const H = 720;

const STARS: [number, number][] = [
  [60, 50],
  [150, 110],
  [250, 40],
  [380, 90],
  [480, 36],
  [590, 100],
  [700, 54],
  [760, 140],
  [30, 160],
  [330, 150],
  [540, 160],
  [110, 60]
];

/** Pinos del primer plano: [x, alto]. */
const PINES: [number, number][] = [
  [30, 110],
  [76, 84],
  [124, 120],
  [170, 80],
  [630, 86],
  [676, 118],
  [722, 80],
  [770, 112],
  [588, 70]
];

/** Aves lejanas: [x, y, escala]. */
const BIRDS: [number, number, number][] = [
  [130, 190, 1],
  [172, 214, 0.7],
  [640, 176, 0.9]
];

/** Fondo de la pantalla de inicio de la escalada: amanecer de alta montaña con cordilleras, nieve y pinos. */
export const MountainInitBg: React.FC = () => (
  <svg
    className={css['init-bg']}
    viewBox={`0 0 ${W} ${H}`}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="mountain-bg-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#14214d" />
        <stop offset="0.45" stopColor="#4a3a86" />
        <stop offset="0.72" stopColor="#c0507c" />
        <stop offset="1" stopColor="#ff9a4d" />
      </linearGradient>
      <radialGradient id="mountain-bg-sun" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#fff3b0" />
        <stop offset="0.45" stopColor="#ffc46b" stopOpacity="0.7" />
        <stop offset="1" stopColor="#ff9a4d" stopOpacity="0" />
      </radialGradient>
    </defs>

    <rect width={W} height={H} fill="url(#mountain-bg-sky)" />

    {STARS.map(([x, y]) => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r="1.8" fill="#ffffff" opacity="0.75" />
    ))}

    {/* Sol bajo la cordillera */}
    <circle cx="400" cy="520" r="230" fill="url(#mountain-bg-sun)" />
    <circle cx="400" cy="520" r="62" fill="#fff3b0" opacity="0.95" />

    {/* Franjas de nube iluminadas */}
    <g fill="#ffd1a6" opacity="0.55">
      <rect x="70" y="330" width="220" height="10" rx="5" />
      <rect x="130" y="352" width="140" height="8" rx="4" />
      <rect x="520" y="318" width="210" height="10" rx="5" />
      <rect x="560" y="340" width="130" height="8" rx="4" />
    </g>

    {BIRDS.map(([x, y, s]) => (
      <path
        key={x}
        d="M0 0Q8 -8 16 0Q24 -8 32 0"
        transform={`translate(${x} ${y}) scale(${s})`}
        fill="none"
        stroke="#2a1d4a"
        strokeWidth="3"
        strokeLinecap="round"
      />
    ))}

    {/* Cordillera lejana */}
    <path
      d="M0 560L70 470L120 520L210 420L290 510L380 450L470 520L560 430L650 510L720 450L800 520V720H0Z"
      fill="#7a4a8c"
    />
    <path
      d="M210 420L180 462L204 450L222 466L238 450Z M560 430L534 466L554 456L572 470L590 456Z"
      fill="#ffd9c2"
      opacity="0.85"
    />

    {/* Cordillera media, con la cumbre grande a un lado */}
    <path
      d="M0 620L90 540L150 590L250 470L330 580L430 540L520 600L610 520L690 590L760 540L800 570V720H0Z"
      fill="#46306e"
    />
    <path d="M250 470L222 510L246 500L264 516L282 500L300 520L330 580L300 540Z" fill="#ffe3d0" opacity="0.9" />
    <path d="M610 520L586 556L606 548L624 560L642 548Z" fill="#ffe3d0" opacity="0.85" />

    {/* Primer plano oscuro con pinos */}
    <path d="M0 660Q120 630 260 650T520 650T800 640V720H0Z" fill="#1a1238" />
    {PINES.map(([x, h]) => (
      <g key={x} transform={`translate(${x} 690)`}>
        <rect x="-4" y="-10" width="8" height="26" fill="#120c2a" />
        <path d={`M0 ${-h}L${h * 0.34} -10H${-h * 0.34}Z`} fill="#150e30" />
        <path d={`M0 ${-h * 0.75}L${h * 0.4} -10H${-h * 0.4}Z`} fill="#1d1540" />
      </g>
    ))}
  </svg>
);
