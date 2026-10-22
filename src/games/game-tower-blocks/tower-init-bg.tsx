import css from './game-tower-blocks.module.css';

const W = 800;
const H = 720;
const GROUND = 668;

const STARS: [number, number][] = [
  [60, 60],
  [150, 130],
  [260, 50],
  [380, 110],
  [500, 40],
  [610, 120],
  [720, 60],
  [770, 170],
  [30, 200],
  [330, 190]
];

/** Edificios lejanos: [x, ancho, alto]. */
const FAR: [number, number, number][] = [
  [0, 90, 220],
  [90, 70, 300],
  [160, 100, 190],
  [260, 80, 270],
  [340, 110, 210],
  [450, 70, 320],
  [520, 100, 230],
  [620, 80, 280],
  [700, 100, 200]
];

/** Edificios cercanos con ventanas encendidas: [x, ancho, alto]. */
const NEAR: [number, number, number][] = [
  [20, 120, 150],
  [160, 90, 210],
  [560, 110, 170],
  [690, 110, 240]
];

/** Bloques apilados de juguete: [x, y, color]. */
const BLOCKS: [number, number, string][] = [
  [40, GROUND - 56, '#ff6b6b'],
  [100, GROUND - 56, '#4aa3ff'],
  [160, GROUND - 56, '#ffc933'],
  [70, GROUND - 112, '#4ade80'],
  [130, GROUND - 112, '#a78bfa'],
  [100, GROUND - 168, '#ff9f1c']
];

/** Travesaños de la torre de la grúa. */
const RUNGS = Array.from({ length: 11 }, (_, i) => 250 + i * 40);

const windows = (x: number, w: number, h: number) => {
  const out: { x: number; y: number; lit: boolean }[] = [];

  for (let row = 0; row < Math.floor((h - 24) / 26); row++) {
    for (let col = 0; col < Math.floor((w - 12) / 20); col++) {
      out.push({ x: x + 12 + col * 20, y: GROUND - h + 16 + row * 26, lit: (row * 3 + col * 5 + x) % 4 === 0 });
    }
  }

  return out;
};

/** Fondo de la pantalla de inicio de la torre de bloques: obra al anochecer con ciudad, grúa y bloques de juguete. */
export const TowerInitBg: React.FC = () => (
  <svg
    className={css['init-bg']}
    viewBox={`0 0 ${W} ${H}`}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="tower-bg-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2b2f6e" />
        <stop offset="0.7" stopColor="#4a3a7a" />
        <stop offset="1" stopColor="#8a5a7a" />
      </linearGradient>
      <pattern id="tower-bg-hazard" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="20" height="40" fill="#ffc933" />
        <rect x="20" width="20" height="40" fill="#1a1a1a" />
      </pattern>
    </defs>

    <rect width={W} height={H} fill="url(#tower-bg-sky)" />

    {STARS.map(([x, y]) => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill="#ffffff" opacity="0.8" />
    ))}
    <circle cx="110" cy="110" r="38" fill="#ffe9a8" opacity="0.9" />
    <circle cx="96" cy="100" r="9" fill="#f2d27c" opacity="0.6" />
    <circle cx="124" cy="124" r="6" fill="#f2d27c" opacity="0.6" />

    {/* Ciudad lejana y cercana */}
    {FAR.map(([x, w, h]) => (
      <rect key={x} x={x} y={GROUND - h} width={w} height={h} fill="#1e2158" opacity="0.85" />
    ))}
    {NEAR.map(([x, w, h]) => (
      <g key={x}>
        <rect x={x} y={GROUND - h} width={w} height={h} fill="#12142e" />
        {windows(x, w, h).map((win) => (
          <rect
            key={`${win.x}-${win.y}`}
            x={win.x}
            y={win.y}
            width="10"
            height="14"
            rx="1.5"
            fill={win.lit ? '#ffd86b' : '#23264f'}
            opacity={win.lit ? 0.9 : 1}
          />
        ))}
      </g>
    ))}

    {/* Grúa torre: a la derecha, fuera de la columna del texto */}
    <g transform="translate(160 0)">
      <g stroke="#ffc933" strokeWidth="5" strokeLinecap="round" fill="none">
        <line x1="548" y1="150" x2="548" y2={GROUND} />
        <line x1="580" y1="150" x2="580" y2={GROUND} />
        {RUNGS.map((y) => (
          <path key={y} d={`M548 ${y} L580 ${y + 40}M580 ${y} L548 ${y + 40}`} strokeWidth="3" />
        ))}
        <line x1="450" y1="150" x2="760" y2="150" />
        <path d="M450 150 L500 124 L760 124 Z" strokeWidth="3" />
        <path d="M564 124 V92 M564 92 L470 150 M564 92 L740 150" strokeWidth="3" />
      </g>
      <rect x="720" y="150" width="46" height="34" fill="#e8e2d0" opacity="0.85" />
      <rect x="536" y="130" width="50" height="22" rx="4" fill="#ffc933" />
    </g>
    {/* Cable y bloque colgado, a la izquierda del mástil */}
    <line x1="660" y1="150" x2="660" y2="332" stroke="#e8e2d0" strokeWidth="3" opacity="0.9" />
    <rect x="652" y="326" width="16" height="12" rx="3" fill="#ffc933" />
    <rect x="620" y="338" width="80" height="52" rx="6" fill="#ff6b6b" />
    {[636, 660, 684].map((x) => (
      <rect key={x} x={x - 8} y="332" width="16" height="8" rx="3" fill="#ff8f8f" />
    ))}

    {/* Suelo y bloques */}
    <rect y={GROUND} width={W} height={H - GROUND} fill="#0d0e24" />
    <rect y={H - 22} width={W} height="22" fill="url(#tower-bg-hazard)" opacity="0.9" />
    {BLOCKS.map(([x, y, color]) => (
      <g key={`${x}-${y}`}>
        <rect x={x} y={y} width="56" height="56" rx="6" fill={color} stroke="#0d0e24" strokeWidth="3" />
        <rect x={x + 8} y={y - 5} width="14" height="8" rx="3" fill={color} />
        <rect x={x + 34} y={y - 5} width="14" height="8" rx="3" fill={color} />
      </g>
    ))}
  </svg>
);
