import { useEffect, useReducer, useRef } from 'react';

import { InitialState, Option, States } from './types/types';
import { GameThisOrThatButton } from './game-this-or-that-button';
import { ThisOrThatGameProvider } from './game-this-or-that-context';
import { GameThisOrThatLevel } from './game-this-or-that-level';
import { GameThisOrThatRadio } from './game-this-or-that-radio';

const INITIAL_STATE = Object.freeze({
  validation: false,
  button: true,
  result: false,
  options: []
});

interface Props {
  children: React.ReactNode;
  onResult?: ({ result, options }: { result: boolean; options: Option[] }) => void;
  minSelected?: number;
}

type SubComponents = {
  Button: typeof GameThisOrThatButton;
  Radio: typeof GameThisOrThatRadio;
  Level: typeof GameThisOrThatLevel;
};

const GameThisOrThat: React.FC<Props> & SubComponents = ({ children, onResult, minSelected = 1 }) => {
  const [game, updateGame] = useReducer(
    (prev: InitialState, next: Partial<InitialState>) => ({ ...prev, ...next }),
    INITIAL_STATE
  );

  const radioElementsId = useRef<string[]>([]);

  const addElementsId = (uid: string): void => {
    if (!radioElementsId.current.includes(uid)) {
      radioElementsId.current = [...radioElementsId.current, uid];
    }
  };

  const addRadiosValues = ({ id, name, state }: Option) => {
    updateGame({
      options: [...game.options.filter((option) => option.name !== name), { id, name, state }]
    });
  };

  const handleValidation = () => {
    updateGame({ validation: true, button: true });

    const result = game.options.every(({ state }) => state === States.SUCCESS);

    if (onResult) {
      onResult({ result, options: game.options });
    }

    updateGame({ result });
  };

  const handleReset = () => {
    game.options.forEach(({ id }) => {
      // Busca el elemento del DOM correspondiente al nombre de opción y tipo de input 'radio'
      const element = document.querySelector(`input[type='radio'][id='${id}']`) as HTMLInputElement;

      if (element) {
        // Si se encuentra el elemento, establece su propiedad 'checked' en false para deseleccionarlo
        element.checked = false;
      }
    });
    updateGame(INITIAL_STATE);
  };

  useEffect(() => {
    if (!game.options.length) return;

    const MIN_SELECTED = minSelected || Math.ceil(radioElementsId.current.length / 2);

    if (game.options.length >= MIN_SELECTED && !game.validation) {
      updateGame({ button: false });
    }
  }, [game.options, game.validation, radioElementsId, minSelected]);

  return (
    <ThisOrThatGameProvider
      value={{
        addElementsId,
        addRadiosValues,
        handleValidation,
        handleReset,
        button: game.button,
        result: game.result,
        validation: game.validation,
        options: game.options
      }}>
      {children}
    </ThisOrThatGameProvider>
  );
};

GameThisOrThat.Button = GameThisOrThatButton;
GameThisOrThat.Radio = GameThisOrThatRadio;
GameThisOrThat.Level = GameThisOrThatLevel;

export { GameThisOrThat };
