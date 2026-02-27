import React, { createContext, useEffect, useRef, useState } from 'react';

import { letterProp, spaceProp } from './types/types';
import { Actions } from './Actions';
import { Description } from './Description';
import { Letters } from './Letters';
import { Parallax } from './parallax';
import { Word } from './Word';

import css from './styles/game-bottle.module.css';

type GameBottleContextType = {
  targetWord: string;
  setTargetWord: (word: string) => void;
  words: letterProp[];
  spaces: (spaceProp | null)[];
  selectIndex: number;
  setSelectIndex: (index: number) => void;
  addLetter: (obj: letterProp) => void;
  removeLetter: () => void;
  checkAnswer: () => void;
  reset: () => void;
  openModal: 'success' | 'wrong' | null;
  ALREADY_FILL: boolean;
  PARCIAL_WORD: string;
  containerRef: React.RefObject<HTMLDivElement>;
};
export const GameBottleContext = createContext<GameBottleContextType | null>(null);

interface propsLevel {
  onResult?(result: boolean): void;
  children: React.ReactNode;
}
function initialState(word: string): letterProp[] {
  return word
    .split('')
    .map((letter: string) => ({
      letter,
      index: crypto.randomUUID(),
      enable: true
    }))
    .sort(() => Math.random() - 0.5);
}
export function GameBottle({ onResult, children }: propsLevel) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [targetWord, setTargetWord] = useState('');
  const [openModal, setOpenModal] = useState<'success' | 'wrong' | null>(null);
  const [words, setWords] = useState([] as letterProp[]);
  const [spaces, setSpaces] = useState([] as (spaceProp | null)[]);
  const [selectIndex, setSelectIndex] = useState(0);
  const actions: React.ReactNode[] = [];
  const content: React.ReactNode[] = [];
  const description: React.ReactNode[] = [];

  useEffect(() => {
    if (!targetWord) return;
    setWords(initialState(targetWord));
    setSpaces(Array.from({ length: targetWord.length }, () => null));
  }, [targetWord]);
  const addLetter = (obj: letterProp) => {
    //evitar re-render si ta esta inhabilitado
    if (!obj.enable) return;
    //inhabilitar la botella seleccionada y habilitar la que ya estaba en el lugar
    const newWords = words.map((sel) => {
      if (spaces[selectIndex] && sel.index === spaces[selectIndex]?.index) {
        return { ...spaces[selectIndex], enable: true };
      }
      if (sel.index === obj.index) return { ...obj, enable: false };
      return sel;
    });
    setWords(newWords as letterProp[]);

    //añadir la nueva letra seleccionada
    spaces[selectIndex] = { ...obj };
    setSpaces([...spaces]);

    //avanzar el indice
    setSelectIndex(selectIndex >= spaces.length - 1 ? 0 : selectIndex + 1);
  };
  const removeLetter = () => {
    if (!spaces[selectIndex]) return;

    const updatedWords = words.map((word) =>
      word.index === spaces[selectIndex]?.index ? { ...word, enable: true } : word
    );
    // Establece el espacio seleccionado como nulo para eliminar la letra.
    spaces[selectIndex] = null;

    setSpaces([...spaces]);
    setWords(updatedWords as letterProp[]);
  };
  const checkAnswer = () => {
    const sentenceByUser = spaces
      .map((obj) => obj?.letter || '')
      .join('')
      .toLowerCase();

    const isCorrect = targetWord.toLowerCase() === sentenceByUser;
    setOpenModal(isCorrect ? 'success' : 'wrong');
    if (onResult) {
      onResult(isCorrect);
    }
  };
  const reset = () => {
    setWords(words.map((word) => ({ ...word, enable: true })));
    setSpaces(spaces.map(() => null));
    setOpenModal(null);
  };
  const ALREADY_FILL = spaces.find((obj) => obj === null) === undefined ? true : false;
  const PARCIAL_WORD = spaces.map((obj) => (obj ? obj.letter : '')).join('');
  const value = {
    words,
    spaces,
    selectIndex,
    openModal,
    targetWord,
    setTargetWord,
    addLetter,
    removeLetter,
    setSelectIndex,
    checkAnswer,
    reset,
    ALREADY_FILL,
    PARCIAL_WORD,
    containerRef
  };
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;

    if (child.type === GameBottle.Actions) {
      actions.push(child);
    } else if (child.type === GameBottle.Description) {
      description.push(child);
    } else {
      content.push(child);
    }
  });
  return (
    <GameBottleContext.Provider value={value}>
      <div ref={containerRef} className={css.container}>
        <Parallax>{content}</Parallax>
        <div className={css.container_controls}>
          {actions} {/* Actions */}
        </div>
        {description} {/* Description */}
      </div>
    </GameBottleContext.Provider>
  );
}
GameBottle.Letters = Letters;
GameBottle.Word = Word;
GameBottle.Actions = Actions;
GameBottle.Description = Description;
