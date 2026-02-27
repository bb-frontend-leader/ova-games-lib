import { BACKGROUND } from './const';

import css from './this-or-that.module.css';

interface GameThisOrThatLevelProps {
  children: React.ReactNode;
  addClass?: string;
  backgroundImage?: string;
  questionNumber?: number;
  question: string;
}

export const GameThisOrThatLevel: React.FC<GameThisOrThatLevelProps> = ({
  children,
  addClass,
  backgroundImage,
  questionNumber,
  question,
  ...props
}) => {
  const safeSrc = (rawSrc: string): string => rawSrc.replace(/\s/g, ''); // Elimina espacios en blanco accidentales
  const bg = backgroundImage ? backgroundImage : safeSrc(BACKGROUND); // Fondo de pantalla

  return (
    <div
      className={`${css['container-element']} ${addClass ? addClass : ''}`}
      style={{ '--bg-image': `url("${bg}")` } as React.CSSProperties}
      {...props}>
      <div data-id="card" role="group" aria-labelledby="question" className={css['card-element']}>
        <div className={css['number-question-container']}>
          {questionNumber && <p className={css['number-question']}>{questionNumber}</p>}
        </div>
        <div className={`${css['question']}`} data-id="question">
          <p className="u-font-bold u-text-center" dangerouslySetInnerHTML={{ __html: question }} />
        </div>
        <div className={css['container-options']} data-id="options" role="radiogroup" aria-labelledby="question">
          {children}
        </div>
      </div>
    </div>
  );
};
