import { useState } from 'react';

import { useCanAnimate, useDeferredResult } from '@/hooks';

import { GameCastleButton } from './game-castle-button';
import { GameCastleProvider } from './game-castle-context';
import { GameCastleInit } from './game-castle-init';
import { GameCastleLevel } from './game-castle-level';
import { CELEBRATION_MS } from './lib/constant';

import type { question_game } from './types/types';

interface GameCastleProps {
  children: React.ReactNode;
  /** Se llama con el resultado un instante después de comprobar, para que se vea el golpe y la puerta abrirse. */
  onResult?(result: boolean): void;
  question?: question_game;
}

type SubComponent = {
  Init: typeof GameCastleInit;
  Level: typeof GameCastleLevel;
  Button: typeof GameCastleButton;
};

export const GameCastle: React.FC<GameCastleProps> & SubComponent = ({ children, onResult, question }) => {
  const [selectAnswers, setSelectAnswers] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<'success' | 'wrong' | null>(null);

  const canAnimate = useCanAnimate();
  const { defer, flush } = useDeferredResult();

  const addSelectAnswer = (answer: string) => {
    setSelectAnswers(answer);
  };

  const checkAnswers = () => {
    const isCorrect = selectAnswers === question?.correct;

    setOpenModal(isCorrect ? 'success' : 'wrong');
    // El acierto dura más: el héroe corre hasta la puerta y la puerta se abre
    defer(() => onResult?.(isCorrect), isCorrect, canAnimate && isCorrect ? CELEBRATION_MS : undefined);
  };

  const resetActivity = () => {
    flush(); // Si reintenta de inmediato, el resultado pendiente no se pierde ni llega tarde
    setSelectAnswers(null);
    setOpenModal(null);
  };

  return (
    <GameCastleProvider value={{ selectAnswers, openModal, addSelectAnswer, checkAnswers, resetActivity, question }}>
      {children}
    </GameCastleProvider>
  );
};

GameCastle.Init = GameCastleInit;
GameCastle.Level = GameCastleLevel;
GameCastle.Button = GameCastleButton;
