import { Card } from './card';
import { useMemoryActivityContext } from './memory-card-context';

import css from './memory-card.module.css';

interface BoardProps {
  background?: string;
  addClass?: string;
}

export const MemoryBoard = ({ background, addClass }: BoardProps) => {
  const { cards, handleCardClick } = useMemoryActivityContext();

  return (
    <div
      style={{ backgroundImage: `url(${background})` }}
      className={`${css.container} u-grid u-p-2 ${addClass ?? ''}`}>
      {cards.map((card, index) => (
        <Card card={card} key={index} handleCardClick={() => handleCardClick(index)} />
      ))}
    </div>
  );
};
