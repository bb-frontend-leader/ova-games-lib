import { FullScreenAlert, FullScreenButton } from '@/components/ui';
import { SOUNDS } from '@/constants';
import { useLang, usePlaySound } from '@/hooks';
import { cn } from '@/utils';

import { i18n } from './lib/constant';
import { findLink, getOptionName, isImageLabel, slotLetter } from './lib/utils';
import { useRelationConceptActivityContext } from './relation-concept-activity-context';

import type { Option } from './types/types';

import css from './relation-concept.module.css';

interface CardProps {
  addClass?: string;
  title?: string;
  pairs: Option[];
}

type CardState = 'selected' | 'linked' | 'correct' | 'incorrect';

export const RelationConceptCard: React.FC<CardProps> = ({ pairs, title, addClass }) => {
  const lang = useLang();
  const t = i18n[lang];
  const playSound = usePlaySound();
  const { selectCard, cancelSelection, pending, links, locked, validation, announcement } =
    useRelationConceptActivityContext();

  /**
   * Escape cancela la tarjeta que está seleccionada a medias.
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'Escape' || !pending) return;

    event.stopPropagation();
    cancelSelection();
  };

  const renderCard = (pair: Option) => {
    const link = findLink(links, pair.id);
    const isLocked = locked.some(({ id }) => id === pair.id);
    const isPending = pending?.id === pair.id;

    let state: CardState | undefined;
    if (isLocked) state = 'correct';
    else if (link && validation) state = link.correct ? 'correct' : 'incorrect';
    else if (link) state = 'linked';
    else if (isPending) state = 'selected';

    const letter = link ? slotLetter(link.slot) : null;
    const isDisabled = validation || isLocked;
    const isImage = isImageLabel(pair.label);
    const name = getOptionName(pair, t.image);

    // Estado de la tarjeta para lectores de pantalla (la señal visual son las fichas de arriba).
    const status = [
      isPending && t.status.selected,
      letter && t.status.link(letter),
      isLocked && t.status.solved,
      !isLocked && link && validation && (link.correct ? t.status.correct : t.status.incorrect)
    ]
      .filter(Boolean)
      .join(', ');

    return (
      <button
        key={pair.id}
        id={pair.id}
        type="button"
        className={css.card}
        data-state={state}
        aria-pressed={Boolean(isPending || link || isLocked)}
        aria-disabled={isDisabled || undefined}
        onClick={() => {
          if (isDisabled) return;

          playSound(SOUNDS.TICK);
          selectCard(pair);
        }}
      >
        <span className={css.card__chips} aria-hidden="true">
          {isPending && <span className={cn(css.chip, css['chip--selected'])}>◆</span>}
          {letter && <span className={css.chip}>{letter}</span>}
          {state === 'correct' && <span className={cn(css.chip, css['chip--correct'])}>✔</span>}
          {state === 'incorrect' && <span className={cn(css.chip, css['chip--incorrect'])}>✖</span>}
        </span>
        <span className={css.card__content}>{isImage ? <img src={pair.label} alt={name} /> : pair.label}</span>
        {status && <span className="u-sr-only">, {status}</span>}
      </button>
    );
  };

  return (
    <>
      <FullScreenAlert />
      <div className={cn(css['grid-wrapper'], addClass)} id="relation-concept">
        <FullScreenButton elementId="relation-concept" addClass={css['fullScreen__button']} />
        {title && (
          <div className={css['grid-title']}>
            <h2>{title}</h2>
          </div>
        )}

        <div className={css['grid-container']} data-id="card-container" onKeyDown={handleKeyDown}>
          {pairs.map((pair) => renderCard(pair))}
        </div>

        {/* Región en vivo: anuncia cada selección, vínculo y el resultado. */}
        <p className="u-sr-only" role="status" aria-live="polite" aria-atomic="true">
          {announcement}
        </p>
      </div>
    </>
  );
};
