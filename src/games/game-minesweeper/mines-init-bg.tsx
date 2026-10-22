import css from './game-minesweeper.module.css';

const W = 800;
const H = 720;

const COLS = 11;
const ROWS = 10;
const CELL = 68;
const GAP = 6;
const GRID_X = (W - COLS * CELL + GAP) / 2;
const GRID_Y = (H - ROWS * CELL + GAP) / 2;

/** Colores de los números de siempre. */
const NUMBER_COLORS = ['#4aa3ff', '#4ade80', '#ff6b6b', '#a78bfa'];

type Kind = 'covered' | 'empty' | 'number' | 'mine' | 'flag';

/** Reparto fijo de casillas (determinista: el fondo no cambia entre renders). */
const kindAt = (row: number, col: number): { kind: Kind; n: number } => {
  const h = (row * 7 + col * 13 + row * col) % 17;

  if (h === 0) return { kind: 'mine', n: 0 };
  if (h === 1) return { kind: 'flag', n: 0 };
  if (h <= 4) return { kind: 'number', n: (h % 4) + 1 };
  if (h <= 6) return { kind: 'empty', n: 0 };

  return { kind: 'covered', n: 0 };
};

const CELLS = Array.from({ length: ROWS }, (_, row) =>
  Array.from({ length: COLS }, (_, col) => ({ row, col, ...kindAt(row, col) }))
).flat();

/** Pinchos de la mina. */
const SPIKES = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4);

/** Fondo de la pantalla de inicio del buscaminas: campo de casillas de metal con minas, banderas y números. */
export const MinesInitBg: React.FC = () => (
  <svg
    className={css['init-bg']}
    viewBox={`0 0 ${W} ${H}`}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="mines-bg-field" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0" stopColor="#164048" />
        <stop offset="1" stopColor="#091418" />
      </linearGradient>
      <pattern id="mines-bg-hazard" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="20" height="40" fill="#ffc933" />
        <rect x="20" width="20" height="40" fill="#161616" />
      </pattern>
    </defs>

    <rect width={W} height={H} fill="url(#mines-bg-field)" />

    {CELLS.map(({ row, col, kind, n }) => {
      const x = GRID_X + col * CELL;
      const y = GRID_Y + row * CELL;
      const cx = x + (CELL - GAP) / 2;
      const cy = y + (CELL - GAP) / 2;
      // Las casillas del centro se apagan para que el texto se lea.
      const edge = Math.min(1, Math.max(0, Math.hypot(cx - W / 2, cy - H / 2) - 150) / 250);
      const opacity = (0.04 + 0.66 * edge).toFixed(2);

      return (
        <g key={`${row}-${col}`} opacity={opacity}>
          <rect
            x={x}
            y={y}
            width={CELL - GAP}
            height={CELL - GAP}
            rx="8"
            fill={kind === 'covered' || kind === 'flag' ? '#2c6a76' : '#0d2a31'}
            stroke={kind === 'covered' || kind === 'flag' ? '#6fb3c0' : '#1a4650'}
            strokeWidth="2"
          />
          {kind === 'number' && (
            <text
              x={cx}
              y={cy + 11}
              textAnchor="middle"
              fontSize="32"
              fontWeight="900"
              fill={NUMBER_COLORS[(n - 1) % NUMBER_COLORS.length]}
              fontFamily="sans-serif"
            >
              {n}
            </text>
          )}
          {kind === 'mine' && (
            <g transform={`translate(${cx} ${cy})`}>
              {SPIKES.map((a) => (
                <line
                  key={a}
                  x1={Math.cos(a) * 8}
                  y1={Math.sin(a) * 8}
                  x2={Math.cos(a) * 21}
                  y2={Math.sin(a) * 21}
                  stroke="#0a0a0a"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              ))}
              <circle r="14" fill="#0a0a0a" />
              <circle cx="-4.5" cy="-4.5" r="4" fill="#ffffff" opacity="0.55" />
            </g>
          )}
          {kind === 'flag' && (
            <g transform={`translate(${cx} ${cy})`}>
              <line x1="-2" y1="-18" x2="-2" y2="18" stroke="#e8f4f6" strokeWidth="4" strokeLinecap="round" />
              <path d="M-2 -18 L18 -10 L-2 -2 Z" fill="#ff5a5a" />
              <rect x="-12" y="16" width="20" height="5" rx="2" fill="#e8f4f6" />
            </g>
          )}
        </g>
      );
    })}

    {/* Franjas de peligro arriba y abajo */}
    <rect width={W} height="22" fill="url(#mines-bg-hazard)" opacity="0.85" />
    <rect y={H - 22} width={W} height="22" fill="url(#mines-bg-hazard)" opacity="0.85" />
  </svg>
);
