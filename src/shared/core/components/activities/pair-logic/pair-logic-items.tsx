import { useEffect, useReducer, useState } from 'react';

import { PairLogicButton } from './pair-logic-button';
import { GameJoinProvider } from './pair-logic-context';
import { PairLogicImage } from './pair-logic-image';
import { PairLogicText } from './pair-logic-text';

import css from './pair-logic.module.css';
type SubComponents = {
  Images: typeof PairLogicImage;
  Items: typeof PairLogicText;
  Button: typeof PairLogicButton;
};
type ActiveButton = {
  index: number | null;
  join: number | null;
};
type StateImage = {
  src: string | null;
  alt: string | null;
  join: string | null;
};
type PropsStateText = {
  text: string | null;
  join: string | null;
};
export type State = {
  openModal: boolean;
  activeButton: ActiveButton;
  validation: boolean | null;
  button: boolean;
  result: boolean;
  cardsCorrect: boolean[];
  lockedJoins: string[];
  imageSelected: StateImage;
  text: PropsStateText;
  buttonsCount: number | null;
  endActivity: boolean;
};
const initialState: State = {
  openModal: false,
  activeButton: { index: null, join: null },
  validation: null,
  button: false,
  result: false,
  cardsCorrect: [],
  lockedJoins: [],
  imageSelected: { src: null, alt: null, join: null },
  text: { text: null, join: null },
  buttonsCount: null,
  endActivity: false
};

type Props = {
  children: React.ReactNode;
  onResult?: (result: boolean, join: string | null) => void;
};

export const PairLogicItems: React.FC<Props> & SubComponents = ({ children, onResult }) => {
  const [activity, updateActivity] = useReducer(
    (prev: typeof initialState, next: Partial<State>) => ({ ...prev, ...next }),
    initialState
  );
  const [liveMessage, setLiveMessage] = useState<string>('');
  const { button, validation, result, lockedJoins, imageSelected, text, buttonsCount, endActivity } = activity;

  const handleValidation = () => {
    const result = text.join === imageSelected.join;
    if (onResult) {
      onResult(result, text.join);
    }
    if (result) {
      if (imageSelected.join === null) return;

      updateActivity({
        lockedJoins: [...lockedJoins, imageSelected.join],
        validation: true
      });
    } else {
      updateActivity({ validation: false, button: true });
    }
  };
  const HandleReset = () => {
    updateActivity(initialState);
    // HandleReset(activity.activeButton.index);
  };
  useEffect(() => {
    setLiveMessage(
      ` Imagen seleccionada: ${imageSelected.alt !== null ? imageSelected.alt : 'no ha seleccionado ninguna imagen'} - Texto seleccionado: ${text.text !== null ? text.text : 'no ha seleccionado ningun texto'} `
    );
  }, [imageSelected, text]);
  useEffect(() => {
    if (lockedJoins.length === buttonsCount) {
      updateActivity({ endActivity: true });
      setLiveMessage(`Felicidades, has completado la actividad correctamente !`);
    }
    console.log();
    if (validation === null) return;

    const timer = setTimeout(() => {
      updateActivity({
        validation: null,
        text: { text: null, join: null },
        imageSelected: { src: null, alt: null, join: null } // o limpia selección
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [validation, lockedJoins, buttonsCount, text, imageSelected]);

  return (
    <GameJoinProvider
      value={{
        handleValidation,
        HandleReset,
        button,
        validation,
        result,
        imageSelected,
        text,
        lockedJoins,
        updateActivity,
        endActivity
      }}>
      <>
        <div aria-live="polite" aria-atomic="true" className={css.srOnly}>
          {liveMessage}
        </div>
        <div className={css.containerGame}>{children}</div>
      </>
    </GameJoinProvider>
  );
};

PairLogicItems.Images = PairLogicImage;
PairLogicItems.Items = PairLogicText;
PairLogicItems.Button = PairLogicButton;
