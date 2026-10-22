import css from './game-jeopardy.module.css';

const W = 800;
const H = 720;

const COLS = 6;
const GAP = 8;
const TILE_W = (W - GAP * (COLS + 1)) / COLS;

/** Puntos que van en las casillas de abajo. */
const VALUES = [200, 400, 600, 800, 1000, 200];

/** Fondo de la pantalla de inicio del tablero: casillas de concurso en el borde y signos de interrogación enormes. */
export const JeopardyInitBg: React.FC = () => (
  <svg
    className={css['init-bg']}
    viewBox={`0 0 ${W} ${H}`}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="jeopardy-bg-screen" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0" stopColor="#0f35c4" />
        <stop offset="1" stopColor="#061552" />
      </linearGradient>
      <pattern id="jeopardy-bg-lines" width="8" height="6" patternUnits="userSpaceOnUse">
        <rect width="8" height="2" fill="#ffffff" opacity="0.035" />
      </pattern>
    </defs>

    <rect width={W} height={H} fill="url(#jeopardy-bg-screen)" />
    <rect width={W} height={H} fill="url(#jeopardy-bg-lines)" />

    {/* Interrogaciones gigantes */}
    <text x="-30" y="330" fontSize="420" fontWeight="900" fill="#ffd23f" opacity="0.07" fontFamily="sans-serif">
      ?
    </text>
    <text x="560" y="640" fontSize="460" fontWeight="900" fill="#ffffff" opacity="0.06" fontFamily="sans-serif">
      ?
    </text>

    {/* Fila de categorías, arriba */}
    {Array.from({ length: COLS }, (_, i) => (
      <g key={`c${i}`} transform={`translate(${GAP + i * (TILE_W + GAP)} 58)`}>
        <rect width={TILE_W} height="58" rx="6" fill="#0a2488" stroke="#6f93ff" strokeWidth="2" opacity="0.85" />
        <rect x="14" y="22" width={TILE_W - 28} height="6" rx="3" fill="#ffffff" opacity="0.45" />
        <rect x="26" y="36" width={TILE_W - 52} height="5" rx="2.5" fill="#ffffff" opacity="0.25" />
      </g>
    ))}

    {/* Fila de puntos, abajo */}
    {VALUES.map((value, i) => (
      <g key={`v${i}`} transform={`translate(${GAP + i * (TILE_W + GAP)} ${H - 118})`}>
        <rect width={TILE_W} height="58" rx="6" fill="#0f35c4" stroke="#6f93ff" strokeWidth="2" opacity="0.85" />
        <text
          x={TILE_W / 2}
          y="38"
          textAnchor="middle"
          fontSize="26"
          fontWeight="900"
          fill="#ffd23f"
          opacity="0.9"
          fontFamily="sans-serif"
        >
          {value}
        </text>
      </g>
    ))}

    {/* Columnas de casillas, a los lados */}
    {[0, 1, 2].map((row) =>
      [GAP, W - GAP - 56].map((x) => (
        <rect
          key={`${row}-${x}`}
          x={x}
          y={120 + row * 160}
          width="56"
          height="120"
          rx="6"
          fill="#0f35c4"
          stroke="#6f93ff"
          strokeWidth="2"
          opacity="0.35"
        />
      ))
    )}
  </svg>
);
