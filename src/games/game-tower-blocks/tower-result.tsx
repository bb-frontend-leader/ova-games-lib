import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { TowerIcon } from './tower-icons';

import type { Drop } from './types/types';

import css from './game-tower-blocks.module.css';

interface Props {
  drop: Drop;
  /** Era la última pregunta: el botón abre los resultados. */
  finishing: boolean;
  nextRef: React.Ref<HTMLButtonElement>;
  onNext: () => void;
}

/**
 * Lo que pasó con el bloque: encajó justo, sobresalió o cayó fuera, los puntos y el botón para seguir.
 */
export const TowerResultCard: React.FC<Props> = ({ drop, finishing, nextRef, onNext }) => {
  const lang = useLang();
  const t = i18n[lang];
  const title = { perfect: t.result.perfect, partial: t.result.partial(drop.cut), miss: t.result.miss }[drop.kind];

  return (
    <section className={css.card} aria-labelledby="tower-result-title">
      <div className={css.verdict} data-ok={drop.kind === 'miss' ? undefined : ''} data-kind={drop.kind}>
        <p id="tower-result-title" className={css['verdict-title']}>
          <TowerIcon name={drop.kind === 'miss' ? 'cross' : drop.kind === 'perfect' ? 'star' : 'block'} />
          {title}
          {drop.points > 0 && <span className={css.points}>+{drop.points}</span>}
        </p>
        {drop.kind === 'perfect' && drop.combo > 1 && (
          <p className={css['verdict-hint']}>{t.result.combo(drop.combo)}</p>
        )}
        {drop.grew && <p className={css['verdict-hint']}>{t.result.grew}</p>}
      </div>

      <div className={css.actions}>
        <button ref={nextRef} type="button" className={css.btn} onClick={onNext}>
          {finishing ? t.results : t.nextQuestion}
        </button>
      </div>
    </section>
  );
};
