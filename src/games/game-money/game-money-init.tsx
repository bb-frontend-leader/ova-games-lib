import { useEffect, useRef, useState } from 'react';
import { Panel as PanelUI } from 'books-ui';

import { useLang } from '@/hooks';

import { BACKGROUND, CHARACTER, i18n } from './lib/constant';

import css from './game-money.module.css';

interface GameMoneyInitProps {
  addClass?: string;
  /** Frase de bienvenida bajo el título */
  textInit?: string;
  title?: string;
}

// Destellos dorados alrededor del banquero (posición en % del héroe y desfase del parpadeo)
const SPARKLES = [
  { top: '14%', left: '8%', delay: '0s' },
  { top: '30%', left: '88%', delay: '0.6s' },
  { top: '62%', left: '4%', delay: '1.1s' },
  { top: '70%', left: '94%', delay: '0.3s' }
] as const;

const safeSrc = (rawSrc: string): string => rawSrc.replace(/\s/g, ''); // Elimina espacios en blanco accidentales

/**
 * Pantalla de inicio: el banquero abraza su bolsa frente a la caja fuerte. «Jugar» abre las reglas y
 * «¡A la caja fuerte!» pasa a la sección siguiente del panel, donde está el juego.
 */
export const GameMoneyInit: React.FC<GameMoneyInitProps> = ({ addClass, textInit, title }) => {
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
    <div
      className={`${css.init} ${addClass ?? ''}`}
      style={{ '--bg-image': `url("${safeSrc(BACKGROUND)}")` } as React.CSSProperties}
    >
      {step === 'welcome' ? (
        <div className={css['init-welcome']}>
          <h2 className={css['init-title']}>{title ?? t.title}</h2>

          {/* Decorativo: el banquero y sus destellos */}
          <div className={css['init-hero']} aria-hidden="true">
            <img src={safeSrc(CHARACTER.normal)} alt="" className={css['init-banker']} />
            {SPARKLES.map(({ top, left, delay }) => (
              <span key={`${top}-${left}`} className={css.sparkle} style={{ top, left, animationDelay: delay }} />
            ))}
          </div>

          {textInit && <p className={`${css['question-text']} ${css['init-text']}`}>{textInit}</p>}

          <button ref={playRef} type="button" className={css['gold-button']} onClick={() => goTo('rules')}>
            {t.play}
          </button>
        </div>
      ) : (
        <div className={css.rules} role="group" aria-labelledby="money-rules-title">
          <h2 id="money-rules-title" ref={rulesRef} tabIndex={-1} className={css['rules-title']}>
            {t.rulesTitle}
          </h2>

          <ol className={css['rules-list']}>
            {t.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ol>

          <div className={css['rules-actions']}>
            <button
              type="button"
              className={`${css['gold-button']} ${css['gold-button--ghost']}`}
              onClick={() => goTo('welcome')}
            >
              {t.back}
            </button>

            <PanelUI.Button section={1}>
              <button type="button" className={css['gold-button']}>
                {t.start}
              </button>
            </PanelUI.Button>
          </div>
        </div>
      )}
    </div>
  );
};
