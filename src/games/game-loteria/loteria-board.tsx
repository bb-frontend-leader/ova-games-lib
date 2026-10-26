import { ACCENTS } from './lib/constant';
import { LoteriaIcon } from './loteria-icons';

import type { LoteriaCardData } from './types/types';

import css from './game-loteria.module.css';

interface CardProps {
  id: string;
  data: LoteriaCardData;
  /** Posición en la tabla (desde 1). */
  number: number;
  marked: boolean;
  discarded: boolean;
  /** Resultado de la última carta tocada, solo en esa carta. */
  state?: 'ok' | 'ko';
  markedLabel: string;
  discardedLabel: string;
  onPick: (id: string) => void;
}

/** Una carta de la tabla: número, dibujo y nombre. Marcada lleva tres frijoles; descartada, una cruz. */
const BoardCard: React.FC<CardProps> = ({
  id,
  data,
  number,
  marked,
  discarded,
  state,
  markedLabel,
  discardedLabel,
  onPick
}) => (
  <li className={css.cell} style={{ '--accent': ACCENTS[(number - 1) % ACCENTS.length] } as React.CSSProperties}>
    <button
      type="button"
      className={css.card}
      data-card={id}
      data-marked={marked ? '' : undefined}
      data-discarded={discarded ? '' : undefined}
      data-state={state}
      disabled={marked || discarded}
      onClick={() => onPick(id)}
    >
      <span className={css.num} aria-hidden="true">
        {number}
      </span>

      <span className={css.pic} aria-hidden="true">
        {data.image ? <img src={data.image} alt="" /> : (data.emoji ?? data.label.trim().charAt(0).toUpperCase())}
      </span>

      <span className={css.name}>
        {data.label}
        {marked && <span className="u-sr-only"> ({markedLabel})</span>}
        {discarded && <span className="u-sr-only"> ({discardedLabel})</span>}
      </span>

      {marked && (
        <span className={css.beans} aria-hidden="true">
          <i data-bean="" />
          <i data-bean="" />
          <i data-bean="" />
        </span>
      )}

      {discarded && <LoteriaIcon name="cross" className={css.miss} />}
    </button>
  </li>
);

interface Props {
  boardRef: React.Ref<HTMLUListElement>;
  /** Ids de las cartas en el orden de la tabla. */
  board: string[];
  cards: Record<string, LoteriaCardData>;
  cols: number;
  solved: string[];
  /** Cartas descartadas en la pista actual. */
  discarded: string[];
  /** Carta recién tocada y su resultado. */
  picked: { id: string; ok: boolean } | null;
  /** Se puede tocar una carta (hay una pista esperando). */
  active: boolean;
  /** Grito sobre la tabla: «¡Buena!» al completar una línea o «¡LOTERÍA!» al llenarla. */
  shout: { kind: 'line' | 'loteria'; text: string } | null;
  label: string;
  markedLabel: string;
  discardedLabel: string;
  onPick: (id: string) => void;
}

/** La tabla: un marco de madera con las cartas en filas y columnas (el nº de columnas se adapta al ancho). */
export const LoteriaBoard: React.FC<Props> = ({
  boardRef,
  board,
  cards,
  cols,
  solved,
  discarded,
  picked,
  active,
  shout,
  label,
  markedLabel,
  discardedLabel,
  onPick
}) => (
  <div className={css.table}>
    <fieldset className={css.frame} disabled={!active}>
      <legend className="u-sr-only">{label}</legend>

      <ul ref={boardRef} className={css.board} style={{ '--cols': cols } as React.CSSProperties}>
        {board.map((id, k) => (
          <BoardCard
            key={id}
            id={id}
            data={cards[id]}
            number={k + 1}
            marked={solved.includes(id)}
            discarded={discarded.includes(id)}
            state={picked?.id === id ? (picked.ok ? 'ok' : 'ko') : undefined}
            markedLabel={markedLabel}
            discardedLabel={discardedLabel}
            onPick={onPick}
          />
        ))}
      </ul>
    </fieldset>

    {shout && (
      <p className={css.shout} data-kind={shout.kind} aria-hidden="true">
        {shout.text}
      </p>
    )}
  </div>
);
