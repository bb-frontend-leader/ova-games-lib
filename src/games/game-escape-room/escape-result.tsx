import { useLang } from '@/hooks';

import { EscapeIcon } from './escape-icons';
import { i18n } from './lib/constant';

import css from './game-escape-room.module.css';

interface Props {
  /** Puntos de abrir la puerta. */
  points: number;
  /** Era la última sala: el botón abre los resultados. */
  finishing: boolean;
  nextRef: React.Ref<HTMLButtonElement>;
  onNext: () => void;
}

/**
 * La puerta se abrió: el código era correcto. El botón pasa a la siguiente sala o a los resultados.
 */
export const EscapeResultCard: React.FC<Props> = ({ points, finishing, nextRef, onNext }) => {
  const lang = useLang();
  const t = i18n[lang];

  return (
    <section className={css.card} aria-labelledby="escape-result-title">
      <div className={css.verdict} data-ok="">
        <p id="escape-result-title" className={css['verdict-title']}>
          <EscapeIcon name="unlock" />
          {t.result.title}
          {points > 0 && <span className={css.points}>+{points}</span>}
        </p>
        <p className={css['verdict-hint']}>{t.result.text}</p>
      </div>

      <div className={css.actions}>
        <button ref={nextRef} type="button" className={css.btn} onClick={onNext}>
          {finishing ? t.results : t.nextRoom}
        </button>
      </div>
    </section>
  );
};
