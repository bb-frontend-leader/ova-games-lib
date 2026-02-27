import { useState } from 'react';
import { Panel as PanelUI } from 'books-ui';

import { useOvaContext } from '@/context/ova-context';

import { BG, i18n } from './const';

import css from './game-casino.module.css';

interface GameCasinoInitProps {
  className?: string;
  textInit?: string;
}

export const GameCasinoInit: React.FC<GameCasinoInitProps> = ({ textInit, className }) => {
  const { lang } = useOvaContext();
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') toggleModal();
  };

  return (
    <figure className="u-flow">
      <svg className={className} viewBox="0 0 1067 500">
        <image width={1068} height={501} xlinkHref={BG.background} transform="translate(-0.84 -0.67)" />

        {!isOpen ? (
          <g id="WelcomeScreen">
            <image width={454} height={170} xlinkHref={BG.casino13} transform="translate(286.16 311.33)" />
            <foreignObject width={300} height={100} x={400} y={320}>
              {/* CAMBIO: Agregadas clases de color y bold + style inline */}
              <p className="u-text-center u-font-bold u-text-white" style={{ color: '#ffffff', fontWeight: 'bold' }}>
                {textInit}
              </p>
            </foreignObject>

            <image width={561} height={283} xlinkHref={BG.casino14} transform="translate(271.16 15.33)" />
            <text
              x="560"
              y="170"
              fill="#fff"
              fontSize={60}
              fontWeight={700}
              textAnchor="middle"
              className="u-uppercase">
              CASINO
            </text>

            <foreignObject width={300} height={100} x={530} y={370}>
              <div className={`${css['button-init']} u-text-white u-uppercase u-font-bold`}>
                <button onClick={() => setIsOpen(true)}>{i18n[lang].play}</button>
              </div>
            </foreignObject>
          </g>
        ) : (
          <g id="RulesModal">
            <image width={620} height={301} xlinkHref={BG.casino15} transform="translate(230.16 75.33)" />

            <foreignObject width="580" height="150" x="250" y="250">
              {/* CAMBIO: Envoltorio con color blanco y bold para el texto de reglas */}
              <div
                className="u-text-center u-flow u-text-white u-font-bold"
                style={{ color: '#ffffff', fontWeight: 'bold' }}>
                <p>{i18n[lang].text}</p>
                <PanelUI.Button section={1}>
                  <button className={`u-font-bold ${css['button-init-game']}`}>¡{i18n[lang].goodLuck}!</button>
                </PanelUI.Button>
              </div>
            </foreignObject>

            <g
              role="button"
              tabIndex={0}
              aria-label="Cerrar modal"
              onClick={() => setIsOpen(false)}
              onKeyDown={handleKeyDown}
              className="u-cursor-pointer">
              <image width={50} height={50} xlinkHref={BG.casino5} transform="translate(817.16 65.33)" />
            </g>
          </g>
        )}
      </svg>
    </figure>
  );
};
