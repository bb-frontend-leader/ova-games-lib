import { useId } from 'react';

import { RADIUS } from './lib/constant';
import { BOX, CLAY, HAND, mechaPoints, spotPoint, VIEW_H, VIEW_W } from './lib/layout';

import type { Point } from './types/types';

import css from './game-tejo.module.css';

/** Cabezas vistas desde arriba: el público de los costados (x, y, color del sombrero). */
const CROWD: [number, number, string][] = [
  [30, 52, '#ce1126'],
  [66, 78, '#fcd116'],
  [28, 118, '#4d8dff'],
  [62, 150, '#ffffff'],
  [32, 190, '#fcd116'],
  [68, 222, '#ce1126'],
  [30, 262, '#ffffff'],
  [610, 56, '#fcd116'],
  [574, 90, '#ce1126'],
  [612, 128, '#ffffff'],
  [578, 168, '#4d8dff'],
  [608, 206, '#ce1126'],
  [574, 244, '#fcd116'],
  [612, 280, '#4d8dff']
];

interface Props {
  svgRef?: React.Ref<SVGSVGElement>;
  /** Descripción del escenario para lectores de pantalla. */
  label: string;
  /** Sitio del bocín (índice de `SPOTS`). */
  spot: number;
  /** Punto apuntado: con él se dibuja la mira. */
  aim?: Point | null;
  /** Radio de desvío que muestra el círculo punteado de la mira. */
  wobble?: number;
  /** El tejo está en la mano, listo para lanzar. */
  loaded?: boolean;
  /** El tejo vuela (su dibujo lo mueve el juego). */
  flying?: boolean;
  /** Dónde quedó el tejo ya lanzado. */
  landed?: Point | null;
  /** Mechas (índices) que ya reventaron. */
  burnt?: number[];
  /** Cambia con cada pregunta: reinicia las mechas y el tejo caído. */
  roundKey?: number;
}

/**
 * La caja de tejo vista desde arriba: arcilla con el bocín y sus cuatro mechas, la mano que lanza abajo, la mira
 * con su círculo de desvío y el tejo, en el aire o ya caído.
 */
export const TejoStage: React.FC<Props> = ({
  svgRef,
  label,
  spot,
  aim = null,
  wobble = 0,
  loaded = false,
  flying = false,
  landed = null,
  burnt = [],
  roundKey = 0
}) => {
  const uid = useId().replace(/:/g, '');
  const center = spotPoint(spot);
  const mechas = mechaPoints(center);

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
        <linearGradient id={`${uid}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1f5b60" />
          <stop offset="1" stopColor="#0f2f35" />
        </linearGradient>
        <linearGradient id={`${uid}-wood`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a8683a" />
          <stop offset="1" stopColor="#6e3d1c" />
        </linearGradient>
        <radialGradient id={`${uid}-disc`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fff3a8" />
          <stop offset="0.55" stopColor="#fcd116" />
          <stop offset="1" stopColor="#b88a00" />
        </radialGradient>
        <radialGradient id={`${uid}-hole`} cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#0a0605" />
          <stop offset="1" stopColor="#2a1c14" />
        </radialGradient>
        <pattern id={`${uid}-clay`} width="26" height="26" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="6" r="1.400" fill="#5d4435" />
          <circle cx="18" cy="13" r="1.800" fill="#946f58" />
          <circle cx="10" cy="21" r="1.200" fill="#5d4435" />
          <circle cx="23" cy="3" r="1" fill="#a98068" />
        </pattern>
      </defs>

      {/* Suelo de la cancha, líneas y público */}
      <rect width={VIEW_W} height={VIEW_H} fill={`url(#${uid}-floor)`} />
      <rect x="80" y="0" width="480" height={VIEW_H} fill="#ffffff" opacity="0.04" />
      <path d="M96 322H544" stroke="#ffffff" strokeWidth="3" strokeDasharray="14 10" opacity="0.5" />

      {CROWD.map(([x, y, hat]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
          <ellipse cx="0" cy="3" rx="15" ry="11" fill="#0c1f23" opacity="0.5" />
          <circle r="11" fill="#d9a074" />
          <circle cx="0" cy="0" r="11" fill="none" stroke={hat} strokeWidth="3" />
        </g>
      ))}

      {/* La caja: marco de madera, arcilla y remaches */}
      <rect
        x={BOX.x}
        y={BOX.y}
        width={BOX.w}
        height={BOX.h}
        rx="14"
        fill={`url(#${uid}-wood)`}
        stroke="#3d200c"
        strokeWidth="4"
      />
      {[
        [BOX.x + 9, BOX.y + 9],
        [BOX.x + BOX.w - 9, BOX.y + 9],
        [BOX.x + 9, BOX.y + BOX.h - 9],
        [BOX.x + BOX.w - 9, BOX.y + BOX.h - 9]
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="#d8c7b0" stroke="#3d200c" strokeWidth="1" />
      ))}
      <rect x={CLAY.x} y={CLAY.y} width={CLAY.w} height={CLAY.h} rx="8" fill="#7d6050" />
      <rect x={CLAY.x} y={CLAY.y} width={CLAY.w} height={CLAY.h} rx="8" fill={`url(#${uid}-clay)`} />
      <rect x={CLAY.x} y={CLAY.y} width={CLAY.w} height={CLAY.h} rx="8" fill="none" stroke="#2f1d11" strokeWidth="3" />

      {/* Círculo de tiza: hasta aquí cuenta como «mano» */}
      <circle
        cx={center.x}
        cy={center.y}
        r={RADIUS.mano}
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeDasharray="4 7"
        opacity="0.28"
      />

      {/* Bocín y mechas (se vuelven a dibujar en cada pregunta) */}
      <g key={`bocin-${roundKey}`} className={css['bocin-in']} data-bocin="">
        <circle cx={center.x} cy={center.y} r="22" fill="#000000" opacity="0.22" />
        <circle cx={center.x} cy={center.y} r="18" fill={`url(#${uid}-hole)`} stroke="#c3ccd1" strokeWidth="5" />
        <circle cx={center.x} cy={center.y} r="20.500" fill="none" stroke="#5f6a70" strokeWidth="1.200" />

        {mechas.map((m, k) => {
          const done = burnt.includes(k);
          const deg = [45, 135, 225, 315][k] + 90;

          return (
            <g
              key={k}
              transform={`translate(${m.x.toFixed(1)} ${m.y.toFixed(1)}) rotate(${deg})`}
              data-mecha={done ? 'burnt' : ''}
            >
              <path
                d="M-9 6 0-9 9 6Z"
                fill={done ? '#2a1a12' : '#fcd116'}
                stroke={done ? '#120b07' : '#ce1126'}
                strokeWidth="2.200"
                strokeLinejoin="round"
              />
              {!done && <circle cx="0" cy="1" r="2" fill="#ce1126" />}
              {done && <circle className={css.smoke} cx="0" cy="-6" r="5" fill="#cfd6d8" opacity="0.55" />}
            </g>
          );
        })}
      </g>

      {/* Mira: línea de vuelo, desvío posible y cruz */}
      {aim && (
        <g className={css.reticle} data-reticle="">
          <path
            d={`M${HAND.x} ${HAND.y - 18}L${aim.x.toFixed(1)} ${aim.y.toFixed(1)}`}
            stroke="#ffffff"
            strokeWidth="2.500"
            strokeDasharray="2 8"
            strokeLinecap="round"
            opacity="0.6"
          />
          <circle
            cx={aim.x}
            cy={aim.y}
            r={wobble}
            fill="rgb(252 209 22 / 0.14)"
            stroke="#fcd116"
            strokeWidth="2.500"
            strokeDasharray="7 6"
          />
          <circle cx={aim.x} cy={aim.y} r="9" fill="none" stroke="#ffffff" strokeWidth="2.500" />
          <path
            d={`M${aim.x - 15} ${aim.y}h10M${aim.x + 5} ${aim.y}h10M${aim.x} ${aim.y - 15}v10M${aim.x} ${aim.y + 5}v10`}
            stroke="#ffffff"
            strokeWidth="2.500"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* Tejo ya caído */}
      {landed && (
        <g
          key={`landed-${roundKey}`}
          className={css.landed}
          transform={`translate(${landed.x.toFixed(1)} ${landed.y.toFixed(1)})`}
          data-landed=""
        >
          <ellipse cx="2" cy="4" rx="16" ry="6" fill="#000000" opacity="0.35" />
          <circle r="15" fill={`url(#${uid}-disc)`} stroke="#8a6600" strokeWidth="2" />
          <circle r="8" fill="none" stroke="#8a6600" strokeWidth="1.800" opacity="0.8" />
        </g>
      )}

      {/* Tejo en el aire: lo mueve el juego (transform) y solo se ve mientras vuela */}
      <g opacity={flying ? 1 : 0} data-flight="">
        <ellipse data-shadow="" cx="0" cy="0" rx="15" ry="6" fill="#000000" opacity="0.35" />
        <g data-disc="">
          <circle r="15" fill={`url(#${uid}-disc)`} stroke="#8a6600" strokeWidth="2" />
          <circle r="8" fill="none" stroke="#8a6600" strokeWidth="1.800" opacity="0.8" />
        </g>
      </g>

      {/* La mano que lanza, con el tejo cuando está cargado */}
      <g transform={`translate(${HAND.x} ${HAND.y})`}>
        <rect x="-15" y="4" width="30" height="40" rx="10" fill="#c98a5a" />
        <circle cx="0" cy="-2" r="14" fill="#e0a97a" />
        {loaded && (
          <g>
            <circle cy="-6" r="15" fill={`url(#${uid}-disc)`} stroke="#8a6600" strokeWidth="2" />
            <circle cy="-6" r="8" fill="none" stroke="#8a6600" strokeWidth="1.800" opacity="0.8" />
          </g>
        )}
      </g>
    </svg>
  );
};
