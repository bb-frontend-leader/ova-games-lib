import { useLang } from '@/hooks';

import { ALT_STEP, i18n } from './lib/constant';
import { MountainIcon } from './mountain-icons';

import type { Arrival, Fall } from './types/types';

import css from './game-mountain-climb.module.css';

interface Props {
  /** Qué pasó: se llegó a un campamento o a la cumbre, o se cayó (o se descansó) hasta uno. */
  arrival: Arrival | null;
  fall: Fall | null;
  nextRef: React.Ref<HTMLButtonElement>;
  onNext: () => void;
}

/**
 * Parada en el camino: el campamento o la cumbre a los que se llegó, o la caída hasta el último campamento. Dice qué
 * se gana o se pierde y trae el botón para seguir.
 */
export const MountainResultCard: React.FC<Props> = ({ arrival, fall, nextRef, onNext }) => {
  const lang = useLang();
  const t = i18n[lang];

  if (!arrival && !fall) return null;

  const summit = arrival?.kind === 'summit';
  const rested = !!fall && fall.lost === 0;
  const good = !!arrival || rested;

  const title = arrival ? (summit ? t.summit : t.camp(arrival.n)) : rested ? t.rested : t.fell;
  const text = arrival
    ? summit
      ? t.summitText
      : t.campText
    : rested
      ? t.restedText
      : t.fellText(fall!.lost, fall!.to * ALT_STEP);
  const icon = summit ? 'flag' : arrival ? 'tent' : rested ? 'bolt' : 'cross';

  return (
    <section className={css.card} aria-labelledby="mountain-result-title">
      <div className={css.verdict} data-ok={good ? '' : undefined} data-kind={arrival ? arrival.kind : 'fall'}>
        <p id="mountain-result-title" className={css['verdict-title']}>
          <MountainIcon name={icon} />
          {title}
          {arrival && <span className={css.points}>+{arrival.points}</span>}
        </p>
        <p className={css['verdict-hint']}>{text}</p>
        {arrival && <p className={css['verdict-hint']}>{t.bonus(arrival.points)}</p>}
      </div>

      <div className={css.actions}>
        <button ref={nextRef} type="button" className={css.btn} onClick={onNext}>
          {summit ? t.results : fall ? t.keepGoing : t.next}
        </button>
      </div>
    </section>
  );
};
