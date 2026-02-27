import { ReactNode, useReducer } from 'react';

import { InitialState, Option } from './types/types';
import { GameFishButton } from './game-fish-button';
import { GameFishActivityProvider } from './game-fish-context';
import { GameFishElement } from './game-fish-element';
import { GameFishInit } from './game-fish-init';
import { GameFishLevel } from './game-fish-level';

const INITIAL_STATE: InitialState = {
  validation: false,
  button: true,
  result: false,
  options: [],
  selectedLabel: '' //
};

interface GameResult {
  result: boolean;
  options: {
    id: string;
    state: string;
    label: string;
    name: string;
  }[];
}

interface Props {
  children: ReactNode;
  onResult?: (data: GameResult) => void;
}

export const GameFish = ({ children, onResult }: Props) => {
  const [activity, updateActivity] = useReducer(
    (prev: InitialState, next: Partial<InitialState>) => ({ ...prev, ...next }),
    INITIAL_STATE
  );

  const addSelectedOption = (option: Option) => {
    if (activity.validation) return;
    // Actualizamos las opciones y el label seleccionado simultáneamente
    updateActivity({
      options: [option],
      button: false,
      selectedLabel: option.label
    });
  };

  const handleValidation = () => {
    if (activity.options.length > 0) {
      const isCorrect = activity.options.every((opt) => opt.state === 'success');
      updateActivity({ validation: true, result: isCorrect });

      // Enviamos el objeto con la estructura que definimos arriba
      onResult?.({
        result: isCorrect,
        options: activity.options
      });
    }
  };

  const handleReset = () => updateActivity(INITIAL_STATE);

  return (
    <GameFishActivityProvider value={{ ...activity, addSelectedOption, handleValidation, handleReset }}>
      {children}
    </GameFishActivityProvider>
  );
};

GameFish.Init = GameFishInit;
GameFish.Fish = GameFishElement;
GameFish.Button = GameFishButton;
GameFish.Level = GameFishLevel;
