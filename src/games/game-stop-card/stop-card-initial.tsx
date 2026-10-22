import { useEffect, useRef, useState } from 'react';

import { Panel } from '@/components/ui';
import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { StopCardMap } from './stop-card-map';

import css from './stop-card.module.css';

interface Props {
  /** Frase de bienvenida bajo el título. */
  textInitial?: string;
  /** Sección del panel a la que lleva «¡Al camino!» (por defecto la siguiente, donde está la primera parada). */
  section?: number;
  title?: string;
  /** Texto del botón de la bienvenida (el que abre las reglas). */
  labelButton?: string;
}

/**
 * Pantalla de inicio: el mapa con el viajero en la salida, el título y la frase de bienvenida; el botón abre las
 * reglas. «¡Al camino!» pasa a la sección indicada del panel (la primera parada).
 */
export const StopCardInitial = ({ textInitial, section = 1, title, labelButton }: Props) => {
  const lang = useLang();
  const t = i18n[lang];

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
    <div className={css.init}>
      <div className={css['init-map']} aria-hidden="true">
        <StopCardMap count={0} currentStop={0} finished={false} travelerT={0} decorative />
      </div>

      <div className={css['init-card']}>
        {step === 'welcome' ? (
          <>
            <h2 className={css['init-title']}>{title ?? t.init.title}</h2>
            {textInitial && <p className={css['init-text']}>{textInitial}</p>}

            <button ref={playRef} type="button" className={css['init-button']} onClick={() => goTo('rules')}>
              {labelButton ?? t['start-button']}
            </button>
          </>
        ) : (
          <div role="group" aria-labelledby="stop-rules-title">
            <h2 id="stop-rules-title" ref={rulesRef} tabIndex={-1} className={css['init-title']}>
              {t.init.rulesTitle}
            </h2>

            <ol className={css['init-rules']}>
              {t.init.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ol>

            <div className={css['init-actions']}>
              <button
                type="button"
                className={`${css['init-button']} ${css['init-button--ghost']}`}
                onClick={() => goTo('welcome')}
              >
                {t.init.back}
              </button>

              <Panel.Button section={section}>
                <button type="button" className={css['init-button']}>
                  {t.init.start}
                </button>
              </Panel.Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
