import { CardType } from './types';

import css from './memory-card.module.css';

interface Props {
  handleCardClick: () => void;
  card: CardType;
}

export const Card: React.FC<Props> = ({ card, handleCardClick }) => {
  return (
    <button
      type="button"
      disabled={card.matched}
      className={`${css.card} ${card.flipped ? css.flipped : ''} ${card.matched ? css.matched : ''}`}
      onClick={handleCardClick}>
      <div className={css.cardFront}>
        <div className={css.innerContent}>{card.frontContent}</div>
      </div>

      <div className={css.cardBack}>
        <div className={css.innerContent}>{card.backContent}</div>
      </div>
    </button>
  );
};
