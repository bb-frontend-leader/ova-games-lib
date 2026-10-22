import React, { memo, useEffect, useRef } from 'react';

import { Button, ValidationStatus } from '@/components/ui';
import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { SKY } from './lib/time-of-day';
import { useSvgUid } from './lib/use-svg-uid';
import { RaceCardButton } from './race-card-button';
import { useGameContext } from './race-card-context';
import { Carts, Headlights, Road, Score, Sky, Tint } from './svg-parts';

import type { DriversType } from './types/types';

import raceSvg from './styles/race-svg.module.css';
import css from './svg-card.module.css';

interface Props {
  question: string;
  id: string;
  drivers?: DriversType;
  notifyReset?: () => void;
}

const RaceCard: React.FC<Props> = ({ question, id, drivers, notifyReset }) => {
  const lang = useLang();
  const { game, validation, result, finished, openResults, timeOfDay } = useGameContext();
  const uid = useSvgUid();

  const svgRef = useRef<SVGSVGElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const palette = SKY[timeOfDay];

  /**
   * Al responder la última pregunta el botón «Comprobar» deja su lugar a «Ver resultados». Si el teclado estaba
   * en «Comprobar», el foco se pasa al nuevo botón en vez de perderse. Si otra cosa ya tomó el foco (p. ej. un
   * modal que abrió la página), no se le quita.
   */
  useEffect(() => {
    if (!finished || game.lastValidatedSceneId !== id) return;

    const frame = requestAnimationFrame(() => {
      const active = document.activeElement;
      const lost = !active || active === document.body || !!svgRef.current?.contains(active);

      if (lost) resultsRef.current?.querySelector('button')?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [finished, game.lastValidatedSceneId, id]);

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={raceSvg['race-svg']}
      data-game-over={finished ? 'true' : 'false'}
      data-phase={timeOfDay}
      viewBox="0 0 777.6 500"
    >
      <Sky phase={timeOfDay} uid={uid} />
      <Road />
      <Carts skin={game.carId} />
      <Tint phase={timeOfDay} />
      {palette.headlights && <Headlights uid={uid} move1={game.move1} move2={game.move2} />}
      <Score drivers={drivers} />

      {/* Question */}
      <foreignObject x="150" y="10" width="500" height="200">
        <div className="u-flow">
          <div className={`u-flow u-text-center ${css['box-questions']}`}>
            <p className="u-font-bold">{question}</p>
          </div>
          <div className={css['question__validation-buttons']}>
            {finished ? (
              <div ref={resultsRef}>
                <Button label={i18n[lang]['results-button']} onClick={openResults} />
              </div>
            ) : (
              <RaceCardButton sceneId={id}>
                <Button label={i18n[lang]['check-button']} />
              </RaceCardButton>
            )}
            <RaceCardButton type="reset" sceneId={id}>
              <Button onClick={notifyReset} label={i18n[lang]['restar-button']} />
            </RaceCardButton>
          </div>
          <ValidationStatus validated={game.lastValidatedSceneId === id && validation} correct={result} />
        </div>
      </foreignObject>
    </svg>
  );
};

export const RaceCardScene = memo(RaceCard);
