import { useEffect, useReducer, useRef } from "react";

import type { InitialState, Option } from "./types/types";
import { States } from "./types/types";
import { GameBasketballRadio } from "./game-backetball-radio";
import { GameBasketballButton } from "./game-basketball-button";
import { RadioBasketActivityProvider } from "./game-basketball-context";
import { GameBasketballLevel } from "./game-basketball-level";

const INITIAL_STATE = Object.freeze({
  validation: false,
  button: true,
  result: false,
  options: [],
});

interface Props {
  children: React.ReactNode;
  onResult?: ({
    result,
    options,
  }: {
    result: boolean;
    options: Option[];
  }) => void;
  resultDelayMs?: number;
}

type SubComponents = {
  Radio: typeof GameBasketballRadio;
  Button: typeof GameBasketballButton;
  Provider: typeof GameBasketballLevel;
};

const GameBasketball: React.FC<Props> & SubComponents = ({
  children,
  onResult,
  resultDelayMs = 900,
}) => {
  const [activity, updateActivity] = useReducer(
    (prev: InitialState, next: Partial<InitialState>) => ({ ...prev, ...next }),
    INITIAL_STATE,
  );

  // Referencia mutable para almacenar los uid de cada componente <RadioElement/>
  const radioElementsId = useRef<string[]>([]);
  const timeoutRef = useRef<number | null>(null);

  /**
   * Agrega el ID de un componente RadioElement
   * para realizar la validación de la actividad.
   * @param {string} uid - El ID del componente RadioElement.
   */
  const addRadioElementsId = (uid: string): void => {
    if (!radioElementsId.current.includes(uid)) {
      radioElementsId.current = [...radioElementsId.current, uid];
    }
  };

  /**
   * Agrega un valor de radio seleccionado al estado de la actividad.
   * Filtra las opciones anteriores por id y agrega la nueva opción seleccionada.
   * @param {Option} option - El objeto opción que contiene id, nombre y estado.
   */
  const addRadiosValues = ({ id, name, state }: Option) => {
    updateActivity({
      options: [
        ...activity.options.filter((option) => option.name !== name),
        { id, name, state },
      ],
    });
  };

  /**
   * Se usa para la validación de toda la actividad,
   * está se encarga de comprobrar que el número de opciones
   * seleccionadas se igual al total de las correctas.
   */
  const handleValidation = () => {
    const result = activity.options.every(
      ({ state }) => state === States.SUCCESS,
    );

    updateActivity({ result, validation: true, button: true });

    timeoutRef.current = window.setTimeout(() => {
      onResult?.({ result, options: activity.options });
    }, resultDelayMs);
  };

  /**
   * Reinicia la actividad a su estado inicial.
   */
  const handleReset = () => {
    activity.options.forEach(({ id }) => {
      // Busca el elemento del DOM correspondiente al nombre de opción y tipo de input 'radio'
      const element = document.querySelector(
        `input[type='radio'][id='${id}']`,
      ) as HTMLInputElement;

      if (element) {
        // Si se encuentra el elemento, establece su propiedad 'checked' en false para deseleccionarlo
        element.checked = false;
      }
    });
    updateActivity(INITIAL_STATE);
  };

  /**
   * Monitorea los cambios en las opciones seleccionadas.
   * Si hay opciones seleccionadas y la actividad no ha sido validada, activa el botón.
   * @returns void
   */
  useEffect(() => {
    if (!activity.options.length) return;

    if (!activity.validation) {
      updateActivity({ button: false });
    }
  }, [activity.options, activity.validation]);

  return (
    <RadioBasketActivityProvider
      value={{
        addRadiosValues,
        handleValidation,
        addRadioElementsId,
        handleReset,
        button: activity.button,
        result: activity.result,
        validation: activity.validation,
        options: activity.options,
      }}
    >
      {children}
    </RadioBasketActivityProvider>
  );
};

GameBasketball.Radio = GameBasketballRadio;
GameBasketball.Button = GameBasketballButton;
GameBasketball.Provider = GameBasketballLevel;

export { GameBasketball };
