import css from './game-plinko.module.css';

const W = 800;
const H = 720;

const ROWS = 12;
const STEP_X = 66;
const STEP_Y = 46;

/** Clavos en triángulo: las filas pares van desplazadas media casilla. */
const PEGS = Array.from({ length: ROWS }, (_, row) => {
  const count = Math.floor(W / STEP_X) + 2;
  const offset = row % 2 ? STEP_X / 2 : 0;

  return Array.from({ length: count }, (_, col) => ({
    x: col * STEP_X + offset - 10,
    y: 70 + row * STEP_Y,
    tint: (row + col) % 7 === 0 ? '#ff4fa3' : (row + col) % 7 === 3 ? '#5cc8ff' : '#ffffff'
  }));
}).flat();

/** Premios del fondo: color de cada ranura. */
const SLOTS = ['#ff4fa3', '#ffd23f', '#5cc8ff', '#7ae582', '#c77dff', '#7ae582', '#5cc8ff', '#ffd23f', '#ff4fa3'];

/** Fichas cayendo: trayectoria (zigzag de clavo a clavo) y color. */
const DROPS = [
  { d: 'M140 40 L173 116 L140 162 L173 208 L206 254 L173 300', color: '#ff4fa3', x: 173, y: 300 },
  { d: 'M600 30 L567 116 L600 162 L633 208 L600 254 L633 300 L666 346', color: '#5cc8ff', x: 666, y: 346 },
  { d: 'M400 20 L433 116 L400 162 L367 208 L400 254', color: '#ffd23f', x: 400, y: 254 }
];

/** Fondo de la pantalla de inicio del Plinko: tablero de clavos con neón y fichas cayendo hacia los premios. */
export const PlinkoInitBg: React.FC = () => (
  <svg
    className={css['init-bg']}
    viewBox={`0 0 ${W} ${H}`}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="plinko-bg-board" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0" stopColor="#2a0f5c" />
        <stop offset="1" stopColor="#0d0524" />
      </linearGradient>
    </defs>

    <rect width={W} height={H} fill="url(#plinko-bg-board)" />

    {/* Rejilla tenue de panel arcade */}
    {Array.from({ length: 9 }, (_, i) => (
      <line key={i} x1={i * 100} x2={i * 100} y1="0" y2={H} stroke="#ffffff" strokeWidth="1" opacity="0.04" />
    ))}

    {PEGS.map((peg) => {
      // Se apagan hacia el centro para que el texto se lea; los bordes brillan más.
      const edge = Math.abs(peg.x - W / 2) / (W / 2);

      return (
        <circle
          key={`${peg.x}-${peg.y}`}
          cx={peg.x}
          cy={peg.y}
          r="5.5"
          fill={peg.tint}
          opacity={(0.12 + 0.5 * edge).toFixed(2)}
        />
      );
    })}

    {DROPS.map((drop) => (
      <g key={drop.color}>
        <path
          d={drop.d}
          fill="none"
          stroke={drop.color}
          strokeWidth="3"
          strokeDasharray="2 10"
          strokeLinecap="round"
          opacity="0.7"
        />
        <circle cx={drop.x} cy={drop.y} r="15" fill={drop.color} opacity="0.9" />
        <circle cx={drop.x} cy={drop.y} r="9" fill="none" stroke="#ffffff" strokeWidth="2.5" opacity="0.7" />
      </g>
    ))}

    {/* Ranuras de premios, abajo */}
    {SLOTS.map((color, i) => {
      const w = W / SLOTS.length;

      return (
        <g key={i}>
          <rect x={i * w + 4} y={H - 64} width={w - 8} height="64" rx="8" fill={color} opacity="0.55" />
          <rect x={i * w} y={H - 98} width="5" height="98" fill="#ffffff" opacity="0.5" />
        </g>
      );
    })}
    <rect x={W - 5} y={H - 98} width="5" height="98" fill="#ffffff" opacity="0.5" />
  </svg>
);
