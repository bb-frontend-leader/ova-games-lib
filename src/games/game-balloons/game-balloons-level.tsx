import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';

import { FullScreenAlert } from '@/components/ui';
import { SOUNDS } from '@/constants';
import { burst, centerIn, FLIGHT_S, flyChip, ring } from '@/games/lib/fx';
import { useCanAnimate, useLang, usePlaySound } from '@/hooks';
import { useGSAP } from '@gsap/react';

import { useGameBalloonsContext } from './game-balloons-context';
import type { BalloonParts } from './game-balloons-element';
import { GameBalloonsElement } from './game-balloons-element';
import { GameBalloonsParallax } from './game-balloons-parallax';
import { i18n } from './lib/i18n';
import { colorsOf, CONFETTI_COLORS, LAND_COLORS, RING_COLOR, SHARD_SHAPES } from './lib/palette';

import type { SpaceResult } from './types/types';

import css from './game-balloons.module.css';

type LetterItem = { letter: string; index: string; enable: boolean };

interface GameBalloonsLevelProps {
  words: string[];
  sentence: string;
}

const pad = (n: number) => String(n).padStart(2, '0');

// Fragmentos de la explosión y del confeti: la clase los pinta y estos recortes les dan forma de rombo/triángulo.
const SHARD = { className: css.shard, shapes: SHARD_SHAPES };

export const GameBalloonsLevel: React.FC<GameBalloonsLevelProps> = ({ words, sentence }) => {
  const { validation, result, reset, addBallonsValues, setUserAnswer } = useGameBalloonsContext();
  const lang = useLang();
  const playSound = usePlaySound();
  const canAnimate = useCanAnimate();
  const t = i18n[lang];

  const rootRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const balloonsRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  const slotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const { contextSafe } = useGSAP({ scope: rootRef });

  useEffect(() => {
    addBallonsValues({ word: words, sentence });
    setUserAnswer(''); // al iniciar, respuesta vacía
  }, [addBallonsValues, setUserAnswer, words, sentence]);

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
  const [wave, setWave] = useState(false); // true un momento tras reintentar: los globos reaparecen en cascada

  const viewState = validation ? (result ? 'success' : 'wrong') : null; // Estado visual
  const filled = spaces.filter(Boolean).length;

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
   * Mueve el foco a `element` en el siguiente frame, cuando React ya aplicó el cambio de estado.
   * Un botón que se deshabilita o desaparece pierde el foco y el teclado volvería al inicio de la página.
   */
  const focusSoon = (find: () => HTMLElement | null | undefined) => {
    requestAnimationFrame(() => find()?.focus());
  };

  /**
   * Maneja la selección de un globo en el espacio actual.
   * Desactiva el globo seleccionado en el espacio actual y activa el globo que se encuentra en el espacio actual.
   * Desplaza el índice del espacio seleccionado hacia adelante.
   * Con movimiento permitido, el globo estalla y la palabra vuela hasta su espacio.
   *
   * @param picked - Globo seleccionado.
   * @param role - Posición del globo (define su color).
   * @param parts - Elementos del globo, para medir el origen de la animación.
   */
  const handlePick = contextSafe((picked: LetterItem, role: number, parts: BalloonParts) => {
    if (validation) return;
    if (!picked.enable) return;

    playSound(SOUNDS.POP);

    const fx = fxRef.current;
    const slot = slotRefs.current[selectIndex];

    if (canAnimate && fx && slot) {
      const layerRect = fx.getBoundingClientRect();
      const slotRect = slot.getBoundingClientRect();

      burst(fx, centerIn(parts.art.getBoundingClientRect(), layerRect), {
        ...SHARD,
        colors: colorsOf(role),
        count: 12
      });

      flyChip(
        fx,
        layerRect,
        parts.plate.getBoundingClientRect(),
        slotRect,
        picked.letter,
        css.flyer,
        contextSafe(() => {
          playSound(SOUNDS.DROP);
          ring(fx, centerIn(slotRect, layerRect), css.ring, RING_COLOR);
          burst(fx, centerIn(slotRect, layerRect), {
            ...SHARD,
            colors: LAND_COLORS,
            count: 6,
            reach: [24, 48],
            size: [4, 7]
          });
        })
      );
    }

    setBalloons((prev) => {
      const currentInSlot = spaces[selectIndex];

      return prev.map((b) => {
        if (currentInSlot && b.index === currentInSlot.index) return { ...b, enable: true };
        if (b.index === picked.index) return { ...b, enable: false };
        return b;
      });
    });

    setSpaces((prev) => prev.map((s, i) => (i === selectIndex ? { letter: picked.letter, index: picked.index } : s)));

    const nextSelect = selectIndex >= spaces.length - 1 ? 0 : selectIndex + 1;
    setSelectIndex(nextSelect);

    // Si se eligió con el teclado, el foco pasa al siguiente globo disponible (o al espacio activo si no quedan).
    if (document.activeElement === parts.button) {
      focusSoon(() => {
        const open = [...(balloonsRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [])];
        const after = open.find((b) => parts.button.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

        return after ?? open[0] ?? slotRefs.current[nextSelect];
      });
    }
  });

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

    playSound(SOUNDS.TICK);

    // re-habilitar el globo que estaba en ese espacio
    setBalloons((prev) => prev.map((b) => (b.index === slot.index ? { ...b, enable: true } : b)));

    // limpiar espacio
    setSpaces((prev) => prev.map((s, i) => (i === idx ? null : s)));

    // el botón de eliminar desaparece con la letra: el foco vuelve al espacio
    focusSoon(() => slotRefs.current[idx]);
  };

  const handleSlotClick = (idx: number) => {
    if (idx !== selectIndex) playSound(SOUNDS.TICK);
    setSelectIndex(idx);
  };

  const handleSlotKeyDown = (event: React.KeyboardEvent, idx: number) => {
    if (event.key !== 'Backspace' && event.key !== 'Delete') return;
    if (!spaces[idx]) return;

    event.preventDefault();
    removeLetter(idx);
  };

  /**
   * Resetea el estado del nivel cuando se activa la propiedad `reset`.
   */
  useEffect(() => {
    if (!reset) return;

    setBalloons(initialItems);
    setSpaces(Array.from({ length: words.length }, () => null));
    setSelectIndex(0);
    setWave(true);

    const timer = setTimeout(() => setWave(false), 1200);
    return () => clearTimeout(timer);
  }, [reset, initialItems, words.length]);

  /**
   * Celebración al acertar: lluvia de fragmentos y ondas desde la bandeja de la frase.
   * (El error se muestra con un temblor de CSS: no necesita JS.)
   */
  useGSAP(
    () => {
      const fx = fxRef.current;
      const tray = trayRef.current;
      if (viewState !== 'success' || !canAnimate || !fx || !tray) return;

      const layerRect = fx.getBoundingClientRect();
      const trayRect = tray.getBoundingClientRect();
      const center = centerIn(trayRect, layerRect);

      [-0.3, 0, 0.3].forEach((offset, i) => {
        gsap.delayedCall(i * 0.12, () => {
          const at = { x: center.x + trayRect.width * offset, y: center.y };

          ring(fx, at, css.ring, RING_COLOR);
          burst(fx, at, { ...SHARD, colors: CONFETTI_COLORS, count: 14, reach: [70, 190], size: [7, 13] });
        });
      });
    },
    { scope: rootRef, dependencies: [viewState, canAnimate] }
  );

  const status = [
    t.assembled(PARCIAL_WORD),
    viewState === 'success' ? t.correct : viewState === 'wrong' ? t.wrongHint : ''
  ]
    .filter(Boolean)
    .join('. ');

  return (
    <div className="u-flow" ref={rootRef}>
      <FullScreenAlert />
      <div>
        <GameBalloonsParallax>
          <div className={css.content}>
            <div ref={fxRef} className={css.fx} aria-hidden="true" />

            <div ref={balloonsRef} className={css.balloons} role="group" aria-label={t.balloons}>
              {balloons.map((b, i) => (
                <GameBalloonsElement
                  key={b.index}
                  balloonRole={i}
                  letter={b.letter}
                  enable={b.enable}
                  canAnimate={canAnimate}
                  respawnDelay={wave ? i * 0.06 : 0}
                  onPick={(parts) => handlePick(b, i, parts)}
                />
              ))}
            </div>

            <div ref={trayRef} className={css.tray} data-state={viewState ?? undefined}>
              <p role="status" className="u-sr-only">
                {status}
              </p>

              <div className={css.tray__head} aria-hidden="true">
                <span className={css.tag}>{t.sentenceTag}</span>
                <span className={css.counter}>
                  {pad(filled)}/{pad(spaces.length)}
                </span>

                {viewState && (
                  <span className={css.verdict} data-state={viewState}>
                    {viewState === 'success' ? `✔ ${t.correct}` : `✖ ${t.wrong}`}
                  </span>
                )}
              </div>

              <div className={css.slots} role="group" aria-label={t.slots}>
                {spaces.map((obj, i) => {
                  const isSelected = selectIndex === i;
                  const canRemove = !!obj && isSelected && !validation;

                  return (
                    <div key={i} className={css.slot__wrap} style={{ '--i': i } as React.CSSProperties}>
                      <button
                        ref={(el) => {
                          slotRefs.current[i] = el;
                        }}
                        type="button"
                        className={css.slot}
                        disabled={validation}
                        data-empty={obj ? undefined : true}
                        data-selected={!validation && isSelected ? true : undefined}
                        aria-current={isSelected ? 'true' : undefined}
                        aria-label={obj ? t.slotFilled(i + 1, obj.letter) : t.slotEmpty(i + 1)}
                        onClick={() => handleSlotClick(i)}
                        onKeyDown={(event) => handleSlotKeyDown(event, i)}
                      >
                        {obj && (
                          <span
                            key={obj.index}
                            className={css.slot__word}
                            style={canAnimate ? ({ '--land-delay': `${FLIGHT_S}s` } as React.CSSProperties) : undefined}
                          >
                            {obj.letter}
                          </span>
                        )}
                        <span className={css.slot__cursor} aria-hidden="true" />
                      </button>

                      {canRemove && (
                        <button
                          type="button"
                          className={css.slot__remove}
                          onClick={() => removeLetter(i)}
                          aria-label={t.remove(i + 1, obj.letter)}
                        >
                          <span aria-hidden="true">&#10005;</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </GameBalloonsParallax>
      </div>
    </div>
  );
};
