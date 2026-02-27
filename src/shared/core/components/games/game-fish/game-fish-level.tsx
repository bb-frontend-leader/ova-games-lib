import { ReactNode } from 'react';

import { BG } from './const';
import { useGameFishActivityContext } from './game-fish-context';
import { GameParallax } from './game-parallax';

import css from './game-fish.module.css';

interface Props {
  children: ReactNode;
  label: string;
}

export const GameFishLevel = ({ children, label }: Props) => {
  const { selectedLabel } = useGameFishActivityContext();
  const renderQuestion = () => {
    // Si la etiqueta no contiene el marcador de completar, se muestra normal
    if (!label.includes('___')) return <strong>{label}</strong>;

    const parts = label.split('___');
    return (
      <strong>
        {parts[0]}
        <span className={css['fill-blank']}>{selectedLabel || '____'}</span>
        {parts[1]}
      </strong>
    );
  };

  return (
    <div className={css['init-container']}>
      <GameParallax />
      <div className={css['init-content']}>
        <div className={css['init-message-box']}>
          <img src={BG.ancla} className={css['anchor-icon']} alt="" />
          <div className={css['question-text']}>{renderQuestion()}</div>
          <img src={BG.ancla} className={css['anchor-icon']} alt="" />
        </div>
        <div className={css['fish-elements-wrapper']}>{children}</div>
      </div>
    </div>
  );
};
