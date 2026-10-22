import type { ChipKind } from './lib/chips';

import css from './game-casino.module.css';

interface ChipProps {
  kind: ChipKind;
  className?: string;
}

/** Ficha de casino dibujada con CSS. Es decorativa: el valor y el nombre se leen en el texto de al lado. */
export const Chip = ({ kind, className = '' }: ChipProps) => (
  <span className={`${css.chip} ${className}`} data-chip={kind.id} aria-hidden="true">
    <span className={css['chip-value']}>${kind.value}</span>
  </span>
);

const MAX_DISCS = 8;

/** Pila de fichas vista de lado, como las que se ven en la mano del jugador y en la banca. */
export const ChipStack = ({ kind, count, max = MAX_DISCS }: { kind: ChipKind; count: number; max?: number }) => {
  const discs = Math.min(count, max);

  return (
    <span className={css.stack} style={{ '--n': discs } as React.CSSProperties} aria-hidden="true">
      {Array.from({ length: discs }, (_, i) => (
        <i
          key={`${kind.id}-${i}`}
          className={css.disc}
          data-chip={kind.id}
          style={{ '--i': i } as React.CSSProperties}
        />
      ))}
      {count > 1 && <span className={css['stack-count']}>×{count}</span>}
    </span>
  );
};
