import css from './game-roulette.module.css';

const W = 800;
const H = 720;

/** Focos del plató: cada uno es un haz que baja desde el techo. */
const BEAMS = [
  { top: [70, 130], bottom: [-90, 260], opacity: 0.09 },
  { top: [250, 300], bottom: [120, 470], opacity: 0.06 },
  { top: [500, 550], bottom: [330, 680], opacity: 0.06 },
  { top: [670, 730], bottom: [540, 890], opacity: 0.09 }
];

/** Bombillas de la marquesina: una fila arriba y otra abajo. */
const BULBS = Array.from({ length: 21 }, (_, i) => 20 + i * 38);

/** Confeti: [x, y, giro, color]. */
const CONFETTI: [number, number, number, string][] = [
  [60, 120, 25, '#ff4f6d'],
  [140, 70, -30, '#3ec1ff'],
  [230, 150, 60, '#ffd23f'],
  [330, 60, 10, '#7ae582'],
  [470, 90, -45, '#ff9f1c'],
  [590, 140, 35, '#c77dff'],
  [690, 70, -20, '#ff4f6d'],
  [750, 170, 50, '#3ec1ff'],
  [40, 300, -15, '#ffd23f'],
  [760, 330, 30, '#7ae582'],
  [90, 520, 40, '#c77dff'],
  [700, 480, -35, '#ff4f6d'],
  [180, 610, 15, '#3ec1ff'],
  [560, 600, -50, '#ffd23f']
];

/** Colores de los gajos de la ruleta gigante del fondo. */
const SLICES = ['#ff4f6d', '#ffd23f', '#3ec1ff', '#7ae582', '#c77dff', '#ff9f1c', '#3ec1ff', '#ff4f6d'];

const slice = (r: number, from: number, to: number) => {
  const point = (a: number) => `${(r * Math.cos(a)).toFixed(1)} ${(r * Math.sin(a)).toFixed(1)}`;

  return `M0 0 L${point(from)} A${r} ${r} 0 0 1 ${point(to)} Z`;
};

/** Fondo de la pantalla de inicio de la ruleta: un plató de concurso con focos, marquesina y confeti. */
export const RouletteInitBg: React.FC = () => (
  <svg
    className={css['init-bg']}
    viewBox={`0 0 ${W} ${H}`}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="roulette-bg-stage" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2a1f7a" />
        <stop offset="1" stopColor="#0d0b2e" />
      </linearGradient>
    </defs>

    <rect width={W} height={H} fill="url(#roulette-bg-stage)" />

    {BEAMS.map((b) => (
      <polygon
        key={b.top[0]}
        points={`${b.top[0]},0 ${b.top[1]},0 ${b.bottom[1]},${H} ${b.bottom[0]},${H}`}
        fill="#ffd23f"
        opacity={b.opacity}
      />
    ))}

    {/* Ruleta gigante recortada en la esquina */}
    <g transform="translate(720 690)" opacity="0.22">
      {SLICES.map((color, i) => (
        <path
          key={i}
          d={slice(300, (i * Math.PI) / 4, ((i + 1) * Math.PI) / 4)}
          fill={color}
          stroke="#0d0b2e"
          strokeWidth="4"
        />
      ))}
      <circle r="300" fill="none" stroke="#ffd23f" strokeWidth="10" />
      <circle r="46" fill="#0d0b2e" stroke="#ffd23f" strokeWidth="6" />
    </g>

    {/* Suelo del plató */}
    <path d={`M0 ${H - 70} Q${W / 2} ${H - 110} ${W} ${H - 70} V${H} H0 Z`} fill="#070520" opacity="0.7" />

    {/* Marquesina de bombillas */}
    {[22, H - 22].map((y) => (
      <g key={y}>
        <line x1="0" x2={W} y1={y} y2={y} stroke="#ffd23f" strokeWidth="2" opacity="0.35" />
        {BULBS.map((x, i) => (
          <circle key={x} cx={x} cy={y} r="5.5" fill="#ffd23f" opacity={i % 2 ? 0.45 : 0.95} />
        ))}
      </g>
    ))}

    {CONFETTI.map(([x, y, rot, color]) => (
      <rect
        key={`${x}-${y}`}
        x={x - 7}
        y={y - 3}
        width="14"
        height="6"
        rx="1.5"
        fill={color}
        opacity="0.8"
        transform={`rotate(${rot} ${x} ${y})`}
      />
    ))}

    {/* Destellos */}
    {(
      [
        [120, 230],
        [690, 250],
        [400, 40]
      ] as const
    ).map(([x, y]) => (
      <path
        key={`${x}-${y}`}
        d={`M${x} ${y - 12} Q${x} ${y} ${x + 12} ${y} Q${x} ${y} ${x} ${y + 12} Q${x} ${y} ${x - 12} ${y} Q${x} ${y} ${x} ${y - 12} Z`}
        fill="#ffffff"
        opacity="0.7"
      />
    ))}
  </svg>
);
