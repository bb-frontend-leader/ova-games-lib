import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { NavalIcon } from './naval-icons';

import type { Shot } from './types/types';

import css from './game-naval-battle.module.css';

interface Props {
  shot: Shot;
  /** Era la última pregunta y no quedan más disparos: el botón abre los resultados. */
  finishing: boolean;
  nextRef: React.Ref<HTMLButtonElement>;
  onNext: () => void;
}

/**
 * Lo que pasó con el disparo: agua, tocado o hundido, los puntos y el botón para seguir (otro disparo si tocaste,
 * si no la siguiente pregunta).
 */
export const NavalShotCard: React.FC<Props> = ({ shot, finishing, nextRef, onNext }) => {
  const lang = useLang();
  const t = i18n[lang];
  const miss = shot.kind === 'miss';
  const title = { miss: t.shot.miss, hit: t.shot.hit, sunk: t.shot.sunk(shot.size) }[shot.kind];

  return (
    <section className={css.card} aria-labelledby="naval-shot-title">
      <div className={css.verdict} data-ok={miss ? undefined : ''} data-kind={shot.kind}>
        <p id="naval-shot-title" className={css['verdict-title']}>
          <NavalIcon name={{ miss: 'drop', hit: 'flame', sunk: 'ship' }[shot.kind] as 'drop' | 'flame' | 'ship'} />
          {title}
          {shot.points > 0 && <span className={css.points}>+{shot.points}</span>}
        </p>
        {shot.fleet && <p className={css['verdict-hint']}>{t.shot.fleet}</p>}
        {shot.again && !shot.fleet && <p className={css['verdict-hint']}>{t.shot.again}</p>}
      </div>

      <div className={css.actions}>
        <button ref={nextRef} type="button" className={css.btn} onClick={onNext}>
          {shot.again ? t.again : finishing ? t.results : t.nextQuestion}
        </button>
      </div>
    </section>
  );
};
