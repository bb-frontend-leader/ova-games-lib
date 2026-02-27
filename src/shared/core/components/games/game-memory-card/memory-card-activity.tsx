import { FC, ReactNode, useCallback, useEffect, useState } from 'react';

import { useOvaContext } from '@/context/ova-context';

import { CardBack, CardFront, CardItem } from './card-item'; // Importamos los nuevos componentes
import { MemoryBoard } from './memory-board';
import { MemoryCardButton } from './memory-card-button';
import { MemoryActivityProvider } from './memory-card-context';
import { CardType } from './types';

interface Props {
  onResult: (result: boolean) => void;
  children?: ReactNode;
}

// Actualizamos la interfaz para incluir CardFront y CardBack sin el punto
export const MemoryCardActivity: FC<Props> & {
  Board: typeof MemoryBoard;
  Button: typeof MemoryCardButton;
  Card: typeof CardItem;
  CardFront: typeof CardFront;
  CardBack: typeof CardBack;
} = ({ onResult, children }) => {
  const { lang } = useOvaContext();
  const [cards, setCards] = useState<CardType[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [buttonsDisabled, setButtonsDisabled] = useState(true);
  const [isReset, setIsReset] = useState(true);

  useEffect(() => {
    return () => setCards([]);
  }, []);

  const registerCard = useCallback((card: Omit<CardType, 'flipped' | 'matched'>) => {
    setCards((prev) => {
      if (prev.length >= 8) return prev;

      const isAlreadyAdded = prev.some((c) => c.id === card.id && c.backContent === card.backContent);

      if (isAlreadyAdded) return prev;

      return [...prev, { ...card, flipped: false, matched: false }];
    });
  }, []);

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
          setCards((prev) => {
            const reset = [...prev];
            if (reset[first] && reset[second]) {
              reset[first].flipped = false;
              reset[second].flipped = false;
            }
            return [...reset];
          });
        }, 1000);
      }
      setSelectedCards([]);
    }
    setCards([...updatedCards]);
  };

  const checkGameStatus = () => {
    const allMatched = cards.length === 8 && cards.every((card) => card.matched);
    if (!allMatched) setIsReset(false);
    setButtonsDisabled(true);
    onResult?.(allMatched);
  };

  const restartGame = () => {
    setCards((prev) => prev.map((c) => ({ ...c, flipped: false, matched: false })));
    setButtonsDisabled(true);
    setIsReset(true);
    setSelectedCards([]);
  };

  return (
    <MemoryActivityProvider
      value={{
        cards,
        buttonsDisabled,
        isReset,
        lang,
        handleCardClick,
        checkGameStatus,
        restartGame,
        registerCard
      }}>
      {children}
    </MemoryActivityProvider>
  );
};

// Asignación de los sub-componentes al objeto principal
MemoryCardActivity.Board = MemoryBoard;
MemoryCardActivity.Button = MemoryCardButton;
MemoryCardActivity.Card = CardItem;
MemoryCardActivity.CardFront = CardFront; // Acceso directo: MemoryCardActivity.CardFront
MemoryCardActivity.CardBack = CardBack; // Acceso directo: MemoryCardActivity.CardBack
