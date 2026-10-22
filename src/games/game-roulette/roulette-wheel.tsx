import { useId } from 'react';

import { ICON_PATHS } from './lib/icons';
import { CENTER, polar, RADIUS, slicePath } from './lib/wheel';

import type { WedgeView } from './types/types';

import css from './game-roulette.module.css';

const BULBS = 24;
const MAX_LABEL = 11;

const truncate = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

interface Props {
  views: WedgeView[];
  wheelRef?: React.Ref<SVGGElement>;
  pointerRef?: React.Ref<SVGGElement>;
  /** Clase del grupo que gira (el inicio la usa para el giro lento decorativo). */
  wheelClassName?: string;
  /** Casilla ganadora (se resalta). */
  winIndex?: number | null;
  spinning?: boolean;
  /** Etiqueta accesible: sin ella la rueda se oculta a los lectores de pantalla. */
  label?: string;
}

/**
 * La ruleta dibujada en SVG: aro con bombillas, casillas con clavijas, puntero con aleta y, en el centro, el hueco
 * donde se coloca el botón de girar. Solo dibuja; quien la usa mueve `wheelRef` (rotación) y `pointerRef` (aleta).
 */
export const RouletteWheel: React.FC<Props> = ({
  views,
  wheelRef,
  pointerRef,
  wheelClassName,
  winIndex = null,
  spinning,
  label
}) => {
  // Ids únicos: el inicio y el juego pueden estar montados a la vez, cada uno con su ruleta
  const uid = useId().replace(/:/g, '');
  const gold = `roulette-gold-${uid}`;
  const hub = `roulette-hub-${uid}`;
  const count = views.length;
  const step = 360 / count;
  const fontSize = count <= 8 ? 15 : count <= 12 ? 13 : 11;
  const maxLabel = count <= 8 ? MAX_LABEL : count <= 12 ? 9 : 7;

  return (
    <svg
      className={css.wheel}
      viewBox="0 0 400 400"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-spinning={spinning ? '' : undefined}
    >
      <defs>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff3b0" />
          <stop offset="0.45" stopColor="#f4b400" />
          <stop offset="1" stopColor="#a56a00" />
        </linearGradient>
        <radialGradient id={hub} cx="50%" cy="40%" r="70%">
          <stop offset="0" stopColor="#3b3590" />
          <stop offset="1" stopColor="#120f3a" />
        </radialGradient>
      </defs>

      <circle cx={CENTER} cy={CENTER} r="198" fill={`url(#${gold})`} />
      <circle cx={CENTER} cy={CENTER} r="182" fill="#171244" />

      {Array.from({ length: BULBS }, (_, i) => {
        const at = polar((360 / BULBS) * i, 190);

        return <circle key={i} className={css.bulb} data-odd={i % 2 ? '' : undefined} cx={at.x} cy={at.y} r="3.6" />;
      })}

      <g ref={wheelRef} className={wheelClassName}>
        {views.map((view, i) => {
          const mid = i * step + step / 2;
          const peg = polar(i * step, RADIUS + 5);
          const special = view.kind !== 'question';

          return (
            <g
              key={view.id}
              className={css.slice}
              data-state={view.state}
              style={{ '--w': view.bg, '--ink': view.ink } as React.CSSProperties}
            >
              <path className={css.wedge} d={slicePath(i, count)} />
              {view.state !== 'pending' && <path className={css.cover} d={slicePath(i, count)} />}

              {/* El texto va a lo largo del radio, hacia fuera */}
              <g transform={`rotate(${mid - 90} ${CENTER} ${CENTER})`}>
                {special ? (
                  <>
                    <text className={css['slice-text']} x={CENTER + RADIUS - 16} y={CENTER} fontSize={fontSize + 7}>
                      {view.kind === 'joker' ? '50:50' : 'x2'}
                    </text>
                    <g className={css['slice-icon']} transform={`translate(${CENTER + 56} ${CENTER - 14}) scale(1.16)`}>
                      <path d={view.kind === 'joker' ? ICON_PATHS.card : ICON_PATHS.star} />
                    </g>
                  </>
                ) : (
                  <>
                    {view.label && (
                      <text className={css['slice-text']} x={CENTER + RADIUS - 16} y={CENTER} fontSize={fontSize}>
                        {truncate(view.label, maxLabel)}
                      </text>
                    )}
                    {/* Una casilla acertada cambia su número por una marca ✓ */}
                    {view.state === 'solved' ? (
                      <path
                        className={css['mark-ok']}
                        d={ICON_PATHS.check}
                        transform={`translate(${CENTER + (view.label ? 66 : RADIUS - 44) - 12} ${CENTER - 12})`}
                      />
                    ) : (
                      <text
                        className={css['slice-number']}
                        x={CENTER + (view.label ? 66 : RADIUS - 44)}
                        y={CENTER}
                        fontSize={view.label ? 17 : 24}
                      >
                        {view.number}
                      </text>
                    )}
                  </>
                )}
              </g>

              <circle className={css.peg} cx={peg.x} cy={peg.y} r="4.5" />
            </g>
          );
        })}

        {winIndex !== null && <path className={css['win-outline']} d={slicePath(winIndex, count)} />}
      </g>

      <circle cx={CENTER} cy={CENTER} r="52" fill={`url(#${gold})`} />
      <circle cx={CENTER} cy={CENTER} r="46" fill={`url(#${hub})`} />

      <g ref={pointerRef}>
        <path className={css.pointer} d="M200 62 L186 22 A15 15 0 1 1 214 22 Z" />
        <circle cx={CENTER} cy="19" r="5" fill="#171244" />
      </g>
    </svg>
  );
};
