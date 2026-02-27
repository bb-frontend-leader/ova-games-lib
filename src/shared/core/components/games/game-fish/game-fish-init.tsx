import { Panel as PanelUI } from 'books-ui';

import { BG } from './const';
import { GameParallax } from './game-parallax';

import css from './game-fish.module.css';

interface Props {
  labelButton?: string;
  labelInstruction?: string;
}

export const GameFishInit: React.FC<Props> = ({
  labelButton = 'Jugar',
  labelInstruction = 'Responde correctamente las preguntas.'
}) => {
  return (
    <div className={css['init-container']}>
      <GameParallax />
      <div className={css['init-content']}>
        <div className={css['init-message-box']}>
          <img src={BG.ancla} className={css['anchor-icon']} alt="" />
          <p className="u-text-center u-font-bold">{labelInstruction}</p>
          <img src={BG.ancla} className={css['anchor-icon']} alt="" />
        </div>
        <PanelUI.Button section={1}>
          <button className={css['btn-start']}>
            <p>{labelButton}</p>
          </button>
        </PanelUI.Button>
      </div>
    </div>
  );
};
