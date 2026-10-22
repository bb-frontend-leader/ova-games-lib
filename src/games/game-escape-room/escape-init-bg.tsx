import css from './game-escape-room.module.css';

const W = 800;
const H = 720;
const FLOOR = 600;

/** Líneas de las losetas del suelo: salen del punto de fuga hacia el borde inferior. */
const TILE_LINES = Array.from({ length: 13 }, (_, i) => -600 + i * 200);

/** Dígitos del código que flotan en el aire: [x, y, dígito, giro]. */
const DIGITS: [number, number, string, number][] = [
  [80, 130, '7', -8],
  [118, 215, '3', 6],
  [682, 215, '0', -5],
  [722, 130, '4', 9]
];

/** Puerta de pared: arco de marco, hoja, pomo y ojo de cerradura. */
const Door: React.FC<{ x: number; padlock?: boolean }> = ({ x, padlock = false }) => (
  <g transform={`translate(${x} ${FLOOR - 330})`}>
    <rect width="150" height="330" rx="10" fill="#0c0e26" stroke="#4b4f9c" strokeWidth="6" />
    <rect x="16" y="18" width="118" height="130" rx="6" fill="none" stroke="#2a2d66" strokeWidth="4" />
    <rect x="16" y="168" width="118" height="140" rx="6" fill="none" stroke="#2a2d66" strokeWidth="4" />
    <circle cx="118" cy="170" r="9" fill="#ffc933" opacity="0.9" />
    <path d="M118 188 v-2" stroke="#0c0e26" strokeWidth="1" />
    {padlock && (
      <g transform="translate(75 120)">
        <path d="M-16 0 v-14 a16 16 0 0 1 32 0 v14" fill="none" stroke="#ffc933" strokeWidth="6" />
        <rect x="-26" y="0" width="52" height="40" rx="7" fill="#ffc933" />
        <circle cx="0" cy="16" r="6" fill="#0c0e26" />
        <rect x="-2.5" y="18" width="5" height="12" rx="2" fill="#0c0e26" />
      </g>
    )}
  </g>
);

/** Fondo de la pantalla de inicio del escape room: un pasillo oscuro con puertas, una lámpara y el código flotando. */
export const EscapeInitBg: React.FC = () => (
  <svg
    className={css['init-bg']}
    viewBox={`0 0 ${W} ${H}`}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="escape-bg-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1a1c4a" />
        <stop offset="1" stopColor="#0c0d24" />
      </linearGradient>
      <pattern id="escape-bg-paper" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M20 8 l6 12 l-6 12 l-6 -12 Z" fill="#ffffff" opacity="0.045" />
      </pattern>
    </defs>

    <rect width={W} height={H} fill="url(#escape-bg-wall)" />
    <rect width={W} height={FLOOR} fill="url(#escape-bg-paper)" />

    {/* Zócalo y friso */}
    <rect y={FLOOR - 70} width={W} height="70" fill="#14163a" />
    <rect y={FLOOR - 74} width={W} height="6" fill="#2a2d66" />

    {/* Suelo en perspectiva */}
    <rect y={FLOOR} width={W} height={H - FLOOR} fill="#090a1c" />
    {TILE_LINES.map((x) => (
      <line key={x} x1={W / 2} y1={FLOOR} x2={W / 2 + x} y2={H} stroke="#3a3e86" strokeWidth="2" opacity="0.5" />
    ))}
    {[640, 668, 704].map((y) => (
      <line key={y} x1="0" x2={W} y1={y} y2={y} stroke="#3a3e86" strokeWidth="2" opacity="0.4" />
    ))}

    {/* Puertas a los lados */}
    <Door x={30} />
    <Door x={W - 180} padlock />

    {/* Lámpara del techo y su cono de luz */}
    <polygon points={`372,96 428,96 560,${FLOOR} 240,${FLOOR}`} fill="#ffd86b" opacity="0.07" />
    <line x1="400" y1="0" x2="400" y2="70" stroke="#6a6ec0" strokeWidth="4" />
    <path d="M370 100 L384 66 H416 L430 100 Z" fill="#2a2d66" stroke="#6a6ec0" strokeWidth="3" />
    <ellipse cx="400" cy="100" rx="30" ry="7" fill="#ffd86b" opacity="0.95" />

    {/* Código flotando */}
    {DIGITS.map(([x, y, digit, rot]) => (
      <g key={digit + x} transform={`rotate(${rot} ${x} ${y})`} opacity="0.5">
        <rect x={x - 26} y={y - 38} width="52" height="64" rx="9" fill="#0c0e26" stroke="#ffc933" strokeWidth="3" />
        <text x={x} y={y + 12} textAnchor="middle" fontSize="44" fontWeight="900" fill="#ffc933" fontFamily="monospace">
          {digit}
        </text>
      </g>
    ))}

    {/* Llave sobre el suelo */}
    <g transform="translate(330 650) rotate(-12)" opacity="0.85">
      <circle r="14" fill="none" stroke="#ffc933" strokeWidth="6" />
      <line x1="14" x2="86" stroke="#ffc933" strokeWidth="6" strokeLinecap="round" />
      <line x1="70" x2="70" y1="0" y2="14" stroke="#ffc933" strokeWidth="6" strokeLinecap="round" />
      <line x1="84" x2="84" y1="0" y2="10" stroke="#ffc933" strokeWidth="6" strokeLinecap="round" />
    </g>
  </svg>
);
