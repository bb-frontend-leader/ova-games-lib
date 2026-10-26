import css from './game-loteria.module.css';

const FLAGS = ['#ff5a8a', '#ffd24a', '#2ec4b6', '#8e5bd6', '#ff7a59', '#5aa9ff'];

/**
 * Una guirnalda de banderines de papel picado: una cuerda que cuelga entre dos puntos (`y0`, `y1` a los lados y
 * `sag` de caída en el centro) con un banderín cada 36 px.
 */
const Bunting: React.FC<{ y0: number; y1: number; sag: number; offset: number }> = ({ y0, y1, sag, offset }) => {
  const ctrl = (y0 + y1) / 2 + sag * 2; // Punto de control: la cuerda cae `sag` px en el centro
  const at = (x: number) => {
    const u = x / 400;

    // Curva cuadrática de la cuerda
    return (1 - u) * (1 - u) * y0 + 2 * (1 - u) * u * ctrl + u * u * y1;
  };

  return (
    <g>
      <path d={`M0 ${y0} Q200 ${ctrl} 400 ${y1}`} fill="none" stroke="#fff4d6" strokeWidth="1.500" />
      {Array.from({ length: 11 }, (_, k) => {
        const x = 18 + k * 36;
        const y = at(x);
        const fill = FLAGS[(k + offset) % FLAGS.length];

        return (
          <g key={k} transform={`translate(${x} ${y})`}>
            <path d="M-12 0h24v24l-6-5-6 5-6-5-6 5Z" fill={fill} />
            <circle cx="0" cy="8" r="3.200" fill="#fff4d6" opacity="0.85" />
            <path d="M-8 3h3M5 3h3M-8 14h3M5 14h3" stroke="#fff4d6" strokeWidth="1.600" opacity="0.7" />
          </g>
        );
      })}
    </g>
  );
};

/**
 * Fondo de la pantalla de inicio: un atardecer de fiesta con guirnaldas de papel picado arriba y un mantel de rombos
 * abajo. Es decorativo (aria-hidden) y se recorta con `slice` para cubrir cualquier proporción.
 */
export const LoteriaInitBg: React.FC = () => (
  <svg
    className={css['init-bg']}
    viewBox="0 0 400 600"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="loteria-bg-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2a0a3d" />
        <stop offset="0.5" stopColor="#a3195b" />
        <stop offset="1" stopColor="#f08a3c" />
      </linearGradient>
      <pattern id="loteria-bg-cloth" width="28" height="28" patternUnits="userSpaceOnUse">
        <rect width="28" height="28" fill="#0f5b59" />
        <path d="M14 2 26 14 14 26 2 14Z" fill="#14807c" />
        <path d="M14 9 19 14 14 19 9 14Z" fill="#ffd24a" opacity="0.85" />
      </pattern>
    </defs>

    <rect width="400" height="600" fill="url(#loteria-bg-sky)" />

    <g opacity="0.55">
      <circle cx="60" cy="230" r="46" fill="#ff8fb4" opacity="0.35" />
      <circle cx="330" cy="260" r="64" fill="#ffd24a" opacity="0.3" />
      <circle cx="210" cy="190" r="30" fill="#ffffff" opacity="0.18" />
    </g>

    <Bunting y0={14} y1={20} sag={26} offset={0} />
    <Bunting y0={82} y1={70} sag={22} offset={3} />

    <rect y="470" width="400" height="130" fill="url(#loteria-bg-cloth)" />
    <rect y="470" width="400" height="6" fill="#ffd24a" />
    <rect y="476" width="400" height="30" fill="#000000" opacity="0.28" />
  </svg>
);
