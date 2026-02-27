import { useReducer, useState } from 'react';

import { AudioElement } from './audio-element.tsx';
// import { Card } from '../../activities/memory-card/card.tsx';
import { CardElement } from './card-element.tsx';
import { PhraseAndImageProvider } from './game-phrase-context.ts';
import { ImageElement } from './image-element.tsx';
import { PhraseAndImageModal } from './pharase-and-image-modal.tsx';
import { PhraseAndImageButton } from './phrase-and-image-button.tsx';
import { TextElement } from './text-element.tsx';

import css from './phrase-and-image.module.css';

type Card = {
  url?: string;
  alt?: string;
  textChildren?: JSX.Element | JSX.Element[] | null;
  initialCards?: Card[] | null;
  join: number;
  text: string;
  state: boolean | null;
};

interface Props {
  children?: JSX.Element | JSX.Element[];
  numCorrects: number;
  onResult?: (result: boolean) => void;
  initialCards?: Card[] | undefined;
  type: 'image' | 'text' | 'audio';
}

type SubComponents = {
  Card: typeof CardElement;
  Button: typeof PhraseAndImageButton;
  selectImage: typeof ImageElement;
  Modal: typeof PhraseAndImageModal;
  selectText: typeof TextElement;
  selectAudio: typeof AudioElement;
};

type ActiveButton = {
  index: number | null;
  join: number | null;
};

type State = {
  openModal: boolean;
  activeButton: ActiveButton;
  validation: boolean;
  button: boolean;
  result: boolean;
  cardsCorrect: boolean[];
};

const initialState: State = {
  openModal: false,
  activeButton: { index: null, join: null },
  validation: false,
  button: false,
  result: false,
  cardsCorrect: []
};
type CardExt = {
  url?: string;
  alt?: string;
  state: boolean | null;
};

const PhraseAndImage: React.FC<Props> & SubComponents = ({ children, onResult, numCorrects, initialCards, type }) => {
  const [activity, updateActivity] = useReducer(
    (prev: typeof initialState, next: Partial<State>) => ({ ...prev, ...next }),
    initialState
  );
  const [cards, setCard] = useState<Card[]>(initialCards || []);
  const HandleReset = (activeButtonIndex: number | null) => {
    setCard((prevCards: Card[]) =>
      prevCards.map((card: Card) =>
        activeButtonIndex
          ? {
              ...card,
              url: 'assets/images/cardSelectImage/question.png',
              state: null,
              alt: 'Imagen de un signo de interrogación.',
              textChildren: null
            }
          : card
      )
    );
  };

  const handleSelectImageEx = (activeButtonIndex: number, cardBase: CardExt) => {
    setCard((prevCards: Card[]) =>
      prevCards.map((card: Card, i: number) => (i === activeButtonIndex ? { ...card, ...cardBase } : card))
    );
  };

  const handleOpenModal = (id: number, join: number) => {
    updateActivity({ openModal: true, activeButton: { index: id, join: join } });
  };

  const handleSelectImage = (urlAudio: string, join: number, alt: string): void => {
    if (activity.activeButton.index !== null) {
      const card = {
        url: urlAudio,
        state: join === activity.activeButton.join,
        alt: alt
      };
      handleSelectImageEx(activity.activeButton.index, card);

      updateActivity({ openModal: false });
    }
    updateActivity({ cardsCorrect: [...activity.cardsCorrect, join === activity.activeButton.join] });
  };

  const handleSelectAudio = (urlAudio: string, join: number): void => {
    console.log('urlAudio', urlAudio);
    if (activity.activeButton.index !== null) {
      const card = {
        url: urlAudio,
        state: join === activity.activeButton.join
      };
      handleSelectImageEx(activity.activeButton.index, card);

      updateActivity({ openModal: false });
    }
    updateActivity({ cardsCorrect: [...activity.cardsCorrect, join === activity.activeButton.join] });
  };
  const handleSelectText = (join: number, children: JSX.Element | JSX.Element[] | null): void => {
    if (activity.activeButton.index !== null) {
      const card = {
        state: join === activity.activeButton.join,
        textChildren: children
      };
      handleSelectImageEx(activity.activeButton.index, card);
      updateActivity({ openModal: false });
    }
    updateActivity({ cardsCorrect: [...activity.cardsCorrect, join === activity.activeButton.join] });
  };

  const handleValidation = () => {
    const trueStateCards = activity.cardsCorrect.filter((card: boolean) => card === true);
    updateActivity({ validation: true, button: true });

    const result = trueStateCards.length === numCorrects;
    if (onResult) {
      onResult(result);
    }

    // Actualiza la actividad con el nuevo resultado
    updateActivity({ result: result });
  };

  const handleResetActivity = () => {
    updateActivity(initialState);
    HandleReset(activity.activeButton.index);
  };
  return (
    <PhraseAndImageProvider
      value={{
        handleValidation,
        handleReset: handleResetActivity,
        handleSelectImage,
        handleOpenModal,
        openModal: activity.openModal,
        button: activity.button,
        result: activity.result,
        validation: activity.validation,
        handleSelectText,
        handleSelectAudio
      }}>
      <>
        <div className={css.containerCards}>
          {cards.map(
            (phrase, index): JSX.Element => (
              <PhraseAndImage.Card
                id={index}
                img={phrase.url}
                urlAudio={phrase.url}
                state={phrase.state}
                alt={phrase.alt}
                type={type}
                phrase={phrase.text}
                join={phrase.join}
                textChildren={phrase.textChildren}
              />
            )
          )}
        </div>
        {children}
      </>
    </PhraseAndImageProvider>
  );
};
PhraseAndImage.Card = CardElement;
PhraseAndImage.Button = PhraseAndImageButton;
PhraseAndImage.Modal = PhraseAndImageModal;
PhraseAndImage.selectImage = ImageElement;
PhraseAndImage.selectText = TextElement;
PhraseAndImage.selectAudio = AudioElement;
export { PhraseAndImage };
