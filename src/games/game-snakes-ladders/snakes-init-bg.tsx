import css from './game-snakes-ladders.module.css';

/** Hoja de palmera: un tallo curvo con hojas a los lados. Se dibuja desde (0, 0) hacia arriba. */
const Palm: React.FC<{ x: number; y: number; scale: number }> = ({ x, y, scale }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-5 0c2-40 0-70 8-100h8c-6 30-4 60-4 100Z" fill="#6b4a2b" />
    <g fill="#1f7a4a">
      <path d="M6-100C-20-120-50-110-70-85-40-95-20-95 6-100Z" />
      <path d="M6-100C30-125 62-118 80-92 52-100 28-98 6-100Z" />
      <path d="M6-100C-6-130-4-150 12-165 14-140 12-120 6-100Z" />
      <path d="M6-100C-30-100-55-80-60-55-35-75-15-85 6-100Z" fill="#2c9a5c" />
      <path d="M6-100C40-100 66-80 70-52 46-74 26-86 6-100Z" fill="#2c9a5c" />
    </g>
  </g>
);

/**
 * Fondo de la pantalla de inicio: una selva al atardecer con palmeras, una serpiente enroscada y una escalera de
 * madera apoyada en una colina. Es decorativo (aria-hidden) y se recorta con `slice` para cubrir cualquier proporción.
 */
export const SnakesInitBg: React.FC = () => (
  <svg
    className={css['init-bg']}
    viewBox="0 0 400 600"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <linearGradient id="snakes-bg-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1b4f72" />
        <stop offset="0.5" stopColor="#e9967a" />
        <stop offset="1" stopColor="#ffd9a0" />
      </linearGradient>
      <radialGradient id="snakes-bg-sun" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#fff2b8" stopOpacity="1" />
        <stop offset="1" stopColor="#ffd37a" stopOpacity="0" />
      </radialGradient>
    </defs>

    <rect width="400" height="600" fill="url(#snakes-bg-sky)" />
    <circle cx="90" cy="290" r="120" fill="url(#snakes-bg-sun)" />
    <circle cx="90" cy="290" r="32" fill="#fff0b0" />

    {/* Colinas lejanas */}
    <path d="M0 340c70-40 150-50 230-20 80 28 130 20 170-4V600H0Z" fill="#3f8f6a" />
    <path d="M0 400c80-34 170-34 250-6 60 20 110 14 150-8V600H0Z" fill="#2c7a57" />

    <Palm x={340} y={400} scale={0.9} />
    <Palm x={40} y={420} scale={0.7} />

    {/* Escalera apoyada en la colina de la derecha */}
    <g strokeLinecap="round" transform="translate(300 540) rotate(14)">
      <line x1="0" y1="0" x2="-22" y2="-170" stroke="#6b3f17" strokeWidth="7" />
      <line x1="34" y1="0" x2="12" y2="-170" stroke="#6b3f17" strokeWidth="7" />
      {[-25, -60, -95, -130].map((y, k) => (
        <line
          key={y}
          x1={-(k * 0 + (y / -170) * 22)}
          y1={y}
          x2={34 - (y / -170) * 22}
          y2={y}
          stroke="#b97d38"
          strokeWidth="5"
        />
      ))}
    </g>

    {/* Primer plano y serpiente enroscada */}
    <path d="M0 490c90-30 180-20 260 8 50 16 100 14 140-4V600H0Z" fill="#1f6a49" />
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M40 560c40-22 90-6 120-30s40-50 10-60c-26-8-46 14-30 30 14 14 40 6 44-14"
        stroke="#0f4a2a"
        strokeWidth="19"
      />
      <path
        d="M40 560c40-22 90-6 120-30s40-50 10-60c-26-8-46 14-30 30 14 14 40 6 44-14"
        stroke="#38b26a"
        strokeWidth="13"
      />
      <path
        d="M40 560c40-22 90-6 120-30s40-50 10-60c-26-8-46 14-30 30 14 14 40 6 44-14"
        stroke="#d6f7df"
        strokeOpacity="0.6"
        strokeWidth="4"
        strokeDasharray="4 11"
      />
    </g>
    <g transform="translate(184 488) rotate(-18)">
      <ellipse rx="15" ry="11" fill="#38b26a" stroke="#0f4a2a" strokeWidth="3" />
      <circle cx="4" cy="-5" r="3.500" fill="#ffffff" />
      <circle cx="4" cy="5" r="3.500" fill="#ffffff" />
      <circle cx="5" cy="-5" r="1.600" fill="#111111" />
      <circle cx="5" cy="5" r="1.600" fill="#111111" />
      <path d="M14 0l11-3M14 0l11 3" stroke="#e5243b" strokeWidth="2" strokeLinecap="round" />
    </g>

    {/* Velo oscuro: baja el contraste del fondo para que el texto del inicio se lea siempre */}
    <rect width="400" height="600" fill="#0b2a20" opacity="0.4" />
  </svg>
);
