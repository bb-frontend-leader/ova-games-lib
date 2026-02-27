import { ReactNode } from 'react';

import { BG } from './const';
import { useGameCasinoProvider } from './game-casino-context';

import css from './game-casino.module.css';

interface Props {
  children: ReactNode;
  label: string; // La pregunta
  background?: string;
}

export const GameCasinoLevel = ({ children, label, background = BG.background }: Props) => {
  const { point } = useGameCasinoProvider();

  return (
    <div className={`${css.casino}`} style={{ '--casino-bg': `url(${background})` } as React.CSSProperties}>
      <div className={css['casino-point']}>
        <span>${point}</span>
      </div>
      <div className={css['casino-question']}>
        <div className={css['casino-questino-background']}>
          {point < 10 ? <p className="u-text-center">Fichas insuficientes. Presiona Reiniciar.</p> : <p>{label}</p>}
        </div>
      </div>
      <div className={css['casino-elements-wrapper']}>{children}</div>
    </div>
  );
};
