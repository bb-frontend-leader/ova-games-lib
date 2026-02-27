import { useState } from 'react';

import { useOvaContext } from '@/context/ova-context';
import { Button } from '@/shared/ui/components';

import { Card } from './card';
import { i18n } from './const';
import { CardType } from './types';

import css from './memory-card.module.css';

interface Props {
  addClass?: string;
  memoryImages: CardType[];
  onResult: (result: boolean) => boolean;
  children?: React.ReactNode | React.ReactNode[];
  background?: string;
}

export const MemoryCardActivity: React.FC<Props> = ({ addClass, memoryImages, background, onResult, children }) => {
  const { lang } = useOvaContext();

  const [cards, setCards] = useState<CardType[]>(memoryImages);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [buttonsDisabled, setButtonsDisabled] = useState(true);
  const [isReset, setIsReset] = useState(true);

  /**
   * Handles the card click event.
   * @param {number} index - Index of the clicked card.
   */
  const handleCardClick = (index: number) => {
    if (cards[index].flipped || cards[index].matched || selectedCards.length === 2) return;

    const updatedCards = [...cards];
    updatedCards[index].flipped = true;

    const updatedSelectedCards = [...selectedCards, index];
    setSelectedCards(updatedSelectedCards);

    if (updatedSelectedCards.length === 2) {
      setButtonsDisabled(false);
      const [first, second] = updatedSelectedCards;
      if (updatedCards[first].id === updatedCards[second].id) {
        updatedCards[first].matched = true;
        updatedCards[second].matched = true;
      } else {
        setTimeout(() => {
          updatedCards[first].flipped = false;
          updatedCards[second].flipped = false;
          setCards([...updatedCards]);
        }, 1000);
      }
      setSelectedCards([]);
    }

    setCards([...updatedCards]);
  };

  /*Checks the current game status.*/
  const checkGameStatus = () => {
    const allMatched = cards.every((card) => card.matched);

    if (!allMatched) {
      setIsReset(false);
    }

    setButtonsDisabled(true);

    if (onResult) {
      onResult(allMatched);
    }
  };

  /**
   * Restarts the game.
   * Resets all cards to their initial state (`flipped: false`, `matched: false`).
   */
  const restartGame = () => {
    const resetCards = cards.map((card) => ({
      ...card,
      flipped: false,
      matched: false
    }));
    setCards(resetCards.sort());
    setButtonsDisabled(true);
    setIsReset(true);
  };

  return (
    <>
      <div
        style={{ backgroundImage: `url(${background})` }}
        className={`${css.container} u-grid u-p-2 ${addClass ?? ''}`}>
        {cards.map((card, index) => (
          <Card card={card} key={index} handleCardClick={() => handleCardClick(index)} />
        ))}
      </div>

      {children}

      <div className={`u-my-3 ${css.buttons}`}>
        <Button disabled={buttonsDisabled} onClick={checkGameStatus} label={i18n[lang].check} />
        <Button disabled={isReset} onClick={restartGame} label={i18n[lang].tryAgain} />
      </div>
    </>
  );
};
