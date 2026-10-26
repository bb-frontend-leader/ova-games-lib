import { useLang } from '@/hooks';

import { CatapultIcon } from './catapult-icons';
import { i18n } from './lib/constant';

import type { Shot } from './types/types';

import css from './game-catapult.module.css';

interface Props {
  shot: Shot;
  /** Era la última pregunta: el botón abre los resultados. */
  finishing: boolean;
  nextRef: React.Ref<HTMLButtonElement>;
  onNext: () => void;
}

/**
 * Lo que pasó con el disparo: derribó la torre (o dio en el centro) o falló, cuánto se quedó corto o se pasó, los
 * puntos y el botón para seguir.
 */
export const CatapultResultCard: React.FC<Props> = ({ shot, finishing, nextRef, onNext }) => {
  const lang = useLang();
  const t = i18n[lang];
  const miss = shot.kind === 'short' || shot.kind === 'long';
  const meters = Math.round(Math.abs(shot.delta));
  const title = {
    direct: t.result.direct,
    hit: t.result.hit,
    short: t.result.short(meters),
    long: t.result.long(meters)
  }[shot.kind];
  const hint = miss ? (shot.kind === 'short' ? t.result.shortHint : t.result.longHint) : t.result.hitHint(meters);

  return (
    <section className={css.card} aria-labelledby="catapult-result-title">
      <div className={css.verdict} data-ok={miss ? undefined : ''} data-kind={miss ? 'miss' : shot.kind}>
        <p id="catapult-result-title" className={css['verdict-title']}>
          <CatapultIcon name={miss ? 'target' : shot.kind === 'direct' ? 'star' : 'tower'} />
          {title}
          {shot.points > 0 && <span className={css.points}>+{shot.points}</span>}
        </p>
        <p className={css['verdict-hint']}>{hint}</p>
        {!miss && shot.combo > 1 && <p className={css['verdict-hint']}>{t.result.combo(shot.combo)}</p>}
      </div>

      <div className={css.actions}>
        <button ref={nextRef} type="button" className={css.btn} onClick={onNext}>
          {finishing ? t.results : t.nextQuestion}
        </button>
      </div>
    </section>
  );
};
