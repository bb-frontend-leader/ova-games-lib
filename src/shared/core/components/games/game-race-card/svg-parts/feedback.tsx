import { DRIVER_CHEER_UP, DRIVER_SAD } from './base64-images';

import css from '../svg-card.module.css';

interface FeedbackProps {
  isRight?: boolean;
}

export const Feedback: React.FC<FeedbackProps> = ({ isRight }) => {
  return isRight ? (
    <article className={css['card-final-feedback']}>
      <img alt="" src={DRIVER_CHEER_UP} className={css['card-final-feedback__image']} />
      <div className="u-flow">
        <div className={`${css['card-final-feedback__header']} ${css['card-final-feedback__header--success']}`}>
          <div>
            <p>Felicidades</p>
          </div>
        </div>

        <p className={css['card-final-feedback__text']}>¡Has ganado la carrera!</p>
      </div>
    </article>
  ) : (
    <article className={css['card-final-feedback']}>
      <img alt="" src={DRIVER_SAD} className={css['card-final-feedback__image']} />

      <div className="u-flow">
        <div className={`${css['card-final-feedback__header']} ${css['card-final-feedback__header--failure']}`}>
          <div>
            <p>Has perdido</p>
          </div>
        </div>
        <p className={css['card-final-feedback__text']}>Te han ganado la carrera</p>
      </div>
    </article>
  );
};
