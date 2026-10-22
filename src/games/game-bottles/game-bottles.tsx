import React, { useEffect, useId, useRef, useState } from 'react';

import { FullScreenAlert } from '@/components/ui';
import { SOUNDS } from '@/constants';
import { burst, centerIn, flyChip, ring } from '@/games/lib/fx';
import { useCanAnimate, useDeferredResult, usePlaySound } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { Actions } from './game-bottles-actions';
import { GameBottleContextProvider } from './game-bottles-context';
import { Description } from './game-bottles-description';
import { Letters } from './game-bottles-letters';
import { Parallax } from './game-bottles-parallax';
import { Word } from './game-bottles-word';
import { BUBBLE_COLORS, RING_COLOR } from './lib/palette';

import type { letterProp, spaceProp } from './types/types';

import css from './styles/game-bottle.module.css';
import fxCss from './styles/level.module.css';

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

/**
 * Boca de la botella (donde estaba el corcho, a la derecha de su dibujo) en coordenadas de la capa de efectos.
 */
const mouthOf = (art: HTMLElement, layerRect: DOMRect) => {
  const r = art.getBoundingClientRect();

  return centerIn(new DOMRect(r.left + r.width * 0.93, r.top + r.height * 0.43, 0, 0), layerRect);
};

export function GameBottle({ onResult, children }: propsLevel) {
  const rootId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const playSound = usePlaySound();
  const canAnimate = useCanAnimate();
  // El resultado se entrega tras el temblor (error) o la celebración (acierto) para que se vean antes del modal del padre
  const { defer, flush } = useDeferredResult();
  const { contextSafe } = useGSAP({ scope: containerRef });

  const [targetWord, setTargetWord] = useState('');
  const [openModal, setOpenModal] = useState<'success' | 'wrong' | null>(null);
  const [words, setWords] = useState([] as letterProp[]);
  const [spaces, setSpaces] = useState([] as (spaceProp | null)[]);
  const [selectIndex, setSelectIndex] = useState(0);
  const [resetWave, setResetWave] = useState(false); // true un momento tras reintentar: las botellas reaparecen en cascada
  const actions: React.ReactNode[] = [];
  const content: React.ReactNode[] = [];
  const description: React.ReactNode[] = [];

  useEffect(() => {
    if (!targetWord) return;
    setWords(initialState(targetWord));
    setSpaces(Array.from({ length: targetWord.length }, () => null));
  }, [targetWord]);

  useEffect(() => {
    if (!resetWave) return;

    const timer = setTimeout(() => setResetWave(false), 1200);
    return () => clearTimeout(timer);
  }, [resetWave]);

  /**
   * Mueve el foco en el siguiente frame, cuando React ya aplicó el cambio de estado.
   * Un botón que se deshabilita o desaparece pierde el foco y el teclado volvería al inicio de la página.
   */
  const focusSoon = (find: () => Element | null | undefined) => {
    requestAnimationFrame(() => (find() as HTMLElement | null | undefined)?.focus());
  };

  const slotOf = (index: number) => containerRef.current?.querySelector(`[data-slot="${index}"]`) ?? null;

  /**
   * Efectos de elegir una botella (solo con movimiento permitido): el corchazo suelta burbujas y la letra vuela
   * en arco hasta el espacio seleccionado, donde al aterrizar deja una onda.
   */
  const popBottle = (source: HTMLElement, letter: string) => {
    const fx = fxRef.current;
    const slot = slotOf(selectIndex);
    const art = source.querySelector<HTMLElement>('[data-part="art"]');
    const label = source.querySelector<HTMLElement>('[data-part="letter"]');
    if (!canAnimate || !fx || !slot || !art || !label) return;

    const layerRect = fx.getBoundingClientRect();
    const slotRect = slot.getBoundingClientRect();
    const labelRect = label.getBoundingClientRect();

    burst(fx, mouthOf(art, layerRect), {
      className: fxCss.shard,
      colors: BUBBLE_COLORS,
      count: 7,
      reach: [18, 55],
      size: [7, 15],
      gravity: -46
    });

    // La pieza que vuela tiene el tamaño del espacio y sale del centro de la etiqueta de la botella
    const from = new DOMRect(
      labelRect.left + labelRect.width / 2 - slotRect.width / 2,
      labelRect.top + labelRect.height / 2 - slotRect.height / 2,
      slotRect.width,
      slotRect.height
    );

    flyChip(
      fx,
      layerRect,
      from,
      slotRect,
      letter,
      fxCss.flyer,
      contextSafe(() => {
        const at = centerIn(slotRect, layerRect);

        playSound(SOUNDS.DROP);
        ring(fx, at, fxCss.ripple, RING_COLOR, 0.45);
        burst(fx, at, {
          className: fxCss.shard,
          colors: BUBBLE_COLORS,
          count: 5,
          reach: [20, 44],
          size: [5, 10],
          gravity: -30
        });
      })
    );
  };

  const addLetter = contextSafe((obj: letterProp, source?: HTMLButtonElement) => {
    //evitar re-render si ta esta inhabilitado
    if (!obj.enable) return;

    playSound(SOUNDS.POP);
    if (source) popBottle(source, obj.letter);

    //inhabilitar la botella seleccionada y habilitar la que ya estaba en el lugar
    const inSlot = spaces[selectIndex];
    setWords(
      words.map((sel) => {
        if (inSlot && sel.index === inSlot.index) return { ...sel, enable: true };
        if (sel.index === obj.index) return { ...sel, enable: false };
        return sel;
      })
    );

    //añadir la nueva letra seleccionada
    setSpaces(spaces.map((space, i) => (i === selectIndex ? { index: obj.index, letter: obj.letter } : space)));

    //avanzar el indice
    const next = selectIndex >= spaces.length - 1 ? 0 : selectIndex + 1;
    setSelectIndex(next);

    // Si se eligió con el teclado, el foco pasa a la siguiente botella disponible (o al espacio activo si no quedan).
    if (source && document.activeElement === source) {
      focusSoon(() => {
        const open = [...(containerRef.current?.querySelectorAll<HTMLElement>('[data-bottle]:not(:disabled)') ?? [])];
        const after = open.find((b) => source.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

        return after ?? open[0] ?? slotOf(next);
      });
    }
  });

  const removeLetter = contextSafe((index: number = selectIndex) => {
    const inSlot = spaces[index];
    if (!inSlot) return;

    playSound(SOUNDS.TICK);

    // Un puñado de burbujas sale por la boca de la botella que recupera su letra
    const fx = fxRef.current;
    const art = containerRef.current?.querySelector<HTMLElement>(`[data-bottle="${inSlot.index}"] [data-part="art"]`);
    if (canAnimate && fx && art) {
      burst(fx, mouthOf(art, fx.getBoundingClientRect()), {
        className: fxCss.shard,
        colors: BUBBLE_COLORS,
        count: 5,
        reach: [14, 40],
        size: [5, 10],
        gravity: -36
      });
    }

    const updatedWords = words.map((word) => (word.index === inSlot.index ? { ...word, enable: true } : word));
    // Establece el espacio como nulo para eliminar la letra.
    setSpaces(spaces.map((space, i) => (i === index ? null : space)));
    setWords(updatedWords);

    // el botón de eliminar desaparece con la letra: el foco vuelve al espacio
    focusSoon(() => slotOf(index));
  });

  const checkAnswer = () => {
    const sentenceByUser = spaces
      .map((obj) => obj?.letter || '')
      .join('')
      .toLowerCase();

    const isCorrect = targetWord.toLowerCase() === sentenceByUser;
    setOpenModal(isCorrect ? 'success' : 'wrong');
    if (onResult) defer(() => onResult(isCorrect), isCorrect);
  };
  const reset = () => {
    // Si todavía hay un resultado en espera (reintento inmediato), se entrega ya: no se pierde ni llega tarde.
    flush();

    setWords(words.map((word) => ({ ...word, enable: true })));
    setSpaces(spaces.map(() => null));
    setSelectIndex(0);
    setOpenModal(null);
    setResetWave(true);
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
    containerRef,
    fxRef,
    rootId,
    canAnimate,
    resetWave
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
    <GameBottleContextProvider value={value}>
      {/* Lo que se muestra en pantalla completa es todo el contenedor: así incluye también los botones */}
      <div ref={containerRef} id={rootId} className={css.container}>
        <FullScreenAlert />
        <figure className={css.figure}>
          <Parallax>{content}</Parallax>
          {description} {/* Description */}
        </figure>
        <div className={css.container_controls}>
          {actions} {/* Actions */}
        </div>
      </div>
    </GameBottleContextProvider>
  );
}
GameBottle.Letters = Letters;
GameBottle.Word = Word;
GameBottle.Actions = Actions;
GameBottle.Description = Description;
