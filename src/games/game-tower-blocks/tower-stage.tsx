import { cameraShift, colLeft, COLS, levelBottom } from './lib/layout';

import type { Block } from './types/types';

import css from './game-tower-blocks.module.css';

interface Carry {
  /** Casillas a la derecha (o a la izquierda, si es negativo) de la torre donde cuelga el bloque. */
  offset: number;
  width: number;
}

interface Props {
  blocks: Block[];
  /** Filas que caben en el escenario. */
  rows: number;
  /** Texto para lectores de pantalla: el escenario es solo visual. */
  label: string;
  /** El bloque que cuelga de la grúa, mientras se apunta o cae. */
  carry?: Carry | null;
  /** Viento de este bloque (casillas), si toca enseñarlo. */
  wind?: number | null;
  /** El bloque recién colocado (hace un saltito). */
  freshId?: number | null;
  layerRef?: React.Ref<HTMLDivElement>;
}

/**
 * El escenario: cielo, la torre de bloques, el bloque que cuelga de la grúa y el suelo. Solo dibuja; quien lo
 * usa decide dónde está cada bloque.
 */
export const TowerStage: React.FC<Props> = ({
  blocks,
  rows,
  label,
  carry = null,
  wind = null,
  freshId = null,
  layerRef
}) => {
  const shift = cameraShift(blocks.length - 1, rows);
  const rowPct = 100 / rows;
  const top = blocks[blocks.length - 1];

  return (
    <div
      className={css.stage}
      role="img"
      aria-label={label}
      style={{ '--cols': COLS, '--rows': rows } as React.CSSProperties}
    >
      <div className={css.clouds} aria-hidden="true" />
      <div className={css.rail} aria-hidden="true" />

      {wind !== null && (
        <span className={css.wind} data-calm={wind === 0 ? '' : undefined} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M3 9h10a3 3 0 1 0-3-3M3 14h15a3 3 0 1 1-3 3M3 19h6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {wind === 0 ? '0' : wind > 0 ? `${wind} →` : `← ${-wind}`}
        </span>
      )}

      <div ref={layerRef} data-layer="" className={css.layer}>
        {blocks.map((block) => (
          <span
            key={block.id}
            className={css.block}
            data-block={block.id}
            data-c={block.level % 6}
            data-base={block.level === 0 ? '' : undefined}
            data-perfect={block.perfect ? '' : undefined}
            data-fresh={block.id === freshId ? '' : undefined}
            style={
              {
                left: colLeft(block.left),
                width: `${(block.width * 100) / COLS}%`,
                bottom: levelBottom(block.level, rows, shift),
                height: `${rowPct}%`,
                '--w': block.width
              } as React.CSSProperties
            }
          />
        ))}

        {carry && (
          <span
            className={css.carry}
            data-carry=""
            data-c={blocks.length % 6}
            style={
              {
                left: colLeft(top.left + carry.offset),
                width: `${(carry.width * 100) / COLS}%`,
                bottom: levelBottom(blocks.length + 1.3, rows, shift),
                height: `${rowPct}%`,
                '--w': carry.width
              } as React.CSSProperties
            }
          />
        )}
      </div>

      <div className={css.ground} aria-hidden="true" />
    </div>
  );
};
