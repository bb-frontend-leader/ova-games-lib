import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { RanaIcon } from './rana-icons';

import type { Throw } from './types/types';

import css from './game-rana.module.css';

interface Props {
  shot: Throw;
  /** Era la última pregunta: el botón abre los resultados. */
  finishing: boolean;
  nextRef: React.Ref<HTMLButtonElement>;
  onNext: () => void;
}

/** Lo que pasó con la moneda: si entró, a qué hoyo, su probabilidad, los puntos y el botón para seguir. */
export const RanaResultCard: React.FC<Props> = ({ shot, finishing, nextRef, onNext }) => {
  const lang = useLang();
  const t = i18n[lang];
  const hole = t.holes[shot.hole];
  const title = shot.hit ? (shot.hole === 'rana' ? t.result.rana : t.result.hit) : t.result.miss;

  return (
    <section className={css.card} aria-labelledby="rana-result-title">
      <div className={css.verdict} data-ok={shot.hit ? '' : undefined} data-kind={shot.hit ? 'hit' : 'miss'}>
        <p id="rana-result-title" className={css['verdict-title']}>
          <RanaIcon name={shot.hit ? (shot.hole === 'rana' ? 'frog' : 'boom') : 'target'} />
          {title}
          {shot.points > 0 && <span className={css.points}>+{shot.points}</span>}
        </p>
        <p className={css['verdict-hint']}>
          {shot.hit ? t.result.hitHint(hole, shot.chance) : t.result.missHint(hole, shot.chance)}
        </p>
        {shot.hit && shot.hot && <p className={css['verdict-hint']}>{t.result.hotHint}</p>}
        {shot.hit && shot.combo > 1 && <p className={css['verdict-hint']}>{t.result.combo(shot.combo)}</p>}
      </div>

      <div className={css.actions}>
        <button ref={nextRef} type="button" className={css.btn} onClick={onNext}>
          {finishing ? t.results : t.nextQuestion}
        </button>
      </div>
    </section>
  );
};
