import { ReactNode, useReducer } from 'react';

import { GameResult, InitialState, Option } from './types/types';
import { GameCasinoButton } from './game-casino-button';
import { GameCasinoProvider } from './game-casino-context';
import { CasinoElement } from './game-casino-element';
import { GameCasinoInit } from './game-casino-init';
import { GameCasinoLevel } from './game-casino-level';

const INITIAL_STATE: InitialState = {
  validation: false,
  button: true,
  result: false,
  options: [],
  point: 25 // Puntos iniciales
};

interface Props {
  children: ReactNode;
  onResult?: (data: GameResult) => void;
}

export const GameCasino = ({ children, onResult }: Props) => {
  const [state, dispatch] = useReducer(
    (prev: InitialState, next: Partial<InitialState>) => ({ ...prev, ...next }),
    INITIAL_STATE
  );

  const addSelectedOption = (option: Option) => {
    if (state.validation) return;
    dispatch({ options: [option], button: false });
  };

  const handleValidation = () => {
    if (state.options.length > 0) {
      const selected = state.options[0];
      const isCorrect = selected.state === 'success';
      const betAmount = selected.amount ?? 0;
      const newPoints = isCorrect ? state.point + betAmount : state.point - betAmount;

      dispatch({ validation: true, result: isCorrect, point: newPoints });

      onResult?.({
        result: isCorrect,
        options: state.options,
        totalPoints: newPoints
      });
    }
  };

  const handleReset = () => {
    dispatch({
      ...INITIAL_STATE,
      point: state.point < 10 ? 25 : state.point, // Recarga si se quedó sin nada
      validation: false,
      button: true,
      options: []
    });
  };

  return (
    <GameCasinoProvider value={{ ...state, addSelectedOption, handleValidation, handleReset }}>
      {children}
    </GameCasinoProvider>
  );
};

GameCasino.Init = GameCasinoInit;
GameCasino.Level = GameCasinoLevel;
GameCasino.Element = CasinoElement;
GameCasino.Button = GameCasinoButton;
