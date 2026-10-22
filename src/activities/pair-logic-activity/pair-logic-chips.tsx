import { cn } from '@/utils';

import type { CardState } from './types/types';

import css from './pair-logic.module.css';

interface ChipsProps {
  state?: CardState;
  /** Letra de la pareja resuelta. */
  letter: string | null;
  addClass?: string;
}

/** Fichas de una tarjeta o de un recuadro: ◆ elegida, letra + ✔ resuelta, ✖ incorrecta. Solo decoran: el estado se lee en el texto. */
export const PairLogicChips: React.FC<ChipsProps> = ({ state, letter, addClass }) => (
  <span className={cn(css.chips, addClass)} aria-hidden="true">
    {state === 'selected' && <span className={cn(css.chip, css['chip--selected'])}>◆</span>}
    {letter && <span className={css.chip}>{letter}</span>}
    {state === 'matched' && <span className={cn(css.chip, css['chip--right'])}>✔</span>}
    {state === 'wrong' && <span className={cn(css.chip, css['chip--wrong'])}>✖</span>}
  </span>
);
