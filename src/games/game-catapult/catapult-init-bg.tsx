import css from './game-catapult.module.css';

const W = 800;
const H = 720;

const STARS: [number, number][] = [
  [50, 60],
  [140, 120],
  [240, 46],
  [350, 100],
  [450, 40],
  [540, 96],
  [610, 150],
  [30, 190],
  [310, 170],
  [180, 200]
];

/** Almenas de una torre: x inicial, ancho y y. */
const crenel = (x: number, w: number, y: number) => {
  const teeth = Math.floor(w / 16);

  return Array.from({ length: teeth }, (_, i) => `M${x + i * 16} ${y}h8v-10h-8Z`).join('');
};

/** Fondo de la pantalla de inicio de la catapulta: noche medieval con el castillo enemigo, la catapulta y antorchas. */
export const CatapultInitBg: React.FC = () => (
  <svg
    className={css['init-bg']}
    viewBox={`0 0 ${W} ${H}`}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="catapult-bg-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1a1038" />
        <stop offset="0.5" stopColor="#4a2468" />
        <stop offset="0.82" stopColor="#b8456a" />
        <stop offset="1" stopColor="#f08a5a" />
      </linearGradient>
      <radialGradient id="catapult-bg-torch" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#ffd27a" stopOpacity="0.9" />
        <stop offset="1" stopColor="#ff7a1a" stopOpacity="0" />
      </radialGradient>
    </defs>

    <rect width={W} height={H} fill="url(#catapult-bg-sky)" />

    {STARS.map(([x, y]) => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r="1.8" fill="#ffffff" opacity="0.8" />
    ))}

    {/* Luna */}
    <circle cx="712" cy="118" r="58" fill="#ffe9a8" opacity="0.18" />
    <circle cx="712" cy="118" r="42" fill="#ffe9a8" opacity="0.95" />
    <circle cx="698" cy="106" r="9" fill="#f2d27c" opacity="0.6" />
    <circle cx="726" cy="132" r="6" fill="#f2d27c" opacity="0.6" />

    {/* Piedras lanzadas en el cielo */}
    <path
      d="M170 500Q380 190 560 430"
      fill="none"
      stroke="#ffd9a0"
      strokeWidth="3"
      strokeDasharray="2 12"
      strokeLinecap="round"
      opacity="0.6"
    />
    <path
      d="M190 520Q420 270 640 470"
      fill="none"
      stroke="#ffd9a0"
      strokeWidth="2"
      strokeDasharray="2 14"
      strokeLinecap="round"
      opacity="0.4"
    />

    {/* Colinas lejanas */}
    <path d="M0 520Q150 450 300 500T560 480T800 500V720H0Z" fill="#5a2c6e" />

    {/* Castillo enemigo a la derecha */}
    <g fill="#2a1646">
      <rect x="560" y="450" width="240" height="190" />
      <rect x="540" y="400" width="60" height="240" />
      <rect x="640" y="420" width="50" height="220" />
      <rect x="748" y="390" width="70" height="250" />
      <path d={crenel(540, 60, 400)} />
      <path d={crenel(640, 48, 420)} />
      <path d={crenel(748, 64, 390)} />
      <path d={crenel(560, 240, 450)} />
      <path d="M594 400L570 360L546 400Z M772 390L783 340L794 390Z" fill="#3a1d5c" />
    </g>
    <g fill="#ffd27a" opacity="0.9">
      <rect x="562" y="440" width="9" height="16" rx="4" />
      <rect x="656" y="470" width="9" height="16" rx="4" />
      <rect x="772" y="430" width="9" height="16" rx="4" />
      <rect x="700" y="520" width="9" height="16" rx="4" />
    </g>
    <path d="M700 640v-34a20 20 0 0 1 40 0v34Z" fill="#14091f" />

    {/* Catapulta a la izquierda */}
    <g fill="#14091f" stroke="#14091f" strokeLinecap="round">
      <rect x="40" y="590" width="150" height="14" />
      <path d="M70 590L118 520M170 590L118 520" strokeWidth="9" />
      <path d="M118 520L60 560" strokeWidth="9" />
      <path d="M170 500L118 520" strokeWidth="9" />
      <circle cx="60" cy="560" r="14" fill="none" strokeWidth="6" />
      <circle cx="78" cy="620" r="22" />
      <circle cx="158" cy="620" r="22" />
    </g>

    {/* Primer plano oscuro con antorchas */}
    <path d="M0 640Q160 618 320 636T640 634T800 640V720H0Z" fill="#14091f" />
    {[
      [250, 0],
      [560, 0]
    ].map(([x]) => (
      <g key={x} transform={`translate(${x} 640)`}>
        <circle cy="-40" r="46" fill="url(#catapult-bg-torch)" />
        <rect x="-3" y="-30" width="6" height="40" fill="#3a2410" />
        <path d="M0 -62Q9 -48 0 -38Q-9 -48 0 -62Z" fill="#ffb347" />
        <path d="M0 -54Q4 -47 0 -42Q-4 -47 0 -54Z" fill="#fff3b0" />
      </g>
    ))}
  </svg>
);
