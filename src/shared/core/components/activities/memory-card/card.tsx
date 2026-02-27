import { CardType } from './types';

import css from './memory-card.module.css';

interface Props {
  handleCardClick: (index: string | number) => void;
  card: CardType;
}

export const Card: React.FC<Props> = ({ card, handleCardClick, ...props }) => {
  return (
    <button
      {...props}
      disabled={card.matched}
      aria-label="Carta"
      aria-pressed={card.flipped ? 'true' : 'false'}
      className={`${css.card} ${card.flipped ? css.flipped : ''} ${card.matched ? css.matched : ''}`}
      onClick={() => handleCardClick(card.id)}>
      <div className={css.cardFront}>
        <img src={card.img} alt="Carta abierta." />
      </div>
      <div className={css.cardBack}>
        <img src={card.initialImg} alt="Carta con número." />
      </div>
    </button>
  );
};
