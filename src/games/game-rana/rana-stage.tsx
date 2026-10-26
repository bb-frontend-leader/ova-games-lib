import { useId } from 'react';

import { HOLES } from './lib/constant';
import { CABINET, HAND, HOLE_AT, SLOTS, VIEW_H, VIEW_W } from './lib/layout';

import type { HoleId } from './types/types';

import css from './game-rana.module.css';

/** Bombillas de la guirnalda de la kermés: posición sobre la cuerda y color. */
const LIGHTS = Array.from({ length: 13 }, (_, k) => k);
const LIGHT_COLORS = ['#fcd116', '#ff5c8a', '#7fe3a8', '#8fb8ff'];

/** Dónde va la placa con los puntos de cada hoyo. */
const PLAQUE: Record<HoleId, { x: number; y: number }> = {
  rana: { x: 320, y: 150 },
  molino: { x: 226, y: 250 },
  puente: { x: 414, y: 250 },
  tortuga: { x: 404, y: 280 },
  hoyo: { x: 320, y: 336 }
};

interface Props {
  svgRef?: React.Ref<SVGSVGElement>;
  /** Descripción del escenario para lectores de pantalla. */
  label: string;
  /** Hoyo apuntado (con él se dibuja la mira) y hoyo doble de este turno. */
  aim?: HoleId | null;
  hot: HoleId;
  /** La moneda está en la mano, lista para lanzar. */
  loaded?: boolean;
  /** La moneda vuela (su dibujo lo mueve el juego). */
  flying?: boolean;
  /** Resultado del último lanzamiento: el hoyo se ilumina si entró. */
  result?: { hole: HoleId; hit: boolean } | null;
  /** Cambia con cada pregunta: reinicia los destellos. */
  roundKey?: number;
}

const Coin: React.FC<{ id: string; r?: number }> = ({ id, r = 14 }) => (
  <>
    <circle r={r} fill={`url(#${id}-coin)`} stroke="#8a6600" strokeWidth="2" />
    <circle r={r * 0.58} fill="none" stroke="#8a6600" strokeWidth="1.800" opacity="0.8" />
    <path
      d={`M${-r * 0.2} ${-r * 0.2}v${r * 0.4}M${r * 0.2} ${-r * 0.2}v${r * 0.4}`}
      stroke="#8a6600"
      strokeWidth="1.600"
      opacity="0.7"
    />
  </>
);

/**
 * La mesa de rana vista de frente: la rana arriba con la boca abierta y, debajo, el molino, el puente, la tortuga y
 * la fila de hoyos, cada uno con su placa de puntos. Abajo, la mano que lanza. Marca el hoyo doble y el apuntado.
 */
export const RanaStage: React.FC<Props> = ({
  svgRef,
  label,
  aim = null,
  hot,
  loaded = false,
  flying = false,
  result = null,
  roundKey = 0
}) => {
  const uid = useId().replace(/:/g, '');
  const ids = Object.keys(HOLES) as HoleId[];
  const ring = (id: HoleId) => (id === 'hoyo' ? null : HOLE_AT[id]);

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
        <linearGradient id={`${uid}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b0d22" />
          <stop offset="1" stopColor="#4a1737" />
        </linearGradient>
        <linearGradient id={`${uid}-wood`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b5733f" />
          <stop offset="1" stopColor="#6e3d1c" />
        </linearGradient>
        <radialGradient id={`${uid}-frog`} cx="0.5" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#7ed36a" />
          <stop offset="1" stopColor="#2f8a3d" />
        </radialGradient>
        <radialGradient id={`${uid}-coin`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fff3a8" />
          <stop offset="0.55" stopColor="#fcd116" />
          <stop offset="1" stopColor="#b88a00" />
        </radialGradient>
        <radialGradient id={`${uid}-hole`} cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#14050c" />
          <stop offset="1" stopColor="#3a1424" />
        </radialGradient>
      </defs>

      {/* Fondo de la kermés y guirnalda de bombillas */}
      <rect width={VIEW_W} height={VIEW_H} fill={`url(#${uid}-bg)`} />
      <path d="M0 22Q320 74 640 22" fill="none" stroke="#e0cfa8" strokeWidth="2" />
      {LIGHTS.map((k) => {
        const x = 26 + k * 48.5;
        const y = 22 + Math.sin((x / VIEW_W) * Math.PI) * 38 + 2;

        return <circle key={k} cx={x} cy={y} r="6" fill={LIGHT_COLORS[k % LIGHT_COLORS.length]} className={css.bulb} />;
      })}
      <rect y="352" width={VIEW_W} height="48" fill="#1c0a16" opacity="0.55" />

      {/* Mueble de madera con el panel pintado */}
      <rect
        x={CABINET.x}
        y={CABINET.y}
        width={CABINET.w}
        height={CABINET.h}
        rx="18"
        fill={`url(#${uid}-wood)`}
        stroke="#3d200c"
        strokeWidth="4"
      />
      <rect
        x={CABINET.x + 14}
        y={CABINET.y + 14}
        width={CABINET.w - 28}
        height={CABINET.h - 28}
        rx="10"
        fill="#1d5a3c"
        stroke="#fcd116"
        strokeWidth="3"
      />

      {/* La rana: cuerpo, ojos y la boca abierta que es el hoyo grande */}
      <g data-hole-art="rana">
        <ellipse cx="320" cy="98" rx="104" ry="68" fill={`url(#${uid}-frog)`} stroke="#1f5d2a" strokeWidth="3" />
        <circle cx="262" cy="46" r="22" fill="#9be184" stroke="#1f5d2a" strokeWidth="3" />
        <circle cx="378" cy="46" r="22" fill="#9be184" stroke="#1f5d2a" strokeWidth="3" />
        <circle cx="264" cy="46" r="13" fill="#ffffff" />
        <circle cx="376" cy="46" r="13" fill="#ffffff" />
        <g data-pupils="">
          <circle cx="266" cy="48" r="6.500" fill="#14050c" />
          <circle cx="374" cy="48" r="6.500" fill="#14050c" />
        </g>
        <g data-mouth="" className={css.mouth}>
          <ellipse cx="320" cy="112" rx="40" ry="26" fill={`url(#${uid}-hole)`} stroke="#1f5d2a" strokeWidth="4" />
          <ellipse cx="320" cy="122" rx="22" ry="10" fill="#ff6f91" opacity="0.85" />
        </g>
      </g>

      {/* El molino: torre, aspas y la puerta que es el hoyo */}
      <g data-hole-art="molino">
        <path d="M200 240 211 176h30l11 64Z" fill="#d9b88a" stroke="#6e4a1f" strokeWidth="3" strokeLinejoin="round" />
        <path d="M205 176 226 154l21 22Z" fill="#b8423a" stroke="#6e1f1a" strokeWidth="3" strokeLinejoin="round" />
        <g transform="translate(226 164)">
          <g className={css.blades}>
            {[0, 90, 180, 270].map((deg) => (
              <rect
                key={deg}
                x="-3"
                y="-30"
                width="6"
                height="30"
                rx="2"
                fill="#f3e6c8"
                stroke="#6e4a1f"
                strokeWidth="1.800"
                transform={`rotate(${deg})`}
              />
            ))}
          </g>
          <circle r="5" fill="#6e4a1f" />
        </g>
        <circle
          cx={HOLE_AT.molino.x}
          cy={HOLE_AT.molino.y}
          r={HOLE_AT.molino.r}
          fill={`url(#${uid}-hole)`}
          stroke="#6e4a1f"
          strokeWidth="4"
        />
      </g>

      {/* El puente: arco de piedra con el túnel que es el hoyo */}
      <g data-hole-art="puente">
        <path
          d="M372 240V208C372 188 390 176 414 176S456 188 456 208V240Z"
          fill="#b9b2a0"
          stroke="#5f5a4c"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M372 224h84M388 240v-16M414 240v-16M440 240v-16M381 224v-12M401 224v-12M427 224v-12M447 224v-12"
          stroke="#5f5a4c"
          strokeWidth="2"
          opacity="0.55"
        />
        <ellipse
          cx={HOLE_AT.puente.x}
          cy={HOLE_AT.puente.y}
          rx="21"
          ry="18"
          fill={`url(#${uid}-hole)`}
          stroke="#5f5a4c"
          strokeWidth="4"
        />
      </g>

      {/* La tortuga: caparazón con el hoyo en el centro */}
      <g data-hole-art="tortuga">
        <ellipse cx="368" cy="266" rx="14" ry="11" fill="#7ed36a" stroke="#1f5d2a" strokeWidth="3" />
        <ellipse cx="288" cy="282" rx="10" ry="7" fill="#7ed36a" stroke="#1f5d2a" strokeWidth="3" />
        <ellipse cx="352" cy="282" rx="10" ry="7" fill="#7ed36a" stroke="#1f5d2a" strokeWidth="3" />
        <ellipse cx="320" cy="258" rx="44" ry="27" fill="#b57a3a" stroke="#5d3a14" strokeWidth="3" />
        <path
          d="M290 246q30-14 60 0M284 262q36 12 72 0"
          fill="none"
          stroke="#5d3a14"
          strokeWidth="2.500"
          opacity="0.6"
        />
        <circle
          cx={HOLE_AT.tortuga.x}
          cy={HOLE_AT.tortuga.y}
          r={HOLE_AT.tortuga.r}
          fill={`url(#${uid}-hole)`}
          stroke="#5d3a14"
          strokeWidth="4"
        />
      </g>

      {/* Los hoyos de la fila de abajo */}
      <g data-hole-art="hoyo">
        {SLOTS.map((s) => (
          <circle
            key={s.x}
            cx={s.x}
            cy={s.y}
            r={HOLE_AT.hoyo.r}
            fill={`url(#${uid}-hole)`}
            stroke="#fcd116"
            strokeWidth="3"
          />
        ))}
      </g>

      {/* Placas con los puntos */}
      {ids.map((id) => (
        <g key={id} transform={`translate(${PLAQUE[id].x} ${PLAQUE[id].y})`} aria-hidden="true">
          <rect x="-19" y="-9" width="38" height="18" rx="9" fill="#fcd116" stroke="#8a6600" strokeWidth="2" />
          <text y="4.500" textAnchor="middle" fontSize="13" fontWeight="900" fill="#2b1d12">
            {HOLES[id].points}
          </text>
        </g>
      ))}

      {/* Hoyo doble: resplandor y sello ×2 */}
      <g key={`hot-${roundKey}-${hot}`} className={css.hot} data-hot={hot}>
        {ring(hot) ? (
          <circle
            cx={HOLE_AT[hot].x}
            cy={HOLE_AT[hot].y}
            r={HOLE_AT[hot].r + 9}
            fill="rgb(255 226 90 / 0.22)"
            stroke="#ffe25a"
            strokeWidth="3"
          />
        ) : (
          <rect
            x="172"
            y="288"
            width="296"
            height="40"
            rx="20"
            fill="rgb(255 226 90 / 0.22)"
            stroke="#ffe25a"
            strokeWidth="3"
          />
        )}
        <g
          transform={`translate(${HOLE_AT[hot].x + (hot === 'hoyo' ? 150 : HOLE_AT[hot].r + 16)} ${HOLE_AT[hot].y - (hot === 'hoyo' ? 0 : HOLE_AT[hot].r + 4)})`}
        >
          <circle r="13" fill="#ff5c8a" stroke="#ffffff" strokeWidth="2.500" />
          <text y="5" textAnchor="middle" fontSize="13" fontWeight="900" fill="#ffffff">
            ×2
          </text>
        </g>
      </g>

      {/* Mira: línea de la mano al hoyo y aro punteado */}
      {aim && (
        <g className={css.reticle} data-reticle={aim}>
          <path
            d={`M${HAND.x} ${HAND.y - 26}L${aim === 'hoyo' ? 320 : HOLE_AT[aim].x} ${aim === 'hoyo' ? 308 : HOLE_AT[aim].y}`}
            stroke="#ffffff"
            strokeWidth="2.500"
            strokeDasharray="2 8"
            strokeLinecap="round"
            opacity="0.55"
          />
          {aim === 'hoyo' ? (
            <rect
              className={css.pick}
              x="166"
              y="282"
              width="308"
              height="52"
              rx="26"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeDasharray="8 7"
            />
          ) : (
            <circle
              className={css.pick}
              cx={HOLE_AT[aim].x}
              cy={HOLE_AT[aim].y}
              r={HOLE_AT[aim].r + (aim === 'rana' ? 16 : 14)}
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeDasharray="8 7"
            />
          )}
        </g>
      )}

      {/* Destello del hoyo en el que acaba de entrar la moneda */}
      {result?.hit && (
        <g key={`glint-${roundKey}`} className={css.glint} data-glint={result.hole}>
          {result.hole === 'hoyo' ? (
            <rect x="172" y="288" width="296" height="40" rx="20" fill="none" stroke="#7fe3a8" strokeWidth="4" />
          ) : (
            <circle
              cx={HOLE_AT[result.hole].x}
              cy={HOLE_AT[result.hole].y}
              r={HOLE_AT[result.hole].r + 6}
              fill="none"
              stroke="#7fe3a8"
              strokeWidth="4"
            />
          )}
        </g>
      )}

      {/* Moneda en el aire: la mueve el juego (transform) y solo se ve mientras vuela */}
      <g opacity={flying ? 1 : 0} data-flight="">
        <g data-coin="">
          <Coin id={uid} />
        </g>
      </g>

      {/* La mano que lanza, con la moneda cuando está cargada */}
      <g transform={`translate(${HAND.x} ${HAND.y})`}>
        <rect x="-19" y="6" width="38" height="44" rx="12" fill="#c98a5a" />
        <circle cx="0" cy="0" r="18" fill="#e0a97a" />
        {loaded && (
          <g transform="translate(0 -12) scale(1.300)">
            <Coin id={uid} />
          </g>
        )}
      </g>
    </svg>
  );
};
