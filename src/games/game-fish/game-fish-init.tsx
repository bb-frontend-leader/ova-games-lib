import { useEffect, useRef, useState } from 'react';

import { Panel } from '@/components/ui';
import { useLang } from '@/hooks';

import { GameParallax } from './game-parallax';
import { BG, i18n } from './lib/constant';

import css from './game-fish.module.css';

interface Props {
  /** Texto del botón de la bienvenida (el que abre las reglas). */
  labelButton?: string;
  /** Frase de bienvenida bajo el título. */
  labelInstruction?: string;
  /** Sección del panel a la que lleva «¡A pescar!» (por defecto la siguiente, donde está el juego). */
  section?: number;
  title?: string;
  addClass?: string;
}

/**
 * Pantalla de inicio: el fondo marino, el título y la frase de bienvenida; el botón abre las reglas.
 * «¡A pescar!» pasa a la sección indicada del panel.
 */
export const GameFishInit: React.FC<Props> = ({
  labelButton,
  labelInstruction = 'Responde correctamente las preguntas.',
  section = 1,
  title,
  addClass
}) => {
  const lang = useLang();
  const t = i18n[lang].init;

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
    <div className={`${css['init-container']} ${addClass ?? ''}`}>
      <GameParallax />

      <div className={css['init-content']}>
        {step === 'welcome' ? (
          <>
            <h2 className={`${css['init-message-box']} ${css['init-title']}`}>
              <img src={BG.ancla} className={css['anchor-icon']} alt="" />
              {title ?? t.title}
              <img src={BG.ancla} className={css['anchor-icon']} alt="" />
            </h2>
            <p className={`${css['init-message-box']} ${css['init-text']}`}>{labelInstruction}</p>

            <button ref={playRef} type="button" className={css['btn-start']} onClick={() => goTo('rules')}>
              {labelButton ?? t.play}
            </button>
          </>
        ) : (
          <div className={`${css['init-message-box']} ${css.rules}`} role="group" aria-labelledby="fish-rules-title">
            <h2 id="fish-rules-title" ref={rulesRef} tabIndex={-1} className={css['rules-title']}>
              {t.rulesTitle}
            </h2>

            <ol className={css['rules-list']}>
              {t.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ol>

            <div className={css['init-actions']}>
              <button
                type="button"
                className={`${css['btn-start']} ${css['btn-start--ghost']}`}
                onClick={() => goTo('welcome')}
              >
                {t.back}
              </button>

              <Panel.Button section={section}>
                <button type="button" className={css['btn-start']}>
                  {t.start}
                </button>
              </Panel.Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
