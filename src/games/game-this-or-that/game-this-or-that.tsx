import { useEffect, useReducer, useRef } from 'react';

import { useDeferredResult } from '@/hooks';

import { GameThisOrThatButton } from './game-this-or-that-button';
import { ThisOrThatGameProvider } from './game-this-or-that-context';
import { GameThisOrThatLevel } from './game-this-or-that-level';
import { GameThisOrThatRadio } from './game-this-or-that-radio';

import type { InitialState, Option } from './types/types';
import { States } from './types/types';

const INITIAL_STATE = Object.freeze({
  validation: false,
  button: true,
  result: false,
  options: []
});

// Lo que tarda la carta elegida en celebrar o negar antes de entregar el resultado (ms)
const DELIVER_MS = { success: 1100, wrong: 750 } as const;

interface Props {
  children: JSX.Element | JSX.Element[];
  onResult?: ({ result, options }: { result: boolean; options: Option[] }) => void;
  minSelected?: number;
  /** Espera (ms) entre comprobar y `onResult`. Por defecto lo que dura la reacción de la carta; sin animaciones es inmediato. */
  resultDelayMs?: number;
}

type SubComponents = {
  Button: typeof GameThisOrThatButton;
  Radio: typeof GameThisOrThatRadio;
  Level: typeof GameThisOrThatLevel;
};

const GameThisOrThat: React.FC<Props> & SubComponents = ({ children, onResult, minSelected = 1, resultDelayMs }) => {
  const [game, updateGame] = useReducer(
    (prev: InitialState, next: Partial<InitialState>) => ({ ...prev, ...next }),
    INITIAL_STATE
  );

  // El resultado se entrega cuando la carta termina de reaccionar, antes del modal del padre
  const { defer, flush } = useDeferredResult();

  const radioElementsId = useRef<string[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);

  const addElementsId = (uid: string): void => {
    if (!radioElementsId.current.includes(uid)) {
      radioElementsId.current = [...radioElementsId.current, uid];
    }
  };

  const addRadiosValues = ({ id, name, state }: Option) => {
    // Ya comprobado: las opciones quedan fijas hasta reintentar
    if (game.validation) return;

    updateGame({
      options: [...game.options.filter((option) => option.name !== name), { id, name, state }]
    });
  };

  const handleValidation = () => {
    const result = game.options.every(({ state }) => state === States.SUCCESS);

    updateGame({ validation: true, button: true, result });

    // Siempre después de mover el foco (ver GameThisOrThatButton)
    defer(
      () => {
        requestAnimationFrame(() => onResult?.({ result, options: game.options }));
      },
      result,
      resultDelayMs ?? DELIVER_MS[result ? 'success' : 'wrong']
    );
  };

  const handleReset = () => {
    // Si todavía hay un resultado en espera (reintento inmediato), se entrega ya: no se pierde ni llega tarde.
    flush();

    updateGame(INITIAL_STATE);

    // Las opciones vuelven a habilitarse: el foco, que estaba en el botón, pasa a la primera
    requestAnimationFrame(() => {
      const active = document.activeElement as HTMLElement | null;

      if (!active || active === document.body || (active as HTMLButtonElement).disabled) {
        rootRef.current
          ?.querySelector<HTMLElement>('input[type="radio"]:not(:disabled)')
          ?.focus({ preventScroll: true });
      }
    });
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
        rootRef,
        button: game.button,
        result: game.result,
        validation: game.validation,
        options: game.options
      }}
    >
      {children}
    </ThisOrThatGameProvider>
  );
};

GameThisOrThat.Button = GameThisOrThatButton;
GameThisOrThat.Radio = GameThisOrThatRadio;
GameThisOrThat.Level = GameThisOrThatLevel;

export { GameThisOrThat };
