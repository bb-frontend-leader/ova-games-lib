import { useCallback, useEffect, useRef, useState } from 'react';
import { FullScreenAlert, /*FullScreenButton*/ } from '@core/components';

import { DriversType, Radio } from './types/types';
import { useGameContext } from './race-card-context';
import { RaceCardScene } from './race-card-scene';

import css from './svg-card.module.css';

interface Props {
  children: React.ReactNode;
  question: string;

  onResult?: ({ result, options }: { result: boolean; options: Radio[] }) => void;
  id: string;
  drivers?: DriversType;
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

    // Dispara SOLO cuando answeredCount aumenta (es decir, hubo una validación)
    if (game.answeredCount > prevAnsweredCountRef.current) {
      onResult({ result, options: radios });
    }

    prevAnsweredCountRef.current = game.answeredCount;
  }, [game.answeredCount, result, radios, onResult]);

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
      <div id={id} className={css['game-wrapper']} ref={setRef}  data-fullscreen>
        <div className={css['game-wrapper__scene']}>
          <RaceCardScene question={question} {...props} id={id} drivers={props.drivers} />
        </div>
        <div className={css['game-wrapper__options']}>{children}</div>
      </div>
    </div>
  );
};
