import React, { memo, useEffect, useMemo, useRef } from 'react';
import { Button } from '@ui/components';

import { useOvaContext } from '@/context/ova-context';

import type { DriversType } from './types/types';
import { i18n } from './const';
import { RaceCardButton } from './race-card-button';
import { useGameContext } from './race-card-context';
import { Carts, Feedback, Road, Score, Sky } from './svg-parts';

import css from './svg-card.module.css';

interface Props {
  question: string;
  id: string;
  drivers?: DriversType;
}

const HALF_DAY = 12;
const PASSING_PERCENTAGE = 0.6;

const RaceCard: React.FC<Props> = ({ question, id, drivers }) => {
  const { lang } = useOvaContext();
  const { game, questionCount, validation } = useGameContext();

  const refQuestion = useRef<HTMLDivElement>(null);

  const SKY_COLOR = new Date().getHours() < HALF_DAY ? '#AFCFF1' : '#ffb36b';

  /**
   * Determina si el jugador ha acertado la pregunta.
   */
  const isRight = useMemo(() => {
    if (!questionCount) return false;
    return game.rightAnswers / questionCount >= PASSING_PERCENTAGE;
  }, [game.rightAnswers, questionCount]);

  /**
   * Determina si el jugador ha respondido todas las preguntas.
   */
  const lastFeedback = useMemo(() => {
    return game.answeredCount === questionCount && validation;
  }, [game.answeredCount, questionCount, validation]);


  /**
   * Determina si el jugador ha respondido todas las preguntas.
   * Cuando el juego ha terminado, se detienen las animaciones CSS.
   */
  useEffect(() => {
    const root = document.documentElement; 

    if (lastFeedback) {
      root.setAttribute('data-stop-animations', 'true');
    } else {
      root.removeAttribute('data-stop-animations');
    }
  }, [lastFeedback]);

  return (
    <>
      <svg
        id="svg-sld14-game"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        data-game-over={lastFeedback ? 'true' : 'false'}
        x="0px"
        y="0px"
        viewBox="0 0 777.6 500"
        style={{
          background: 'new 0 0 777.6 500'
        }}
        xmlSpace="preserve">
        <style type="text/css">
          {`
            #svg-sld14-game .st0 {
                fill: ${SKY_COLOR};
            }

            #svg-sld14-game .st1 {
                fill: #CCEAF8;
            }

            #svg-sld14-game .st2 {
                fill: #B8E6F6;
            }

            #svg-sld14-game .st3 {
                fill: #569E3A;
            }

            #svg-sld14-game .st4 {
                fill: #876132;
            }

            #svg-sld14-game .st5 {
                fill: #76AC2B;
            }

            #svg-sld14-game .st6 {
                fill: #6D961F;
            }

            #svg-sld14-game .st7 {
                fill: #72C628;
            }

            #svg-sld14-game .st8 {
                fill: #8EC15B;
            }

            #svg-sld14-game .st9 {
                fill: #D6D5CD;
            }

            #svg-sld14-game .st10 {
                fill: #E42D2C;
            }

            #svg-sld14-game .st11 {
                fill: #FDFDFD;
            }

            #svg-sld14-game .st12 {
                fill: #8E8D87;
            }

            #svg-sld14-game .st13 {
                fill: #696969;
            }

            #svg-sld14-game .st14 {
                fill: #6D6D68;
            }

            #svg-sld14-game .st15 {
                fill: #5B9B3D;
            }

            #svg-sld14-game .st16 {
                fill: #418338;
            }

            #svg-sld14-game .st17 {
                fill: #4A5147;
            }

            #svg-sld14-game .st18 {
                opacity: 0.3;
                fill: #1D1D1B;
                enable-background: new;
            }

            #svg-sld14-game .st19 {
                fill: #1D1D1B;
            }

            #svg-sld14-game .st20 {
                fill: #FFFFFF;
            }

            #svg-sld14-game .st21 {
                fill: #231F20;
            }

            #svg-sld14-game .st22 {
                fill: #191717;
            }

            #svg-sld14-game .st23 {
                fill: #76e0b3
            }


            #svg-sld14-game .st24 {
                fill: #FAB83A;
            }

            #svg-sld14-game .st25 {
                opacity: 0.31;
                fill: #FFFFFF;
                enable-background: new;
            }

            #svg-sld14-game .st26 {
                opacity: 0.29;
                fill: #1D1D1B;
                enable-background: new;
            }

            #svg-sld14-game .st27 {
                fill: #252024;
            }

            #svg-sld14-game .st28 {
                fill: #3E393D;
            }

            #svg-sld14-game .st29 {
                fill: #6C6D69;
            }

            #svg-sld14-game .st30 {
                fill: #257100;
            }

            #svg-sld14-game .st31 {
                fill: #4da623;
            }

            #svg-sld14-game .st32 {
                fill: #247000;
            }

            #svg-sld14-game .st33 {
                fill: #23ba76;
            }

            #svg-sld14-game .aleron-azul {
                fill: #006ec2;
            }


            #svg-sld14-game .st34 {
                fill: white;
            }

            #svg-sld14-game .st35 {
                fill: none;
                stroke: #646363;
                stroke-width: 1.9779;
                stroke-linecap: round;
                stroke-miterlimit: 10;
            }

            #svg-sld14-game .st36 {
                fill: #A9A8AD;
            }

            #svg-sld14-game .st37 {
                fill: #F8CD75;
            }

            #svg-sld14-game .st38 {
                fill: #231F20;
                stroke: #A9A8AD;
                stroke-width: 1.1228;
                stroke-miterlimit: 10;
            }

            #svg-sld14-game .st39 {
                fill: #DDDDDD;
            }

            #svg-sld14-game .st40 {
                fill: #327E8C;
            }

            #svg-sld14-game .st41 {
                fill: #4FBAAB;
            }

            #svg-sld14-game .st42 {
                fill: #41a9ff;
            }

            #svg-sld14-game .st43 {
                fill: #035b81;
            }

            #svg-sld14-game .st44 {
                fill: #018cd0;
            }

            #svg-sld14-game .st45 {
                fill: #025d83;
            }

            #svg-sld14-game .st46 {
                fill: #006ec2;
            }

            #svg-sld14-game .st47 {
                fill: #ADB6DE;
            }

            #svg-sld14-game .st48 {
                fill: #2C2054;
            }

            #svg-sld14-game .st49 {
                fill: #FCC13A;
            }

            #svg-sld14-game .st50 {
                fill: #585858;
            }

            #svg-sld14-game .st51 {
                fill: none;
                stroke: #1D1D1B;
                stroke-width: 2.0523;
                stroke-miterlimit: 10;
            }

            #svg-sld14-game .st52 {
                fill: #FDC537;
                stroke: #FFFFFF;
                stroke-width: 5.7906;
                stroke-miterlimit: 10;
            }

            #svg-sld14-game .st53 {
                fill: #771928;
            }

            #svg-sld14-game .st54 {
                fill: none;
                stroke: #646363;
                stroke-width: 1.3515;
                stroke-linecap: round;
                stroke-miterlimit: 10;
            }

            #svg-sld14-game .st55 {
                fill: #231F20;
                stroke: #A9A8AD;
                stroke-width: 0.7673;
                stroke-miterlimit: 10;
            }

            #svg-sld14-game .st56 {
                fill: #FFFBDA;
                stroke: #55539F;
                stroke-width: 3.2032;
                stroke-miterlimit: 10;
            }

            #svg-sld14-game .st57 {
                fill: #FFFBDA;
                stroke: #55539F;
                stroke-width: 5.6801;
                stroke-miterlimit: 10;
            }

            #svg-sld14-game .st58 {
                fill: none;
                stroke: #1D1D1B;
                stroke-width: 1.4849;
                stroke-miterlimit: 10;
            }

            #svg-sld14-game .st59 {
                fill: #80B74C;
                stroke: #FFFFFF;
                stroke-width: 4.1896;
                stroke-miterlimit: 10;
            }

            #svg-sld14-game .st60 {
                fill: #086F4C;
            }

            #svg-sld14-game .st61 {
                fill: none;
                stroke: #646363;
                stroke-width: 1.1183;
                stroke-linecap: round;
                stroke-miterlimit: 10;
            }

            #svg-sld14-game .st62 {
                fill: #231F20;
                stroke: #A9A8AD;
                stroke-width: 0.6348;
                stroke-miterlimit: 10;
            }

            #svg-sld14-game .st63 {
                fill: #E62A29;
                stroke: #FFFFFF;
                stroke-width: 4.1896;
                stroke-miterlimit: 10;
            }

            #svg-sld14-game .st64 {
                fill: #711912;
            }

            #svg-sld14-game .st65 {
                fill: #00495C;
                stroke: #FFFFFF;
                stroke-width: 2.8702;
                stroke-miterlimit: 10;
            }
          
          `}
        </style>

        <Sky />
        <Road />
        {!lastFeedback && <Carts />}
        <Score drivers={drivers} />

        {/* Question */}
        <foreignObject x="150" y="10" width="500" height="200">
          <div className="u-flow">
            <div ref={refQuestion} className={`u-flow u-text-center ${css['box-questions']}`}>
              <p className="u-font-bold">{question}</p>
            </div>
            {/* Button check */}
            <div className={css['question__validation-buttons']}>
              <RaceCardButton sceneId={id}>
                <Button label={i18n[lang]['check-button']} />
              </RaceCardButton>
              <RaceCardButton type="reset" sceneId={id}>
                <Button label={i18n[lang]['restar-button']} />
              </RaceCardButton>
            </div>
          </div>
        </foreignObject>

        {/* Feedback */}
        <foreignObject x="150" y="200" width="500" height="280">
          {lastFeedback && <Feedback isRight={isRight} />}
        </foreignObject>
      </svg>
    </>
  );
};

export const RaceCardScene = memo(RaceCard);
