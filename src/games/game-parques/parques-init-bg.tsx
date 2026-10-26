import css from './game-parques.module.css';

/** Una ficha de parqués vista desde arriba: disco con aro blanco y un brillo. */
const Token: React.FC<{ x: number; y: number; fill: string; edge: string }> = ({ x, y, fill, edge }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx="0" cy="6" rx="17" ry="7" fill="#000000" opacity="0.3" />
    <circle r="17" fill={edge} stroke="#ffffff" strokeWidth="3.500" />
    <circle r="10" fill={fill} />
    <circle cx="-4" cy="-4" r="3.500" fill="#ffffff" opacity="0.6" />
  </g>
);

/** Un dado visto de lado, con sus puntos. */
const Die: React.FC<{ x: number; y: number; rotate: number; pips: [number, number][] }> = ({ x, y, rotate, pips }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
    <rect x="-22" y="-22" width="44" height="44" rx="9" fill="#fffaf0" stroke="#2a170c" strokeWidth="3" />
    {pips.map(([px, py]) => (
      <circle key={`${px}-${py}`} cx={px * 11} cy={py * 11} r="3.800" fill="#2a170c" />
    ))}
  </g>
);

/**
 * Fondo de la pantalla de inicio: una mesa de madera vista desde arriba con un tablero de parqués inclinado, dos fichas
 * y dos dados. Es decorativo (aria-hidden) y se recorta con `slice` para cubrir cualquier proporción.
 */
export const ParquesInitBg: React.FC = () => (
  <svg
    className={css['init-bg']}
    viewBox="0 0 400 600"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="parques-bg-wood" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#6b3d1c" />
        <stop offset="1" stopColor="#2e1808" />
      </linearGradient>
      <radialGradient id="parques-bg-light" cx="0.5" cy="0.35" r="0.7">
        <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.35" />
        <stop offset="1" stopColor="#ffd9a0" stopOpacity="0" />
      </radialGradient>
    </defs>

    <rect width="400" height="600" fill="url(#parques-bg-wood)" />
    {/* Tablas de la mesa */}
    <g stroke="#1d0f05" strokeWidth="3" opacity="0.55">
      <line x1="0" y1="120" x2="400" y2="120" />
      <line x1="0" y1="250" x2="400" y2="250" />
      <line x1="0" y1="380" x2="400" y2="380" />
      <line x1="0" y1="510" x2="400" y2="510" />
    </g>
    <g stroke="#8c5a30" strokeWidth="1.500" opacity="0.4" fill="none">
      <path d="M0 60c90 14 200-10 400 6M0 180c120-12 240 14 400 0M0 320c110 16 250-14 400 4M0 450c130-10 230 16 400-2M0 560c100 12 220-8 400 6" />
    </g>
    <rect width="400" height="600" fill="url(#parques-bg-light)" />

    {/* Tablero en cruz, inclinado */}
    <g transform="translate(200 330) rotate(-14)">
      <g fill="#f1e2bd" stroke="#4a2a14" strokeWidth="5" strokeLinejoin="round">
        <rect x="-45" y="-190" width="90" height="380" rx="8" />
        <rect x="-190" y="-45" width="380" height="90" rx="8" />
      </g>
      <g opacity="0.95">
        <rect x="-45" y="-190" width="90" height="38" rx="6" fill="#d9382b" />
        <rect x="152" y="-45" width="38" height="90" rx="6" fill="#2a9d57" />
        <rect x="-45" y="152" width="90" height="38" rx="6" fill="#f5b800" />
        <rect x="-190" y="-45" width="38" height="90" rx="6" fill="#2a6fd1" />
      </g>
      <g stroke="#4a2a14" strokeWidth="2" opacity="0.5">
        {[-15, 15].map((v) => (
          <g key={v}>
            <line x1={v} y1="-190" x2={v} y2="-45" />
            <line x1={v} y1="45" x2={v} y2="190" />
            <line x1="-190" y1={v} x2="-45" y2={v} />
            <line x1="45" y1={v} x2="190" y2={v} />
          </g>
        ))}
      </g>
      <g strokeWidth="3" stroke="#4a2a14">
        <polygon points="-45,-45 45,-45 0,0" fill="#d9382b" />
        <polygon points="45,-45 45,45 0,0" fill="#2a9d57" />
        <polygon points="-45,45 45,45 0,0" fill="#f5b800" />
        <polygon points="-45,-45 -45,45 0,0" fill="#2a6fd1" />
      </g>
    </g>

    <Token x={92} y={150} fill="#ffd24a" edge="#d99a00" />
    <Token x={318} y={470} fill="#ff6a5a" edge="#b3281c" />
    <Token x={130} y={520} fill="#ffd24a" edge="#d99a00" />
    <Die
      x={320}
      y={130}
      rotate={18}
      pips={[
        [-1, -1],
        [1, -1],
        [0, 0],
        [-1, 1],
        [1, 1]
      ]}
    />
    <Die
      x={64}
      y={420}
      rotate={-22}
      pips={[
        [-1, -1],
        [1, 1]
      ]}
    />

    {/* Velo oscuro: baja el contraste del fondo para que el texto del inicio se lea siempre */}
    <rect width="400" height="600" fill="#1d0f05" opacity="0.45" />
  </svg>
);
