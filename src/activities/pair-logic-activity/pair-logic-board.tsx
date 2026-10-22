import { useLang } from '@/hooks';
import { cn } from '@/utils';

import { i18n } from './lib/constant';
import { getInputId, pairLetter } from './lib/utils';
import { usePairLogicActivityContext } from './pair-logic-activity-context';
import { PairLogicChips } from './pair-logic-chips';
import { PairLogicSlot } from './pair-logic-slot';

import type { CardState, Pair, Side } from './types/types';

import css from './pair-logic.module.css';

interface BoardProps {
  addClass?: string;
}

const Arrow = () => (
  <svg className={css.arrow} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M3 12h16m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
  </svg>
);

export const PairLogicBoard: React.FC<BoardProps> = ({ addClass }) => {
  const lang = useLang();
  const t = i18n[lang];
  const { uid, pairs, texts, imageId, textId, verdict, matched, complete, select } = usePairLogicActivityContext();

  const total = pairs.length;

  // Línea de estado: guía el siguiente paso y es la región en vivo (lo que se ve es lo que se anuncia).
  const message = (() => {
    if (complete) return t.complete(total);
    if (verdict === 'right') return t.right(pairLetter(matched.length), matched.length, total);
    if (verdict === 'wrong') return t.wrong;
    if (imageId && textId) return t.ready;

    const chosenImage = pairs.find(({ id }) => id === imageId);
    if (chosenImage) return t.imageSelected(chosenImage.image.alt);

    const chosenText = pairs.find(({ id }) => id === textId);
    if (chosenText) return t.textSelected(chosenText.text);

    return t.idle;
  })();

  const barState = complete ? 'right' : (verdict ?? undefined);

  const renderCard = (side: Side, pair: Pair, index: number) => {
    const isMatched = matched.includes(pair.id);
    const isChosen = !isMatched && (side === 'image' ? imageId : textId) === pair.id;
    const letter = isMatched ? pairLetter(matched.indexOf(pair.id) + 1) : null;

    let state: CardState | undefined;
    if (isMatched) state = 'matched';
    else if (isChosen) state = verdict === 'wrong' ? 'wrong' : 'selected';

    // Estado de la tarjeta para lectores de pantalla (la señal visual son las fichas y el color).
    const status = letter ? t.status.solved(letter) : state === 'wrong' ? t.status.wrong : '';

    return (
      <label
        key={pair.id}
        className={cn(css.card, css[`card--${side}`])}
        data-state={state}
        style={{ '--i': index } as React.CSSProperties}
      >
        <input
          type="radio"
          className={css['card__input']}
          id={getInputId(uid, side, pair.id)}
          name={`${uid}-${side}`}
          checked={isChosen}
          disabled={isMatched}
          onChange={() => select(side, pair.id)}
        />
        <PairLogicChips state={state} letter={letter} />
        {side === 'image' ? (
          <img className={css['card__image']} src={pair.image.src} alt={pair.image.alt} draggable={false} />
        ) : (
          <span className={css['card__text']}>{pair.text}</span>
        )}
        {status && <span className="u-sr-only">, {status}</span>}
      </label>
    );
  };

  /** Una fila: tarjetas a elegir → flecha → recuadro con la elegida. */
  const renderRow = (side: Side) => {
    const isImage = side === 'image';
    const chosen = pairs.find(({ id }) => id === (isImage ? imageId : textId));
    const labelId = `${uid}-${side}-label`;

    // El recuadro sigue la suerte del intento: tras comprobar toma el color del veredicto.
    let slotState: CardState | undefined;
    if (chosen) slotState = verdict === 'right' ? 'matched' : verdict === 'wrong' ? 'wrong' : 'selected';

    const slotLetter = chosen && slotState === 'matched' ? pairLetter(matched.indexOf(chosen.id) + 1) : null;

    return (
      <div className={css.row}>
        <p className={css.label} id={labelId}>
          {isImage ? t.images : t.texts}
        </p>
        <div className={css[isImage ? 'images' : 'texts']} role="radiogroup" aria-labelledby={labelId}>
          {(isImage ? pairs : texts).map((pair, index) => renderCard(side, pair, index))}
        </div>

        <Arrow />

        <p className={cn(css.label, css['label--slot'])} aria-hidden="true">
          {isImage ? t.imageSlot : t.textSlot}
        </p>
        <PairLogicSlot side={side} pair={chosen} state={slotState} letter={slotLetter} />
      </div>
    );
  };

  return (
    <div className={cn(css.board, addClass)}>
      {renderRow('image')}

      <div className={css.rule} aria-hidden="true" />

      {renderRow('text')}

      <div className={css.bar} data-state={barState}>
        <span
          className={cn(
            css.chip,
            barState === 'right' && css['chip--right'],
            barState === 'wrong' && css['chip--wrong'],
            !barState && css['chip--selected']
          )}
          aria-hidden="true"
        >
          {barState === 'right' ? '✔' : barState === 'wrong' ? '✖' : '◆'}
        </span>
        <p className={css['bar__message']} role="status" aria-live="polite" aria-atomic="true">
          {message}
        </p>
        <span className={css['bar__progress']}>{t.progress(matched.length, total)}</span>
      </div>
    </div>
  );
};
