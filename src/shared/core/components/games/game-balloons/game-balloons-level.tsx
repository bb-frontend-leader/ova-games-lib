import { useEffect, useMemo, useState } from 'react';

import { FullScreenAlert } from '../../ui';

import type { SpaceResult } from './types/types';
import { useGameBalloonsContext } from './game-balloons-context';
import { GameBalloonsElement } from './game-balloons-element';
import { GameBalloonsParallax } from './game-balloons-parallax';

import css from './game-balloons.module.css';

type LetterItem = { letter: string; index: string; enable: boolean };

interface GameBalloonsLevelProps {
  words: string[];
  sentence: string;
}

export const GameBalloonsLevel: React.FC<GameBalloonsLevelProps> = ({ words, sentence }) => {
  const { validation, result, reset, addBallonsValues, setUserAnswer } = useGameBalloonsContext();

  // 1) Registrar opción en context UNA sola vez (o cuando cambien props)
  useEffect(() => {
    addBallonsValues({ word: words, sentence });
    setUserAnswer(''); // al iniciar, respuesta vacía
  }, [addBallonsValues, setUserAnswer, words, sentence]);

  // 2. Construye el estado inicial a partir de props.words
  const initialItems = useMemo<LetterItem[]>(
    () =>
      words.map((letter) => ({
        letter,
        index: crypto.randomUUID(),
        enable: true
      })),
    [words]
  );

  const [balloons, setBalloons] = useState<LetterItem[]>(initialItems); // Evita llamar el estado "words" para no chocar con props.words
  const [spaces, setSpaces] = useState<SpaceResult[]>(() => Array.from({ length: words.length }, () => null)); // Estado para los espacios donde se arman las palabras
  const [selectIndex, setSelectIndex] = useState<number>(0); // Índice del espacio seleccionado

  const viewState = validation ? (result ? 'success' : 'wrong') : null; // Estado visual

  // Construye la palabra parcial para anunciarla y enviarla al contexto
  const PARCIAL_WORD = spaces
    .map((obj) => obj?.letter ?? '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  /**
   * Actualiza la respuesta del usuario en el contexto global.
   */
  useEffect(() => {
    if (!validation) setUserAnswer(PARCIAL_WORD);
  }, [PARCIAL_WORD, setUserAnswer, validation]);

  /**
   * Maneja la selección de un globo en el espacio actual.
   * Desactiva el globo seleccionado en el espacio actual y activa el globo que se encuentra en el espacio actual.
   * Desplaza el índice del espacio seleccionado hacia adelante.
   *
   * @param picked - Globo seleccionado.
   */
  const handlePick = (picked: LetterItem) => {
    if (validation) return;
    if (!picked.enable) return;

    setBalloons((prev) => {
      const currentInSlot = spaces[selectIndex];

      return prev.map((b) => {
        if (currentInSlot && b.index === currentInSlot.index) return { ...b, enable: true };
        if (b.index === picked.index) return { ...b, enable: false };
        return b;
      });
    });

    setSpaces((prev) => prev.map((s, i) => (i === selectIndex ? { letter: picked.letter, index: picked.index } : s)));

    setSelectIndex((prev) => (prev >= spaces.length - 1 ? 0 : prev + 1));
  };

  /**
   * Elimina la letra que se encuentra en el espacio `idx`.
   * Si el espacio `idx` no contiene una letra, no hace nada.
   * Re-habilita el globo que estaba en ese espacio y lo pone disponible para ser seleccionado de nuevo.
   * Limpia el espacio `idx`.
   *
   * @param idx - Índice del espacio del cual se quiere eliminar la letra.
   */
  const removeLetter = (idx: number) => {
    if (validation) return;
    const slot = spaces[idx];
    if (!slot) return;

    // re-habilitar el globo que estaba en ese espacio
    setBalloons((prev) => prev.map((b) => (b.index === slot.index ? { ...b, enable: true } : b)));

    // limpiar espacio
    setSpaces((prev) => prev.map((s, i) => (i === idx ? null : s)));
  };

  /**
   * Resetea el estado del nivel cuando se activa la propiedad `reset`.
   */

  useEffect(() => {
    if (reset) {
      setBalloons(initialItems);
      setSpaces(Array.from({ length: words.length }, () => null));
      setSelectIndex(0);
    }
  }, [reset, initialItems, words.length]);


  return (
    <div>
      <FullScreenAlert />
      <div id="fullscreen__section">
        <GameBalloonsParallax>
          <div className={css.container__sentence}>
            <div className={css.container__bottles}>
              {balloons.map((b, i) => (
                <GameBalloonsElement
                  key={b.index}
                  balloonRole={i}
                  letter={b.letter}
                  index={b.index}
                  enable={b.enable}
                  checked={!b.enable}
                  onCheckedChange={(isChecked) => {
                    if (isChecked) handlePick(b);
                  }}
                />
              ))}
            </div>
            <div className={`${css.container_word} ${viewState ? css[viewState] : ''}`}>
              <p aria-live="assertive" className="u-sr-only">
                {`frase armada ${PARCIAL_WORD}`}
              </p>

              {spaces.map((obj, i) => {
                const isSelected = selectIndex === i;
                const canRemove = !!obj && isSelected && !validation;

                return (
                  <div key={obj?.index || i} className={css.spaceWrap}>
                    <button
                      disabled={validation}
                      className={isSelected ? css.select : undefined}
                      onClick={() => setSelectIndex(i)}
                      type="button">
                      {obj?.letter || '____'}
                    </button>

                    {canRemove && (
                      <button
                        className={css.spaceRemove}
                        onClick={() => removeLetter(i)}
                        aria-label="eliminar palabra seleccionada"
                        type="button">
                        <span>&#10005;</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </GameBalloonsParallax>
      </div>
    </div>
  );
};
