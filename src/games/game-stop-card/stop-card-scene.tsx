import { useEffect, useId, useRef, useState } from 'react';

import { Button, FullScreenAlert, FullScreenButton, Panel, ValidationStatus } from '@/components/ui';
import { useCanAnimate, useDeferredResult, useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { StopSceneContextProvider, useStopGame } from './stop-card-context';
import { StopCardMap } from './stop-card-map';

import type { Radio } from './types/types';

import css from './stop-card.module.css';

interface Props {
  /** Las respuestas (`StopCard.Radio`) de esta parada. */
  children: React.ReactNode;
  question: string;
  /**
   * Se llama un instante después de comprobar (para que se vea el viaje). `result` es el acierto de ESTA pregunta;
   * `options` lleva la respuesta elegida (`name: game-stop-group-<name>`), `mistakes` los fallos de esta parada y
   * `finished` es true si con ella se completó el camino.
   */
  onResult?: (data: { result: boolean; options: Radio[]; mistakes: number; finished: boolean }) => void;
  /** Debe terminar en el número de la parada (stop-1, stop-2…). */
  id: string;
  /** Sección del panel a la que lleva «Siguiente parada» (por defecto, la siguiente a la de esta parada). */
  nextSection?: number;
}

// Lo que tarda el viaje (o el tropiezo) antes de entregar el resultado
const RESULT_DELAY_MS = { correct: 2600, wrong: 1500 } as const;

export const StopCardScene: React.FC<Props> = ({ question, id, children, onResult, nextSection }) => {
  const lang = useLang();
  const t = i18n[lang];
  const canAnimate = useCanAnimate();
  const { defer, flush } = useDeferredResult();
  const questionId = useId();

  const game = useStopGame();
  const { questionCount, scenes, lastCheck, currentStop, finished, mistakesTotal, travelerT } = game;

  const index = game.registerScene(id);
  const scene = scenes[id];
  const status = scene?.status ?? 'idle';
  const choice = scene?.choice ?? null;
  const isLast = index === questionCount - 1;
  const locked = index > currentStop;
  const event = lastCheck?.sceneId === id ? lastCheck : null;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const onResultRef = useRef(onResult);
  const notifiedTick = useRef(0);
  const wasWrong = useRef(false);
  const [gameEl, setGameEl] = useState<HTMLDivElement | null>(null);

  onResultRef.current = onResult;

  // Entrega el resultado de la comprobación hecha en esta escena (una sola vez por comprobación)
  useEffect(() => {
    if (!lastCheck || lastCheck.sceneId !== id || lastCheck.tick === notifiedTick.current) return;

    notifiedTick.current = lastCheck.tick;

    const { correct, options, mistakes, finished: done } = lastCheck;

    defer(
      () => onResultRef.current?.({ result: correct, options, mistakes, finished: done }),
      correct,
      canAnimate ? RESULT_DELAY_MS[correct ? 'correct' : 'wrong'] : undefined
    );
  }, [lastCheck, id, defer, canAnimate]);

  // Tras comprobar, el foco pasa al botón que sigue (si otra cosa, p. ej. un modal, ya lo tomó, no se le quita)
  useEffect(() => {
    if (!event) return;

    const frame = requestAnimationFrame(() => {
      const root = rootRef.current;
      const active = document.activeElement;
      // El foco está "perdido" si no hay nada, si está en la escena o en uno de sus botones (que acaba de desactivarse)
      const lost =
        !active || active === document.body || !!root?.contains(active) || !!active.closest(`[data-stop-for="${id}"]`);

      if (!root || !lost) return;

      // «Reintentar» lo coloca la página (fuera de la escena): se busca por el id de la parada
      const target = !event.correct
        ? document.querySelector<HTMLElement>(`[data-stop-for="${id}"][data-stop-button="reset"]`)
        : root.querySelector<HTMLElement>(event.finished ? '[data-focus="summary"]' : '[data-action="next"]');

      target?.focus({ preventScroll: true });
    });

    return () => cancelAnimationFrame(frame);
  }, [event, id]);

  // Tras reintentar se entrega ya lo que estuviera en espera y el foco vuelve a la primera respuesta que aún se puede elegir
  useEffect(() => {
    if (wasWrong.current && status === 'idle') {
      flush();
      rootRef.current?.querySelector<HTMLElement>('input[type="radio"]:not(:disabled)')?.focus({ preventScroll: true });
    }

    wasWrong.current = status === 'wrong';
  }, [status, flush]);

  // Actualiza el estado de la escena cuando entra o sale de fullscreen
  useEffect(() => {
    if (!gameEl) return;

    const apply = () => gameEl.toggleAttribute('data-fullscreen', document.fullscreenElement === gameEl);

    apply();
    document.addEventListener('fullscreenchange', apply);

    return () => {
      document.removeEventListener('fullscreenchange', apply);
      gameEl.removeAttribute('data-fullscreen');
    };
  }, [gameEl]);

  const setRef = (node: HTMLDivElement | null) => {
    rootRef.current = node;
    setGameEl(node);
  };

  const say = locked
    ? ''
    : status === 'correct'
      ? isLast
        ? t.say.goal
        : t.say.ok(index + 2)
      : status === 'wrong'
        ? t.say.ko
        : choice
          ? t.say.chosen
          : t.say.idle(index + 1);

  const gameId = `stop-game-${id}`;

  return (
    <div ref={setRef} id={gameId} className={css.stop} data-scene-id={id} data-fullscreen>
      <FullScreenAlert />

      <div className={css.hud}>
        <ol className={css.steps} aria-label={t.stops}>
          {Array.from({ length: questionCount }, (_, i) => {
            const state = i < currentStop ? 'done' : i === currentStop ? 'here' : 'next';

            return (
              <li key={i} className={css.step} data-state={state} aria-current={i === index ? 'step' : undefined}>
                <span className={css['step-badge']} aria-hidden="true">
                  {state === 'done' ? '✔' : i + 1}
                </span>
                <span className="u-sr-only">
                  {t.stop(i + 1, questionCount)}: {t.stepState[state]}
                </span>
              </li>
            );
          })}
          <li className={css.step} data-state={finished ? 'done' : 'next'} data-goal>
            <span className={css['step-badge']} aria-hidden="true" />
            <span className={css['step-goal']}>{t.goal}</span>
          </li>
        </ol>

        <p className={css.slips}>
          {t.mistakes}: <strong>{mistakesTotal}</strong>
        </p>
      </div>

      <div className={css.board}>
        <div className={css['map-holder']}>
          <FullScreenButton elementId={gameId} addClass={css['fullscreen-button']} />
          <StopCardMap
            count={questionCount}
            currentStop={currentStop}
            finished={finished}
            travelerT={travelerT}
            event={event}
            stopIndex={index}
            arrive={index === 0}
          />
        </div>

        <div className={css.panel}>
          <p className={css.tag}>{t.stop(index + 1, questionCount)}</p>
          <p id={questionId} className={css.question} dangerouslySetInnerHTML={{ __html: question }} />

          {locked && <p className={css.locked}>{t.locked(currentStop + 1)}</p>}

          <StopSceneContextProvider
            value={{
              id,
              index,
              locked,
              status,
              choice,
              discarded: scene?.discarded ?? [],
              choose: (radio) => game.choose(id, index, radio)
            }}
          >
            <div role="radiogroup" aria-labelledby={questionId} className={css.signs}>
              {children}
            </div>
          </StopSceneContextProvider>

          <p className={css.say} aria-hidden="true">
            {say}
          </p>

          {/* Dentro de la tarjeta, como en los demás juegos */}
          {status === 'correct' && !isLast && (
            <div className={css.next}>
              <Panel.Button section={nextSection ?? index + 2}>
                <Button label={t['next-button']} data-action="next" />
              </Panel.Button>
            </div>
          )}

          {finished && isLast && status === 'correct' && (
            <div className={css.summary}>
              <p className={css['summary-title']} tabIndex={-1} data-focus="summary">
                {t.end.title}
              </p>
              <p>{mistakesTotal === 0 ? t.end.perfect : t.end.some(mistakesTotal)}</p>
            </div>
          )}

          <ValidationStatus
            validated={status !== 'idle'}
            correct={status === 'correct'}
            correctText={isLast ? t.say.goal : t.say.ok(index + 2)}
            wrongText={t.say.ko}
          />
        </div>
      </div>
    </div>
  );
};
