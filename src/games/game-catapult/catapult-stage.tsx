import { useId } from 'react';

import { arcPath, ARM, ARM_ROT, armTip, GROUND, PIVOT, towerX, VIEW_H, VIEW_W } from './lib/layout';

import css from './game-catapult.module.css';

interface Props {
  /** Texto para lectores de pantalla: el dibujo es solo visual. */
  label: string;
  /** Distancia (m) a la torre enemiga y si ya está derribada. */
  target: number;
  towerDown: boolean;
  /** Distancias de las torres ya derribadas: quedan sus ruinas. */
  downed: number[];
  /** Ángulo y fuerza apuntados: con `guide` se dibuja el comienzo del vuelo. */
  angle: number;
  power: number;
  guide?: boolean;
  /** La piedra está cargada en la catapulta (o vuela). */
  loaded?: boolean;
  /** Es una bola de fuego. */
  fireball?: boolean;
  /** El brazo está armado (listo para cargar) o soltado (acaba de disparar). */
  arm?: 'cocked' | 'released';
  /** Vuelo del último disparo, que queda dibujado como referencia. */
  ghost?: { angle: number; power: number } | null;
  /** Cambia con cada disparo: la piedra se vuelve a dibujar desde cero (la anima GSAP, no React). */
  shotKey?: number;
  /** Cambia con cada torre nueva: la torre se levanta de nuevo. */
  towerKey?: number;
  svgRef?: React.Ref<SVGSVGElement>;
}

/** Marcas de distancia sobre el suelo (m). */
const RULER = [20, 40, 60];

/** Ruinas de una torre: unos bloques caídos. */
const Rubble: React.FC<{ x: number }> = ({ x }) => (
  <g transform={`translate(${x} ${GROUND})`} data-rubble="">
    <path d="M-16 0L-12 -9L-5 -6L0 -13L7 -7L14 -10L17 0Z" fill="#b9a784" stroke="#6b5a3a" strokeWidth="1.5" />
    <rect x="-9" y="-5" width="7" height="5" fill="#cdbb98" stroke="#6b5a3a" strokeWidth="1" />
    <rect x="3" y="-4" width="6" height="4" fill="#a89573" stroke="#6b5a3a" strokeWidth="1" />
  </g>
);

/**
 * El campo de batalla: cielo, colinas, el castillo lejano, la torre enemiga con su diana en el suelo, la catapulta con
 * su piedra y, mientras se apunta, el comienzo del vuelo. Solo dibuja; quien lo usa decide qué se ve y lo anima.
 */
export const CatapultStage: React.FC<Props> = ({
  label,
  target,
  towerDown,
  downed,
  angle,
  power,
  guide = false,
  loaded = false,
  fireball = false,
  arm = 'cocked',
  ghost = null,
  shotKey = 0,
  towerKey = 0,
  svgRef
}) => {
  const uid = useId().replace(/:/g, '');
  const sky = `${uid}-sky`;
  const tip = armTip(ARM_ROT.cocked);
  const x = towerX(target);
  const rot = ARM_ROT[arm];

  return (
    <svg
      ref={svgRef}
      className={css.stage}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6fc0f0" />
          <stop offset="0.7" stopColor="#cdeaf8" />
          <stop offset="1" stopColor="#fff0cf" />
        </linearGradient>
      </defs>

      <rect width={VIEW_W} height={VIEW_H} fill={`url(#${sky})`} />
      <circle cx="338" cy="36" r="22" fill="#fff6c4" opacity="0.5" />
      <circle cx="338" cy="36" r="12" fill="#fff3b0" />

      <g transform="translate(70 34)">
        <g className={css.cloud}>
          <ellipse cx="0" cy="0" rx="22" ry="7" fill="#ffffff" opacity="0.92" />
          <ellipse cx="-10" cy="-5" rx="12" ry="7" fill="#ffffff" opacity="0.92" />
          <ellipse cx="9" cy="-6" rx="10" ry="6" fill="#ffffff" opacity="0.92" />
        </g>
      </g>
      <g transform="translate(210 22) scale(0.8)">
        <g className={css.cloud}>
          <ellipse cx="0" cy="0" rx="22" ry="7" fill="#ffffff" opacity="0.92" />
          <ellipse cx="-10" cy="-5" rx="12" ry="7" fill="#ffffff" opacity="0.92" />
          <ellipse cx="9" cy="-6" rx="10" ry="6" fill="#ffffff" opacity="0.92" />
        </g>
      </g>

      {/* Colinas y el castillo lejano del enemigo */}
      <path d="M0 150Q60 118 130 140T270 132T400 146V170H0Z" fill="#a9d6a4" />
      <g opacity="0.75">
        <rect x="352" y="112" width="48" height="52" fill="#98a0c4" />
        <rect x="346" y="96" width="14" height="68" fill="#8890b8" />
        <rect x="392" y="100" width="12" height="64" fill="#8890b8" />
        <path d="M346 96h4v-5h4v5h4v-5h2v5ZM352 112h6v-4h6v4h6v-4h6v4h6v-4h6v4Z" fill="#8890b8" />
        <path d="M368 164v-14a5 5 0 0 1 10 0v14Z" fill="#5d6590" />
      </g>
      <path d="M0 158Q80 138 170 152T400 150V170H0Z" fill="#7fc47a" />

      {/* Suelo, con una marca de distancia cada 20 metros desde la catapulta */}
      <rect y={GROUND} width={VIEW_W} height={VIEW_H - GROUND} fill="#8a5a34" />
      <rect y={GROUND - 2} width={VIEW_W} height="9" fill="#6cc067" />
      {RULER.map((m) => (
        <g key={m}>
          <path d={`M${towerX(m)} ${GROUND + 7}V${GROUND + 13}`} stroke="#f5e6c6" strokeWidth="1.2" />
          <text x={towerX(m)} y={GROUND + 23} textAnchor="middle" fontSize="8" fontWeight="700" fill="#f5e6c6">
            {m} m
          </text>
        </g>
      ))}

      {downed
        .filter((d) => d !== target || towerDown)
        .map((d) => (
          <Rubble key={d} x={towerX(d)} />
        ))}

      {/* Última trayectoria de referencia y comienzo del vuelo apuntado */}
      {ghost && (
        <path
          d={arcPath(ghost.angle, ghost.power)}
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.6"
          strokeDasharray="1 5"
          strokeLinecap="round"
          opacity="0.7"
        />
      )}
      {guide && (
        <path
          d={arcPath(angle, power, 0, 0.32, 14)}
          fill="none"
          stroke="#ffc233"
          strokeWidth="2.4"
          strokeDasharray="1 6"
          strokeLinecap="round"
        />
      )}

      {/* La torre enemiga con su diana: el aro de fuera la derriba, el del centro es impacto directo */}
      <ellipse cx={x} cy={GROUND + 3} rx="16" ry="4.500" fill="#ff7a59" opacity="0.55" />
      <ellipse cx={x} cy={GROUND + 3} rx="6" ry="2.500" fill="#ffffff" opacity="0.9" />
      {!towerDown && (
        <g key={`tower-${towerKey}`} transform={`translate(${x} ${GROUND})`} data-tower="">
          <g className={css['tower-in']}>
            <rect x="-12" y="-58" width="24" height="58" fill="#cdbb98" stroke="#6b5a3a" strokeWidth="1.800" />
            <path
              d="M-12 -58h4v-7h5v7h6v-7h5v7h4V-58ZM-12 -34H12M-12 -18H12M-4 -34v16M5 -18v-16"
              fill="#cdbb98"
              stroke="#6b5a3a"
              strokeWidth="1.500"
            />
            <rect x="-2" y="-50" width="4" height="9" rx="2" fill="#4b3a22" />
            <path d="M-5 0v-9a5 5 0 0 1 10 0v9Z" fill="#4b3a22" />
            <path d="M0 -65V-86" stroke="#4b3a22" strokeWidth="1.800" strokeLinecap="round" />
            <path d="M0 -86L16 -81L0 -76Z" fill="#e0383e" stroke="#4b3a22" strokeWidth="1" strokeLinejoin="round" />
            <text x="0" y="-92" textAnchor="middle" fontSize="9" fontWeight="800" fill="#4b2a14">
              {target} m
            </text>
          </g>
        </g>
      )}

      {/* Catapulta */}
      <g data-catapult="">
        <path d="M28 152H76V160H28Z" fill="#8b5a2b" stroke="#4b2e14" strokeWidth="1.500" />
        <path
          d={`M36 152L${PIVOT.x} ${PIVOT.y}M68 152L${PIVOT.x} ${PIVOT.y}`}
          stroke="#6b4220"
          strokeWidth="4.500"
          strokeLinecap="round"
        />
        <g transform={`translate(${PIVOT.x} ${PIVOT.y}) rotate(${rot})`} data-arm="">
          <path d={`M-8 0H${ARM}`} stroke="#8b5a2b" strokeWidth="5" strokeLinecap="round" />
          <circle cx={ARM} cy="0" r="6" fill="none" stroke="#4b2e14" strokeWidth="2.200" />
          <rect x="-14" y="-5" width="9" height="10" rx="1.500" fill="#5a5a6e" stroke="#33333f" strokeWidth="1.200" />
        </g>
        <circle cx={PIVOT.x} cy={PIVOT.y} r="3" fill="#33333f" />
        {[38, 66].map((wx) => (
          <g key={wx} transform={`translate(${wx} 158)`}>
            <circle r="8" fill="#6b4220" stroke="#33200f" strokeWidth="1.800" />
            <path
              d="M-8 0H8M0 -8V8M-5.600 -5.600L5.600 5.600M-5.600 5.600L5.600 -5.600"
              stroke="#33200f"
              strokeWidth="1"
            />
          </g>
        ))}
      </g>

      {/* La piedra: cargada en la punta del brazo (o volando, animada por GSAP) */}
      <g key={`shot-${shotKey}`} data-ball-wrap="">
        {loaded && (
          <g data-ball="" transform={`translate(${tip.x} ${tip.y})`}>
            {fireball && (
              <>
                <circle r="11" fill="#ff7a1a" opacity="0.35" />
                <path d="M-5 -6Q0 -18 5 -6Z" fill="#ffc233" />
              </>
            )}
            <circle r="5.500" fill={fireball ? '#ff4d2e' : '#7b7f93'} stroke="#2d2f3f" strokeWidth="1.500" />
            <circle cx="-1.600" cy="-1.800" r="1.500" fill="#ffffff" opacity="0.45" />
          </g>
        )}
      </g>
    </svg>
  );
};
