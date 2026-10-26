import css from './game-lane-race.module.css';

/** Bandera de cuadros de 4 x 3 casillas con su esquina superior izquierda en (`x`, `y`). */
const Checkered: React.FC<{ x: number; y: number; size: number }> = ({ x, y, size }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width={size * 4} height={size * 3} fill="#ffffff" />
    {Array.from({ length: 12 }, (_, k) => ({ cx: k % 4, cy: Math.floor(k / 4) }))
      .filter(({ cx, cy }) => (cx + cy) % 2 === 0)
      .map(({ cx, cy }) => (
        <rect key={`${cx}-${cy}`} x={cx * size} y={cy * size} width={size} height={size} fill="#14181f" />
      ))}
  </g>
);

/**
 * Fondo de la pantalla de inicio: un atardecer sobre una recta de meta con la pista en perspectiva, un arco con
 * bandera de cuadros y un coche. Es decorativo (aria-hidden) y se recorta con `slice` para cubrir cualquier proporción.
 */
export const LanesInitBg: React.FC = () => (
  <svg
    className={css['init-bg']}
    viewBox="0 0 400 600"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="lanes-bg-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1b2a4e" />
        <stop offset="0.45" stopColor="#c8486a" />
        <stop offset="1" stopColor="#ffb25a" />
      </linearGradient>
      <linearGradient id="lanes-bg-road" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3a4352" />
        <stop offset="1" stopColor="#1d222b" />
      </linearGradient>
    </defs>

    <rect width="400" height="600" fill="url(#lanes-bg-sky)" />
    <circle cx="300" cy="250" r="46" fill="#ffe29a" opacity="0.9" />

    {/* Gradas lejanas */}
    <path d="M0 290h400v40H0Z" fill="#2a3350" />
    <g fill="#ffd9a0" opacity="0.7">
      {Array.from({ length: 40 }, (_, k) => (
        <rect key={k} x={k * 10 + 2} y={296 + (k % 3) * 6} width="5" height="4" />
      ))}
    </g>

    {/* Pista en perspectiva, con bordillos rojos */}
    <path d="M150 330h100L420 600H-20Z" fill="url(#lanes-bg-road)" />
    <path d="M150 330h-14L-60 600H-20Z" fill="#e5383b" opacity="0.9" />
    <path d="M250 330h14L460 600H420Z" fill="#e5383b" opacity="0.9" />
    <g stroke="#ffffff" strokeWidth="3" strokeDasharray="14 12" opacity="0.8" fill="none">
      <path d="M183 330 130 600" />
      <path d="M217 330 270 600" />
    </g>

    {/* Arco de meta */}
    <g>
      <rect x="128" y="300" width="9" height="40" fill="#cfd5e0" />
      <rect x="263" y="300" width="9" height="40" fill="#cfd5e0" />
      <Checkered x={140} y={296} size={10} />
      <Checkered x={220} y={296} size={10} />
      <rect x="128" y="286" width="144" height="12" rx="3" fill="#ffc933" />
    </g>

    {/* Coche en primer plano, visto desde arriba y mirando a la meta */}
    <g transform="translate(200 520) rotate(-90) scale(2.600)">
      <g fill="#14181f">
        <rect x="-23" y="-15.500" width="13" height="6.500" rx="2" />
        <rect x="10" y="-15.500" width="13" height="6.500" rx="2" />
        <rect x="-23" y="9" width="13" height="6.500" rx="2" />
        <rect x="10" y="9" width="13" height="6.500" rx="2" />
      </g>
      <rect x="-30" y="-11" width="60" height="22" rx="10" fill="#e5383b" stroke="#14181f" strokeWidth="2" />
      <rect x="-30" y="-1.500" width="60" height="3" fill="#ffffff" opacity="0.75" />
      <rect x="-10" y="-7.500" width="22" height="15" rx="4.500" fill="#1d2a3a" stroke="#14181f" strokeWidth="1.500" />
    </g>

    {/* Velo oscuro: baja el contraste del fondo para que el texto del inicio se lea siempre */}
    <rect width="400" height="600" fill="#0b1020" opacity="0.45" />
  </svg>
);
