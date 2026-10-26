import css from './game-tejo.module.css';

/** Banderines de la guirnalda: color alternado (amarillo, azul, rojo) con su posición sobre la cuerda. */
const PENNANTS = Array.from({ length: 9 }, (_, k) => k);
const COLORS = ['#fcd116', '#2f6fe0', '#ce1126'];

/**
 * Fondo de la pantalla de inicio: la cancha de noche con dos focos, una guirnalda de banderines y la caja de arcilla
 * al fondo. Es decorativo (aria-hidden) y se recorta con `slice` para cubrir cualquier proporción.
 */
export const TejoInitBg: React.FC = () => (
  <svg
    className={css['init-bg']}
    viewBox="0 0 400 600"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="tejo-bg-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#06141a" />
        <stop offset="0.55" stopColor="#0f3338" />
        <stop offset="1" stopColor="#164a48" />
      </linearGradient>
      <linearGradient id="tejo-bg-beam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff3b0" stopOpacity="0.5" />
        <stop offset="1" stopColor="#fff3b0" stopOpacity="0" />
      </linearGradient>
    </defs>

    <rect width="400" height="600" fill="url(#tejo-bg-sky)" />

    {/* Focos */}
    <path d="M30 40 0 560h150Z" fill="url(#tejo-bg-beam)" />
    <path d="M370 40 400 560H250Z" fill="url(#tejo-bg-beam)" />
    <rect x="18" y="26" width="24" height="16" rx="3" fill="#cfd8dc" />
    <rect x="358" y="26" width="24" height="16" rx="3" fill="#cfd8dc" />

    {/* Guirnalda de banderines */}
    <path d="M0 74Q200 130 400 74" fill="none" stroke="#d9c9a6" strokeWidth="2" />
    {PENNANTS.map((k) => {
      const x = 22 + k * 44.5;
      const y = 74 + Math.sin((x / 400) * Math.PI) * 52 - 2;

      return <path key={k} d={`M${x - 9} ${y}h18l-9 20Z`} fill={COLORS[k % COLORS.length]} />;
    })}

    {/* Suelo y caja de arcilla al fondo */}
    <rect y="470" width="400" height="130" fill="#0c2a2f" />
    <rect y="470" width="400" height="3" fill="#ffffff" opacity="0.25" />
    <rect x="60" y="484" width="280" height="86" rx="10" fill="#6e3d1c" stroke="#3d200c" strokeWidth="3" />
    <rect x="72" y="494" width="256" height="66" rx="6" fill="#7d6050" />
    <circle cx="200" cy="527" r="12" fill="#1a1210" stroke="#c3ccd1" strokeWidth="4" />
    <path d="M200 505l5 8h-10ZM178 527l8-5v10ZM222 527l-8 5v-10ZM200 549l-5-8h10Z" fill="#fcd116" opacity="0.9" />
  </svg>
);
