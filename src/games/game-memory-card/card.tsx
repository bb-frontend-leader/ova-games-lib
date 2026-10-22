import { i18n } from './lib/constant';
import { useMemoryActivityContext } from './memory-card-context';

import type { CardType } from './types/types';

import css from './memory-card.module.css';

interface Props {
  handleCardClick: () => void;
  card: CardType;
  index: number;
  total: number;
}

export const Card: React.FC<Props> = ({ card, index, total, handleCardClick }) => {
  const { lang } = useMemoryActivityContext();
  const t = i18n[lang];

  const state = card.matched ? t.matched : card.flipped ? t.faceUp : t.faceDown;

  // Una pareja encontrada sigue siendo enfocable (el foco no se pierde); solo deja de responder
  return (
    <button
      type="button"
      data-card={index}
      aria-disabled={card.matched || undefined}
      className={`${css.card} ${card.flipped ? css.flipped : ''} ${card.matched ? css.matched : ''}`}
      onClick={handleCardClick}
    >
      {/* El nombre de la carta dice su lugar y su estado; solo la cara visible aporta contenido */}
      <span className={css['sr-only']}>
        {t.card(index + 1, total)}, {state}.
      </span>

      <div className={css.cardFront} data-face="front" aria-hidden={!card.flipped}>
        <div className={css.innerContent}>{card.frontContent}</div>
      </div>

      <div className={css.cardBack} aria-hidden="true">
        <div className={css.innerContent}>{card.backContent}</div>
      </div>
    </button>
  );
};
