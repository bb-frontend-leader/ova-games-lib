import { useLang } from '@/hooks';

import { i18n } from './lib/constant';
import { TejoIcon } from './tejo-icons';

import type { Throw } from './types/types';

import css from './game-tejo.module.css';

interface Props {
  shot: Throw;
  /** Era la última pregunta: el botón abre los resultados. */
  finishing: boolean;
  nextRef: React.Ref<HTMLButtonElement>;
  onNext: () => void;
}

/** Lo que pasó con el tejo: dónde cayó, cuántos puntos dio, a cuántos centímetros del bocín y el botón para seguir. */
export const TejoResultCard: React.FC<Props> = ({ shot, finishing, nextRef, onNext }) => {
  const lang = useLang();
  const t = i18n[lang];
  const miss = shot.kind === 'clay' || shot.kind === 'out';
  const hint = {
    monona: t.result.mononaHint(shot.cm),
    embocinada: t.result.embocinadaHint(shot.cm),
    mecha: t.result.mechaHint(shot.cm),
    mano: t.result.manoHint(shot.cm),
    clay: t.result.clayHint(shot.cm),
    out: t.result.outHint
  }[shot.kind];

  return (
    <section className={css.card} aria-labelledby="tejo-result-title">
      <div className={css.verdict} data-ok={miss ? undefined : ''} data-kind={miss ? 'miss' : shot.kind}>
        <p id="tejo-result-title" className={css['verdict-title']}>
          <TejoIcon name={miss ? 'target' : shot.kind === 'mecha' || shot.kind === 'monona' ? 'boom' : 'bocin'} />
          {t.result[shot.kind]}
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
