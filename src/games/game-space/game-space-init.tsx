import { useEffect, useRef, useState } from 'react';
import { Panel as PanelUI } from 'books-ui';

import { useLang } from '@/hooks';

import { ASTEROID, ASTRONAUT, i18n, ICON, UNIVERSE01, UNIVERSE02 } from './lib/constant';

import css from './game-space.module.css';

interface GameSpaceInitProps {
  addClass?: string;
  title?: string;
  /** Lo que dice el astronauta en el globo de bienvenida */
  textInit?: string;
  /** Mismo fondo que la galaxia del juego: '1' o '2' (por defecto). */
  universeType?: '1' | '2';
}

const safeSrc = (rawSrc: string): string => rawSrc.replace(/\s/g, ''); // Elimina espacios en blanco accidentales

/**
 * Pantalla de inicio: el astronauta flota entre planetas y da la bienvenida en su globo. «Jugar» abre las
 * instrucciones y «¡Despegar!» pasa a la sección siguiente del panel, donde está el juego.
 */
export const GameSpaceInit: React.FC<GameSpaceInitProps> = ({ addClass, title, textInit, universeType = '2' }) => {
  const lang = useLang();
  const t = i18n[lang].init;
  const universeData = universeType === '1' ? UNIVERSE01 : UNIVERSE02;
  const bg = safeSrc(universeData.find((item) => item.cover)?.cover ?? '');

  const [step, setStep] = useState<'welcome' | 'rules'>('welcome');
  const playRef = useRef<HTMLButtonElement>(null);
  const rulesRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false); // El foco solo se mueve si el usuario cambió de paso

  useEffect(() => {
    if (!moved.current) return;

    (step === 'rules' ? rulesRef : playRef).current?.focus({ preventScroll: true });
  }, [step]);

  const goTo = (next: 'welcome' | 'rules') => {
    moved.current = true;
    setStep(next);
  };

  return (
    <div
      className={`${css['space-container']} ${css.screen} ${addClass ?? ''}`}
      style={{ '--bg-image': `url("${bg}")` } as React.CSSProperties}
    >
      {universeData.map((item, index) => {
        const [key, value] = Object.entries(item)[0];
        if (key === 'cover') return null;
        return <img key={index} src={value} alt="" aria-hidden="true" className={css[key]} />;
      })}
      <img src={safeSrc(ASTEROID)} alt="" aria-hidden="true" className={css['image_depth']} />

      {step === 'welcome' ? (
        <div className={css['screen-content']}>
          <div className={css.question}>
            <img src={safeSrc(ICON)} className={css.icon} alt="" aria-hidden="true" />
            <h2 className={css['screen-title']}>{title ?? t.title}</h2>
            <img src={safeSrc(ICON)} className={`${css.icon} ${css['icon-reverse']}`} alt="" aria-hidden="true" />
          </div>

          <div className={css['screen-hero']}>
            <p className={css.comm}>{textInit ?? t.hello}</p>
            <img src={safeSrc(ASTRONAUT)} alt="" aria-hidden="true" className={css.astronaut} />
          </div>

          <button ref={playRef} type="button" className={css['space-button']} onClick={() => goTo('rules')}>
            {t.play}
          </button>
        </div>
      ) : (
        <div className={css['screen-content']}>
          <div className={css.rules} role="group" aria-labelledby="space-rules-title">
            <h2 id="space-rules-title" ref={rulesRef} tabIndex={-1} className={css['rules-title']}>
              {t.rulesTitle}
            </h2>

            <ol className={css['rules-list']}>
              {t.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ol>

            <div className={css['screen-actions']}>
              <button
                type="button"
                className={`${css['space-button']} ${css['space-button--ghost']}`}
                onClick={() => goTo('welcome')}
              >
                {t.back}
              </button>

              <PanelUI.Button section={1}>
                <button type="button" className={css['space-button']}>
                  {t.start}
                </button>
              </PanelUI.Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
