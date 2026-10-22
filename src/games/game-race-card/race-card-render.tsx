import { useCallback, useEffect, useRef, useState } from 'react';

import { FullScreenAlert, FullScreenButton } from '@/components/ui';

import { useGameContext } from './race-card-context';
import { RaceCardPodium } from './race-card-podium';
import { RaceCardScene } from './race-card-scene';

import type { DriversType, Radio } from './types/types';

import css from './svg-card.module.css';

interface Props {
  children: JSX.Element | JSX.Element[];
  question: string;

  onResult?: ({ result, options }: { result: boolean; options: Radio[] }) => void;
  id: string;
  drivers?: DriversType;
  notifyReset?: () => void;
}

export const RaceCardRender: React.FC<Props> = ({ question, id, children, onResult, ...props }) => {
  const { result, radios, game } = useGameContext();

  const prevAnsweredCountRef = useRef<number>(game.answeredCount);
  const [gameEl, setGameEl] = useState<HTMLDivElement | null>(null);

  const setRef = useCallback((node: HTMLDivElement | null) => {
    setGameEl(node);
  }, []);

  /**
   * Dispara el onResult cuando answeredCount aumenta (es decir, hubo una validación)
   */
  useEffect(() => {
    if (!onResult) return;

    // Solo dispara si esta escena fue la que se validó
    if (game.lastValidatedSceneId !== id) return;

    if (game.answeredCount > prevAnsweredCountRef.current) {
      onResult({ result, options: radios });
    }

    prevAnsweredCountRef.current = game.answeredCount;
  }, [game.answeredCount, game.lastValidatedSceneId, result, radios, onResult, id]);

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
    <div className={css['game']}>
      <FullScreenAlert />
      <FullScreenButton elementId={id} />
      <div id={id} className={css['game-wrapper']} ref={setRef} data-fullscreen>
        {game.resultsOpen ? (
          // Con el podio abierto no hay nada más que responder: la escena y las opciones dejan su lugar
          <RaceCardPodium drivers={props.drivers} />
        ) : (
          <>
            <div className={css['game-wrapper__scene']}>
              <RaceCardScene
                question={question}
                {...props}
                id={id}
                drivers={props.drivers}
                notifyReset={props.notifyReset}
              />
            </div>
            <div className={css['game-wrapper__options']} role="radiogroup" aria-label={question}>
              {children}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
