import css from './game-rana.module.css';

/** Tiras del toldo: se alternan los colores y cada una termina en un festón. */
const STRIPES = Array.from({ length: 10 }, (_, k) => k);

/**
 * Fondo de la pantalla de inicio: el toldo de rayas de una caseta de kermés, bombillas y, al fondo, el mostrador con
 * la rana asomada. Es decorativo (aria-hidden) y se recorta con `slice` para cubrir cualquier proporción.
 */
export const RanaInitBg: React.FC = () => (
  <svg
    className={css['init-bg']}
    viewBox="0 0 400 600"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="rana-bg-night" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1c0a16" />
        <stop offset="0.6" stopColor="#3b1630" />
        <stop offset="1" stopColor="#4a1737" />
      </linearGradient>
    </defs>

    <rect width="400" height="600" fill="url(#rana-bg-night)" />

    {/* Estrellas */}
    {[
      [40, 150],
      [120, 190],
      [300, 160],
      [360, 210],
      [70, 250],
      [330, 270]
    ].map(([x, y]) => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r="1.800" fill="#ffffff" opacity="0.6" />
    ))}

    {/* Toldo de rayas con festones */}
    {STRIPES.map((k) => (
      <path
        key={k}
        d={`M${k * 40} 0h40v64q-20 22-40 0Z`}
        fill={k % 2 ? '#fff4dc' : '#c8334a'}
        stroke="#7a1a2c"
        strokeWidth="1.500"
      />
    ))}
    <rect y="0" width="400" height="10" fill="#7a1a2c" />

    {/* Bombillas */}
    {Array.from({ length: 9 }, (_, k) => {
      const x = 22 + k * 44.5;

      return (
        <circle
          key={k}
          cx={x}
          cy={96 + Math.sin((x / 400) * Math.PI) * 14}
          r="5"
          fill={['#fcd116', '#ff5c8a', '#7fe3a8'][k % 3]}
        />
      );
    })}

    {/* Mostrador con la rana asomada */}
    <rect y="500" width="400" height="100" fill="#2b1209" />
    <rect y="494" width="400" height="12" fill="#a8683a" />
    <ellipse cx="200" cy="486" rx="64" ry="38" fill="#4fa84a" stroke="#1f5d2a" strokeWidth="3" />
    <circle cx="168" cy="456" r="15" fill="#9be184" stroke="#1f5d2a" strokeWidth="3" />
    <circle cx="232" cy="456" r="15" fill="#9be184" stroke="#1f5d2a" strokeWidth="3" />
    <circle cx="169" cy="457" r="8" fill="#ffffff" />
    <circle cx="231" cy="457" r="8" fill="#ffffff" />
    <circle cx="171" cy="459" r="4" fill="#14050c" />
    <circle cx="229" cy="459" r="4" fill="#14050c" />
    <ellipse cx="200" cy="492" rx="24" ry="14" fill="#14050c" />
  </svg>
);
