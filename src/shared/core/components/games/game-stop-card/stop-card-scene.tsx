import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/shared/ui/components';

import { FullScreenAlert, /*FullScreenButton*/ } from '../../ui';

import { Radio } from './types/types';
import { background, markers, MARKERS_LAYOUT } from './const';
import { StopCardButton } from './stop-card-button';
import { useStopGame } from './stop-card-context';

import css from './stop-card.module.css';

interface Props {
  children: React.ReactNode;
  question: string;

  onResult?: ({ result, options }: { result: boolean; options: Radio[] }) => void;
  id: string;
}

const BUTTONS_LAYOUT = [
  { x: 11.445, y: 255.578, scale: 0.9945, colorClass: css.orange },
  { x: 299.308, y: 207.588, scale: 0.9892, colorClass: css.blue },
  { x: 499.521, y: 83.971, scale: 0.9892, colorClass: css.purple },
  { x: 15.17, y: 79.567, scale: 0.9891, colorClass: css.green }
] as const;

export const StopCardScene: React.FC<Props> = ({ question, id, children, onResult, ...props }) => {
  const { questionCount, listStop, setActiveSceneId, game } = useStopGame();

  const lastNotifiedTickRef = useRef<number>(0);
  const [gameEl, setGameEl] = useState<HTMLDivElement | null>(null);

  const count = Math.min(questionCount ?? 0, BUTTONS_LAYOUT.length, MARKERS_LAYOUT.length);

  const buttons = BUTTONS_LAYOUT.slice(0, count);
  const markerLayouts = MARKERS_LAYOUT.slice(0, count);

  const setRef = useCallback((node: HTMLDivElement | null) => {
    setGameEl(node);
  }, []);

  // Busca el index de la escena actual a partir del id (último número)
  const sceneIndex = (() => {
    const match = id.match(/(\d+)$/); // último número
    if (!match) return -1;
    return Math.max(0, Number(match[1]) - 1);
  })();

  /**
   * Dispara el onResult cuando esta escena es validada (última escena validada coincide con el id de esta escena)
   */
  useEffect(() => {
    if (!onResult) return;

    // Solo si esta escena fue la validada
    if (game.lastValidatedSceneId !== id) return;

    // Evita re-disparos para el mismo click de validación
    if (lastNotifiedTickRef.current === game.validatedTick) return;
    lastNotifiedTickRef.current = game.validatedTick;

    onResult({
      result: Boolean(game.result),
      options: game.options ?? []
    });
  }, [game.lastValidatedSceneId, game.validatedTick, game.result, id, onResult, game.options]);

  /**
   * Actualiza el estado de la escena cuando entra o sale de fullscreen
   */
  useEffect(() => {
    if (!gameEl) return;

    const apply = () => {
      const isFs = document.fullscreenElement === gameEl;
      gameEl.toggleAttribute('data-fullscreen', isFs);
    };

    apply(); // por si ya entra montado en fullscreen
    document.addEventListener('fullscreenchange', apply);

    return () => {
      document.removeEventListener('fullscreenchange', apply);
      gameEl.removeAttribute('data-fullscreen');
    };
  }, [gameEl]);

  return (
    <div
      className="u-flow"
      data-scene-id={id}
      onPointerDown={() => setActiveSceneId(id)}
      onFocusCapture={() => setActiveSceneId(id)}>
      <FullScreenAlert />
      <div id="stop-game" className={css['stop-game-container']} ref={setRef} data-fullscreen {...props}>
        {/* <FullScreenButton elementRef={gameEl} addClass={css['fullScreen__button']} /> */}
        <svg
          id="svg-stop-game"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 702 500"
          xmlSpace="preserve">
          <style>
            {
              '#svg-stop-game .st1{display:none}#svg-stop-game .st11{fill:none}#svg-stop-game .st12{fill:#fff}#svg-stop-game .st14{font-size:66.4636px}'
            }
          </style>
          <image
            id="Fondo_general"
            x="0"
            y="0"
            width="100%"
            height="100%"
            xlinkHref={background}
            preserveAspectRatio="xMidYMid meet"
          />

          {/* Botones dinámicos */}
          {buttons.map((b, idx) => {
            const label = String(idx + 1);

            return (
              <foreignObject
                key={label}
                x={b.x}
                y={b.y}
                width="92"
                height="92"
                requiredExtensions="http://www.w3.org/1999/xhtml"
                style={{ overflow: 'visible' }}>
                <div
                  className={`${css['stop-game-button']} ${b.colorClass}`}
                  style={{ transform: `scale(${b.scale})`, transformOrigin: 'top left' }}>
                  <span>{label}</span>
                </div>
              </foreignObject>
            );
          })}

          {/* Markers dinámicos */}
          {markerLayouts.map((m, idx) => {
            const isActive = Boolean(listStop?.[idx]);

            // destella el marker correspondiente SOLO cuando esta escena es la activa
            const shouldGlow = idx === sceneIndex;

            const href = isActive ? markers.correct : markers.default;

            return (
              <g key={`marker-${idx}`}>
                {/* Capa glow (debajo) */}
                {shouldGlow && (
                  <image
                    width={m.width}
                    height={m.height}
                    transform={m.transform}
                    overflow="visible"
                    xlinkHref={href}
                    className={css.markerGlow}
                  />
                )}

                {/* Capa normal (encima) */}
                <image
                  width={m.width}
                  height={m.height}
                  transform={m.transform}
                  overflow="visible"
                  xlinkHref={href}
                  id={m.id}
                  className={!isActive ? css['move-image'] : ''}
                />
              </g>
            );
          })}

          <foreignObject x="65" y="390" width={600} height={100} style={{ overflow: 'visible' }}>
            <div className={css['stop-game-container-question']}>
              <p dangerouslySetInnerHTML={{ __html: question }} />
            </div>
          </foreignObject>
        </svg>
        <div className={css['radio-wrapper']}>{children}</div>
      </div>
      <div className={css['stop-game-buttons']}>
        <StopCardButton sceneId={id}>
          <Button label="Comprobar" id="button-comprobar" />
        </StopCardButton>
        <StopCardButton type="reset" sceneId={id}>
          <Button label="Reintentar" />
        </StopCardButton>
      </div>
    </div>
  );
};
