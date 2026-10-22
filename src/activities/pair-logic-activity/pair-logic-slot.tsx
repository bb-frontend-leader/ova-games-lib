import { useLang } from '@/hooks';
import { cn } from '@/utils';

import { i18n } from './lib/constant';
import { PairLogicChips } from './pair-logic-chips';

import type { CardState, Pair, Side } from './types/types';

import css from './pair-logic.module.css';

interface SlotProps {
  side: Side;
  /** Pareja elegida en esa columna (su imagen o su texto). */
  pair?: Pair;
  state?: CardState;
  letter: string | null;
}

// Iconos (Material Symbols) de los recuadros vacíos.
const ICON_PATHS: Record<Side, string> = {
  image:
    'M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180zm0-60h600v-600H180v600zm56-97h489L578-473 446-302l-93-127-117 152zm-56 97v-600 600z',
  text: 'M290-160v-540H80v-100h520v100H390v540H290Zm360 0v-340H520v-100h360v100H750v340H650Z'
};

/**
 * Recuadro donde se coloca la imagen o el texto elegido. Repite lo que ya dicen la tarjeta marcada y la línea de
 * estado, así que se oculta a los lectores de pantalla (aria-hidden) para no leerlo dos veces.
 */
export const PairLogicSlot: React.FC<SlotProps> = ({ side, pair, state, letter }) => {
  const lang = useLang();
  const t = i18n[lang];

  return (
    <div className={cn(css.slot, css[`slot--${side}`])} data-state={state} aria-hidden="true">
      <PairLogicChips state={state} letter={letter} addClass={css['slot__chips']} />

      {pair ? (
        // `key` reinicia la entrada cada vez que cambia la elección.
        <div className={css['slot__content']} key={pair.id}>
          {side === 'image' ? (
            <img className={css['slot__image']} src={pair.image.src} alt="" draggable={false} />
          ) : (
            <p className={css['slot__text']}>{pair.text}</p>
          )}
        </div>
      ) : (
        <div className={css['slot__empty']}>
          <svg className={css['slot__icon']} viewBox="0 -960 960 960" focusable="false">
            <path d={ICON_PATHS[side]} />
          </svg>
          <p>{side === 'image' ? t.emptyImage : t.emptyText}</p>
        </div>
      )}
    </div>
  );
};
